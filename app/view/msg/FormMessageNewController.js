Ext.define('Thot.view.msg.FormMessageNewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.msg-formmessagenew',

    /**
     * @author  : Hervé Valot
     * @date    : 2019-06-26
     * @description : actions après le rendu du formulaire
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        var oUserWriterCombo = oForm.query('#comboUsrWriter')[0];
        var oUserWriterStore = oUserWriterCombo.getStore();

        var oUserDestCombo = oForm.query('#comboUsrDest')[0];
        var oUserDestStore = oUserDestCombo.getStore();

        var oMessageObjetCombo = oForm.query('#comboMsgObjet')[0];
        var oMessageObjetStore = oMessageObjetCombo.getStore();

        // lecture de la chaine des id des sections supervisées dans le localStorage
        // oMe.currentSection = Thot.app.getSection();
        // mise à jour du filtre du store des utilisateurs (rédacteurs)
        var aFilter = [{
            type: 'sab_id',
            value: Thot.app.getSection().idsection
        }];
        oUserWriterStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        // remplissage de la combo utisateurs rédacteur
        oUserWriterStore.load();

        // remplissage de la combo des destinataires
        oUserDestStore.load();

        // remplissage de la combe des objets
        oMessageObjetStore.load();

        // on vérifie si le paramètre msg_id a été passé, auquel cas on est en mode édition
        // et il faut charger les données de la note à éditer
        if (parseInt(oForm.param.idenreg) > 0) {
            // le msg_id est différent de 0, on est en mode édition
            oMe.loadFormData(oForm.param.idenreg);
        }
    },
    /**
     * @author : Hervé Valot
     * @date   : 2019/06/26
     *
     * @description fermeture du formulaire sur validation et création de l'enregistrement
     *
     * @version 20190626 HVT Création
     */
    onValidClick: function () {
        var oForm = this.getView();

        if (parseInt(oForm.param.idenreg) > 0) {
            // on est en mode édition, déclancher la mise à jour
            this.updateNoteData();
        } else {
            // on est en mode création, déclencher l'enregistrement
            this.saveNoteData();
        }
    },
    /**
     * @author : Hervé Valot
     * @date   : 2019/06/25
     *
     * @description fermeture du formulaire sur annulation
     *
     * @version 20190626 HT Création
     */
    onCancelClick: function () {
        var oForm = this.getView();
        var oWin = oForm.up('window');
        oWin.close();
    },
    /**
     * @author  : Hervé Valot
     * @date    : 20190703
     * @description : enregistre les données d'une nouvelle note
     */
    saveNoteData: function () {
        var oForm = this.getView();
        var oWin = oForm.up('window');
        // lancer la requête AJAX pour enregistrer la note
        Ext.Ajax.request({
            url: 'server/msg/Message.php',
            // définition des paramètres de la requête
            params: {
                appName: Thot.app.appConfig.name,
                action: 'SaveNote',
                rsc_id_redacteur: oForm.query('#comboUsrWriter')[0].getValue(),
                mso_id: oForm.query('#comboMsgObjet')[0].getValue(),
                msg_titre: oForm.query('#messageTitre')[0].getValue(),
                msg_texte: oForm.query('#messageTexte')[0].getValue(),
                rsc_id_destinataire: oForm.query('#comboUsrDest')[0].getValue()
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var oMain = Thot.app.viewport;
                if (oBack.success) {
                    // message WebSocket pour déclenchement mise à jour des clients
                    oMain.fireEvent('send', 'maj', oForm.xtype, ['messagelist']);
                    // notification pour informer les clients de la création d'une nouvelle
                    oMain.fireEvent('send', 'notification', oForm.xtype, ['Une nouvelle note vient d\'être postée'])
                    // on ferme le formulaire
                    oWin.close();
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', 'Impossible d\'enregistrer la note !');
                }
            }
        });
    },
    /**
     * @author  : Hervé Valot
     * @date    : 20190703
     * @description : mise à jour des données d'une note en mode édition
     */
    updateNoteData: function () {
        var oForm = this.getView();
        var oWin = oForm.up('window');
        // lancer la requête AJAX pour mettre à jour la note
        Ext.Ajax.request({
            url: 'server/msg/Message.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'UpdateNoteData',
                msg_id: oForm.param.idenreg,
                rsc_id_redacteur: oForm.query('#comboUsrWriter')[0].getValue(),
                mso_id: oForm.query('#comboMsgObjet')[0].getValue(),
                msg_titre: oForm.query('#messageTitre')[0].getValue(),
                msg_texte: oForm.query('#messageTexte')[0].getValue(),
                rsc_id_destinataire: oForm.query('#comboUsrDest')[0].getValue()
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var oMain = Thot.app.viewport;
                if (oBack.success) {
                    oMain.fireEvent('send', 'maj', oForm.xtype, ['messagelist']);
                    // on ferme le formulaire
                    oWin.close();
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', 'Impossible d\'enregistrer les modifications de la note !');
                }
            }
        });
    },
    /**
     * @author  : HVT
     * @date    : 20190702
     * @description : charge les données depuis la base vers le formulaire
     *                lorsque celui-ci est en mode édition
     *
     * @param {*} id : identifiant de la note à charger depuis la base
     */
    loadFormData: function (id) {
        // identification des champs de formulaire à mettre à jour
        var oMe = this,
            oForm = this.getView(),
            oUserAutorCombo = oForm.query('#comboUsrWriter')[0],
            oUserAttnCombo = oForm.query('#comboUsrDest')[0],
            oObjectCombo = oForm.query('#comboMsgObjet')[0],
            oTitleField = oForm.query('#messageTitre')[0],
            oTextField = oForm.query('#messageTexte')[0];

        // appel AJAX pour récupérer les données
        Ext.Ajax.request({
            url: 'server/msg/Message.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'GetNoteDataById',
                msg_id: id
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                if (oBack.success) {
                    // mise à jur des champs de formulaire
                    oUserAutorCombo.setValue(oBack.liste[0].rsc_id_redacteur);
                    oUserAttnCombo.setValue(oBack.liste[0].rsc_id_destinataire);
                    oObjectCombo.setValue(oBack.liste[0].mso_id);
                    oTitleField.setValue(oBack.liste[0].msg_titre);
                    oTextField.setValue(oBack.liste[0].msg_texte);
                }
            }
        });
    },
});