Ext.define('Thot.view.act.CmpFreeAleas', {
	extend: 'Ext.form.Panel',
	xtype: 'freealeas',
	ui: 'thot-main',
    cls: 'left-long-shadow',

	requires: [
		'Thot.view.act.CmpFreeAleasController',
		'Thot.view.act.CmpFreeAleasModel',
		'Thot.store.act.UserAleaS'
	],
	controller: 'act-cmpfreealeas',
	viewModel: {
		type: 'act-cmpfreealeas'
	},
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	listeners: {
		afterrender: 'onAfterRender',
		gridRefresh: 'onGridRefresh'
	},
	title: 'Aléas libres',
	items: [
		{
			xtype: 'gridpanel',
			itemId: 'grdFreeAleas',
			stateful: true,
			stateId: 'freealeas-grdFreeAleas',
			flex: 1,
			store: {
				type: 'freealeas'
			},
			listeners: {
				itemdblclick: 'onAleaDblClick'
			},
			columns: [
				{
					header: 'Prog',
					dataIndex: 'alp_id',
					width: 32,
					renderer: function (sValue, oCell, oData) {
						var sReturn = "";
						if (parseInt(oData.get('alp_id'), 10) > 0) {
							// il y a une programmation
							sReturn = "<div class='thot-icon-programme-medium' data-qtip='Programmation inactive'></div>";
							if (parseInt(oData.get('alp_estactif'), 10) > 0) {
								// programmation active
								sReturn = "<div class='thot-icon-programme-medium thot-color-success' data-qtip='Programmation active'></div>";
							}
							;
							if (parseInt(oData.get('alp_perime'), 10) > 0) {
								// programmation active
								sReturn = "<div class='thot-icon-programme-medium thot-color-dimmed' data-qtip='Programmation périmée'></div>";
							}
						}

						return sReturn;
					}
				},
				{
					header: 'Début le',
					dataIndex: 'ala_date_debut',
					width: 150,
					renderer: function (sValue, oCell, oData) {
						var sReturn = "";
						sReturn += "<div class='cellBold'>" + Ext.Date.explicitDate(oData.get('ala_date_debut')) + "</div>";
						return sReturn;
					}
				},
				{
					header: 'Aléa',
					dataIndex: 'ald_code',
					width: 250,
					renderer: function (sValue, oCell, oData) {
						var sReturn = "";
						sReturn = '<div class="cellBold">' + oData.get('ald_code') + ' - ' + oData.get('ald_libelle') + '</div>';
						return sReturn;
					}
				},
				{
					header: 'Opérateur',
					dataIndex: 'usr_nom',
					width: 250,
					renderer: function (sValue, oCell, oData) {
						var sReturn = "";
						var sLabel = '';
						sLabel = oData.get('usr_prenom') + ' ' + oData.get('usr_nom');
						sReturn = '<div class="cellBold">' + sLabel + '</div>';
						return sReturn;
					}
				},
				{
					header: 'Equipement',
					dataIndex: 'eqp_libelle',
					width: 250,
					renderer: function (sValue, oCell, oData) {
						var sReturn = "";
						sReturn = '<div class="cellBold">' + oData.get('eqp_libelle') + '</div>';
						return sReturn;
					}
				},
				{
					xtype: 'actioncolumn',
//					width: 120,
					items: [
						{
							icon: 'resources/images/24x24/edit.png',
//                            glyph:'xf28d@FontAwesome',
//                            color:'red',
							handler: 'onModifyAct',
							tooltip: 'Editer'
						},
						{
							icon: 'resources/images/32x32/edit-prog.png',
//                            glyph:'xf28d@FontAwesome',
//                            color:'red',
							handler: 'onScheduleClick',
							tooltip: 'Programmer'
						},
						{
							icon: 'resources/images/24x24/stop.png',
//                            glyph:'xf28d@FontAwesome',
//                            color:'red',
							tooltip: 'Terminer',
							handler: 'onStopClick'
						}

					]
				}
			],
			dockedItems: [
				{
					xtype: 'toolbar',
					dock: 'bottom',
					items: [
						'->',
						{
							text: 'Nouvel aléa ...',
							ui: 'thot-action',
							//icon: 'resources/images/24x24/add.png',
							//iconCls: 'addButton',
							iconCls: 'x-fa fa-plus-circle fa-2x',
							scale: 'small',
							handler: 'onNewAleaClic'
						}
					]
				}
			]
		}
	]
});
