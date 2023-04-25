
Ext.define('Thot.view.adm.CmpReports',{
	extend: 'Ext.form.Panel',
	xtype: 'reports',
    ui:'x-panel-thot-panel-noborder',

    requires: [
        'Thot.view.adm.CmpReportsController',
        'Thot.view.adm.CmpReportsModel'
    ],

    controller: 'adm-cmpreports',
    viewModel: {
        type: 'adm-cmpreports'
    },
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	listeners: {
		//afterrender: 'onAfterRender',
		//gridRefresh: 'onGridRefresh'
	},
	items: [
		{
			xtype: 'tabpanel',
            ui:'thot-alternative',
            items: [
				{
					xtype: 'panel',
					layout: {
						type: 'fit',
						align: 'stretch'
					},
					flex: 1,
					title: 'Rapport 1',
					items: [
						{
							xtype: 'displayfield',
							fieldLabel: 'Etonnant',
							value: 'non ?'
						}
					]
				},
				{
					xtype: 'panel',
					layout: {
						type: 'fit',
						align: 'stretch'
					},
					flex: 1,
					title: 'Rapport 2',
					items: [
						{
							xtype: 'displayfield',
							fieldLabel: 'Etonnant',
							value: 'non ?'
						}
					]
				}
			]
		}
	]
});
