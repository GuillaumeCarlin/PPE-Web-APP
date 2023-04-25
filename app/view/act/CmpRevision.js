/**
 * @author  Hervé VALOT
 * @description Composant - liste des activités pour correction, affiché dans le contexte historique
 */
Ext.define('Thot.view.act.CmpRevision', {
    extend: 'Ext.form.Panel',
    cls: 'thot-panel',
    xtype: 'actrevision',
    itemId: 'actrevision',
    requires: [
        'Thot.view.act.CmpRevisionController',
        'Thot.view.act.CmpRevisionModel',
        'Ext.grid.filters.Filters',
        'Ext.grid.column.Action',
    ],
    controller: 'act-cmprevision',
    viewModel: {
        type: 'act-cmprevision'
    },
    layout: {
        type: 'fit',
        align: 'stretch'
    },
    listeners: {
        afterRender: 'onAfterRender',
        gridRefresh: 'onGridRefresh',
        show: 'checkAuth',
        click: 'checkAuth'
    },
    flex: 1,
    items: [{
        xtype: 'gridpanel',
        itemId: 'activities',
        title: 'Historique',
        stateful: true,
        stateId: 'thot-grid-corrections',
        flex: 1,
        autoScroll: true,
        store: {
            type: 'enthisto'
        },
        plugins: 'gridfilters',
        features: [ // fonctions complémentaires de la grille
            {
                ftype: 'grouping',
                startCollapsed: false,
                hideGroupedHeader: false,
                groupHeaderTpl: '{columnName}: {name} ({rows.length} Activité{[values.rows.length > 1 ? "s" : ""]})'
            },
            {
                ftype: 'summary',
                dock: 'top'
            },
        ],
        filter: 'local',
        tbar: [ // barre d'outils principale
            { // initialiser les filtres de la grille
                xtype: 'button',
                itemId: 'btnClearGridFilter',
                iconCls: 'fa fa-filter',
                handler: 'onGridClearFilter',
                tooltip: 'Effacer les filtres'
            },
            { // afficher/masquer les objets supprimés
                xtype: 'button',
                itemId: 'btnShowSuppressed',
                iconCls: 'x-fa fa-trash',
                enableToggle: true,
                tooltip: 'Afficher/Masquer les élémets supprimés',
                toggleHandler: 'onGridRefresh'
            },
            { // menu, création nouvelles activités
                xtype: 'button',
                itemId: 'btnMenuCreateAct',
                iconCls: 'x-fa fa-plus',
                tooltip: 'Créer une activité',
                menu: ['<b class="menu-title"> Création activités</b>',
                    {
                        text: 'Réglage',
                        iconCls: 'x-fa fa-wrench',
                        handler: 'onCreateMenuOptionClick',
                        action: 'reglage'
                    }, {
                        text: 'Production',
                        iconCls: 'x-fa fa-gear',
                        handler: 'onCreateMenuOptionClick',
                        action: 'production'
                    }, {
                        text: 'Qualité',
                        iconCls: 'x-fa fa-recycle',
                        handler: 'onCreateMenuOptionClick',
                        action: 'qualite'
                    }, {
                        text: 'Non planifié',
                        iconCls: 'x-fa fa-unlink',
                        handler: 'onCreateMenuOptionClick',
                        action: 'nonplanifie'
                    }, {
                        text: 'Hors Production',
                        iconCls: 'x-fa fa-random',
                        handler: 'onCreateMenuOptionClick',
                        action: 'horsproduction'
                    }
                ]
            },
            { // sélection date de début des activités affichées
                xtype: 'datefield',
                itemId: 'dateDebutHisto',
                fieldLabel: 'Activité du',
                width: 250,
                format: 'd/m/Y',
                reference: 'start_date',
                bind: {
                    value: '{start_date}',
                    maxValue: '{end_date}',
                },
            },
            { // sélection date de fin des activités affichées
                xtype: 'datefield',
                itemId: 'dateFinHisto',
                fieldLabel: 'Au',
                width: 180,
                labelWidth: 30,
                margin: '0 10 0 10',
                format: 'd/m/Y',
                reference: 'end_date',
                bind: {
                    value: '{end_date}',
                    minValue: '{start_date}',
                },
            },
            { // initialiser les filtres de la grille
                xtype: 'button',
                itemId: 'btnRefreshGrid',
                iconCls: 'fa fa-refresh',
                handler: 'onGridRefresh',
                tooltip: 'Actualiser la grille'
            },
            '-',
            { // sélection de la date activité prise en référence
                xtype: 'fieldcontainer',
                itemId: 'dateRef',
                hidden: true,
                fieldLabel: 'Date de référence',
                labelWidth: 130,
                margin: '0 0 0 15',
                defaultType: 'radiofield',
                defaults: {
                    flex: 1
                },
                layout: 'hbox',
                items: [{
                        boxLabel: 'Début act.',
                        itemId: 'debutact',
                        name: 'dateRef',
                        inputValue: 'd',
                        listeners: {
                            change: 'onDateRefChange'
                        }
                    },
                    {
                        boxLabel: 'Fin act.',
                        itemId: 'finact',
                        name: 'dateRef',
                        inputValue: 'f',
                        checked: true,
                        margin: '0 0 0 15',
                        listeners: {
                            change: 'onDateRefChange'
                        }
                    }
                ]
            },
            '->',
            {
                xtype: 'buttongroup',
                frame: false,
                itemId: 'groupRecalcConsolidation',
                layout: 'hbox',
                items: [{ // sélection date de production à re-consolider
                        xtype: 'datefield',
                        itemId: 'dateExportRecalc',
                        format: 'd/m/Y',
                        startDay: 1,
                        // disabledDays: [0, 6], // désactivation des samedis et dimanches, pas d'activité ces jours là
                        minValue: '06/01/2020', // date de mise en production, aucune donnée calculabla avant
                        maxValue: new Date() // défini la date maximale sélectionnable
                    },
                    { // déclencher la consolidation de la date sélectionnées
                        xtype: 'button',
                        itemId: 'btnRecalcExport',
                        iconCls: 'x-fa fa-calculator',
                        tooltip: 'Relancer le calcul du rapport quotidien à la date définie',
                        handler: 'onBtnRecalcExport'
                    }
                ]
            }
        ],
        listeners: {
            itemdblclick: 'onRowDblClick'
        },
        viewConfig: { // définition de la mise en forme de la ligne de grille en fonction du statut modifié ou supprimé
            getRowClass: function (record, _rowIndex, _rowParams, _store) {
                var sCSS = '';
                sCSS = parseInt(record.get('estcorrigee')) == 1 ? 'thot-grid-modified-entity' : sCSS;
                sCSS = parseInt(record.get('estcorrigee')) == 2 ? 'thot-grid-added-entity' : sCSS;
                sCSS = parseInt(record.get('estsupprimee')) == 1 ? 'thot-grid-deleted-entity' : sCSS;
                return sCSS;
            },
            // conserver la position du scroll vertical à l'actualisation 
            preserveScrollOnRefresh: true
        },
        columns: [ //
            { // indicateur visuel, type entité
                dataIndex: 'oct_code',
                stateId: 'oct_code',
                menuDisabled: true,
                hideable: false,
                resizable: false,
                width: 32,
                renderer: function (_sValue, _oCell, oData) {
                    var sReturn = '',
                        sCodeIcon = '';

                    if (oData.get('alt_code') == 'REG') {
                        sCodeIcon = 'REG';
                    } else {
                        sCodeIcon = oData.get('oct_code');
                    }

                    sReturn +=
                        '<div class="thot-tag-cell thot-tag-cell-' +
                        sCodeIcon +
                        '"> </div>' +
                        '<div class="thot-icon-' +
                        sCodeIcon +
                        '-medium"></div>';
                    return sReturn;
                }
            },
            { // indicateur visuel, entité supprimée
                dataIndex: 'estsupprimee',
                stateId: 'estsupprimee',
                menuDisabled: false,
                hideable: false,
                resizable: false,
                width: 32,
                renderer: function (_sValue, _oCell, oData) {
                    // affichage de l'icône si activité supprimée
                    var sReturn = '';
                    if (parseInt(oData.get('estsupprimee')) != 0) {
                        sReturn = '<div data-qtip="Supprimée par ' +
                            oData.get('usr_prenom_supprime') +
                            ' ' +
                            oData.get('usr_nom_supprime') +
                            ' (' +
                            Ext.Date.explicitDate(oData.get('acs_date')) +
                            ')" class="thot-icon-deleted-medium"></div>';
                    }
                    return sReturn;
                },
                filter: {
                    type: 'boolean',
                    yesText: 'Supprimée',
                    noText: 'Non supprimées'
                }
            },
            { // indicateur visuel, entité corrigée
                dataIndex: 'estcorrigee',
                stateId: 'estcorrigee',
                menuDisabled: false,
                hideable: false,
                resizable: false,
                width: 32,
                renderer: function (_sValue, _oCell, oData) {
                    // affichage de l'icône si activité modifiée
                    var sReturn = '';
                    if (parseInt(oData.get('estcorrigee')) == 1) {
                        sReturn = '<div data-qtip="Corrigé par ' +
                            oData.get('usr_prenom_corrige') +
                            ' ' +
                            oData.get('usr_nom_corrige') +
                            ' (' + Ext.Date.explicitDate(oData.get('acr_date_corrige')) + ')' +
                            '<div> ' + oData.get('acr_commentaire_corrige') + '</div>' +
                            '" class="thot-icon-edited-medium"></div>';
                    }
                    if (parseInt(oData.get('estcorrigee')) == 2) {
                        sReturn = '<div data-qtip="Ajouté par ' +
                            oData.get('usr_prenom_corrige') +
                            ' ' +
                            oData.get('usr_nom_corrige') +
                            ' (' + Ext.Date.explicitDate(oData.get('acr_date_corrige')) + ')' +
                            '<div> ' + oData.get('acr_commentaire_corrige') + '</div>' +
                            '" class="thot-icon-added-medium"></div>';
                    }
                    return sReturn;
                },
                filter: {
                    type: 'boolean',
                    yesText: 'Corrigée',
                    noText: 'Non corrigée'
                }
            },
            { // OF
                dataIndex: 'odf_code',
                stateId: 'odf_code',
                text: 'OF',
                align: 'right',
                width: 70,
                filter: {
                    type: 'string'
                }
            },
            { // Opération
                dataIndex: 'opn_code',
                stateId: 'opn_code',
                text: 'Op',
                width: 70,
                filter: {
                    type: 'string'
                }
            },
            { // Atelier
                dataIndex: 'org_libelle',
                stateId: 'org_libelle',
                text: 'Atelier',
                width: 120,
                filter: {
                    type: 'string'
                }
            },
            { // poste ou service destinataire des activités non planifiées
                dataIndex: 'pst_libelle',
                stateId: 'pst_libelle',
                text: 'Poste',
                width: 390,
                filter: {
                    type: 'string'
                },
                renderer: function (_sValue, _oCell, oData) {
                    var sReturn = oData.get('pst_libelle');
                    if (parseInt(oData.get('oct_id')) !== 1) {
                        /* il s'agit d'une opération autre que production */
                        sReturn +=
                            '<div style="float:right; margin-right:10px" class="thot-tag thot-tag-' +
                            oData.get('oct_code') +
                            '">' +
                            oData.get('oct_libelle') +
                            '</div>'; //statusOn
                    }
                    if (oData.get('alt_code') == 'REG') {
                        /* il s'agit d'une opération de réglage */
                        sReturn +=
                            '<div style="float:right; margin-right:10px" class="thot-tag thot-tag-' +
                            oData.get('alt_code') +
                            '">' +
                            oData.get('alt_libelle') +
                            '</div>'; //statusOn
                    }
                    return sReturn;
                }
            },
            { // opérateur, pas de définition de width pour utiliser la largeur disponible
                dataIndex: 'usr_nom',
                stateId: 'usr_nom',
                text: 'Opérateur',
                flex: 1, // c'est cette colonne qui s'ajustera
                filter: {
                    type: 'string',
                    fields: ['usr_prenom', 'usr_nom']
                },
                renderer: function (_sValue, _oCell, oData) {
                    var sFullName = '';
                    sFullName =
                        oData.get('usr_prenom') +
                        ' ' +
                        oData.get('usr_nom');
                    return sFullName;
                }
            },
            { // équipement
                text: 'Equipement',
                sealedColumns: true,
                columns: [{
                        dataIndex: 'eqp_code_prevu',
                        stateId: 'eqp_code_prevu',
                        width: 100,
                        text: 'Prévu',
                        filter: {
                            type: 'string'
                        }
                    },
                    {
                        dataIndex: 'eqp_code_realise',
                        stateId: 'eqp_code_realise',
                        width: 100,
                        text: 'Utilisé',
                        filter: {
                            type: 'string'
                        },
                        renderer: function (sValue, _oCell, oData) {
                            var sReturn = sValue;
                            if (oData.get('eqp_code_realise') != oData.get('eqp_code_prevu')) {
                                sReturn =
                                    '<span class=\'thot-bold-label\'>' + sValue +
                                    '</span>'; //thot-bold-label
                            }
                            return sReturn;
                        }

                    }
                ]
            },
            { // dates de l'entité (début / fin)
                text: 'Activité',
                columns: [
                    // {
                    //     xtype: "datecolumn",
                    //     dataIndex: "tps_date",
                    //     stateId: "tps_date",
                    //     text: "Journée de ref.",
                    //     format: 'd/m/Y',
                    //     width: 150,
                    //     // filter: {
                    //     //     type: "string"
                    //     // },
                    //     tooltip: 'Journée de production de référence. De 05h00 à J+1 05h00'
                    // },
                    {
                        xtype: 'datecolumn',
                        dataIndex: 'ent_date_debut',
                        stateId: 'ent_date_debut',
                        text: 'Commencée à',
                        width: 150,
                        filter: {
                            type: 'date'
                        },
                        renderer: function (sValue, _oCell, _oData) {
                            var oDate = null;

                            if (typeof sValue == 'string') {
                                oDate = Ext.String.toDate(sValue);
                            } else {
                                oDate = sValue;
                            }

                            return Ext.Date.explicitDate(oDate);
                        }
                    },
                    {
                        xtype: 'datecolumn',
                        dataIndex: 'ent_date_fin',
                        stateId: 'ent_date_fin',
                        text: 'Terminée à',
                        width: 150,
                        filter: {
                            type: 'date'
                        },
                        renderer: function (sValue, _oCell, _oData) {
                            var oDate = null;

                            if (typeof sValue == 'string') {
                                oDate = Ext.String.toDate(sValue);
                            } else {
                                oDate = sValue;
                            }

                            return Ext.Date.explicitDate(oDate);
                        }
                    }
                ]
            },
            { // quantités de l'activité
                text: 'Quantités activité',
                columns: [{
                        dataIndex: 'qte_bon',
                        stateId: 'qte_bon',
                        align: 'right',
                        text: 'bon',
                        width: 60,
                        summaryType: 'sum'
                    },
                    {
                        dataIndex: 'qte_rbt',
                        stateId: 'qte_rbt',
                        text: 'rebut',
                        align: 'right',
                        width: 60,
                        renderer: function (sValue, _oCell, _oData) {
                            var sReturn = sValue;
                            if (parseInt(sValue) > 0) {
                                sReturn =
                                    '<span class=\'thot-bold-label\' style=\'font-weight: bold; color: red;\'>' + sValue +
                                    '</span>'; //thot-bold-label
                            }
                            return sReturn;
                        },
                        summaryType: 'sum'
                    }
                ]
            },
            { // quantités de l'opération (cumulées)
                text: 'Quantités opération',
                columns: [{
                        dataIndex: 'qte_bon_totopn',
                        stateId: 'qte_bon_totopn',
                        text: 'bon',
                        align: 'right',
                        width: 60
                    },
                    {
                        dataIndex: 'qte_rbt_totopn',
                        stateId: 'qte_rbt_totopn',
                        text: 'rebut',
                        align: 'right',
                        width: 60,
                        renderer: function (sValue, _oCell, _oData) {
                            var sReturn = sValue;
                            if (parseInt(sValue) > 0) {
                                sReturn =
                                    '<span class=\'thot-bold-label\' style=\'font-weight: bold; color: red;\'>' + sValue +
                                    '</span>'; //thot-bold-label
                            }
                            return sReturn;
                        }
                    }
                ]
            },
            { // temps GPAO
                text: 'Temps GPAO',
                columns: [{
                        dataIndex: 'opn_temps_reglage_j',
                        stateId: 'opn_temps_reglage_j',
                        text: 'réglage',
                        renderer: function (sValue, _oCell, _oData) {
                            var sReturn = '';
                            var fSec = 0;
                            var oTime;

                            if (sValue > 0) {
                                fSec =
                                    parseFloat(sValue) * 24 * 3600;
                                oTime = Ext.Date.millisecToTime(
                                    fSec * 1000
                                );
                                sReturn = oTime.time;
                            }

                            return sReturn;
                        },
                        width: 90
                    },
                    {
                        dataIndex: 'ope_temps_unitaire_j',
                        stateId: 'ope_temps_unitaire_j',
                        text: 'Unitaire',
                        renderer: function (sValue, _oCell, _oData) {
                            var sReturn = '';
                            var fSec = 0;
                            var oTime;

                            if (sValue > 0) {
                                fSec =
                                    parseFloat(sValue) * 24 * 3600;
                                oTime = Ext.Date.millisecToTime(
                                    fSec * 1000
                                );
                                sReturn = oTime.time;
                            }

                            return sReturn;
                        },
                        width: 90
                    }
                ]
            },
            { // outils
                /* colonne des outils */
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                width: 60,
                resizable: false,
                menuDisabled: true,
                sortable: false,
                hideable: false,
                // resizable: false,
                items: [{
                    /* éditer l'activité */
                    iconCls: 'x-fa thot-icon-edit',
                    tooltip: 'Editer l\'activité',
                    handler: 'onRowEditClick',
                    isDisabled: function (_grid, _rowIndex, _colIndex, _items, record) {
                        return (record.data.estsupprimee == 0 ? false : true);
                    }
                }, {
                    /* Supprimer/Restaurer l'activité */
                    // les icones et tooltip sont définis en fonction du statut de suppression
                    getTip: function (_value, _metadata, record, _row, _col, _store) {
                        return (parseInt(record.get('estsupprimee')) == 0 ? 'Supprimer' : 'Restaurer');
                    },
                    getClass: function (_value, _metadata, record, _row, _col, _store) {
                        return (parseInt(record.get('estsupprimee')) == 0 ? 'x-fa thot-icon-delete' : 'x-fa thot-icon-undelete');
                    },
                    handler: 'onEntityDeleteClick'
                }]
            }
        ]
    }]
});