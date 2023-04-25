Ext.define('Thot.store.usr.RolesS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.usr.RolesM',
	alias: 'store.roles',
	//autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/usr/Users.php?action=LstRoles',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'rle_id',
			totalProperty: 'NbreTotal'
		}
	}
});
