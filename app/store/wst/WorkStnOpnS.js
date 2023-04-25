Ext.define('Thot.store.wst.WorkStnOpnS', {
	extend: 'Ext.data.Store',
	model: 'Thot.model.wst.WorkStnOpnM',
	alias: 'store.workstnopn',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/wst/WorkStn.php?action=wstnListByOperation',
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