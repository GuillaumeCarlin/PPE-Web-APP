Ext.define('Thot.store.msg.MessageObjetS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.msg.MessageObjetM',
	alias: 'store.messageobjet',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/msg/Message.php?action=LstObjet',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'mso_id',
			totalProperty: 'NbreTotal'
		}
	}
});
