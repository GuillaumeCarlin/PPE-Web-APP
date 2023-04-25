Ext.define("Thot.view.adm.cfg.CmpCfgToleranceController", {
    extend: "Ext.app.ViewController",
    alias: "controller.adm-cfg-cmpcfgtolerance",

    onAfterRender: function () {
        this._getToleranceParametre();
    },

    enableApplyBtn: function () {
        this.getView().query("#btnApply")[0].setDisabled(false);
    },

    _getToleranceParametre: function () {
        var oForm = this.getView();
        // lance la requête AJAX
        Ext.Ajax.request({
            url: "server/adm/Admin.php",
            params: {
                appName: Thot.app.appConfig.name,
                action: "getToleranceParam"
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    if (parseInt(oBack.liste[0].bool) == 1) {
                        oForm.query("#toleranceS")[0].setValue(oBack.liste[0].tolerance);
                        oForm.query("#symetrie")[0].setValue(false);
                    } else {
                        oForm.query("#symetrie")[0].setValue(true);
                        oForm.query("#toleranceAMax")[0].setValue(oBack.liste[0].tolerancemax);
                        oForm.query("#toleranceAMin")[0].setValue(oBack.liste[0].tolerancemin);
                    }
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", oBack.errorMessage.message);
                }
                oForm.query("#btnApply")[0].setDisabled(true);
            }
        });
    },

    onApplyClick: function () {
        var oForm = this.getView();
        if (oForm.query("#symetrie")[0].getValue() == false) {
            this._SetToleranceParametre("ToleranceS", oForm.query("#toleranceS")[0].getValue());
        } else {
            this._SetToleranceParametre("ToleranceAMax", oForm.query("#toleranceAMax")[0].getValue());
            this._SetToleranceParametre("ToleranceAMin", oForm.query("#toleranceAMin")[0].getValue());
        }
        oForm.query("#btnApply")[0].setDisabled(true);
    },

    _SetToleranceParametre: function (sParametre, sValeur) {
        oForm = this.getView();
        // lance la requête AJAX
        Ext.Ajax.request({
            url: "server/adm/Admin.php",
            params: {
                appName: Thot.app.appConfig.name,
                action: "setToleranceParam",
                parametre: sParametre,
                value: sValeur
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (!oBack.success) {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", oBack.errorMessage.message);
                }
            }
        });
    },

    _SetToleranceAParametre: function (sParametre, ValeurMax, ValeurMin) {
        oForm = this.getView();
        // lance la requête AJAX
        Ext.Ajax.request({
            url: "server/adm/Admin.php",
            params: {
                appName: Thot.app.appConfig.name,
                action: "setToleranceParam",
                parametre: sParametre,
                valueMax: ValeurMax,
                valueMin: ValeurMin
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (!oBack.success) {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", oBack.errorMessage.message);
                }
            }
        });
    }
});
