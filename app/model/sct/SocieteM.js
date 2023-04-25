Ext.define('Thot.model.sct.SocieteM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: "org_id", type: 'int'},
		{name: "ste_rang", type: 'int'},
		{name: "ste_code", type: 'string'},
		{name: "org_libelle", type: 'string'},
		{name: "org_description", type: 'string'}
	]
});
