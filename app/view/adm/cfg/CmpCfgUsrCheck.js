/**
 * @author  Hervé Valot
 * @description Vérification de la cohérence opérateur
 * @description conteneur des options de configuration
 */
Ext.define('Thot.view.adm.cfg.CmpCfgUsrCheck', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.adm.cfg.cmpcfgusrcheck',
    xtype: 'cmpcfgusrcheck',

    requires: [
        'Thot.view.adm.cfg.CmpCfgUsrCheckController',
        'Thot.view.adm.cfg.CmpCfgUsrCheckModel',
        'Ext.form.field.Checkbox',
        'Ext.form.CheckboxGroup',
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Fill',
        'Ext.button.Button',
        'Ext.form.field.Number'
    ],

    controller: 'adm-cfg-cmpcfgusrcheck',

    viewModel: {
        type: 'adm.cfg.cmpcfgusrcheck'
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
        labelWidth: 180,
        listeners: {
            change: 'enableApplyBtn'
        }
    },
    items: [{ // activation/désactivation du contrôle status opérateur
            xtype: 'checkboxfield',
            itemId: 'CRON_checkUsrStatus',
            reference: 'checkUsrStatus',
            bind: {
                fieldLabel: '{options.checkUsrStatus.libelle}',
                boxLabel: '{options.checkUsrStatus.description}'
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
        { // champde saisie de l'intervalle de vérification
            xtype: 'numberfield',
            itemId: 'CRON_intervalle',
            allowDecimals: false,
            minValue: 1,
            maxValue: 60,
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
        { // ligne de séparation
            xtype: 'box',
            autoEl: {
                tag: 'hr'
            }
        },
        { // vérifier le pointage RH / planning de présence théorique 
            xtype: 'checkboxfield',
            itemId: 'CUS_pointagePlanning', // ne pas modifier, correspond au code en base de données
            bind: {
                fieldLabel: '{options.pointagePlanning.libelle}',
                boxLabel: '{options.pointagePlanning.description}',
                disabled: '{!checkUsrStatus.checked}'
            }
        },
        { // vérifier l'activité THOT / pointage RH
            xtype: 'checkboxfield',
            itemId: 'CUS_activitePointage', // ne pas modifier, correspond au code en base de données
            bind: {
                fieldLabel: '{options.activitePointage.libelle}',
                boxLabel: '{options.activitePointage.description}',
                disabled: '{!checkUsrStatus.checked}'
            }
        },
        { // vérifier l'activité THOT / planning de présence théorique
            xtype: 'checkboxfield',
            itemId: 'CUS_activitePlanning', // ne pas modifier, correspond au code en base de données
            bind: {
                fieldLabel: '{options.activitePlanning.libelle}',
                boxLabel: '{options.activitePlanning.description}',
                disabled: '{!checkUsrStatus.checked}'
            }
        }, {
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