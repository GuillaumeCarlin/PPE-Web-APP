Ext.define('Thot.view.pck.gridFilter', {
	extend: 'Ext.form.Panel',
	xtype: 'colGridFilter',
	requires: [
		'Thot.view.pck.gridFilterController',
		'Thot.view.pck.gridFilterModel'
	],
	controller: 'pck-gridfilter',
	viewModel: {
		type: 'pck-gridfilter'
	},
	layout: {
		type: 'card'
	},
	listeners: {
		afterrender: 'onAfterRender',
		getcard: 'onGetCard'
	},
	bodyPadding: 5,
	items: [
		{
			xtype: 'fieldcontainer',
			itemId: 'numberCard',
			layout: {
				type: 'vbox'
			},
			defaults: {
				labelAlign: 'left',
				labelWidth: 120,
				maxWidth: 250
			},
			items: [
				{
					xtype: 'numberfield',
					itemId: 'numberEqual',
					fieldLabel: 'Egal à',
					listeners: {
						change: 'onEqual'
					}
				},
				{
					xtype: 'numberfield',
					itemId: 'numberGtOrEqual',
					fieldLabel: 'Supérieur ou égal à',
					listeners: {
						change: 'onNotEqual'
					}
				},
				{
					xtype: 'numberfield',
					itemId: 'numberLtOrEqual',
					fieldLabel: 'Inférieur ou égal à',
					listeners: {
						change: 'onNotEqual'
					}
				}
			]
		},
		{
			xtype: 'fieldcontainer',
			itemId: 'dateCard',
			layout: {
				type: 'vbox'
			},
			defaults: {
				labelAlign: 'left',
				labelWidth: 120,
				maxWidth: 300
			},
			items: [
				{
					xtype: 'datefield',
					itemId: 'dateEqual',
					fieldLabel: 'Egal à',
					format: 'd/m/Y',
					listeners: {
						change: 'onEqual'
					}
				},
				{
					xtype: 'datefield',
					itemId: 'dateGtOrEqual',
					fieldLabel: 'Supérieur ou égal à',
					format: 'd/m/Y',
					listeners: {
						change: 'onNotEqual'
					}
				},
				{
					xtype: 'datefield',
					itemId: 'dateLtOrEqual',
					fieldLabel: 'Inférieur ou égal à',
					format: 'd/m/Y',
					listeners: {
						change: 'onNotEqual'
					}
				}
			]
		},
		/*
		{
			xtype: 'fieldcontainer',
			itemId: 'usersCard',
			layout: {
				type: 'vbox'
			},
			items: [
				{
					xtype: 'userpicker',
					itemId: 'idUsers',
					users: 'all',
					fieldLabel: 'Utilisateurs',
					labelAlign: 'left',
					width: 500
				}
			]
		},
		*/
		{
			xtype: 'fieldcontainer',
			itemId: 'textCard',
			layout: {
				type: 'vbox'
			},
			items: [
				{
					xtype: 'fieldcontainer',
					defaultType: 'radiofield',
					defaults: {
						flex: 1
					},
					layout: 'hbox',
					items: [
						{
							boxLabel: 'Contient',
							name: 'textoperator',
							inputValue: 'in',
							itemId: 'textIn',
							checked: true
						}, 
						{
							boxLabel: 'Commence par',
							name: 'textoperator',
							inputValue: 'start',
							itemId: 'textStart',
							margin: '0 0 0 10'
						}
					]
				},
				{
					xtype: 'textfield',
					itemId: 'textValue',
					label: 'Text',
					minWidth: 350,
					labelWidth: 60
				}
			]
		},
		{
			xtype: 'fieldcontainer',
			itemId: 'booleanCard',
			layout: {
				type: 'vbox'
			},
			items: [
				{
					xtype: 'fieldcontainer',
					defaultType: 'radiofield',
					defaults: {
						flex: 1
					},
					layout: 'hbox',
					items: [
						{
							boxLabel: 'Oui',
							name: 'booleanoperator',
							inputValue: '1',
							itemId: 'boolTrue',
							checked: true
						}, 
						{
							boxLabel: 'Non',
							name: 'booleanoperator',
							inputValue: '0',
							itemId: 'boolFalse',
							margin: '0 0 0 10'
						}
					]
				}
			]
		},
		{
			xtype: 'fieldcontainer',
			itemId: 'undefinedCard',
			layout: {
				type: 'hbox'
			},
			items: [
				{
					xtype: 'displayfield',
					hideLabel: true,
					value: '<h1>Aucun sélecteur n\'a été défini pour ce type</h1>'
				}
			]
		}
	],
	buttons: [
		{
			text: 'Annuler',
			icon: 'resources/images/16x16/cancel.png',
			handler: 'onCancelClick'
		},
		{
			text: 'Valider',
			icon: 'resources/images/16x16/tick.png',
			handler: 'onValidClick'
		}
	]
});
