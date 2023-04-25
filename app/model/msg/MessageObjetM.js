Ext.define('Thot.model.msg.MessageObjetM', {
    extend: 'Ext.data.Model',
    fields: [{
            name: "mso_id",
            type: 'int'
        },
        {
            name: "mso_rang",
            type: 'int'
        },
        {
            name: "mso_code",
            type: 'string'
        },
        {
            name: "mso_base",
            type: 'int'
        },
        {
            name: "mso_libelle",
            type: 'string'
        },
        {
            name: "mso_estinactif",
            type: 'int'
        }
    ]
});