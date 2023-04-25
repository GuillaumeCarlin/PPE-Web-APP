Ext.define('Thot.view.adm.CmpImportExport', {
    extend: 'Ext.form.Panel',
    ui: 'thot-panel',
    xtype: 'importexport',
    requires: [
        'Thot.view.adm.CmpImportExportController',
        'Thot.view.adm.CmpImportExportModel'
    ],
    controller: 'adm-cmpimportexport',
    viewModel: {
        type: 'adm-cmpimportexport'
    },
    listeners: {
        afterrender: 'onAfterRender'
    },
    layout: {
        type: 'fit'
    },
    items: [{
        xtype: 'tabpanel',
        // ui: 'thot-alternative',
        items: [{
                xtype: 'panel',
                itemId: 'importTab',
                layout: {
                    align: 'stretch',
                    type: 'vbox'
                },
                flex: 1,
                title: 'Imports',
                iconCls: 'x-fa fa-download',
                items: [{
                    xtype: 'treepanel',
                    ui: 'thot-panel-noborder',
                    itemId: 'modules',
                    title: 'Import des données externes',
                    flex: 1,
                    editable: false,
                    listeners: {
                        checkchange: 'onCheckChange'
                    },
                    columns: [{
                            xtype: 'treecolumn',
                            header: 'Nom',
                            sortable: false,
                            menuDisabled: true,
                            dataIndex: 'ecs_libelle',
                            flex: 1
                        },
                        {
                            dataIndex: 'status',
                            sortable: false,
                            menuDisabled: true,
                            width: 32,
                            resizable: false,
                            draggable: false,
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = "";
                                sReturn = "<div>&nbsp;</div>";

                                switch (sValue) {
                                    case -1:
                                        sReturn = '<div class="thot-icon-spin-medium fa-spin fa-fw"></div>'; //fa fa-refresh fa-spin fa-lg fa-fw
                                        break;

                                    case 1:
                                        sReturn = '<div class="thot-icon-action-succes-medium"></div>';
                                        break;

                                    case 2:
                                        sReturn = '<div class="fa fa-exclamation-circle fa-lg icon-red">&nbsp;</div>';
                                        break;
                                }

                                return sReturn;
                            }
                        },
                        {
                            header: 'Dernier import',
                            sortable: false,
                            menuDisabled: true,
                            dataIndex: 'ece_date_debut',
                            flex: 1
                        }
                    ],
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [{
                            xtype: 'button',
                            text: 'Réinitialiser',
                            handler: 'onInitClick'
                        }]
                    }],
                    bbar: [
                        // {
                        //     xtype: 'displayfield',
                        //     itemId: 'importMsg',
                        //     fieldLabel: 'Compte rendu'
                        // },
                        '->',
                        {
                            text: 'Importer',
                            ui: 'thot-action',
                            //iconCls: 'x-fa fa-download fa-2x',
                            iconCls: 'thot-icon-import-medium',
                            scale: 'small',
                            itemId: 'importBtn',
                            disabled: true,
                            handler: 'onImportClick'

                        }
                    ]
                }]
            },
            {
                xtype: 'panel',
                itemId: 'exportTab',
                layout: {
                    type: 'fit',
                    align: 'stretch'
                },
                flex: 1,
                title: 'Exports',
                iconCls: 'x-fa fa-upload',
                items: [{
                    xtype: 'displayfield',
                    itemId: 'exportGrd',
                    fieldLabel: 'Export',
                    flex: 1
                }]
            }
        ]
    }]
});