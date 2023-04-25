Ext.define('Thot.store.adm.EqpReplacementS', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.eqpreplacement',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'server/adm/Admin.php?action=eqpListReplacement',
        method: "POST",
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'liste',
            idProperty: 'rsc_id',
            totalProperty: 'NbreTotal'
        }
    }
});