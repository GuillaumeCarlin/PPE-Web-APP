Ext.define('Thot.view.api.ContainerAPI', {
    extend: 'Ext.form.Panel',
    xtype: 'containerapi',
    ui: 'thot-main',
    itemId: 'containerAPI',
    requires: [
        'Thot.view.api.ContainerAPIController',
        'Thot.store.api.ApiUpdateS'
    ],
    margin: '0 10 10 10',
    controller: 'main-containerapi',
    listeners: {
        afterrender: 'onAfterRender',
        gridrefresh: 'onGridsRefresh'
    },
    hideTitle: true,
    items: [{
        xtype: 'button',
        text: 'New Key',
        iconCls: 'x-fa fa-key',
        listeners: {
            click: 'NewKey'
        },
        itemId: 'btnNewKey',
        margin: '5 0 5 40',
        width: 140
    },
    {
        xtype: 'button',
        text: 'Update rapide',
        iconCls: 'x-fa fa-refresh',
        itemId: 'btnUpdateRapide',
        store: {
            type: 'apiupdates'
        },
        listeners: {
            click: 'UpdateRapide'
        },
        margin: '5 0 5 40',
        width: 140,
        disabled: true
    },
    {
        xtype: 'button',
        iconCls: 'x-fa fa-spinner',
        itemId: 'btnRefresh',
        listeners: {
            click: 'Refresh'
        },
        margin: '5 0 5 10',
    },
    {
        xtype: 'container',
        flex: 1,
        itemId: 'ContainerGlobal',
        layout: {
            type: 'hbox',
        },
        items: [
            {
                align: 'stretch',
                margin: '5 0 20 30',
                xtype: 'gridpanel',
                height: 600,
                title: 'Liste des clés d\'authentification de l\'API',
                itemId: 'ListeAPK',
                reference: 'ListAPK',
                listeners: {
                    select: 'onOperationClick',
                    gridrefresh: 'ListeAPKRefresh'
                },
                width: 600,
                cls: 'tool-icon-size',
                scrollable: true,
                border: true,
                store: {
                    type: 'apis'
                },
                columns: [{
                    text: 'Identifiant ressource',
                    dataIndex: 'RSC_ID',
                    tooltip: 'Identifiant de la ressource',
                    sortable: true,
                    hideable: false,
                    align: 'center',
                    flex: 1,
                },
                {
                    text: 'Nom de la ressource',
                    dataIndex: 'RSC_CODE',
                    tooltip: 'Nom de la ressource',
                    sortable: true,
                    hideable: false,
                    align: 'center',
                    flex: 2,
                },
                {
                    text: 'Clé de la ressource',
                    dataIndex: 'APK_CODE',
                    tooltip: 'Clé de la ressource',
                    sortable: true,
                    hideable: false,
                    align: 'left',
                    flex: 2,
                }]
            },
            {
                xtype: 'container',
                width: 600,
                border: true,
                itemId: 'ContainerTextField',
                layout: {
                    type: 'vbox',
                },
                style: 'broder: 1px solid black',
                items: [
                    {
                        xtype: 'displayfield',
                        margin: '10 0 0 0',
                        bind: {
                            fieldLabel: 'Identifiant ',
                        },
                    },
                    {
                        xtype: 'textfield',
                        itemId: 'Rsc_ID',
                        emptyText: 'Saisissez un identifiant ...',
                        allowBlank: false,
                        margin: '0 0 5 40',
                        width: 300,
                        align: 'left',
                        disabled: true
                    },
                    {
                        xtype: 'displayfield',
                        margin: '10 0 0 20',
                        bind: {
                            fieldLabel: 'Code de la clé ',
                        },
                    },
                    {
                        xtype: 'textfield',
                        itemId: 'CodeAPK',
                        emptyText: 'Saisissez une clé ...',
                        allowBlank: false,
                        margin: '0 0 5 40',
                        labelWidth: 50,
                        align: 'left',
                        width: 300,
                        disabled: true
                    }, {
                        xtype: 'button',
                        text: 'Udpate',
                        iconCls: 'x-fa fa-refresh',
                        itemId: 'btnApply',
                        listeners: {
                            click: 'Update'
                        },
                        margin: '30 0 5 120',
                        width: 150,
                    }, {
                        xtype: 'displayfield',
                        margin: '10 0 0 100',
                        itemId: 'result',
                        bind: {
                            fieldLabel: '',
                        }
                    }]
            }]
    }]
});