
Ext.define('Thot.view.pck.NumKeyBoard', {
	extend: 'Ext.form.field.Picker',
	xtype: 'numkeyboard',
	requires: [
		'Thot.view.pck.NumKeyBoardController',
		'Thot.view.pck.NumKeyBoardModel'
	],
	controller: 'pck-numkeyboard',
	viewModel: {
		type: 'pck-numkeyboard'
	},
	value: '',
	matchFieldWidth: false,
	createPicker: function () {
		var oMe = this;
		var oPicker = new Ext.panel.Panel({
			itemId: 'NumKbdPck',
			floating: true,
			//height: 200,
			layout: 'vbox',
			padding: '0 0 0 5',
			items: [
				{
					xtype: 'container',
					layout: 'hbox',
					items: [
						{
							xtype: 'button',
							height : 60,
							width:60,
							itemId: 'sevenBtn',
							text: '7',
							columnWidth: 0.3,
							margin: '0 5 5 0',
							handler: 'onBtnClick'
						},
						{
							xtype: 'button',
							height : 60,
							width:60,
							itemId: 'heightBtn',
							text: '8',
							columnWidth: 0.3,
							margin: '0 5 5 0',
							handler: 'onBtnClick'
						},
						{
							xtype: 'button',
							height : 60,
							width:60,
							itemId: 'NineBtn',
							text: '9',
							columnWidth: 0.3,
							margin: '0 5 5 0',
							handler: 'onBtnClick'
						}
					]
				},
				{
					xtype: 'container',
					layout: 'hbox',
					items: [
						{
							xtype: 'button',
							height : 60,
							width:60,
							itemId: 'fourBtn',
							text: '4',
							columnWidth: 0.3,
							margin: '0 5 5 0',
							handler: 'onBtnClick'
						},
						{
							xtype: 'button',
							height : 60,
							width:60,
							itemId: 'fiveBtn',
							text: '5',
							columnWidth: 0.3,
							margin: '0 5 5 0',
							handler: 'onBtnClick'
						},
						{
							xtype: 'button',
							height : 60,
							width:60,
							itemId: 'sixBtn',
							text: '6',
							columnWidth: 0.3,
							margin: '0 5 5 0',
							handler: 'onBtnClick'
						}
					]
				},
				{
					xtype: 'container',
					layout: 'hbox',
					items: [
						{
							xtype: 'button',
							height : 60,
							width:60,
							itemId: 'oneBtn',
							text: '1',
							columnWidth: 0.3,
							margin: '0 5 5 0',
							handler: 'onBtnClick'
						},
						{
							xtype: 'button',
							height : 60,
							width:60,
							itemId: 'twoBtn',
							text: '2',
							columnWidth: 0.3,
							margin: '0 5 5 0',
							handler: 'onBtnClick'
						},
						{
							xtype: 'button',
							height : 60,
							width:60,
							itemId: 'threeBtn',
							text: '3',
							columnWidth: 0.3,
							margin: '0 5 5 0',
							handler: 'onBtnClick'
						}
					]
				},
				{
					xtype: 'container',
					layout: 'hbox',
					items: [
						{
							xtype: 'button',
							height : 60,
							width:60,
							itemId: 'zeroBtn',
							text: '0',
							columnWidth: 0.3,
							margin: '0 5 5 0',
							handler: 'onBtnClick'
						},
						{
							xtype: 'button',
							height : 60,
							width:60,
							itemId: 'pointBtn',
							text: '.',
							columnWidth: 0.3,
							margin: '0 5 5 0',
							handler: 'onBtnClick'
						},
						{
							xtype: 'button',
							height : 60,
							width:60,
							itemId: 'backBtn',
							//text: '<-',
							// icon: 'resources/images/16x16/left.png',
							iconCls: 'x-fa fa-long-arrow-left fa-cx',
							columnWidth: 0.3,
							margin: '0 5 5 0',
							handler: 'onBtnClick'
						}
					]
				},
			],
			validField: function (oField, sValue, sOldValue) {
				var iCharLen = sValue.length;
				var iCharCode = sValue.charCodeAt((iCharLen - 1));

				if (iCharLen >= 1) {
					if ((iCharCode < 46 || iCharCode > 57) && iCharCode !== 47) {
						oField.setValue(sOldValue);
					}
				}
			}
		});

		return oPicker;
	}
});
