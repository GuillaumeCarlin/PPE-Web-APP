Ext.define('Thot.model.act.ActivitieOpnCslM', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'csl_rang', // identifiant virtuel calculé à la volée
            type: 'int'
        }, {
            name: 'odf_id',
            type: 'int'
        }, {
            name: 'opn_id',
            type: 'int'
        },
        {
            name: 'org_libelle',
            type: 'string'
        },
        {
            name: 'date_prod',
            type: 'date',
            dateFormat: 'Y-m-d',
            convert: function (sVal) {
                return new Date(sVal).toLocaleDateString();
            }
        },
        {
            name: 'eps_libelle',
            type: 'string'
        },
        {
            name: 'bon',
            type: 'int'
        },
        {
            name: 'rbt',
            type: 'int'
        },
        {
            name: 'usr_nom',
            type: 'string'
        },
        {
            name: 'usr_prenom',
            type: 'string'
        },

        {
            name: 'rsc_code',
            type: 'string'
        },
        {
            name: 'rsc_libelle',
            type: 'string'
        },
        {
            name: 'tpsoperateur',
            type: 'number'
        },
        {
            name: 'tpsmachine',
            type: 'number'
        },
        {
            name: 'tpsreglage',
            type: 'number'
        }
    ]
});