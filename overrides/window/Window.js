Ext.define('Thot.overrides.Window', {
	override: 'Ext.window.Window',
	returnvalue: null,
	listeners: {
		'activate': function (win, width, height, opt) {},
		'hide': function (win, width, height, opt) {

		},
		'minimize': function (win, width, height, opt) {
			this.hide();
		},
		'maximize': function (oWin) {
			oWin.setPosition(0, 0);
			oWin.setHeight(oWin.height - 45);
		},
		'resize': function (oWin, iWidth, iHeight, opt) {
			var me = this;
		},
		'move': function (oWin, iWidth, iHeight, opt) {
			var me = this;
		},
		/**
		 * @author : edblv
		 * date   : 01/06/16 14:33
		 * @scrum : RND#ND-ND.ND
		 *
		 * #Description
		 * Fermeture d'une fenêtre
		 *
		 * @version JJMMAA edblv RND#ND-ND.ND Création
		 */
		'beforeclose': function (oWin) {
			var oForm = oWin.down('form');
			var sFormName = "";
			var aFormAlias = [];
			var aGrids = [];
			var aSort = {};
			var oState = {};
			var oConfigGrid = {
				version: 0,
				config: {}
			};
			var oConfig = {};
			var oParamForm = {
				height: oWin.height,
				width: oWin.width,
				top: oWin.y,
				left: oWin.x
			};
			var aPref = [];

			/*
			if (oForm !== null) {
				//oConfigGrid.version=0;	//oForm.gridconfigver;
				aFormAlias = oForm.alias[0].split(".");
				sFormName = aFormAlias[(aFormAlias.length - 1)];
				aGrids = oForm.query('grid');

				//---- Parcours toute les grid de la fenêtre courante et enregistre l'état actuel
				for (var IndGrd = 0; IndGrd < aGrids.length; IndGrd++) {
					oConfigGrid.version = aGrids[IndGrd].gridconfigver;
					aSort = aGrids[IndGrd].getSortConfig();

					oState = aGrids[IndGrd].getState();
					oState.sort = aSort;
					oConfig[aGrids[IndGrd].itemId] = oState;
				}

				oConfigGrid.config = oConfig;

				aPref[aPref.length] = {
					type: 'FormPosit',
					value: {
						fieldname: 'posit',
						value: oParamForm
					}
				};

				//---- Enregistrement dans la base
				Ext.Ajax.request({
					url: 'server/usr/Util.php',
					params: {
						appName: top.Thot.app.appConfig.name,
						action: 'SauvePreferences',
						nomform: sFormName,
						preferences: Ext.encode(aPref)
					},
					success: function (response) {
					}
				});
			}
			*/
		},
		'close': function (oFen) {
			var sAlias = oFen.itemId;
			var bSuppVerrou = true;
			var oForm = oFen.down('form');

			/*
			if (oForm !== null) {
				//---- Si les propriétés sql et param existent, on retire le verrou dans la base
				//if (oForm.sql && oForm.param) {
				if (typeof oForm.sql !== "undefined" && typeof oForm.param !== "undefined") {
					if (oForm.param.mode) {
						if (oForm.param.mode == 'consult') {
							//---- Si le formulaire courant a été ouvert en mode 'consultation', il n'y a pas de verrou à supprimer
							bSuppVerrou = false;
						}
					}

					if (bSuppVerrou) {
						//---- Suppression du verrou en cours
						Ext.Ajax.request({
							url: 'server/commun/Commun.php',
							params: {
								appName: top.Thot.app.appConfig.name,
								action: 'SuppVerrou',
								from: oForm.sql.update,
								idenreg: oForm.param.idenreg
							},
							success: function (response) {
								var text = response.responseText;

							}
						});
					}
				}
			}
			*/

			if (typeof Thot.app.aWindows[sAlias] != "undefined") {
				delete Thot.app.aWindows[sAlias];
			}
		}
	},
	showBusy: function (bBusy) {
		var sBbarId = this.itemId + 'bbar';
		var oBbar = this.query("#" + sBbarId);
		var sText = "...";

		if (oBbar.length > 0) {
			if (arguments.length > 1) {
				sText = arguments[1];
			}


			if (bBusy) {
				oBbar[0].showBusy(sText);
			} else {
				oBbar[0].clearStatus();
			}
		}
	}
});