Ext.define('Thot.view.usr.FormAuth', {
    extend: 'Ext.form.Panel',
    xtype: 'userauth',
    requires: [
        'Thot.view.usr.FormAuthController',
        'Thot.view.usr.FormAuthModel'
    ],

    controller: 'usr-formauth',
    viewModel: {
        type: 'usr-formauth'
    },
    listeners: {
        afterRender: 'onAfterRender'
    },
    bodyPadding: 10,
    validation: 'valid',
    items: [{
            xtype: 'textfield',
            itemId: 'login',
            anchor: '100%',
            fieldLabel: 'Login',
            allowBlank: false,

            listeners: {
                // place le focus sur ce champ à l'ouverture du formulaire
                afterrender: function (field) {
                    field.focus(true);
                }
            }
        },
        {
            xtype: 'textfield',
            itemId: 'password',
            anchor: '100%',
            inputType: 'password',
            fieldLabel: 'Mot de passe',
            allowBlank: false
        }
    ],
    buttons: [{
            itemId: 'cancel',
            ui: 'cancel',
            iconCls: 'thot-icon-cancel',
            text: 'Annuler',
            handler: 'onCancelClick'
        },
        {
            itemId: 'valid',
            ui: 'succes',
            iconCls: 'thot-icon-validate',
            text: 'Valider',
            handler: 'onValidClick'
        }
    ]
});