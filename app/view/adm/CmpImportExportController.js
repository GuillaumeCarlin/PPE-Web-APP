Ext.define('Thot.view.adm.CmpImportExportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.adm-cmpimportexport',
    /**
     * @author : edblv
     * date   : 15/09/16 10:12
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = oMe.getView();
        //var oModulesPck = oForm.query('#modules')[0];
        var oModulesTvw = oForm.query('#modules')[0]; //oModulesPck.getPicker();

        oModulesTvw.setStore(Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            root: {
                ecs_libelle: 'Tout',
                expanded: true,
                checked: false
            },
            proxy: {
                type: 'ajax',
                url: 'server/adm/Admin.php?action=LstImportProc',
                reader: {
                    type: 'json',
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeLoad: function (oStore, oParam) {
                    oStore.getProxy().extraParams.appName = Thot.app.appConfig.name;
                }
            }
        }));

        oModulesTvw.getStore().load();
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
    onCheckChange: function (oNode, bChecked) {
        var oMe = this;
        var oForm = oMe.getView();
        var oModulesTvw = oForm.query('#modules')[0];
        var oImportBtn = oForm.query('#importBtn')[0];
        var aSelected = [];

        oNode.cascadeBy(function (oChild) {
            oChild.set('checked', bChecked);
        });

        aSelected = oModulesTvw.getChecked();

        if (aSelected.length > 0) {
            oImportBtn.setDisabled(false);
        } else {
            oImportBtn.setDisabled(true);
        }
    },

    /**
     * @author : edblv
     * date   : 15/09/16 15:57
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Importer'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onImportClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oModulesTvw = oForm.query('#modules')[0];
        var aSelected = oModulesTvw.getChecked();

        oForm.importProc = {
            ech_id: 0,
            modules: aSelected.reverse(),
            ind: 0
        };

        Ext.Ajax.request({
            url: 'server/adm/Admin.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'ImportStart'
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    oForm.importProc.ech_id = oBack.output[0].ech_id;
                    oMe.importProc();
                }
            }
        });
    },
    /**
     * @author : edblv
     * date   : 19/09/16 11:08
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Déclenchée par 'onImportClick' pour lancer le prochain module d'import de la liste
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    importProc: function () {
        var oMe = this;
        var oForm = this.getView();
        // var oImportMsg = oForm.query('#importMsg')[0];
        var oMain = Thot.app.viewport;

        if (oForm.importProc.ind < oForm.importProc.modules.length) {
            //---- On met le status à 0 pour faire tourner l'icone
            oForm.importProc.modules[oForm.importProc.ind].set('status', -1, {
                commit: true
            });

            //---- On demande à ExtJs d'être patient...!
            Ext.Ajax.setTimeout(120000);

            Ext.Ajax.request({
                url: 'server/adm/Admin.php',
                params: {
                    appName: Thot.app.appConfig.name,
                    action: 'ImportProc',
                    ech_id: oForm.importProc.ech_id,
                    ecs_libelle: oForm.importProc.modules[oForm.importProc.ind].get('ecs_libelle'),
                    ecs_proc: oForm.importProc.modules[oForm.importProc.ind].get('ecs_procedure'),
                    ecs_trigrm: oForm.importProc.modules[oForm.importProc.ind].get('ecs_trigramme')
                },
                success: function () {},
                failure: function () {},
                callback: function (opt, success, oResponse) {
                    var oBack = Ext.decode(oResponse.responseText);

                    //---- Mise à jour du store et appel de la procédure d'import suivante
                    if (oBack.success) {
                        oForm.importProc.modules[oForm.importProc.ind].set('status', 1, {
                            commit: true
                        });
                        // mise à jour de la date de début de l'étape, pour conserver le statut et la date en visuel,
                        // l'enregistrement en base est réalisé par le script SQL.
                        oForm.importProc.modules[oForm.importProc.ind].set('ece_date_debut', Ext.Date.format(new Date(), 'Y-m-d H:i:s'), {
                            commit: true
                        });

                        oForm.importProc.ind++;
                    } else {
                        oForm.importProc.modules[oForm.importProc.ind].set('status', 2, {
                            commit: true
                        });
                        oForm.importProc.ind = oForm.importProc.modules.length;
                    }

                    oMe.importProc();
                }
            });
        } else {
            //---- Fin de la procédure d'import
            Ext.Ajax.request({
                url: 'server/adm/Admin.php',
                params: {
                    appName: Thot.app.appConfig.name,
                    action: 'ImportEnd',
                    ech_id: oForm.importProc.ech_id
                },
                success: function () {},
                failure: function () {},
                callback: function (opt, success, oResponse) {
                    var oBack = Ext.decode(oResponse.responseText);
                    var sMessage = '';

                    if (oBack.success) {
                        //---- Si l'activité à bien été créée, on envoie le message Websocket
                        oMain.fireEvent('send', 'maj', oForm.xtype, ['appadmin']);

                        // NOTE: HVT 2021-03-19 10:01:45 rapport import retiré, obsolete et incoherent (demande FBN)
                        // if (oBack.output.eqp > 0) {
                        //     sMessage = oBack.output.eqp + ' équipement(s) en erreur.';
                        // }

                        // if (oBack.output.usr > 0) {
                        //     sMessage += oBack.output.usr + ' opérateur(s) en erreur.';
                        // }

                        // oImportMsg.setValue(sMessage);
                    }
                }
            });
        }
    },
    /**
     *  @author Hervé Valot
     *  @date   20190722
     *  @description    réinitialise l'arbre des importations en rechargenant le store
     *  @description    efface les indicateurs d'importation et met à jour les dates d'import
     */
    onInitClick: function () {
        // recherche le store de l'arbre d'importation
        var oForm = this.getView(),
            oModulesTvw = oForm.query('#modules')[0],
            oMudulesTvwStore = oModulesTvw.getStore(),
            oImportMsg = oForm.query('#importMsg')[0];

        // mise  àjour du store pour reflêter les dernières modifications
        oMudulesTvwStore.data.clear();
        oMudulesTvwStore.load();

        // effacer le compte-rendu de l'import précédent
        oImportMsg.setValue('');
    }
});