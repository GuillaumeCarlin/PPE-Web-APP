Ext.define('Thot.store.usr.SectionRolesS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.usr.SectionRolesM',
	alias: 'store.sectionroles',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/usr/Users.php?action=LstSectionRoles',
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
