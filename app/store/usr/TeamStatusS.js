Ext.define('Thot.store.usr.TeamStatusS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.usr.TeamStatusM',
	alias: 'store.teamstatus',
	autoLoad: false,
    groupField :'org_libelle',
	proxy: {
		type: 'ajax',
		url: 'server/usr/Users.php?action=TeamStatus',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'usr_id',
			totalProperty: 'NbreTotal'
		}
	}
});
