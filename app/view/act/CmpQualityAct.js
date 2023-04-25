// NOTE: HVT 2021-03-29 22:52:28 - Obsolete
Ext.define('Thot.view.act.CmpQualityAct', {
	/**
	 * @author  Hervé Valot
	 * @created 2018/12/17
	 * @description composant de gestion des activités de type qualité
	 * @description un opérateur / utilise un équipement de son secteur / sélectionne un OF (existant) / pour réaliser une opération de type Qualité
	 */
	extend: 'Ext.form.Panel',
	xtype: 'currentqualityact',
	cls: 'left-long-shadow',

	ui: 'thot-panel',
	requires: [
		// 'Thot.view.act.CmpQualityActController',
		// 'Thot.view.act.CmpQualityActModel',
		// 'Thot.store.act.UserActS'
	],

	// controller: 'act-cmpqualityact',
	viewModel: {
		type: 'act-cmpqualityact'
	},
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	listeners: {
		afterrender: 'onAfterRender',
		// gridRefresh: 'onGridRefresh'
	},
	title: 'Activités qualité',
	items: [

	]
});