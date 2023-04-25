Ext.define('Thot.model.wst.WorkStnSelectM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'rsc_id', type: 'int'},
		{name: 'rsc_code', type: 'string'},
		{name: 'rsc_libelle', type: 'string'},
        {name: 'rsc_estinactif', type: 'int'},
		{name: 'sab_id', type: 'int'},
		{
			name: 'sab_libelle',
			type: 'string',
			convert: function (sVal) {
				if (sVal=='') {
					sVal = 'N/D';
				}

				return sVal;
			}
		},
		{name: 'nboccurence', type: 'int'},
		{name: 'surutilisation', type: 'int'},
        {name: 'rsc_estchargee', type:'int'},
        {name: 'nb_opn_charge', type: 'int'},
        {name: 'eqp_simultaneite_requise', type: 'int'},
        {name: 'eqp_simultaneite_nombre', type: 'int'}
	]
});
