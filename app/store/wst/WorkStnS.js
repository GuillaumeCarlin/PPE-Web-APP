Ext.define('Thot.store.wst.WorkStnS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.wst.WorkStnM',
	alias: 'store.workstn',
	autoLoad: false,
    groupField :'sab_libelle',
	proxy: {
		type: 'ajax',
		url: 'server/wst/WorkStn.php?action=LstWorkStn',
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
