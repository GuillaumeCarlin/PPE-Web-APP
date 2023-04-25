Ext.define('Thot.store.ope.OfOperS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.ope.OfOperM',
	alias: 'store.ofoperations',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/ope/Operations.php?action=LstOfOpe',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'opn_id',
			totalProperty: 'NbreTotal'
		}
	}
});
