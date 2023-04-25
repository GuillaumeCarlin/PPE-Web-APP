
Ext.define('Thot.view.usr.FormRolesSection', {
	extend: 'Ext.grid.Panel',
	xtype: 'rolessection',
	requires: [
		'Thot.view.usr.FormRolesSectionController',
		'Thot.view.usr.FormRolesSectionModel'
	],
	controller: 'usr-formrolessection',
	viewModel: {
		type: 'usr-formrolessection'
	},
	listeners: {
		afterrender: 'onAfterRender',
		itemdblclick: 'onDblClick'
	},
	flex: 1,
	store: {
		type: 'sectionroles'
	},
	columns: [
		{
			header: 'Code',
			dataIndex: 'rle_code',
			width: 150
		},
		{
			header: 'Libellé',
			dataIndex: 'rle_libelle',
			flex: 1
		}
	],
	buttons: [
		'->',
		{
			text: 'Annuler',
			handler: 'closeWin'
		},
		{
			text: 'Seléctionner',
			handler: 'onSelClic'
		}
	]
});
