/**
 * @author  Hervé Valot
 * @description formulaire de correction d'une activité de production
 * @date    20200409
 * @version 20200409    Hervé Valot révision complète
 */
Ext.define("Thot.view.act.cor.FormRevisionQualite", {
    extend: "Ext.form.Panel",
    xtype: "frmrevisionqualite",
    itemId: "frmrevisionqualite",
    requires: [
        "Thot.view.act.cor.FormRevisionQualiteController",
        "Thot.view.act.cor.FormRevisionQualiteModel",
        "Ext.form.FieldSet",
        "Ext.form.field.Display",
        "Ext.form.field.Spinner",
        "Ext.form.field.Time",
        "Ext.form.field.Date",
        "Ext.grid.Panel",
        "Ext.grid.column.Number",
        "Ext.grid.column.Date",
        "Ext.grid.column.Boolean",
        "Ext.view.Table",
        "Ext.form.field.TextArea",
        "Ext.toolbar.Toolbar",
        "Ext.button.Button",
    ],

    controller: "act-cor-formrevisionqualite",
    viewModel: {
        type: "act-cor-formrevisionqualite",
    },
    scrollable: true,
    layout: "form",
    listeners: {
        // beforerender: 'onBeforeRender',
        afterrender: "onAfterRender",
    },
    fieldDefaults: {
        msgTarget: "side",
    },
    items: [ // objets du formulaire
        { // champs cachés
            xtype: "fieldcontainer",
            items: [
                // {
                //     xtype: "hidden",
                //     itemId: "usr_id",
                // },
                {
                    xtype: "hidden",
                    itemId: "odf_id",
                    name: "odf_id",
                    id: "odf_id"
                }
            ],
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
            xtype: "fieldcontainer",
            layout: {
                type: "hbox",
                align: "stretch",
            },
            items: [{
                // opérateur
                xtype: "combobox",
                // name: 'usr_id',
                itemId: "usr_id",
                id: 'usr_id',
                fieldLabel: "Opérateur",
                emptyText: "Sélectionner un opérateur",
                displayField: "usr_displayname",
                width: 360,
                valueField: 'usr_id',
                allowBlank: false,
                // matchFieldWidth: false
                store: {
                    type: "sectionusers",
                },
                listeners: {
                    beforequery: function (record) {
                        // permet de faire une recherche du type *{}* au ieu de {}* par défaut
                        // The modifier g is more important, for a global search. i is only for case insensitive search.
                        record.query = new RegExp(record.query, "ig");
                    },
                },
                queryMode: "local",
                listConfig: {
                    getInnerTpl: function () {
                        // here you place the images in your combo
                        var tpl = "<div>{usr_displayname}</div>";
                        return tpl;
                    },
                },
            }, ],
        },
        { // données de l'OF / Gamme / Produit
            xtype: "fieldcontainer",
            layout: "column",
            items: [{
                    // numéro OF
                    xtype: "textfield",
                    itemId: "odf_code",
                    name: 'odf_code',
                    submitValue: false,
                    fieldLabel: "OF",
                    width: 180,
                    allowBlank: false,
                    listeners: {
                        blur: "onOfBlur",
                    },
                },
                {
                    // déclenche l'actualisation des données de l'OF
                    xtype: "button",
                    ui: "default-toolbar-small",
                    iconCls: "x-fa fa-check",
                    handler: "onUpdateOFDataClick",
                    tooltip: 'Vérifier la validité de l\'OF'
                },
                {
                    xtype: "container",
                    flex: 2,
                    margin: "0 0 0 148",
                    layout: {
                        type: "vbox",
                        align: "stretch",
                    },
                    items: [{
                            // quantité lancée
                            xtype: "displayfield",
                            fieldLabel: "Qté. lançée",
                            value: "N/A",
                            itemId: "odf_quantite_lancee",
                        },
                        {
                            // Produit
                            xtype: "displayfield",
                            fieldLabel: "Produit",
                            value: "N/A",
                            itemId: "pdt_libelle",
                        },
                        {
                            // Gamme
                            xtype: "displayfield",
                            fieldLabel: "Gamme",
                            value: "N/A",
                            itemId: "gam_code",
                        },
                        // {
                        //     // DEV: hvt 2020-04-09 11:27:27 il s'agit d'un test d'utilisation des tâches programmées ExtJS
                        //     html: '<div>H</div>',
                        //     itemId: 'time',
                        //     id: 'time'
                        // }
                    ],
                },
            ],
        },
        { // opération
            xtype: "fieldcontainer",
            layout: "column",
            items: [{
                    // opération
                    xtype: "combobox",
                    itemId: "opc_id",
                    name: 'opc_id',
                    id: 'opc_id',
                    matchFieldWidth: false,
                    fieldLabel: "Op. qualité",
                    width: 360,
                    allowBlank: false,
                    autoFitErrors: true,
                    store: {
                        type: "opcomplist",
                    },
                    valueField: "opc_id",
                    displayField: "opc_libelle",
                    emptyText: "Sélectionner une opération"
                },
                {
                    xtype: "container",
                    flex: 2,
                    layout: {
                        type: "vbox",
                        align: "stretch",
                    },
                    items: [
                        // { // équipement
                        // xtype: 'displayfield',
                        // fieldLabel: 'Equipement',
                        // itemId: 'eqppln_rsc_code',
                        // autoEl: { // ajout de'un tooltip au champ de formulaire
                        //     tag: 'div',
                        //     'data-qtip': 'Equipement planifié pour la réalisation de l\'opération sélectionnée {opn_libelle}'
                        // }
                        // }
                    ],
                },
            ],
        },
        { // équipement
            xtype: "fieldcontainer",
            layout: "column",
            items: [{
                    // équipement
                    xtype: "combobox",
                    itemId: "eqp_id",
                    name: "eqp_id",
                    id: "eqp_id",
                    emptyText: "Sélectionner un équipement",
                    allowBlank: false,
                    width: 360,
                    fieldLabel: "Equipement",
                    valueField: "rsc_id",
                    displayField: "rsc_code",
                    listeners: {
                        select: "onEqpSel",
                    },
                    store: {
                        type: "workstn",
                    },
                    listConfig: {
                        itemTpl: [
                            '<span style="font-weight: bold; text-transform:uppercase;">{rsc_code}</span> <span>{rsc_libelle}</span>'
                        ],
                    },
                },
                {
                    xtype: "container",
                    flex: 2,
                    layout: {
                        type: "vbox",
                        align: "stretch",
                    },
                    items: [{
                        // équipement utilisé, libellé
                        xtype: "displayfield",
                        fieldLabel: "Libellé",
                        itemId: "eqp_code",
                        autoEl: {
                            // ajout de'un tooltip au champ de formulaire
                            tag: "div",
                            "data-qtip": "Equipement utilisé pour la réalisation de l'opération sélectionnée",
                        },
                    }, ],
                },
            ],
        },
        { // date début
            xtype: "fieldcontainer",
            layout: {
                type: "hbox",
                align: "stretch",
            },
            items: [{
                // début activité
                xtype: "datetimefield",
                itemId: "act_date_debut",
                allowBlank: false,
                format: 'd/m/Y H:i:s',
                submitFormat: 'Ymd H:i:s',
                width: 360,
                todayText: "Aujourd'hui",
                hourText: "Heure",
                minuteText: "Minute",
                formatText: "Format de date attendu : {0}",
                fieldLabel: "Début",
                listeners: {
                    change: "onDateChange",
                },
                emptyText: 'Saisir la date et l\'heure de début',
                // propriétés nécessaires pour la vérification de chronologie de dates
                // si date début / date fin
                // les deux informations doivent être présentes sinon il y a une erreur au traitement de la validité
                startDateField: 'start_date',
                vtype: 'daterange',
                vfield: 'start_date'
            }, ],
        },
        { // date fin
            xtype: "fieldcontainer",
            layout: {
                type: "hbox",
                align: "stretch",
            },
            items: [{
                    // fin activité
                    xtype: "datetimefield",
                    itemId: "act_date_fin",
                    allowBlank: false,
                    format: "d/m/Y H:i:s",
                    submitFormat: 'Ymd H:i:s',
                    width: 360,
                    todayText: "Aujourd'hui",
                    hourText: "Heure",
                    minuteText: "Minute",
                    formatText: "Format de date attendu : {0}",
                    fieldLabel: "Fin",
                    listeners: {
                        change: "onDateChange",
                    },
                    emptyText: 'Saisir la date et l\'heure de fin',
                    // propriétés nécessaires pour la vérification de chronologie de dates
                    // voir date_debut plus haut
                    endDateField: 'end_date',
                    vtype: 'daterange',
                    vfield: 'end_date'
                },
                {
                    // durée calculée
                    xtype: "displayfield",
                    itemId: "duree",
                    id: "duree",
                    fieldLabel: "Durée",
                },
            ],
        },
        { // quantités
            xtype: "fieldcontainer",
            layout: {
                type: "hbox",
                align: "stretch",
            },
            items: [{
                    xtype: "displayfield",
                    fieldLabel: "Quantités",
                },
                { // grille des quantités en mode correction
                    xtype: "gridpanel",
                    hideHeaders: true,
                    width: 255,
                    // bodyBorder: true,
                    ui: "thot-panel-border",
                    itemId: "quantityGrd",
                    store: {
                        type: "actqty",
                    },
                    plugins: {
                        ptype: "cellediting",
                        clicksToEdit: 1,
                    },
                    features: [{
                        ftype: "summary",
                        dock: "bottom",
                    }, ],
                    columns: [{
                            xtype: "gridcolumn",
                            menuDisabled: true,
                            dataIndex: "qtp_libelle",
                        },
                        {
                            xtype: "numbercolumn",
                            menuDisabled: true,
                            dataIndex: "qte_valeur",
                            flex: 1,
                            align: "right",
                            format: "0",
                            editor: {
                                field: {
                                    xtype: "numberfield",
                                },
                            },
                            summaryType: "sum",
                            summaryRenderer: function (
                                value,
                                summaryData,
                                dataIndex
                            ) {
                                return Ext.String.format("Total {0}", value);
                            },
                        },
                    ],
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
                }
            ],
        },
        { // commentaire
            xtype: "fieldcontainer",
            layout: {
                type: "hbox",
                align: "stretch",
            },
            items: [{
                    // motif correction
                    xtype: "textareafield",
                    itemId: "acr_commentaire",
                    id: "acr_commentaire",
                    width: 360,
                    fieldLabel: "Motif",
                    emptyText: "Motif de la correction (optionnel)",
                },
                {
                    // Correction
                    xtype: "container",
                    itemId: "contCorrection",
                    flex: 2,
                    hidden: true, // par défaut, modifié par le controleur si présence de corrections
                    layout: {
                        type: "vbox",
                        align: "stretch",
                    },
                    items: [{
                            // corrigé le
                            xtype: "displayfield",
                            fieldLabel: "Corrigé le",
                            // value: 'N/A',
                            itemId: "acr_date",
                            renderer: Ext.util.Format.dateRenderer('d/m/Y H:i')
                        },
                        {
                            // Par
                            xtype: "displayfield",
                            fieldLabel: "Corrigé par",
                            value: "N/A",
                            itemId: "acrusr_nom",
                        },
                        {
                            // Comme,ntaire
                            xtype: "displayfield",
                            fieldLabel: "Commentaire",
                            maxWidth: 355,
                            scrollable: "vertical",
                            value: "N/D",
                            itemId: "acr_commentaire_pre",
                        },
                    ],
                },
            ],
        },
    ],
    buttons: [{
            itemId: "cancel",
            ui: "cancel",
            text: "Annuler",
            margin: "0 10 0 0",
            tooltip: "Annuler.",
            iconCls: "x-fa fa-times-circle fa-2x",
            listeners: {
                click: "onCancelClick",
            },
        },
        {
            itemId: "valid",
            ui: "succes",
            formBind: true,
            text: "OK",
            tooltip: "Valider la selection.",
            iconCls: "thot-icon-check-small", //'x-fa fa-check-circle fa-2x',
            listeners: {
                click: "onValidClick",
            },
        },
    ],
});