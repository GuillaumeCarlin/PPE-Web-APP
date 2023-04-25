Ext.define('Thot.overrides.form.field.ComboBox', {
	override: 'Ext.form.field.ComboBox',
	minChars: 2,
	emptyText: 'Aucune donnée',
	/**
	 * @author : edblv
	 * date   : 27/10/16 10:05
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Retourne le libellé de l'item seléctionné
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	getRecord: function (iValue) {
		return this.findRecordByValue(iValue);
	}

});
