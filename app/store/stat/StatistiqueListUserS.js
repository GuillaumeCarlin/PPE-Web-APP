Ext.define('Thot.store.stat.StatistiqueListUserS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.stat.StatistiqueListUserM',
    alias: 'store.statuserlist',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'server/stat/Statistique.php?action=LstUser',
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