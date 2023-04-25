Ext.define('Thot.model.msg.MessageListM', {
    extend: 'Ext.data.Model',
    fields: [{
            name: "msg_id",
            type: 'int'
        },
        {
            name: "act_id",
            type: 'int'
        },
        {
            name: "ala_id",
            type: 'int'
        },
        {
            name: "mso_libelle",
            type: 'string'
        },
        {
            name: "msg_id_parent",
            type: 'int'
        },
        {
            name: "rsc_id_redacteur",
            type: 'int'
        },
        {
            name: "usr_nom_redacteur",
            type: 'string'
        },
        {
            name: "usr_prenom_redacteur",
            type: 'string'
        },
        {
            name: "usr_fullname_redacteur",
            type: 'string',
            convert: function (v, record) {
                return record.get('usr_prenom_redacteur') + ' ' + record.get('usr_nom_redacteur')
            }
        },
        {
            name: "rsc_image_redacteur",
            type: 'string'
        },
        {
            name: "rsc_id_destinataire",
            type: 'int'
        },
        {
            name: "usr_nom_destinataire",
            type: 'string'
        },
        {
            name: "usr_prenom_destinataire",
            type: 'string'
        },
        {
            name: "usr_fullname_destinataire",
            type: 'string',
            convert: function (v, record) {
                return record.get('usr_prenom_destinataire') + ' ' + record.get('usr_nom_destinataire')
            }
        },
        {
            name: "rsc_image_destinataire",
            type: 'string'
        },
        {
            name: "msg_date",
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        },
        {
            name: "msg_titre",
            type: 'string'
        },
        {
            name: "msg_texte",
            type: 'string'
        },
        {
            name: "msg_date_traitement",
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            convert: function (sVal) {
                return this.toDate(sVal);
            }
        }
    ]
});