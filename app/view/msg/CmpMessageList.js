Ext.define('Thot.view.msg.CmpMessageList', {
    extend: 'Ext.form.Panel',
    xtype: 'messagelist',
    ui: 'thot-main',
    cls: 'thot-panel',

    requires: [
        'Thot.view.msg.CmpMessageListController',
        'Thot.view.msg.CmpMessageListModel',
        'Thot.store.msg.MessageListS'
    ],

    controller: 'msg-cmpmessagelist',
    viewModel: {
        type: 'msg-cmpmessagelist'
    },
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    listeners: {
        afterrender: 'onAfterRender',
        gridRefresh: 'onGridRefresh'
    },
    title: 'Liste des notes',

    items: [{
        xtype: 'gridpanel',
        itemId: 'gridnoteslist',
        stateful: true,
        stateId: 'message-msgList',
        flex: 1,
        store: {
            type: 'messagelist'
        },
        plugins: 'gridfilters',
        stripeRows: true,
        features: [{
                ftype: 'grouping',
                startCollapsed: false,
                hideGroupedHeader: false,
                /* cacher la colonne du regroupement */
                groupHeaderTpl: '{columnName}: {name} ({rows.length} Note{[values.rows.length > 1 ? "s" : ""]})'
            },
            {
                /**
                 * ajoute la possibilité d'afficher du contenu sur toute la largeur de la grille
                 * en dessous de la ligne (ou au dessus, bodyBefore: true)
                 */
                ftype: 'rowbody',
                bodyBefore: false, // affiché en dessous de la ligne
                getAdditionalData: function (data, idx, record, orig) {
                    var oHeaderCtn = this.view.headerCt;
                    var iColspan = oHeaderCtn.getColumnCount();

                    return {
                        rowBody: Ext.String.format('<p class="thot-message-preview">{0}</p>', data.msg_texte),
                        rowBodyCls: this.rowBodyCls,
                        rowBodyColspan: iColspan
                    };
                }
            }
        ],
        columns: [{
                xtype: 'gridcolumn',
                dataIndex: 'usr_fullname_redacteur',
                stateId: 'usr_fullname_redacteur', // nécessaire pour restaurer la configuration
                header: 'Rédigé par',
                minWidth: 240,
                resizable: true,
                hideable: false,
                filter: {
                    type: 'string',
                    itemDefaults: {
                        // any Ext.form.field.Text configs accepted
                    }
                },
                renderer: function (sValue, oCell, oData) {
                    var sReturn = "";

                    sReturn = '<div class="thot-card-user"> <div class="img" style="background-image: url(\'resources/images/' + oData.get('rsc_image_redacteur') + '\')"></div>';
                    sReturn += '<div class="content thot-bold-label">' + sValue + '</div></div>';
                    return sReturn;
                }
            },
            {
                xtype: 'datecolumn',
                dataIndex: 'msg_date',
                stateId: 'msg_date',
                header: 'Rédigé le',
                minWidth: 150,
                resizable: false,
                groupable: false,
                filter: {
                    type: 'date',
                    itemDefaults: {
                        // any Ext.form.field.Text configs accepted
                    }
                },
                renderer: function (sValue, oCell, oData) {
                    var sReturn = "<div >" + Ext.Date.explicitDate(sValue) + "</div>";
                    if (oData.get('msg_date_traitement') != undefined) {
                        sReturn += '<div style="float:left;" class="thot-tag thot-tag-note" data-qtip="' + Ext.Date.explicitDate(oData.get('msg_date_traitement')) + '">Pris en compte</div>';
                    }
                    return sReturn;
                }
            },
            {
                xtype: 'gridcolumn',
                dataIndex: 'mso_libelle',
                stateId: 'mso_libelle',
                header: 'Objet',
                hideable: false,
                minWidth: 160,
                resizable: true,
                groupable: true,
                filter: {
                    type: 'list',
                    itemDefaults: {
                        // any Ext.form.field.Text configs accepted
                    }
                }
            },
            {
                xtype: 'gridcolumn',
                dataIndex: 'msg_titre',
                stateId: 'msg_titre',
                header: 'Titre',
                sortable: false,
                groupable: false,
                hideable: false,
                flex: 1,
                filter: {
                    type: 'string',
                    itemDefaults: {
                        // any Ext.form.field.Text configs accepted
                    }
                },
                renderer: function (sValue, oCell, oData) {
                    return '<div class="content thot-bold-label">' + oData.get('msg_titre') + '</div>';
                }
            },
            {
                xtype: 'gridcolumn',
                dataIndex: 'usr_fullname_destinataire',
                satetId: 'usr_fullname_destinataire',
                header: 'Destinataire',
                minWidth: 240,
                resizable: true,
                filter: {
                    type: 'string',
                    itemDefaults: {
                        // any Ext.form.field.Text configs accepted
                    }
                },
                renderer: function (sValue, oCell, oData) {

                    if (isNaN(parseInt(oData.get('rsc_id_destinataire')))) {
                        return '';
                    } else {
                        return '<div class="content thot-bold-label">' + sValue + '</div></div>';
                    }
                }
            },
            {
                xtype: 'actioncolumn',
                enableColumnHide: false,
                menuDisabled: true,
                stateId: 'action',
                hideable: false,
                resizable: false,
                width: 90,
                items: [{
                        tooltip: 'Editer',
                        iconCls: 'x-fa thot-icon-edit',
                        handler: 'onNoteEditClick'
                    },
                    {
                        /**
                         * Lu/Non lu sur le message
                         */
                        getTip: function (value, metadata, record, row, col, store) {
                            return (record.get('msg_date_traitement') == null ? 'Prendre en compte' : 'Annuler le prise en compte');
                        },
                        getClass: function (value, metadata, record, row, col, store) {
                            return (record.get('msg_date_traitement') == null ? 'x-fa thot-icon-seen' : 'x-fa thot-icon-unseen');
                        },
                        handler: 'onSetNoteReadenClick'
                    }
                ]
            }
        ]
    }]
});