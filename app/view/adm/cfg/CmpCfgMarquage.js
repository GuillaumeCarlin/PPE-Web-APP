/**
 * @author  Hervé Valot
 * @description Gestion du marquage automatique (MARKEM)
 * @description conteneur des options de configuration
 */
Ext.define('Thot.view.adm.cfg.CmpCfgMarquage', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.adm.cfg.cmpcfgmarquage',
    xtype: 'cmpcfgmarquage',

    requires: [
        'Thot.view.adm.cfg.CmpCfgMarquageController',
        'Thot.view.adm.cfg.CmpCfgMarquageModel',
        'Ext.form.field.Checkbox',
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Fill',
        'Ext.button.Button'
    ],

    controller: 'adm-cfg-cmpcfgmarquage',

    viewModel: {
        type: 'adm.cfg.cmpcfgmarquage'
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
        type: 'fit',
    },
    defaults: {
        labelWidth: 180
    },
    items: [{ // activer/désactiver la gestion du maquage CoLOS MARKEM
        xtype: 'checkboxfield',
        reference: 'enableMARKEM',
        itemId: 'COLOS_ACTIF', // ne pas modifier, correspond au code en base de données
        bind: {
            fieldLabel: '{options.activation.libelle}',
            boxLabel: '{options.activation.description}'
        },
        listeners: {
            change: 'enableApplyBtn'
        }
    }, { // note information dossier root CoLOS
        xtype: 'displayfield',
        // itemId: 'MARKEMRootFolder', // ne pas modifier, correspond au code en base de données
        bind: {
            fieldLabel: '{options.rootfolder.libelle}',
            value: '{options.rootfolder.description}',
            disabled: '{!enableMARKEM.checked}'
        },
        listeners: {
            change: 'enableApplyBtn'
        }
    }, { // Saisie du dossier root CoLOS
        xtype: 'textfield',
        itemId: 'MARKEMRootFolder', // ne pas modifier, correspond au code en base de données
        maxWidth: 400,
        hideLabel: true,
        margin: '0 0 0 185', // décallage par rapport au bord gauche pour alignement avec les checkboxes
        listeners: {
            change: 'enableApplyBtn'
        },
        bind: {
            disabled: '{!enableMARKEM.checked}'
        }
    }, {
        xtype: 'container',
        layout: 'hbox',
        items: [
            //     {
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
    }]
});