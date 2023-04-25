Ext.define('Thot.view.main.List', {
    extend: 'Ext.form.Panel',
    xtype: 'mainlist',
    ui: 'thot-main',
    itemId: 'mainlist',
    requires: [
        'Thot.store.sct.SocieteS',
        'Thot.view.main.ListController'
    ],
    controller: 'list',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    listeners: {
        gridrefresh: 'onGridsRefresh'
    },
    hideTitle: true,
    items: [
        // {
        //     // xtype: 'currentact',
        //     xtype: 'containeractusr',
        //     itemId: 'currentactivities',
        //     flex: 1,
        //     minHeight: 300,
        //     collapsible: true,
        //     titleCollapse: true
        // },
        {
            xtype: 'gridpanel',
            itemId: 'grdAlerts',
            stateId: 'grdAlerts',
            stateful: true,
            cls: 'thot-panel',

            // ui: 'thot-panel',
            flex: 1,
            // collapsible: true,
            // titleCollapse: true,
            minHeight: 300,
            title: Thot.Labels.labels.alerts.title,
            stripedRows: true,
            store: {
                type: 'alerts'
            },
            listeners: {
                itemClick: 'onAlertClick'
            },
            plugins: 'gridfilters',
            features: [{
                    ftype: 'grouping',
                    startCollapsed: false,
                    hideGroupedHeader: true,
                    /* cacher la colonne du regroupement */
                    groupHeaderTpl: '{name} ({rows.length} Alerte{[values.rows.length > 1 ? "s" : ""]})'
                },
                {
                    /**
                     * ajoute la possibilité d'afficher du contenu sur toute la largeur de la grille
                     * en dessous de la ligne (ou au dessus, bodyBefore: true)
                     */
                    ftype: 'rowbody',
                    bodyBefore: false, // affiché en dessous de la ligne
                    getAdditionalData: function (data, idx, record, orig) {
                        var oHeaderCtn = this.view.headerCt;
                        var iColspan = oHeaderCtn.getColumnCount();

                        return {
                            rowBody: Ext.String.format('<p class="thot-message-preview">{0}</p>', data.alr_libelle),
                            rowBodyCls: this.rowBodyCls,
                            rowBodyColspan: iColspan
                        };
                    }
                }
            ],
            columns: [{
                    header: Thot.Labels.labels.alertobject.text,
                    dataIndex: 'rgl_libelle',
                    stateId: 'rgl_libelle',
                    width: 250,
                    tooltip: Thot.Labels.labels.alertobject.tooltip,
                    filter: {
                        // required configs
                        type: "list",
                        itemDefaults: {
                            // any Ext.form.field.Text configs accepted
                        }
                    }
                },
                { // journée de production ( de 5h00 jour J à 5h00 jour J+1)
                    header: Thot.Labels.labels.workday.shorttext,
                    xtype: 'datecolumn',
                    format: 'd/m/Y',
                    dataIndex: 'act_dateprod',
                    stateId: 'act_dateprod',
                    tooltip: Thot.Labels.labels.workday.tooltip
                },
                { // déclenchement de l'alerte (date/heure)
                    header: Thot.Labels.labels.alertdate.text,
                    xtype: 'datecolumn',
                    dataIndex: 'alr_date_debut',
                    stateId: 'alr_date_debut',
                    tooltip: Thot.Labels.labels.alertdate.tooltip,
                    renderer: function (sValue, oCell, oData) {
                        var sReturn = "";
                        sReturn +=
                            "<div >" + Ext.Date.explicitDate(sValue) + "</div>";
                        return sReturn;
                    },
                    filter: {
                        // required configs
                        type: "date",
                        itemDefaults: {
                            // any Ext.form.field.Text configs accepted
                        }
                    }
                },
                {
                    header: Thot.Labels.labels.equipement.text,
                    dataIndex: 'eqpact_code',
                    stateId: 'eqpact_code',
                    width: 250,
                    tooltip: Thot.Labels.labels.equipement.tooltip,
                    renderer: function (sValue, oCell, oData) {
                        var sReturn = "";
                        sReturn += "<div class='thot-bold-label'>" + sValue + "</div>"; //thot-bold-label
                        sReturn += "<div >" + oData.get('eqpact_libelle') + "</div>"; //thot-bold-label

                        return sReturn;
                    },
                    filter: {
                        // required configs
                        type: "string",
                        itemDefaults: {
                            // any Ext.form.field.Text configs accepted
                        }
                    }
                },
                {
                    header: Thot.Labels.labels.user.text,
                    dataIndex: 'usract_nom',
                    stateId: 'usract_nom',
                    width: 200,
                    tooltip: Thot.Labels.labels.user.tooltip,
                    renderer: function (sValue, oCell, oData) {
                        var sReturn = "";

                        sReturn = '<div class="thot-card-user"> <div class="img" style="background-image: url(\'resources/images/' + oData.get('rsc_image') + '\')"></div>';
                        sReturn += '<div class="content thot-bold-label">' + oData.get('usract_prenom') + ' ' + oData.get('usract_nom') + '</div></div>';
                        return sReturn;
                    },
                    filter: {
                        // required configs
                        type: "string",
                        itemDefaults: {
                            // any Ext.form.field.Text configs accepted
                        }
                    }

                },
                {
                    header: Thot.Labels.labels.workshop.text,
                    dataIndex: 'sab_libelle',
                    stateId: 'sab_libelle',
                    width: 200,
                    tooltip: Thot.Labels.labels.workshop.tooltip,
                    filter: {
                        // required configs
                        type: "string",
                        itemDefaults: {
                            // any Ext.form.field.Text configs accepted
                        }
                    }


                },
                {
                    header: Thot.Labels.labels.workorder.text,
                    dataIndex: 'odf_code',
                    StateId: 'odf_code',
                    width: 150,
                    tooltip: Thot.Labels.labels.workorder.tooltip,
                    renderer: function (sValue, oCell, oData) {
                        var sReturn = "";
                        sReturn = "<div class='thot-bold-label'>" + oData.get('odf_code') + "</div>";
                        return sReturn;
                    },
                    filter: {
                        // required configs
                        type: "string",
                        itemDefaults: {
                            // any Ext.form.field.Text configs accepted
                        }
                    }


                },
                {
                    header: Thot.Labels.labels.operation.text,
                    dataIndex: 'opn_code',
                    StateId: 'opn_code',
                    width: 400,
                    tooltip: Thot.Labels.labels.operation.tooltip,
                    renderer: function (sValue, oCell, oData) {
                        var sReturn = "";
                        sReturn = "<div class='thot-bold-label'>" + oData.get('opn_code') + " - " + oData.get('pst_libelle') + "</div>";
                        return sReturn;
                    }
                },
                { // Colonne produit
                    header: Thot.Labels.labels.product.text,
                    dataIndex: "pdt_code",
                    minWidth: 300,
                    flex: 1,
                    tooltip: Thot.Labels.labels.product.tooltip,
                    filter: {
                        // required configs
                        type: "string",
                        itemDefaults: {
                            // any Ext.form.field.Text configs accepted
                        }
                    },
                    renderer: function (sValue, oCell, oData) {
                        var sReturn = "";
                        if (oData.get("pdt_code") !== "") {
                            sReturn =
                                "<div class='thot-bold-label'>" +
                                oData.get("pdt_libelle") +
                                "</div>";
                            sReturn +=
                                "<div class='thot-bold-label'>" +
                                oData.get("pdt_complement") +
                                " - " +
                                oData.get("nce_libelle") +
                                "</div>";
                            sReturn +=
                                // NOTE: 2021-02-22 10:16:01 remplacé l'icône par du texte, demande de PBD
                                // "<div><a class='thot-icon-hashtag'> </a>" +
                                "<div><a>" + Thot.Labels.labels.product.identifiant + " :</a>" +
                                oData.get("pdt_code") +
                                "</div>";
                        }
                        return sReturn;
                    }
                }
            ]
        }
    ]
});