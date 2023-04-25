Ext.define('Thot.store.adm.FormInsDelUsrFPSS', {
    extend: 'Ext.data.Store',
	alias: 'store.forminsdelusrfpss',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/adm/Admin.php?action=FPS_User',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'fps_if',
			totalProperty: 'NbreTotal'
		}
	}
});