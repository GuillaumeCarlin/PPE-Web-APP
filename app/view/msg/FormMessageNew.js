Ext.define('Thot.view.msg.FormMessageNew', {
    extend: 'Ext.form.Panel',
    xtype: 'noteedit',
    itemid: 'noteedit',

    requires: [
        'Thot.view.msg.FormMessageNewController',
        'Thot.view.msg.FormMessageNewModel',
        'Thot.store.usr.SectionUsersS'
    ],

    controller: 'msg-formmessagenew',
    viewModel: {
        type: 'msg-formmessagenew',
        data: {
            value: ''
        },
        formulas: {
            count: {
                bind: '{value}',
                get: function (value) {
                    return value.length;
                }
            }
        }
    },
    listeners: {
        afterRender: 'onAfterRender'
    },
    bodyPadding: 10,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [{
            xtype: 'fieldset',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'combobox',
                    itemId: 'comboUsrWriter',
                    fieldLabel: 'Rédacteur',
                    emptyText: 'Sélectionner un rédacteur',
                    allowBlank: false,
                    forceSelection: true,
                    store: {
                        type: 'sectionusers'
                    },
                    displayField: 'usr_displayname',
                    valueField: 'usr_id',
                    listeners: {
                        // place le focus sur ce champ à l'ouverture du formulaire
                        afterrender: function (field) {
                            field.focus(true);
                        },
                        beforequery: function (record) {
                            // permet de faire une recherche du type *{}* au ieu de {}* par défaut
                            // The modifier g is more important, for a global search. i is only for case insensitive search.
                            record.query = new RegExp(record.query, 'ig');
                        }
                    },
                    queryMode: 'local',
                    listConfig: {
                        getInnerTpl: function () {
                            // here you place the images in your combo
                            var tpl = '<div style="float: right; text-align: right">{sab_libelle}</div> <div>{usr_displayname}</div>';
                            return tpl;
                        }
                    }
                },
                {
                    xtype: 'combobox',
                    itemId: 'comboUsrDest',
                    fieldLabel: 'A l\'attention de',
                    emptyText: 'Sélectionner un destinataire (optionnel)',
                    forceSelection: true,
                    store: {
                        type: 'sectionusers'
                    },
                    displayField: 'usr_displayname',
                    valueField: 'usr_id',
                    listeners: {
                        beforequery: function (record) {
                            // permet de faire une recherche du type *{}* au ieu de {}* par défaut
                            // The modifier g is more important, for a global search. i is only for case insensitive search.
                            record.query = new RegExp(record.query, 'ig');
                        }
                    },
                    queryMode: 'local',
                    listConfig: {
                        getInnerTpl: function () {
                            // here you place the images in your combo
                            var tpl = '<div style="float: right; text-align: right">{sab_libelle}</div> <div>{usr_displayname}</div>';
                            return tpl;
                        }
                    }
                },
                {
                    xtype: 'combobox',
                    itemId: 'comboMsgObjet',
                    emptyText: 'Sélectionner l\'objet de la note',
                    fieldLabel: 'Objet',
                    allowBlank: false,
                    forceSelection: true,
                    store: {
                        type: 'messageobjet'
                    },
                    displayField: 'mso_libelle',
                    valueField: 'mso_id',
                    listeners: {
                        beforequery: function (record) {
                            // permet de faire une recherche du type *{}* au ieu de {}* par défaut
                            // The modifier g is more important, for a global search. i is only for case insensitive search.
                            record.query = new RegExp(record.query, 'ig');
                        }
                    },
                    queryMode: 'local'
                },
                {
                    xtype: 'textfield',
                    itemId: 'messageTitre',
                    fieldLabel: 'Titre',
                    emptyText: 'Saisir un titre pour la note',
                    allowBlank: false,
                    maxLength: 200,
                    enforceMaxLength: true
                },
            ]
        },
        {
            xtype: 'textareafield',
            itemId: 'messageTexte',
            flex: 1,
            //fieldLabel: 'Message',
            emptyText: 'Saisir le texte de la note',
            allowBlank: false,
            maxLength: 2000,
            enforceMaxLength: true,
            bind: '{value}'
        }
    ],
    buttons: [{
            xtype: 'box',
            bind: '<b>{count}</b>/2000 caractères.'
        },
        '->',
        {
            text: 'Annuler',
            ui: 'cancel',
            iconCls: 'x-fa fa-times-circle fa-2x',
            handler: 'onCancelClick'
        },
        {
            text: 'Valider',
            ui: 'succes',
            iconCls: 'x-fa fa-check-circle fa2x',
            handler: 'onValidClick',
            disabled: true,
            formBind: true
        }
    ]

});