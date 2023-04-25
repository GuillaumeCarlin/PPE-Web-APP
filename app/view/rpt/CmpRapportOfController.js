Ext.define('Thot.view.rpt.CmpRapportOfController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.rpt-cmprapportof',
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
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        /*
        //---- ...la grille des opérations
        var oOpeGrd = oForm.query('#operations')[0];
        var oOpeStr = oOpeGrd.getStore();
        var aFilter = [{
        		type: 'odf_id',
        		value: oForm.param.idenreg
        	}];

        oOpeStr.setExtraParams({
        	storefilters: {
        		specfilter: aFilter
        	}
        });

        oOpeStr.on({
        	load: function() {
        	}
        });

        oOpeStr.load();
        */
    },

    /**
     * @author Hervé Valot
     * @description actions sur sélection d'une ligne dans la grille des opérations
     * @date 20200820
     * @param {*} oGrid la grille des opérations
     * @param {*} oRecord l'enregistrement sélectionné
     * @param {*} eOpts options supplémentaires
     */
    onOperationClick: function (oGrid, oRecord, eOpts) {
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
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onCancelClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oWin = oForm.up('window');
        oWin.close();
    }
});