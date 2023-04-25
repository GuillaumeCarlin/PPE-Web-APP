/**
 * @author Hervé Valot
 * @description Store des activités liées à une opération passée en paramètre
 * @date 20200820
 */
Ext.define('Thot.store.act.ActivitiesOpnS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.act.ActivitieOpnM',
    alias: 'store.activitiesopn',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'server/act/Activities.php?action=LstActOpn',
        method: 'POST',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'liste',
            idProperty: 'act_id',
            totalProperty: 'NbreTotal'
        }
    }
});