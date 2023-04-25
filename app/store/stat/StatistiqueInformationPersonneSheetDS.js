Ext.define("Thot.store.stat.StatistiqueInformationPersonneSheetDS", {
    extend: "Ext.data.Store",
    alias: "store.informationpersonnesheetd",
    autoLoad: false,
    proxy: {
        type: "ajax",
        url: "server/stat/Statistique.php?action=infopersonnesheetd",
        method: "POST",
        actionMethods: {
            read: "POST"
        },
        reader: {
            type: "json",
            rootProperty: "liste",
            idProperty: "stat_id",
            totalProperty: "NbreTotal"
        }
    }
});
