Ext.define('Thot.model.wst.CtrlWorkStnM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'rsc_id', type: 'int'},
		{name: 'eqp_estacquisitionauto', type: 'int'},
		{name: 'eqp_simultaneite', type: 'int'},
		{name: 'eqp_simultaneite_nombre', type: 'int'},
		{name: 'org_id', type: 'int'},
		{name: 'rsc_code', type: 'string'},
		{name: 'rsc_libelle', type: 'string'},
		{name: 'rsc_estinactif', type: 'int'},
		{name: 'ece_id', type: 'int'},
		{name: 'ech_id', type: 'int'},
		{
			name: 'ech_date_debut',
			type: 'date',
			dateFormat: 'Y-m-d H:i:s',
			convert: function (sVal) {
				return this.toDate(sVal);
			}
		}
	]
});

