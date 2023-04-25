Ext.define('Thot.store.stat.StatistiqueInformationPersonneSheetS', {
    extend: 'Ext.data.Store',
    alias: 'store.informationpersonnesheet',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'server/stat/Statistique.php?action=infopersonnesheet',
        method: "POST",
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'liste',
            idProperty: 'stat_id',
            totalProperty: 'NbreTotal'
        },
    },
});