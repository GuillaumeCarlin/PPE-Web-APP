Ext.define('Thot.view.usr.FormRolesSectionController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.usr-formrolessection',
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
		var oStore = oForm.getStore();
		var aFilter = [];
		var oWin = oForm.up('window');
		oWin.returnValue = {
			rle_id: 0,
			main: 0
		};
		
		aFilter.push({
			type: 'rsc_id',
			value: oForm.param.custom.rsc_id
		});
		aFilter.push({
			type: 'org_id',
			value: oForm.param.custom.org_id
		});

		oStore.setExtraParams({
			storefilters: {
				specfilter: aFilter
			}
		});
		
		oStore.load();
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
	onDblClick: function () {
		var oMe = this;
		var oForm = this.getView();
		
		oMe.onSelClic();
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
	onSelClic: function () {
		var oMe = this;
		var oForm = this.getView();
		var aSelectedId = oForm.getSelectedColumn('rle_id');
		var aSelectedMain = oForm.getSelectedColumn('rca_estprincipal');
		var oWin = oForm.up('window');
		
		if (aSelectedId.length>0) {
			oWin.returnValue.rle_id = aSelectedId[0];
			oWin.returnValue.main = aSelectedMain[0];
			oMe.closeWin();
		}
		else {
			var oMsg = Thot.app.MessageInfo();
			oMsg.init(5000);
			oMsg.msg("error", 'Il faut sélectionner un rôle');
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
	closeWin: function () {
		var oMe = this;
		var oForm = this.getView();
		var oWin = oForm.up('window');
		oWin.close();
	}

});
