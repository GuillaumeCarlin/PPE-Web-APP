Ext.define('Thot.model.usr.RolesM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'rle_id', type: 'int'},
		{name: 'rle_rang', type: 'int'},
		{name: 'rle_base', type: 'int'},
		{name: 'rle_code', type: 'string'},
		{name: 'rle_libelle', type: 'string'},
		{name: 'rle_estressource', type: 'int'},
		{name: 'rle_estinactif', type: 'int'}
	]
});

