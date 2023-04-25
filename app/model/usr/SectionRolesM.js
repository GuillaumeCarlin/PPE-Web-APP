Ext.define('Thot.model.usr.SectionRolesM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'org_id', type: 'int'},
		{name: 'usr_id', type: 'int'},
		{name: 'rle_id', type: 'int'},
		{name: 'rca_estprincipal', type: 'int'},
		{name: 'rle_id', type: 'int'},
		{name: 'rle_code', type: 'string'},
		{name: 'rle_libelle', type: 'string'},
		{name: 'rle_estressource', type: 'int'},
		{name: 'usr_nom', type: 'string'},
		{name: 'usr_prenom', type: 'string'},
		{name: 'org_libelle', type: 'string'},
		{name: 'org_description', type: 'string'}
	]
});
