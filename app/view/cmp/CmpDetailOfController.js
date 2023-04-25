Ext.define('Thot.view.cmp.CmpDetailOfController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cmp-cmpdetailof',
    dataFields: {
        odf_date_creation: {
            convert: function (aDatas) {
                var sFormat = '';
                var sValue = aDatas['odf_date_creation'];

                if (arguments.length > 1) {
                    sFormat = arguments[1];
                }

                switch (sFormat) {
                    case 'sql':
                        return Ext.Date.toSql(sValue);
                        // break;
                    default:
                        return Ext.Date.explicitDate(Ext.String.toDate(sValue), false);
                        // break;
                }
            }
        },
        pdt_libelle: {
            template: new Ext.Template([
                '{pdt_complement}-{nce_libelle}-{pdt_libelle}'
            ])
        },
        gam_libelle: {
            template: new Ext.Template([
                '{gam_code} / {gam_libelle}'
            ])
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
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        var oParentFrm = oForm.up('form');

        if (oParentFrm.param) {
            oMe.loadDetail(oParentFrm.param.idenreg, null);
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
    onLoadDetail: function (ofNum) {
        var oMe = this;
        oMe.loadDetail(null, ofNum);
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
    loadDetail: function (id, ofNum) {
        var oMe = this;
        var oForm = this.getView();
        var oParentFrm = oForm.up('form');
        var oOpeGrd = oParentFrm.query('#operations')[0];
        var oOpeStr = oOpeGrd.getStore();
        var aFilter;

        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'ofDetail',
                odf_id: id,
                ofnum: ofNum
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                if (oBack.success) {
                    //---- On met à jour les champs du formulaire...
                    oParentFrm.updateForm(oBack.liste[0], oMe.dataFields);
                    aFilter = [{
                        type: 'odf_id',
                        value: oBack.liste[0].odf_id
                    }];
                    oOpeStr.setExtraParams({
                        storefilters: {
                            specfilter: aFilter
                        }
                    });

                    oOpeStr.on({
                        load: function () {}
                    });

                    oOpeStr.load();

                } else {
                    var oMsg = Thot.app.MessageInfo();

                    oMsg.init(5000);
                    oMsg.msg('error', 'Impossible de récupérer le détail de l\'OF ' + ofNum);
                }
            }
        });
    }
});