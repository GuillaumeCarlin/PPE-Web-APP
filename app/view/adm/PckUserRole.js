
Ext.define('Thot.view.adm.PckUserRole',{
	extend: 'Ext.form.field.Picker',
	xtype: 'userrole',

    requires: [
        'Thot.view.adm.PckUserRoleController',
        'Thot.view.adm.PckUserRoleModel'
    ],

    controller: 'adm-pckuserrole',
    viewModel: {
        type: 'adm-pckuserrole'
    },
	editable: false,
    initComponent: function() {
        var me = this;
	},
	createPicker: function () {
		var oMe = this;
		var oPicker = new Ext.panel.Panel({
			itemId: 'UserRolePck',
			floating: true,
			width: 400,
			height: 200,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [
				{
					xtype: 'combobox',
					itemId: 'roleCbo',
					fieldLabel: 'Rôle',
					labelAlign: 'top',
					labelStyle: 'text-align: left',
					margin: '5 5 0 5',
					displayField: 'rle_libelle',
					valueField: 'rle_id',
					store: {
						type: 'roles'
					}
				},
				{
					xtype: 'combobox',
					itemId: 'teamCbo',
					fieldLabel: 'Equipe',
					labelAlign: 'top',
					labelStyle: 'text-align: left',
					margin: '0 5 0 5'
				}
			],
			buttons: [
				{
					text: 'Valider',
					handler: function() {
						//oMe.setValue(5);
						oMe.collapse();
					}
				}
			]
		});

		oPicker.on({
			updateData: function() {
				oPicker.collapse();
			}
		});
		return oPicker;
	}
});
