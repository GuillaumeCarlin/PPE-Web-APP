Ext.define('Thot.store.act.ActQtyS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.act.ActQtyM',
	alias: 'store.actqty',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/act/Activities.php?action=QtyDetail',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'qte_id',
			totalProperty: 'NbreTotal'
		}
	}
});
