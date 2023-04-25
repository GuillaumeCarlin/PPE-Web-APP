Ext.define('Thot.view.sch.CmpSearchController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sch-cmpsearch',
    adminFunctionAllowed: false,
    /**
     * @author : edblv
     * date   : 17/10/17 09:49
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * After render du formulaire
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();

        /* création des interceptions de touhes */
        oForm.keyNav = Ext.create('Ext.util.KeyNav', oForm.el, {
            /** intercepte la touche entrée */
            enter: function () {
                oMe.onValidClick();
            },
            scope: this
        });


    },

    /**
     * @author Hervé Valot
     * @description vérifie les autorisations de l'utilisateur connecté (si il y en a un) et affiche les objets sécurisé de l'interface utilisateur
     * @date 20200917
     */
    checkAuth: function () {
        /* vérification des autorisation utilisateur pour affichage des outils d'administration des OF */
        var oForm = this.getView(),
            // objets de l'interface soumis à autorisation
            obtnDeleteOf = oForm.query('#btnDeleteOf')[0],
            // permission de l'utilisateur courant sur le formulaire et ses objets contrôlés
            bPermission = Thot.com.util.Acl.isUserAllowed(oForm.itemId);

        // application des autorisations aux objets contrôlés
        obtnDeleteOf.setVisible(bPermission);
        this.adminFunctionAllowed = bPermission;

        // placer le focus sur le champ de recherche
        var oSearchField = oForm.query('#noof')[0];
        oSearchField.focus(true);
    },

    /**
     * @author : edblv
     * date   : 17/10/17 09:49
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Déclenchée à chaque appui de touche sur le champ N° OF
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onPickerValueChange: function (oField, sValue, sOldValue) {
        var oPicker = oField.getPicker();
        oPicker.validField(oField, sValue, sOldValue);
    },

    /**
     * @author : edblv
     * date   : 17/10/17 09:49
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Déclenchée sur touche 'Enter' ou clic sur 'Rechercher'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onValidClick: function () {
        var oMe = this,
            oForm = oMe.getView(),
            oDetail = oForm.query('#ofdetail')[0],
            oNumOf = oForm.query('#noof')[0],
            oOpnStore = oForm.query('#operations')[0].getStore();

        /* vider les données des stores avant de déclencher la recherche */
        oForm.query('#operations')[0].getStore().removeAll();
        oForm.query('#activites')[0].getStore().removeAll();
        oForm.query('#consolidation')[0].getStore().removeAll();
        /* effacer les valeurs courantes du formulaire */
        oDetail.query('#odf_code')[0].setValue(null);
        // oDetail.query('#odf_date_creation')[0].setValue(null);
        // oDetail.query('#odf_quantiteattendue')[0].setValue(null);
        oDetail.query('#odf_quantite_lancee')[0].setValue(null);
        oDetail.query('#pdt_libelle')[0].setValue(null);
        oDetail.query('#gam_libelle')[0].setValue(null);
        // oDetail.query('#odf_esttermine')[0].setValue(null);

        oDetail.fireEvent('loadDetail', oNumOf.getValue());

        /* comptabilisation des objets du store en vue de potentielle suppression */
        oOpnStore.on({
            load: function (_oStore, aRecords) {
                var iTotal = 0,
                    iDeletable = 0,
                    oBtnDeleteOF = oForm.query('#btnDeleteOf')[0];

                iTotal = oOpnStore.count();
                for (var iRec in aRecords) {
                    switch (aRecords[iRec].get('etatopn')) {
                        case 'AF': // a faire, pas commencée, on peut la supprimer
                            iDeletable++;
                            break;
                        case 'NR': // non réalisée (déclaration volontaire), on peut la supprimer mais il faudra supprimer la trace de "non réalisation"
                            iDeletable++;
                            break;
                    }
                }

                // mise à jour du libellé du bouton de suppression des of
                if (iTotal == iDeletable) {
                    // on peut supprimer toutes les opérations, on pourra supprimer l'OF
                    oBtnDeleteOF.setText('Supprimer l\'OF');
                    oBtnDeleteOF.setTooltip('Toutes les opérations sont supprimables (AF/NR)</br>L\'OF sera entièrement supprimé.');
                    oBtnDeleteOF.setDisabled(false);
                } else {
                    if (iDeletable !== 0) {
                        // on ne pourra supprimer qu'une partie des opérations, l'of sera conservé
                        oBtnDeleteOF.setText('Supprimer ' + iDeletable + ' opérations sur ' + iTotal);
                        oBtnDeleteOF.setTooltip('Certaines opérations ne sont pas supprimables (EC/TE)</br>L\'OF sera conservé.');
                        oBtnDeleteOF.setDisabled(false);
                    } else {
                        // aucune opération supprimable, toutes à EC ou TE
                        oBtnDeleteOF.setText('Supprimer l\'OF');
                        oBtnDeleteOF.setDisabled(true);
                    }
                }
            }
        });
    },

    /**
     * @author Hervé Valot
     * @description actions sur sélection d'une ligne dans la grille des opérations
     * @date 20200820
     * @param {*} _oGrid la grille des opérations
     * @param {*} oRecord l'enregistrement sélectionné
     * @param {*} _eOpts options supplémentaires
     */
    onOperationClick: function (_oGrid, oRecord, _eOpts) {
        var oForm = this.getView(),
            oGridActivities = oForm.query('#activites')[0],
            oGridActivitiesCsl = oForm.query('#consolidation')[0],
            sEtatOpn = '';

        // actualisation du container Opérations avec les informations de l'opération en cours
        // transformation du code état OP en user friendly !
        switch (oRecord.data.etatopn) {
            case 'TE':
                sEtatOpn = 'Terminé';
                break;
            case 'EC':
                sEtatOpn = 'En cours';
                break;
            case 'AF':
                sEtatOpn = 'A faire';
                break;
            case 'CO':
                sEtatOpn = 'Commencé';
                break;
        }
        oForm.query('#dfop')[0].setValue(oRecord.data.opn_code);
        oForm.query('#dfetat')[0].setValue(sEtatOpn);
        oForm.query('#dfposte')[0].setValue(oRecord.data.pst_libelle);
        oForm.query('#dfatelier')[0].setValue(oRecord.data.org_libelle);
        oForm.query('#dfequipement')[0].setValue(oRecord.data.rsc_code_theo);
        // oForm.query('#dfdebutplanifie')[0].setValue(new Date(oRecord.data.opn_date_debutplanifie).toLocaleString('fr-FR'));
        // oForm.query('#dffinplanifiee')[0].setValue(new Date(oRecord.data.opn_date_finplanifie).toLocaleString('fr-FR'));
        oForm.query('#dfdebutreel')[0].setValue(oRecord.data.opn_date_debutreel != undefined ? new Date(oRecord.data.opn_date_debutreel).toLocaleString('fr-FR') : '');
        oForm.query('#dffinreelle')[0].setValue(oRecord.data.opn_date_finreel != undefined ? new Date(oRecord.data.opn_date_finreel).toLocaleString('fr-FR') : '');

        // mise à jour de la grille des activités relatives à l'opération
        // préparation du filtre à appliquer au store pour lister les activités de l'opération 
        var aFilter = [{
            type: 'opn_id',
            value: oRecord.data.opn_id
        }];

        // application du filtre au store
        oGridActivities.getStore().setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        // vider et recharger le store
        oGridActivities.getStore().removeAll();
        oGridActivities.getStore().load();

        // mise à jour de la grille des activités consolidées relatives à l'opération
        // préparation du filtre à appliquer au store pour lister les activités de l'opération 
        var aFilterCsl = [{
            type: 'opn_id',
            value: oRecord.data.opn_id
        }];

        // application du filtre au store
        oGridActivitiesCsl.getStore().setExtraParams({
            storefilters: {
                specfilter: aFilterCsl
            }
        });
        // vider et recharger le store
        oGridActivitiesCsl.getStore().removeAll();
        oGridActivitiesCsl.getStore().load();

    },

    /**
     * @author Hervé Valot
     * @description déclenche la suppression de l'of affiché
     * @date 20200917
     */
    onDeleteOfClick: function () {
        var oMe = this,
            oForm = this.getView(),
            numOf = oForm.query('#noof')[0].getValue(),
            idOf = oForm.query('#ofdetail')[0].query('#odf_id')[0].value;

        if (numOf == '') {
            var oMsg = Thot.app.MessageInfo();
            oMsg.init(5000);
            oMsg.msg('error', 'Veuillez sélectionner un OF et afficher ses informations !');
            return;
        }

        // demander confirmation
        Ext.MessageBox.alert({
            title: 'Supprimer l\'OF',
            message: 'Les informations supprimables (Opérations, OF) vont être définitivement supprimées</br>Veuillez confirmer !',
            buttonText: {
                ok: 'Confirmer',
                cancel: 'Annuler'
            },
            icon: Ext.Msg.WARNING,
            closable: false,
            fn: function (btn) {
                if (btn === 'ok') { // l'opérateur a confirmé
                    // afficher le masque du formulaire, éviter de cliquer sur un autre bouton
                    oForm.mask();

                    // déclencher la requête AJAX
                    Ext.Ajax.request({
                        url: 'server/ope/Operations.php',
                        // déclaration des paramètres à passer au backend
                        params: {
                            appName: Thot.app.appConfig.name,
                            action: 'deleteOpn',
                            odf_id: idOf // OF à supprimer
                        },
                        success: function () {},
                        failure: function () {},
                        callback: function (_opt, _success, oResponse) {
                            var oBack = Ext.decode(oResponse.responseText),
                                oMsg = Thot.app.MessageInfo();

                            if (oBack.success) {
                                oMsg.init(5000);
                                oMsg.msg('info', 'Informations supprimées');

                                /* déclencher l'actualisation du formulaire */
                                oMe.onValidClick();

                            } else {
                                oMsg.init(5000);
                                oMsg.msg('error', 'Impossible de supprimer l\'OF');

                            }
                            // on retire le masque "patientez"
                            oForm.unmask();
                        }
                    });
                }
            }
        });
    },


    onGridRightClick: function (grid, record, _item, _i, e) {
        if (!this.adminFunctionAllowed) { // si le formulaire est sécurisé, pas d'utilisateur ayant les droits suffisants connecté
            return;
        }
        // empêche l'affichage du menu contextuel du navigateur
        e.preventDefault();
        var menuItems = []; // tableau pour stocker les options du menu
        // création du menu
        var menu = new Ext.menu.Menu({
            plain: true,
            floating: true,
            renderTo: Ext.getBody(),
            // configuration spécifique
            ownerGrid: grid, // on passe la grille parente dans la config du menu 
            record: record, // on passe l'enrgistrement à l'origine du click droit
            userId: Thot.app.contexte.userId, // on passe l'identifiant de l'opérateur connecté
            //------------------------------
            listeners: {
                click: this.onContextMenuClick
            },
            items: [
                // définition du titre
                '<b style="padding: 8px;">Opération ' + record.data.opn_code + '</b>'
            ]
        });
        // création des options de menu
        switch (record.data.etatopn) {
            case 'AF': // à faire
                // on propose de supprimer l'opération seule
                menuItems.push('Supprimer');
                // on propose de marquer l'opération non réalisée
                menuItems.push('Non réalisée');
                break;
            case 'CO': // commencée
                // on propose de terminer l'opération, l'opérateur a pu oublier de la terminer
                menuItems.push('Terminer');
                break;
            case 'TE': // terminée
                // on propose de revenir à l'état commencée, l'opérateur a pu se tromper en terminant son activité
                menuItems.push('Revenir à "commencé"');
                break;
            case 'NR': // non réalisée
                // on propose de réactiver l'opération, passer à non commencée, les informations de marquage "non réalisé" seront perdues
                menuItems.push('Revenir à "à faire"');
                break;
        }
        // ajout des options au menu
        menuItems.forEach(element => {
            menu.add({
                text: element
            });
        });
        // menu.record = record;
        // menu.userId = Thot.app.contexte.userId;

        // affichage du menu
        menu.showAt(e.getXY());
    },

    onContextMenuClick: function (menu, item) {
        // il faut récupérer l'id de l'opération sélectionnée dans la grille
        // on récupère la commande cliquée dans le menu
        var sState; // code de l'état visé

        // définir l'action en fonction de l'option de menu sélectionnée
        switch (item.text) {
            case 'Supprimer':
                sState = 'DL';
                // il faut déclencher la suppression de l'opération par son identifiant (this.record.data.opn_id)
                break;
            case 'Non réalisée':
                sState = 'NR';
                // il faut déclencher le marqueur "non réalisée" sur l'opération par son identifiant, il faut aussi l'id de l'opérateur connecté
                break;
            case 'Terminer':
                sState = 'TE';
                // il faut mettre à jour la date de fin de l'opération
                break;
            case 'Revenir à "commencé"':
                sState = 'CO';
                // il faut supprimer la date de fin de l'opération
                break;
            case 'Revenir à "à faire"':
                sState = 'AF';
                // il faut supprimer les informations "non réalisé" et supprimer les dates de début et fin sur l'opération
                break;
        }


        // déclencher l'action (requete AJAX), pour la suppression il faut que le backend gère ça
        Ext.Ajax.request({
            url: 'server/ope/Operations.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'setOpnState',
                etat: sState,
                opn_id: this.record.data.opn_id,
                usr_id: this.userId
            },
            success: function () {},
            failure: function () {},
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                if (oBack.success) {
                    // mettre à jour la liste des opérations pour refléter les modifications
                    var oOpnStore = menu.ownerGrid.getStore(),
                        aFilter;

                    aFilter = [{
                        type: 'odf_id',
                        value: menu.record.data.odf_id
                    }];
                    oOpnStore.setExtraParams({
                        storefilters: {
                            specfilter: aFilter
                        }
                    });
                    oOpnStore.reload();
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', 'Impossible de modifier cette opération...');
                }
            }
        });
    }
});