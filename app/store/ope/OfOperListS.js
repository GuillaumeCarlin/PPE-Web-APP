Ext.define('Thot.store.ope.OfOperListS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.ope.OfOperListM',
	alias: 'store.ofoperationslist',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/ope/Operations.php?action=realOpeOf',
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
