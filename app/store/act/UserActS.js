Ext.define('Thot.store.act.UserActS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.act.UserActM',
	alias: 'store.useract',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/act/Activities.php?action=UserAct',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'act_id',
			totalProperty: 'NbreTotal'
		}
	}
});
