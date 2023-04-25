Ext.define('Thot.store.act.QtyTypeS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.act.QtyTypeM',
	alias: 'store.quantitytype',
	autoLoad: true,
	proxy: {
		type: 'ajax',
		url: 'server/act/Activities.php?action=QtyTypeLst',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'qtp_id',
			totalProperty: 'NbreTotal'
		}
	}
});
