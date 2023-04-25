Ext.define('Thot.store.usr.ContractS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.usr.ContractM',
	alias: 'store.contract',
	//autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/usr/Users.php?action=LstContract',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'ctt_id',
			totalProperty: 'NbreTotal'
		}
	}
});
