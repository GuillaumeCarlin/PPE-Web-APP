Ext.define('Thot.model.act.ActQtyM', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'qte_id',
            type: 'int'
        },
        {
            name: 'act_id',
            type: 'int'
        },
        {
            name: 'qte_valeur',
            type: 'number',
            allowNull: true
        },
        {
            name: 'qtp_id',
            type: 'int'
        },
        {
            name: 'qtp_code',
            type: 'string'
        },
        {
            name: 'qtp_libelle',
            type: 'string'
        },
        {
            name: 'qtp_zeroestpermis',
            type: 'int'
        },
        {
            name: 'qtp_valeurrequise',
            type: 'int'
        },
        {
            name: 'qcl_id',
            type: 'int'
        },
        {
            name: 'qcl_code',
            type: 'string'
        },
        {
            name: 'qcl_libelle',
            type: 'string'
        }
    ]
});