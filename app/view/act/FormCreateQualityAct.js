Ext.define('Thot.view.act.FormCreateQualityAct', {
    /**
     * @author      Hervé VALOT
     * @date        20181220
     * @description formulaire de création des activités qualité
     * @version     201812230 création
     */
    extend: 'Ext.panel.Panel',
    xtype: 'createqualityactivity',
    requires: [
        'Thot.view.act.FormCreateQualityActController',
        'Thot.view.act.FormCreateQualityActModel',
        'Ext.grid.feature.Summary'
    ],

    controller: 'act-formcreatequalityact',

    viewModel: {
        type: 'act-formcreatequalityact'
    },

    listeners: {
        afterrender: 'onAfterRender' // fonction appelée une fois le formulaire affiché
        // validForm: '' // fonction appelée lors de la validation du formulaire
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    // le formulaire se présente en plusieurs étapes de type 'card'
    // card 1 : sélection de la section et de la personne
    // card 2 : sélection de l'équipement utilisé ou OPA dans le cas opérations sans équipement
    // card 3 : sélection de l'OF ou de la NC (récupère dans G10 le numéro d'OF)
    //        : sélection de l'opération qualité réalisée (interface à boutons pilotés par la BDD)
    items: [{
            // fil d'ariane, élement commun à toutes les cartes
            xtype: 'displayfield',
            itemId: 'ariane',
            hideLabel: true,
            margin: 0,
            fieldCls: 'filAriane'
        },
        { // définition des cartes
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

                // { // sélection de l'opérateur, grille des opérateurs
                //         xtype: 'gridpanel',
                //         itemId: 'operatorSel',
                //         store: {
                //             type: 'usersprod',
                //             autoload: false
                //         },
                //         plugins: 'gridfilters',
                //         listeners: {
                //             beforeselect: {
                //                 // gestion des lignes ne devant pas être sélectionnées (ressource inutilisable)
                //                 // interdit la sélection de la ligne considérée
                //                 fn: function (grid, oData) {
                //                     if (parseInt(oData.get('rsc_utilisable')) == 0) {
                //                         return false;
                //                     }
                //                 }
                //             },
                //             select: 'onOperatorSel'
                //         },
                //         features: [{
                //             /**
                //              * ajout des fonctionnalités de regroupement pour pouvoir
                //              * regrouper les activités par certaines informations
                //              * type activité, section, état ?
                //              */
                //             ftype: 'grouping',
                //             startCollapsed: false,
                //             hideGroupedHeader: false,
                //             /* cacher la colonne du regroupement */
                //             groupHeaderTpl: '{columnName}: {name}'
                //         }],
                //         tbar: [{
                //                 // masqué, contient l'identifiant de la section d'atelier sélectionnée
                //                 xtype: 'hidden',
                //                 itemId: 'selectedSabId',
                //                 value: 0
                //             },
                //             {
                //                 // masqué, contient l'identifiant de l'opérateur sélectionné
                //                 xtype: 'hidden',
                //                 itemId: 'selectedOperId',
                //                 value: 0
                //             },
                //             {
                //                 // masqué, contient le nom de l'opérateur sélectionné
                //                 xtype: 'hidden',
                //                 itemId: 'selectedOper'
                //             },
                //             {
                //                 // combobox, sélection de la section d'atelier
                //                 xtype: 'combobox',
                //                 itemId: 'sectionCbo',
                //                 fieldLabel: 'Section',
                //                 labelWidth: 80,
                //                 width: 300,
                //                 allowBlank: false,
                //                 margin: '0 100 0 0',
                //                 valueField: 'sab_id',
                //                 displayField: 'sab_libelle',
                //                 editable: false,
                //                 store: {
                //                     type: 'section'
                //                 },
                //                 listeners: {
                //                     select: 'onSectionSel'
                //                 }
                //             },
                //             {
                //                 // tbfill, pousse le reste à droite
                //                 xtype: 'tbfill'
                //             },
                //             {
                //                 // boutons pour activer l'affichage des opérateurs de la section ou tous
                //                 xtype: 'segmentedbutton',
                //                 items: [{
                //                         text: 'Opérateurs de la section',
                //                         itemId: 'sectionUsers',
                //                         pressed: true
                //                     },
                //                     {
                //                         text: 'Tous les opérateurs',
                //                         itemId: 'allUsers'
                //                     }
                //                 ],
                //                 listeners: {
                //                     toggle: 'onTypeUserClick'
                //                 }
                //             }
                //         ],
                //         columns: [
                //             // colonnes de la grille des opérateurs
                //             {
                //                 // nombre d'activités en cours
                //                 dataIndex: 'nbactivite',
                //                 width: 64,
                //                 resizable: false,
                //                 hideable: false,
                //                 menuDisabled: true,
                //                 renderer: function (sValue, oCell, oData) {
                //                     var sReturn = '';
                //                     // TODO: 2019-03-27 23:55:20 HVT, déplacer le badge sur la photo de l'opérateur
                //                     // if (parseInt(oData.get('nbactivite'), 10) > 0) {
                //                     //     sReturn += '<div class="thot-icon-working-medium icon-green badge" data-count="' + oData.get('nbactivite') + '"  data-qtip="' + oData.get('nbactivite') + ' activités en cours"> </div>';
                //                     // }
                //                     // if (parseInt(oData.get('rsc_utilisable')) == 0) {
                //                     //     sReturn = '<div class="thot-icon-alea-medium icon-warning" data-qtip="Aléa en cours"> </div>';
                //                     // }
                //                     switch (oData.get('oct_code')) {
                //                         case 'PROD': // PRDUCTION
                //                             sReturn += '<div class="thot-icon-working-medium icon-green" data-qtip="Production"> </div>';
                //                             break;
                //                         case 'QUAL': // QUALITE
                //                             sReturn += '<div class="thot-icon-quality-medium thot-QUAL-color" data-qtip="Qualité"> </div>';
                //                             break;
                //                         case 'HRPR': // HORS PROD
                //                             sReturn += '<div class="thot-icon-alea-medium thot-HRPR-color" data-qtip="Hors production"> </div>';
                //                             break;
                //                         case 'NPLN': // NON PLANIFIE
                //                             sReturn += '<div class="thot-icon-unplaned-medium thot-NPLN-color" data-qtip="Non planifié"> </div>';
                //                             break;
                //                     }
                //                     // cas particulier, si l'utilisateur est en réglage on affiche l'icône réglage (ce n'est pas un type défini dans OCT)
                //                     if (parseInt(oData.get('rglencours'), 10) == 1) {
                //                         sReturn = '<div class="thot-icon-wrench-medium" data-qtip="Réglage en cours" data-qalign="bl-tl"> </div>';
                //                     }
                //                     return sReturn;
                //                 }
                //             },
                //             {
                //                 dataIndex: 'rsc_image',
                //                 // text: 'Trombine',
                //                 width: 75,
                //                 resizable: false,
                //                 hideable: false,
                //                 renderer: function (sValue, oCell, oData) {
                //                     var sReturn = '<div class="thot-card-user"><div class="img" style="background-image: url(\'resources/images/' + oData.get('rsc_image') + '\')"></div></div>';
                //                     return sReturn;
                //                 }
                //             },
                //             {
                //                 // nom de l'utilisateur
                //                 dataIndex: 'usr_nom',
                //                 text: 'Nom',
                //                 filter: {
                //                     type: 'string',
                //                     itemDefaults: {
                //                         // any Ext.form.field.Text configs accepted
                //                     }
                //                 },
                //                 width: 200,
                //                 renderer: function (sValue, oCell, oData) {
                //                     var sReturn = oData.get('usr_nom');
                //                     if (parseInt(oData.get('rsc_utilisable')) == 0) {
                //                         sReturn =
                //                             '<span class="thot-dimmed-info">' +
                //                             oData.get("usr_nom") +
                //                             '</span>';
                //                     }
                //                     return sReturn;
                //                 }
                //             },
                //             {
                //                 // prénom de l'utilisateur
                //                 dataIndex: 'usr_prenom',
                //                 text: 'Prénom',
                //                 width: 200,
                //                 renderer: function (sValue, oCell, oData) {
                //                     var sReturn = oData.get('usr_prenom');
                //                     if (parseInt(oData.get('rsc_utilisable')) == 0) {
                //                         sReturn =
                //                             '<span class="thot-dimmed-info">' +
                //                             oData.get('usr_prenom') +
                //                             '</span>';
                //                     }
                //                     return sReturn;
                //                 }
                //             },
                //             {
                //                 // section de l'utilisateur
                //                 dataIndex: 'sab_libelle',
                //                 text: 'Section',
                //                 flex: 1,
                //                 filter: {
                //                     type: 'list',
                //                     itemDefaults: {
                //                         // any Ext.form.field.Text configs accepted
                //                     }
                //                 },
                //                 renderer: function (sValue, oCell, oData) {
                //                     var sReturn = oData.get('sab_libelle');
                //                     if (parseInt(oData.get('rsc_utilisable')) == 0) {
                //                         sReturn =
                //                             '<span class="thot-dimmed-info">' +
                //                             oData.get('sab_libelle') +
                //                             '</span>';
                //                     }
                //                     return sReturn;
                //                 }
                //             }
                //         ]
                //     },
                { // sélection de l'équipement utilisé
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
                                if (parseInt(oData.get('rsc_utilisableExtensionScriptApis')) == 0) {
                                    return false;
                                }
                            }
                        },
                        select: 'onWorkStnSel'
                    },
                    tbar: [
                        // barre d'outils
                        {
                            // masqué, contient l'identifiant de l'équipement sélectionné
                            xtype: 'hidden',
                            itemId: 'selectedWorkStnId',
                            value: 0,
                            assistEnabled: true
                        },
                        {
                            // masqué, libellé de l'équipement sélectionné
                            xtype: 'hidden',
                            itemId: 'selectedWorkStn'
                        }
                    ],
                    columns: [
                        // grille des équipements
                        {
                            dataIndex: 'surutilisation',
                            width: 64,
                            resizable: false,
                            hideable: false,
                            menuDisabled: true,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = '';

                                switch (parseInt(sValue, 10)) {
                                    case 1: // machine multi opérateurs utilisée avec nb occurrences < max (orange)
                                        sReturn =
                                            '<div class="thot-icon-working-medium icon-green badge" data-count="' +
                                            oData.get("nboccurence") +
                                            '"  data-qtip="' +
                                            oData.get("nboccurence") +
                                            ' activités en cours"> </div>';
                                        break;
                                    case 2: // machine exclusive ou simultanée mono opérateur et utilisée (rouge)
                                        sReturn =
                                            '<div class="thot-icon-working-medium icon-green badge" data-count="' +
                                            oData.get("nboccurence") +
                                            '"  data-qtip="' +
                                            oData.get('nboccurence') +
                                            ' activités en cours"> </div>';
                                        break;
                                    default:
                                        // machine inutilisée
                                        sReturn = '';
                                }
                                if (parseInt(oData.get('rsc_utilisable')) == 0) {
                                    sReturn =
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
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = '';

                                switch (parseInt(sValue, 10)) {
                                    case 2: //charge explicite, affectation par l'ordonnancement
                                        sReturn =
                                            '<div class="thot-icon-charged-medium icon-green" data-qtip="Opérations à réaliser (premier choix)"></div>';
                                        break;
                                    case 1: // charge implicite, non affecté par l'ordonnancement mais peut remplacer une machine chargée explicitement
                                        sReturn =
                                            '<div class="thot-icon-charged-medium icon-dimmed" data-qtip="Opérations à réaliser (substitution)"></div>';
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
                                var sReturn = '';

                                switch (parseInt(sValue, 10)) {
                                    case 1: // simultanéité requise
                                        sReturn =
                                            '<div class="thot-icon-simultane-medium icon-important" data-qtip="simultanéité requise"></div>';
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
                        }, { // indicateur paramétrage non défini
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
                { // recherche OF et création opération qualité
                    xtype: 'gridpanel',
                    itemId: 'ofSel',
                    store: {
                        type: 'oflist'
                    },
                    listeners: {
                        itemclick: 'onOfSelClick'
                    },
                    features: {
                        ftype: 'summary',
                        dock: 'top'
                    },
                    flex: 1,
                    tbar: [
                        // barre d'outils de la grille
                        {
                            // masqué, identifiant  del'OF sélectionné dans la grille
                            xtype: 'hidden',
                            itemId: 'selectedOfId',
                            value: 0
                        },
                        {
                            // masqué, numéro de l'OF sélectionné dans la grille
                            xtype: 'hidden',
                            itemId: 'selectedOfCode'
                        },
                        {
                            // masqué, identifiant de l'opération complémentaire sélectionnée (boutons)
                            xtype: 'hidden',
                            itemId: 'selectedCompActId'
                        },
                        {
                            // masqué, libellé de l'opération complémentaire sélectionnée (boutons)
                            xtype: 'hidden',
                            itemId: 'selectedCompAct'
                        },
                        {
                            // picker personnalisé, saisie du numéro d'OF à chercher
                            xtype: 'numkeyboard',
                            itemId: 'ofNum',
                            fieldLabel: 'O.F.',
                            labelWidth: 30,
                            listeners: {
                                change: 'onPickerValueChange'
                            }
                        }
                    ],
                    columns: [
                        // colonnes de la grille d'affichage des OF trouvés suite à la recherche
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'odf_code',
                            text: 'OF',
                            width: 60
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'pdt_code',
                            text: 'Produit',
                            summaryType: 'count',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return Ext.String.format('{0} OF{1} trouvé{1}', value, value !== 1 ? 's' : '');
                            },

                            flex: 1,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = '';
                                sReturn =
                                    oData.get('pdt_complement') +
                                    ' ' +
                                    oData.get('pdt_libelle') +
                                    ' ' +
                                    oData.get('nce_libelle');
                                return sReturn;
                            }
                        },
                        {
                            xtype: 'datecolumn',
                            dataIndex: 'odf_date_creation',
                            text: 'Date de création',
                            width: 130
                        }
                    ],
                    dockedItems: [{
                            // zone de messages
                            xtype: 'container',
                            itemId: 'messages'
                        },
                        {
                            // liste des boutons pour création opération, mise à jour en fonction des données de la BDD
                            xtype: 'container',
                            itemId: 'qualityActSel',
                            dock: 'right',
                            padding: '0 10 ',
                            scrollable: 'vertical',
                            defaults: {
                                margin: '0 0 5 0'
                            },
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            }
                        }
                    ]
                }
            ],
            buttons: [
                '->', // on pousse tout à droite de la barre d'outils
                {
                    // annuler
                    itemId: 'cancel',
                    ui: 'cancel',
                    text: 'Annuler',
                    iconCls: 'thot-icon-cancel',
                    minWidth: 120,
                    handler: 'onCancelClick'
                },
                {
                    // précédent
                    itemId: 'previous',
                    text: 'Précédent',
                    iconCls: 'thot-icon-previous',
                    handler: 'onPreviousClick',
                    minWidth: 120,
                    disabled: true
                },
                {
                    // suivant
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