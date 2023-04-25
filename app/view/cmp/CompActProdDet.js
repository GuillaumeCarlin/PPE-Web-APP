Ext.define('Thot.view.cmp.CompActProdDet', {
    extend: 'Ext.form.FieldSet',
    xtype: 'activityproddetail',
    requires: [
        'Thot.view.cmp.CompActProdDetController',
        'Thot.view.cmp.CompActProdDetModel'
    ],
    controller: 'cmp-compactproddet',
    viewModel: {
        type: 'cmp-compactdet'
    },

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    listeners: {
        afterRender: 'onAfterRender'
    },
    title: 'Informations production',
    margin: '0 10',

    items: [{
            xtype: 'hidden',
            itemId: 'nptr' // NPTR Théorique
        },
        {
            xtype: 'hidden',
            itemId: 'expectedMin' // NPTR min
        },
        {
            xtype: 'hidden',
            itemId: 'expectedMax' // NPTR MAX
        },
        {
            xtype: 'hidden',
            itemId: 'alt_code' // le code de l'aléa si il existe
        },
        {
            xtype: 'hidden',
            itemId: 'ofQtyMax' // quantité attendue max de l'OF
        }, {
            xtype: 'hidden',
            itemId: 'ofQtyMin' // quantité attendue min de l'OF
        },
        {
            xtype: 'hidden',
            itemId: 'qtyOF', // Quantité attendue de l'OF
        },
        {
            xtype: 'fieldcontainer',
            flex: 1,
            defaults: {
                xtype: 'displayfield',
                labelWidth: 120,
                ui: 'thot-field-compact'
            },
            items: [{
                    itemId: 'expectedQty', // quantité attendue de l'OF
                    fieldLabel: 'Qté. attendue'
                },
                {
                    itemId: 'rebuts', // affichage UserFriendly du NPTR et de ses bornes
                    fieldLabel: 'Total rebuts'
                },
                {
                    itemId: 'qtyPrevOpe', // quantité déjà déclarée sur cette opération (les activités précédentes)
                    fieldLabel: 'Qté. déjà produite'
                },
                {
                    itemId: 'totalQty', // affichage dynamique des quantités déclarées sur l'activité (saisie dans le grilles des activités)
                    fieldLabel: 'Qté. déclarée'
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            flex: 1,
            defaults: {
                xtype: 'displayfield',
                labelWidth: 150,
                ui: 'thot-field-compact'
            },
            items: [{
                    itemId: 'actDuration', // durée de l'activité
                    fieldLabel: 'Durée activité'
                },
                {
                    itemId: 'prodDuration',
                    fieldLabel: 'Durée production',
                    autoEl: { // ajout de'un tooltip au champ de formulaire
                        tag: 'div',
                        'data-qtip': 'La durée de production est la durée de l\'activité moins les temps de pause'
                    }
                }, {
                    itemId: 'opeTempsGamme', // temps prévu pour une pièce
                    fieldLabel: 'Temps gamme unitaire'
                },
                {
                    itemId: 'openptr', // affichage UserFriendly du NPTR et de ses bornes
                    fieldLabel: 'Qté. réalisable',
                    autoEl: { // ajout de'un tooltip au champ de formulaire
                        tag: 'div',
                        'data-qtip': '<b>NPTR</b></br>Nombre de Pièces Théoriquement Réalisables</br>Calculé par division de la durée de production par le temps gamme unitaire théorique.</br>indication des tolérances maxi et mini'
                    }
                },
            ]
        }
    ]
});