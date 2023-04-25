Ext.define('Thot.store.adm.ActCombineS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.adm.ActCombineM',
	alias: 'store.actcombine',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/adm/Admin.php?action=GetActCombine',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'ala_type',
			totalProperty: 'NbreTotal'
		}
	}
});
