Ext.define('Thot.overrides.form.field.Date', {
	override: 'Ext.form.field.Date',
	enableKeyEvents: true,
	startDay: 1,
	triggers: {
		list: {
			cls: 'x-fa fa-caret-square-o-down',
			handler: function (oField, oBtn, oEvent) {
				this.optionsMenu(oField, oEvent);
			}
		}
	},
	setDate: function (oItem) {
		var oMenu = this.up('#dateFieldMnu');
		var oField = oMenu.parentField;
		oField.setValue(oField.getNewDate(oItem.dateCalc));
	},
	/**
	 * @authot edblv
	 * @description calcul la date par rapport à la date courante en fonction de l'incrément et du sens passés en paramètres
	 * @param {object} oConfig 
	 * @returns 
	 */
	getNewDate: function (oConfig) {
		// TODO: HVT 2021-03-29 10:12:48 : 
		// à revoir, il faut recevoir la date à partir de laquelle faire le calcul
		//au lieu de calculer par rapport à la date courante
		var oToday = oConfig.dateref;
		// var oToday = new Date();
		var oNewDate = new Date();
		var iDay = oToday.getDay();

		switch (oConfig.type) {
			case 'today':
				oNewDate = oToday;
				break;
			case 'monday':
				//---- On commence par calculer le premier lundi
				if (iDay == 1) {
					//---- Si on est lundi, c'est -7 jrs
					oNewDate = Ext.Date.add(oToday, Ext.Date.DAY, -7);
				} else {
					//---- Sinon c'est -n jrs
					oNewDate = Ext.Date.add(oToday, Ext.Date.DAY, -(iDay - 1));
				}

				//---- Puis on boucle sur le nombre de lundi
				if (oConfig.value < 0) {
					//---- On recule
					for (var iInd = -1; iInd > oConfig.value; iInd--) {
						oNewDate = Ext.Date.add(oNewDate, Ext.Date.DAY, -7);
					}
				} else {
					//---- On avance
					for (var iInd = 1; iInd < oConfig.value; iInd++) {
						oNewDate = Ext.Date.add(oNewDate, Ext.Date.DAY, 7);
					}
				}
				break;
			case 'day':
				oNewDate = Ext.Date.add(oToday, Ext.Date.DAY, oConfig.value);
				break;
			case 'week':
				oNewDate = Ext.Date.add(oToday, Ext.Date.DAY, (7 * oConfig.value));
				break;
			case 'month':
				oNewDate = Ext.Date.add(oToday, Ext.Date.MONTH, oConfig.value);
				break;
		}
		return oNewDate;
	},
	/**
	 * @authot edblv
	 * @description intercèpte les touches clavier pour avancer ou reculer la date d'une unité de temps (jour/mois/année)
	 * @param {object} oEvent 
	 * @param {object} oEl 
	 * @param {object} oConfig 
	 */
	onKeyPress: function (oEvent, oEl, oConfig) {
		// récupère la date courante du champ date
		var dCurrentDate = oConfig.scope.value;
		var oField = oConfig.scope;
		var sType = '';
		var sDirection = 'minus';
		var oConfig = {};
		var oCurrentType = {
			type: '',
			value: 0,
			dateref: dCurrentDate
		};
		var bContinue = true;

		oCurrentType.dateref = dCurrentDate;

		if (oField.currentType) {
			oCurrentType = oField.currentType;
		}

		switch (String.fromCharCode(oEvent.charCode)) {
			case 'a':
			case 'A':
				// Aujourd'hui
				sType = 'today';
				break;
			case 'l':
				// Lundi en marche arrière
				sType = 'monday';
				break;
			case 'L':
				// Lundi en marche avant
				sType = 'monday';
				sDirection = 'plus';
				break;
			case 'j':
				// Jour en marche arrière
				sType = 'day';
				break;
			case 'J':
				// Jour en marche avant
				sType = 'day';
				sDirection = 'plus';
				break;
			case 's':
				// Semaine en marche arrière
				sType = 'week';
				break;
			case 'S':
				// Semaine en marche avant
				sType = 'week';
				sDirection = 'plus';
				break;
			case 'm':
				// Mois en marche arrière
				sType = 'month';
				break;
			case 'M':
				// Mois en marche avant
				sType = 'month';
				sDirection = 'plus';
				break;
		}

		if (sType !== '') {
			if (sType == oCurrentType.type) {
				if (sDirection == 'plus') {
					oCurrentType.value++;
				} else {
					oCurrentType.value--;
				}
			} else {
				oCurrentType.type = sType;
				if (sDirection == 'plus') {
					oCurrentType.value = 1;
				} else {
					oCurrentType.value = -1;
				}
			}

			oField.currentType = oCurrentType;
			oField.setValue(this.getNewDate(oCurrentType));
			oEvent.stopEvent();
		}
	},
	/**
	 * @author	edblv
	 * @description ajoute les options de menu déroulant pour aller directement à certaines dates
	 * @param {Object} oField 
	 * @param {Object} oEvent 
	 */
	optionsMenu: function (oField, oEvent) {
		Ext.create('Ext.menu.Menu', {
			plain: true,
			itemId: 'dateFieldMnu',
			parentField: oField,
			items: [{
					text: 'Ajourd\'hui',
					handler: this.setDate,
					dateCalc: {
						type: 'today',
						value: 0
					}
				},
				{
					text: 'Lundi',
					handler: this.setDate,
					dateCalc: {
						type: 'monday',
						value: 0
					}
				},
				{
					text: 'Lundi dernier',
					handler: this.setDate,
					dateCalc: {
						type: 'monday',
						value: 2
					}
				},
				{
					text: 'Il y a',
					menu: {
						items: [{
								text: '1 sem.',
								handler: this.setDate,
								dateCalc: {
									type: 'week',
									value: -1
								}
							},
							{
								text: '2 sem.',
								handler: this.setDate,
								dateCalc: {
									type: 'week',
									value: -2
								}
							},
							{
								text: '3 sem.',
								handler: this.setDate,
								dateCalc: {
									type: 'week',
									value: -3
								}
							},
							{
								text: '4 sem.',
								handler: this.setDate,
								dateCalc: {
									type: 'week',
									value: -4
								}
							},
							'-',
							{
								text: '1 mois',
								handler: this.setDate,
								dateCalc: {
									type: 'month',
									value: -1
								}
							},
							{
								text: '2 mois',
								handler: this.setDate,
								dateCalc: {
									type: 'month',
									value: -2
								}
							},
							{
								text: '3 mois',
								handler: this.setDate,
								dateCalc: {
									type: 'month',
									value: -3
								}
							},
							{
								text: '6 mois',
								handler: this.setDate,
								dateCalc: {
									type: 'month',
									value: -6
								}
							}
						]
					}
				},
				{
					text: 'Dans',
					menu: {
						items: [{
								text: '1 sem.',
								handler: this.setDate,
								dateCalc: {
									type: 'week',
									value: 1
								}
							},
							{
								text: '2 sem.',
								handler: this.setDate,
								dateCalc: {
									type: 'week',
									value: 2
								}
							},
							{
								text: '3 sem.',
								handler: this.setDate,
								dateCalc: {
									type: 'week',
									value: 3
								}
							},
							{
								text: '4 sem.',
								handler: this.setDate,
								dateCalc: {
									type: 'week',
									value: 4
								}
							},
							'-',
							{
								text: '1 mois',
								handler: this.setDate,
								dateCalc: {
									type: 'month',
									value: 1
								}
							},
							{
								text: '2 mois',
								handler: this.setDate,
								dateCalc: {
									type: 'month',
									value: 2
								}
							},
							{
								text: '3 mois',
								handler: this.setDate,
								dateCalc: {
									type: 'month',
									value: 3
								}
							},
							{
								text: '6 mois',
								handler: this.setDate,
								dateCalc: {
									type: 'month',
									value: 6
								}
							}
						]
					}
				}
			]
		}).showAt([oEvent.pageX, oEvent.pageY]);
	}
});