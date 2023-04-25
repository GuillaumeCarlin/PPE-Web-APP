Ext.define('Thot.view.main.ContainerActUser', {
    extend: 'Ext.form.Panel',
    xtype: 'containeractusr',
    ui: 'thot-main',
    itemId: 'mainList',
    requires: [
        'Thot.store.sct.SocieteS',
        'Thot.view.main.ContainerActUserController'
    ],
    controller: 'main-containeractuser',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    listeners: {
        gridrefresh: 'onGridsRefresh'
    },
    hideTitle: true,
    items: [{ // composant des activités
            xtype: 'currentact',
            itemId: 'currentactivities',
            flex: 1
        },
        {
            xtype: 'userstatusalerte',
            itemId: 'userstatusalerte',
            width: 300,
            collapsible: true,
            collapseDirection: 'right',
            titleCollapse: true,
            headerPosition: 'left',
            animCollapse: false,
            hideCollapseTool: true
        }
    ]
});