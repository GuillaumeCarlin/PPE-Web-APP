Ext.define('Thot.store.ope.OpnListS', {
	extend: 'Ext.data.Store',
	model: 'Thot.model.ope.OfListM',
	alias: 'store.opnlist',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/ope/Operations.php?action=OpnList',
		method: "POST",
		actionMethods: {
			read: 'POST'
		},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'odf_id',
			totalProperty: 'NbreTotal'
		}
	}
});