Ext.define('Thot.view.alr.FormAlertDetController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.alr-formalertdet',
	dataFields: {
		
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

		Ext.Ajax.request({
			url: 'server/alr/Alerts.php',
			params: {
				appName: Thot.app.appConfig.name,
				action: 'alertDetail',
				alr_id: oForm.param.custom.alr_id
			},
			success: function () {
			},
			failure: function () {
			},
			callback: function (opt, success, oResponse) {
				var oBack = Ext.decode(oResponse.responseText);

				if (oBack.success) {
					//---- On met à jour les champs du formulaire...
					oForm.updateForm(oBack.liste[0], oMe.dataFields);
				}
			}
		});
		
	},

	/**
	 * @author : edblv
	 * date   : 30/10/17 09:06
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Clic sur Ok
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onValidClick: function () {
		var oMe = this;
		var oForm = this.getView();
		var oWin = oForm.up('window');
		var oComment = oForm.query('#ace_commentaire')[0];
		var oAlertEnd = oForm.query('#alertEnd')[0];
		var iUserId = Thot.app.contexte.userId;
		var sAlertPrc = 'alertdetail';
		
		//---- Doit-on utiliser un IdUser de substitution (Ex. : Si des users PQR utilisent l'appli, 
		// ils seront identifiés comme s'ils étaient F. Brechon (petite pirouette pour les tests)
		if (Thot.app.appConfig.process[sAlertPrc].usersub) {
			if (Thot.app.appConfig.process[sAlertPrc].usersub[Thot.app.cnxParams.login]) {
				iUserId = Thot.app.appConfig.process[sAlertPrc].usersub[Thot.app.cnxParams.login];
			}
		}
		
		Ext.Ajax.request({
			url: 'server/alr/Alerts.php',
			params: {
				appName: Thot.app.appConfig.name,
				action: 'alertUpdate',
				alr_id: oForm.param.custom.alr_id,
				act_id: oForm.param.idenreg,
				commentaire: oComment.getValue(),
				rsc_id: iUserId,
				terminer: (oAlertEnd.checked ?1 :0)
			},
			success: function () {
			},
			failure: function () {
			},
			callback: function (opt, success, oResponse) {
				var oBack = Ext.decode(oResponse.responseText);
				var oMain = Thot.app.viewport;

				if (oBack.success) {
					//---- Si l'activité à bien été créée, on envoie le message Websocket
					oMain.fireEvent('send', 'maj', oForm.xtype, ['currentAct']);

					// ...et on ferme la fenêtre
					oWin.close();
				} else {
					var oMsg = Thot.app.MessageInfo();
					oMsg.init(5000);
					oMsg.msg("error", 'Impossible d\'enregistrer ce commentaire...');
				}
			}
		});
		
	},
	/**
	 * @author : edblv
	 * date   : 30/10/17 09:07
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Clic sur Annuler
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	onCancelClick: function () {
		var oMe = this;
		var oForm = this.getView();
		var oWin = oForm.up('window');
		oWin.close();
	}

});
