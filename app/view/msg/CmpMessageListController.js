Ext.define('Thot.view.msg.CmpMessageListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.msg-cmpmessagelist',

    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        var oGridNotes = oForm.query('#gridnoteslist')[0];
        var oGridNotesStore = oGridNotes.getStore();
        //charger la grille des notes
        oGridNotesStore.load();
    },


    /**
     * @author : edblv
     * date   : 20/10/17 15:25
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Déclenchée par l'événement 'gridRefresh' (lui même déclenché par WebSocket)
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onGridRefresh: function (aFilter) {
        var oMe = this;
        var oForm = this.getView();
        var oGridNotes = oForm.query('#gridnoteslist')[0];
        var oGridNotesStore = oGridNotes.getStore();
        // Création du filtre avec comme valeur les sections sélectionner
        aFilter = [{
            type: 'idsection',
            value: Thot.app.getSection().idsection
        }];

        // mise à jour du store des Notes
        oGridNotesStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        // Recharge du store
        oGridNotesStore.reload();
    },
    /**
     * @author  : hvt
     * @date    : 20190702
     * @description : déclenche l'ouverture du formulaire créer/éditer note en mode édition
     *
     * @param {*} grid : la grille dans laquelle la sélection a été faite
     * @param {*} rowIndex : le numéro de la ligne sélectionnée
     * @param {*} colIndex : le numéro de la colonne sélectionnée
     */
    onNoteEditClick: function (grid, rowIndex, colIndex) {
        // récupère le msg_id de la ligne sur laquelle l'utilisateur à cliqué
        var msg_id = grid.getStore().getAt(rowIndex).get('msg_id');

        // déclenche l'ouverture du formulaire en lui passant l'id du message (msg_id)
        var oForm = this.getView();
        var oMain = oForm.up('app-main');
        var oWin = Thot.app.openWidget('noteedit', {
            title: 'Edition de la note',
            alias: 'noteedit',
            modal: true,
            resizable: true,
            height: 600,
            width: 850,
            param: {
                // passe le msg_id au formulaire qui l'analysera pour charger les données du message
                recordId: msg_id
            }
        });
        oWin.on({
            'destroy': function () {
                oMain.fireEvent('listsrefresh');
            }
        });
    },
    /**
     * @author  : HVT
     * @date    : 20190702
     * @description: mise à jour du statut de lecture (prise en compte) de la note
     */
    onSetNoteReadenClick: function (grid, rowIndex, colIndex) {
        // mise à jour du statut de prise en compte
        // lancer la requête AJAX pour mettre à jour la note
        Ext.Ajax.request({
            url: 'server/msg/Message.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'SetNoteReaden',
                msg_id: grid.getStore().getAt(rowIndex).get('msg_id')
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var oMain = Thot.app.viewport;
                if (oBack.success) {
                    // mise à jour de la grille
                    grid.getStore().reload();
                    // message websocket pour mise à jour des autres clients
                    oMain.fireEvent('send', 'maj', oMain.xtype, ['messagelist']);
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", "Impossible de marquer la note prise en compte !");
                }
            }
        });
    },
});