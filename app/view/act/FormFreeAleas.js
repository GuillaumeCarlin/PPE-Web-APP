Ext.define('Thot.view.act.FormFreeAleas', {
    extend: 'Ext.form.Panel',
    xtype: 'newfreealea',
    itemId: 'frmfreealea',
    requires: [
        'Thot.view.act.FormFreeAleasController',
        'Thot.view.act.FormFreeAleasModel'
    ],
    controller: 'act-formfreealeas',
    viewModel: {
        type: 'act-formfreealeas'
    },
    listeners: {
        afterrender: 'onAfterRender'
        //validForm: '_fTest'
    },
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    // DEV: 2019-03-20 16:44:38 HVT, désactivé à la demande de FBN et PBD en attendant d'y voir plus clair
    // tbar: [
    //     {
    //         xtype: 'button',
    //         itemId: 'schedBtn',
    //         iconCls: 'fa fa-clock-o fa-2x',
    //         text: 'Programmation',
    //         //disabled: true,
    //         tipTpl: new Ext.Template([
    //             '<b>Test</b> : {test1}&nbsp;{test2}<br>'
    //         ]),
    //         handler: 'onScheduleClick'
    //     }
    // ],
    items: [{
            xtype: 'displayfield',
            itemId: 'ariane',
            hideLabel: true,
            margin: 0,
            fieldCls: 'filAriane'
        },
        //-----------------------------------------------------
        {
            xtype: 'panel',
            itemId: 'cardPanel',
            flex: 1,
            layout: {
                type: 'card'
            },
            //title: 'My Panel',
            items: [{ // sélection de la ressource porteuse de l'aléa
                    xtype: 'tabpanel',
                    // ui: 'thot-alternative',
                    itemId: 'sourceCard',
                    activeTab: 2,
                    items: [{
                            xtype: 'hidden',
                            itemId: 'sourceId',
                            value: 0,
                            sourceType: '',
                            sourceLabel: ''
                        },
                        // TODO: 2019-03-21 22:57:21 HVT, afficher les onglets en fonction des paramètres généraux
                        { // panneau de sélection des équipements
                            xtype: 'panel',
                            itemId: 'eqpTab',
                            layout: {
                                type: 'fit',
                                align: 'stretch'
                            },
                            flex: 1,
                            title: 'Equipement',
                            hidden: true, // DEV: 2019-03-21 22:59:23 en attendant de gérer l'affichage des onglets
                            items: [{
                                xtype: 'gridpanel',
                                itemId: 'equipments',
                                //title: 'Equipements',
                                flex: 1,
                                store: {
                                    type: 'workstn'
                                },
                                listeners: {
                                    select: 'onWorkStnSel'
                                },
                                tbar: [{
                                        xtype: 'hidden',
                                        itemId: 'selectedEqp'
                                    },
                                    {
                                        xtype: 'combobox',
                                        itemId: 'sectionEqpCbo',
                                        fieldLabel: 'Section',
                                        labelWidth: 80,
                                        allowBlank: false,
                                        width: 300,
                                        margin: '5 100 0 0',
                                        valueField: 'sab_id',
                                        displayField: 'sab_libelle',
                                        editable: false,
                                        store: {
                                            type: 'section'
                                        },
                                        listeners: {
                                            select: 'onSectionEqpSel'
                                        }
                                    },
                                    {
                                        xtype: 'tbfill'
                                    },
                                    {
                                        xtype: 'segmentedbutton',
                                        items: [{
                                                text: 'Equipements de la section',
                                                itemId: 'sectionEqp',
                                                pressed: true
                                            },
                                            {
                                                text: 'Tous les équipements',
                                                itemId: 'allEqp'
                                            }
                                        ],
                                        listeners: {
                                            toggle: 'onTypeEqpClick'
                                        }
                                    }
                                ],
                                columns: [{
                                        dataIndex: 'rsc_code',
                                        text: 'Code',
                                        width: 100
                                    },
                                    {
                                        dataIndex: 'rsc_libelle',
                                        text: 'Equipement',
                                        width: 300
                                    }
                                ]
                            }]
                        },
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
                                    itemclick: 'onUserSel'

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
                                        itemId: 'sectionUsrCbo',
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
                        // { // panneau de sélection des opérateurs
                        //     xtype: 'panel',
                        //     itemId: 'usrTab',
                        //     title: 'Opérateur',
                        //     hidden: false, // DEV: 2019-03-21 22:59:23 en attendant de gérer l'affichage des onglets
                        //     layout: {
                        //         type: 'fit',
                        //         align: 'stretch'
                        //     },
                        //     items: [
                        //         { // grille de sélection des opérateurs
                        //         xtype: 'gridpanel',
                        //         itemId: 'usersGrd',
                        //         felx: 1,
                        //         store: {
                        //             type: 'usersprod'
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
                        //             select: 'onUserSel'
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
                        //                 xtype: 'hidden',
                        //                 itemId: 'selectedUsr'
                        //             },
                        //             {
                        //                 xtype: 'combobox',
                        //                 itemId: 'sectionUsrCbo',
                        //                 fieldLabel: 'Section',
                        //                 labelWidth: 80,
                        //                 allowBlank: false,
                        //                 width: 300,
                        //                 margin: '5 100 0 0',
                        //                 valueField: 'sab_id',
                        //                 displayField: 'sab_libelle',
                        //                 editable: false,
                        //                 store: {
                        //                     type: 'section'
                        //                 },
                        //                 listeners: {
                        //                     select: 'onSectionUsrSel'
                        //                 }
                        //             },
                        //             {
                        //                 xtype: 'tbfill'
                        //             },
                        //             {
                        //                 xtype: 'segmentedbutton',
                        //                 items: [{
                        //                         text: 'Opérateur de la section',
                        //                         itemId: 'sectionUsr',
                        //                         pressed: true
                        //                     },
                        //                     {
                        //                         text: 'Tous les opérateurs',
                        //                         itemId: 'allUsr'
                        //                     }
                        //                 ],
                        //                 listeners: {
                        //                     toggle: 'onTypeUsrClick'
                        //                 }
                        //             }
                        //         ],
                        //         columns: [{
                        //                 dataIndex: 'nbactivite',
                        //                 width: 64,
                        //                 resizable: false,
                        //                 hideable: false,
                        //                 menuDisabled: true,
                        //                 sortable: false,
                        //                 groupable: false,
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
                        //             }, {
                        //                 dataIndex: 'rsc_image',
                        //                 // text: 'Trombine',
                        //                 width: 75,
                        //                 resizable: false,
                        //                 hideable: false,
                        //                 menuDisabled: true,
                        //                 sortable: false,
                        //                 groupable: false,
                        //                 renderer: function (sValue, oCell, oData) {
                        //                     var sReturn = '<div class="thot-card-user"><div class="img" style="background-image: url(\'resources/images/' + oData.get('rsc_image') + '\')"></div></div>';
                        //                     return sReturn;
                        //                 }
                        //             }, {
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
                        //                         sReturn = '<span class="thot-dimmed-info">' + oData.get('usr_nom') + '</span>';
                        //                     }
                        //                     return sReturn;
                        //                 }
                        //             }, {
                        //                 dataIndex: 'usr_prenom',
                        //                 text: 'Prénom',
                        //                 width: 200,
                        //                 renderer: function (sValue, oCell, oData) {
                        //                     var sReturn = oData.get('usr_prenom');
                        //                     if (parseInt(oData.get('rsc_utilisable')) == 0) {
                        //                         sReturn = '<span class="thot-dimmed-info">' + oData.get('usr_prenom') + '</span>';
                        //                     }
                        //                     return sReturn;
                        //                 }
                        //             }, { // TODO: 2019-03-05 12:19:32, ajouter le filtrage sur cette colonne, type list
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
                        //                         sReturn = '<span class="thot-dimmed-info">' + oData.get('sab_libelle') + '</span>';
                        //                     }
                        //                     return sReturn;
                        //                 }
                        //             }

                        //             //     dataIndex: 'rsc_image',
                        //             //     // text: 'Trombine',
                        //             //     width: 75,
                        //             //     resizable: false,
                        //             //     hideable: false,
                        //             //     renderer: function (sValue, oCell, oData) {
                        //             //         var sReturn = '<div class="thot-card-user"><div class="img" style="background-image: url(\'resources/images/' + oData.get('rsc_image') + '\')"></div></div>';
                        //             //         return sReturn;
                        //             //     }
                        //             // },
                        //             // {
                        //             //     dataIndex: 'usr_nom',
                        //             //     text: 'Nom',
                        //             //     width: 200
                        //             // },
                        //             // {
                        //             //     dataIndex: 'usr_prenom',
                        //             //     text: 'Prénom',
                        //             //     width: 200
                        //             // },
                        //             // {
                        //             //     dataIndex: 'sab_libelle',
                        //             //     text: 'Section',
                        //             //     width: 200,
                        //             //     flex: 1
                        //             // }
                        //         ]
                        //     }]
                        // }
                    ]
                },
                { // panneau de sélection des aléas
                    xtype: 'form',
                    itemId: 'aleaCard',
                    //bodyPadding: 10,
                    //title: 'My Form'
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{ // espace des messages
                            xtype: 'container',
                            itemId: 'messages',
                        },
                        { // espace des boutons, remplie en fonction des options définies en base de données
                            xtype: 'container',
                            itemId: 'aleasSel',
                            padding: '10',
                            flex: 1,
                        }
                    ]
                },
                { // panneau de programmation des aléas
                    xtype: 'form',
                    itemId: 'scheduleCard',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    bodyPadding: 10,
                    items: [{
                            xtype: 'fieldset',
                            title: 'Programmation',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            defaults: {
                                labelWidth: 130
                            },
                            flex: 1,
                            items: [{
                                    xtype: 'checkbox',
                                    itemId: 'alp_estactif',
                                    fieldLabel: 'Programmation active'
                                },
                                {
                                    xtype: 'datetimefield',
                                    itemId: 'alp_date_debutprog',
                                    format: 'd/m/Y H:i',
                                    todayText: "Aujourd'hui",
                                    hourText: 'Heure',
                                    minuteText: 'Minute',
                                    formatText: 'Format de date attendu : {0}',
                                    anchor: '100%',
                                    fieldLabel: 'début programmé'
                                },
                                {
                                    xtype: 'datetimefield',
                                    itemId: 'alp_date_finprog',
                                    format: 'd/m/Y H:i',
                                    todayText: 'Aujourd\'hui',
                                    hourText: 'Heure',
                                    minuteText: 'Minute',
                                    formatText: 'Format de date attendu : {0}',
                                    anchor: '100%',
                                    fieldLabel: 'fin programmée'
                                },
                                {
                                    xtype: 'checkbox',
                                    itemId: 'alp_estimpose',
                                    fieldLabel: 'dates imposées'
                                },
                                {
                                    xtype: 'checkbox',
                                    itemId: 'acceptNotif',
                                    checked: true,
                                    fieldLabel: 'Recevoir les notifications de modification'
                                }
                            ]
                        },
                        {
                            xtype: 'htmleditor',
                            itemId: 'alp_commentaire',
                            enableAlignments: false,
                            flex: 1,
                            margin: '20 10 10 10',
                            enableLinks: false,
                            enableSourceEdit: false
                        }
                    ]
                }
            ],
            buttons: [
                '->',
                {
                    text: 'Terminer l\'aléa',
                    itemId: 'aleaBtn',
                    ui: 'thot-action',
                    iconCls: 'x-fa fa-random fa2x',
                    tabindex: 3,
                    //icon: 'resources/images/16x16/cancel.png',
                    handler: 'onAleaStopClick'
                },
                '->',
                {
                    itemId: 'cancel',
                    ui: 'cancel',
                    text: 'Annuler',
                    //icon: 'resources/images/16x16/cancel.png',
                    iconCls: 'thot-icon-cancel',
                    minWidth: 120,
                    handler: 'onCancelClick'
                },
                {
                    itemId: 'continue',
                    text: 'Continuer',
                    //iconCls: 'thot-icon-previous',
                    handler: 'onContinueClic',
                    minWidth: 120,
                    hidden: true
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
                    iconCls: 'thot-icon-next',
                    text: 'Suivant',
                    minWidth: 120,
                    handler: 'onNextClick'
                }
            ]
        }
    ]
});