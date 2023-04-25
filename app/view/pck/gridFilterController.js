Ext.define('Thot.view.pck.gridFilterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pck-gridfilter',
	/**
	 * @author : edblv
	 * date   : 28/06/16 11:21
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * AfterRender
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onAfterRender: function () {
		var oMe = this;
		var oForm = this.getView();
		var oRootMnu = oMe.getRootMenu();

		oMe.activeCard(oRootMnu.activeHeader);
		oForm.keyNav = Ext.create('Ext.util.KeyNav', oForm.el, {
			enter: function () {
				oMe.onValidClick();
			},
			scope: this
		});
	},
	/**
	 * @author : edblv
	 * date   : 29/06/16 11:39
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Activation de la carte correspondant au type de la colonne
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	activeCard: function (oActiveHdr) {
		var oMe = this;
		var oForm = this.getView();
		var sCard = oActiveHdr.filter.type;
		var oCard = oForm.query('#'+sCard+'Card');
		var sFocus = '';
		oMe.fieldPrefix = sCard;
		
		if (oActiveHdr.filter.operators) {
			//---- Si on a choisi de ne voir que certains opérateurs
			// on cache ceux qui ne sont pas dans la liste
			var aFields = oCard[0].query('[itemId]');
			var iCardLen = sCard.length;
			var sOperator = '';
			
			for (var iFld in aFields) {
				if (aFields[iFld].itemId.substr(0,iCardLen)==sCard) {
					sOperator = aFields[iFld].itemId.substr(iCardLen).toLowerCase();

					if (oActiveHdr.filter.operators.indexOf(sOperator)<0) {
						aFields[iFld].hide();
					}
				}
			}
		}
		
		if (oCard.length>0) {
			oForm.getLayout().setActiveItem(sCard+'Card');
			oForm.reset();
		}
		else {
			oForm.getLayout().setActiveItem('undefinedCard');
		}

		switch (sCard) {
			case 'number':
				sFocus = sCard+'Equal';
				break;
			case 'date':
				sFocus = sCard+'Equal';
				break;
			case 'text':
				sFocus = sCard+'Value';
				break;
		}

		if (sFocus!=='') {
			var oEqual = oForm.query('#'+sFocus)[0];
			Ext.defer(function () {
				oEqual.focus(true, 100);
			}, 1);
		}
	},

	/**
	 * @author : edblv
	 * date   : 
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * 
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onGetCard: function () {
		var oMe = this;
		var oForm = this.getView();
		var oRootMnu = oMe.getRootMenu();
		oMe.activeCard(oRootMnu.activeHeader);
		
		//---- Maintenant qu'on a activé la bonne carte,
		//	on renseigne les valeurs des champs si nécessaire
		oMe.setValues(oRootMnu);
	},
	/**
	 * @author : edblv
	 * date   : 
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * 
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	setValues: function (oRootMnu) {
		var oMe = this;
		var oForm = this.getView();
		var oGrid = oRootMnu.up('grid');
		var oActiveHdr = oRootMnu.activeHeader;
		var aFilters = oGrid.aFilters[oRootMnu.activeHeader.dataIndex];
		//var sCard = oActiveHdr.filter.type;
		var sPrefix = oMe.fieldPrefix;
		var sFieldName = '';
		
		for (var iInd in aFilters) {
			switch (aFilters[iInd].operator) {
				case 'eq':
					sFieldName = sPrefix+'Equal';
					break;
				case 'gteq':
					sFieldName = sPrefix+'GtOrEqual';
					break;
				case 'lteq':
					sFieldName = sPrefix+'LtOrEqual';
					break;
				case 'in':	// Texte uniquement
					var oOperIn = oForm.query('#'+sPrefix+'In')[0];
					
					oOperIn.setValue(true);
					sFieldName = 'textValue';
					break;
				case 'start':	// Texte uniquement
					var oOperStart = oForm.query('#'+sPrefix+'Start')[0];
					
					oOperStart.setValue(true);
					sFieldName = sPrefix+'Equal';
					break;
			}
			
			oForm.query('#'+sFieldName)[0].setValue(aFilters[iInd].value);
		}
	},

	/**
	 * @author : edblv
	 * date   : 28/06/16 11:22
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Retourne le menu racine de la colonne de grille
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	getRootMenu: function () {
		var oMe = this;
		var oForm = this.getView();
		var oMenu = oForm.up('menu');

		//---- On remonte la hiérarchie jusqu'a 
		//	ce qu'on trouve le activeHeader
		while (!oMenu.activeHeader) {
			oMenu = oMenu.parentMenu;
		}
		
		return oMenu;
	},
	/**
	 * @author : edblv
	 * date   : 28/06/16 11:22
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Sur changement de valeur du champ 'Egal à'
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onEqual: function () {
		var oMe = this;
		var oForm = this.getView();
		var sPrefix = oMe.fieldPrefix;
		var oGtEq = oForm.query('#'+sPrefix+'GtOrEqual')[0];
		var oLtEq = oForm.query('#'+sPrefix+'LtOrEqual')[0];
		oGtEq.setRawValue('');
		oLtEq.setRawValue('');
	},
	/**
	 * @author : edblv
	 * date   : 28/06/16 11:23
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Sur changement de valeur du champ 'Supérieur à' ou 'Inférieur à'
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onNotEqual: function () {
		var oMe = this;
		var oForm = this.getView();
		var sPrefix = oMe.fieldPrefix;
		var oEq = oForm.query('#'+sPrefix+'Equal')[0];
		oEq.setRawValue('');
	},
	/**
	 * @author : edblv
	 * date   : 28/06/16 16:16
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Formate une valeur saisie pour la requête SQL
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	valueFormat: function (sValue, sType) {
		var oMe = this;
		var oForm = this.getView();
		var oRootMnu = oMe.getRootMenu();
		var oGrid = oRootMnu.up('grid');

		switch (sType) {
			case 'date':
				if (oGrid.filter=='local') {
					sValue = sValue;
				}
				else {
					sValue = Ext.Date.format(sValue, 'Y-m-d');
				}
				break;
			
			case 'text':
				var oOperIn = oForm.query('#'+sType+'In')[0];
				
				if (oGrid.filter=='remote') {
					if (oOperIn.getValue()) {
						sValue = '*'+sValue+'*';
					}
					else {
						sValue = sValue+'*';
					}
				}
				break;
		}
		
		return sValue;
	},
    /**
	 * @author : edblv
	 * date   : 28/06/16 11:25
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Clic sur 'Valider'
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onValidClick: function () {
		var oMe = this;
		var oForm = this.getView();
		var oRootMnu = oMe.getRootMenu();
		var oGrid = oRootMnu.up('grid');
		var sPrefix = oMe.fieldPrefix;
		var sFieldName = '';
		var aFilter = [];

		if (oRootMnu.activeHeader.filter.fields) {
			sFieldName = oRootMnu.activeHeader.filter.fields.join();
		}
		else {
			sFieldName = oRootMnu.activeHeader.dataIndex;
		}
		
		switch (sPrefix) {
			case 'number':
			case 'date':
				var oEqual = oForm.query('#'+sPrefix+'Equal')[0];
				var oGtEq = oForm.query('#'+sPrefix+'GtOrEqual')[0];
				var oLtEq = oForm.query('#'+sPrefix+'LtOrEqual')[0];

				if (oEqual.getValue()!=='' && oEqual.getValue()!==undefined  && oEqual.getValue()!==null) {
					aFilter.push({
						fieldname: sFieldName,
						operator: 'eq',
						value: oMe.valueFormat(oEqual.getValue(),sPrefix)
					});
				}

				if (oGtEq.getValue()!=='' && oGtEq.getValue()!==undefined && oGtEq.getValue()!==null) {
					aFilter.push({
						fieldname: sFieldName,
						operator: 'gteq',
						value: oMe.valueFormat(oGtEq.getValue(),sPrefix)
					});
				}
				
				if (oLtEq.getValue()!=='' && oLtEq.getValue()!==undefined && oLtEq.getValue()!==null) {
					aFilter.push({
						fieldname: sFieldName,
						operator: 'lteq',
						value: oMe.valueFormat(oLtEq.getValue(),sPrefix)
					});
				}
				break;

			case 'text':
				var oEqual = oForm.query('#textValue')[0];
				var oOperIn = oForm.query('#'+sPrefix+'In')[0];
				var sOperator = 'eq';

				if (oGrid.filter=='local') {
					if (oOperIn.getValue()) {
						sOperator = 'in'
					}
					else {
						sOperator = 'start'
					}
				}
				
				aFilter.push({
					fieldname: sFieldName,
					operator: sOperator,
					value: oMe.valueFormat(oEqual.getValue(),sPrefix)
				});
				break;
		}
		
		if (aFilter.length>0) {
			oGrid.aFilters[oRootMnu.activeHeader.dataIndex]=aFilter;
		}
		
		oGrid.applyFilters();
		oMe.onCancelClick();
	},
	/**
	 * @author : edblv
	 * date   : 28/06/16 11:25
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Clic sur 'Annuler'
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onCancelClick: function () {
		var oMe = this;
		var oForm = this.getView();
		var oRootMnu = oMe.getRootMenu();
		oRootMnu.hide();
	}

});
