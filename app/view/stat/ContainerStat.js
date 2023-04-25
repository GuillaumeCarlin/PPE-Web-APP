Ext.define('Thot.view.stat.ContainerStat', {
    extend: 'Ext.form.Panel',
    xtype: 'containerstat',
    ui: 'thot-main',
    itemId: 'containerStat',
    requires: [
        'Thot.view.stat.ContainerStatController'
    ],
    //margin: '0 10 10',
    controller: 'main-containerstat',
    listeners: {
        afterrender: 'onAfterRender',
        gridRefresh: 'onGridsRefresh'
    },
    layout:{
        type: 'fit',
    },
    hideTitle: true,
    items :[{
        xtype: 'tabpanel',
        //margin: '0 0 0 0',
        //layout:{
        //    type: 'vbox',
        //    align: 'stretch',
        //},
        items: [{
            xtype: 'panel',
            flex: 1,
            title: 'Relevés de temps',
            iconCls: 'x-fa fa-clock-o',
            layout:{
                type: 'vbox',
                align: 'stretch',
            },
            //margin: '0 0 10 0',
            tbar:[
                //{
                //xtype: 'container',
                //flex: 1,
                //itemId: 'containerTolerance',
                //layout: {
                //    type: 'vbox',
                //    align: 'stretch'
                //},
                //items: [
                    {
                        xtype: 'datefield',
                        allowBlank: false,
                        format: 'd/m/Y',
                        itemId: 'datefield',
                        margin: '0 0 5 0',
                        layout: {
                            type: 'Fit',
                        },
                        listeners: {
                            select: 'onDateSelect',
                        },
                        minValue: '2020/01/06'
                    },

                    { // afficher/masquer les objets supprimés
                        xtype: 'button',
                        itemId: 'btnShowSuppressedStat',
                        iconCls: 'x-fa fa-trash',
                        enableToggle: true,
                        tooltip: 'Afficher/Masquer les élémets supprimés',
                        listeners: {
                            click: 'onClick'
                        },
                    },

                        // ------------- Tolerance Min ------------------
                        {
                            xtype: 'displayfield',
                            margin: '0 0 0 10',
                            bind: {
                                fieldLabel: 'Tolerance Min',
                            }
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'toleranceMin',
                            allowDecimals: true,
                            minValue: 0,
                            forcePrecision: true,
                            allowBlank: false,
                            step: 0.1,
                            maxValue: 24,
                            hideLabel: true,
                            maxWidth: 180
                        },
                        // -----------------------------------------------

                    // ------------ Tolerance Max -------------------
                    {
                        xtype: 'displayfield',
                        margin: '0 0 0 40',
                        bind: {
                            fieldLabel: 'Tolerance Max',
                        }
                    },
                    {
                        xtype: 'numberfield',
                        itemId: 'toleranceMax',
                        allowDecimals: true,
                        minValue: 0,
                        forcePrecision: true,
                        allowBlank: false,
                        step: 0.1,
                        maxValue: 24,
                        hideLabel: true,
                        maxWidth: 180
                    },
                    // ----------------------------------------------

                    {
                        xtype: 'button',
                        text: 'Appliquer',
                        iconCls: 'x-fa fa-refresh',
                        itemId: 'btnApply',
                        listeners: {
                            click: 'onApplyClick'
                        }
                    }
                ],
            //},
            items:[
            { 
                xtype: 'sheetStatistique',
                itemId: 'ListeEquipe',
            },
            {
                xtype: 'statistique',
                itemId: 'ListeUser',
                flex: 1,
            }
        ]
        },
    {
            title: 'Réglage',
            iconCls: 'x-fa fa-exclamation-triangle',
            items:[{
                xtype: 'container',
                itemId: 'containerReglage',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [
                    {
                        xtype: 'datefield',
                        allowBlank: false,
                        format: 'd/m/Y',
                        itemId: 'DateFieldReglage',
                        margin: '5 5 0 5',
                        listeners: {
                            select: 'onDateSelectAlerte',
                        },
                        minValue: '06/01/2020'
                    }]
            },
            { 
                xtype: 'sheetReglage',
                itemId: 'ListAlerte',
                flex: 1
            },
]
        }]
    }]
});