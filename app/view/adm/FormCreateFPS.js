Ext.define('Thot.view.adm.FormCreateFPS', {
	extend: 'Ext.panel.Panel',
	xtype: 'createfps',
    ui: 'thot-main',
	requires: [
        'Thot.view.adm.FormCreateFPSController',
		'Thot.store.adm.FormInsDelUsrFPSS'
	],
	controller: 'adm-createfps',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	listeners: {
		afterrender: 'onAfterRender',
	},
	items:[
		{
            xtype: 'displayfield',
            itemId: 'ariane',
            hideLabel: true,
            margin: 0,
            fieldCls: 'filAriane',
			margin: '0 0 0 0',
        },


		{
			xtype: 'panel',
			itemId: 'NewFPS',
			hidden: true,
			flex: 1,
			layout: 'card',
			items:[{
				xtype: 'panel',
				items: [
					{
						xtype: 'textfield',
						itemId: 'FPSName',
						emptyText: 'Saisissez le nom de la FPS ...', 
						allowBlank: false,
						tooltip: 'Le nom peut être différent de celui du fichier.',
						fieldLabel: 'Nom de la FPS',
						margin: '10 0 0 0',
						layout: {
							type: 'fit',
							align: 'stretch'
						}
                	},
					{
						xtype: 'textfield',
						itemId: 'FPSChemin',
						emptyText: 'Saisissez le nom du pdf ...', 
						allowBlank: false,
						fieldLabel: 'Fichier PDF',
						tooltip: 'Le chemin doit comprendre le fichier et son extension',
						margin: '10 0 0 0',
						layout: {
							type: 'fit',
							align: 'stretch'
						}
					},{		
						xtype: 'combobox',
						itemId: 'FpgComboBox',
						emptyText: 'Catégorie',
						allowBlank: false,
						valueField: 'fpg_id',
						displayField: 'fpg_libelle',
						fieldLabel: 'UsageFPS',
						margin: '20 0 0 0',
						store:{
							type: 'formfpslistfpgs',
						},
						layout: {
							type: 'fit',
							align: 'stretch'
						},
					},
					{
						xtype: 'displayfield',
						itemId: 'error_message_fps',
						layout: {
							type: 'fit',
							align: 'stretch'
						},
						margin: '0 0 0 50',
					},
				]
			}],
			buttons:[{		
					xtype: 'button',
					itemId: 'cancel',
					ui:'cancel',
					text: 'Annuler',
					margin: '0 10 0 0',
					tooltip: 'Annuler.',
					iconCls:'x-fa fa-times-circle fa-2x',
					handler: 'SupWindow',
					width: 100
				},
				{
					xtype: 'button',
					itemId: 'validNewFPS',
					ui:'succes',
					text: 'OK',
					tooltip: 'Valider la selection.',
					iconCls:'thot-icon-check-small',
					handler: 'validSelectFPS',
					width: 100
				}]
		},

		{
			xtype: 'panel',
			itemId: 'DelFps',
			hidden: true,
			flex: 1,
			layout: 'card',
			items:[
				{
					xtype: 'panel',
					items:[
						{
							xtype: 'displayfield',
							itemId: 'FPS',
							margin: '0 0 0 50',
						},
					]
				}
			],
			buttons:[
				{		
					xtype: 'button',
					itemId: 'cancel',
					ui:'cancel',
					text: 'Non',
					margin: '0 10 0 0',
					tooltip: 'Annuler la suppression de l\'utilisateur',
					iconCls:'x-fa fa-times-circle fa-2x',
					handler: 'SupWindow',
					width: 100
				},
				{
					xtype: 'button',
					itemId: 'validDelUsr',
					ui:'succes',
					text: 'Oui',
					tooltip: 'Valider la suppression de l\'utilisateur',
					iconCls:'thot-icon-check-small',
					handler: 'validDelFPS',
					width: 100
				}]
			},
		
		/**    Formulaire Ajout d'un équipement à une FPS  */
		{
		xtype: 'panel',
		itemId: 'NewEQT',
		hidden: true,
		flex: 1,
		layout: 'card',
		items:[
			{
				xtype: 'panel',
				items:[
					{
						xtype: 'combobox',
						itemId: 'EqtComboBox',
						valueField: 'rsc_id',
						displayField: 'rsc_code',
						fieldLabel: 'Équipement',
						margin: '20 0 0 0',
						store:{
							type: 'formfpslisteqt',
						},
						layout: {
							type: 'fit',
							align: 'stretch'
						},
					},{
					xtype: 'displayfield',
					itemId: 'error_message_eqt',
					layout: {
						type: 'fit',
						align: 'stretch'
					},
					margin: '0 0 0 50',
				}
				]
			}
		],
		buttons:[
			{		
				xtype: 'button',
				itemId: 'cancel',
				ui:'cancel',
				text: 'Annuler',
				margin: '0 10 0 0',
				tooltip: 'Annuler.',
				iconCls:'x-fa fa-times-circle fa-2x',
				handler: 'SupWindow',
				width: 100
			},
			{
				xtype: 'button',
				itemId: 'validNewEqt',
				ui:'succes',
				text: 'OK',
				tooltip: 'Valider la selection.',
				iconCls:'thot-icon-check-small',
				handler: 'validSelectEQT',
				width: 100
			}
		] 
		},
		{
			xtype: 'panel',
			itemId: 'DelEqt',
			hidden: true,
			flex: 1,
			layout: 'card',
			items:[
				{
					xtype: 'panel',
					items:[
						{
							xtype: 'displayfield',
							itemId: 'Eqt',
							margin: '0 0 0 50',
						},
					]
				}
			],
			buttons:[
				{		
					xtype: 'button',
					itemId: 'cancel',
					ui:'cancel',
					text: 'Non',
					margin: '0 10 0 0',
					tooltip: 'Annuler la suppression de l\'équipement',
					iconCls:'x-fa fa-times-circle fa-2x',
					handler: 'SupWindow',
					width: 100
				},
				{
					xtype: 'button',
					itemId: 'validDelUsr',
					ui:'succes',
					text: 'Oui',
					tooltip: 'Valider la suppression de l\'équipement',
					iconCls:'thot-icon-check-small',
					handler: 'validDelEQT',
					width: 100
				}]
			},
		


		/**    Formulaire Ajout d'un utilisateur à un équipement  */
		{
		xtype: 'panel',
		itemId: 'NewUSR',
		store: {
			type: 'forminsdelusrfpss',
		},
		hidden: true,
		flex: 1,
		layout: 'card',
		items:[
			{
				xtype: 'panel',
				items:[
					{		
					xtype: 'combobox',
					itemId: 'UserComboBox',
					valueField: 'rsc_id',
					displayField: 'nom',
					fieldLabel: 'Utilisateurs',
					margin: '20 0 0 0',
					store:{
						type: 'formfpslistusers',
					},
					layout: {
						type: 'fit',
						align: 'stretch'
					},
					},
					{
						xtype: 'datefield',
						allowBlank: false,
						fieldLabel: 'Date de signature',
						format: 'd/m/Y',
						itemId: 'datefieldNewUsr',
						margin: '20 0 0 0',
						layout: {
							type: 'fit',
							align: 'stretch'
						},
					},{
						xtype: 'displayfield',
						itemId: 'error_message_usr',
						layout: {
							type: 'fit',
							align: 'stretch'
						},
						margin: '0 0 0 50',
					}
				]
			}
		],
		buttons:[
			{		
				xtype: 'button',
				itemId: 'cancel',
				ui:'cancel',
				text: 'Annuler',
				margin: '0 10 0 0',
				tooltip: 'Annuler.',
				iconCls:'x-fa fa-times-circle fa-2x',
				handler: 'SupWindow',
				width: 100
			},
			{
				xtype: 'button',
				itemId: 'validNewUsr',
				ui:'succes',
				text: 'OK',
				tooltip: 'Valider la selection.',
				iconCls:'thot-icon-check-small',
				handler: 'validSelectUSR',
				width: 100
			}]
		},

		{
			xtype: 'panel',
			itemId: 'DelUsr',
			store: {
				type: 'forminsdelusrfpss',
			},
			hidden: true,
			flex: 1,
			layout: 'card',
			items:[
				{
					xtype: 'panel',
					items:[
						{
							xtype: 'displayfield',
							itemId: 'User',
							margin: '0 0 0 50',
						},
					]
				}
			],
			buttons:[
				{		
					xtype: 'button',
					itemId: 'cancel',
					ui:'cancel',
					text: 'Non',
					margin: '0 10 0 0',
					tooltip: 'Annuler la suppression de l\'utilisateur',
					iconCls:'x-fa fa-times-circle fa-2x',
					handler: 'SupWindow',
					width: 100
				},
				{
					xtype: 'button',
					itemId: 'validDelUsr',
					ui:'succes',
					text: 'Oui',
					tooltip: 'Valider la suppression de l\'utilisateur',
					iconCls:'thot-icon-check-small',
					handler: 'validDelUSR',
					width: 100
				}]
			}
	]
});