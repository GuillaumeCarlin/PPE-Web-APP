Ext.define('Thot.store.api.ApiUpdateS', {
    extend: 'Ext.data.Store',
    alias: 'store.apiupdates',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'server/api/Api.php?action=Update',
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