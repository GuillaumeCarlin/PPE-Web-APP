Ext.define('Thot.overrides.data.TreeStore', {
	override: 'Ext.data.TreeStore',
	listeners: {
		beforeLoad: function (oStore, oParam) {
			var bLoad = true;

			if (oStore.storefilters) {
				//--- Cas ou le storefilters a été défini dans la view
				this.setExtraParams({
					storefilters: oStore.storefilters
				});
			}

			//---- Si le store nécessite un filtre MAIS que le filtre n'a pas
			//	encore été initialisé, on laisse bLoad à false
			if (this.needFilter) {
				bLoad = false;

				if (this.getProxy().extraParams.filter || this.getProxy().extraParams.specfilter) {
					bLoad = true;
				}
			}

			if (oStore.getProxy().extraParams) {
				oStore.getProxy().extraParams.appName = Thot.app.appConfig.name;
			}

			return bLoad;
		}
	},
	setExtraParams: function (oParams) {
		var oStore = this;
		oStore.proxy.extraParams = {};

		if (oParams.storefilters.filter) {
			if (oParams.storefilters.filter.length > 0) {
				oStore.getProxy().extraParams.filter = Ext.encode(oParams.storefilters.filter);
			}
		}

		if (oParams.storefilters.specfilter) {
			oStore.getProxy().extraParams.specfilter = Ext.encode(oParams.storefilters.specfilter);
		}
	}
});
