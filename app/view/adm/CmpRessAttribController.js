Ext.define('Thot.view.adm.CmpRessAttribController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.adm-cmpressattrib',
	userTpl: new Ext.Template([
		'<b>Nom</b> : {usr_prenom}&nbsp;{usr_nom}<br>'
	]),
	wstnTpl: new Ext.Template([
		'<b>Equipement</b> : {label}'
	]),
	currentRsc: {
		url: '',
		type: '',
		id: 0
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
	onAfterRender: function () {
		var oMe = this;
		var oForm = this.getView();
		oMe.currentSection = Thot.app.getSection();

	},
	/**
	 * @author : edblv
	 * date   : 23/09/16 15:02
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * 
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onUserDetail: function (oParam) {
		var oMe = this;
		var oForm = this.getView();
		var oRessourcedet = oForm.query('#ressourcedet')[0];
		var oSectionGrd = oForm.query('#sectionGrd')[0];
		var oSectionStr = oSectionGrd.getStore();

		oMe.currentRsc.url = 'server/usr/Users.php';
		oMe.currentRsc.type = 'usr';
		oMe.currentRsc.id = oParam.idRecord;
		/*
		 var aFilter = [{
		 type: 'sab_id',
		 value: oMe.currentSection.idsection
		 }];
		 //---- Chargement de la combo des sections
		 oSectionStr.setExtraParams({
		 storefilters: {
		 specfilter: aFilter
		 }
		 });
		 */

		oRessourcedet.update(oMe.userTpl.apply(oParam));
		oSectionStr.load();
	},
	/**
	 * @author : edblv
	 * date   : 26/09/16 14:03
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * 
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onWstnDetail: function (oParam) {
		var oMe = this;
		var oForm = this.getView();
		var oRessourcedet = oForm.query('#ressourcedet')[0];
		var oSectionGrd = oForm.query('#sectionGrd')[0];
		var oSectionStr = oSectionGrd.getStore();
		var oMainSectionCbx = oForm.query('#mainSectionCbx')[0];
		var oRolesCbo = oForm.query('#roleCbo')[0];

		oMainSectionCbx.hide();
		oRolesCbo.hide();
		oMe.currentRsc.url = 'server/wst/WorkStn.php';
		oMe.currentRsc.type = 'wstn';
		oMe.currentRsc.id = oParam.idRecord;
		
		oRessourcedet.update(oMe.wstnTpl.apply(oParam));
		oSectionStr.load();
	},

	/**
	 * @author : edblv
	 * date   : 26/09/16 09:37
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Validation des infos du user
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onValidClick: function () {
		var oMe = this;
		var oForm = this.getView();
		var oParentFrm = oForm.up('form');
		var oUsersGrd = oParentFrm.query('#users')[0];
		var oWstnGrd = oParentFrm.query('#equipments')[0];
		var oSectionGrd = oForm.query('#sectionGrd')[0];
		var oMainSectionCbx = oForm.query('#mainSectionCbx')[0];
		var oRolesCbo = oForm.query('#roleCbo')[0];
		var oParams = {};
		var bValid = true;

		if (oSectionGrd.getSelectedColumn('sab_id').length < 1) {
			bValid = false;
			var oMsg = Thot.app.MessageInfo();
			oMsg.init(5000);
			oMsg.msg("error", 'Il faut seléctionner un service');
		}

		if (oMe.currentRsc.type == 'usr') {
			if (oRolesCbo.getValue() === null) {
				bValid = false;
				var oMsg = Thot.app.MessageInfo();
				oMsg.init(5000);
				oMsg.msg("error", 'Il faut seléctionner un rôle');
			}
		}

		if (bValid) {
			if (oMe.currentRsc.type == 'usr') {
				oParams = {
					appName: Thot.app.appConfig.name,
					action: 'sectionAttrib',
					rsc_id: oMe.currentRsc.id,
					org_id: oSectionGrd.getSelectedColumn('sab_id')[0],
					main: oMainSectionCbx.getValue(),
					rle_id: oRolesCbo.getValue()
				};
			}
			else {
				oParams = {
					appName: Thot.app.appConfig.name,
					action: 'sectionAttrib',
					rsc_id: oMe.currentRsc.id,
					org_id: oSectionGrd.getSelectedColumn('sab_id')[0]
				};
			}

			Ext.Ajax.request({
				url: oMe.currentRsc.url,
				params: oParams,
				success: function () {
				},
				failure: function () {
				},
				callback: function (opt, success, oResponse) {
					var oBack = Ext.decode(oResponse.responseText);

					if (oBack.success) {
						oForm.collapse();
						
						//---- Refresh de la grille qui va bien
						if (oMe.currentRsc.type == 'usr') {
							oUsersGrd.refresh();
						}
						else {
							oWstnGrd.refresh();
						}
					}
				}
			});
		}
	}

});
