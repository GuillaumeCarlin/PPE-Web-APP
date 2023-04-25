Ext.define('Thot.store.sct.SectionS', {
	extend: 'Ext.data.Store',
	model: 'Thot.model.sct.SectionM',
	alias: 'store.section',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/sct/Societe.php?action=LstSection',
		method: 'POST',
		actionMethods: {
			read: 'POST'
		},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'sab_id',
			totalProperty: 'NbreTotal'
		}
	}
});