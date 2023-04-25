Ext.define("Thot.view.api.FormNewKeyController", {
    extend: "Ext.app.ViewController",
    alias: "controller.api-formnewkey",

    onAfterRender: function () {
        var oForm = this.getView();
        oForm.query("#RessourceList")[0].getStore().load();
        // var oWin = oForm.up("window");
    },

    ClickCheckBox: function () {
        var oForm = this.getView();
        oForm.query("#Code")[0].setDisabled(oForm.query("#checkGen")[0].getValue());
    },

    // onRscSelect: function (oCombo, oItem) {},

    AppCheckBox: function () {
        var oForm = this.getView();
        var oCombo = oForm.query("#RessourceList")[0].getStore();
        var aFilter;
        if (oForm.query("#CheckAPP")[0].getValue() == true) {
            aFilter = [
                {
                    type: "App",
                    value: 1
                }
            ];
            oCombo.setExtraParams({
               storefilters: {
                   specfilter: aFilter
               }
           });
           oCombo.reload();
        }else{
            aFilter = [{
                type: 'App',
                value: 0
            }];
            oCombo.setExtraParams({
                storefilters: {
                    specfilter: aFilter
                }
            });
            oCombo.reload();
        }
    },

    validSelect: function () {
        var oForm = this.getView();
        var flag = true;
        var i = 0;
        var Data;
        // var Key;
        var Boolapp;
        var IdRessource;
        while (flag) {
            if (oForm.query("#RessourceList")[0].getStore().getData().items[i].get("rsc_id") == oForm.query("#RessourceList")[0].getValue()) {
                flag = false;
                Data = oForm.query("#RessourceList")[0].getStore().getData().items[i];
            } else {
                i = i + 1;
            }
        }
        // if (oForm.query("#checkGen")[0].getValue() == true) {
        //     Key = null;
        // } else {
        //     Key = oForm.query("#Code")[0].getValue();
        // }

        if (Data.get("rst_id") == 5) {
            Boolapp = 1;
        } else {
            Boolapp = 0;
        }
        IdRessource = oForm.query("#RessourceList")[0].getValue();
        Ext.Ajax.request({
            url: "server/api/Api.php",
            params: {
                appName: Thot.app.appConfig.name,
                action: "Insert",
                boolapp: Boolapp,
                rsc_id: IdRessource
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                if (oBack.success) {
                    if (oBack["liste"][0]["reussis"] == "true") {
                        // oWin.close();
                    } else {
                        oForm.query("#ErrorField")[0].setValue(oBack["liste"][0]["erreurcode"] + oBack["liste"][0]["erreur"]);
                    }
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", oBack.errorMessage.message);
                }
            }
        });
    }
});
