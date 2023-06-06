Ext.define('Thot.view.stat.CmpSheetEquipe', {
    extend: 'Ext.form.Panel',
    cls: 'thot-panel',
    xtype: 'sheetStatistique',
    title: 'Temps par équipe',
    collapsible: true,
    titleCollapse: true,
    requires: [
        'Thot.view.stat.CmpSheetEquipeController',
        'Thot.store.stat.StatistiqueSheetUserS',
        'Ext.grid.column.Action',
        'Ext.ProgressBarWidget',
        'Ext.slider.Widget',
        'Ext.sparkline.*'
    ],
    controller: 'stat-cmpsheetequipe',
    height: 181,

    items: {
        items: [{
            align: 'stretch',

            xtype: 'gridpanel',
            itemId: 'ListeEquipe',
            reference: 'ListEquipe',
            stateful: true,
            stateId: 'listequipe-listequipe',
            cls: 'tool-icon-size',
            scrollable: false,
            store: {
                type: 'statusersheet'
            },
            listeners: {
                afterrender: 'onAfterRender',
                //gridRefresh: 'onGridRefresh',
                refresh: 'refresh'
            },
            viewConfig: {
                preserveScrollOnRefresh: true,
                loadMask: false,
                emptyText: 'Aucune Equipe trouvée',
                getRowClass: function (record, rowIndex, rowParams, store) {
                    var sCSS = "";
                    sCSS = parseInt(record.get("horstolerancetest")) == 0 ? "thot-grid-modified-entity" : sCSS;
                    return sCSS;
                },
            },
            columns: {
                defaults: {
                    sortable: true,
                    hideable: false,
                    resizable: false,
                    draggable: false,
                    align: 'right',
                    width: 180
                },
                items: [
                    {
                        text: 'Equipe',
                        dataIndex: 'EQUIPE',
                        align: 'left',
                    },
                    {
                        text: 'Temps Exigible',
                        dataIndex: 'TempsExigibleEquipe',

                    },
                    {
                        text: 'Temps Pointé',
                        dataIndex: 'TempPointeEquipe',
                    },
                    {
                        text: 'Écart absolu',
                        dataIndex: 'EcartAbsoluEquipe',
                    }
                ]
            },
        }],
    }
});