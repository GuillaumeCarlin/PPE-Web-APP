Ext.define('Thot.view.pck.NumKeyBoardController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.pck-numkeyboard',
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
	onBtnClick: function (oBtn) {
		var oMe = this;
		var oForm = this.getView();
		var sCurrValue = oForm.getValue();

		switch (oBtn.itemId) {
			case 'backBtn':
				if (sCurrValue.length > 0) {
					sCurrValue = sCurrValue.substring(0, sCurrValue.length - 1);
				}
				break;

			default:
				sCurrValue += oBtn.text;
				break;
		}

		oForm.setValue(sCurrValue);
	}
});
