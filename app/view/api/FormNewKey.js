Ext.define('Thot.view.api.FormNewKey', {
    extend: 'Ext.panel.Panel',
    xtype: 'newkey',
    ui: 'thot-main',
    requires: [
        'Thot.view.api.FormNewKeyController'
    ],
    controller: 'api-formnewkey',
    listeners: {
        afterrender: 'onAfterRender'
    },
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    bodyPadding: 5,
    defaults: {
        width: 300,
        labelWidth: 100
    },
    items: [
        {
            xtype: 'container',
            itemId: 'ContainerCheck',
            layout: {
                type: 'hbox',
            },
            margin: '0 0 0 0',
            items: [
                { // activation/désactivation du contrôle status opérateur
                    xtype: 'checkboxfield',
                    itemId: 'checkGen',
                    reference: 'checkGen',
                    bind: {
                        fieldLabel: 'Générer clé',
                    },
                    listeners: {
                        change: 'ClickCheckBox'
                    },
                    value: true
                }, {
                    // activation/désactivation du contrôle status opérateur
                    xtype: 'checkboxfield',
                    itemId: 'CheckAPP',
                    reference: 'CheckAPP',
                    bind: {
                        fieldLabel: 'Application',
                    },
                    listeners: {
                        change: 'AppCheckBox'
                    },
                    value: false
                }
            ]
        },
        {
            xtype: 'combobox',
            itemId: 'RessourceList',
            fieldLabel: 'Ressource',
            valueField: 'RSC_ID',
            displayField: 'RSC_CODE',
            editable: false,
            store: {
                type: 'apiforms'
            }
        },

        {
            xtype: 'container',
            itemId: 'ContainerTextField',
            layout: {
                type: 'hbox',
            },
            items: [
                {
                    xtype: 'displayfield',
                    margin: '0 0 0 0',
                    bind: {
                        fieldLabel: 'Clé',
                    }
                },
                {
                    xtype: 'textfield',
                    itemId: 'Code',
                    emptyText: 'Saisissez un code ...',
                    allowBlank: false,
                    margin: '0 0 0 0',
                    align: 'left',
                    disabled: '{checkGen.checked}'
                }
            ]
        },
        {
            xtype: 'displayfield',
            itemId: 'ErrorField',
            margin: '0 0 0 0',
            bind: {
                fieldLabel: '',
            }
        },

        {
            xtype: 'container',
            itemId: 'ContainerButton',
            layout: {
                type: 'hbox',
            },
            margin: '20 0 0 350',
            items: [
                {
                    xtype: 'button',
                    itemId: 'cancel',
                    ui: 'cancel',
                    text: 'Annuler',
                    margin: '0 10 0 0',
                    tooltip: 'Annuler.',
                    iconCls: 'x-fa fa-times-circle fa-2x',
                    listeners: {
                        click: 'onCancelClick'
                    },
                    width: 100
                },
                {
                    xtype: 'button',
                    itemId: 'valid',
                    ui: 'succes',
                    text: 'OK',
                    tooltip: 'Valider la selection.',
                    iconCls: 'thot-icon-check-small',
                    listeners: {
                        click: 'validSelect'
                    },
                    width: 100
                }
            ]
        }

    ]
});