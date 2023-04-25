/**
 * @author Hervé Valot
 * @description Store des opérations complémentaires
 */
Ext.define('Thot.store.ope.OpCompListS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.ope.OpCompM',
    alias: 'store.opcomplist',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'server/ope/Operations.php?action=OpCompList',
        method: "POST",
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'liste',
            idProperty: 'opc_id',
            totalProperty: 'NbreTotal'
        }
    }
});