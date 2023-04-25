Ext.define('Thot.model.ope.OfOperM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'opn_id', type: 'int'},
		{name: 'odf_id', type: 'int'},
		{name: 'pst_id', type: 'int'},
		{name: 'rsc_id', type: 'int'},
		{name: 'opn_code', type: 'string'},
		{
			name: 'opn_libelle', 
			type: 'string',
			convert: function(oUndef, oRecord) {
				return oRecord.get('opn_code')+' / '+oRecord.get('pst_libelle');
			}
		},
		{name: 'opn_rang', type: 'int'},
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
		{name: 'opn_temps_montage_j', type: 'number'},
		{name: 'opn_temps_reglage_j', type: 'number'},
		{name: 'opn_temps_op_j', type: 'number'},
		{name: 'pst_libelle', type: 'string'},
		{name: 'rsc_code', type: 'string'},
		{name: 'rsc_libelle', type: 'string'}
	]
});
