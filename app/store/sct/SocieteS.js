Ext.define('Thot.store.sct.SocieteS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.sct.SocieteM',
	alias: 'store.societe',
	autoLoad: true,
	proxy: {
		type: 'ajax',
		url: 'server/sct/Societe.php?action=LstSociete',
		method: "POST",
		actionMethods: {read: 'POST'},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'org_id',
			totalProperty: 'NbreTotal'
		}
	}
});
