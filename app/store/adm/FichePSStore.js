Ext.define('Thot.store.adm.FichePSStore', {
    extend: 'Ext.data.Store',
	alias: 'store.fichepsstore',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/adm/Admin.php?action=GetFPSList',
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
