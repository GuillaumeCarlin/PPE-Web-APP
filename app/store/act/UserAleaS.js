Ext.define('Thot.store.act.UserAleaS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.act.UserAleaM',
	alias: 'store.useralea',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/act/Activities.php?action=UserAlea',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'ala_type',
			totalProperty: 'NbreTotal'
		}
	}
});
