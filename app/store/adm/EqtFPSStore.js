Ext.define('Thot.store.adm.EqtFPSStore', {
    extend: 'Ext.data.Store',
	alias: 'store.aqtfpsstore',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/adm/Admin.php?action=GetEqtFPSList',
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