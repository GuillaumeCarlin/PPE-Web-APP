Ext.define('Thot.view.act.CmpHistoActController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.act-cmphistoact',
	/**
	 * @author : edblv
	 * date   : 11/07/16 16:02
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * 
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onAfterRender: function () {
		var oMe = this;
		var oForm = this.getView();
		var oFullScrBtn = oForm.query('#fullScreen')[0];
		
		if (oForm.enableFullScreen) {
			oFullScrBtn.setHidden(false);
		}
	},
	/**
	 * @author : edblv
	 * date   : 11/07/16 16:02
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Déclenchée par MainController.onListsRefreh
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onGridRefresh: function (aFilter) {
		var oMe = this;
		var oForm = this.getView();
		oForm.currentFilter = Ext.JSON.encode(aFilter);
		oMe.histoRefresh();
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
	histoRefresh: function () {
		var oMe = this;
		var oForm = this.getView();
		var oActHistoGrd = oForm.query('#grdHisto')[0];
		var oActHistoStr = oActHistoGrd.getStore();
		var oHistoNbLines = oForm.query('#histoNbLines');
		var iNbLines = 25;
		var aFilter = Ext.JSON.decode(oForm.currentFilter);
		
		if (oHistoNbLines.length>0) {
			iNbLines = oHistoNbLines[0].selectedValue;
		}

		aFilter.push({
			type: 'nblines',
			value: iNbLines
		});
		oActHistoStr.removeAll();
		oActHistoStr.setExtraParams({
			storefilters: {
				specfilter: aFilter
			}
		});

		oActHistoStr.load();
	},

	/**
	 * @author : edblv
	 * date   : 16/06/16 16:56
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * 
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onHistoNbLinesSel: function (oSegBtn, oButton, pressed) {
		var oMe = this;
		var oForm = this.getView();
		
		oSegBtn.selectedValue = oButton.nblines;
		oMe.histoRefresh();
	},
	/**
	 * @author : edblv
	 * date   : 11/07/16 15:59
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Clic sur le bouton 'FullScreen'
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onFullScreenClick: function () {
		var oMe = this;
		var oForm = this.getView();
		var oMain = oForm.up('app-main');
		var oTab = oMain.query('#histoActTab');
		
		if (oTab.length>0) {
			//---- L'onglet existe déjà, on se positionne dessus
			oMain.setActiveTab(oTab[0]);
		}
		else {
			//---- L'onglet n'existe pas, on le crée
			oMain.insert(1,{
				title: 'Historique',
				itemId: 'histoActTab',
				layout: {
					align: 'stretch',
					type: 'vbox'
				},
				iconCls: 'History',
				closable: true,
				items: [{
					xtype: 'histoact',
					itemId: 'histoactivities',
					flex: 1
				}]
			});
			oMain.setActiveTab(1);
		}

		oMain.fireEvent('listsRefresh');
	}
    
});
