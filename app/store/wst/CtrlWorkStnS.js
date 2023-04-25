Ext.define('Thot.store.wst.CtrlWorkStnS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.wst.CtrlWorkStnM',
	alias: 'store.ctrlworkstn',
	autoLoad: true,
	proxy: {
		type: 'ajax',
		url: 'server/adm/Admin.php?action=CtrlWorkStn',
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
