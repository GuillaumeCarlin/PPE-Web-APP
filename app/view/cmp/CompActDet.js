
Ext.define('Thot.view.cmp.CompActDet', {
    extend: 'Ext.form.FieldSet',
    xtype: 'activitydetail',
    requires: [
        'Thot.view.cmp.CompActDetController',
        'Thot.view.cmp.CompActDetModel'
    ],
    controller: 'cmp-compactdet',
    viewModel: {
        type: 'cmp-compactdet'
    },
    layout: {
        type: 'column'
    },
    listeners: {
        afterRender: 'onAfterRender'
    },
    title: 'Détail de l\'activité',
    margin: '0 10',
    defaults: {
        labelWidth: 90,
        ui: 'thot-field-compact'
    },
    items: [
        {
            xtype: 'hidden',
            itemId: 'org_id'
        },
        {
            xtype: 'hidden',
            itemId: 'opnp_estterminee'
        },
        {
            xtype: 'hidden',
            itemId: 'alt_code'
        },
        {
            xtype: 'displayfield',
            itemId: 'of',
            width: 180,
            columnWidth: 0.6,
            fieldLabel: 'O.F.',
            value: ''
        },
        {
            xtype: 'displayfield',
            itemId: 'status',
            columnWidth: 0.4,
            fieldLabel: 'Etat',
            value: ''
        },
        {
            xtype: 'displayfield',
            itemId: 'operation',
            columnWidth: 0.6,
            fieldLabel: 'Opération',
            value: ''
        },
        {
            xtype: 'displayfield',
            itemId: 'datedebut',
            columnWidth: 0.4,
            fieldLabel: 'Commencée le',
            value: ''
        },
        {
            xtype: 'displayfield',
            itemId: 'poste',
            columnWidth: 0.6,
            fieldLabel: 'Poste',
            value: ''
        },
        {
            xtype: 'displayfield',
            itemId: 'operator',
            columnWidth: 0.4,
            fieldLabel: 'Opérateur',
            value: ''
        },
        {
            xtype: 'displayfield',
            itemId: 'product',
            columnWidth: 0.6,
            fieldLabel: 'Produit',
            value: ''
        },
        {
            xtype: 'displayfield',
            itemId: 'workstn',
            columnWidth: 0.4,
            fieldLabel: 'Equipement',
            value: ''
        },
    ]
});
