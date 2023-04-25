Ext.define('Thot.store.stat.StatistiqueSheetUserS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.stat.StatistiqueSheetUserM',
    alias: 'store.statusersheet',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'server/stat/Statistique.php?action=LstEquipe',
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