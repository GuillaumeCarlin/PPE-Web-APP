Ext.define('Thot.view.cmp.CompActDetController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cmp-compactdet',
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
        var oComp = this.getView();
        var oForm = oComp.up('panel');
        var oRecord = {};
        var oOrgId = oComp.query('#org_id')[0];
        var oPrevOpe = oComp.query('#opnp_estterminee')[0];
        // var oNptr = oComp.query('#nptr')[0];
        var oStatus = oComp.query('#status')[0];
        var oDateDebut = oComp.query('#datedebut')[0];
        var oWorkStn = oComp.query('#workstn')[0];
        var oOperator = oComp.query('#operator')[0];
        var oOf = oComp.query('#of')[0];
        var oOperation = oComp.query('#operation')[0];
        var oProduct = oComp.query('#product')[0];
        var oPoste = oComp.query('#poste')[0];
        var oAleaType = oComp.query('#alt_code')[0];
        var oOfTmpl = new Ext.Template([
            '<span class="thot-bold-label thot-maxsized-info">{OfNum}</span>'
        ]);

        oComp.record = [];

        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'ActDetail',
                act_id: oForm.param.idenreg
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    oComp.record = oBack.liste[0];
                    //---- Nbre de sec. / piéce
                    var fTmpUnitSec = Math.ceil((parseFloat(oComp.record.ope_temps_unitaire_j) * 24) * 3600);
                    //---- Durée totale de l'activité
                    var iActDuration = Ext.String.toSeconds(oComp.record.act_duree_hms);
                    //---- Durée totale des aléas
                    var iAleaDuration = Ext.String.toSeconds(oComp.record.tempsalea_hms);
                    //---- Durée de production (Activité - Aléas)
                    var iProdDuration = iActDuration - iAleaDuration;

                    if (parseInt(oComp.record.act_estencours) == 1) {
                        // l'activité est en cours, on vérifie si elle est sous aléa
                        if (oComp.record.ala_id > 0) {
                            oStatus.setValue('<span style="margin-right: 10px;" class="thot-alert-sticky-info">' + oComp.record.ald_libelle + '</br></span><span>Depuis le </span>' + Ext.Date.format(Ext.String.toDate(oComp.record.ala_date_debut), 'd/m/Y H:i:s'));
                        } else {
                            oStatus.setValue('En cours');
                        }
                    } else {
                        oStatus.setValue('Terminée');
                    }

                    oOrgId.setValue(oComp.record.org_id);
                    oPrevOpe.setValue(oComp.record.opnp_estterminee);

                    oWorkStn.setValue(oComp.record.eqp_code + ' / ' + oComp.record.eqp_libelle);
                    oOperator.setValue(oComp.record.usr_prenom + ' ' + oComp.record.usr_nom);

                    // oOf.setValue(oComp.record['odf_code']);
                    oOf.setValue(oOfTmpl.apply({
                        OfNum: oComp.record.odf_code
                    }));
                    oOperation.setValue(oComp.record.opn_code);
                    oProduct.setValue(oComp.record.pdt_complement + ' - ' + oComp.record.nce_libelle + ' / ' + oComp.record.pdt_libelle);
                    oDateDebut.setValue(Ext.Date.format(Ext.String.toDate(oComp.record.act_date_debut), 'd/m/Y H:i:s'));
                    oPoste.setValue(oComp.record.pst_libelle);
                    oAleaType.setValue(oComp.record.alt_code);
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', 'Impossible de récupérer le détail de l\'activité');
                }
            }
        });

    }
});