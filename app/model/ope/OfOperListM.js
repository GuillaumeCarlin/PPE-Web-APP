Ext.define('Thot.model.ope.OfOperListM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'opn_id', type: 'int'},
		{name: 'odf_id', type: 'int'},
		{name: 'opn_code', type: 'string'},
		{name: 'etatopn', type: 'string'},
		{name: 'pst_libelle', type: 'string'},
		{name: 'rsc_code_theo', type: 'string'},
		{name: 'rsc_libelle_theo', type: 'string'},
		{name: 'rsc_code_reel', type: 'string'},
		{name: 'rsc_libelle_reel', type: 'string'},
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
		{name: 'tempsmontageallouesec', type: 'number'},
		{name: 'tempsmontageallouejhms', type: 'string'},
		{name: 'dureealeamontagesec', type: 'number'},
		{name: 'dureealeamontagejhms', type: 'string'},
		{name: 'opn_temps_reglage_j', type: 'number'},
		{name: 'tempsreglageallouesec', type: 'number'},
		{name: 'tempsreglageallouejhms', type: 'string'},
		{name: 'dureealeareglagesec', type: 'number'},
		{name: 'dureealeareglagejhms', type: 'string'},
		{name: 'ope_temps_unitaire_j', type: 'number'},
		{name: 'ope_temps_unitaire_jhms', type: 'string'},
		{name: 'tempsunitairereelj', type: 'number'},
		{name: 'tempsunitairereeljhms', type: 'string'},
		{name: 'opn_rang', type: 'int'},
		{name: 'bon', type: 'int'},
		{name: 'rbt', type: 'int'},
		{name: 'rtc', type: 'int'},
		{name: 'dureeactivitescd', type: 'number'},
		{name: 'dureeactivitejhms', type: 'string'},
		{name: 'dureealeasec', type: 'number'},
		{name: 'dureealeajhms', type: 'string'},
		{name: 'dureeprodscd', type: 'number'},
		{name: 'dureeprodjhms', type: 'string'}
	]
});
