Ext.define('Thot.model.act.EntHistoM', {
    extend: 'Ext.data.Model',
    fields: [
        // informations de suppression
        { name: 'estsupprimee', type: 'int' },
        {
            name: 'acs_date', type: 'date', dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        },
        { name: 'acs_commentaire', type: 'string' },
        { name: 'rsc_id_supprime', type: 'int' },
        { name: 'usr_nom_supprime', type: 'string' },
        { name: 'usr_prenom_supprime', type: 'string' },

        // informations de correction
        { name: 'estcorrigee', type: 'int' },
        { name: 'tps_id_cor', type: 'int' },
        {
            name: 'acr_date_corrige', type: 'date', dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        },
        { name: 'acr_commentaire_corrige', type: 'string' },
        { name: 'rsc_id_corrige', type: 'int' },
        { name: 'usr_prenom_corrige', type: 'string' },
        { name: 'usr_nom_corrige', type: 'string' },

        // type aléa si concerné
        { name: 'alt_id', type: 'int' },
        { name: 'alt_code', type: 'string' },
        { name: 'alt_libelle', type: 'string' },
        { name: 'ald_id', type: 'int' },
        { name: 'ald_code', type: 'string' },
        { name: 'ald_libelle', type: 'string' },

        // atelier
        { name: 'org_id', type: 'int' },
        { name: 'org_libelle', type: 'string' },

        // numéro OF
        { name: 'odf_id', type: 'int' },
        { name: 'odf_code', type: 'string' },
        {
            name: 'odf_date_creation', type: 'date', dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        },
        { name: 'odf_esttermine', type: 'int' },

        // quantités OF
        { name: 'odf_quantite_lancee', type: 'int' },
        { name: 'qte_max_of', type: 'int' },
        { name: 'qte_min_of', type: 'int' },

        // produit
        { name: 'pdt_id', type: 'int' },
        { name: 'pdt_code', type: 'string' },
        { name: 'pdt_libelle', type: 'string' },

        // opération
        { name: 'opn_id', type: 'int' },
        { name: 'opn_code', type: 'string' },
        {
            name: 'opn_date_debutplanifie', type: 'date', dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        },
        {
            name: 'opn_date_fin_planifie', type: 'date', dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        },
        {
            name: 'opn_date_debutreel', type: 'date', dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        },
        {
            name: 'opn_date_finreel', type: 'date', dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        },
        { name: 'oct_id', type: 'int' },
        { name: 'oct_code', type: 'string' },
        { name: 'oct_libelle', type: 'string' },

        // type entité
        { name: 'ent_id', type: 'int' },
        { name: 'ent_type', type: 'string' },

        // poste ou service destinataire si applicable
        { name: 'pst_id', type: 'int' },
        { name: 'pst_libelle', type: 'string' },

        // opérateur
        { name: 'usr_id_realise', type: 'int' },
        { name: 'usr_prenom', type: 'string' },
        { name: 'usr_nom', type: 'string' },

        // équipement prévu
        { name: 'eqp_id_prevu', type: 'int' },
        { name: 'eqp_code_prevu', type: 'string' },
        { name: 'eqp_libelle_prevu', type: 'string' },

        // équipement utilisé
        { name: 'eqp_id_realise', type: 'int' },
        { name: 'eqp_code_realise', type: 'string' },
        { name: 'eqp_libelle_realise', type: 'string' },

        // dates entité
        {
            name: 'ent_date_debut', type: 'date', dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        },
        {
            name: 'ent_date_fin', type: 'date', dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        },

        // quantités entité
        { name: 'qte_bon', type: 'number' },
        { name: 'qte_rbt', type: 'number' },
        { name: 'qte_rtc', type: 'number' },

        // quantités cumulées opération
        { name: 'qte_bon_totopn', type: 'number' },
        { name: 'qte_rbt_totopn', type: 'number' },
        { name: 'qte_rtc_totopn', type: 'number' },

        // temps gpao
        { name: 'opn_temps_reglage_j', type: 'float' },
        { name: 'ope_temps_unitaire_j', type: 'float' }
    ]
});

