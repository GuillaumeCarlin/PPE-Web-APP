
Ext.define('Thot.view.usr.CmpUserAct',{
	extend: 'Ext.form.Panel',
	xtype: 'useract',
    ui:'thot-panel',

    requires: [
        'Thot.view.usr.CmpUserActController',
        'Thot.view.usr.CmpUserActModel'
    ],

    controller: 'usr-cmpuseract',
    viewModel: {
        type: 'usr-cmpuseract'
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
					title: 'Activité',
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
					title: 'Aléas',
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
