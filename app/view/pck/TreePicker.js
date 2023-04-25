
Ext.define('Thot.view.pck.TreePicker', {
	extend: 'Ext.form.field.Picker',
	xtype: 'treepicker',
	requires: [
		'Thot.view.pck.TreePickerController',
		'Thot.view.pck.TreePickerModel'
	],
	controller: 'pck-treepicker',
	viewModel: {
		type: 'pck-treepicker'
	},
	idValue: 0,
	textValue: '',
	createPicker: function () {
		var oMe = this;
		var oPicker = new Ext.tree.Panel({
			itemId: 'pckTree',
			floating: true,
			rootVisible: false,
			height: 200,
			store: oMe.store,
            columns: oMe.columns,
            hideHeaders: true,
			listeners: {
				checkchange: function (node, checked) {
					node.cascadeBy(function (child) {
						child.set('checked', checked);
					});
					
					this.getSelected();
				},
				selectionchange: function(oModel, oSelection) {
					//this.getSelected();
				}
			},
			getSelected: function() {
				var sId = '';
				var sLabel = '';
				
				if (this.getStore()==null) {
					this.store = oMe.store;
				}
				
				var aSelected = oPicker.getChecked();
				
				for (var iInd in aSelected) {
					if (sId!=='') {
						sId+=',';
						sLabel+=' ; ';
					}

					sId += aSelected[iInd].get(oMe.valueField);
					sLabel += aSelected[iInd].get(oMe.displayField);
				}

				oMe.idValue = sId;
				oMe.textValue = sLabel;
				oMe.setRawValue(sLabel);
			}
		});

		return oPicker;
	}
});
