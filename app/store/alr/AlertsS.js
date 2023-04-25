Ext.define('Thot.store.alr.AlertsS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.alr.AlertsM',
	alias: 'store.alerts',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/alr/Alerts.php?action=alertLst',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'alr_id',
			totalProperty: 'NbreTotal'
		}
	}
});
