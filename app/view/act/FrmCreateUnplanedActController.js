Ext.define('Thot.view.act.FrmCreateUnplanedActController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.act-frmcreateunplanedact',
    /**
     * @author : edblv
     * date   : 01/06/16 15:40
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * afterRender du formulaire
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        var oUsersGrd = oForm.query('#operatorSel')[0];
        var oUsersStr = oUsersGrd.getStore();
        var oSectionCombo = oForm.query('#sectionCbo')[0];

        // lecture de la chaine des id des sections supervisées dans le localStorage
        oMe.currentSection = Thot.app.getSection();
        // si la chaine des id est vide alors on ne peut pas aller plus loin
        if (oMe.currentSection.idsection === '') {
            var oMsg = Thot.app.MessageInfo();
            oMsg.init(5000);
            oMsg.msg("error", 'Aucune section à superviser n\'a été seléctionnée');
            oSectionCombo.setDisabled(true);
            return;
        }

        // on transforme la chaine des id de sections en tableau
        var aSection = oMe.currentSection.idsection.split(',');
        // on identifie la combo des sections et son store
        var oSectionCbo = oForm.query('#sectionCbo')[0];
        var oSectionStr = oSectionCbo.getStore();
        // on met à jour le filtre du store utilisateurs
        var aFilter = [];
        aFilter.push({
            type: 'sab_id',
            value: oMe.currentSection.idsection
        });
        aFilter.push({
            type: 'oct_id_membre2',
            value: oForm.param.custom.oct_id_membre2
        });
        // on met à jour la combo des sections supervisées (uniquement celles sélectionnées)
        oSectionStr.setExtraParams({ // application du filtre
            storefilters: {
                specfilter: aFilter
            }
        });
        oSectionStr.load(); // chargement du store des sections
        // si il n'y a qu'une seule section supervisée
        if (aSection.length < 2) { // la longueur du tableau est inférieure à 2 (un seul élément)
            oMe.selectedSection(oMe.currentSection.idsection);
            oSectionCbo.setValue(oMe.currentSection.idsection);
            //application du filtre courant au store des utilisateurs
            oUsersStr.setExtraParams({
                storefilters: {
                    specfilter: aFilter
                }
            });
            // chargement du store utilisateurs
            oUsersStr.load();
            // désactive la liste des sections, il n'y en a qu'une, inutile de développer la liste
            oSectionCombo.setDisabled(true);
        } else {
            oSectionCbo.validate();
        }
        // initialisation de l'id de l'OF 200
        oMe.getOf200Id();
    },
    /**
     * @function	onBtnCompActClick
     * @description	Clic sur un bouton d'activité complémentaire, met à jour les champs masqué
     * @param {*} oBtn
     */
    onBtnCompActClick: function (oBtn) {
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oCompActId = oCard.query('#selectedCompActId')[0];
        var oCompAct = oCard.query('#selectedCompAct')[0];

        // vérifie l'état du bouton, sur le clic on peut soit activer soit désactiver le bout
        if (oBtn.pressed == true) {
            // place l'id de l'opération du bouton dans le champ masqué
            oCompActId.setValue(oBtn.opc_id);
            oCompAct.setValue(oBtn.text);
        } else {
            // sinon, vide
            oCompActId.setValue(null);
            oCompAct.setValue(null);
        }
        // met à jour le status actif/inactif du bouton "créer"
        this.setCreateBtnState();
        // met à jour Ariane
        this.arianeUpdate();

    },
    /**
     * @author : edblv
     * date   : 13/06/16 10:04
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Mise à jour du fil d'ariane
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    arianeUpdate: function () {
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        var sActiveCard = oLayout.getActiveItem().itemId;
        var oOperatorLabel = oCard.query('#selectedOper')[0];
        var oWorkStnLabel = oCard.query('#selectedWorkStn')[0];
        var oOperationLabel = oCard.query('#selectedCompAct')[0];
        var oAriane = oForm.query('#ariane')[0];
        var sAriane = '';
        var sArianeSep = ' <a class="thot-ariane-sep"></a> ';

        if (oOperatorLabel.getValue()) {
            sAriane = '<a class="thot-ariane-info">' + oOperatorLabel.getValue() + '</a>';
        }

        switch (sActiveCard) {
            case 'workStnSel':
                if (oWorkStnLabel.getValue() !== '' && oWorkStnLabel.getValue() !== undefined) {
                    sAriane += sArianeSep + '<a class="thot-ariane-info">' + oWorkStnLabel.getValue() + '</a>';
                }
                break;

            case 'unplanedOPSel':
                sAriane += sArianeSep + '<a class="thot-ariane-info">' + oWorkStnLabel.getValue() + '</a>';

                if (oOperationLabel.getValue() !== '' && oOperationLabel.getValue() !== undefined) {
                    sAriane += sArianeSep + '<a class="thot-ariane-info">' + oOperationLabel.getValue() + '</a>';
                }
                break;
        }

        oAriane.setValue(sAriane);
    },
    /**
     * @author : edblv
     * date   : 10/06/16 09:20
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Selection d'une section
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onSectionSel: function (oCombo, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oUsersGrd = oCard.query('#operatorSel')[0];
        var oUsersStr = oUsersGrd.getStore();
        var aFilter = [];
        aFilter.push({
            type: 'sab_id',
            value: oRecord.get('sab_id')
        });
        aFilter.push({
            type: 'oct_id_membre2',
            value: oForm.param.custom.oct_id_membre2
        });

        oMe.selectedSection(oRecord.get('sab_id'));
        //---- Chargement des users du service courant
        oUsersStr.removeAll();
        oUsersStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oUsersStr.load();
    },
    /**
     * @author Hervé Valot
     * @description filtre le store des utilisateurs
     */
    onUserFilter: function () {
        var oMe = this,
            oForm = oMe.getView(),
            oCard = oForm.query('#cardPanel')[0],
            oUsersGrd = oCard.query('#operatorSel')[0],
            oUsersStr = oUsersGrd.getStore(),
            oUserFilter = oCard.query('#searchfield')[0];

        var aFilter = [];

        // création du filtre
        oUsersStr.filter('usr_nom', oUserFilter.getValue());
    },
    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    selectedSection: function (iSabId) {
        var oForm = this.getView();
        var oSelectedSabId = oForm.query('#selectedSabId')[0];
        oSelectedSabId.setValue(iSabId);
    },
    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onTypeUserClick: function (oContainer, oBtn, bPressed) {
        var oForm = this.getView();
        var oSectionCbo = oForm.query('#sectionCbo')[0];
        var oUsersGrd = oForm.query('#operatorSel')[0];
        var oUsersStr = oUsersGrd.getStore();

        if (oSectionCbo.getValue() == null) {
            var oMsg = Thot.app.MessageInfo();
            oMsg.init(5000);
            oMsg.msg("error", 'Il faut sélectionner une section');
        } else {
            var aFilter = [];
            aFilter.push({
                type: 'sab_id',
                value: (oBtn.itemId == 'allUsers' ? 'all' : oSectionCbo.getValue())
            });
            aFilter.push({
                type: 'oct_id_membre2',
                value: oForm.param.custom.oct_id_membre2
            });
            //---- Chargement des users
            oUsersStr.removeAll();
            oUsersStr.setExtraParams({
                storefilters: {
                    specfilter: aFilter
                }
            });
            oUsersStr.load();
        }
    },
    /**
     * @author : edblv
     * date   : 02/06/16 11:30
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Selection d'un opérateur
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onOperatorSel: function (oGrid, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oOperId = oCard.query('#selectedOperId')[0];
        var oOperLabel = oCard.query('#selectedOper')[0];
        var oWorkStnStr = oCard.query('#workStnSel')[0].getStore();

        oOperId.setValue(oRecord.get('usr_id'));
        oOperLabel.setValue(oRecord.get('usr_prenom') + ' ' + oRecord.get('usr_nom'));
        oMe.arianeUpdate();
        // récupération des paramètres pour mise à jour des équipements
        var aFilter = [];
        aFilter.push({
            type: 'sab_id',
            value: oForm.query('#selectedSabId')[0].value
        });
        aFilter.push({
            type: 'usr_id',
            value: oRecord.get('usr_id')
        });
        //---- Chargement des équipements du service courant
        oWorkStnStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oWorkStnStr.load();

    },
    /**
     * @author : edblv
     * date   : 02/06/16 11:58
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Sélection d'un équipement
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onWorkStnSel: function (oGrid, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oWorkStnId = oCard.query('#selectedWorkStnId')[0];
        var oWorkStnLabel = oCard.query('#selectedWorkStn')[0];
        oWorkStnId.assistEnabled = (oRecord.get('surutilisation') > 0);

        /* pas de vérification de charge pour les opérations non planifiées */
        // if (oRecord.get('rsc_estchargee')<1) {
        // 	var oMsg = Thot.app.MessageInfo();
        // 	oMsg.init(5000);
        // 	oMsg.msg("avert", 'Aucune opération n\'est réalisable sur cet équipement');
        // }

        if (oRecord.get('surutilisation') > 1 && oRecord.get('imt') == 0) {
            var oMsg = Thot.app.MessageInfo();
            oMsg.init(5000);
            oMsg.msg("avert", 'Seul le mode collaboratif est possible sur cet équipement actuellement.');
        }

        oWorkStnId.setValue(oRecord.get('rsc_id'));
        oWorkStnLabel.setValue(oRecord.get('rsc_code') + ' / ' + oRecord.get('rsc_libelle'));
        oMe.arianeUpdate();
        oMe.getOf200Id();
        oMe.createUnplanedOPButtons(4); /* type 4 = activités non planifiées */
    },
    /**
     * @function    createUnplanedOPButtons
     * @author      Hervé Valot
     * @description créé les boutons sur l'interface utilisateur en fonction des OP non planifiées trouvées en base de données
     * @version     20190128    Création
     */
    createUnplanedOPButtons: function (iCompActType) {
        var oForm = this.getView();
        var oCompActContainer = oForm.query('#unplanedOPSelCtr')[0];

        // vider le container avant d'ajouter quoi que ce soit
        oCompActContainer.removeAll();
        // lancer une requête AJAX pour récupérer les données et créer les boutons de l'interface
        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'UnplanedOPList',
                compacttype: iCompActType // id du type d'opération dans la base de données
            },
            success: function () {
                // si tous se passe bien, rien de particulier à faire
            },
            failure: function () {
                // sinon, rien de plus
            },
            callback: function (opt, success, oResponse) {
                // ici on va traiter les données retournées et créer les boutons
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    for (var iCompAct in oBack.liste) {
                        oCompActContainer.add({
                            xtype: 'button',
                            itemId: oBack.liste[iCompAct].opc_code,
                            text: oBack.liste[iCompAct].opc_libelle,
                            opc_id: oBack.liste[iCompAct].opc_id,
                            scale: 'large',
                            minWidth: 235,
                            margin: '0 15 10 0',
                            handler: 'onBtnCompActClick',
                            /* action à déclencher sur le clic bouton */
                            toggleGroup: 'tg',
                            enableToggle: true
                        });
                    }
                }
            }
        });
    },
    /**
     * @function	createCompAct
     * @description	demande la création de l'activité complémentaire au serveur backend
     * @version		20190109
     */
    createCompAct: function () {
        var oForm = this.getView();
        var oWin = oForm.up('window');

        // on désactive le formulaire et on affiche le masque "patientez"
        oForm.mask('création de l\'activité en cours ...');

        // récupère les paramètres nécessaires et les envoie au backend
        // appel PHP pour créer l'activité Non planifiée
        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'newCompAct',
                mode: 'production',
                org_id: oForm.query('#selectedSabId')[0].getValue(), // section de production
                usr_id: oForm.query('#selectedOperId')[0].getValue(), // opérateur
                eqp_id: oForm.query('#selectedWorkStnId')[0].getValue(), // équipement
                rsc_id: oForm.query('#selectedOperId')[0].getValue() + ',' + oForm.query('#selectedWorkStnId')[0].getValue(), // chaine ressources
                odf_id: oForm.query('#selectedOfId')[0].getValue(), // OF
                opc_id: oForm.query('#selectedCompActId')[0].getValue() // opération qualité
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, sucess, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var oMain = Thot.app.viewport;
                if (oBack.success) {
                    // si l'activité qualité a été créée, on envoie le message WebSocket
                    oMain.fireEvent('send', 'maj', oForm.xtype, ['currentAct']);
                    // et on ferme le formulaire
                    oWin.close();
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", "Impossible de créer cette activité !");

                    // on retire le masque "patientez"
                    oForm.unmask();
                }
            }
        });
    },
    /**
     *  @function   getOf200Id
     *  @author     Hervé Valot
     *  @description    récupère l'identifiant de l'OF200 et le stock sur le formulaire
     *  @version    20190129    Création
     */
    getOf200Id: function () {
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oOF200Id = oCard.query('#selectedOfId')[0];

        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'GetOf200Id',
            },
            success: function () {
                // si tous se passe bien, rien de particulier à faire
            },
            failure: function () {
                // sinon, rien de plus
            },
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                if (oBack.success) {
                    oOF200Id.setValue(oBack.liste[0].odf_id);
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", 'l\'OF de rattachement des opérations non planifiées n\'est pas défini');
                }
            }
        });
    },
    /**
     * @author : edblv
     * date   : 01/06/16 16:02
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Précédent'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onPreviousClick: function (oBtn) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        var oNextBtn = oCard.query('#next')[0];
        var sActiveCard = oLayout.getActiveItem().itemId;

        if (sActiveCard !== 'operatorSel') {
            oNextBtn.setDisabled(false);
            oNextBtn.setText('Suivant');
            oNextBtn.setIconCls('thot-icon-next');
            oLayout['prev']();
            oMe.arianeUpdate();

            switch (oLayout.getActiveItem().itemId) {
                case 'operatorSel':
                    oBtn.setDisabled(true);
                    break;
            }
        }
    },
    /**
     * @author : edblv
     * date   : 01/06/16 16:02
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Suivant'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onNextClick: function (oBtn) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        var oPreviousBtn = oCard.query('#previous')[0];
        var sActiveCard = oLayout.getActiveItem().itemId;
        var oOperId = oCard.query('#selectedOperId')[0];
        var oWorkStnId = oCard.query('#selectedWorkStnId')[0];
        var oOperationId = oCard.query('#selectedCompActId')[0];
        var bNext = true;
        var oMsg = Thot.app.MessageInfo();
        switch (sActiveCard) {
            case 'operatorSel':
                //---- Si on est sur 'Sélection d'opérateur', on ne peut pas
                //	passer au suivant tant qu'on n'a pas sélectionné un opérateur
                // Etonnant, non ?
                if (parseInt(oOperId.getValue(), 10) < 1) {
                    oMsg.init(5000);
                    oMsg.msg("error", 'Veuillez sélectionner un opérateur');
                    bNext = false;
                }
                break;
            case 'workStnSel':
                //---- Si on est sur 'Sélection d'équipement', on ne peut pas
                //	passer au suivant tant qu'on n'a pas sélectionné un équipement
                // De plus en plus fort !!!
                if (parseInt(oWorkStnId.getValue(), 10) < 1) {
                    oMsg.init(5000);
                    oMsg.msg("error", 'Veuillez sélectionner un équipement');
                    bNext = false;
                }
                break;
            case 'unplanedOPSel':
                //---- Si on est sur 'Sélection d'opération', on ne peut pas
                //	terminer tant qu'on n'a pas sélectionné une opération
                // On frise le génie pur...
                if (parseInt(oOperationId.getValue(), 10) < 1) {
                    oMsg.init(5000);
                    oMsg.msg("error", 'Veuillez sélectionner une opération');
                    bNext = false;
                } else {
                    oMe.createCompAct();
                }

                bNext = false;
                break;
        }

        //---- Si l'action 'Suivant' est validée
        if (bNext) {
            oPreviousBtn.setDisabled(false);
            oLayout['next']();
            oMe.arianeUpdate();

            switch (oLayout.getActiveItem().itemId) {
                case 'unplanedOPSel':
                    oBtn.setUI('succes');
                    oBtn.setText('Créer');
                    oBtn.setIconCls('thot-icon-validate');
                    oBtn.setDisabled(true);
                    break;
            }
        }
    },
    /**
     * @author : edblv
     * date   : 01/06/16 16:02
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Annuler'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onCancelClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oWin = oForm.up('window');
        oWin.close();
    },
    /**
     * @function	setCreateBtnState
     * @description	défini l'état du bouton "créer" (enabled/disabled)
     * @version     20190129    Création
     */
    setCreateBtnState: function () {
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oCompActId = oCard.query('#selectedCompActId')[0];
        var oOfId = oCard.query('#selectedOfId')[0];
        var oNextBtn = oCard.query('#next')[0];

        if (oCompActId.getValue() == '' || oOfId.getValue() == '0') {
            // aucune opération sélectionnée et ou OF non identifié
            // on désactive le bouton next
            oNextBtn.setDisabled(true);
        } else {
            oNextBtn.setDisabled(false);
        }
    }
});