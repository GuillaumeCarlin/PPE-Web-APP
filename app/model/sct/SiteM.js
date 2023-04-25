Ext.define('Thot.model.sct.SiteM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: "org_id", type: 'int'},
		{name: "sit_rang", type: 'int'},
		{name: "sit_code", type: 'string'},
		{name: "org_libelle", type: 'string'},
		{name: "org_description", type: 'string'}
	]
});
