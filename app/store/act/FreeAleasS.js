Ext.define('Thot.store.act.FreeAleasS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.act.FreeAleasM',
	alias: 'store.freealeas',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/act/Activities.php?action=LstFreeAleas',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'ala_id',
			totalProperty: 'NbreTotal'
		}
	}
});
