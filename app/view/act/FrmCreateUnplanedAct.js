Ext.define('Thot.view.act.FrmCreateUnplanedAct', {
    extend: 'Ext.panel.Panel',
    xtype: 'newunplanedact',

    requires: [
        'Thot.view.act.FrmCreateUnplanedActController',
        'Thot.view.act.FrmCreateUnplanedActModel'
    ],

    controller: 'act-frmcreateunplanedact',
    viewModel: {
        type: 'act-frmcreateunplanedact'
    },

    listeners: {
        afterrender: 'onAfterRender',
        // validForm: '_fTest'
    },
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [{
            xtype: 'displayfield',
            itemId: 'ariane',
            hideLabel: true,
            margin: 0,
            fieldCls: 'filAriane'
        },
        {
            xtype: 'panel',
            itemId: 'cardPanel',
            title: '',
            flex: 1,
            layout: 'card',
            items: [{ // sélection des opérateurs en mode dataview
                    xtype: 'panel',
                    layout: 'fit',
                    items: [{ // dataview, liste des opérateurs
                        xtype: 'dataview',
                        itemId: 'operatorSel',
                        reference: 'operatorSel',
                        scrollable: 'vertical',
                        overCls: 'user-card-main-over',
                        selectedItemCls: 'user-card-main-selected',
                        itemSelector: 'div.user-card-main',
                        tpl: ['<tpl for=".">' +
                            '   <div class="user-card-main">' +
                            '       <div class="user-card-main-image"style="background-image: url(\'resources/images/{rsc_image}\')"> </div>' +
                            '       <div class="user-card-main-info">' +
                            '           <span class="thot-bold-label">{usr_nom}</br>{usr_prenom}</span> <br>' +
                            '           <span>{sab_libelle}</span> <br>' +
                            '       </div>' +
                            // affichage du type d'activité en fonction de la valeur de oct_code
                            '       <div class="user-card-main-status">' +
                            '           <tpl switch="oct_code">' +
                            '               <tpl case="QUAL">' +
                            '                   <div class="thot-icon-quality-medium thot-QUAL-color" data-qtip="Qualité" data-qalign="bl-tl"> </div>' +
                            '               <tpl case="HRPR">' +
                            '                   <div class="thot-icon-alea-medium thot-HRPR-color" data-qtip="Hors production" data-qalign="bl-tl"> </div>' +
                            '               <tpl case="NPLN">' +
                            '                   <div class="thot-icon-unplaned-medium thot-NPLN-color" data-qtip="Non planifié" data-qalign="bl-tl"> </div>' +
                            '               <tpl case="PROD">' +
                            '                   <tpl if="rglencours &gt; 0">' + // si on est en réglage on affiche l'icône spécifique
                            '                       <div class="thot-icon-wrench-medium" data-qtip="Réglage en cours" data-qalign="bl-tl"> </div>' +
                            '                   <tpl else>' +
                            '                       <div class="thot-icon-working-medium icon-green" data-qtip="Production" data-qalign="bl-tl"> </div>' +
                            '                   </tpl>' +
                            '           </tpl>' +
                            '       </div>' +
                            // affichage conditionnel du masque actif/inactif en fonction de rsc_utilisable
                            '       <tpl if="rsc_utilisable == 0">' +
                            '           <div class="user-card-main-inactive"></div>' +
                            '       </tpl>' +
                            '   </div>' +
                            '</tpl>'
                        ],
                        store: {
                            type: 'usersprod',
                            autoLoad: false
                        },
                        listeners: {
                            /**
                             * @description intercèpte le click sur une zone libre et renvoie false pour ne pas déselectionner l'item en cours
                             */
                            beforecontainerclick: function () {
                                return false;
                            },
                            /**
                             * @description interdit la sélection d'un item "désactivé"
                             */
                            //DEV: hvt 2021-02-16 18:04:40 à faire
                            beforeitemclick: function (dataview, oRecord) {
                                if (parseInt(oRecord.data.rsc_utilisable) == 0) {
                                    return false;
                                }
                            },
                            /**
                             * @description click sur un item, déclenche l'action associée
                             */
                            itemclick: 'onOperatorSel'

                        }
                    }],
                    dockedItems: [{ // barre d'outils supérieure, sélection des ateliers
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [{
                                xtype: 'hidden',
                                itemId: 'selectedSabId',
                                value: 0
                            },
                            {
                                xtype: 'hidden',
                                itemId: 'selectedOperId',
                                value: 0
                            },
                            {
                                xtype: 'hidden',
                                itemId: 'selectedOper'
                            },
                            {
                                xtype: 'combobox',
                                itemId: 'sectionCbo',
                                fieldLabel: 'Section',
                                labelWidth: 80,
                                allowBlank: false,
                                width: 300,
                                valueField: 'sab_id',
                                displayField: 'sab_libelle',
                                editable: false,
                                store: {
                                    type: 'section'
                                },
                                listeners: {
                                    select: 'onSectionSel'
                                }
                            },
                            {
                                xtype: 'segmentedbutton',
                                items: [{
                                        text: 'Opérateurs de la section',
                                        itemId: 'sectionUsers',
                                        pressed: true
                                    },
                                    {
                                        text: 'Tous les opérateurs',
                                        itemId: 'allUsers'
                                    }
                                ],
                                listeners: {
                                    toggle: 'onTypeUserClick'
                                }
                            },
                            {
                                xtype: 'tbfill'
                            },
                            {
                                xtype: 'textfield',
                                itemId: 'searchfield',
                                emptyText: 'Recherche...',
                                listeners: {
                                    change: 'onUserFilter'
                                }
                            }
                        ]
                    }, ]
                },
                // { // Sélection de l'opérateur
                //     xtype: 'gridpanel',
                //     itemId: 'operatorSel',
                //     store: {
                //         type: 'usersprod',
                //         autoLoad: false
                //     },
                //     plugins: 'gridfilters',
                //     listeners: {
                //         beforeselect: {
                //             // gestion des lignes ne devant pas être sélectionnées (ressource inutilisable)
                //             // interdit la sélection de la ligne considérée
                //             fn: function (grid, oData) {
                //                 if (parseInt(oData.get('rsc_utilisable')) == 0) {
                //                     return false;
                //                 }
                //             }
                //         },
                //         select: 'onOperatorSel'
                //     },
                //     features: [{
                //         /**
                //          * ajout des fonctionnalités de regroupement pour pouvoir
                //          * regrouper les activités par certaines informations
                //          * type activité, section, état ?
                //          */
                //         ftype: 'grouping',
                //         startCollapsed: false,
                //         hideGroupedHeader: false,
                //         /* cacher la colonne du regroupement */
                //         groupHeaderTpl: '{columnName}: {name}'
                //     }],
                //     tbar: [{
                //             xtype: 'hidden',
                //             itemId: 'selectedSabId',
                //             value: 0
                //         },
                //         {
                //             xtype: 'hidden',
                //             itemId: 'selectedOperId',
                //             value: 0
                //         },
                //         {
                //             xtype: 'hidden',
                //             itemId: 'selectedOper'
                //         },
                //         {
                //             xtype: 'combobox',
                //             itemId: 'sectionCbo',
                //             fieldLabel: 'Section',
                //             labelWidth: 80,
                //             allowBlank: false,
                //             width: 300,
                //             margin: '0 100 0 0',
                //             valueField: 'sab_id',
                //             displayField: 'sab_libelle',
                //             editable: false,
                //             store: {
                //                 type: 'section'
                //             },
                //             listeners: {
                //                 select: 'onSectionSel'
                //             }
                //         },
                //         {
                //             xtype: 'tbfill'
                //         },
                //         {
                //             xtype: 'segmentedbutton',
                //             items: [{
                //                     text: 'Opérateurs de la section',
                //                     itemId: 'sectionUsers',
                //                     pressed: true
                //                 },
                //                 {
                //                     text: 'Tous les opérateurs',
                //                     itemId: 'allUsers'
                //                 }
                //             ],
                //             listeners: {
                //                 toggle: 'onTypeUserClick'
                //             }
                //         }
                //     ],
                //     columns: [{
                //             dataIndex: 'nbactivite',
                //             width: 64,
                //             resizable: false,
                //             hideable: false,
                //             menuDisabled: true,
                //             renderer: function (sValue, oCell, oData) {
                //                 var sReturn = "";
                //                 // TODO: 2019-03-27 23:55:20 HVT, déplacer le badge sur la photo de l'opérateur
                //                 // if (parseInt(oData.get('nbactivite'), 10) > 0) {
                //                 //     sReturn += '<div class="thot-icon-working-medium icon-green badge" data-count="' + oData.get('nbactivite') + '"  data-qtip="' + oData.get('nbactivite') + ' activités en cours"> </div>';
                //                 // }
                //                 // if (parseInt(oData.get('rsc_utilisable')) == 0) {
                //                 //     sReturn = '<div class="thot-icon-alea-medium icon-warning" data-qtip="Aléa en cours"> </div>';
                //                 // }
                //                 switch (oData.get('oct_code')) {
                //                     case 'PROD': // PRODUCTION
                //                         sReturn += '<div class="thot-icon-working-medium icon-green" data-qtip="Production"> </div>';
                //                         break;
                //                     case 'QUAL': // QUALITE
                //                         sReturn += '<div class="thot-icon-quality-medium thot-QUAL-color" data-qtip="Qualité"> </div>';
                //                         break;
                //                     case 'HRPR': // HORS PROD
                //                         sReturn += '<div class="thot-icon-alea-medium thot-HRPR-color" data-qtip="Hors production"> </div>';
                //                         break;
                //                     case 'NPLN': // NON PLANIFIE
                //                         sReturn += '<div class="thot-icon-unplaned-medium thot-NPLN-color" data-qtip="Non planifié"> </div>';
                //                         break;
                //                 }
                //                 // cas particulier, si l'utilisateur est en réglage on affiche l'icône réglage (ce n'est pas un type défini dans OCT)
                //                 if (parseInt(oData.get('rglencours'), 10) == 1) {
                //                     sReturn = '<div class="thot-icon-wrench-medium" data-qtip="Réglage en cours" data-qalign="bl-tl"> </div>';
                //                 }
                //                 return sReturn;
                //             }
                //         },
                //         {
                //             dataIndex: 'rsc_image',
                //             // text: 'Trombine',
                //             width: 75,
                //             resizable: false,
                //             hideable: false,
                //             renderer: function (sValue, oCell, oData) {
                //                 var sReturn = '<div class="thot-card-user"><div class="img" style="background-image: url(\'resources/images/' + oData.get('rsc_image') + '\')"></div></div>';
                //                 return sReturn;
                //             }
                //         },
                //         {
                //             dataIndex: 'usr_nom',
                //             text: 'Nom',
                //             filter: {
                //                 type: 'string',
                //                 itemDefaults: {
                //                     // any Ext.form.field.Text configs accepted
                //                 }
                //             },
                //             width: 200,
                //             renderer: function (sValue, oCell, oData) {
                //                 var sReturn = oData.get('usr_nom');
                //                 if (parseInt(oData.get('rsc_utilisable')) == 0) {
                //                     sReturn = '<span class="thot-dimmed-info">' + oData.get('usr_nom') + '</span>';
                //                 }
                //                 return sReturn;
                //             }
                //         },
                //         {
                //             dataIndex: 'usr_prenom',
                //             text: 'Prénom',
                //             width: 200,
                //             renderer: function (sValue, oCell, oData) {
                //                 var sReturn = oData.get('usr_prenom');
                //                 if (parseInt(oData.get('rsc_utilisable')) == 0) {
                //                     sReturn = '<span class="thot-dimmed-info">' + oData.get('usr_prenom') + '</span>';
                //                 }
                //                 return sReturn;
                //             }
                //         },
                //         {
                //             dataIndex: 'sab_libelle',
                //             text: 'Section',
                //             flex: 1,
                //             filter: {
                //                 type: 'list',
                //                 itemDefaults: {
                //                     // any Ext.form.field.Text configs accepted
                //                 }
                //             },
                //             renderer: function (sValue, oCell, oData) {
                //                 var sReturn = oData.get('sab_libelle');
                //                 if (parseInt(oData.get('rsc_utilisable')) == 0) {
                //                     sReturn = '<span class="thot-dimmed-info">' + oData.get('sab_libelle') + '</span>';
                //                 }
                //                 return sReturn;
                //             }
                //         }
                //     ]
                // },
                { // Sélection de l'équipement utilisé
                    xtype: 'gridpanel',
                    itemId: 'workStnSel',
                    store: {
                        type: 'workstnselect'
                    },
                    listeners: {
                        beforeselect: {
                            // gestion des lignes ne devant pas être sélectionnées (ressource inutilisable)
                            // interdit la sélection de la ligne considérée
                            fn: function (grid, oData) {
                                if (parseInt(oData.get('rsc_utilisable')) == 0) {
                                    return false;
                                }
                            }
                        },
                        select: 'onWorkStnSel'
                    },
                    tbar: [{
                            xtype: 'hidden',
                            itemId: 'selectedWorkStnId',
                            value: 0,
                            assistEnabled: true
                        },
                        {
                            xtype: 'hidden',
                            itemId: 'selectedWorkStn'
                        }
                    ],
                    columns: [{
                            dataIndex: 'surutilisation',
                            width: 64,
                            resizable: false,
                            hideable: false,
                            menuDisabled: true,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = '';

                                switch (parseInt(sValue, 10)) {
                                    case 1: // machine multi opérateurs utilisée avec nb occurrences < max (orange)
                                        sReturn = '<div class="thot-icon-working-medium icon-green badge" data-count="' + oData.get('nboccurence') + '"  data-qtip="' + oData.get('nboccurence') + ' activités en cours"> </div>';
                                        break;
                                    case 2: // machine exclusive ou simultanée mono opérateur et utilisée (rouge)
                                        sReturn = '<div class="thot-icon-working-medium icon-green badge" data-count="' + oData.get('nboccurence') + '"  data-qtip="' + oData.get('nboccurence') + ' activités en cours"> </div>';
                                        break;
                                    default: // machine inutilisée
                                        sReturn = '';
                                }
                                if (parseInt(oData.get('rsc_utilisable')) == 0) {
                                    sReturn = '<div class="thot-icon-ban-medium icon-error" data-qtip="Equipement indisponible"> </div>';
                                }
                                return sReturn;
                            }
                        },
                        {
                            dataIndex: 'rsc_estchargee',
                            width: 32,
                            resizable: false,
                            hideable: false,
                            menuDisabled: true,
                            //                            text: 'Chargée',
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = '';

                                switch (parseInt(sValue, 10)) {
                                    case 2: //charge explicite, affectation par l'ordonnancement
                                        sReturn = "<div class='thot-icon-charged-medium icon-green' data-qtip='Opérations à réaliser (premier choix)'></div>";
                                        break;
                                    case 1: // charge implicite, non affecté par l'ordonnancement mais peut remplacer une machine chargée explicitement
                                        sReturn = "<div class='thot-icon-charged-medium icon-dimmed' data-qtip='Opérations à réaliser (substitution)'></div>";
                                        break;
                                    default:
                                        sReturn = '';
                                }

                                return sReturn;
                            }
                        },
                        {
                            dataIndex: 'eqp_simultaneite_requise',
                            width: 32,
                            resizable: false,
                            hideable: false,
                            menuDisabled: true,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = "";

                                switch (parseInt(sValue, 10)) {
                                    case 1: // simultanéité requise
                                        sReturn = "<div class='thot-icon-simultane-medium icon-important' data-qtip='simultanéité requise'></div>";
                                        break;
                                    default:
                                        sReturn = '';
                                }

                                return sReturn;
                            }
                        },
                        {
                            dataIndex: 'rsc_code',
                            text: 'Code',
                            width: 200,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = oData.get('rsc_code');
                                if (parseInt(oData.get('rsc_utilisable')) == 0) {
                                    sReturn = '<span class="thot-dimmed-info">' + oData.get('rsc_code') + '</span>';
                                }
                                return sReturn;
                            }
                        },
                        {
                            dataIndex: 'rsc_libelle',
                            text: 'Libellé',
                            flex: 1,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = oData.get('rsc_libelle');
                                if (parseInt(oData.get('rsc_utilisable')) == 0) {
                                    sReturn = '<span class="thot-dimmed-info">' + oData.get('rsc_code') + '</span>';
                                }
                                return sReturn;
                            }
                        },
                        { // indicateur paramétrage non défini
                            dataIndex: 'prmnok',
                            text: '',
                            tooltip: 'Indicateur de défaut de paramétrage',
                            width: 32,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = '';
                                if (parseInt(oData.get('prmnok')) == 1) {
                                    sReturn = '<div class="thot-icon-prmnok-medium icon-warning" data-qtip="Paramétrage non défini, contactez un administrateur." data-qalign="bl-tl"> </div>';
                                }
                                return sReturn;
                            }
                        }
                    ]
                },
                { // Sélection de l'opération réalisée (une opération par secteur de production)
                    xtype: 'panel',
                    itemId: "unplanedOPSel",
                    flex: 1,
                    tbar: [ // barre d'outils
                        { // masqué, identifiant  del'OF sélectionné dans la grille
                            xtype: "hidden",
                            itemId: "selectedOfId",
                            value: 0
                        },
                        { // masqué, numéro de l'OF sélectionné dans la grille
                            xtype: "hidden",
                            itemId: "selectedOfCode"
                        },
                        { // masqué, identifiant de l'opération complémentaire sélectionnée (boutons)
                            xtype: "hidden",
                            itemId: "selectedCompActId"
                        },
                        { // masqué, libellé de l'opération complémentaire sélectionnée (boutons)
                            xtype: "hidden",
                            itemId: "selectedCompAct"
                        }
                    ],
                    dockedItems: [{
                        xtype: 'container',
                        itemId: 'unplanedOPSelCtr',
                        padding: '0 10 ',
                        scrollable: 'vertical',
                        defaults: {
                            margin: '0 0 5 0',
                        },
                        layout: 'form'
                    }]
                }
            ],
            buttons: [{
                    itemId: 'cancel',
                    ui: 'cancel',
                    text: 'Annuler',
                    //icon: 'resources/images/16x16/cancel.png',
                    iconCls: 'thot-icon-cancel',
                    minWidth: 120,
                    handler: 'onCancelClick'
                },
                {
                    itemId: 'previous',
                    text: 'Précédent',
                    iconCls: 'thot-icon-previous',
                    handler: 'onPreviousClick',
                    minWidth: 120,
                    disabled: true
                },
                {
                    itemId: 'next',
                    // ui: 'succes',
                    text: 'Suivant',
                    iconCls: 'thot-icon-next',
                    minWidth: 120,
                    handler: 'onNextClick'
                }
            ]
        }
    ]
});