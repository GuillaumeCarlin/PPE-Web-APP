/**
 * @author	Hervé Valot
 * @date	20200410
 * @description	Store des aléas libres, contient la liste des définitions d'aléas libres utilisables
 * @version	20200410	Hervé Valot	création
 */
Ext.define('Thot.store.act.FreeAleasListS', {
	extend: 'Ext.data.Store',
	model: 'Thot.model.act.FreeAleasListM',
	alias: 'store.freealeaslist',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'server/act/Activities.php?action=FreeAleaList',
		method: "POST",
		actionMethods: {
			read: 'POST'
		},
		reader: {
			type: 'json',
			rootProperty: 'liste',
			idProperty: 'ald_id',
			totalProperty: 'NbreTotal'
		}
	}
});