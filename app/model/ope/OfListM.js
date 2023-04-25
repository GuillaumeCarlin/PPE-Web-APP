Ext.define('Thot.model.ope.OfListM', {
    extend: 'Ext.data.Model',

    fields: [{
            name: 'odf_id',
            type: 'int'
        },
        {
            name: 'odf_code',
            type: 'string'
        },
        {
            name: 'odf_date_creation',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        },
        {
            name: 'odf_quantite_lancee',
            type: 'number'
        },
        {
            name: 'pdt_code',
            type: 'string'
        },
        {
            name: 'pdt_complement',
            type: 'string'
        },
        {
            name: 'pdt_libelle',
            type: 'string'
        },
        {
            name: 'nce_libelle',
            type: 'string'
        },
        {
            name: 'gam_code',
            type: 'string'
        },
        {
            name: 'gam_libelle',
            type: 'string'
        }
    ]
});