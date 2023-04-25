Ext.define('Thot.model.act.QtyTypeM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'qtp_id', type: 'int'},
		{name: 'qtp-rang', type: 'int'},
		{name: 'qtp_libelle', type: 'string'},
		{name: 'qcl_id', type: 'int'},
		{name: 'qcl_libelle', type: 'string'}
	]
});
