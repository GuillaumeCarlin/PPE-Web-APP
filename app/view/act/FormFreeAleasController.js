Ext.define('Thot.view.act.FormFreeAleasController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.act-formfreealeas',
    dataFields: {
        startDate: {
            convert: function (aDatas) {
                var sFormat = '';
                var sValue = aDatas.startDate;

                if (arguments.length > 1) {
                    sFormat = arguments[1];
                }

                switch (sFormat) {
                    case 'sql':
                        return Ext.Date.toSql(sValue);
                    default:
                        return Ext.String.toDate(sValue);
                }
            }
        },
        endDate: {
            convert: function (aDatas) {
                var sFormat = '';
                var sValue = aDatas.endDate;

                if (arguments.length > 1) {
                    sFormat = arguments[1];
                }

                switch (sFormat) {
                    case 'sql':
                        return Ext.Date.toSql(sValue);
                    default:
                        return Ext.String.toDate(sValue);
                }
            }
        }
    },
    /**
     * @author : edblv
     * date   : 04/08/16 11:20
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Afterrender du formulaire
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        var oSourceCard = oForm.query('#sourceCard')[0];
        var oScheduleForm = oForm.query('#scheduleCard')[0];
        // DEV: HVT 2019-11-29 08:59:11 bouton désactivé (commenté) dans la définition du formulaire), toute référence mise en commentaire pour éviter les bugs
        // var oSchedBtn = oForm.query('#schedBtn')[0];
        var oAleaEndButton = oForm.query('#aleaBtn')[0];
        var oSectionEqpCbo = oForm.query('#sectionEqpCbo')[0];
        var oSectionUsrCbo = oForm.query('#sectionUsrCbo')[0];
        var oSectionEqpStr = oSectionEqpCbo.getStore();
        var oSectionUsrStr = oSectionUsrCbo.getStore();

        // lecture dans le localStorage de la chaine des id des sections supervisées
        oMe.currentSection = Thot.app.getSection();
        // si la chaine est vide alors aucune section n'est sélectionnée, on ne peut pas aller plus loin
        if (oMe.currentSection.idsection === '') {
            var oMsg = Thot.app.MessageInfo();
            oMsg.init(5000);
            oMsg.msg("error", 'Aucune section à superviser n\'a été seléctionnée');
            return;
        }

        // constitution d'un tableau contenant les id des sections supervisées
        var aSection = oMe.currentSection.idsection.split(',');
        // identification de la combo des sections
        var oSectionCbo = oForm.query('#sectionCbo')[0];

        // mie à jour du filtre pour le store
        var aFilter = [{
            type: 'sab_id',
            value: oMe.currentSection.idsection
            // value: Thot.app.getSection().idsection
        }];

        var bModifRights = false;

        //---- On cherche si le nom de ce formulaire est présent dans l'objet Thot.app.appConfig.process
        // et si c'est le cas, si l'utilisateur courant a des droits dessus
        if (Thot.app.appConfig.process[oForm.itemId]) {
            if (Thot.app.appConfig.process[oForm.itemId].users.indexOf(Thot.app.cnxParams.login) > -1) {
                //---- Le user courant est identifié comme pouvant faire des modif
                bModifRights = true;
            }
        }

        if (bModifRights) {
            // DEV: HVT 2019-11-29 08:59:11 bouton désactivé (commenté) dans la définition du formulaire), toute référence mise en commentaire pour éviter les bugs
            //oSchedBtn.setDisabled(false);
        }
        //---- Chargement de la combo des sections
        oSectionEqpStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oSectionEqpStr.load();

        //---- ...et celle des users
        oSectionUsrStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oSectionUsrStr.load();

        // si une seule section alors on charge les listes équipement et utilisateur
        if (aSection.length < 2) {
            // selection de l'entrée dans les combos
            oSectionEqpCbo.setValue(oMe.currentSection.idsection);
            oSectionUsrCbo.setValue(oMe.currentSection.idsection);
            // chargement de la liste
            oMe.equipmentList(oMe.currentSection.idsection);
            oMe.userList(oMe.currentSection.idsection);
            // désactive la liste des sections, il n'y en a qu'une, inutile de développer la liste
            oSectionUsrCbo.setDisabled(true);
        }

        if (oForm.param.idenreg) {
            //---- Si idenreg est renseigné, on est en édition
            //	On va donc charger l'enregistrement correspondant à l'aléa et sa programmation
            Ext.Ajax.request({
                url: 'server/act/Activities.php',
                params: {
                    appName: Thot.app.appConfig.name,
                    action: 'loadAlea',
                    ala_id: oForm.param.idenreg
                },
                success: function () {},
                failure: function () {},
                callback: function (opt, success, oResponse) {
                    var oBack = Ext.decode(oResponse.responseText);
                    var aRecord = oBack.liste[0];
                    var oEqptGrd = oForm.query('#equipments')[0];
                    var oUsersGrd = oForm.query('#usersGrd')[0];
                    var oEqptStr = oEqptGrd.getStore();
                    var oUsersStr = oUsersGrd.getStore();

                    oEqptStr.on({
                        load: function (oStore) {
                            var iInd = 0;

                            if (oEqptGrd.selectRow) {
                                iInd = oStore.find('rsc_id', oEqptGrd.selectRow);
                                oEqptGrd.getSelectionModel().select(iInd);
                                var oRecord = oEqptGrd.getSelectionModel().selected.getRange()[0];
                                oEqptGrd.getView().focusRow(oRecord);
                            }
                        }
                    });

                    oUsersStr.on({
                        load: function (oStore) {
                            var iInd = 0;

                            if (oUsersGrd.selectRow) {
                                iInd = oStore.find('usr_id', oUsersGrd.selectRow);
                                oUsersGrd.getSelectionModel().select(iInd);
                                var oRecord = oUsersGrd.getSelectionModel().selected.getRange()[0];
                                oUsersGrd.getView().focusRow(oRecord);
                            }
                        }
                    });

                    switch (aRecord.alo_code) {
                        case 'EQP':
                            oSourceCard.setActiveTab('eqpTab');
                            oEqptGrd.selectRow = parseInt(aRecord.rsc_id);
                            oMe.equipmentList('all');
                            break;

                        case 'USR':
                            oSourceCard.setActiveTab('usrTab');
                            oUsersGrd.selectRow = parseInt(aRecord.rsc_id);
                            oMe.userList('all');
                            break;
                    }

                    oForm.originalValues = oBack.liste[0];
                    oForm.updateForm(oBack.liste[0], oMe.dataFields);

                    if (oForm.param.custom) {
                        if (oForm.param.custom.action) {
                            switch (oForm.param.custom.action) {
                                case 'schedule':
                                    //---- Accès direct à la programmation
                                    oMe.onScheduleClick();
                            }
                        }
                    }
                }
            });
        } else {
            // on est en mode création, il faut cacher le bouton terminer l'aléa
            oAleaEndButton.setHidden(true);
        }
    },
    /**
     * @author : edblv
     * date   : 23/11/16 11:42
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Programmation'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    // DEV: HVT 2019-11-29 08:59:11 bouton désactivé (commenté) dans la définition du formulaire), toute référence mise en commentaire pour éviter les bugs
    /*    onScheduleClick: function () {
            var oMe = this;
            var oForm = this.getView();
            var oCard = oForm.query('#cardPanel')[0];
            var oLayout = oCard.getLayout();
            var oSchedBtn = oForm.query('#schedBtn')[0];
            var oPreviousBtn = oCard.query('#previous')[0];
            var oNextBtn = oCard.query('#next')[0];
            var oContinueBtn = oCard.query('#continue')[0];
            var oScheduleFrm = oForm.query('#scheduleCard')[0];
            var bModifRights = false;

            //---- On cherche si le nom de ce formulaire est présent dans l'objet Thot.app.appConfig.process
            // et si c'est le cas, si l'utilisateur courant a des droits dessus
            if (Thot.app.appConfig.process[oForm.itemId]) {
                if (Thot.app.appConfig.process[oForm.itemId].users.indexOf(Thot.app.cnxParams.login) > -1) {
                    //---- Le user courant est identifié comme pouvant faire des modif
                    bModifRights = true;
                }
            }

            oCard.previousCard = oLayout.getActiveItem().itemId;
            oLayout.setActiveItem('scheduleCard');

            if (!bModifRights) {
                oScheduleFrm.setReadOnly(true);
            }

            oSchedBtn.setDisabled(true);
            oPreviousBtn.setHidden(true);
            oNextBtn.setHidden(true);
            oContinueBtn.setHidden(false);
        },*/
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
     * date   : 23/11/16 11:41
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Continuer'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onContinueClic: function () {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        // DEV: HVT 2019-11-29 08:59:11 bouton désactivé (commenté) dans la définition du formulaire), toute référence mise en commentaire pour éviter les bugs
        //        var oSchedBtn = oForm.query('#schedBtn')[0];
        var oPreviousBtn = oCard.query('#previous')[0];
        var oNextBtn = oCard.query('#next')[0];
        var oContinueBtn = oCard.query('#continue')[0];
        oLayout.setActiveItem(oCard.previousCard);
        // DEV: HVT 2019-11-29 08:59:11 bouton désactivé (commenté) dans la définition du formulaire), toute référence mise en commentaire pour éviter les bugs
        //        oSchedBtn.setDisabled(false);
        oPreviousBtn.setHidden(false);
        oNextBtn.setHidden(false);
        oContinueBtn.setHidden(true);

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
    onPreviousClic: function (oBtn) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        var oNextBtn = oCard.query('#next')[0];
        var sActiveCard = oLayout.getActiveItem().itemId;

        if (sActiveCard !== 'sourceCard') {
            oNextBtn.setDisabled(false);
            //oNextBtn.setText('Suivant');
            oLayout.prev();

            switch (oLayout.getActiveItem().itemId) {
                case 'sourceCard':
                    oBtn.setDisabled(true);
                    break;
            }
        }
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
    onNextClick: function (oBtn) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        var sActiveCard = oLayout.getActiveItem().itemId;
        var oSourceId = oForm.query('#sourceId')[0];
        var bNext = true;

        switch (sActiveCard) {
            case 'sourceCard':
                //---- Si on est sur 'Sélection de la source', on ne peut pas
                //	passer au suivant tant qu'on n'a pas sélectionné une source (opérateur ou équipement)
                // Etonnant, non ?
                if (parseInt(oSourceId.getValue(), 10) < 1) {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", 'Il faut sélectionner une ressource (Equipement ou Opérateur)');
                    bNext = false;
                } else {
                    oMe.isValidRessource(oBtn);
                }
                break;
        }

    },
    /**
     * @author : edblv
     * date   : 08/08/16 10:53
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Contrôle la possibilité d'utiliser la ressource
     * sélectionnée pour créer un aléa libre
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    isValidRessource: function (oBtn) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        var oPreviousBtn = oCard.query('#previous')[0];
        var oSourceId = oForm.query('#sourceId')[0];
        var bTests = true;

        //---- Si on est en édition d'aléa on va déterminer si les tests sur
        // l'activité en cours ou l'aléa en cours sont nécessaires
        if (oForm.param.idenreg) {
            if (parseInt(oSourceId.getValue()) === parseInt(oForm.originalValues.rsc_id)) {
                bTests = false;
            }
        }

        if (bTests) {
            Ext.Ajax.request({
                url: 'server/act/Activities.php',
                params: {
                    appName: Thot.app.appConfig.name,
                    action: 'validRessource',
                    rsc_id: oSourceId.getValue()
                },
                success: function () {},
                failure: function () {},
                callback: function (opt, success, oResponse) {
                    var oBack = Ext.decode(oResponse.responseText);
                    var bNext = true;

                    if (oBack.success) {
                        if (oBack.liste.currentact[0].nb > 0) {
                            var oMsg = Thot.app.MessageInfo();
                            oMsg.init(5000);
                            oMsg.msg("error", 'Il y a déjà ' + oBack.liste.currentact[0].nb + ' activité(s) sur cette ressource');
                            bNext = false;
                        }

                        //---- S'il y a déjà un aléa sur cette ressource...
                        if (oBack.liste.currentala[0].nb > 0) {
                            bNext = false;

                            Ext.MessageBox.show({
                                title: 'Aléa en cours',
                                msg: 'Il y a déjà un aléa sur cette ressource.<br>Voulez-vous le fermer ?',
                                buttons: Ext.MessageBox.YESNO,
                                buttonText: {
                                    yes: "Oui, fermer l'aléa en cours",
                                    no: "Non, abandonner la création"
                                },
                                fn: oMe._isValidRessource,
                                caller: oMe,
                                ala_id: oBack.liste.currentala[0].ala_id,
                                formxtype: oForm.xtype
                            });
                        }
                    }

                    //---- Si l'action 'Suivant' est validée
                    if (bNext) {
                        oMe.showAleaCard();
                    }
                }
            });
        } else {
            oMe.showAleaCard();
        }
    },
    _isValidRessource: function (sValue, sNull, oObj) {
        var oObj = arguments[2];
        var oCtr = oObj.caller;
        var oMain = Thot.app.viewport;

        if (sValue == 'yes') {
            Ext.Ajax.request({
                url: 'server/act/Activities.php',
                params: {
                    appName: Thot.app.appConfig.name,
                    action: 'AleaEnd',
                    ala_id: oObj.ala_id
                },
                success: function () {},
                failure: function () {},
                callback: function (opt, success, oResponse) {
                    var oBack = Ext.decode(oResponse.responseText);

                    if (oBack.success) {
                        oMain.fireEvent('send', 'maj', oObj.formxtype, ['freealeas']);
                        oCtr.showAleaCard();
                    }
                }
            });
        }
    },
    /**
     * @author : edblv
     * date   : 08/08/16 15:27
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Montre la carte 'Sélection d'aléa'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    showAleaCard: function () {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        var oPreviousBtn = oCard.query('#previous')[0];
        var oNextBtn = oCard.query('#next')[0];
        var oSourceId = oForm.query('#sourceId')[0];

        oPreviousBtn.setDisabled(false);
        oNextBtn.setDisabled(true);
        oLayout.next();

        // BUG: 2019-03-21 22:54:21, HVT, l'actualisation de la liste des aléas ne fonctionne
        // pas dans la cas ou :
        // - sélection d'un type de ressources
        // - activation onglet des aléas, liste OK
        // - retour
        // changer de ressource SANS SELECTIONNER une nouvelle ressource
        // - passer aux aléas, affiche l'ancienne liste au lieu de la nouvelle

        //---- Mise à jour du container avec les boutons des
        //	aléas correspondant à la source
        oMe.aleaList(oSourceId.sourceType);
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
    aleaList: function (iSourceType) {
        var oMe = this;
        var oForm = this.getView();
        var oAleasCtn = oForm.query('#aleasSel')[0];
        oAleasCtn.removeAll();
        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'FreeAleaList',
                sourcetype: iSourceType
                // org_id: oForm.param.custom.data.org_id,
                // oct_id: oForm.param.custom.data.oct_id
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    for (var iAlea in oBack.liste) {
                        oAleasCtn.add({
                            xtype: 'button',
                            itemId: oBack.liste[iAlea].ald_code,
                            text: oBack.liste[iAlea].ald_libelle,
                            ald_id: oBack.liste[iAlea].ald_id,
                            scale: 'large',
                            width: 220,
                            margin: '0 15 10 0',
                            handler: 'onSelAleaClick'
                        });
                    }
                }
            }
        });
    },
    /**
     * @author : edblv
     * date   : 05/08/16 16:01
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur un bouton d'aléa
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onSelAleaClick: function (oBtn) {
        var oMe = this;
        var oForm = this.getView();

        var oAleasCtn = oForm.query('#aleasSel')[0];
        // on désactive la zone des boutons pour éviter un double-clic
        oAleasCtn.setDisabled(true);

        var oSourceId = oForm.query('#sourceId')[0];
        var oScheduleForm = oForm.query('#scheduleCard')[0];
        var oMain = Thot.app.viewport;
        var sAction = (oForm.param.idenreg ? 'editFreeAlea' : 'newFreeAlea');
        var oSchedule = oScheduleForm.fieldsToServer(oMe.dataFields);
        var iUserId = Thot.app.contexte.userId;
        var oSectionUsrCbo = oForm.query('#sectionUsrCbo')[0];

        //---- Doit-on utiliser un IdUser de substitution (Ex. : Si des users PQR utilisent l'appli,
        // ils seront identifiés comme s'ils étaient F. Brechon (petite pirouette pour les tests)
        if (Thot.app.appConfig.process[oForm.itemId].usersub) {
            if (Thot.app.appConfig.process[oForm.itemId].usersub[Thot.app.cnxParams.login]) {
                iUserId = Thot.app.appConfig.process[oForm.itemId].usersub[Thot.app.cnxParams.login];
            }
        }

        oSchedule.userId = iUserId;

        // on désactive le formulaire et on affiche le masque "patientez"
        oForm.mask('création de l\'activité en cours ...');

        // préparation des paramètres de la requête Ajax
        var oParams = {
            appName: Thot.app.appConfig.name,
            action: sAction,
            mode: 'production',
            ala_id: (oForm.param.idenreg ? oForm.param.idenreg : 0),
            rsc_id: oSourceId.getValue(),
            ald_id: oBtn.ald_id,
            org_id: oSectionUsrCbo.value,
            schedule: Ext.encode(oSchedule)
        };

        // récupère les paramètres nécessaires et les envoie au backend
        // appel PHP pour créer l'activité Hord production
        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: oParams,
            // {
            //     appName: Thot.app.appConfig.name,
            //     action: sAction,
            //     ala_id: (oForm.param.idenreg ? oForm.param.idenreg : 0),
            //     rsc_id: oSourceId.getValue(),
            //     ald_id: oBtn.ald_id,
            //     org_id: oSectionUsrCbo.value,
            //     schedule: Ext.encode(oSchedule)
            // },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    oMain.fireEvent('send', 'maj', oForm.xtype, ['freealeas', 'currentAct']);
                    oAleasCtn.setDisabled(false);
                    oMe.onCancelClick();
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", 'Impossible de créer cette opération...');

                    // on retire le masque "patientez"
                    oForm.unmask();
                }
            }
        });
        // on réactive la zone
    },
    /**
     * @author : edblv
     * date   : 05/08/16 16:07
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
     * @author  Hervé Valot
     * @date    04/08/16 16:39
     * @scrum   R1 #7
     * @Description charge la liste des équipements de la section sélectionnée et synchronise la liste des opérateurs
     * @version 20190320 HVT ajout synchronisation avec liste opérateurs
     */
    onSectionEqpSel: function (oCombo, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oSectionUsrCbo = oForm.query('#sectionUsrCbo')[0];
        // mise à jour de la liste des équipements
        oMe.equipmentList(oRecord.get('sab_id'));
        // mise à jour de la liste des opérateurs
        oSectionUsrCbo.setValue(oRecord.get('sab_id'));
        oMe.userList(oRecord.get('sab_id'));

    },
    /**
     * @author  Hervé Valot
     * @date    20190620
     * @scrum   R1#7
     * @Description charge la liste des opérateurs de la section sélectionnée et synchronise la liste des équipements
     * @version 20190320 HVT ajout synchronisation avec liste équipements
     */
    onSectionUsrSel: function (oCombo, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oSectionEqpCbo = oForm.query('#sectionEqpCbo')[0];
        // mise à jour de la liste des opérateurs
        oMe.userList(oRecord.get('sab_id'));
        // mise à jour de la liste des équipements
        oSectionEqpCbo.setValue(oRecord.get('sab_id'));
        oMe.equipmentList(oRecord.get('sab_id'));
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
     * @author : edblv
     * date   : 05/08/16 09:16
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Choix sur bouton bascule Equipement (de la section / Tous)
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onTypeEqpClick: function (oContainer, oBtn, bPressed) {
        var oMe = this;
        var oForm = this.getView();
        var oSectionEqpCbo = oForm.query('#sectionEqpCbo')[0];

        if (oBtn.itemId == 'sectionEqp') {
            if (oSectionEqpCbo.getValue() == null) {
                var oMsg = Thot.app.MessageInfo();
                oMsg.init(5000);
                oMsg.msg("error", 'Il faut sélectionner une section');
                return;
            }
        }

        oMe.equipmentList((oBtn.itemId == 'allEqp' ? 'all' : oSectionEqpCbo.getValue()));
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
    equipmentList: function (sIdSection) {
        var oMe = this;
        var oForm = this.getView();
        var oEquipmGrd = oForm.query('#equipments')[0];
        var oEquipmStr = oEquipmGrd.getStore();

        var aFilter = [{
            type: 'sab_id',
            value: sIdSection
        }];
        //---- Chargement des users
        oEquipmStr.removeAll();
        oEquipmStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oEquipmStr.load();
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
        // var oMe = this;
        // var oForm = this.getView();
        // var oSectionUsrCbo = oForm.query('#sectionUsrCbo')[0];

        // if (oBtn.itemId == 'sectionUsr') {
        //     if (oSectionUsrCbo.getValue() == null) {
        //         var oMsg = Thot.app.MessageInfo();
        //         oMsg.init(5000);
        //         oMsg.msg("error", 'Il faut sélectionner une section');
        //         return;
        //     }
        // }

        // oMe.userList((oBtn.itemId == 'allUsr' ? 'all' : oSectionUsrCbo.getValue()));
        var oMe = this;
        var oForm = oMe.getView();
        var oSectionCbo = oForm.query('#sectionUsrCbo')[0];
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
     * date   : 05/08/16 10:47
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    userList: function (sIdSection) {
        var oMe = this;
        var oForm = this.getView();
        var oUserGrd = oForm.query('#operatorSel')[0];
        var oUserStr = oUserGrd.getStore();
        var aFilter = [];
        aFilter.push({
            type: 'sab_id',
            value: sIdSection
        });
        aFilter.push({
            type: 'oct_id_membre2',
            value: 3
        });
        //---- Chargement des users
        oUserStr.removeAll();
        oUserStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oUserStr.load();
    },
    /**
     * @author : edblv
     * date   : 05/08/16 10:43
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Selection d'un equipement dans la grille
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onWorkStnSel: function (oGrid, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oSourceId = oForm.query('#sourceId')[0];
        oSourceId.setValue(oRecord.get('rsc_id'));
        oSourceId.sourceType = '2';
        oSourceId.sourceLabel = oRecord.get('rsc_libelle');
        oMe.arianeUpdate();
    },
    /**
     * @author : edblv
     * date   : 05/08/16 11:41
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Selection d'un opérateur dans la grille
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onUserSel: function (oGrid, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oSourceId = oForm.query('#sourceId')[0];
        oSourceId.setValue(oRecord.get('usr_id'));
        oSourceId.sourceType = '1';
        oSourceId.sourceLabel = oRecord.get('usr_prenom') + ' ' + oRecord.get('usr_nom');
        oMe.arianeUpdate();
    },
    /**
     * @function    onAleaStopClick
     * @author      Hervé Valot
     * @date        20190124
     * @description terminer un aléa libre en cours
     * @version     20190124 Création
     */
    onAleaStopClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oMain = Thot.app.viewport;

        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'AleaEnd',
                ala_id: oForm.param.idenreg
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                /* action websocket */
                if (oBack.success) {
                    oMain.fireEvent('send', 'maj', oForm.xtype, ['freealeas', 'currentAct', 'histoAct']);
                    oMe.onCancelClick();
                }
            }
        });
    },
    /**
     * @author : edblv
     * date   : 05/08/16 13:43
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Mise à jour du fil d'ariane
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    arianeUpdate: function () {
        var oMe = this;
        var oForm = this.getView();
        var oAriane = oForm.query('#ariane')[0];
        var sAriane = '';
        var oSourceId = oForm.query('#sourceId')[0];
        sAriane = '<a class="thot-ariane-info">' + oSourceId.sourceLabel + '</a>';
        oAriane.setValue(sAriane);
    }
});