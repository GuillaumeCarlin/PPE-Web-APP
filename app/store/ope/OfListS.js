Ext.define('Thot.store.ope.OfListS', {
	extend: 'Ext.data.Store',
	model: 'Thot.model.ope.OfListM',
	alias: 'store.oflist',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/ope/Operations.php?action=OfList',
		method: 'POST',
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