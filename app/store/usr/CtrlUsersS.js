Ext.define('Thot.store.usr.CtrlUsersS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.usr.CtrlUsersM',
	alias: 'store.ctrlusers',
	autoLoad: true,
	proxy: {
		type: 'ajax',
		url: 'server/adm/Admin.php?action=CtrlUsers',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'rsc_id',
			totalProperty: 'NbreTotal'
		}
	}
});
