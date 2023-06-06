Ext.define("Thot.view.api.ContainerAPIController", {
    extend: "Ext.app.ViewController",
    alias: "controller.main-containerapi",

    onAfterRender: function () {
        var oForm = this.getView();

        var oLstAPK = oForm.query("#ListeAPK")[0];
        var oLstAPKStore = oLstAPK.getStore();
        oLstAPKStore.load();
    },

    onGridsRefresh: function () { },

    ListeAPKRefresh: function (aFilter) {
        var oForm = this.getView();
        var oLstAPK = oForm.query("#ListeAPK")[0];
        var oLstAPKStore = oLstAPK.getStore();
        oLstAPKStore.reload();
    },

    onOperationClick: function (oGrid, oRecord, eOpts) {
        var oForm = this.getView();
        oForm.query("#Rsc_ID")[0].setValue(oRecord.data.RSC_ID);
        oForm.query("#CodeAPK")[0].setValue(oRecord.data.APK_CODE);
        oForm.query("#btnUpdateRapide")[0].setDisabled(false);
        oForm.query("#CodeAPK")[0].setDisabled(false);
    },

    Update: function () {
        var oForm = this.getView();
        var Test = oForm.query("#ListeAPK")[0].getSelection()[0];
        var Boolapp = Test.get("BoolApp");
        var Id = Test.get("RSC_ID");
        var Key = oForm.query("#CodeAPK")[0].getValue();
        Ext.Ajax.request({
            url: "server/api/Api.php",
            params: {
                appName: Thot.app.appConfig.name,
                action: "Update",
                boolapp: Boolapp,
                rsc_id: Id,
                key: Key
            },
            success: function () { },
            failure: function () { },
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    var oLstAPK = oForm.query('#ListeAPK')[0];
                    var oLstAPKStore = oLstAPK.getStore()
                    oLstAPKStore.reload();
                    oForm.query("#btnUpdateRapide")[0].setDisabled(true);
                    oForm.query("#Rsc_ID")[0].setDisabled(true);
                    oForm.query("#CodeAPK")[0].setDisabled(true);

                    if (oBack["liste"][0]["reussis"] == "true") {
                        oForm.query("#result")[0].setValue(oBack["liste"][0]["information"]);
                    } else {
                        oForm.query("#result")[0].setValue(oBack["liste"][0]["erreurcode"] + oBack["liste"][0]["erreur"]);
                    }
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", oBack.errorMessage.message);
                }
            }
        });
    },

    UpdateRapide: function () {
        var oForm = this.getView();
        var Test = oForm.query("#ListeAPK")[0].getSelection()[0];
        var Boolapp = Test.get("BoolApp");
        var Id = Test.get("RSC_ID");

        Ext.Ajax.request({
            url: "server/api/Api.php",
            params: {
                appName: Thot.app.appConfig.name,
                action: "Update",
                boolapp: Boolapp,
                rsc_id: Id
            },
            success: function () { },
            failure: function () { },
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                if (oBack.success) {
                    var oLstAPK = oForm.query("#ListeAPK")[0];
                    var oLstAPKStore = oLstAPK.getStore();
                    oLstAPKStore.reload();
                    oForm.query("#btnUpdateRapide")[0].setDisabled(true);
                    oForm.query("#Rsc_ID")[0].setDisabled(true);
                    oForm.query("#CodeAPK")[0].setDisabled(true);
                    if (oBack["liste"][0]["reussis"] == "true") {
                        oForm.query("#result")[0].setValue(oBack["liste"][0]["information"]);
                    } else {
                        oForm.query("#result")[0].setValue(oBack["liste"][0]["erreurcode"] + oBack["liste"][0]["erreur"]);
                    }
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", oBack.errorMessage.message);
                }
            }
        });
    },

    NewKey: function () {
        var oWin = Thot.app.openWidget("newkey", {
            title: Thot.Labels.actions.NewKeyAPK.title,
            alias: "formnewkey",
            modal: true,
            resizable: false,
            height: 250,
        });
    },

    Refresh: function () {
        var oLstAPK = this.getView().query("#ListeAPK")[0];
        var oLstAPKStore = oLstAPK.getStore();
        oLstAPKStore.reload();
    }
});
