Ext.define('Thot.store.act.EntHistoS', {
	extend: 'Ext.data.Store',
	model: 'Thot.model.act.EntHistoM',
	alias: 'store.enthisto',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/act/Activities.php?action=EntHisto',
		method: "POST",
		actionMethods: { read: 'POST' },
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'act_id',
			totalProperty: 'NbreTotal'
		}
	}
});
