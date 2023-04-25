Ext.define('Thot.store.sct.SiteS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.sct.SiteM',
	alias: 'store.site',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/sct/Societe.php?action=LstSite',
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
