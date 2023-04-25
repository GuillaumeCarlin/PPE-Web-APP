Ext.define('Thot.model.sct.SectionM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'sab_id', type: 'int'},
		{name: 'sit_id', type: 'int'},
		{name: 'sae_id', type: 'int'},
		{name: 'sab_id_parent', type: 'int'},
		{name: 'sab_code', type: 'string'},
		{name: 'sab_libelle', type: 'string'},
		{name: 'sab_description', type: 'string'},
		{name: 'chemin', type: 'string'},
		{name: 'niveau', type: 'int'},
		{name: 'sae_libelle', type: 'string'},
		{name: 'ste_libelle', type: 'string'},
		{name: 'sit_libelle', type: 'string'}
	]
});
