Ext.define('Thot.store.adm.FormFPSListUserS', {
    extend: 'Ext.data.Store',
	alias: 'store.formfpslistusers',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/adm/Admin.php?action=GetAllUSR',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'fps_id',
			totalProperty: 'NbreTotal'
		}
	}
});