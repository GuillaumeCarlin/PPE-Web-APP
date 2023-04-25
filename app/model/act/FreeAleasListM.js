/**
 * @author	Hervé Valot
 * @date	20200410
 * @description	Modèle des aléas libres disponibles
 * @version	20200410
 */
Ext.define('Thot.model.act.FreeAleasListM', {
	extend: 'Ext.data.Model',
	fields: [ // colonnes du modèle
		{ // identifiant de la définition de l'aléa
			name: 'ald_id',
			type: 'int'
		},
		{ // code de l'aléa
			name: 'ald_code',
			type: 'string'
		},
		{ // libellé de l'aléa
			name: 'ald_libelle',
			type: 'string'
		},
		{ // code de l'origine
			name: 'alo_code',
			type: 'string'
		},
		{ // libellé de l'origine
			name: 'alo_libelle',
			type: 'string'
		},
		{ // identifiant de l'origine de l'aléa (opérateur/équipement/...)
			name: 'alo_id',
			type: 'int'
		},
	]
});