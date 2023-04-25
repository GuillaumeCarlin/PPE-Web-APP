Ext.define('Thot.overrides.data.BufferedStore', {
	override: 'Ext.data.BufferedStore',
	listeners: {
		beforeLoad: function (oStore, oParam) {
			Thot.Thot.log('---- BufferedStore.beforeLoad ----');
			Thot.Thot.log(arguments);
			var bLoad = true;
			var bFilter = true;
			var oExtraParams = {};
			var sParam = '';

			//---- Test si le store necessite des filtres pour pouvoir être chargé
			if (typeof oStore.proxy.initialFilter !== "undefined") {
				if (oStore.proxy.initialFilter) {
					//---- Le filtre est connu
					bLoad = true;
					bFilter = true;
				}
				else {
					//---- Le filtre n'est pas connu
					bLoad = false;
					bFilter = false;
				}
			}

			if (!bFilter) {
				if (oStore.storefilters) {
					oStore.proxy.extraParams = {};

					if (oStore.storefilters.filter) {
						if (oStore.storefilters.filter.length > 0) {
							oStore.proxy.initialFilter = true;
							oStore.proxy.setExtraParam('filter', Ext.encode(oStore.storefilters.filter));
						}
					}

					if (oStore.storefilters.specfilter) {
						if (oStore.storefilters.specfilter.length > 0) {
							oStore.proxy.initialFilter = true;
							oStore.proxy.setExtraParam('specfilter', Ext.encode(oStore.storefilters.specfilter));
						}
					}
				}

				bLoad = oStore.proxy.initialFilter;
			}

			//---- Si des extraFilters ont été passés en paramètre dans le create, on les ajoutes
			if (typeof oStore.extraFilters !== "undefined") {
				oExtraParams = oStore.getProxy().extraParams;

				for (sParam in oStore.extraFilters) {
					oStore.proxy.setExtraParam(sParam, oStore.extraFilters[sParam]);
				}
			}

			Thot.Thot.log(bLoad);
			return bLoad;
		}
	}
});
