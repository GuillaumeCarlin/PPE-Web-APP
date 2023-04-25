Ext.define('Thot.view.main.ListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.list',
    /**
     * @author : edblv
     * date   : 11/07/16 15:59
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Raffraichit toute les grilles du formulaire
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onGridsRefresh: function (aFilter) {
        var oMe = this;
        var oForm = oMe.getView();
        var oCurrentAct = oForm.query('#currentactivities')[0];
        //var oHistoAct = oForm.query('#histoactivities')[0];
        var oAlertsGrd = oForm.query('#grdAlerts')[0];
        var oAlertsStr = oAlertsGrd.getStore();

        oAlertsStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        oAlertsStr.load();

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
    onAlertClick: function (oGrid, oRecord) {
        var oMe = this;
        var oForm = oMe.getView();
        var oMain = oForm.up('app-main');
        var oAlertsGrd = oForm.query('#grdAlerts')[0];
        var bAlertDet = false;
        var sAlertWdg = 'alertdetail';

        //---- On cherche si le nom de ce formulaire est présent dans l'objet Thot.app.appConfig.process
        // et si c'est le cas, si l'utilisateur courant a des droits dessus
        if (Thot.app.appConfig.process[sAlertWdg]) {
            if (Thot.app.appConfig.process[sAlertWdg].users.indexOf(Thot.app.cnxParams.login) > -1) {
                //---- Le user courant est identifié comme pouvant faire des modif
                bAlertDet = true;
            }
        }

        if (bAlertDet) {
            var oWin = Thot.app.openWidget("alertdetail", {
                title: Thot.Labels.labels.alerts.detail,
                alias: 'alertdet',
                modal: true,
                param: {
                    recordId: oRecord.get('act_id'),
                    custom: {
                        alr_id: oRecord.get('alr_id')
                    }
                },
                resizable: true,
                height: 550,
                width: 900
            });

            oWin.on({
                'destroy': function (oWin) {
                    //oMe.actRefresh();
                    oMain.fireEvent('listsRefresh');
                    oAlertsGrd.refresh();
                }
            });
        }

    },

});