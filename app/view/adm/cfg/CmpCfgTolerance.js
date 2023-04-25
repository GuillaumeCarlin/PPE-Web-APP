Ext.define('Thot.view.adm.cfg.CmpCfgTolerance', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.adm.cfg.cmpcfgtolerance',
    xtype: 'cmpcfgtolerance',

    requires: [
        'Thot.view.adm.cfg.CmpCfgToleranceController',
        'Thot.view.adm.cfg.CmpCfgToleranceModel',
        'Ext.form.field.Checkbox',
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Fill',
        'Ext.button.Button'
    ],

    controller: 'adm-cfg-cmpcfgtolerance',

    viewModel: {
        type: 'adm.cfg.cmpcfgtolerance'
        // le viewModel est utilisé pour définir les textes du formulaire
    },

   listeners: {
       show: 'onAfterRender',
       afterrender: 'onAfterRender'
   },

    bind: {
        title: '{fieldSetTitle}',
    },

    collapsible: false,

    layout: {
        type: 'fit'
    },

    defaults: {
        labelWidth: 180,
        listeners: {
            change: 'enableApplyBtn'
        }
    },
    items: [{ // activation/désactivation du contrôle status opérateur
            xtype: 'checkboxfield',
            itemId: 'symetrie',
            reference: 'checkSymetrieStatus',
            bind: {
                fieldLabel: '{options.activation.libelle}',
                boxLabel: '{options.activation.description}'
            }
        },

        // ----------------------------------------------------------------------------------
        { // Tolerance Symetrique 
            xtype: 'displayfield',
            bind: {
                fieldLabel: '{options.toleranceS.libelle}',
                value: '{options.toleranceS.description}',
                disabled: '{checkSymetrieStatus.checked}'
            }
        },
        { // Tolerance
            xtype: 'numberfield',
            itemId: 'toleranceS',
            allowDecimals: true,
            minValue: 0,
            forcePrecision: true,
            allowBlank: false,
            step: 0.1,
            maxValue: 24,
            maxWidth: 120,
            hideLabel: true,
            bind: {
                disabled: '{checkSymetrieStatus.checked}'
            },
            margin: '0 0 0 185' // décallage par rapport au bord gauche pour alignement avec les checkboxes
        },
        // ----------------------------------------------------------------------------------


        // ----------------------------------------------------------------------------------
        { // Tolerance Asymetrique Max
            xtype: 'displayfield',
            bind: {
                fieldLabel: '{options.toleranceAMax.libelle}',
                value: '{options.toleranceAMax.description}',
                disabled: '{!checkSymetrieStatus.checked}'
            }
        },
        { // Tolerance Max
            xtype: 'numberfield',
            itemId: 'toleranceAMax',
            allowDecimals: true,
            minValue: 0,
            forcePrecision: true,
            allowBlank: false,
            step: 0.1,
            maxValue: 24,
            maxWidth: 120,
            hideLabel: true,
            bind: {
                disabled: '{!checkSymetrieStatus.checked}'
            },
            margin: '0 0 0 185' // décallage par rapport au bord gauche pour alignement avec les checkboxes
        },
        // ----------------------------------------------------------------------------------


        // ----------------------------------------------------------------------------------
        { // Tolerance Asymetrique Min
            xtype: 'displayfield',
            bind: {
                fieldLabel: '{options.toleranceAMin.libelle}',
                value: '{options.toleranceAMin.description}',
                disabled: '{!checkSymetrieStatus.checked}'
            }
        },        
        { // Tolerance Max
            xtype: 'numberfield',
            itemId: 'toleranceAMin',
            allowDecimals: true,
            minValue: 0,
            forcePrecision: true,
            allowBlank: false,
            step: 0.1,
            maxValue: 24,
            maxWidth: 100,
            hideLabel: true,
            bind: {
                disabled: '{!checkSymetrieStatus.checked}'
            },
            margin: '0 0 0 185' // décallage par rapport au bord gauche pour alignement avec les checkboxes
        },
        // ----------------------------------------------------------------------------------

        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                // {
                //     xtype: 'tbspacer',
                //     flex: 1
                // },
                {
                    xtype: 'button',
                    text: 'Appliquer',
                    ui: 'succes',
                    itemId: 'btnApply',
                    listeners: {
                        click: 'onApplyClick'
                    }
                }
            ]
        }
    ]
});