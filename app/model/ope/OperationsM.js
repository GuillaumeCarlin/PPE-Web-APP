Ext.define('Thot.model.ope.OperationsM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'odf_id', type: 'int'},
		{name: 'odf_code', type: 'int'},
		{name: 'odf_date_creation', type: 'date'},
        {name: 'pst_id', type: 'int'},
        {name: 'pst_libelle', type: 'string'},
        {name: 'odf_quantite_lancee', type: 'int'},

        {name: 'opn_id', type: 'int'},
		{name: 'opn_code', type: 'string'},
		{name: 'opn_date_debutplanifie', type: 'date'},
		{name: 'opn_date_finplanifie', type: 'date'},
		{name: 'opn_date_debutreel', type: 'date'},
		{name: 'opn_date_finreel', type: 'date'},

		{name: 'pdt_id', type: 'int'},
		{name: 'pdt_code', type: 'string'},
		{name: 'pdt_libelle', type: 'string'},

		{name: 'rsc_id', type: 'int'},
		{name: 'rsc_code', type: 'string'},
		{name: 'rsc_libelle', type: 'string'},

        {name: 'rsc_id_prevu', type: 'int'},
        {name: 'rsc_code_prevu', type: 'string'},
        {name: 'rsc_libelle_prevu', type: 'string'},

        {name: 'Priorite', type: 'int'},
        {name: 'EnCours', type: 'int'},
		{name: 'opn_estterminee', type: 'int'}

	]
});
