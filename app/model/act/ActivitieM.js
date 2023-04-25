Ext.define('Thot.model.act.ActivitieM', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'act_id',
            type: 'int'
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
            name: 'odf_code',
            type: 'number'
        },
        {
            name: 'odf_date_creation',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        },
        {
            name: 'pst_id',
            type: 'number'
        },
        {
            name: 'pst_libelle',
            type: 'string'
        },
        {
            name: 'usr_nomprenom_realise',
            type: 'string'
        },
        {
            name: 'usr_num',
            type: 'string'
        }, // Faute de frappe dans la proc. stockée USR_NUM au lieu de USR_NOM
        {
            name: 'usr_prenom',
            type: 'string'
        },
        //        TODO: l'information odf_libelle est obsolete, on peut la supprimer - HVT-->EDU 2016/09/22
        {
            name: 'odf_libelle',
            type: 'string'
        },
        {
            name: 'odf_quantite_lancee',
            type: 'number'
        },
        {
            name: 'opn_id',
            type: 'int'
        },
        {
            name: 'opn_code',
            type: 'string'
        },
        {
            name: 'opn_rang',
            type: 'int'
        },
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
            name: 'odf_id',
            type: 'int'
        },
        {
            name: 'pdt_code',
            type: 'string'
        },
        {
            name: 'pdt_libelle',
            type: 'string'
        },
        {
            name: 'org_id',
            type: 'int'
        },
        {
            name: 'org_libelle',
            type: 'string'
        },
        {
            name: 'rsc_code',
            type: 'string'
        },
        {
            name: 'rsc_libelle_theorique',
            type: 'string'
        },
        {
            name: 'ala_id',
            type: 'int'
        },
        {
            name: 'ala_date_debut',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
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
            name: 'alt_code',
            type: 'string'
        },
        {
            name: 'act_id_org',
            type: 'int'
        },
        {
            name: 'act_estcorrigee',
            type: 'int'
        },
        {
            name: 'simultane',
            type: 'int'
        },
        {
            name: 'acr_commentaire',
            type: 'string'
        },
        {
            name: 'pdt_complement',
            type: 'string'
        },
        {
            name: 'nce_libelle',
            type: 'string'
        },
        {
            name: 'ALT_QTEREQUIS',
            type: 'int'
        }
    ]
});