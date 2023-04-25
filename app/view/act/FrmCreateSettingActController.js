/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/

Ext.define('Thot.view.act.FrmCreateSettingActController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.act-frmcreatesettingact',
    /**
     * @author Hervé Valot
     * @date   2019-10-04
     * @Description afterRender du formulaire
     * @version 20191004
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        // var oCard = oForm.query('#cardPanel')[0];
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

        // var oClosedOfBtn = oForm.query('#closedOf')[0];
        // var oOperationGrd = oCard.query('#operationSel')[0];
        // var oOperationStr = oOperationGrd.getStore();

        // oOperationStr.dataLoaded = false;
        // oOperationStr.closedOfMode = false;
        // oOperationStr.on({
        //     load: function (oData) {
        //         if (!oOperationStr.closedOfMode) {
        //             oClosedOfBtn.hide();
        //             oMe.opeFilter();
        //         }
        //         oOperationStr.dataLoaded = true;
        //     }
        // });
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
        var oMe = this;
        var oForm = oMe.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        var sActiveCard = oLayout.getActiveItem().itemId;
        // var oOperatorId = oCard.query('#selectedOperId')[0];
        var oOperatorLabel = oCard.query('#selectedOper')[0];
        // var oWorkStnId = oCard.query('#selectedWorkStnId')[0];
        var oWorkStnLabel = oCard.query('#selectedWorkStn')[0];
        // var oOperationId = oCard.query('#selectedOperationId')[0];
        var oOperationLabel = oCard.query('#selectedOperation')[0];
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

            case 'operationSel':
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
     * Selection d'une section dans la combo sur volet 1
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onSectionSel: function (oCombo, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        // var oSelectedSabId = oCard.query('#selectedSabId')[0];
        var oUsersGrd = oCard.query('#operatorSel')[0];
        var oUsersStr = oUsersGrd.getStore();
        // var oWorkStnGrd = oCard.query('#workStnSel')[0];
        // var oWorkStnStr = oWorkStnGrd.getStore();

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

        // var aFilter = [];

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
        var oMe = this;
        var oForm = oMe.getView();
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
    onTypeUserClick: function (_oContainer, oBtn, _bPressed) {
        var oMe = this;
        var oForm = oMe.getView();
        var oSectionCbo = oForm.query('#sectionCbo')[0];
        var oUsersGrd = oForm.query('#operatorSel')[0];
        var oUsersStr = oUsersGrd.getStore();

        if (oSectionCbo.getValue() == null) {
            var oMsg = Thot.app.MessageInfo();
            oMsg.init(5000);
            oMsg.msg('error', 'Il faut sélectionner une section');
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
     * @function    onWorkStnSel
     * @description sélection d'un équipement dans la grille, met à jour les champs masqués et Ariane
     * @version     20191016 création
     */
    onWorkStnSel: function (_oGrid, oRecord) {
        var oMe = this;
        var oForm = oMe.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oWorkStnId = oCard.query('#selectedWorkStnId')[0];
        var oWorkStnLabel = oCard.query('#selectedWorkStn')[0];

        oWorkStnId.assistEnabled = (oRecord.get('surutilisation') > 0);
        var oMsg = Thot.app.MessageInfo();

        if (oRecord.get('rsc_estchargee') < 1) {
            oMsg.init(5000);
            oMsg.msg('avert', 'Aucune opération n\'est planifiée sur cet équipement');
        }

        if (oRecord.get('surutilisation') > 1 && oRecord.get('imt') == 0) {
            oMsg.init(5000);
            oMsg.msg('avert', 'Seul le mode collaboratif est possible sur cet équipement');
        }

        // mise à jour des champs masqués pour utilisation ultérieure
        oWorkStnId.setValue(oRecord.get('rsc_id'));
        oWorkStnLabel.setValue(oRecord.get('rsc_code') + ' / ' + oRecord.get('rsc_libelle'));
        // mise à jour du fil d'ariane
        oMe.arianeUpdate();
        // on a changé d'équipement
        oMe.clearOpnGrid();
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
        // DEV: hvt 2019-10-16 10:01:16 ajout de l'id de l'équipement pour filtrer les résultats retournés dans la liste des opérations (OF)
        var oWorkStnId = oCard.query('#selectedWorkStnId')[0];
        // mise à jour des champs masqués
        oOfId.setValue('');
        oOfCode.setValue('');
        // mise à jour d'Ariane
        oMe.arianeUpdate();

        oPicker.validField(oField, sValue, sOldValue);

        // identifier la grille d'affichage des résultats
        var oGrid = oForm.query('#operationSel')[0];
        // identifier le store de la grille
        var oStore = oGrid.getStore();
        // récupérer les informations du picker
        oPicker.validField(oField, sValue, sOldValue);
        // limiter le traitement, on déclenche la recherche au 4ème caractère
        if (oField.value.length > 3) {
            // filtre
            var aFilter = [{
                type: 'odf_code',
                value: sValue
            }, {
                type: 'rsc_id',
                value: oWorkStnId.getValue()
            }];
            // vider le store
            oStore.removeAll();
            // appliquer le filtre au store de la grille
            oStore.setExtraParams({
                storefilters: {
                    specfilter: aFilter
                }
            });
            // déclenche le filtrage des opérations en fonction du statut des boutons d'affichage
            oMe.opeFilter();
            // recharger le store
            oStore.load();
        } else {
            oStore.removeAll();
        }
        // mise à jour du bouton "créer"
        // oMe.setCreateBtnState();

    },
    /**
     * @author : edblv
     * date   : 02/06/16 14:02
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Selection d'une opération
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onOperationSel: function (_oGrid, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oOperId = oCard.query('#selectedOperationId')[0];
        var oOperLabel = oCard.query('#selectedOperation')[0];
        oOperId.setValue(oRecord.get('opn_id'));
        oOperLabel.setValue(oRecord.get('odf_code') + ' / ' + oRecord.get('opn_code') + ' : ' + oRecord.get('pst_libelle'));
        oMe.arianeUpdate();
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
    onPreviousClic: function (oBtn) {
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
     * @author  : Hervé Valot
     * @date    : 2019/11/14
     * @description : gère le filtrage du store des opérations en fonction de l'état des boutons bascule
     * @version
     * 20191113     Hervé VALOT création
     */
    opeFilter: function () {
        // identification du formulaire courant
        var oForm = this.getView();
        // identification de la grille à filtrer
        var oGrid = oForm.query('#operationSel')[0];
        // identification des boutons toggle
        var oAltOpeBtn = oForm.query('#altOpe')[0],
            oStopOpeBtn = oForm.query('#stopOpe')[0];
        // tableau des filtres à appliquer au store
        var aFilter = [];

        if (!oAltOpeBtn.pressed) { // opérations alternatives désactivées
            // affichage uniquement des opérations planifiées sur l'équipement
            aFilter.push({
                property: 'priorite',
                value: 2
            });
        }

        if (!oStopOpeBtn.pressed) { // opérations terminées désactivées
            // affiche uniquelent les opérations en cours ou à réaliser
            // en mode réglage, pas de gestion de la chronologie de gamme
            // possibilité de faire du réglage par anticipation
            aFilter.push({
                property: 'opn_estterminee',
                value: 0
            });
        }
        oGrid.getStore().clearFilter();
        oGrid.getStore().setFilters(aFilter);
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
    onNextClic: function (oBtn) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        var oPreviousBtn = oCard.query('#previous')[0];
        var sActiveCard = oLayout.getActiveItem().itemId;
        var oOperId = oCard.query('#selectedOperId')[0];
        var oWorkStnId = oCard.query('#selectedWorkStnId')[0];
        var oOperationId = oCard.query('#selectedOperationId')[0];
        // var oAssistBtn = oCard.query('#assist')[0];
        // var oGroupBtn = oForm.query('#opeType')[0];
        var bNext = true;
        var oMsg = Thot.app.MessageInfo();

        switch (sActiveCard) {
            case 'operatorSel':
                // Si on est sur 'Sélection d'opérateur', on ne peut pas
                // passer au suivant tant qu'on n'a pas sélectionné un opérateur
                if (parseInt(oOperId.getValue(), 10) < 1) {
                    oMsg.init(5000);
                    oMsg.msg('error', 'Il faut sélectionner un opérateur');
                    bNext = false;
                }
                break;
            case 'workStnSel':
                // Si on est sur 'Sélection d'équipement', on ne peut pas
                // passer au suivant tant qu'on n'a pas sélectionné un équipement
                if (parseInt(oWorkStnId.getValue(), 10) < 1) {
                    oMsg.init(5000);
                    oMsg.msg('error', 'Il faut sélectionner un équipement');
                    bNext = false;
                }
                break;
            case 'operationSel':
                // Si on est sur 'Sélection d'opération', on ne peut pas
                // terminer tant qu'on n'a pas sélectionné une opération
                if (parseInt(oOperationId.getValue(), 10) < 1) {
                    oMsg.init(5000);
                    oMsg.msg('error', 'Il faut sélectionner une opération');
                    bNext = false;
                } else {
                    oMe.createActivitie();
                    // oMe.createActCtrl();
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
                case 'operationSel':
                    // on est sur le dernier écran, on met à jour l'affichage des boutons pour
                    // terminer le processus de création d'activité
                    // oGroupBtn.setDisabled(false);

                    //---- Activation/Désactivation du bouton 'Assistance'
                    // if (oWorkStnId.assistEnabled) {
                    //     oAssistBtn.setDisabled(false);
                    // } else {
                    //     oAssistBtn.setDisabled(true);
                    // }

                    oBtn.setText('Terminé');
                    oBtn.setIconCls('thot-icon-validate');
                    break;
            }
        }
    },
    /**
     * @author : edblv
     * date   : 01/06/16 16:02
     *
     * #Description
     * Clic sur 'Annuler', ferme le formulaire sans création d'activité
     *
     */
    onCancelClic: function () {
        var oForm = this.getView();
        var oWin = oForm.up('window');
        oWin.close();
    },
    /**
     * @author : edblv
     * date   : 14/06/16 12:08
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Contrôle avant création d'activité
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    createActCtrl: function () {
        var oMe = this;
        var oForm = oMe.getView();
        oForm.getValid();
    },
    /**
     * @author : edblv
     * date   : 23/06/16 15:43
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Traitement du retour (true/false) de la méthode
     * de validation du formulaire (override/form/Panel.js -> getValid())
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    _fTest: function (bResult) {
        var oMe = this;
        // var oForm = oMe.getView();

        if (bResult) {
            //---- On crée la tâche
            oMe.createActivitie();
        } else {
            //---- On arrête là
            oMe.onCancelClic();
        }
    },
    /**
     * @author : edblv
     * date   : 03/06/16 10:01
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Création d'une activité
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    createActivitie: function () { // iOperationId, iOfId, iOperatorId, iWorkStnId
        var oMe = this;
        var oForm = oMe.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oWin = oForm.up('window');
        var oSelectedSabId = oForm.query('#selectedSabId')[0];
        var oOperId = oCard.query('#selectedOperId')[0];
        var oWorkStnId = oCard.query('#selectedWorkStnId')[0];
        var oOperationGrd = oCard.query('#operationSel')[0];
        // var oAssistBtn = oForm.query('#assist')[0];
        var aOperation = oOperationGrd.getSelectionModel().getSelection();

        // on désactive le formulaire et on affiche le masque "patientez"
        oForm.mask('création de l\'activité en cours ...');

        // récupère les paramètres nécessaires et les envoie au backend
        // appel PHP pour créer l'activité Réglage
        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'NewAleaReglage',
                mode: 'production',
                opn_id: aOperation[0].get('opn_id'), // iOperationId,
                odf_id: aOperation[0].get('odf_id'), // iOfId,
                org_id: oSelectedSabId.getValue(),
                rsc_id: oOperId.getValue() + ',' + oWorkStnId.getValue(), // iOperatorId + ', ' + iWorkStnId
            },
            success: function () {},
            failure: function () {},
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var oMain = Thot.app.viewport;
                if (oBack.success) {
                    //---- Si l'activité à bien été créée, on envoie le message Websocket
                    oMain.fireEvent('send', 'maj', oForm.xtype, ['currentAct']);

                    // ...et on ferme la fenêtre
                    oWin.close();
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', 'Impossible de créer cette opération...');

                    // on retire le masque "patientez"
                    oForm.unmask();
                }
            }
        });
    },
    /**
     * @author  hervé valot
     * @date    20191016
     * @description efface les informations de la carte de sélection des opérations
     */
    clearOpnGrid: function () {
        var oForm = this.getView(),
            oCard = oForm.query('#cardPanel')[0],
            // la grille des opérations et son store
            oOperationGrd = oCard.query('#operationSel')[0],
            oOperationStr = oOperationGrd.getStore(),
            // le champ de recherche OF
            oOfNum = oForm.query('#ofNum')[0],
            // les champs masqués de conservation des données de l'opération sélectionnée
            oOperId = oCard.query('#selectedOperationId')[0],
            oOperLabel = oCard.query('#selectedOperation')[0],
            // les boutons toggle de filtrage des opérations disponibles
            oAltOpeBtn = oForm.query('#altOpe')[0],
            oStopOpeBtn = oForm.query('#stopOpe')[0];

        // vider le store de la grille et effacer le filtre
        oOperationStr.clearFilter();
        oOperationStr.removeAll();

        // vider le champ de recherche des OF
        oOfNum.setValue(null);

        // réinitialisation de l'état des toggle
        oAltOpeBtn.setPressed(false);
        oStopOpeBtn.setPressed(false);

        // effacer les champs de conservation des données de l'opération sélectionnée
        oOperId.setValue(null);
        oOperLabel.setValue(null);
        this.arianeUpdate();
    }

});