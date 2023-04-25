Ext.define('Thot.store.adm.UserFPSStore', {
    extend: 'Ext.data.Store',
	alias: 'store.userfpsstore',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/adm/Admin.php?action=GetUSRList',
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
