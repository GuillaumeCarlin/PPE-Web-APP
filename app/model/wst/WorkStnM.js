Ext.define('Thot.model.wst.WorkStnM', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'rsc_id', type: 'int'},
		{name: 'rsc_code', type: 'string'},
		{name: 'rsc_libelle', type: 'string'},
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
		{name: 'rle_id', type: 'string'},
		{name: 'rle_libelle', type: 'string'},
		{name: 'nbsection', type: 'string'},
		{name: 'rca_estprincipal', type: 'string'},
        {name: 'rsc_estchargee', type:'int'}
		/*
		{name: 'nboccurence', type: 'int'},
		{name: 'surutilisation', type: 'int'},
		*/
	]
});
