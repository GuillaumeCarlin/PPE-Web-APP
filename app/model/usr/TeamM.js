Ext.define('Thot.model.usr.TeamM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'eqe_id', type: 'int'},
		{name: 'eqe_rang', type: 'int'},
		{name: 'eqe_code', type: 'string'},
		{name: 'eqe_base', type: 'int'},
		{name: 'eqe_libelle', type: 'string'},
		{name: 'eqe_estinactif', type: 'int'}
	]
});
