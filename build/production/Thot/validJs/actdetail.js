var oValid = {
	controller: {},
	valid: function (aFields, aArgs) {
		var aa = aFields.status.value;
		var aab = aa.substring(60, 67);

		var oMe = this;
		var oObj = this;
		var bValid = true;
		var sAction = aArgs[0];
		var iTotQty = parseFloat(aFields['totalQty'].value, 10) + parseFloat(aFields['qtyPrevOpe'].value, 10);
		var iNptr = parseInt(aFields['nptr'].value);
		var iEdge = Math.floor(iNptr * 0.10);

		if (aFields['totalQty'].value == undefined) {
			var oMsg = Thot.app.MessageInfo();
			oMsg.init(5000);
			oMsg.msg("error", 'Veuillez saisir au moins une quantité');
			bValid = false;
		} else {
			// TEST 1 :  quantité totale ne peut pas être supérieure a la quantité attendue max (avec sa tolérance)
			// quel que soit le type d'opération
			if (sAction !== 'NoQuantityCheck') {
				// on valide la quantité max, ne doit pas être > à la quantité attendue
				if (iTotQty > parseFloat(aFields['expectedMax'].value)) {
					var oMsg = Thot.app.MessageInfo();
					oMsg.init(5000);
					oMsg.msg("error", 'La quantité totale ne peut pas être supérieure à la quantité attendue');
					bValid = false;
				}
			}

			// TEST 2 : si on termine l'opération, la quantité totale produite ne peut être inférieure à la quantité attendue (avec sa tolérance)
			// uniquement les opérations de production
			if (sAction == 'Stop') {
				//---- Si on termine l'activité
				if (iTotQty < parseFloat(aFields['expectedMin'].value)) {
					var oMsg = Thot.app.MessageInfo();
					oMsg.init(5000);
					oMsg.msg("error", 'La quantité totale ne peut pas être inférieure à la quantité attendue');
					bValid = false;
				}
			}

			// TEST 3 : validation = true et pas en mode réglage
			// uniquement les opérations de production
			if (bValid && aab !== "Réglage") { //validation true et pas en mode réglage
				//---- Contrôles par rapport au NPTR
				// TEST 3.1 :  vérification du NPTR mini
				if (iTotQty < (iNptr - iEdge)) {
					bValid = false;
					Ext.MessageBox.show({
						title: 'Alerte',
						msg: 'La quantité saisie est inférieure au NPTR  (Nombre de Pièces Théoriquement Réalisable)<br>Valider quand même ?',
						buttons: Ext.MessageBox.YESNO,
						buttonText: {
							yes: "Oui, valider cette quantité",
							no: "Non, corriger"
						},
						fn: oMe._valid,
						caller: oMe
					});
				}

				// TEST 3.2 : vérification du NPTR maxi
				if (iTotQty > (iNptr + iEdge)) {
					bValid = false;
					Ext.MessageBox.show({
						title: 'Alerte',
						msg: 'La quantité saisie est supérieure au NPTR  (Nombre de Pièces Théoriquement Réalisable)<br>Valider quand même ?',
						buttons: Ext.MessageBox.YESNO,
						buttonText: {
							yes: "Oui, valider cette quantité",
							no: "Non, corriger"
						},
						fn: oMe._valid,
						caller: oMe
					});
				}
			}
		}
		oMe.form.fireEvent('validForm', bValid);
	},
	_valid: function (sValue, sNull) {
		var oObj = arguments[2];
		var oCtr = oObj.caller;

		// validation du message en cas d'écart aux règles mais possible de forcer
		if (sValue == 'yes') {
			oCtr.form.fireEvent('validForm', true);
		}
	}
};