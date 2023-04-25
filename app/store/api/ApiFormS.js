Ext.define('Thot.store.api.ApiFormS', {
    extend: 'Ext.data.Store',
    alias: 'store.apiforms',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'server/api/Api.php?action=listRscSansKey',
        method: "POST",
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'liste',
            idProperty: 'rsc_id',
            totalProperty: 'NbreTotal'
        },
    },
});