Ext.define('Thot.view.adm.FrmEquipementAlternative', {
    extend: 'Ext.form.Panel',
    xtype: 'frmequipementalternative',

    requires: [
        'Thot.view.adm.FrmEquipementAlternativeController',
        'Thot.view.adm.FrmEquipementAlternativeModel',
        'Ext.form.FieldSet',
        'Ext.form.field.Display',
        'Ext.tab.Panel',
        'Ext.tab.Tab',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Number',
        'Ext.grid.Panel',
        'Ext.grid.column.Number',
        'Ext.grid.column.Date',
        'Ext.grid.column.Boolean',
        'Ext.grid.column.Check',
        'Ext.view.Table'
    ],

    controller: 'adm-frmequipementalternative',
    viewModel: {
        type: 'adm-frmequipementalternative'
    },
    listeners: {
        afterrender: 'onAfterRender'
    },
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    /**
     * @author  Hervé Valot
     * @description Interface de gestion des équipements alternatifs
     *              possibilité de définir pour un équipement initial quels
     *              équipements pourront lui être substitués en production
     */
    items: [{ // panneau informations équipement
            xtype: 'fieldset',
            bind: {
                title: '{fieldsetTitle}'
            },
            margin: '0 10',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                labelWidth: 90,
            },
            items: [{
                    xtype: 'hidden',
                    itemId: 'rsc_id',
                },
                {
                    xtype: 'displayfield',
                    itemId: 'rsc_code',
                    flex: 1,
                    fieldLabel: 'Code',
                    enforceMaxLength: true,
                    allowBlank: false,
                    maxLength: 99 // longueur max de la colonne de la table en BDD
                },
                {
                    xtype: 'displayfield',
                    itemId: 'rsc_libelle',
                    flex: 1,
                    fieldLabel: 'Libellé',
                    enforceMaxLength: true,
                    allowBlank: false,
                    maxLength: 99
                },
                {
                    xtype: 'checkboxfield',
                    itemId: 'rsc_estinactif',
                    fieldLabel: 'indisponible',
                    boxLabel: 'Un équipement indisponible ne sera pas visible dans les listes de sélection de l\'application',
                    reference: 'isavailable'
                }

            ]
        },
        { // panneau tab pour les paramètres et la grille de remplacement
            xtype: 'tabpanel',
            flex: 1,
            activeTab: 0,
            items: [{ // panneau des options de l'équipement
                    xtype: 'panel',
                    bodyPadding: 10,
                    title: 'Paramètres',
                    scrollable: 'vertical',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    bind: {
                        disabled: '{isavailable.checked}'
                    },
                    defaults: {
                        labelWidth: 180
                    },
                    items: [{
                        xtype: 'fieldcontainer',
                        flex: 1,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        items: [{ // équipement interne ou externe ?
                                xtype: 'radiogroup',
                                width: 450,
                                // fieldLabel: 'Type',
                                items: [{
                                        // équipement externe (sous-traitance...)
                                        // les équipements internes sont disponibles en fonction de leur paramétrage
                                        xtype: 'radiofield',
                                        labelWidth: 200,
                                        reference: 'optinterne',
                                        itemId: 'optinterne',
                                        bind: {
                                            fieldLabel: '{rscinterne.libelle}'
                                        },
                                        checked: true
                                    },
                                    {
                                        // équipement externe (sous-traitance...)
                                        // les équipements externes sont à usage illimité
                                        xtype: 'radiofield',
                                        labelWidth: 200,
                                        reference: 'optexterne',
                                        itemId: 'optexterne',
                                        bind: {
                                            fieldLabel: '{rscexterne.libelle}'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldcontainer',
                                flex: 1,
                                margin: 0,
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch'
                                },
                                bind: {
                                    disabled: '{optexterne.checked}'
                                },
                                items: [{ // options de choix du type d'équipement
                                        xtype: 'radiogroup',
                                        layout: 'form',
                                        items: [{ // collaboratif
                                                xtype: 'checkboxfield',
                                                reference: 'chkcollaboratif',
                                                itemId: 'chkcollaboratif',
                                                bind: {
                                                    fieldLabel: '{eqpphysique.eqpautre.collaboratif.libelle}',
                                                    boxLabel: '{eqpphysique.eqpautre.collaboratif.description}'
                                                }
                                            },
                                            { // physique
                                                xtype: 'radiofield',
                                                reference: 'optphysique',
                                                itemId: 'optphysique',
                                                bind: {
                                                    boxLabel: '{eqpphysique.libelle}',
                                                    fieldLabel: '{eqpphysique.libelle}'
                                                }
                                            },
                                            { // immatériel
                                                xtype: 'radiofield',
                                                reference: 'optimmateriel',
                                                itemId: 'optimmateriel',
                                                bind: {
                                                    boxLabel: '{eqpimmateriel.libelle}',
                                                    fieldLabel: '{eqpimmateriel.libelle}'
                                                },
                                            }
                                        ]
                                    },
                                    { // les options des équipements physiques
                                        xtype: 'fieldcontainer',
                                        flex: 1,
                                        layout: {
                                            type: 'form',
                                            // labelWidth: 80
                                        },
                                        bind: {
                                            hidden: '{optimmateriel.checked}'
                                        },
                                        items: [{
                                            xtype: 'radiogroup',
                                            layout: 'form',
                                            margin: 0,
                                            items: [{ // présence équipement de marquage automatique
                                                    xtype: 'checkboxfield',
                                                    reference: 'chktransfertmarquage',
                                                    itemId: 'chktransfertmarquage',
                                                    bind: {
                                                        fieldLabel: '{eqpphysique.transfertmarquage.libelle}',
                                                        boxLabel: '{eqpphysique.transfertmarquage.description}'
                                                    }
                                                }, {
                                                    xtype: 'textfield',
                                                    reference: 'colosfolder',
                                                    itemId: 'colosfolder',
                                                    bind: {
                                                        disabled: '{!chktransfertmarquage.checked}'
                                                    }
                                                },
                                                { // production pièces finies, transfert données de production au SPC 
                                                    xtype: 'checkboxfield',
                                                    reference: 'chktransfertspc',
                                                    itemId: 'chktransfertspc',
                                                    bind: {
                                                        fieldLabel: '{eqpphysique.transfertspc.libelle}',
                                                        boxLabel: '{eqpphysique.transfertspc.description}'
                                                    }
                                                },
                                                { // Comptage automatique
                                                    xtype: 'checkboxfield',
                                                    reference: 'chkautocount',
                                                    itemId: 'chkautocount',
                                                    disabled: true, // DEV: 2019-04-03 21:45:23 HVT, désactivé en attendant de gérer le compteur auto
                                                    autoEl: {
                                                        tag: 'div',
                                                        'data-qtip': 'Option non gérée à ce jour.'
                                                    },
                                                    bind: {
                                                        fieldLabel: '{eqpphysique.autocount.libelle}',
                                                        boxLabel: '{eqpphysique.autocount.description}'
                                                    }
                                                },
                                                { // type standard
                                                    xtype: 'radiofield',
                                                    reference: 'optstandard',
                                                    itemId: 'optstandard',
                                                    bind: {
                                                        fieldLabel: '{eqpphysique.eqpstandard.libelle}',
                                                        boxLabel: '{eqpphysique.eqpstandard.description}'
                                                    },
                                                },
                                                { // type autre
                                                    xtype: 'radiofield',
                                                    reference: 'optautre',
                                                    itemId: 'optautre',
                                                    bind: {
                                                        fieldLabel: '{eqpphysique.eqpautre.libelle}',
                                                        boxLabel: ''
                                                    }
                                                },
                                                { // types secondaires
                                                    xtype: 'fieldcontainer',
                                                    layout: {
                                                        type: 'form',
                                                    },
                                                    allowBlank: false,
                                                    bind: {
                                                        disabled: '{optstandard.checked}'
                                                    },
                                                    margin: 0,
                                                    items: [{ // autonome
                                                            xtype: 'checkboxfield',
                                                            reference: 'chkautonome',
                                                            itemId: 'chkautonome',
                                                            bind: {
                                                                fieldLabel: '{eqpphysique.eqpautre.eqpautonome.libelle}',
                                                                boxLabel: '{eqpphysique.eqpautre.eqpautonome.description}'
                                                            }
                                                        },
                                                        { // multipostes
                                                            xtype: 'checkboxfield',
                                                            reference: 'chkmultipostes',
                                                            itemId: 'chkmultipostes',
                                                            bind: {
                                                                fieldLabel: '{eqpphysique.eqpautre.eqpmultipostes.libelle}',
                                                                boxLabel: '{eqpphysique.eqpautre.eqpmultipostes.description}'
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }, ]
                                    },
                                    { // les options des équipements immatériels
                                        xtype: 'fieldcontainer',
                                        flex: 1,
                                        layout: 'form',
                                        bind: {
                                            hidden: '{!optimmateriel.checked}'
                                        },
                                        items: [{ // option de limitation du nombre d'instances
                                                xtype: 'checkboxfield',
                                                reference: 'chklimited',
                                                itemId: 'chklimited',
                                                layout: {
                                                    type: 'form',
                                                    // labelWidth: 80
                                                },
                                                bind: {
                                                    fieldLabel: '{eqpimmateriel.limiter.libelle}',
                                                    boxLabel: '{eqpimmateriel.limiter.description}'
                                                }
                                            },
                                            { // nombre d'instances
                                                xtype: 'numberfield',
                                                reference: 'fieldinstances',
                                                itemId: 'fieldinstances',
                                                value: 1,
                                                minValue: 1,
                                                maxValue: 100,
                                                maxWidth: 200,
                                                bind: {
                                                    disabled: '{!chklimited.checked}',
                                                    fieldLabel: '{eqpimmateriel.limiter.instances.libelle}'
                                                }
                                            }
                                        ]
                                    }

                                ]
                            },
                        ]
                    }]
                },
                { // panneau de la grille de définition des remplacements d'équipements
                    xtype: 'panel',
                    title: 'Remplacement',
                    bind: {
                        disabled: '{isavailable.checked}'
                    },
                    tooltip: 'sélectionner les équipements de la même section que l\'équipement actuel peut remplacer',
                    layout: {
                        type: 'fit',
                        align: 'stretch'
                    },
                    flex: 1,

                    items: [{
                        xtype: 'gridpanel',
                        itemId: 'gridreplacement',
                        flex: 1,
                        scrollable: true,
                        store: {
                            type: 'eqpreplacement'
                        },
                        listeners: {
                            cellClick: 'onCellClick'
                        },
                        columns: [{
                                xtype: 'gridcolumn',
                                dataIndex: 'eqi_estremplacantde',
                                text: 'icon',
                                width: 50,
                                renderer: function (sValue, oCell, oData) {
                                    var sReturn = '';
                                    if (parseInt(oData.get('eqi_estremplacantde'), 10) > 0) {
                                        sReturn += '<div class="thot-icon-replace-medium icon-important" data-count="' + oData.get('eqi_estremplacantde') + '"  data-qtip="' + ' Remplacant de ' + oData.get('eqi_estremplacantde') + ' équipement(s)"> </div>';
                                    }
                                    return sReturn;
                                }
                            }, {
                                xtype: 'gridcolumn',
                                dataIndex: 'rsc_code',
                                text: 'Code',
                                width: 150
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'rsc_libelle',
                                text: 'Description',
                                flex: 1
                            },
                            {
                                xtype: 'checkcolumn',
                                dataIndex: 'selection',
                                text: 'Remplace',
                                tooltip: 'Les opérations planifiées sur les équipements cochés pourront être réalisées sur l\'équipement actif',
                                width: 100,
                                resizable: false
                            }
                        ]
                    }]
                }
            ]
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
});