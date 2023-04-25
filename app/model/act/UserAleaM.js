Ext.define('Thot.model.act.UserAleaM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'ala_type', type: 'int'},
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
		{name: 'ald_libelle', type: 'string'},
		{name: 'alo_code', type: 'string'},
		{name: 'alo_libelle', type: 'string'},
		{name: 'usr_id', type: 'int'},
		{name: 'usr_nom', type: 'string'},
		{name: 'usr_prenom', type: 'string'},
		{name: 'eqp_id', type: 'int'},
		{name: 'eqp_code', type: 'string'},
		{name: 'eqp_libelle', type: 'string'},
		{name: 'act_id', type: 'int'},
		{
			name: 'act_date_debut', 
			type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			convert: function (sVal) {
				return this.toDate(sVal);
			}
		},
		{
			name: 'act_date_fin', 
			type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			convert: function (sVal) {
				return this.toDate(sVal);
			}
		},
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
		{
			name: 'opn_date_finreel', 
			type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			convert: function (sVal) {
				return this.toDate(sVal);
			}
		},
		{name: 'odf_id', type: 'int'},
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
		{name: 'odf_esttermine', type: 'int'},
		{name: 'odf_quantiteattendue', type: 'number'},
		{name: 'pdt_id', type: 'int'},
		{name: 'pdt_code', type: 'string'},
		{name: 'pdt_libelle', type: 'string'},
		{name: 'org_id', type: 'int'},
		{name: 'org_libelle', type: 'string'}
	]
});
