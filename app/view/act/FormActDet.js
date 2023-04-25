/*
 * Copyright (c) 2019 PQR-Informatique
 *
 * @Script: FormActDet.js
 * @Author: Hervé Valot
 * @Email: hvalot@pqr-informatique.Fr
 * @Créé le: 2019-07-09 16:15:11
 * @Modifié par: Hervé Valot
 * @Modifié le: yyyy-11-dd 08:45:29
 * @Description: Formulaire détail activité
 */


Ext.define('Thot.view.act.FormActDet', {
    extend: 'Ext.form.Panel',
    xtype: 'actdetail',
    itemId: 'actdetail',
    requires: [
        'Thot.view.act.FormActDetController',
        'Thot.view.act.FormActDetModel'
    ],
    controller: 'act-formactdet',
    viewModel: {
        type: 'act-formactdet'
    },
    layout: {
        align: 'stretch',
        type: 'vbox'
    },
    listeners: {
        afterRender: 'onAfterRender',
        validForm: '_fTest'
    },
    items: [{ // composant détail activité
            xtype: 'activitydetail',
            itemId: 'actDetCmp'
        },
        { // composant détail données de production
            xtype: 'activityproddetail',
            itemId: 'actProdDetCmp'
        },
        {
            xtype: 'panel',
            itemId: 'actionPnl',
            layout: 'card',
            flex: 1,
            items: [{
                    xtype: 'panel',
                    itemId: 'actionSel',
                    layout: {
                        type: 'column'
                    },
                    title: '',
                    bodyPadding: 5,
                    flex: 1,
                    buttons: [{
                            text: 'Suspendre',
                            ui: 'thot-action',
                            itemId: 'suspendBtn',
                            iconCls: 'x-fa fa-pause fa2x',
                            tabindex: 1,
                            dock: 'left',
                            //icon: 'resources/images/16x16/cancel.png',
                            handler: 'onSuspendClick'
                        },
                        {
                            text: 'Terminer',
                            ui: 'thot-action',
                            itemId: 'stopBtn',
                            iconCls: 'x-fa fa-flag-checkered fa2x',
                            tabindex: 2,
                            //icon: 'resources/images/16x16/cancel.png',
                            handler: 'onStopClick'
                        }, {
                            // TODO: 2019-03-21 16:19:51, HVT, gérer l'affichage de ce bouton en fonction des autorisations de création des aléas
                            // TODO: HVT, passer la liste des autorisations à l'onglet suivant pour n'afficher que ce qui est autorisé
                            text: 'Déclarer un aléa',
                            itemId: 'aleaBtn',
                            ui: 'thot-action',
                            iconCls: 'x-fa fa-random fa2x',
                            tabindex: 3,
                            handler: 'onAleaClick',
                            // bouton masqué par défaut, sera affiché uniquement dans le cas des réglages
                            hidden: true
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            text: 'Annuler',
                            ui: 'cancel',
                            iconCls: 'x-fa fa-times-circle fa2x',
                            tabindex: 4,
                            handler: 'onCancelClick'
                        }
                    ]
                },
                { // grille de saisie des quantités
                    xtype: 'gridpanel',
                    itemId: 'quantity',
                    title: '',
                    selModel: 'cellmodel',
                    store: {
                        type: 'quantitytype'
                    },
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 1,
                        listeners: {
                            edit: 'onQtyChange'
                        }
                    },
                    tbar: [],
                    columns: [{
                            dataIndex: 'qtp_libelle',
                            text: 'Type',
                            width: 150
                        },
                        {
                            dataIndex: 'qty',
                            xtype: 'numbercolumn',
                            format: '0,000',
                            editor: {
                                xtype: 'numberfield',
                                minValue: 0,
                                allowDecimals: false,
                                autoStripChars: true,
                                baseChars: '0123456789',
                                negativeText: 'Valeur positive uniquement'
                            },
                            text: 'Quantité',
                            width: 150
                        }
                    ],
                    buttons: [{
                            text: 'Annuler',
                            ui: 'cancel',
                            iconCls: 'x-fa fa-times-circle fa-2x',
                            handler: 'onCancelClick'
                        },
                        { // Valider la fin de l'opération
                            text: 'Valider',
                            ui: 'succes',
                            iconCls: 'x-fa fa-check-circle fa-2x',
                            handler: 'onValidClick'
                        }
                    ]
                },
                {
                    xtype: 'tabpanel',
                    // ui: 'thot-alternative',
                    itemId: 'alea',
                    //title: 'Déclarer un aléa',
                    height: 320,
                    items: [],
                    buttons: [{
                            text: 'Annuler',
                            ui: 'cancel',
                            iconCls: 'x-fa fa-times-circle fa-2x',
                            handler: 'onCancelClick'
                        },
                        {
                            text: 'Valider',
                            ui: 'succes',
                            iconCls: 'x-fa fa-check-circle fa2x',
                            handler: 'onAleaValidClick'
                        }
                    ]
                }
            ]
        }
    ]
});