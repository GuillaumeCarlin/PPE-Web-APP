/**
 * @author  Hervé Valot
 * @description formulaire de correction d'une activité Non plaifiée
 * @date    20200410
 * @version 20200410    Hervé Valot création
 */
Ext.define("Thot.view.act.cor.FormRevisionNonPlanifie", {
    extend: "Ext.form.Panel",
    xtype: "frmrevisionnonplanifie",
    itemId: "frmrevisionnonplanifie",
    requires: [
        "Thot.view.act.cor.FormRevisionNonPlanifieController",
        "Thot.view.act.cor.FormRevisionNonPlanifieModel",
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

    controller: "act-cor-formrevisionnonplanifie",
    viewModel: {
        type: "act-cor-formrevisionnonplanifie"
    },
    scrollable: true,
    layout: 'form',
    listeners: {
        afterrender: "onAfterRender"
    },
    fieldDefaults: {
        msgTarget: 'side'
    },
    items: [ // objets du formulaire
        { // champs cachés
            xtype: 'fieldcontainer',
            items: [{ // identifiant de l'activité corrigée
                xtype: "hidden",
                itemId: "act_id",
                id: "act_id"
            }, { // identifiant de l'of (ici on ne peut pas le modifier, il faut donc conserver son id en masqué)
                xtype: "hidden",
                itemId: "odf_id",
                id: "odf_id"
            }]
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
        { // équipement
            xtype: 'fieldcontainer',
            layout: 'column',
            items: [{ // équipement
                xtype: "combobox",
                itemId: "eqp_id",
                id: "eqp_id",
                emptyText: 'Sélectionner un équipement',
                allowBlank: false,
                width: 360,
                fieldLabel: "Equipement",
                valueField: "rsc_id",
                displayField: "rsc_code",
                store: {
                    type: "workstn"
                },
                listConfig: {
                    itemTpl: [
                        '<span style="font-weight: bold; text-transform:uppercase;">{rsc_code}</span> <span>{rsc_libelle}</span>'
                    ]
                },
                listeners: {
                    select: "onEqpmtSel"
                }
            }, {
                xtype: 'container',
                flex: 2,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{ // équipement utilisé, libellé
                    xtype: 'displayfield',
                    fieldLabel: 'Libellé',
                    itemId: 'eqp_code',
                    autoEl: { // ajout de'un tooltip au champ de formulaire
                        tag: 'div',
                        'data-qtip': 'Equipement utilisé pour la réalisation de l\'opération sélectionnée'
                    }
                }]
            }]
        },
        { // opération
            xtype: 'fieldcontainer',
            layout: 'column',
            items: [{ // opération
                xtype: "combobox",
                itemId: "opc_id",
                id: "opc_id",
                fieldLabel: "Poste",
                width: 360,
                allowBlank: false,
                autoFitErrors: true,
                store: {
                    type: "opcomplist"
                },
                valueField: "opc_id",
                displayField: "opc_libelle"
            }, ]
        },
        { // date début
            xtype: 'fieldcontainer',
            itemId: 'fc_datedebut',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{ // début activité
                xtype: "datetimefield",
                itemId: "act_date_debut",
                allowBlank: false,
                format: "d/m/Y H:i:s",
                submitFormat: "Ymd H:i:s",
                width: 360,
                todayText: "Aujourd'hui",
                hourText: "Heure",
                minuteText: "Minute",
                formatText: "Format de date attendu : {0}",
                fieldLabel: "Début",
                listeners: {
                    change: "onDateChange"
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
                    xtype: "datetimefield",
                    itemId: "act_date_fin",
                    allowBlank: false,
                    format: "d/m/Y H:i:s",
                    submitFormat: "Ymd H:i:s",
                    width: 360,
                    todayText: "Aujourd'hui",
                    hourText: "Heure",
                    minuteText: "Minute",
                    formatText: "Format de date attendu : {0}",
                    fieldLabel: "Fin",
                    listeners: {
                        change: "onDateChange"
                    },
                    endDateField: 'end_date',
                    vtype: 'daterange',
                    vfield: 'end_date'
                },
                { // durée calculée
                    xtype: "displayfield",
                    itemId: "duree",
                    id: 'duree',
                    fieldLabel: "Durée",
                }
            ]
        },
        { // quantités
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                    xtype: 'displayfield',
                    fieldLabel: 'Quantités'
                },
                { // grille des quantités en mode correction
                    xtype: 'gridpanel',
                    hideHeaders: true,
                    width: 255,
                    // bodyBorder: true,
                    ui: 'thot-panel-border',
                    itemId: "quantityGrd",
                    store: {
                        type: "actqty"
                    },
                    plugins: {
                        ptype: "cellediting",
                        clicksToEdit: 1
                    },
                    features: [{
                        ftype: 'summary',
                        dock: 'bottom'
                    }],
                    columns: [{
                            xtype: 'gridcolumn',
                            menuDisabled: true,
                            dataIndex: "qtp_libelle"
                        },
                        {
                            xtype: "numbercolumn",
                            menuDisabled: true,
                            dataIndex: "qte_valeur",
                            flex: 1,
                            align: 'right',
                            format: '0',
                            editor: {
                                field: {
                                    xtype: "numberfield"
                                }
                            },
                            summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return Ext.String.format('Total {0}', value);
                            }
                        }
                    ]
                },
                { // grille des quantités en mode création
                    xtype: 'gridpanel',
                    hideHeaders: true,
                    width: 255,
                    // bodyBorder: true,
                    ui: 'thot-panel-border',
                    itemId: "quantityGrdCreate",
                    store: {
                        type: "quantitytype" //affichage grille vide
                    },
                    plugins: {
                        ptype: "cellediting",
                        clicksToEdit: 1
                    },
                    features: [{
                        ftype: 'summary',
                        dock: 'bottom'
                    }],
                    columns: [{
                            xtype: 'gridcolumn',
                            menuDisabled: true,
                            dataIndex: "qtp_libelle"
                        },
                        {
                            xtype: "numbercolumn",
                            menuDisabled: true,
                            dataIndex: 'qty',
                            flex: 1,
                            align: 'right',
                            format: '0',
                            editor: {
                                xtype: 'numberfield',
                                minValue: 0,
                                allowDecimals: false,
                                autoStripChars: true,
                                baseChars: '0123456789',
                                negativeText: 'Valeur positive uniquement'
                            },
                            summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return Ext.String.format('Total {0}', value);
                            }
                        }
                    ]
                },
                { // NPTR calculé
                    xtype: 'displayfield',
                    itemId: 'nptr',
                    fieldLabel: 'NPTR',
                    hidden: true,
                    autoEl: { // ajout de'un tooltip au champ de formulaire
                        tag: 'div',
                        'data-qtip': '<b>NPTR</b></br>Nombre de Pièces Théoriquement Réalisables</br>Calculé par division de la durée de l\'activité par le temps gamme unitaire théorique.'
                    }

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
                itemId: "acr_commentaire",
                id: "acr_commentaire",
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
                        itemId: "acr_date",
                        renderer: Ext.util.Format.dateRenderer('d/m/Y H:i')
                    },
                    { // Produit
                        xtype: 'displayfield',
                        fieldLabel: 'Corrigé par',
                        value: 'N/A',
                        itemId: "acrusr_nom"
                    },
                    { // Gamme
                        xtype: 'displayfield',
                        fieldLabel: 'Commentaire',
                        maxWidth: 355,
                        scrollable: 'vertical',
                        value: 'N/D',
                        itemId: "acr_commentaire_pre"
                    },
                ]
            }]
        }
    ],
    buttons: [{
            itemId: "cancel",
            ui: "cancel",
            text: "Annuler",
            margin: "0 10 0 0",
            tooltip: "Annuler.",
            iconCls: "x-fa fa-times-circle fa-2x",
            listeners: {
                click: "onCancelClick"
            }
        },
        {
            itemId: "valid",
            ui: "succes",
            formBind: true,
            text: "OK",
            tooltip: "Valider la selection.",
            iconCls: "thot-icon-check-small", //'x-fa fa-check-circle fa-2x',
            listeners: {
                click: "onValidClick"
            }
        }
    ]

});