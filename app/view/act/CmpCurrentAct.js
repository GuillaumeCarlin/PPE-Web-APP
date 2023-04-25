/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/

/*
 * Copyright (c) 2019 PQR-Informatique
 *
 * @Script: CmpCurrentAct.js
 * @Author: Hervé Valot
 * @Email: hvalot@pqr-informatique.fr
 * @Créé le: 2019-07-23 11:00:56
 * @Modifié par: Hervé Valot
 * @Modifié le: yyyy-08-dd 15:36:15
 * @Description: Composant d'affichage des activités en cours
 */

Ext.define('Thot.view.act.CmpCurrentAct', {
    extend: 'Ext.form.Panel',
    xtype: 'currentact',
    // ui: 'thot-main',
    cls: 'thot-panel',
    // cls: 'x-panel-thot-panel-noborder',
    requires: [
        'Thot.view.act.CmpCurrentActController',
        'Thot.view.act.CmpCurrentActModel',
        'Thot.store.act.UserActS',
        'Thot.store.act.ActivitieS'
    ],

    controller: 'act-cmpcurrentact',
    viewModel: {
        type: 'act-cmpcurrentact'
    },
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    listeners: {
        afterrender: 'onAfterRender',
        gridRefresh: 'onGridRefresh'
    },
    title: 'Activités en cours',
    // DEV: HVT 2019-12-19 20:25:13 test ajout combo dans la barre de titre
    // tools: [{
    //     xtype: 'tagfield',
    //     valueField: 'id',
    //     displayField: 'code',
    //     filterPickList: true,
    //     maxWidth: 250,
    //     queryMode: 'local',
    //     store: {
    //         fields: ['id', 'name'],
    //         data: [{
    //             "id": "1",
    //             "name": "Journée",
    //             "code": "JRN"
    //         }, {
    //             "id": "2",
    //             "name": "Matin",
    //             "code": "MAT"
    //         }, {
    //             "id": "3",
    //             "name": "Après-Midi",
    //             "code": "APM"
    //         }, {
    //             "id": "4",
    //             "name": "Nuit",
    //             "code": "NIT"
    //         }]
    //     }
    //     // ,
    //     // listConfig: {
    //     //     itemTpl: ['{code} : {name} ']
    //     // }
    // }, {
    //     type: 'help'
    // }],
    items: [{
        xtype: 'gridpanel',
        itemId: 'grdActivities',
        stateful: true,
        stateId: 'currentact-grdActivities',
        flex: 1,
        store: {
            type: 'activities'
        },
        plugins: 'gridfilters',
        stripeRows: false,
        features: [{
            /**
             * ajout des fonctionnalités de regroupement pour pouvoir
             * regrouper les activités par certaines informations
             * type activité, section, état ?
             */
            ftype: 'grouping',
            startCollapsed: false,
            hideGroupedHeader: false,
            /* cacher la colonne du regroupement */
            groupHeaderTpl: '{columnName}: {name} ({rows.length} Activité{[values.rows.length > 1 ? "s" : ""]})'
        }],
        listeners: {
            cellClick: 'onCellClick'
        },

        // tbar: [{
        //     xtype: 'button',
        //     itemId: 'clearFilters',
        //     text: 'Effacer filtres',
        //     hidden: true,
        //     handler: 'onClearFltClick'
        // }],
        // FIXME: HVT 2019-07-23 10:57:47
        // viewConfig: {
        //     getRowClass: function (record, rowIndex, rowParams, store) {
        // devrait placer le marqueur de type d'activité sur la ligne au lieu de la cellule
        // ne fonctionne pas
        // affiche le marqueur (dernier) sur toute la hauteur de la grille
        // décale les cellules si autre que PROD
        // return ('thot-tag-cell thot-tag-cell-' + record.data.oct_code);
        // return ((rowIndex % 2) == 0) ? "even-class" : "odd-class";
        //     }
        // },
        columns: [ // grille des activités
            { // colonne Etat
                header: 'Etat',
                dataIndex: 'etat',
                stateId: 'etat',
                minWidth: 200,
                hideable: false,
                sortable: false,
                resizable: false,
                draggable: false,
                groupable: false,
                renderer: function (_sValue, _oCell, oData) {
                    var sReturn = '';

                    // définition de la bordure gauche de la ligne, code couleur en fonction du type d'activité
                    // sReturn +=
                    //     '<div class="thot-tag-cell thot-tag-cell-' +
                    //     oData.get("oct_code") +
                    //     '"></div>'; //statusPause

                    // si oct_code = PROD et alt_code = REG
                    if (oData.get('oct_code') == 'PROD' && oData.get('alt_code') == 'REG') {
                        // on affiche l'icone réglage
                        sReturn += '<div class="thot-card-status-act"><div class="thot-activite-button-' + oData.get('alt_code') + '"></div>';
                    } else {
                        // sinon, l'icone production
                        sReturn += '<div class="thot-card-status-act"><div class="thot-activite-button-' + oData.get('oct_code') + '"></div>';
                    }
                    sReturn +=
                        '<div class=\'thot-alert-sticky\'><a class=\'thot-bold-label\'>' + oData.get('ald_libelle') + '</a>';

                    // complément d'informations sur l'état de l'activité
                    // - date de début de l'activité
                    // - type d'opération (type de l'aléa ou destinataire du non planifié)
                    // si c'est un aléa
                    if (oData.get('ala_id') > 0) {
                        // // affichage de la mise en pause automatique
                        //     sReturn +=
                        //         '<div class="thot-card-status-act"><div class="thot-act-paused"></div>'; //statusPause
                        //     sReturn +=
                        //         '<div class="thot-alert-sticky">' +
                        //         oData.get("ald_libelle") +
                        //         "</div></div>";
                        sReturn +=
                            // "<div class='thot-alert-sticky'><a class='thot-bold-label'>" + oData.get("ald_libelle") + "</a>" +
                            '<div class=\'thot-act-date\'>' +
                            Ext.Date.explicitDate(
                                oData.get('ala_date_debut')
                            ) +
                            '</div>';
                    } else {
                        // affichage du libellé de l'opération complémentaire si disponible
                        if (oData.get('opc_libelle') != undefined) {
                            sReturn +=
                                '<div class=\'thot-alert-sticky\'><a class=\'thot-bold-label\'>' + oData.get('opc_libelle') + '</a>';
                        }
                        sReturn +=
                            '<div class=\'thot-act-date\'>' +
                            Ext.Date.explicitDate(
                                oData.get('act_date_debut')
                            ) +
                            '</div>';
                    }
                    sReturn += '</div></div>'; // fermeture de la div thot-card-status-act
                    if (parseInt(oData.get('locked')) == 1) {
                        sReturn +=
                            '<div class="thot-locked" data-qtip="Activité actuellement verrouillée par le système"></div>';
                    }
                    return sReturn;
                }
            },
            { // colonne Equipement
                header: 'Equipement',
                // dataIndex: "eqp_libelle_realise", // NOTE: 2021-02-22 09:58:26 modification demandée par PBD (supprimer info libellé, n'afficher que code)
                // dataIndex: "eqp_libelle_realise",
                dataIndex: 'eqp_code_realise',
                stateId: 'eqp_libelle_realise', //NOTE: 2021-02-22 09:59:03 Id colonne conservée pour éviter les plantages de mémorisation config grille 
                minWidth: 150,
                flex: 1,
                filter: {
                    // required configs
                    type: 'list',
                    itemDefaults: {
                        // any Ext.form.field.Text configs accepted
                    }
                },
                renderer: function (sValue, _oCell, oData) {
                    var sReturn = '';
                    if (sValue != '') {
                        sReturn =
                            '<div class=\'thot-bold-label thot-maxsized-eqp-info\'>' + sValue + '</div>' +
                            '<div>' + oData.get('eqp_libelle_realise') + '</div>';
                    }

                    return sReturn;
                }
            },
            { // Colonne opérateur
                header: 'Opérateur',
                stateId: 'usr_grp',
                columns: [{
                        header: 'Opérateur',
                        dataIndex: 'usr_nomprenom_realise',
                        stateId: 'usr_nomprenom_realise',
                        reorderable: false,
                        minWidth: 265,
                        flex: 1,
                        filter: {
                            // required configs
                            type: 'string',
                            itemDefaults: {
                                // any Ext.form.field.Text configs accepted
                            }
                        },
                        renderer: function (sValue, _oCell, oData) {
                            var sReturn = '';
                            // var sSimultane = '';

                            sReturn =
                                '<div class="thot-card-user"> <div class="img" style="background-image: url(\'resources/images/' +
                                oData.get('usr_photo') +
                                '\')"></div>';
                            sReturn +=
                                '<div class="content thot-bold-label">' +
                                sValue +
                                '</div></div>'; //class='cellBold'
                            if (parseInt(oData.get('simultane'), 10) > 1) {
                                sReturn +=
                                    '<div class="badge" data-count="' +
                                    oData.get('simultane') +
                                    '"  data-qtip="' +
                                    oData.get('simultane') +
                                    ' activités en cours" data-qalign="br-tl"> </div>';
                            }
                            if (
                                parseInt(oData.get('collaboration'), 10) > 1
                            ) {
                                // c'est une opération collaborative (il doit y en avoir au moins deux !)
                                sReturn +=
                                    '<div class="badge-collab" data-qtip="Collaboration" data-qalign="tr-bl"> </div>';
                            }
                            // si l'id opérateur retourné = 0 (null en BDD) ou Nan alors on retourne une chaine vide pour la mise en forme
                            if (
                                isNaN(parseInt(oData.get('usr_id_realise')))
                            ) {
                                return '';
                            } else {
                                return sReturn;
                            }
                        }
                    },
                    {
                        header: 'Equipe',
                        dataIndex: 'eps_libelle',
                        stateId: 'eps_libelle',
                        width: 80,
                        resizable: false,
                        filter: {
                            type: 'list'
                        }
                    }
                ]
            },
            { // Colonne section atelier opérateur
                header: 'Section',
                dataIndex: 'org_libelle',
                stateId: 'org_libelle',
                minWidth: 160,
                filter: {
                    // required configs
                    type: 'list',
                    itemDefaults: {
                        // any Ext.form.field.Text configs accepted
                    }
                },
                renderer: function (_sValue, _oCell, oData) {
                    var sReturn = '';
                    sReturn =
                        '<a class=\'thot-bold-label\'>' +
                        oData.get('org_libelle') +
                        '</a>'; //thot-bold-label
                    return sReturn;
                }
            },
            { // Colonne OF
                header: 'Of',
                dataIndex: 'odf_code',
                stateId: 'odf_code',
                Width: 95,
                hideable: false,
                resizable: false,
                filter: {
                    // required configs
                    type: 'number',
                    itemDefaults: {
                        // any Ext.form.field.Text configs accepted
                    }
                },
                renderer: function (sValue, _oCell, oData) {
                    var sReturn = '';
                    if (oData.get('odf_id') != 0) {
                        sReturn =
                            '<div class=\'thot-bold-label thot-maxsized-info\'>' + sValue + '</div>';
                    } else {
                        sReturn = '';
                    }
                    return sReturn;
                }
            },
            { // Colonne opération
                header: 'Op',
                dataIndex: 'opn_code',
                StateId: 'opn_code',
                minWidth: 210,
                flex: 1,
                renderer: function (_sValue, _oCell, oData) {
                    var sReturn = '';
                    if (oData.get('opn_code') !== '') {
                        sReturn +=
                            '<div class=\'thot-bold-label\'>' +
                            oData.get('opn_code') +
                            ' - ' +
                            oData.get('pst_libelle') +
                            '</div>';
                    } else {
                        sReturn +=
                            '<div class=\'thot-bold-label\'>' +
                            oData.get('pst_libelle') +
                            '</div>';
                    }
                    // définir le CSS dans le fichier resources/css/thot.css
                    if (parseInt(oData.get('oct_id')) !== 1) {
                        /* il s'agit d'une opération autre que production */
                        sReturn +=
                            '<div style="float:right; margin-right:10px" class="thot-tag thot-tag-' +
                            oData.get('oct_code') +
                            '">' +
                            oData.get('oct_libelle') +
                            '</div>';
                    } else {
                        // affichage des temps restants pour les opérations de production uniquement
                        if (oData.get('alt_code') != 'REG') {
                            // affichage des quantités restante/attendues sur l'opération, uniquement sur activités de production
                            sReturn +=
                                '<div data-qtip=\'Quantité restante à réaliser ' +
                                parseInt(oData.get('qteresteafaire')) +
                                ' pièces / ' +
                                oData.get('odf_quantite_lancee') +
                                ' attendues\' data-qalign=\'tl-bl\'>Qté. restante/attendue: <span style=\'font-weight: bold;\'>' +
                                parseInt(oData.get('qteresteafaire')) +
                                '</span>/' +
                                oData.get('odf_quantite_lancee') +
                                '</div>';
                            // affichage des temps restants / alloué
                            sReturn +=
                                '<div data-qtip=\'Temps restant ' +
                                oData.get('tpsrestant_hms') +
                                ' / ' +
                                oData.get('tpsalloue_hms') +
                                ' alloué\' data-qalign=\'tl-bl\'>Tps. restant/alloué: <span style=\'font-weight: bold;\'>' +
                                oData.get('tpsrestant_hms') +
                                '</span>/' +
                                oData.get('tpsalloue_hms') +
                                '</div>';
                        }
                        // TODO: HVT 2021-04-06 09:13:11 prévoir d'afficher les temps de réglage spécifiques
                    }
                    // NOTE: 2021-02-22 10:15:14 retiré à la demande de PBD 
                    // if (oData.get("opn_code") !== "") { // affichage des dates de début/fin planifiées
                    //     sReturn +=
                    //         "<div><a class='thot-icon-begin'> </a>" +
                    //         Ext.Date.format(
                    //             oData.get("opn_date_debutplanifie"),
                    //             "d/m/Y H:i"
                    //         ) +
                    //         "</div>";
                    //     sReturn +=
                    //         "<div><a class='thot-icon-end'> </a>" +
                    //         Ext.Date.format(
                    //             oData.get("opn_date_finplanifie"),
                    //             "d/m/Y H:i"
                    //         ) +
                    //         "</div>";
                    // }
                    return sReturn;
                }
            },
            { // colonne Classe opération, redondante avec l'indicateur visuel du type d'opération mais permet de filtrer les opérations à afficher par leur classe (en cas de survision depuis un autre secteur)
                // certaines opérations peuvent ne pas interesser les autres secteurs (hors production, qualité, non planifié)
                header: 'Classe opération',
                dataIndex: 'oct_libelle',
                minWidth: 120,
                filter: {
                    type: 'list'
                },
                hidden: true // cachée par défaut, l'administrateur pourra l'afficher pour définir le filtre et la masquer par la suite)
            },
            { // Colonne produit
                header: 'Produit',
                dataIndex: 'pdt_code',
                minWidth: 300,
                flex: 1,
                filter: {
                    // required configs
                    type: 'string',
                    itemDefaults: {
                        // any Ext.form.field.Text configs accepted
                    }
                },
                renderer: function (_sValue, _oCell, oData) {
                    var sReturn = '';
                    if (oData.get('pdt_code') !== '') {
                        sReturn =
                            '<div class=\'thot-bold-label\'>' +
                            oData.get('pdt_libelle') +
                            '</div>';
                        sReturn +=
                            '<div class=\'thot-bold-label\'>' +
                            oData.get('pdt_complement') +
                            ' - ' +
                            oData.get('nce_libelle') +
                            '</div>';
                        sReturn +=
                            // NOTE: 2021-02-22 10:16:01 remplacé l'icône par du texte, demande de PBD
                            // "<div><a class='thot-icon-hashtag'> </a>" +
                            '<div><a>Identifiant Produit :</a>' +
                            oData.get('pdt_code') +
                            '</div>';
                    }

                    return sReturn;
                }
            },
            { // Colonne date début opération
                header: 'Date début opération',
                dataIndex: 'opn_date_debutreel',
                stateId: 'opn_date_debutreel',
                hidden: true,
                minWidth: 150,
                renderer: function (sValue, _oCell, _oData) {
                    var sReturn = '';
                    sReturn +=
                        '<div >' + Ext.Date.explicitDate(sValue) + '</div>';
                    return sReturn;
                }
            }
        ],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: [
                // {
                //     xtype: 'displayfield',
                //     cls: 'thot-label-indicateur thot-activity',
                //     labelWidth: 50,
                //     itemId: 'prodTasks',
                //     fieldLabel: 'PROD'
                //     // fieldLabel: 'Activités en cours'
                // },
                // {
                //     xtype: 'displayfield',
                //     cls: 'thot-label-indicateur thot-random',
                //     labelWidth: 50,
                //     itemId: 'qualTasks',
                //     fieldLabel: 'QUAL'
                //     // fieldLabel: 'Activités sous aléa'
                // },
                // {
                //     xtype: 'displayfield',
                //     cls: 'thot-label-indicateur thot-random',
                //     labelWidth: 50,
                //     itemId: 'hrprTasks',
                //     fieldLabel: 'HRPR'
                //     // fieldLabel: 'Activités sous aléa'
                // },
                // {
                //     xtype: 'displayfield',
                //     cls: 'thot-label-indicateur thot-random',
                //     labelWidth: 50,
                //     itemId: 'nplnTasks',
                //     fieldLabel: 'NPLN'
                //     // fieldLabel: 'Activités sous aléa'
                // },
                '->',
                {
                    text: 'Réglage ...',
                    ui: 'thot-action',
                    iconCls: 'x-fa fa-wrench fa-2x',
                    scale: 'small',
                    handler: 'onNewSettingActClick'
                },
                '|',
                {
                    text: 'Production ...',
                    ui: 'thot-action',
                    iconCls: 'x-fa fa-cog fa-2x',
                    scale: 'small',
                    handler: 'onNewActClic'
                },
                // ajout des boutons pour les autres contextes d'activité 'Qualité, Hors production'
                {
                    text: 'Qualité ...',
                    ui: 'thot-action',
                    iconCls: 'x-fa fa-recycle fa-2x',
                    scale: 'small',
                    handler: 'onNewQualityActClick'
                },
                {
                    text: 'Hors Prod ...',
                    ui: 'thot-action',
                    iconCls: 'x-fa fa-random  fa-2x',
                    scale: 'small',
                    handler: 'onNewAleaClick'
                },
                {
                    text: 'NON PLANIFIE ...',
                    ui: 'thot-action',
                    iconCls: 'x-fa fa-chain-broken  fa-2x',
                    scale: 'small',
                    handler: 'onNewUnplanedActClick'
                }
            ]
        }]
    }]
});