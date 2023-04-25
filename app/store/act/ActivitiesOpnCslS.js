/**
 * @author Hervé Valot
 * @description Store des activités liées à une opération passée en paramètre
 * @date 20200820
 */
Ext.define('Thot.store.act.ActivitiesOpnCslS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.act.ActivitieOpnCslM',
    alias: 'store.activitiesopncsl',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'server/act/Activities.php?action=LstActOpnCsl',
        method: "POST",
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'liste',
            idProperty: 'csl_rang',
            totalProperty: 'NbreTotal'
        }
    }
});