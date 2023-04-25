Ext.define('Thot.store.act.ActivitieS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.act.ActivitieM',
	alias: 'store.activities',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/act/Activities.php?action=LstActEC',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'act_id',
			totalProperty: 'NbreTotal'
		}
	}
});