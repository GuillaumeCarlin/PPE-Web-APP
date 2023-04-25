Ext.define('Thot.model.usr.TeamStatusM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'usr_id', type: 'int'},
		{name: 'usr_nom', type: 'string'},
		{name: 'usr_prenom', type: 'string'},
		{name: 'org_id', type: 'int'},
		{name: 'statut', type: 'int'},
		{name: 'presence', type: 'string'},
		{name: 'usr_prenom', type: 'string'},
		{name: 'org_libelle', type: 'string'},
		{name: 'nbactiviteencours', type: 'int'},
		{name: 'coherence', type: 'int'}
	]
});


