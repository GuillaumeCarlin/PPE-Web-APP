Ext.define('Thot.model.usr.ContractM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'ctt_id', type: 'int'},
		{name: 'ctt_rang', type: 'int'},
		{name: 'ctt_code', type: 'string'},
		{name: 'ctt_base', type: 'int'},
		{name: 'ctt_libelle', type: 'string'},
		{name: 'ctt_estinactif', type: 'int'}
	]
});
