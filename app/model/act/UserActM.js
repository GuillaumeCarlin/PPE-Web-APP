Ext.define('Thot.model.act.UserActM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'act_id', type: 'int'},
		{
			name: 'act_date_debut',
			type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			convert: function (sVal) {
				return this.toDate(sVal);
			}
		},
		{name: 'odf_code', type: 'string'},
		{
			name: 'odf_date_creation',
			type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			convert: function (sVal) {
				return this.toDate(sVal);
			}
		},
		{name: 'pst_id', type: 'int'},
		{name: 'pst_libelle', type: 'string'},
		{name: 'odf_libelle', type: 'string'},
		{name: 'odf_quantite_lancee', type: 'number'},
		{name: 'opn_id', type: 'int'},
		{name: 'opn_code', type: 'string'},
		{
			name: 'opn_date_debutplanifie',
			type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			convert: function (sVal) {
				return this.toDate(sVal);
			}
		},
		{
			name: 'opn_date_finplanifie',
			type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			convert: function (sVal) {
				return this.toDate(sVal);
			}
		},
		{
			name: 'opn_date_debutreel',
			type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			convert: function (sVal) {
				return this.toDate(sVal);
			}
		},
		{name: 'odf_id', type: 'int'},
		{name: 'pdt_code', type: 'string'},
		{name: 'pdt_libelle', type: 'string'},
		{name: 'org_id', type: 'int'},
		{name: 'org_libelle', type: 'string'},
		{name: 'rsc_code', type: 'string'},
		{name: 'rsc_libelle_theorique', type: 'string'},
		{name: 'usr_id_realise', type: 'int'},
		{name: 'usr_nomprenom_realise', type: 'string'},
		{name: 'usr_nom', type: 'string'},
		{name: 'usr_prenom', type: 'string'},
		{name: 'eqp_id_realise', type: 'int'},
		{name: 'eqp_code_realise', type: 'string'},
		{name: 'eqp_libelle_realise', type: 'string'},
		{name: 'ala_id', type: 'int'},
		{
			name: 'ala_date_debut',
			type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			convert: function (sVal) {
				return this.toDate(sVal);
			}
		},
		{name: 'ald_code', type: 'string'},
		{ name: 'ald_libelle', type: 'string' },
				{
					name: 'alt_code',
					type: 'string'
				},

	]
});
