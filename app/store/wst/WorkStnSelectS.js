Ext.define('Thot.store.wst.WorkStnSelectS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.wst.WorkStnSelectM',
	alias: 'store.workstnselect',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/wst/WorkStn.php?action=WorkStnSelect',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'rsc_id',
			totalProperty: 'NbreTotal'
		}
	}
});
