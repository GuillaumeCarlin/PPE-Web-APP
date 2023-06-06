Ext.define('Thot.view.stat.CmpReglage', {
    extend: 'Ext.form.Panel',
    cls: 'thot-panel',
    xtype: 'sheetReglage',
    requires: [
        'Thot.view.stat.CmpReglageController',
        'Thot.store.stat.StatistiqueReglageS',
    ],
    controller: 'stat-cmpreglage',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    title: 'Alerte Critique',
    items: {
        items: [{
            xtype: 'gridpanel',
            itemId: 'ListeAlerteC',
            reference: 'ListeAlerteC',
            height: 300,
            stateful: true,
            stateId: 'listequipe-listealertec',
            cls: 'tool-icon-size',
            scrollable: true,
            store: {
                type: 'statreglage'
            },
            listeners: {
                afterrender: 'onAfterRenderC',
                //gridRefresh: 'onGridRefreshC'
                refresh: 'refresh'
            },
            viewConfig: {
                preserveScrollOnRefresh: true,
                loadMask: false,
                emptyText: 'Aucune Equipe trouvée',
            },
            columns: [{
                text: 'Opération',
                dataIndex: 'OPN_ID',
                sortable: true,
                hideable: false,
                align: 'center',
                flex: 1,
            },
            {
                text: 'Atelier',
                dataIndex: 'ORG_LIBELLE',
                sortable: true,
                hideable: false,
                align: 'center',
                flex: 1,
            },
            {
                text: 'OF',
                dataIndex: 'ODF_ID',
                sortable: true,
                hideable: false,
                align: 'center',
                flex: 1,
            },
            {
                text: 'Matériaux',
                dataIndex: 'NCE_LIBELLE',
                sortable: true,
                hideable: false,
                align: 'center',
                flex: 1,
            }
            ],
        },
        {
            xtype: 'gridpanel',
            title: 'Information',
            itemId: 'ListeAlerteM',
            reference: 'ListeAlerteM',
            flex: 1,
            stateful: true,
            stateId: 'listequipe-listealertem',
            cls: 'tool-icon-size',
            scrollable: true,
            store: {
                type: 'statreglage'
            },
            listeners: {
                afterrender: 'onAfterRenderM',
                //gridRefresh: 'onGridRefreshM',
                refresh: 'refresh'
            },
            viewConfig: {
                preserveScrollOnRefresh: true,
                loadMask: false,
                emptyText: 'Aucune Equipe trouvée',
            },
            columns: [{
                text: 'Opération',
                dataIndex: 'OPN_ID',
                sortable: true,
                hideable: false,
                align: 'center',
                flex: 1,
            },
            {
                text: 'Atelier',
                dataIndex: 'ORG_LIBELLE',
                sortable: true,
                hideable: false,
                align: 'center',
                flex: 1,
            },
            {
                text: 'OF',
                dataIndex: 'ODF_ID',
                sortable: true,
                hideable: false,
                align: 'center',
                flex: 1,
            },
            {
                text: 'Matériaux',
                dataIndex: 'NCE_LIBELLE',
                sortable: true,
                hideable: false,
                align: 'center',
                flex: 1,
            }
            ],
        }
        ],
    }
});