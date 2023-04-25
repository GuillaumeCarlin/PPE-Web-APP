Ext.define("Thot.view.stat.CmpReglageController", {
    extend: "Ext.app.ViewController",
    alias: "controller.stat-cmpreglage",

    onAfterRenderC: function () {
        var oForm = this.getView();
        var oGridC = oForm.query('#ListeAlerteC')[0];
        var aFilter = [{
            type: 'niveau',
            value: 2
        },{
            type: 'org',
            value: Thot.app.getSection().idsection
        }];
        var oGridCStore = oGridC.getStore();
        oGridCStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oGridCStore.load();
    },

    onAfterRenderM: function () {
        var oForm = this.getView();
        var oGridM = oForm.query("#ListeAlerteM")[0];
        var aFilter = [
            {
                type: "niveau",
                value: 1
            },
            {
                type: "org",
                value: Thot.app.getSection().idsection
            }
        ];
        var oGridMStore = oGridM.getStore();
        oGridMStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oGridMStore.load();
    },

    refresh: function (Filtre) {
        var aFilter = Filtre;
        var oForm = this.getView();
        var oGridAlerteC = oForm.query("#ListeAlerteC")[0];
        var oGridAlerteStoreC = oGridAlerteC.getStore();

        var oGridAlerteM = oForm.query("#ListeAlerteM")[0];
        var oGridAlerteStoreM = oGridAlerteM.getStore();
        var aFilterC = Object.assign([], aFilter);
        var aFilterM = Object.assign([], aFilter);

        aFilterC.push({ type: "niveau", value: 2 });

        aFilterM.push({ type: "niveau", value: 1 });

        oGridAlerteStoreC.setExtraParams({
            storefilters: {
                specfilter: aFilterC
            }
        });

        oGridAlerteStoreM.setExtraParams({
            storefilters: {
                specfilter: aFilterM
            }
        });

        oGridAlerteStoreC.reload();
        oGridAlerteStoreM.reload();
    },

    onGridRefreshM: function (Filtre) {
        var aFilter = Filtre;
        var oForm = this.getView();
        var oGridNotes = oForm.query("#ListeAlerteM")[0];
        var oGridNotesStore = oGridNotes.getStore();
        aFilter.push({ type: "niveau", value: 1 });
        oGridNotesStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oGridNotesStore.reload();
    },

    onGridRefreshC: function (Filter) {
        var aFilter = Filter
        var oForm = this.getView();
        var oGridNotes = oForm.query("#ListeAlerteC")[0];
        var oGridNotesStore = oGridNotes.getStore();
        aFilter.push({ type: "niveau", value: 2 });
        oGridNotesStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oGridNotesStore.reload();
    }
});
