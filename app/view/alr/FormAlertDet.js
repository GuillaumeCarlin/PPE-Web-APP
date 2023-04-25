Ext.define('Thot.view.alr.FormAlertDet', {
	extend: 'Ext.form.Panel',
	xtype: 'alertdetail',

	requires: [
		'Thot.view.alr.FormAlertDetController',
		'Thot.view.alr.FormAlertDetModel'
	],

	controller: 'alr-formalertdet',
	viewModel: {
		type: 'alr-formalertdet'
	},
	listeners: {
		afterRender: 'onAfterRender'
	},
	items: [{
			xtype: 'activitydetail',
			itemId: 'actDetCmp',
		},
		{
			xtype: 'fieldset',
			title: 'Alerte',
			margin: '0 5 5 5',
			layout: 'form',
			flex: 1,
			items: [{
					xtype: 'displayfield',
					fieldLabel: 'Alerte',
					itemId: 'rgl_libelle'
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Message',
					itemId: 'alr_libelle'
				}, {
					xtype: 'textareafield',
					itemId: 'ace_commentaire',
					fieldLabel: 'Commentaires',
					emptyText: 'Saisir un commentaire (optionnel)'
				},
				{
					xtype: 'checkbox',
					itemId: 'alertEnd',
					fieldLabel: 'Alerte traitée',
					checked: true
				}
			]
		}
	],
	buttons: [
		'->',
		{
			itemId: 'cancel',
			ui: 'cancel',
			text: 'Annuler',
			margin: '0 10 0 0',
			tooltip: 'Annuler.',
			iconCls: 'x-fa fa-times-circle fa-2x',
			listeners: {
				click: 'onCancelClick'
			}
		},
		{
			itemId: 'valid',
			ui: 'succes',
			text: 'OK',
			tooltip: 'Valider la selection.',
			iconCls: 'thot-icon-check-small', //'x-fa fa-check-circle fa-2x',
			listeners: {
				click: 'onValidClick'
			}
		}
	]
});