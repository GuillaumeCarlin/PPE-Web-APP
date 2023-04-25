/**
 * @author  Hervé Valot
 * @description formulaire de correction d'une activité Hors Production (Alea)
 * @date    20200410
 * @version 20200410    Hervé Valot création
 */
Ext.define('Thot.view.act.cor.FormRevisionHorsProd', {
    extend: 'Ext.form.Panel',
    xtype: 'frmrevisionhorsprod',
    itemId: 'frmrevisionhorsprod',
    requires: [
        'Thot.view.act.cor.FormRevisionHorsProdController',
        'Thot.view.act.cor.FormRevisionHorsProdModel',
        'Ext.form.FieldSet',
        'Ext.form.field.Display',
        'Ext.form.field.Spinner',
        'Ext.form.field.Time',
        'Ext.form.field.Date',
        'Ext.grid.Panel',
        'Ext.grid.column.Number',
        'Ext.grid.column.Date',
        'Ext.grid.column.Boolean',
        'Ext.view.Table',
        'Ext.form.field.TextArea',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button'
    ],

    controller: 'act-cor-formrevisionhorsprod',
    viewModel: {
        type: 'act-cor-formrevisionhorsprod'
    },
    scrollable: true,
    layout: 'form',
    listeners: {
        afterrender: 'onAfterRender'
    },
    fieldDefaults: {
        msgTarget: 'side'
    },
    items: [ // objets du formulaire
        { // champs cachés
            xtype: 'fieldcontainer',
            // items: [
            //     {
            //     xtype: "hidden",
            //     itemId: "usr_id_old",
            // }]
        },
        { // Atelier
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{ // section d'atelier, spécifique au mode création
                xtype: 'combobox',
                itemId: 'org_id',
                id: 'org_id',
                fieldLabel: 'Atelier',
                emptyText: 'Sélectionner un atelier',
                displayField: 'sab_libelle',
                width: 360,
                valueField: 'sab_id',
                store: {
                    type: 'section'
                },
                listeners: {
                    beforequery: function (record) {
                        // permet de faire une recherche du type *{}* au ieu de {}* par défaut
                        // The modifier g is more important, for a global search. i is only for case insensitive search.
                        record.query = new RegExp(record.query, 'ig');
                    },
                    select: 'onSectionSel'
                },
                queryMode: 'local'
            }]
        },
        { // opérateur
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{ // opérateur
                xtype: 'combobox',
                itemId: 'usr_id',
                id: 'usr_id',
                fieldLabel: 'Opérateur',
                emptyText: 'Sélectionner un opérateur',
                displayField: 'usr_displayname',
                width: 360,
                valueField: 'usr_id',
                allowBlank: false,
                store: {
                    type: 'sectionusers'
                },
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
                        var tpl = '<div>{usr_displayname}</div>';
                        return tpl;
                    }
                }
            }]
        },
        { // aléa (hors production)
            xtype: 'fieldcontainer',
            layout: 'column',
            items: [{ // aléa
                xtype: 'combobox',
                itemId: 'ald_id',
                id: 'ald_id',
                matchFieldWidth: false,
                fieldLabel: 'Hors production',
                width: 360,
                allowBlank: false,
                autoFitErrors: true,
                store: {
                    type: 'freealeaslist'
                },
                // listeners: {
                //     select: "onAleaSel"
                // },
                valueField: 'ald_id',
                displayField: 'ald_libelle'
            }]
        },
        { // date début
            xtype: 'fieldcontainer',
            itemId: 'fc_datedebut',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{ // début activité
                xtype: 'datetimefield',
                itemId: 'ala_date_debut',
                allowBlank: false,
                format: 'd/m/Y H:i:s',
                submitFormat: 'Ymd H:i:s',
                width: 360,
                todayText: 'Aujourd\'hui',
                hourText: 'Heure',
                minuteText: 'Minute',
                formatText: 'Format de date attendu : {0}',
                fieldLabel: 'Début',
                listeners: {
                    change: 'onDateChange'
                },
                startDateField: 'start_date',
                vtype: 'daterange',
                vfield: 'start_date'
            }]
        },
        { // date fin
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{ // fin activité
                    xtype: 'datetimefield',
                    itemId: 'ala_date_fin',
                    allowBlank: false,
                    format: 'd/m/Y H:i:s',
                    submitFormat: 'Ymd H:i:s',
                    width: 360,
                    todayText: 'Aujourd\'hui',
                    hourText: 'Heure',
                    minuteText: 'Minute',
                    formatText: 'Format de date attendu : {0}',
                    fieldLabel: 'Fin',
                    listeners: {
                        change: 'onDateChange'
                    },
                    endDateField: 'end_date',
                    vtype: 'daterange',
                    vfield: 'end_date'
                },
                { // durée calculée
                    xtype: 'displayfield',
                    itemId: 'duree',
                    id: 'duree',
                    fieldLabel: 'Durée',
                }
            ]
        },
        { // commentaire
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{ // motif correction
                xtype: 'textareafield',
                itemId: 'aec_commentaire',
                id: 'aec_commentaire',
                width: 360,
                fieldLabel: 'Motif',
                emptyText: 'Motif de la correction (optionnel)'
            }, { // Correction
                xtype: 'container',
                itemId: 'contCorrection',
                flex: 2,
                hidden: true, // par défaut, modifié par le controleur si présence de corrections
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{ // corrigé le
                        xtype: 'displayfield',
                        fieldLabel: 'Corrigé le',
                        // value: 'N/A',
                        itemId: 'aec_date',
                        renderer: Ext.util.Format.dateRenderer('d/m/Y H:i')
                    },
                    { // Produit
                        xtype: 'displayfield',
                        fieldLabel: 'Corrigé par',
                        value: 'N/A',
                        itemId: 'aecusr_nom'
                    },
                    { // Gamme
                        xtype: 'displayfield',
                        fieldLabel: 'Commentaire',
                        maxWidth: 355,
                        scrollable: 'vertical',
                        value: 'N/D',
                        itemId: 'aec_commentaire_pre'
                    },
                ]
            }]
        }
    ],
    buttons: [{
            itemId: 'cancel',
            ui: 'cancel',
            text: 'Annuler',
            margin: '0 10 0 0',
            tooltip: 'Annuler.',
            iconCls: 'x-fa fa-times-circle fa-2x',
            listeners: {
                click: 'onCancelClick'
            }
        },
        {
            itemId: 'valid',
            ui: 'succes',
            formBind: true,
            text: 'OK',
            tooltip: 'Valider la selection.',
            iconCls: 'thot-icon-check-small', //'x-fa fa-check-circle fa-2x',
            listeners: {
                click: 'onValidClick'
            }
        }
    ]

});