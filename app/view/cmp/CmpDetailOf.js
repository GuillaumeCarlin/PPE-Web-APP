Ext.define('Thot.view.cmp.CmpDetailOf', {
    extend: 'Ext.form.FieldSet',
    xtype: 'ofdetail',
    requires: [
        'Thot.view.cmp.CmpDetailOfController',
        'Thot.view.cmp.CmpDetailOfModel'
    ],

    controller: 'cmp-cmpdetailof',
    viewModel: {
        type: 'cmp-cmpdetailof'
    },

    layout: 'column',
    collapsible: true,
    listeners: {
        afterRender: 'onAfterRender',
        loadDetail: 'onLoadDetail'
    },
    title: 'Détail de l\'OF',
    margin: '0 10',
    defaults: {
        labelStyle: 'font-weight: bold;',
        labelAlign: 'right',
        labelWidth: 110,
        labelSeparator: ' :',
        ui: 'thot-field-compact'
    },
    items: [{
            xtype: 'displayfield',
            itemId: 'odf_id',
            fieldLabel: 'id OF',
            hidden: true
        }, {
            xtype: 'displayfield',
            itemId: 'odf_code',
            fieldLabel: 'Numéro OF',
            columnWidth: 0.25
        },
        {
            xtype: 'displayfield',
            itemId: 'pdt_libelle',
            fieldLabel: 'Produit',
            columnWidth: 0.75
        },
        {
            xtype: 'displayfield',
            itemId: 'odf_quantite_lancee',
            fieldLabel: 'Quantité lancée',
            columnWidth: 0.25
        },
        {
            xtype: 'displayfield',
            itemId: 'gam_libelle',
            fieldLabel: 'Gamme',
            columnWidth: 0.75
        }
    ]
});