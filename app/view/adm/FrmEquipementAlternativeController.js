Ext.define('Thot.view.adm.FrmEquipementAlternativeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.adm-frmequipementalternative',

    /**
     * @author  Hervé Valot
     * @date    20190223
     * @description actions après chargement du formulaire
     * @version 20190223    création
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        // var oRscId = oForm.query('#rsc_id')[0];
        // var oGridReplacement = oForm.query('#gridreplacement')[0];
        // var oGridReplacementStore = oGridReplacement.getStore();

        // récupère l'id de l'equipement dans le tableau param de la fenêtre
        // et lance la fonction de chargement des données
        oMe.loadDetail(oForm.param.idenreg);
    },

    onCellClick: function (oView, oComp, iCellInd, oRecord) {
        var oGrid = oView.up('grid');
        var aColumns = oGrid.getColumns();
        // var oStore = oGrid.getStore();

        // on ne déclenche la mise à jour que si on clique dans la colonne des checkbox
        if (aColumns[iCellInd].dataIndex == 'selection') {
            Ext.Ajax.request({
                url: 'server/wst/WorkStn.php',
                params: {
                    appName: Thot.app.appConfig.name,
                    action: 'setReplacement',
                    selection: oRecord.data.selection | 0,
                    rsc_id_initial: this.getView().param.idenreg,
                    rsc_id_remplace: oRecord.data.rsc_id,
                },
                success: function () {},
                failure: function () {},
                callback: function (opt, success, oResponse) {
                    var oBack = Ext.decode(oResponse.responseText);

                    if (oBack.success) {
                        oGrid.refresh();
                        //oWstnSectionGrd.refresh();
                        // oWstnSectionGrd.getSelectionModel().select(oSection);
                        // oMe.sectionWstn(iSabId);
                    }
                },
            });

            // oStore.reload();
        }
        // "oRecord.data.selection | 0" transforme true en 1 et false en 0 pour envoie à la base de données
    },
    /**
     * @author : Hervé VALOT
     * @Description appelle la fonction de chargement des données du formulaire
     */
    onLoadDetail: function (id) {
        var oMe = this;

        oMe.loadDetail(id);
    },
    /**
     * @function loadDetail
     * @author  Hervé VALOT
     * @date    2019-03-10 16:49:47
     * @description Charge la liste des équipement du même secteur dans la grille pour définition des remplacements
     * @version 2019-03-10 Création
     */
    loadDetail: function (id) {
        var oMe = this;
        var oForm = oMe.getView();
        var oReplaceGrd = oForm.query('#gridreplacement')[0];
        var oReplaceStr = oReplaceGrd.getStore();
        var aFilter = [];
        // identification des objets du formulaire à mettre à jour
        const oRscCode = oForm.query('#rsc_code')[0],
            oRscLibelle = oForm.query('#rsc_libelle')[0],
            oRscEstInactf = oForm.query('#rsc_estinactif')[0],
            // les paramètres de l'équipement
            oOptImmateriel = oForm.query('#optimmateriel')[0],
            oOptPhysique = oForm.query('#optphysique')[0],
            oOptStandard = oForm.query('#optstandard')[0],
            oOptAutre = oForm.query('#optautre')[0],
            oChkAutonome = oForm.query('#chkautonome')[0],
            oChkMultipostes = oForm.query('#chkmultipostes')[0],
            oChkCollaboratif = oForm.query('#chkcollaboratif')[0],
            oChkLimite = oForm.query('#chklimited')[0],
            oFieldInstanceNumber = oForm.query('#fieldinstances')[0],
            oOptExterne = oForm.query('#optexterne')[0],
            oOptInterne = oForm.query('#optinterne')[0],
            oChkMarquage = oForm.query('#chktransfertmarquage')[0],
            oColosfolder = oForm.query('#colosfolder')[0],
            oChkspc = oForm.query('#chktransfertspc')[0];

        Ext.Ajax.request({
            // lancer la requête Ajax pour récupérer les paramètres de l'équipement
            url: 'server/adm/Admin.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'ParametresEqp',
                rsc_id: id, // identifiant de l'équipement
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                if (oBack.success) {
                    oRscCode.setValue(oBack.liste[0].rsc_code);
                    oRscLibelle.setValue(oBack.liste[0].rsc_libelle);
                    oRscEstInactf.setValue(
                        parseInt(oBack.liste[0].rsc_estinactif, 10),
                    );
                    // mise à jour des options du formulaire
                    if (oBack.liste[0].ext == 1) {
                        oOptExterne.setValue(true);
                        oOptInterne.setValue(false);
                    } else {
                        oOptExterne.setValue(false);
                        oOptInterne.setValue(true);
                    }
                    if (oBack.liste[0].imt == 1) {
                        // immatériel ou pas
                        oOptImmateriel.setValue(true);
                        oOptPhysique.setValue(false);
                    } else {
                        oOptImmateriel.setValue(false);
                        oOptPhysique.setValue(true);
                    }
                    if (oBack.liste[0].std == 1) {
                        // standard ou pas
                        oOptStandard.setValue(true);
                        oOptAutre.setValue(false);
                    } else {
                        oOptStandard.setValue(false);
                        oOptAutre.setValue(true);
                    }
                    // mise à jour des options pour les équipements autres que standard
                    oChkAutonome.setValue(parseInt(oBack.liste[0].aut, 10));
                    oChkMultipostes.setValue(parseInt(oBack.liste[0].mps, 10));
                    oChkCollaboratif.setValue(parseInt(oBack.liste[0].clb, 10));
                    oChkMarquage.setValue(parseInt(oBack.liste[0].mrk, 10));
                    oColosfolder.setValue(oBack.liste[0].mrkfolder);
                    oChkspc.setValue(parseInt(oBack.liste[0].fni, 10));
                    oChkLimite.setValue(
                        parseInt(oBack.liste[0].eqp_estlimite, 10),
                    );
                    oFieldInstanceNumber.setValue(
                        parseInt(oBack.liste[0].eqp_nombre_occurence),
                    );
                }
            },
        });

        // chargement de la grille de remplacements
        // préparation du filtre coté serveur
        aFilter.push({
            type: 'rsc_id',
            value: id,
        });
        aFilter.push({
            type: 'sab_id',
            value: oForm.param.custom.sab_id,
        });
        //appliquer le filtre
        oReplaceStr.setExtraParams({
            storefilters: {
                specfilter: aFilter,
            },
        });
        //chargement du store
        oReplaceStr.load();
    },
    /**
     * @author      Hervé VALOT
     * @function    onCancelClick
     * @description annulation de la modification des paramètres de l'équipement
     * @version     20190403 création
     */
    onCancelClick: function () {
        var oForm = this.getView();
        var oWin = oForm.up('window');
        oWin.close();
    },
    /**
     * @author      Hervé VALOT
     * @function    onValidClick
     * @description déclenche l'enregistrement des paramètres de l'équipement
     * @version     20190304 création
     */
    onValidClick: function () {
        var oForm = this.getView();
        var oWin = oForm.up('window');
        // lancer la requête Ajax pour enregistrer les paramètres
        Ext.Ajax.request({
            url: 'server/adm/Admin.php',
            // lire les objets du formulaire pour passer leurs valeurs au backend
            params: {
                appName: Thot.app.appConfig.name,
                action: 'SetParametresEqp',
                rsc_id: oForm.param.idenreg,
                // rsc_code: oForm.query('#rsc_code')[0].getValue(),
                // rsc_libelle: oForm.query('#rsc_libelle')[0].getValue(),
                rsc_estinactif: oForm.query('#rsc_estinactif')[0].getValue(),
                ext: oForm.query('#optexterne')[0].getValue(),
                eqp_estacquisitionauto: oForm
                    .query('#chkautocount')[0]
                    .getValue(),
                eqp_estlimite: oForm.query('#chklimited')[0].getValue(),
                eqp_nombre_occurence: oForm
                    .query('#fieldinstances')[0]
                    .getValue(),
                imt: oForm.query('#optimmateriel')[0].getValue(),
                std: oForm.query('#optstandard')[0].getValue(),
                aut: oForm.query('#chkautonome')[0].getValue(),
                mps: oForm.query('#chkmultipostes')[0].getValue(),
                clb: oForm.query('#chkcollaboratif')[0].getValue(),
                mrk: oForm.query('#chktransfertmarquage')[0].getValue(),
                mrkfolder: oForm.query('#colosfolder')[0].getValue(),
                fni: oForm.query('#chktransfertspc')[0].getValue(),
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                if (oBack.success) {
                    // on ferme le formulaire
                    oWin.close();
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg(
                        'error',
                        "Impossible d'enregistrer les paramètres de l'équipement !",
                    );
                }
            },
        });
    },
});
