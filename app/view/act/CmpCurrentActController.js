Ext.define('Thot.view.act.CmpCurrentActController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.act-cmpcurrentact',
    /**
     * @author : edblv
     * date   : 08/07/16 16:29
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * AfterRender
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        var oActivitiesGrd = oForm.query('#grdActivities')[0];
        var oActivitiesStr = oActivitiesGrd.getStore();
        // var oActiveTasks = oForm.query('#activeTasks')[0];
        // var oSuspendedTasks = oForm.query('#suspendedTasks')[0];
        var oQualTasks = oForm.query('#qualTasks')[0];
        var oHrprTasks = oForm.query('#hrprTasks')[0];
        var oNplnTasks = oForm.query('#nplnTasks')[0];
        var oProdTasks = oForm.query('#prodTasks')[0];

        oActivitiesStr.on({
            // filterchange: function (oStore, oFilters) {
            //     var oClearFltBtn = oForm.query('#clearFilters')[0];

            //     if (oFilters.length > 0) {
            //         oClearFltBtn.show();
            //     } else {
            //         oClearFltBtn.hide();
            //     }
            // },
            load: function (oStore, aRecords) {
                var iActiveTasks = 0;
                var iSuspendedTasks = 0;

                var iProdCount = 0,
                    iReglCount = 0,
                    iQualCount = 0,
                    iHrprCount = 0,
                    iNplnCount = 0;

                // // comptabilise les activités par type
                // for (var iRec in aRecords) {
                //     if (aRecords[iRec].get('ala_id') > 0) {
                //         // sous aléa, incrément le compteur
                //         iSuspendedTasks++;
                //     } else {
                //         // activité de production, incrémente le compteur
                //         iActiveTasks++;
                //     }
                // }

                for (var iRec in aRecords) {
                    iActiveTasks++;
                    switch (aRecords[iRec].get('oct_code')) {
                        case 'PROD':
                            // décompte des activités de PROD sous aléa
                            if (aRecords[iRec].get('ala_id') > 0) {
                                // sous aléa, incrément le compteur
                                if (aRecords[iRec].get('ald_code') == 'RGL') {
                                    // réglage
                                    iReglCount++;
                                } else {
                                    iSuspendedTasks++;
                                }
                            } else {
                                iProdCount++;
                            }
                            break;
                        case 'QUAL':
                            iQualCount++;
                            break;
                        case 'HRPR':
                            iHrprCount++;
                            break;
                        case 'NPLN':
                            iNplnCount++;
                            break;
                    }
                }
                // mise à jour des compteurs à l'écran
                // oActiveTasks.setValue(iActiveTasks);
                // oSuspendedTasks.setValue(iSuspendedTasks);
                var sTitre = '';
                sTitre += '<p> Activités en cours<thot-sticky class="generic" data-qtip="Nombre d\'activités en cours (tous types confondus)" data-qalign="tl-bl">' + iActiveTasks + '</thot-sticky>';
                sTitre += 'Réglage<thot-sticky class="reglage" data-qtip="Nombre de réglages en cours" data-qalign="tl-bl">' + iReglCount + '</thot-sticky>';
                sTitre += 'Production<thot-sticky class="prod" data-qtip="Nombre d\'activités de production en cours" data-qalign="tl-bl">' + iProdCount + '</thot-sticky>';
                sTitre += 'Qualité<thot-sticky class="qual" data-qtip="Nombre d\'activités qualité en cours" data-qalign="tl-bl">' + iQualCount + '</thot-sticky>';
                sTitre += 'Hors production<thot-sticky class="hrpr" data-qtip="Nombre d\'activités hors production en cours" data-qalign="tl-bl">' + iHrprCount + '</thot-sticky>';
                sTitre += 'Non planifié<thot-sticky class="npln" data-qtip="Nombre d\'activités non planifiées en cours" data-qalign="tl-bl">' + iNplnCount + '</thot-sticky>';
                // sTitre += 'Aléas<thot-sticky class="reglage" data-qtip="Nombre d\'activités sous aléa en cours" data-qalign="tl-bl">' + iSuspendedTasks + '</thot-sticky>';
                sTitre += '</p>';
                oForm.setTitle(sTitre);
                // oProdTasks.setValue(iProdCount);
                // oQualTasks.setValue(iQualCount);
                // oHrprTasks.setValue(iHrprCount);
                // oNplnTasks.setValue(iNplnCount);
            }
        });
    },
    /**
     * @author : edblv
     * date   : 23/10/17 11:05
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur bouton 'Effacer filtres'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onClearFltClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oActivitiesGrd = oForm.query('#grdActivities')[0];
        oActivitiesGrd.clearFilters();
    },
    /**
     * @author : edblv
     * date   : 11/07/16 15:59
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur le bouton 'FullScreen'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onFullScreenClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oMain = oForm.up('app-main');
        var oTab = oMain.query('#curentActTab');

        if (oTab.length > 0) {
            //---- L'onglet existe déjà, on se positionne dessus
            oMain.setActiveTab(oTab[0]);
        } else {
            //---- L'onglet n'existe pas, on le crée
            oMain.insert(1, {
                title: 'Activités en cours',
                itemId: 'curentActTab',
                layout: {
                    align: 'stretch',
                    type: 'vbox'
                },
                iconCls: 'Activities', //'x-fa-home',
                closable: true,
                items: [{
                    xtype: 'currentact',
                    itemId: 'currentactivities',
                    flex: 1
                }]
            });
            oMain.setActiveTab(1);
        }

        oMain.fireEvent('listsRefresh');
    },
    /**
     * @author : edblv
     * date   : 08/07/16 11:59
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Déclenchée par l'événement 'gridRefresh'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onGridRefresh: function (aFilter) {
        var oMe = this;
        var oForm = this.getView();
        var oActivitiesGrd = oForm.query('#grdActivities')[0];
        var oActivitiesStr = oActivitiesGrd.getStore();

        oActivitiesStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oMe.actRefresh();
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
    actRefresh: function () {
        var oMe = this;
        var oForm = this.getView();
        var oActivitiesGrd = oForm.query('#grdActivities')[0];
        var oActivitiesStr = oActivitiesGrd.getStore();
        oActivitiesStr.removeAll();
        oActivitiesStr.load();
    },
    /**
     * @author : edblv
     * date   : 01/06/16 15:35
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Nouvelle activité'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onNewActClic: function () {
        var oMe = this;

        oMe.showForm({
            widget: 'createactivitie',
            title: 'Nouvelle activité',
            alias: 'newact',
            height: 630,
            width: 1054,
            param: {
                custom: {
                    oct_id_membre2: 1,
                    oct_code_membre2: 'PROD'
                }
            },
            oncloseevent: 'listsRefresh'
        });
    },
    /**
     * @author      Hervé Valot
     * @date        20181221
     * @Description déclenche l'ouverture du formulaire de création d'une activité qualité
     * @version     20181221 Création
     */
    onNewQualityActClick: function () {
        var oMe = this;
        var oForm = this.getView();

        oMe.showForm({
            widget: 'createqualityactivity',
            title: 'Nouvelle activité qualité',
            alias: 'newact',
            height: 630,
            width: 1054,
            param: {
                custom: {
                    oct_id_membre2: 2,
                    oct_code_membre2: 'QUAL'
                }
            },
            oncloseevent: 'listsRefresh'
        });
    },
    /**
     * @author      Hervé Valot
     * @date        20190123
     * @description appelle la fonction showForm pour l'ouverture du formulaire de création aléa
     * @version     20190123 Création
     */
    onNewAleaClick: function () {
        var oMe = this;

        oMe.showForm({
            widget: 'newfreealea',
            title: 'Nouvel Aléa',
            alias: 'newalea',
            height: 630,
            width: 1054,
            param: {
                custom: {
                    oct_id_membre2: 3,
                    oct_code_membre2: 'HRPR'
                }
            },
            oncloseevent: 'listsRefresh'
        });
    },
    /**
     * @author      Hervé Valot
     * @date        20190125
     * @description appelle le fonction showForm pour l'ouverture du formulaire de création d'activités non planifiées
     * @version     20190125    Création
     */
    onNewUnplanedActClick: function () {
        var oMe = this;

        oMe.showForm({
            widget: 'newunplanedact',
            title: 'Nouvelle activité non planifiée',
            alias: 'newunplanedact',
            height: 630,
            width: 1054,
            param: {
                custom: {
                    oct_id_membre2: 4,
                    oct_code_membre2: 'NPLN'
                }
            },
            oncloseevent: 'listsRefresh'
        });
    },
    /**
     * @author      Hervé Valot
     * @date        20191004
     * @description appelle le fonction showForm pour l'ouverture du formulaire de création d'activités réglage
     * @version     20191004 Création
     */
    onNewSettingActClick: function () {
        var oMe = this;

        oMe.showForm({
            widget: 'createsettingactivity',
            title: 'Nouvelle activité de réglage',
            alias: 'createsettingactivity',
            height: 630,
            width: 1054,
            param: {
                custom: {
                    oct_id_membre2: 5,
                    oct_code_membre2: 'RGL'
                }
            },
            oncloseevent: 'listsRefresh'
        });
    },
    /**
     * @author : edblv
     * date   : 08/07/16 12:06
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur la cellule 'Etat'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onCellClick: function (oView, oComp, iCellInd, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oGrid = oView.up('grid');
        var aColumns = oGrid.getColumns();
        var oMain = oForm.up('app-main');
        switch (aColumns[iCellInd].dataIndex) {
            case 'etat':
                /* il faut agir en fonction du type de la ligne sélectionnée
                oct_id = 1 > production, 2 > qualité, 3 > hors prod, 4 > non planifié
                oct_code    : description
                PROD        : Production normale
                HRPR        : Hors production
                NPLN        : Non planifié
                QUAL        : Qualité
                 */
                if (parseInt(oRecord.get('locked')) == 1) {
                    // l'activité a été verrouillée par le système, aucune action autorisée
                    return;
                }
                switch (oRecord.data.oct_code) {
                    case 'PROD':
                        /* production */
                        oMe.showForm({
                            widget: 'actdetail',
                            title: 'Détail de l\'activité',
                            alias: 'actdet',
                            height: 450,
                            width: 750,
                            param: {
                                recordId: oRecord.get('act_id'),
                                custom: oRecord,
                                ald_code: oRecord.get('ald_code')
                            },
                            oncloseevent: 'listsRefresh'
                        });
                        break;
                    case 'QUAL':
                        /* qualité */
                        oMe.showForm({
                            widget: 'actdetail',
                            title: 'Détail de l\'activité qualité',
                            alias: 'actdet',
                            height: 450,
                            width: 750,
                            param: {
                                recordId: oRecord.get('act_id'),
                                custom: oRecord
                            },
                            oncloseevent: 'listsRefresh'
                        });
                        break;
                    case 'HRPR':
                        /* hors prod. */
                        Ext.Msg.show({
                            title: 'Activité hors production',
                            message: 'Voulez-vous terminer l\'activité : ' + oRecord.get('ald_libelle') + ' ?',
                            buttons: Ext.Msg.YESNO,
                            icon: Ext.Msg.QUESTION,
                            fn: function (btn) {
                                if (btn === 'yes') {
                                    Ext.Ajax.request({
                                        url: 'server/act/Activities.php',
                                        params: {
                                            appName: Thot.app.appConfig.name,
                                            action: 'AleaEnd',
                                            ala_id: oRecord.get('ala_id')
                                        },
                                        success: function () {},
                                        failure: function () {},
                                        callback: function (opt, success, oResponse) {
                                            var oBack = Ext.decode(oResponse.responseText);

                                            /* action websocket */
                                            if (oBack.success) {
                                                oMain.fireEvent('send', 'maj', oForm.xtype, ['freealeas', 'currentAct', 'histoAct']);
                                            }
                                            // mise àjour de la grille et uniquement celle-ci
                                            oGrid.getStore().reload();
                                        }
                                    });
                                }
                            }
                        });
                        break;
                    case 'NPLN':
                        /* Non planifié */
                        Ext.Msg.show({
                            title: 'Terminer une activité non planifiée',
                            message: 'Voulez-vous terminer l\'activité ?' +
                                '</br><b>Opérateur : </b>' + oRecord.data.usr_nomprenom_realise +
                                '</br><b>Equipement : </b>' + oRecord.data.rsc_code +
                                '</br><b>Poste : </b>' + oRecord.data.pst_libelle,
                            buttons: Ext.Msg.YESNO,
                            icon: Ext.Msg.QUESTION,
                            /**
                             * @description déclenche l'action associée au bouton de la boite de message qui a été cliqué
                             * @param {Object} btn le bouton qui aura été cliqué
                             */
                            fn: function (btn) {
                                if (btn == 'yes') {
                                    // l'opérateur a validé la fin de l'activité, 
                                    // on déclenche la mise à jour des données 
                                    // et l'envoie du message ws pour informer les autres clients du réseau
                                    Ext.Ajax.request({
                                        url: 'server/act/Activities.php',
                                        params: {
                                            appName: Thot.app.appConfig.name,
                                            action: 'stopUnplanedActivity',
                                            act_id: oRecord.data.act_id,
                                        },
                                        success: function () {},
                                        failure: function () {},
                                        callback: function (opt, success, oResponse) {
                                            var oBack = Ext.decode(oResponse.responseText);

                                            if (oBack.success) {
                                                // envoie du message ws pour informer les clients du réseau
                                                oMain.fireEvent('send', 'maj', oForm.xtype, ['freealeas', 'currentAct', 'histoAct']);
                                                // mise àjour de la grille et uniquement celle-ci
                                                oGrid.getStore().reload();
                                            } else {
                                                oBack.oMsg = [];

                                                for (var iIndMsg in oBack.message) {
                                                    oBack.oMsg[iIndMsg] = Thot.app.MessageInfo();
                                                    oBack.oMsg[iIndMsg].init(5000);
                                                    oBack.oMsg[iIndMsg].msg("error", oBack.message[iIndMsg]);
                                                }
                                            }
                                        }
                                    });
                                }
                                // pas d'autre traitement, si l'opérateur a cliqué "non" on ferme le message tout simplement
                            }
                        });
                        break;
                }
                break;
            case 'odf_code':
            case 'opn_code':
                /* si pas d'of on ne fait rien */
                if (oRecord.data.oct_code == 'PROD' || oRecord.data.oct_code == 'QUAL') {
                    oMe.showForm({
                        widget: 'rapportof',
                        title: 'Rapport de l\'OF ' + oRecord.get('odf_code'),
                        alias: 'rptof',
                        height: 700,
                        width: 1100,
                        param: {
                            recordId: oRecord.get('odf_id'),
                            custom: oRecord
                        },
                        oncloseevent: 'listsRefresh'
                    });
                }
                break;
        }
    },
    /**
     * @author      Hervé Valot
     * @date        20190123
     * @description ouvre un formulaire en fonction des paramètres passés en objet
     * @param oParam objet contenant les paramètres du formulaire à afficher
     * @version     20190123 Création
     */
    showForm: function (oParam) {
        var oForm = this.getView();
        var oMain = oForm.up('app-main');

        var oWin = Thot.app.openWidget(oParam.widget, {
            title: oParam.title,
            alias: oParam.alias,
            modal: true,
            resizable: false,
            height: oParam.height,
            width: oParam.width,
            param: (oParam.param ? oParam.param : {})
        });

        oWin.on({
            'destroy': function () {
                oMain.fireEvent(oParam.oncloseevent);
            }
        });
    }
});