Ext.define('Thot.model.act.ActivitieOpnM', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'act_id',
            type: 'int'
        },
        {
            name: 'org_libelle',
            type: 'string'
        },
        {
            name: 'date_prod',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        },
        {
            name: 'eps_libelle',
            type: 'string'
        },
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
        {
            name: 'act_estencours',
            type: 'int'
        },
        {
            name: 'acr_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        },
        {
            name: 'acr_commentaire',
            type: 'string'
        },
        {
            name: 'ald_code',
            type: 'string'
        },
        {
            name: 'ald_libelle',
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
        }
    ]
});