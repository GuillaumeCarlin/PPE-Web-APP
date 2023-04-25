Ext.define('Thot.model.alr.AlertsM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'alr_id', type: 'int'},
		{name: 'alr_libelle', type: 'string'},
		{name: 'alr_date_debut', type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			convert: function (sVal) {
				return this.toDate(sVal);
			}
		},
		{name: 'alr_date_fin', type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			convert: function (sVal) {
				return this.toDate(sVal);
			}
		},
		{name: 'rgl_id', type: 'int'},
		{name: 'rgl_code', type: 'string'},
		{name: 'ace_commentaire', type: 'string'},
		{name: 'usralrcmt_nom', type: 'string'},
		{name: 'usralrcmt_prenom', type: 'string'},
		{name: 'act_id', type: 'int'},
		{name: 'act_date_debut', type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			convert: function (sVal) {
				return this.toDate(sVal);
			}
		},
		{name: 'act_date_fin', type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			convert: function (sVal) {
				return this.toDate(sVal);
			}
		},
		{name: 'opn_id', type: 'int'},
		{name: 'opn_code', type: 'string'},
		{name: 'odf_id', type: 'int'},
		{name: 'odf_code', type: 'string'},
		{name: 'pdt_id', type: 'int'},
		{name: 'pdt_code', type: 'string'},
		{name: 'pdt_libelle', type: 'string'},
		{name: 'pdt_complement', type: 'string'},
		{name: 'nce_code', type: 'string'},
		{name: 'nce_libelle', type: 'string'},
		{name: 'gam_id', type: 'int'},
		{name: 'gam_code', type: 'string'},
		{name: 'gam_libelle', type: 'string'},
		{name: 'pst_code', type: 'string'},
		{name: 'pst_libelle', type: 'string'},
		{name: 'sab_id', type: 'int'},
		{name: 'sab_code', type: 'string'},
		{name: 'sab_libelle', type: 'string'},
		{name: 'sit_id', type: 'int'},
		{name: 'sit_code', type: 'string'},
		{name: 'sit_libelle', type: 'string'},
		{name: 'ste_id', type: 'int'},
		{name: 'ste_code', type: 'string'},
		{name: 'ste_libelle', type: 'string'},
		{name: 'usract_id', type: 'int'},
		{name: 'usract_nom', type: 'string'},
		{name: 'usract_prenom', type: 'string'},
		{name: 'eqpact_id', type: 'int'},
		{name: 'eqpact_code', type: 'string'},
		{name: 'eqpact_libelle', type: 'string'},
		{name: 'alrusr_nom', type: 'string'},
		{name: 'alrusr_prenom', type: 'string'}
	]
});

