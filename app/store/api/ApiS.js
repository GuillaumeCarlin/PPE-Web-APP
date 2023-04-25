Ext.define('Thot.store.api.ApiS', {
    extend: 'Ext.data.Store',
    alias: 'store.apis',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'server/api/Api.php?action=LstAPK',
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