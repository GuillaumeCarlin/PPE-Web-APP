Ext.define("Thot.view.stat.CmpListEquipeController", {
    extend: "Ext.app.ViewController",
    alias: "controller.stat-cmplistequipe",

    onAfterRender: function () {
        var oMe = this;
        var oForm = oMe.getView();
        var oListeUser = oForm.query("#ListeUser")[0];
        var oListeUserStore = oListeUser.getStore();
        var aFilter;

        aFilter = [
            {
                type: "parametre",
                value: "Automatique"
            },
            {
                type: "ShowDelete",
                value: "false"
            },
            {
                type: "org",
                value: 3
            }
        ];

        oListeUserStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oListeUserStore.load();
    },

    onGridRefresh: function (aFilter) {
        var oMe = this;
        var oForm = oMe.getView();
        var oGridNotes = oForm.query("#ListeUser")[0];
        var oGridNotesStore = oGridNotes.getStore();
        oGridNotesStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oGridNotesStore.reload();
    },

    refresh: function (aFilter) {
        var oMe = this;
        var oForm = oMe.getView();
        var oGridNotes = oForm.query("#ListeUser")[0];
        var oGridNotesStore = oGridNotes.getStore();
        oGridNotesStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oGridNotesStore.reload();
    },

    onOperationClick: function (oGrid, oRecord, eOpts) {
        var oForm = this.getView();
        var Image = oRecord.data.Image;
        oForm.query("#Nom")[0].setValue(oRecord.data.Nom + " " + oRecord.data.Prenom);
        oForm.query("#Equipe")[0].setValue(oRecord.data.Equipe);
        oForm.query("#Poste")[0].setValue(oRecord.data.Libelle);
        oForm.query("#Atelier")[0].setValue(oRecord.data.atelier);
        oForm.query("#tempsexiger")[0].setValue(oRecord.data.TpsExigible);
        oForm.query("#tempspointe")[0].setValue(oRecord.data.TpsPointe);
        oForm.query("#Img")[0].setSrc("resources/images/" + Image);
        //oForm.query('#Image')[0].setValue(oRecord.data.image);
        var Liste = oRecord.data.Date;
        var dateField = Liste[6] + Liste[7] + "/" + Liste[4] + Liste[5] + "/" + Liste[0] + Liste[1] + Liste[2] + Liste[3];
        oForm.query("#date")[0].setValue(dateField);

        var oInfoPersonneSheet = oForm.query("#InformationPersonneSheetA")[0];
        var oInfoPersonneSheetD = oForm.query("#InformationPersonneSheetD")[0];
        var aFilter;
        aFilter = [
            {
                type: "identifiant",
                value: oRecord.data.Id
            },
            {
                type: "date",
                value: oRecord.data.Date
            }
        ];
        oInfoPersonneSheet.getStore().setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oInfoPersonneSheetD.getStore().setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oInfoPersonneSheet.getStore().load();
        oInfoPersonneSheetD.getStore().load();
    }
});
