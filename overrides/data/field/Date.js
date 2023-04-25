Ext.define('Thot.overrides.data.field.Date', {
	override: 'Ext.data.field.Date',
	toDate: function(sVal) {
		if (typeof sVal=='string') {
			sVal = Ext.String.toDate(sVal);
		}

		return sVal;
	}
});

