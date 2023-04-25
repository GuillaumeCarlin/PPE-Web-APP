
Ext.define('Thot.view.adm.CmpRessAttrib',{
	extend: 'Ext.form.Panel',
	ui: 'x-panel-thot-panel-noborder',
	xtype: 'ressattrib',

    requires: [
        'Thot.view.adm.CmpRessAttribController',
        'Thot.view.adm.CmpRessAttribModel'
    ],

    controller: 'adm-cmpressattrib',
    viewModel: {
        type: 'adm-cmpressattrib'
    },
	listeners: {
		afterRender: 'onAfterRender',
		userDetail: 'onUserDetail',
		wstnDetail: 'onWstnDetail'
	},
	
    items: [
		{
			xtype: 'fieldset',
			itemId: 'ressourcedet',
			ui:'thot-fieldset-nostyle',
			html: ''
		},
		{
			xtype: 'grid',
			itemId: 'sectionGrd',
//			maxHeight: 200,
			flex: 1,
			title: 'Section',
			store: {
				type: 'section'
			},
			columns: [
				{
					header: 'Site',
					dataIndex: 'ste_libelle',
					width: 150,
					renderer: function(sValue, oCell, oData) {
						var sReturn = sValue+'/'+oData.get('sit_libelle');
						return sReturn;
					}
				},
				{
					header: 'Code',
					dataIndex: 'sab_code',
					width: 100
				},
				{
					header: 'Libellé',
					dataIndex: 'sab_libelle'
				}
			]
		},
		{
			xtype: 'checkbox',
			itemId: 'mainSectionCbx',
			margin: '20 0 0 0',
			fieldLabel: 'Section principale'
		},
		{
			xtype: 'combobox',
			itemId: 'roleCbo',
			fieldLabel: 'Rôle',
			valueField: 'rle_id',
			displayField: 'rle_libelle',
			store: {
				type: 'roles'
			}
		}
	],
	buttons: [
		{
			itemId: 'valid',
            ui:'succes',
            iconCls:'thot-icon-validate',
			text: 'Valider',
			handler: 'onValidClick'
		}
		
	]
});
