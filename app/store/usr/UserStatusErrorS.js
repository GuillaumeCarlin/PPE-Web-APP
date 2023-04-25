Ext.define('Thot.store.usr.UserStatusErrorS', {
	extend: 'Ext.data.Store',
	model: 'Thot.model.usr.TeamStatusM',
	alias: 'store.userstatuserror',
	autoLoad: false,
	groupField: 'org_libelle',
	proxy: {
		type: 'ajax',
		url: 'server/usr/Users.php?action=UserStatusError',
		method: "POST",
		actionMethods: {
			read: 'POST'
		},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'usr_id',
			totalProperty: 'NbreTotal'
		}
	}
});