Ext.define('Thot.store.ope.OfOperListCslS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.ope.OfOperListM',
    alias: 'store.ofoperationslistcsl',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'server/ope/Operations.php?action=realOpeOfCsl',
        method: "POST",
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'liste',
            idProperty: 'opn_id',
            totalProperty: 'NbreTotal'
        }
    }
});