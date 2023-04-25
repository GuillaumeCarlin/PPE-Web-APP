Ext.define('Thot.store.usr.TeamS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.usr.TeamM',
	alias: 'store.team',
	//autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/usr/Users.php?action=LstTeam',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'eqe_id',
			totalProperty: 'NbreTotal'
		}
	}
});
