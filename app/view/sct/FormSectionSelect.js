Ext.define('Thot.view.sct.FormSectionSelect', {
	extend: 'Ext.panel.Panel',
	xtype: 'sectionselect',
	requires: [
		'Thot.view.sct.FormSectionSelectController',
		'Thot.view.sct.FormSectionSelectModel'
	],
	controller: 'sct-formsectionselect',
	viewModel: {
		type: 'sct-formsectionselect'
	},
	listeners: {
		afterrender: 'onAfterRender'
	},
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	bodyPadding: 5,
	defaults: {
		width: 300,
		labelWidth: 100
	},
	items: [
		{
			xtype: 'combo',
			itemId: 'society',
			fieldLabel: 'Société',
			valueField: 'org_id',
			displayField: 'org_libelle',
			editable: false,
			store: {
				type: 'societe'
			},
			listeners: {
				select: 'onSocietySel'
			}
		},
		{
			xtype: 'combo',
			itemId: 'site',
			fieldLabel: 'Site',
			valueField: 'org_id',
			displayField: 'org_libelle',
			editable: false,
			store: {
				type: 'site'
			},
			listeners: {
				select: 'onSiteSel'
			}
		},
		{
			xtype: 'treepicker',
			itemId: 'section',
			fieldLabel: 'Section',
			valueField: 'sab_id',
			displayField: 'sab_libelle',
			editable: false,
			columns: [{
				xtype: 'treecolumn',
				//header: 'Name',
				dataIndex: 'sab_libelle',
				flex: 1
			}]
		}
	],
	buttons: [
		{
			itemId: 'cancel',
            ui:'cancel',
			text: 'Annuler',
			margin: '0 10 0 0',
			tooltip: 'Annuler.',
			//icon: 'resources/images/16x16/cancel.png',
            iconCls:'x-fa fa-times-circle fa-2x',
			listeners: {
				click: 'onCancelClick'
			}
		},
		{
			itemId: 'valid',
            ui:'succes',
			text: 'OK',
			tooltip: 'Valider la selection.',
			//icon: 'resources/images/16x16/tick.png',
            iconCls:'thot-icon-check-small',//'x-fa fa-check-circle fa-2x',
			listeners: {
				click: 'validSelect'
			}
		}
	]
});
