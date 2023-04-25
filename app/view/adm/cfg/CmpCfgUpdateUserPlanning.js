/**
 * @author  Hervé Valot
 * @description Gestion de la mise à jour des données opérateurs depuis le système RH (planning, congés, pointage, etc...) 
 * @description conteneur des options de configuration
 */
Ext.define('Thot.view.adm.cfg.CmpCfgUpdateUserPlanning', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.adm.cfg.cmpcfgupdateuserplanning',
    xtype: 'cmpcfgmarquage',

    requires: [
        'Thot.view.adm.cfg.CmpCfgUpdateUserPlanningController',
        'Thot.view.adm.cfg.CmpCfgUpdateUserPlanningModel',
        'Ext.form.field.Checkbox',
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Fill',
        'Ext.button.Button'
    ],

    controller: 'adm-cfg-cmpcfgupdateuserplanning',

    viewModel: {
        type: 'adm.cfg.cmpcfgupdateuserplanning'
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
            itemId: 'CRON_actif',
            reference: 'checkUsrStatus',
            bind: {
                fieldLabel: '{options.activation.libelle}',
                boxLabel: '{options.activation.description}'
            }
        },
        { // Intervalle de vérification - ne pas dissocier du champ numberfield suivant
            xtype: 'displayfield',
            bind: {
                fieldLabel: '{options.intervalle.libelle}',
                value: '{options.intervalle.description}',
                disabled: '{!checkUsrStatus.checked}'
            }
        },
        { // champ de saisie de l'intervalle de vérification
            xtype: 'numberfield',
            itemId: 'CRON_intervalle',
            allowDecimals: false,
            minValue: 1,
            maxValue: 1440,
            maxWidth: 100,
            hideLabel: true,
            bind: {
                disabled: '{!checkUsrStatus.checked}'
            },
            margin: '0 0 0 185' // décallage par rapport au bord gauche pour alignement avec les checkboxes
        },
        { // Planifiaction de la vérification - ne pas dissocier du champ numberfield suivant
            xtype: 'displayfield',
            bind: {
                fieldLabel: '{options.planning.libelle}',
                value: '{options.planning.description}',
                disabled: '{!checkUsrStatus.checked}'
            }
        },
        { // définition de la planification de la vérification (jours d'exécution)
            xtype: 'checkboxgroup',
            itemId: 'CRON_Planning', // ne pas modifier, correspond au code en base de données
            layout: 'hbox',
            width: 700,
            bind: {
                disabled: '{!checkUsrStatus.checked}'
            },
            margin: '0 0 0 185', // décallage par rapport au bord gauche pour alignement avec les checkboxes
            items: [{
                    xtype: 'checkboxfield',
                    boxLabel: 'Lun.'
                },
                {
                    xtype: 'checkboxfield',
                    boxLabel: 'Mar.'
                },
                {
                    xtype: 'checkboxfield',
                    boxLabel: 'Mer.'
                },
                {
                    xtype: 'checkboxfield',
                    boxLabel: 'Jeu.'
                },
                {
                    xtype: 'checkboxfield',
                    boxLabel: 'Ven.'
                },
                {
                    xtype: 'checkboxfield',
                    boxLabel: 'Sam.'
                },
                {
                    xtype: 'checkboxfield',
                    boxLabel: 'Dim.'
                }
            ]
        },
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