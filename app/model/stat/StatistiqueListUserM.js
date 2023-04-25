Ext.define('Thot.model.stat.StatistiqueListUserM', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'Identifiant',
            type: 'int'
        },
        {
            name: 'Nom',
            type: 'string'
        },
        {
            name: 'Prenom',
            type: 'string'
        },
        {
            name: 'Atelier',
            type: 'string'
        },
        {
            name: 'TpsExige',
            type: 'float',
        },
        {
            name: 'TpsReleve',
            type: 'float',
        }
    ]
});