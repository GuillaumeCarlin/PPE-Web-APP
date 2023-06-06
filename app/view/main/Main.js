/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 */
Ext.define('Thot.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',
    itemId: 'mainTab',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Thot.view.main.MainController',
        'Thot.view.main.MainModel',
        'Thot.view.main.List'
    ],
    controller: 'main',
    viewModel: 'main',
    ui: 'thot-navigation',
    tabBarHeaderPosition: 1,
    titleRotation: 0,
    tabRotation: 0,
    socket: null,
    header: {
        layout: {
            align: 'stretch'
        },
        title: {
            bind: {
                html: '<a id="spinner">TH<i class="fa fa-circle-o-notch"></i>T</a>'
            },
            flex: 0
        }
    },
    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'scroller'
        },
        items: [{ // DEV: hvt 2020-04-29 20:17:02 ajout d'un bouton dans la barre d'onglets
            xtype: 'tbfill'
        },
        {
            xtype: 'button',
            disabled: false,
            itemId: 'btnappinfo',
            reference: 'btnappinfo',
            /**
             * indication de la version de l'application
             * le numéro de version et le tooltip sont mis à jour par le controlleur
             */
            ui: 'thot-header',
            text: '',
            tooltip: {
                text: '',
                autoHide: false,
                closable: true,
                align: 'tr-bl'
            },
        }
        ]
    },
    responsiveConfig: {
        tall: {
            headerPosition: 'top'
        },
        wide: {
            headerPosition: 'left'
        }
    },
    defaults: {
        ui: 'thot-main',
        layout: {
            align: 'stretch',
            type: 'vbox'
        },
        tabConfig: {
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    width: 100
                },
                tall: {
                    iconAlign: 'left',
                    textAlign: 'center',
                    width: 120
                }
            }
        }
    },
    listeners: {
        beforerender: 'onBeforeRender',
        afterrender: 'onAfterRender',
        tabchange: 'onTabChange',
        listsrefresh: 'onListsRefresh',
        send: 'onSend'
    },
    tbar: {
        // barre d'outils supérieure
        itemId: 'maintoolbar',
        ui: 'thot-apptoolbar',
        items: [{
            xtype: 'hidden',
            itemId: 'sectionId'
        },
        {
            itemId: 'sectionBtn',
            ui: 'thot-header',
            iconCls: 'x-fa fa-industry',
            tooltip: {
                text: Thot.Labels.actions.selectWorkshop.tooltip,
                align: 'tl-bl'
            },
            handler: 'onSectionClic'
        },
        {
            xtype: 'displayfield',
            itemId: 'sectionLabel',
            fieldCls: 'thot-label-headerbar',
            value: ''
        },
        {
            itemId: 'infoSectionBtn',
            ui: 'thot-header',
            tooltip: {
                text: Thot.Labels.actions.listWorkshop.tooltip,
                align: 'tl-bl'
            },
            iconCls: 'x-fa fa-list-alt',
            visible: false,
            handler: 'onInfoSectionClic'
        },
        {
            xtype: 'tbseparator'
        },
        {
            itemId: 'newnote',
            ui: 'thot-header',
            tooltip: {
                text: Thot.Labels.actions.newNote.tooltip,
                align: 'tl-bl'
            },
            iconCls: 'x-fa fa-comment',
            handler: 'onNewNoteClick'
        },
            '->',
        {
            itemId: 'usericon',
            ui: 'thot-header',
            iconCls: 'x-fa fa-user-circle',
            hidden: true
        },
        {
            xtype: 'displayfield',
            itemId: 'username',
            fieldCls: 'thot-label-headerbar',
            value: ''
        },
        {
            itemId: 'authBtn',
            ui: 'thot-header',
            tooltip: {
                text: Thot.Labels.actions.login.tooltip,
                align: 'tr-br'
            },
            iconCls: 'x-fa fa-sign-in',
            handler: 'onAuthClick'
        },
        {
            itemId: 'logoutBtn',
            ui: 'thot-header',
            tooltip: {
                text: Thot.Labels.actions.logout.tooltip,
                align: 'tr-br'
            },
            iconCls: 'x-fa fa-sign-out',
            hidden: true,
            handler: 'onLogoutClick'
        },
        {
            xtype: 'tbseparator'
        },
        {
            itemId: 'helpBtn',
            ui: 'thot-header',
            tooltip: {
                text: Thot.Labels.actions.help.tooltip,
                align: 'tr-br'
            },
            href: 'http://fakepath/Thot/documentation/',
            iconCls: 'x-fa fa-question-circle'
        },
        {
            itemId: 'fullscreenBtn',
            id: 'fullscreenBtn',
            ui: 'thot-header',
            tooltip: {
                text: Thot.Labels.actions.fullscreen.tooltip,
                align: 'tr-br'
            },
            iconCls: 'x-fa fa-window-maximize',
            handler: 'onFullscreenClick'
        },
        {
            itemId: 'wssignal',
            id: 'wssignal', // pour être retrouvé avec Ext.getCmp()
            ui: 'thot-header',
            tooltip: {
                text: Thot.Labels.actions.checkWSS.tooltip,
                align: 'tr-br'
            },
            iconCls: 'x-fa fa-signal',
            handler: 'webSocketsCnx'
        }
        ]
    },
    activeTab: 'actTab',
    items: [
        // onglets latéraux
        {
            // DEV: 2019-03-08 14:22:09 HVT, onglet en phase de développement, à désactiver avant mise en production
            title: Thot.Labels.labels.dashboard.text,
            hidden: true,
            itemId: 'tdbTab',
            tooltip: {
                text: Thot.Labels.labels.dashboard.tooltip,
                align: 'l-r'
            },
            iconCls: 'x-fa fa-tachometer',
            items: [{
                xtype: 'cmpactcard', //tdb
                flex: 1
            }]
        },
        {
            title: Thot.Labels.labels.activities.text,
            itemId: 'actTab',
            tooltip: {
                text: Thot.Labels.labels.activities.tooltip,
                align: 'l-r'
            },
            // iconCls: "x-fa fa-wrench",
            iconCls: 'x-fa fa-play-circle-o',
            items: [{
                // xtype: "currentact",
                xtype: 'containeractusr',
                itemId: 'currentactivities',
                flex: 1
            }]
        },
        {
            title: Thot.Labels.labels.alerts.text,
            itemId: 'homeTab',
            tooltip: {
                text: Thot.Labels.labels.alerts.tooltip,
                align: 'l-r'
            },
            iconCls: 'x-fa fa-bell',
            items: [{
                xtype: 'mainlist',
                flex: 1
            }]
        },
        {
            title: Thot.Labels.labels.notes.text,
            itemId: 'messagesTab',
            tooltip: {
                text: Thot.Labels.labels.notes.tooltip,
                align: 'l-r'
            },
            iconCls: 'x-fa fa-comment',
            items: [{
                xtype: 'messagelist',
                itemId: 'messagelist', // cet itemId permet d'identifier le formulaire pour le rafraichissement
                flex: 1
            }]
        },
        {
            title: Thot.Labels.labels.search.text,
            itemId: 'searchTab',
            tooltip: {
                text: Thot.Labels.labels.search.tooltip,
                align: 'l-r'
            },
            iconCls: 'x-fa fa-search',
            items: [{
                xtype: 'search',
                itemId: 'search',
                flex: 1
            }]
        },
        {
            hidden: true,
            title: Thot.Labels.labels.consolidatedData.text,
            itemId: 'consolidation',
            tooltip: {
                text: Thot.Labels.labels.consolidatedData.tooltip,
                align: 'l-r'
            },
            iconCls: 'x-fa fa-database'
        },
        { // Page Statistique
            title: Thot.Labels.labels.analyse.text,
            itemId: 'AnalyseTab',
            tooltip: {
                text: Thot.Labels.labels.analyse.tooltip,
                align: 'l-r'
            },
            disabled: false,
            iconCls: 'x-fa fa-line-chart',
            items: [{
                xtype: 'containerstat',
                flex: 1
            }]
        },
        { // Page API
            title: Thot.Labels.labels.api.text,
            itemId: 'ApiTab',
            tooltip: {
                text: Thot.Labels.labels.api.tooltip,
                align: 'l-r'
            },
            disabled: false,
            iconCls: 'x-fa fa-wifi',
            items: [{
                xtype: 'containerapi',
                flex: 1
            }]
        },

        // {
        //     title: "Statut équipe",
        //     itemId: "teamTab",
        //     tooltip: {
        //         text: "Consultation du statut des opérateurs de l'équipe",
        //         align: "l-r"
        //     },

        //     disabled: false,
        //     iconCls: "x-fa fa-users",
        //     items: [{
        //         xtype: "teamstatus",
        //         itemId: "teamstatus",
        //         flex: 1
        //     }]
        // },
        {
            hidden: true,
            // DEV: HVT: caché pour l'instant pour éviter une mise en production intempestive
            title: 'Planning',
            itemId: 'schedulerTab',
            tooltip: {
                text: 'Planning de production',
                aligne: 'l-r'
            },
            disabled: false,
            iconCls: 'x-fa fa-tasks',
            items: [{
                xtype: 'scheduler',
                itemId: 'scheduler',
                flex: 1
            }]
        },
        ////////////// ci-dessous contexte accessible sous autorisation //////////////
        /*
        {
            title: 'Rapports',
            itemId: 'reportTab',
            tooltip:{
                text:'Consultation des rapports.',
            },
            layout: {
                align: 'stretch',
                type: 'vbox'
            },
            iconCls: 'x-fa fa-table',
            items: [
                {
                    xtype: 'reports',
                    itemId: 'reports',
                    flex: 1
                }
            ]
        },
        */
        {
            title: Thot.Labels.labels.history.text,
            itemId: 'revisionTab',
            tooltip: {
                text: Thot.Labels.labels.history.tooltip,
                align: 'l-r'
            },
            iconCls: 'x-fa fa-history',
            disabled: true, //true, //en prod
            items: [{
                xtype: 'actrevision',
                flex: 1
            }]
        },
        {
            title: Thot.Labels.labels.import.text,
            itemId: 'impexpTab',
            tooltip: {
                text: Thot.Labels.labels.import.tooltip,
                align: 'l-r'
            },
            disabled: true, //true, //en prod
            iconCls: 'x-fa fa-exchange',
            items: [{
                xtype: 'importexport',
                itemId: 'importexport',
                flex: 1
            }]
        },
        {
            title: Thot.Labels.labels.parameters.text,
            itemId: 'paramTab',
            tooltip: {
                text: Thot.Labels.labels.parameters.tooltip,
                align: 'l-r'
            },
            iconCls: 'x-fa fa-cogs',
            items: [{
                xtype: 'appadmin',
                flex: 1
            }]
        },
        { // configuration de l'application
            title: Thot.Labels.labels.config.text,
            itemId: 'configTab',
            tooltip: {
                text: Thot.Labels.labels.config.tooltip,
                align: 'l-r'
            },
            iconCls: 'x-fa fa-sliders',
            items: [{
                xtype: 'configapp',
                flex: 1
            }]
        }
        // {
        //     // DEV: HVT 2019-12-03 22:30:55, volet de test pour affichage conjoint des activités et statut opérateur en défaut
        //     title: "DEV",
        //     itemId: "devtab",
        //     hidden: false,
        //     disabled: false,
        //     items: [{
        //             xtype: "containeractusr",
        //             flex: 1,
        //             hidden: true
        //         },
        //         {
        //             xtype: 'thot-cmpstat',
        //             flex: 1
        //         }
        //     ]
        // }
    ]
});