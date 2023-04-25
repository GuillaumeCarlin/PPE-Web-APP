var oValid = {
	controller: {},
	valid: function (aFields, aArgs) {
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
			oMsg.msg("error", 'Il faut saisir au moins une quantité');
			bValid = false;
		} else {
			if (iTotQty > parseFloat(aFields['expectedMax'].value)) {
				var oMsg = Thot.app.MessageInfo();
				oMsg.init(5000);
				oMsg.msg("error", 'La quantité totale ne peut pas être supérieure à la quantité attendue');
				bValid = false;
			}

			if (sAction == 'Stop') {
				//---- Si on termine l'activité
				if (iTotQty < parseFloat(aFields['expectedMin'].value)) {
					var oMsg = Thot.app.MessageInfo();
					oMsg.init(5000);
					oMsg.msg("error", 'La quantité totale ne peut pas être inférieure à la quantité attendue');
					bValid = false;
				}
			}

			if (bValid) {
				//---- Contrôles par rapport au NPTR
				if (iTotQty < (iNptr - iEdge)) {
					bValid = false;
					Ext.MessageBox.show({
						title: 'Alerte',
						msg: 'La quantité saisie est inférieure au NPTR<br>Valider quand même ?',
						buttons: Ext.MessageBox.YESNO,
						buttonText: {
							yes: "Oui, valider cette quantité",
							no: "Non, corriger"
						},
						fn: oMe._valid,
						caller: oMe
					});
				}

				if (iTotQty > (iNptr + iEdge)) {
					bValid = false;
					Ext.MessageBox.show({
						title: 'Alerte',
						msg: 'La quantité saisie est supérieure au NPTR<br>Valider quand même ?',
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

		if (sValue == 'yes') {
			oCtr.form.fireEvent('validForm', true);
		}
	}
};