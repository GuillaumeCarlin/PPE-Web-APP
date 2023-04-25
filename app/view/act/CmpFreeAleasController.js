Ext.define('Thot.view.act.CmpFreeAleasController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.act-cmpfreealeas',
    /**
	 * @author : edblv
	 * date   : 03/08/16 15:09
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Afterrender du composant
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onAfterRender: function () {
		var oMe = this;
		var oForm = this.getView();
		
	},
	/**
	 * @author : edblv
	 * date   : 03/08/16 15:09
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Raffraichissement de la grille
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onGridRefresh: function () {
		var oMe = this;
		var oForm = this.getView();
		var aFilter = [];
		var oFreeAleasGrd = oForm.query('#grdFreeAleas')[0];
		var oFreeAleasStr = oFreeAleasGrd.getStore();
		if (arguments.length>0) {
			aFilter = arguments[0];

			oFreeAleasStr.setExtraParams({
				storefilters: {
					specfilter: aFilter
				}
			});
		}
		oFreeAleasStr.removeAll();
		oFreeAleasStr.load();
	},
	/**
	 * @author : edblv
	 * date   : 04/08/16 10:58
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Clic sur 'Nouvel aléa'
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onNewAleaClic: function () {
		var oMe = this;
		var oForm = this.getView();
		
		oMe.openAleaForm({title: 'Création aléa libre', alias: 'newalea'});
	},
	/**
	 * @author : edblv
	 * date   : 20/02/18 11:33
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Clic sur le bouton 'modif'
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onModifyAct: function(arg1,arg2,arg3,arg4,arg5,oData) {
		var oMe = this;
		var oForm = this.getView();
		oMe.aleaEdit(oData.get('ala_id'));
	},
	/**
	 * @author : edblv
	 * date   : 20/02/18 11:33
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Click sur le bouton 'programmation'
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onScheduleClick: function(arg1,arg2,arg3,arg4,arg5,oData) {
		var oMe = this;
		var oForm = this.getView();
		oMe.aleaEdit(oData.get('ala_id'),'schedule');
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
	onAleaDblClick: function (oGrid, oRecord) {
		var oMe = this;
		var oForm = this.getView();
		oMe.aleaEdit(oRecord.get('ala_id'));
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
	aleaEdit: function (iId) {
		var oMe = this;
		var oForm = this.getView();
		var sAction = '';
		
		if (arguments.length>1) {
			sAction = arguments[1];
		}
		
		oMe.openAleaForm({
			title: 'Edition d\'un aléa libre', 
			alias: 'editalea',
			param: {
				recordId: iId,
				custom: {action: sAction}
			}
		});
	},
	/**
	 * @author : edblv
	 * date   : 24/11/16 11:02
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Ouverture du formulaire (en création ou modif)
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	openAleaForm: function (oParams) {
		var oMe = this;
		var oForm = this.getView();
		
		var oWin = Thot.app.openWidget("newfreealea", {
			title	: oParams.title,
			alias: oParams.alias,
			modal: true,
			resizable: false,
			height: 550,
			width: 800,
			param: (oParams.param ?oParams.param :{})
		});
		
		oWin.on({
			'destroy': function (oWin) {
				oMe.onGridRefresh();
			}
		});
	},
	/**
	 * @author : edblv
	 * date   : 09/08/16 09:45
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Clic sur un bouton 'Stop' dans la grille
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onStopClick: function (grid, rowIndex, colIndex,oBtn,oEvent,oRecord) {
		var oMe = this;
		var oForm = this.getView();

		Ext.MessageBox.show({
			title: 'Terminer un aléa',
			msg: 'Terminer cet aléa ?',
			buttons: Ext.MessageBox.YESNO,
			buttonText: {
				yes: "Oui",
				no: "Non"
			},
			fn: oMe._onStopClick,
			caller: oMe,
			ala_id: oRecord.get('ala_id'),
			formxtype: oForm.xtype
		});
	},
	_onStopClick: function (sValue, oObj) {
		var oObj = arguments[2];
		var oCtr = oObj.caller;
		var oMain = Thot.app.viewport;

		if (sValue == 'yes') {
			Ext.Ajax.request({
				url: 'server/act/Activities.php',
				params: {
					appName: Thot.app.appConfig.name,
					action: 'AleaEnd',
					ala_id: oObj.ala_id
				},
				success: function () {
				},
				failure: function () {
				},
				callback: function (opt, success, oResponse) {
					var oBack = Ext.decode(oResponse.responseText);
					
					if (oBack.success) {
						oMain.fireEvent('send','maj', oObj.formxtype, ['freealeas']);
						oCtr.onGridRefresh();
					}
				}
			});
		}
	}
});