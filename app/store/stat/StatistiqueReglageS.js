Ext.define('Thot.store.stat.StatistiqueReglageS', {
    extend: 'Ext.data.Store',
    alias: 'store.statreglage',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'server/stat/Statistique.php?action=LstAlerte',
        method: 'POST',
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