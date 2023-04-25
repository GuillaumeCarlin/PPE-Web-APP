Ext.define('Thot.store.act.ActHistoS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.act.ActHistoM',
	alias: 'store.acthisto',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/act/Activities.php?action=ActHisto',
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
