Ext.define('Thot.store.adm.FormFPSListEqtS', {
    extend: 'Ext.data.Store',
	alias: 'store.formfpslisteqt',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/adm/Admin.php?action=GetAllEQT',
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