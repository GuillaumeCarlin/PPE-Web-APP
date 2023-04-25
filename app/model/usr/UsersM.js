Ext.define('Thot.model.usr.UsersM', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'usr_id',
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
            name: 'usr_login',
            type: 'string'
        },
        {
            name: 'usr_es',
            type: 'string'
        },
        {
            name: 'usr_displayname',
            type: 'string',
            convert: function (oUndef, oRecord) {
                return oRecord.get('usr_prenom') + ' ' + oRecord.get('usr_nom');
            }
        },
        {
            name: 'sab_id',
            type: 'int'
        },
        {
            name: 'sab_libelle',
            type: 'string',
            convert: function (sVal) {
                if (sVal == '') {
                    sVal = 'N/D';
                }

                return sVal;
            }
        },
        {
            name: 'rle_id',
            type: 'int'
        },
        {
            name: 'rle_libelle',
            type: 'string'
        },
        {
            name: 'nbsection',
            type: 'int'
        },
        {
            name: 'rca_estprincipal',
            type: 'int'
        },
        {
            name: 'eqe_id',
            type: 'int'
        },
        {
            name: 'eqe_libelle',
            type: 'string'
        },
        {
            name: 'ctt_id',
            type: 'int'
        },
        {
            name: 'ctt_libelle',
            type: 'string'
        },
        {
            name: 'nbactivite',
            type: 'int'
        },
        {
            name: 'rsc_image',
            type: 'string'
        },
        {
            name: 'rsc_utilisable',
            type: 'int'
        },
        {
            name: 'usr_verifiercoherence',
            type: 'int'
        }

    ]
});