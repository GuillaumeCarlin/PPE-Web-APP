/**
 * @author      Hervé VALOT
 * @date        20181220
 * @description contrôleur du formulaire de création des activités de type qualité
 * @version     20181220 création
 */
Ext.define('Thot.view.act.FormCreateQualityActController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.act-formcreatequalityact',
    /**
     * @function    onAfterRender
     * @description actions à réaliser après le rendu du formulairesen
     * @version     20181220 création
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
            oMsg.msg('error', 'Aucune section à superviser n\'a été seléctionnée');
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
    },
    /**
     * @function    onSectionSel
     * @description sélection d'une setion dans la combobox
     * @version     20181220 création
     */
    onSectionSel: function (oCombo, oRecord) {
        var oForm = this.getView();

        var oCard = oForm.query('#cardPanel')[0];
        var oSelectedSabId = oCard.query('#selectedSabId')[0];
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

        // mise àjour du champ masqué #selectedSabId
        // oMe.selectedSection(oRecord.get('sab_id'));
        oSelectedSabId.setValue(oRecord.get('sab_id'));

        // Chargement des users du service courant
        oUsersStr.removeAll();
        oUsersStr.setExtraParams({
            // définition du filtre à appliquer au store
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
     * @function	selectedSection
     * @Description met à jour l'identifiant de la séction supervisée
     * @version 	20181228 création
     */
    selectedSection: function (iSabId) {
        var oMe = this;
        var oForm = this.getView();
        var oSelectedSabId = oForm.query('#selectedSabId')[0];
        oSelectedSabId.setValue(iSabId);
    },
    /**
     * @function    onTypeUserClick
     * @description bouton bascule, opérateurs de la section / tous les opérateurs
     * @version     20181220 création
     */
    onTypeUserClick: function (oContainer, oBtn, bPressed) {
        var oMe = this;
        var oForm = this.getView();
        var oSectionCbo = oForm.query('#sectionCbo')[0];
        var oUsersGrd = oForm.query('#operatorSel')[0];
        var oUsersStr = oUsersGrd.getStore();

        if (oSectionCbo.getValue() == null) {
            var oMsg = Thot.app.MessageInfo();
            oMsg.init(5000);
            oMsg.msg('error', 'Veuillez sélectionner une section !');
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
     * @function    onOperatorSel
     * @description sélection d'un opérateur dans la grille, met à jour les champs masqués et Ariane
     * @version     20181220 création
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
        // mise à jour du fil d'ariane
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
     * @function    onWorkStnSel
     * @description sélection d'un équipement dans la grille, met à jour les champs masqués et Ariane
     * @version     20181220 création
     */
    onWorkStnSel: function (oGrid, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oWorkStnId = oCard.query('#selectedWorkStnId')[0];
        var oWorkStnLabel = oCard.query('#selectedWorkStn')[0];
        oWorkStnId.assistEnabled = (oRecord.get('surutilisation') > 0);
        // le champ de recherche OF
        var oOfNum = oForm.query('#ofNum')[0];
        // vider le champ de recherche des OF
        oOfNum.setValue(null);
        // if (oRecord.get('rsc_estchargee') < 1) {
        //     var oMsg = Thot.app.MessageInfo();
        //     oMsg.init(5000);
        //     oMsg.msg("avert", 'Aucune opération n\'est réalisable sur cet équipement');
        // }

        // mise à jour des champs masqués pour utilisation ultérieure
        oWorkStnId.setValue(oRecord.get('rsc_id'));
        oWorkStnLabel.setValue(oRecord.get('rsc_code') + ' / ' + oRecord.get('rsc_libelle'));
        // mise à jour du fil d'ariane
        oMe.arianeUpdate();
        // charger les opérations complémentaires et création des boutons.(2 = type qualité)
        oMe.createComplementaryActivitiesButtons(2);
    },
    /**
     * @function	onOfSelClick
     * @description	Sélection d'un OF, met à jour les champs masqués et Ariane
     * @version		20181228
     */
    onOfSelClick: function (oGrid, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oOfId = oCard.query('#selectedOfId')[0];
        var oOfCode = oCard.query('#selectedOfCode')[0];
        // mise à jour des champs masqués
        oOfId.setValue(oRecord.get('odf_id'));
        oOfCode.setValue(oRecord.get('odf_code'));
        // mise à jour d'Ariane
        oMe.arianeUpdate();
        // mise à jour du bouton "créer"
        oMe.setCreateBtnState();
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
     * @function	onPickerValueChange
     * @description	validation en cours de frappe sur champ n°OF
     * @version		20181222
     */
    onPickerValueChange: function (oField, sValue, sOldValue) {
        var oMe = this;
        var oForm = this.getView();
        var oPicker = oField.getPicker();
        var oCard = oForm.query('#cardPanel')[0];
        var oOfId = oCard.query('#selectedOfId')[0];
        var oOfCode = oCard.query('#selectedOfCode')[0];
        // mise à jour des champs masqués
        oOfId.setValue('');
        oOfCode.setValue('');
        // mise à jour d'Ariane
        oMe.arianeUpdate();
        // mise à jour du toggle des boutons d'opérations

        oPicker.validField(oField, sValue, sOldValue);

        // identifier la grille d'affichage des résultats
        var oGrid = oForm.query('#ofSel')[0];
        // identifier le store de la grille
        var oStore = oGrid.getStore();
        // récupérer les informations du picker
        oPicker.validField(oField, sValue, sOldValue);
        // limiter le traitement, on déclenche la recherche au 3ème caractère
        if (oField.value.length > 5) {
            // filtre
            var aFilter = [{
                type: 'odf_code',
                value: sValue
            }];
            // vider le store
            oStore.removeAll();
            // appliquer le filtre au store de la grille
            oStore.setExtraParams({
                storefilters: {
                    specfilter: aFilter
                }
            });
            // recharger le store
            oStore.load();
        } else {
            oStore.removeAll();
        }
        // mise à jour du bouton "créer"
        oMe.setCreateBtnState();

    },
    /**
     * @function    onCancelClick
     * @description annulation de la création de l'activité
     * @version     20181220 création
     */
    onCancelClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oWin = oForm.up('window');
        oWin.close();
    },
    /**
     * @function    onPreviousClick
     * @description retour arrière dans les cartes du formulaire
     * @version     20181220 création
     */
    onPreviousClick: function (oBtn) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        var oNextBtn = oCard.query('#next')[0];
        var sActiveCard = oLayout.getActiveItem().itemId;

        if (sActiveCard !== 'operatorSel') {
            oNextBtn.setUI('default');
            oNextBtn.setDisabled(false);
            oNextBtn.setText('Suivant');
            oNextBtn.setIconCls('thot-icon-next');
            oLayout.prev();
            oMe.arianeUpdate();

            switch (oLayout.getActiveItem().itemId) {
                case 'operatorSel':
                    oBtn.setDisabled(true);
                    break;
            }
        }
    },
    /**
     * @function    onNextClick
     * @description avance d'une carte dans le formulaire et déclenche la création de l'activité sur la dernière carte
     * @version     20181220 création
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
        var oOfId = oCard.query('#selectedOfId')[0];
        var bNext = true;
        var oMsg = Thot.app.MessageInfo();
        switch (sActiveCard) {
            case 'operatorSel':
                // Si on est sur 'Sélection d'opérateur', on ne peut pas
                // passer au suivant tant qu'on n'a pas sélectionné un opérateur
                if (parseInt(oOperId.getValue(), 10) < 1) {
                    oMsg.init(5000);
                    oMsg.msg('error', 'Veuillez sélectionner un opérateur');
                    bNext = false;
                }
                break;
            case 'workStnSel':
                // Si on est sur 'Sélection d'équipement', on ne peut pas
                // passer au suivant tant qu'on n'a pas sélectionné un équipement
                if (parseInt(oWorkStnId.getValue(), 10) < 1) {
                    oMsg.init(5000);
                    oMsg.msg('error', 'Veuillez sélectionner un équipement');
                    bNext = false;
                }
                break;
            case 'ofSel':
                // Si on est sur 'Sélection d'of', on ne peut pas
                // terminer tant qu'on n'a pas sélectionné un of et une opération qualité
                if (parseInt(oOfId.getValue(), 10) < 1) {
                    oMsg.init(5000);
                    oMsg.msg('error', 'Veuillez sélectionner un OF et une opération');
                } else {
                    oBtn.setDisabled(true); //DEV: HVT 2023-02-03 11:12:55, test pour éviter le double-clic qui engendre la création de doublons
                    oMe.createCompAct();
                }

                bNext = false;
                break;
        }

        //---- Si l'action 'Suivant' est validée
        if (bNext) {
            oPreviousBtn.setDisabled(false);
            oLayout.next();
            oMe.arianeUpdate();

            switch (oLayout.getActiveItem().itemId) {
                case 'ofSel':
                    oBtn.setUI('succes');
                    oBtn.setText('Créer');
                    oBtn.setIconCls('thot-icon-validate');
                    oBtn.setDisabled(true);
                    break;
            }
        }
    },

    /**
     * @function	arianeUpdate
     * @Description	Mise à jour du fil d'ariane
     * @version 	20160613 Création
     */
    arianeUpdate: function () {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        var sActiveCard = oLayout.getActiveItem().itemId;
        var oOperatorId = oCard.query('#selectedOperId')[0];
        var oOperatorLabel = oCard.query('#selectedOper')[0];
        var oWorkStnId = oCard.query('#selectedWorkStnId')[0];
        var oWorkStnLabel = oCard.query('#selectedWorkStn')[0];
        var oOfId = oCard.query('#selectedOfId')[0];
        var oOfCode = oCard.query('#selectedOfCode')[0];
        var oCompAct = oCard.query('#selectedCompAct')[0];
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

            case 'ofSel':
                sAriane += sArianeSep + '<a class="thot-ariane-info">' + oWorkStnLabel.getValue() + '</a>';

                if (oOfCode.getValue() !== '' && oOfCode.getValue() !== undefined) {
                    sAriane += sArianeSep + '<a class="thot-ariane-info">' + oOfCode.getValue() + '</a>';
                }
                if (oCompAct.getValue() !== '' && oCompAct.getValue() !== undefined) {
                    sAriane += sArianeSep + '<a class="thot-ariane-info">' + oCompAct.getValue() + '</a>';
                }
                break;
        }

        oAriane.setValue(sAriane);
    },
    /**
     * @function	createComplementaryActivitiesButtons
     * @description	crée les boutons de l'interface pour chaque activité complémentaire trouvée en BDD
     * @version		20181222
     * @param		iCompActType	integer identifiant du type d'opération complémentaire à lister
     */
    createComplementaryActivitiesButtons: function (iCompActType) {
        var oForm = this.getView();
        var oCompActContainer = oForm.query('#qualityActSel')[0];

        // vider le container avant d'ajouter quoi que ce soit
        oCompActContainer.removeAll();
        // lancer une requête AJAX pour récupérer les données et créer les boutons de l'interface
        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'CompActList',
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
                            text: '(' + oBack.liste[iCompAct].opc_code + ') ' + oBack.liste[iCompAct].opc_libelle,
                            opc_id: oBack.liste[iCompAct].opc_id,
                            scale: 'large',
                            minWidth: 220,
                            handler: 'onBtnCompActClick',
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
        var oCard = oForm.query('#cardPanel')[0];

        // on désactive le formulaire et on affiche le masque "patientez"
        oForm.mask('création de l\'activité en cours ...');

        // récupère les paramètres nécessaires et les envoie au backend
        // appel PHP pour créer l'activité Qualité
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
                    oMsg.msg('error', 'Impossible de créer cette activité !');

                    // on réactive le bouton NEXT et on retire le masque "patientez"
                    oCard.query('#next')[0].setDisabled(false); //DEV: HVT 2023-02-03 11:18:46
                    oForm.unmask();
                }
            }
        });
    },
    /**
     * @function	setCreateBtnState
     * @description	défini l'état du bouton "créer" (enabled/disabled)
     */
    setCreateBtnState: function () {
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oCompActId = oCard.query('#selectedCompActId')[0];
        var oOfId = oCard.query('#selectedOfId')[0];
        var oNextBtn = oCard.query('#next')[0];
        var oLayout = oCard.getLayout();
        var sActiveCard = oLayout.getActiveItem().itemId;

        if (sActiveCard == 'ofSel') {
            if (oCompActId.getValue() == '' || oOfId.getValue() == 0) {
                // il manque au moins une des deux informations de la carte courante
                // on désactive le bouton next
                oNextBtn.setDisabled(true);
            } else {
                oNextBtn.setDisabled(false);
            }
        }
    }
});