Ext.define('Thot.view.act.FormCreateAct', {
    extend: 'Ext.form.Panel',
    xtype: 'createactivitie',
    requires: [
        'Thot.view.act.FormCreateActController',
        'Thot.view.act.FormCreateActModel',
        'Ext.grid.feature.Summary'
    ],
    controller: 'act-formcreateact',
    viewModel: {
        type: 'act-formcreateact'
    },
    listeners: {
        afterrender: 'onAfterRender',
        validForm: '_fTest'
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
            items: [ // définition du contenu des cartes du formulaire
                { // sélection des opérateurs en mode dataview
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
                            '                       <div class="thot-icon-wrench-medium " data-qtip="Réglage en cours" data-qalign="bl-tl"> </div>' +
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
                { // sélection des équipements
                    xtype: 'gridpanel',
                    //title: '',
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
                                        sReturn = '<div class="thot-icon-working-medium icon-green badge" data-count="' + oData.get('nboccurence') + '"  data-qtip="' + oData.get('nboccurence') + ' activités en cours" data-qalign="bl-tl"> </div>';
                                        break;
                                    case 2: // machine exclusive ou simultanée mono opérateur et utilisée (rouge)
                                        sReturn = '<div class="thot-icon-working-medium icon-green badge" data-count="' + oData.get('nboccurence') + '"  data-qtip="' + oData.get('nboccurence') + ' activités en cours" data-qalign="bl-tl"> </div>';
                                        break;
                                    default: // machine inutilisée
                                        sReturn = '';
                                }
                                if (parseInt(oData.get('rsc_utilisable')) == 0) {
                                    sReturn = '<div class="thot-icon-ban-medium icon-error" data-qtip="Equipement indisponible" data-qalign="bl-tl"> </div>';
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
                                        sReturn = '<div class="thot-icon-charged-medium icon-green" data-qtip="Opérations à réaliser (Planning Ordonnancement)" data-qalign="bl-tl"></div>';
                                        break;
                                    case 1: // charge implicite, non affecté par l'ordonnancement mais peut remplacer une machine chargée explicitement
                                        sReturn = '<div class="thot-icon-charged-medium icon-dimmed" data-qtip="Opérations à réaliser (Equipement de remplacement)" data-qalign="bl-tl"></div>';
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
                                        sReturn = '<div class="thot-icon-simultane-medium icon-important" data-qtip="simultanéité requise" data-qalign="bl-tl"></div>';
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
                { // sélection des opérations
                    xtype: 'gridpanel',
                    //title: '',
                    itemId: 'operationSel',
                    store: {
                        type: 'operations'
                    },
                    listeners: {
                        beforeselect: {
                            // gestion des lignes ne devant pas être sélectionnées (réglage en cours)
                            // interdit la sélection de la ligne considérée
                            fn: function (grid, oData) {
                                if (parseInt(oData.get('rgl_encours')) == 1) {
                                    return false;
                                }
                            }
                        },
                        select: 'onOperationSel'
                    },
                    features: {
                        ftype: 'summary',
                        dock: 'top'
                    },
                    //plugins: 'gridfilters',
                    tbar: [{
                            xtype: 'hidden',
                            itemId: 'selectedOperationId',
                            value: 0
                        },
                        {
                            xtype: 'hidden',
                            itemId: 'selectedOperation'
                        },
                        {
                            xtype: 'numkeyboard',
                            itemId: 'ofNum',
                            fieldLabel: 'O.F.',
                            labelWidth: 30,
                            listeners: {
                                change: 'onPickerValueChange'
                            }
                        },
                        {
                            xtype: 'button',
                            itemId: 'closedOf',
                            text: 'O.F. Terminés',
                            iconCls: 'x-fa fa-search fa2x',
                            enableToggle: true,
                            hidden: true,
                            handler: 'onClosedOfClick'
                        },
                        '->',
                        {
                            xtype: 'segmentedbutton',
                            itemId: 'opeType',
                            allowMultiple: true,
                            items: [{
                                    text: 'Opérations alternatives',
                                    tooltip: {
                                        title: 'Opérations alternatives',
                                        text: 'Affiche les opérations alternatives. Opérations planifiées sur un autre équipement mais réalisables sur l\'équipement en cours.',
                                        align: 'tr-br'
                                    },
                                    itemId: 'altOpe',
                                    pressed: false,
                                    iconCls: 'thot-icon-alternative-medium fa-rotate-90'
                                },
                                {
                                    text: 'Opérations en cours',
                                    tooltip: 'Affiche les opérations en cours de réalisation.',
                                    itemId: 'actOpe',
                                    pressed: false,
                                    iconCls: 'thot-icon-working-medium'
                                }, {
                                    text: 'Opérations terminées',
                                    tooltip: 'Affiche les opérations terminées.',
                                    itemId: 'stopOpe',
                                    pressed: false,
                                    iconCls: 'thot-icon-stop-medium'
                                }
                            ],
                            listeners: {
                                toggle: 'opeFilter'
                            }
                        },
                        {
                            ui: 'alert',
                            enableToggle: true,
                            itemId: 'assist',
                            text: 'Collaboratif',
                            tooltip: {
                                title: 'Mode collaboratif',
                                text: 'Active/désactive le mode collaboratif. Plusieurs opérateurs réalisent la même opération sur le même équipement.',
                                align: 'tr-br'
                            },
                            disabled: false,
                            handler: 'opeFilter'
                        }
                    ],
                    columns: [{
                            dataIndex: 'priorite',
                            width: 32,
                            resizable: false,
                            hideable: false,
                            menuDisabled: true,
                            sortable: false,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = "";

                                switch (parseInt(sValue, 10)) {
                                    case 1: // opération planifiée sur un autre équipement, utiliser celui-ci en second choix
                                        sReturn = '<div class="thot-icon-alternative-medium icon-error fa-rotate-90" data-qtip="Opération prévue sur ' + oData.get('rsc_code_prevu') + '" data-qalign="bl-tl"></div>';
                                        break;
                                    default:
                                        sReturn = '';
                                }

                                return sReturn;
                            }
                        },
                        {
                            dataIndex: 'encours',
                            width: 32,
                            resizable: false,
                            hideable: false,
                            menuDisabled: true,
                            sortable: false,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = "";
                                if (parseInt(sValue, 10) == 1) {
                                    // HVT : : l'opération est en cours, il est possible de l'utiliser en collaboratif
                                    sReturn = "<div class='thot-icon-working-medium icon-green' data-qtip='Activité en cours' data-qalign='bl-tl'></div>";
                                }
                                if (parseInt(oData.get('rgl_encours')) == 1) {
                                    // HVT: 2019-11-17 09:44:10: l'opération est en cours de réglage, création d'activité interdite
                                    sReturn = '<div class="thot-icon-wrench-medium icon-red" data-qtip="Cette opération est en cours de réglage, création d\'activité interdite" data-qalign="bl-tl"></div>';
                                }
                                return sReturn;
                            }
                        },
                        {
                            dataIndex: 'odf_code',
                            text: 'OF',
                            width: 70,
                            resizable: false,
                            sortable: false,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = sValue;
                                if (parseInt(oData.get('rgl_encours')) == 1) {
                                    sReturn = '<span class="thot-dimmed-info">' + sValue + '</span>';
                                }
                                return sReturn;
                            }
                        },
                        {
                            dataIndex: 'opn_code',
                            summaryType: 'count',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return Ext.String.format('{0} opération{1} trouvée{1}', value, value !== 1 ? 's' : '');
                            },
                            text: 'OP',
                            width: 150,
                            minWidth: 150,
                            resizable: false,
                            sortable: false,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = sValue;
                                if (parseInt(oData.get('rgl_encours')) == 1) {
                                    // opération en cours de réglage
                                    sReturn = '<span class="thot-dimmed-info">' + sValue + '</span>';
                                }
                                if (parseInt(oData.data.opn_estterminee, 10) == 1) {
                                    oCell.style = "font-weight: bold; color: navy; background-color: #f98989;";
                                    oCell.tooltip = "Opération terminée";
                                    sReturn = '<div data-qtip="Opération terminée le ' + oData.get('opn_datefinreel') + '">' + sValue + '</div>';
                                }
                                return sReturn;
                            }
                        },

                        {
                            dataIndex: 'pst_libelle',
                            text: 'Poste',
                            flex: 1,
                            sortable: false,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = sValue;
                                if (parseInt(oData.get('rgl_encours')) == 1) {
                                    sReturn = '<span class="thot-dimmed-info">' + sValue + '</span>';
                                }
                                return sReturn;
                            }
                        },
                        {
                            dataIndex: 'odf_quantite_lancee',
                            text: 'Qté lancée',
                            align: 'right',
                            width: 70,
                            sortable: false,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = sValue;
                                if (parseInt(oData.get('rgl_encours')) == 1) {
                                    sReturn = '<span class="thot-dimmed-info">' + sValue + '</span>';
                                }
                                return sReturn;
                            }
                        },
                        {
                            dataIndex: 'pdt_libelle',
                            text: 'Produit',
                            flex: 1,
                            sortable: false,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = sValue;
                                if (parseInt(oData.get('rgl_encours')) == 1) {
                                    sReturn = '<span class="thot-dimmed-info">' + sValue + '</span>';
                                }
                                return sReturn;
                            }
                        }
                    ]
                }
            ],
            buttons: [ // boutons du pied de formulaire
                {
                    itemId: 'nonrealisee',
                    ui: 'alert',
                    text: 'Non réalisée',
                    iconCls: 'thot-icon-cancel',
                    minWidth: 120,
                    hidden: true,
                    handler: 'onNonRealiseeClick'
                },
                '->',
                {
                    itemId: 'cancel',
                    ui: 'cancel',
                    text: 'Annuler',
                    //icon: 'resources/images/16x16/cancel.png',
                    iconCls: 'thot-icon-cancel',
                    minWidth: 120,
                    handler: 'onCancelClic'
                },
                {
                    itemId: 'previous',
                    text: 'Précédent',
                    iconCls: 'thot-icon-previous',
                    handler: 'onPreviousClic',
                    minWidth: 120,
                    disabled: true
                },
                {
                    itemId: 'next',
                    // ui: 'succes',
                    text: 'Suivant',
                    iconCls: 'thot-icon-next',
                    minWidth: 120,
                    handler: 'onNextClic'
                }
            ]
        }
    ]
});