var oValid={
	controller: {},
	form: {},
	valid: function(aFields, aArgs) {
		var oObj = this;
		
		Ext.Ajax.request({
			url: 'server/act/Activities.php',
			params: {
				appName: Thot.app.appConfig.name,
				action: 'NewActCtrl',
				rsc_id: aFields['selectedOperId'].value+','+aFields['selectedWorkStnId'].value
			},
			success: function () {
			},
			failure: function () {
			},
			callback: function (opt, success, oResponse) {
				var oBack = Ext.decode(oResponse.responseText);
				if (oBack.success) {
					oObj.controls(aFields, oBack.liste);
				}
				else {
					var oMsg = Thot.app.MessageInfo();
					oMsg.init(5000);
					oMsg.msg("error", 'Contrôle de création impossible');
				}
			}
		});
	},

	/**
	 * @author : edblv
	 * date   : 23/06/16 14:18
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Fonction de validation appelée par le callBack
	 * de l'ajax.request (ci dessus)
	 *
	 * @version JJMMAA edblv RND#ND-ND.ND Création
	 */
	controls: function (aFields, aTasks) {
		var oMe = this;
		var iOperId = aFields['selectedOperId'].value;
		var sOperatorLabel = aFields['selectedOper'].value;
		var iWorkStnId = aFields['selectedWorkStnId'].value;
		var sWorkStnLabel = aFields['selectedWorkStn'].value;
		var sMessage = '';
		var bNeedValid = false;
		var bContinue = true;
		var aSimTask = {
			operator: 0,
			workstn: 0
		};
		var aSimWorStn = {
			enable: true,
			current: 0,
			max: 0
		};
		
		//---- Parcours le résultat pour déterminer le type de simultaneité
		for (var iAct in aTasks) {
			if (aTasks[iAct].usr_id == iOperId) {
				aSimTask.operator++;
			}

			if (aTasks[iAct].eqp_id == iWorkStnId) {
				aSimTask.workstn++;
				aSimWorStn.enable = (aTasks[iAct].eqp_simultaneite > 0);
				aSimWorStn.current = aTasks[iAct].eqp_simultaneite_nombreencours;
				aSimWorStn.max = aTasks[iAct].eqp_simultaneite_maxoperateur;
			}
		}

		if (aSimTask.operator > 0) {
			//---- Si l'opérateur à déjà des tâches en cours
			bNeedValid = true;
			sMessage = aSimTask.operator + ' tâche(s) affectée(s) à : ' + sOperatorLabel;
		}

		if (aSimTask.workstn > 0) {
			//---- Si le poste de travail à déjà des tâches en cours
			//	là c'est déjà plus compliqué...
			if (sMessage !== '') {
				sMessage += '<br>et<br>';
			}

			sMessage += aSimTask.workstn + ' tâche(s) affectée(s) au poste : ' + sWorkStnLabel;
			//---- Ce poste de travail accepte-t-il les tâches simultanées
			if (aSimWorStn.enable) {
				//---- a-t-on dépassé la limite ?
				if (aSimWorStn.current >= aSimWorStn.max) {
					//---- On ne peut pas enregistrer de nouvelle activité sur ce poste
					bContinue = false;
				}
				else {
					//---- On peut encore enregistrer une activité mais il faut demander
					bNeedValid = true;
				}
			}
			else {
				//---- On ne peut pas enregistrer de nouvelle activité sur ce poste
				bContinue = false;
			}
		}

		if (bContinue) {
			if (bNeedValid) {
				//---- Création de tâche simultanée ou arrêt
				Ext.Msg.show({
					title: 'Tâches simultanées',
					message: sMessage,
					buttonText: {
						yes: 'Créer une tâche simultanée', 
						no: 'Abandonner'
					},
					buttons: Ext.Msg.YESNO,
					icon: Ext.Msg.QUESTION,
					fn: function (oBtn) {
						if (oBtn=='no') {
							//---- On arrête là
							oMe.form.fireEvent('validForm',false);
						}
						else {
							//---- On crée la tâche
							oMe.form.fireEvent('validForm',true);
						}
					}
				});
			}
			else {
				//---- On peut y aller direct
				oMe.form.fireEvent('validForm',true);
			}
		}
		else {
			//---- C'est fini, on n'ira pas plus loin
			var oMsg = Thot.app.MessageInfo();
			oMsg.init(5000);
			oMsg.msg("error", 'Création de nouvelle tâche impossible<br>' + sMessage);
		}
	}
};