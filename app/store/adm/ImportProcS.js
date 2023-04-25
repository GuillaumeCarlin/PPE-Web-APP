Ext.define('Thot.store.adm.ImportProcS', {
    extend: 'Ext.data.TreeStore',
	alias: 'store.importproc',
	autoLoad: true,
	proxy: {
		type: 'ajax',
		url: 'server/adm/Admin.php?action=LstImportProc',
		method: "POST",
		actionMethods: {read: 'POST'},
		root: {
			name: 'Tout',
			expanded: true
		}
		/*
		reader: {
			type: 'json',
			rootProperty: 'root',
			//idProperty: 'act_id',
			totalProperty: 'NbreTotal'
		}
		*/
	}
});
