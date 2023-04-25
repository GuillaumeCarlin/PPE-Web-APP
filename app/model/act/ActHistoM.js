Ext.define('Thot.model.act.ActHistoM', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'act_id',
            type: 'int'
        },
        {
            name: 'act_id_org',
            type: 'int'
        },
        {
            name: 'estcorrigee',
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
            name: 'date_debut',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            persist: false,
            convert: function (v, record) {
                var data = record.getData();
                return Ext.Date.explicitDate(this.toDate(data.act_date_debut));
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
            name: 'date_fin',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            persist: false,
            convert: function (v, record) {
                var data = record.getData();
                return Ext.Date.explicitDate(this.toDate(data.act_date_fin));
            }
        },

        {
            name: 'odf_id',
            type: 'int'
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
            name: 'odf_libelle',
            type: 'string'
        },
        {
            name: 'odf_quantite_lancee',
            type: 'number'
        },
        {
            name: 'odf_esttermine',
            type: 'int'
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
        {
            name: 'pdt_id',
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
            name: 'rsc_id',
            type: 'int'
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
            name: 'usr_id_realise',
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
            name: 'eqp_id_realise',
            type: 'int'
        },
        {
            name: 'eqp_code_realise',
            type: 'string'
        },
        {
            name: 'eqp_libelle_realise',
            type: 'string'
        },
        {
            name: 'qte_bon',
            type: 'number'
        },
        {
            name: 'qte_qrbt',
            type: 'number'
        },
        {
            name: 'qte_qrtc',
            type: 'number'
        },
        {
            name: 'qte_qtot',
            type: 'number'
        },
        //
        {
            name: 'qte_bon_totopn',
            type: 'number'
        },
        {
            name: 'qte_rbt_totopn',
            type: 'number'
        },
        {
            name: 'qte_rtc_totopn',
            type: 'number'
        },
        {
            name: 'qte_qdr',
            type: 'number'
        },
        {
            name: 'qte_qpa',
            type: 'number'
        },
        {
            name: 'qte_max_of',
            type: 'number'
        },
        {
            name: 'qte_min_of',
            type: 'number'
        },
        {
            name: 'pst_libelle',
            type: 'string'
        },
        {
            name: 'ope_temps_unitaire_j',
            type: 'float'
        },
        {
            name: 'opn_temps_montage_j',
            type: 'float'
        },
        {
            name: 'opn_temps_reglage_j',
            type: 'float'
        },

        {
            name: 'rsc_id_corrige',
            type: 'int'
        },
        {
            name: 'acrusr_nom',
            type: 'string'
        },
        {
            name: 'acrusr_prenom',
            type: 'string'
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
            name: 'acr_commentaire_pre',
            type: 'string'
        }
    ]
});