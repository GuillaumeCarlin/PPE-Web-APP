/**
 * @author Hervé VALOT
 * @description controlleur du composant d'affichage des informations de production d'une activité
 */
Ext.define('Thot.view.cmp.CompActProdDetController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cmp-compactproddet',

    onAfterRender: function () {
        var oMe = this,
            oComp = oMe.getView(),
            oForm = oComp.up('panel'),
            // var oActDetProd = oComp.query('#actDetProd')[0];
            oOfQty = oComp.query('#qtyOF')[0],
            oOfQtyMax = oComp.query('#ofQtyMax')[0],
            oOfQtyMin = oComp.query('#ofQtyMin')[0],
            oQtyPrevOpe = oComp.query('#qtyPrevOpe')[0],
            oRebuts = oComp.query('#rebuts')[0],
            oOpeNptr = oComp.query('#openptr')[0],
            oExpectedMin = oComp.query('#expectedMin')[0],
            oExpectedMax = oComp.query('#expectedMax')[0],
            oExpectedQty = oComp.query('#expectedQty')[0],
            oActDuration = oComp.query('#actDuration')[0],
            oProdDuration = oComp.query('#prodDuration')[0],
            oOpeTempsGamme = oComp.query('#opeTempsGamme')[0],
            oNptr = oComp.query('#nptr')[0],
            oAltCode = oComp.query('#alt_code')[0],
            oTmpl = new Ext.Template([
                '<span >{min}</span>&nbsp;&lt;&nbsp;',
                '<span style="font-weight: bold;">{norm}</span>&nbsp;&lt;&nbsp;',
                '<span >{max}</span>'
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
                    var fGamAllocatedDuration = parseFloat((oComp.record.ope_temps_unitaire_j) * 86400);

                    // mise à jour des données affichées
                    oOfQtyMax.setValue(Ext.util.Format.number(oComp.record.qpamax_rbt, '0'));
                    oOfQtyMin.setValue(Ext.util.Format.number(oComp.record.qpamin_rbt, '0'));
                    // code du type de l'aléa
                    oAltCode.setValue(oComp.record.alt_code);

                    oQtyPrevOpe.setValue(Ext.util.Format.number(oComp.record.qdr, '0'));
                    oActDuration.setValue(oComp.record.act_duree_hms_brute);
                    oProdDuration.setValue(oComp.record.act_duree_hms);
                    oOpeTempsGamme.setValue(Thot.com.dt.DateTimeCalc.convertSecToHMS(fGamAllocatedDuration));
                    // NPTR théo/Max/Min
                    // oNptr.setValue(nNptr);
                    // oExpectedMax.setValue(Ext.util.Format.number(iNptrMax));
                    // oExpectedMin.setValue(Ext.util.Format.number(iNptrMin));
                    oNptr.setValue(parseInt(oComp.record.nptr));
                    oExpectedMax.setValue(parseInt(oComp.record.nptrmax));
                    oExpectedMin.setValue(parseInt(oComp.record.nptrmin));
                    // Quantité attendue corrigée par déduction du nombre de rebuts déclarés
                    oExpectedQty.setValue(Ext.util.Format.number(oComp.record.odf_quantiteattendue));
                    // total rebuts sur l'OF
                    oRebuts.setValue(Ext.util.Format.number(oComp.record.qterebuttotal));
                    oOfQty.setValue(Ext.util.Format.number(oComp.record.odf_quantiteattendue, '0'));

                    // affichage du NPTR et de ses bornes MAX et Min
                    if (parseInt(oComp.record.oct_id) == 1 || oComp.record.oct_id == '1') {
                        oOpeNptr.setValue(oTmpl.apply({
                            // min: iNptrMin,
                            // norm: nNptr,
                            // max: iNptrMax
                            min: parseInt(oComp.record.nptrmin),
                            norm: parseInt(oComp.record.nptr),
                            max: parseInt(oComp.record.nptrmax)
                        }));
                    }
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', 'Impossible de récupérer le détail de l\'activité');
                }
            }
        });
    },

});