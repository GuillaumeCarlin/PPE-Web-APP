Ext.define('Thot.store.adm.FormFPSListFpgS', {
    extend: 'Ext.data.Store',
	alias: 'store.formfpslistfpgs',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/adm/Admin.php?action=Get_FPG',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'fpg_id',
			totalProperty: 'NbreTotal'
		}
	}
});