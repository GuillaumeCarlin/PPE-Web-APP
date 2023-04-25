Ext.define('Thot.overrides.data.Proxy', {
	override: 'Ext.data.Proxy',
	listeners: {
		exception: function (proxy, response, options) {
			var oResponse = new Object();
			var sErrMsg = "loaderr";

			try {
				oResponse = Ext.decode(response.responseText);
				sErrMsg = oResponse.errorMessage;
			} catch (oErr) {
				sErrMsg = "srverr";
			}

		}
	}
});