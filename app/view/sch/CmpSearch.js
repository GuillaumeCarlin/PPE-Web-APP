Ext.define('Thot.view.sch.CmpSearch', {
    extend: 'Ext.form.Panel',
    cls: 'thot-panel',
    xtype: 'search',

    requires: [
        'Thot.view.sch.CmpSearchController',
        'Thot.view.sch.CmpSearchModel',
        'Thot.view.cmp.CmpDetailOf',
        'Thot.view.pck.NumKeyBoard'
    ],

    controller: 'sch-cmpsearch',
    viewModel: {
        type: 'sch-cmpsearch'
    },
    layout: {
        type: 'fit'
    },
    listeners: {
        afterrender: 'onAfterRender',
        click: 'checkAuth',
        show: 'checkAuth',
    },
    items: [{
        xtype: 'tabpanel',
        // ui: 'thot-alternative',
        items: [{
            xtype: 'panel',
            itemId: 'ofTab',
            layout: {
                align: 'stretch',
                type: 'vbox'
            },
            flex: 1,
            title: 'O.F.',
            //iconCls: 'x-fa fa-download',
            tbar: [{
                    xtype: 'numkeyboard',
                    itemId: 'noof',
                    fieldLabel: 'N° O.F.',
                    listeners: {
                        change: 'onPickerValueChange',
                    },
                },
                {
                    xtype: 'button',
                    text: 'Rechercher',
                    ui: 'thot-action',
                    iconCls: 'x-fa fa-search fa2x',
                    handler: 'onValidClick'
                }, '->',
                {
                    xtype: 'button',
                    itemId: 'btnDeleteOf',
                    disabled: true, // par défaut, le bouton sera activé et le texte adapté en fonction de l'OF affiché
                    ui: 'alert',
                    text: 'Supprimer l\'OF',
                    handler: 'onDeleteOfClick'
                }
            ],
            items: [
                /* le détail de l'of */
                {
                    xtype: 'ofdetail',
                    itemId: 'ofdetail'
                },
                { // une grille pour afficher les opérations de l'of et leurs propriétés
                    xtype: 'gridpanel',
                    // ui: 'thot-panel-border',
                    margin: '10 10 0 10',
                    title: 'Opérations de l\'OF',
                    itemId: 'operations',
                    reference: 'operations',
                    stateful: true,
                    stateId: 'searchOF-grdOpn',
                    flex: 1,
                    store: {
                        type: 'ofoperationslistcsl'
                    },
                    listeners: {
                        select: 'onOperationClick',
                        itemcontextmenu: 'onGridRightClick'
                    },
                    viewConfig: { // définition de la mise en forme de la ligne de grille en fonction de l'état de l'opération
                        getRowClass: function (record, _rowIndex, _rowParams, _store) {
                            var sCSS = '';
                            sCSS = record.get('etatopn') == 'TE' ? 'thot-grid-added-entity' : sCSS;
                            sCSS = record.get('etatopn') == 'CO' ? 'thot-grid-modified-entity' : sCSS;
                            sCSS = record.get('etatopn') == 'EC' ? 'thot-grid-modified-entity' : sCSS;
                            sCSS = record.get('etatopn') == 'NR' ? 'thot-grid-undone-entity' : sCSS;
                            return sCSS;
                        },
                        // conserver la position du scroll vertical à l'actualisation 
                        preserveScrollOnRefresh: true,
                        loadMask: false,
                        emptyText: 'Aucune opération trouvée'
                    },
                    columns: [{
                            xtype: 'gridcolumn',
                            dataIndex: 'opn_code',
                            text: 'Op.',
                            width: 60,
                            renderer: function (sValue, _oCell, oData) {
                                var sReturn = sValue,
                                    sCss = '';

                                switch (oData.get('etatopn')) {
                                    case 'AF':
                                        sCss = 'class="thot-icon-todo-medium icon-dimmed" data-qtip="Opération non commencée, à faire."';
                                        break;
                                    case 'CO':
                                        sCss = 'class="thot-icon-started-medium icon-warning" data-qtip="Opération commencée."';
                                        break;
                                    case 'TE':
                                        sCss = 'class="thot-icon-done-medium icon-green" data-qtip="Opération terminée"';
                                        break;
                                    case 'NR':
                                        sCss = 'class="thot-icon-undone-medium icon-error" data-qtip="Opération non réalisée."';
                                        break;
                                    default:
                                        sCss = '';
                                        break;
                                }
                                sReturn = sValue + '<div style="float:right; margin-right:10px" ' + sCss + ' data-qalign="bl-tl"></div>';
                                // if (parseInt(oData.get('opn_estnonrealisee')) == 1) {
                                //     // l'opération n'a pas été réalisée (inutile)
                                //     sReturn = sValue + '<div style="float:right; margin-right:10px" class="thot-icon-undone-medium icon-error" data-qtip="Opération non réalisée" data-qalign="bl-tl"></div>';
                                // }
                                return sReturn;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'etatopn',
                            text: 'Etat',
                            width: 60,
                            tooltip: 'Etat d\'avancement de l\'opération</br>AF = à faire</br>CO = commencée</br>TE = terminé</br>NR = non réalisée'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'pst_libelle',
                            text: 'Poste',
                            minWidth: 200,
                            flex: 1
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'org_libelle',
                            text: 'Atelier',
                            width: 150
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'rsc_code_theo',
                            text: 'Equipement Théo.',
                            width: 200
                        },
                        // {
                        //     xtype: 'gridcolumn',
                        //     dataIndex: 'rsc_code_reel',
                        //     text: 'Equipement Réel',
                        //     width: 200
                        // },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'tempsreglageallouehms',
                            text: 'Temps réglage alloué (H:m:s)',
                            tooltip: 'Temps réglage alloué (H:m:s)',
                            width: 160
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'dureealeareglagehms',
                            text: 'Temps réglage réalisé (H:m:s)',
                            tooltip: 'Temps réglage réalisé (H:m:s)',
                            width: 160,
                            renderer: function (sValue, _oCell, oData) {
                                var sReturn = sValue;

                                if (parseInt(oData.get('coherencereglage')) == 0) {
                                    // surconsommation du temps de réglage alloué
                                    sReturn = sValue + '<div style="float:right; margin-right:10px" class="thot-icon-prmnok-medium icon-warning" data-qtip="Temps de réglage alloué dépassé" data-qalign="bl-tl"></div>';
                                }
                                return sReturn;
                            }
                        },
                        // {
                        //     xtype: 'gridcolumn',
                        //     dataIndex: 'opn_temps_montage_j',
                        //     text: 'Temps montage alloué',
                        //     width: 160,
                        //     renderer: function (sValue, oCell, oData) {
                        //         var sReturn = "";
                        //         var fSec = 0;
                        //         var oTime;

                        //         if (sValue > 0) {
                        //             fSec = (parseFloat(sValue) * 24) * 3600;
                        //             oTime = Ext.Date.millisecToTime(fSec * 1000);
                        //             sReturn = oTime.time;
                        //         }

                        //         return sReturn;
                        //     }
                        // },
                        // {
                        //     xtype: 'gridcolumn',
                        //     dataIndex: 'dureealeamontagejhms',
                        //     text: 'Temps montage',
                        //     width: 160
                        // },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'ope_temps_unitaire_hms',
                            text: 'Temps unitaire alloué (H:m:s)',
                            tooltip: 'Temps unitaire alloué (H:m:s)'
                        },
                        // {
                        //     xtype: 'gridcolumn',
                        //     dataIndex: 'tempsunitairereeljhms',
                        //     text: 'Temps'
                        // },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'temps_operateur_hms',
                            text: 'Temps opérateur (H:m:s)',
                            tooltip: 'Temps opérateur (H:m:s)',
                            renderer: function (sValue, _oCell, oData) {
                                var sReturn = sValue;

                                if (parseInt(oData.get('opn_traiteejour')) == 1) {
                                    // présence d'activités le jour de consultation, les temps ne sont pas consolidés, on le signale
                                    sReturn = sValue + '<div style="float:right; margin-right:10px" class="thot-icon-info-medium" data-qtip="Le temps passé ce jour n\'est pas pris en compte dans la valeur affichée" data-qalign="bl-tl"></div>';
                                }
                                return sReturn;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'temps_prod_hms',
                            text: 'Temps machine (H:m:s)',
                            tooltip: 'Temps machine (H:m:s)',
                            renderer: function (sValue, _oCell, oData) {
                                var sReturn = sValue;

                                if (parseInt(oData.get('opn_traiteejour')) == 1) {
                                    // présence d'activités le jour de consultation, les temps ne sont pas consolidés, on le signale
                                    sReturn = sValue + '<div style="float:right; margin-right:10px" class="thot-icon-info-medium" data-qtip="Le temps passé ce jour n\'est pas pris en compte dans la valeur affichée" data-qalign="bl-tl"></div>';
                                }
                                return sReturn;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'qte_bon',
                            text: 'Qté.Bon (csl)',
                            hidden: true,
                            tooltip: 'Quantité issue de la consolidation quotidienne</br>les quantités des activités en cours ne sont pas prises en compte',
                            align: 'right',
                            renderer: function (sValue, _oCell, oData) {
                                var sReturn = sValue;
                                if (parseInt(oData.get('coherenceqte')) == 0) {
                                    // Quantité déclarée supérieure à la quantité bonne de l'opération précédente
                                    sReturn = sValue + '<div style="float:left; margin-right:10px" class="thot-icon-prmnok-medium icon-warning" data-qtip="Quantité déclarée supérieure à la quantité bonne de l\'opération précédente" data-qalign="bl-tl"></div>';
                                }
                                return sReturn;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'qte_rebut',
                            text: 'Qté.Rebut (csl)',
                            hidden: true,
                            tooltip: 'Quantité issue de la consolidation quotidienne</br>les quantités des activités en cours ne sont pas prises en compte',
                            align: 'right',
                            renderer: function (sValue, _oCell, _oData) {
                                var sReturn = sValue;
                                if (parseInt(sValue) > 0) {
                                    sReturn =
                                        '<span class=\'icon-error\' style=\'font-weight: bold;\'>' + sValue + '</span>';
                                }
                                return sReturn;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'qte_bon_act',
                            text: 'Qté.Bon (act)',
                            tooltip: 'Quantité issue des activités terminées</br>Peut être différent des quantités consolidées',
                            align: 'right',
                            renderer: function (sValue, _oCell, oData) {
                                var sReturn = sValue;
                                if (parseInt(oData.get('coherenceqte')) == 0) {
                                    // Quantité déclarée supérieure à la quantité bonne de l'opération précédente
                                    sReturn = sValue + '<div style="float:left; margin-right:10px" class="thot-icon-prmnok-medium icon-warning" data-qtip="Quantité déclarée supérieure à la quantité bonne de l\'opération précédente" data-qalign="bl-tl"></div>';
                                }
                                return sReturn;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'qte_rbt_act',
                            text: 'Qté.Rebut (act)',
                            tooltip: 'Quantité issue des activités terminées</br>Peut être différent des quantités consolidées',
                            align: 'right',
                            renderer: function (sValue, _oCell, _oData) {
                                var sReturn = sValue;
                                if (parseInt(sValue) > 0) {
                                    sReturn =
                                        '<span class=\'icon-error\' style=\'font-weight: bold;\'>' + sValue + '</span>';
                                }
                                return sReturn;
                            }
                        },

                        // {
                        //     xtype: 'gridcolumn',
                        //     dataIndex: 'qte_retouche',
                        //     text: 'Qté. Retouche'
                        // },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'opn_date_debutplanifie',
                            text: 'Début planifié',
                            formatter: 'date("d/m/Y H:i")',
                            minWidth: 125,
                            resizable: false
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'opn_date_finplanifie',
                            text: 'Fin planifiée',
                            formatter: 'date("d/m/Y H:i")',
                            minWidth: 125,
                            resizable: false
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'opn_date_debutreel',
                            text: 'Début réel',
                            formatter: 'date("d/m/Y H:i")',
                            minWidth: 125,
                            resizable: false
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'opn_date_finreel',
                            text: 'Fin réelle',
                            formatter: 'date("d/m/Y H:i")',
                            minWidth: 125,
                            resizable: false
                        }
                        //, {
                        //     xtype: 'actioncolumn',
                        //     text: 'Actions',
                        //     items: [{
                        //         /* détails de l'opération, liste des activités et alés */
                        //         icon: '',
                        //         tooltip: 'Détail réalisation'
                        //     }],
                        //     minWidth: 60,
                        //     resizable: false
                        // }
                    ]
                },
                { // conteneur du détail opération (rappel informations OP + détail activités)
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [{ // informations opération, mis à jour sur sélection d'une opération de l'OF
                        xtype: 'panel',
                        title: 'Opération',
                        // ui: 'thot-panel-border',
                        margin: '10 0 10 10',
                        width: 300,
                        scrollable: true,
                        defaults: {
                            ui: 'thot-field-compact',
                            value: ''
                        },
                        items: [{
                            xtype: 'displayfield',
                            fieldLabel: 'OP',
                            itemId: 'dfop'
                        }, {
                            xtype: 'displayfield',
                            fieldLabel: 'Etat',
                            itemId: 'dfetat'
                        }, {
                            xtype: 'displayfield',
                            fieldLabel: 'Poste',
                            itemId: 'dfposte'
                        }, {
                            xtype: 'displayfield',
                            fieldLabel: 'Atelier',
                            itemId: 'dfatelier'
                        }, {
                            xtype: 'displayfield',
                            fieldLabel: 'Equipement',
                            itemId: 'dfequipement'
                            // }, {
                            //     xtype: 'displayfield',
                            //     fieldLabel: 'Début planifié',
                            //     itemId: 'dfdebutplanifie'
                            // }, {
                            //     xtype: 'displayfield',
                            //     fieldLabel: 'Fin planifiée',
                            //     itemId: 'dffinplanifiee'
                        }, {
                            xtype: 'displayfield',
                            fieldLabel: 'Début réel',
                            itemId: 'dfdebutreel'
                        }, {
                            xtype: 'displayfield',
                            fieldLabel: 'Fin réelle',
                            itemId: 'dffinreelle'
                        }]
                    }, { // tabpanel pour affichage des données consolidées et des activités
                        xtype: 'tabpanel',
                        flex: 1,
                        margin: '0 10 10 10',
                        activeTab: 0,
                        items: [{ // Grille des activités relatives à l'opération sélectionnée 
                            xtype: 'gridpanel',
                            // ui: 'thot-panel-border',
                            title: 'Activités',
                            itemId: 'activites',
                            flex: 1,
                            stateful: true,
                            stateId: 'searchOF-grdAct',
                            store: {
                                type: 'activitiesopn'
                            },
                            features: [{
                                ftype: 'summary',
                                dock: 'bottom'
                            }],
                            viewConfig: { // définition de la mise en forme de la ligne de grille en fonction de l'état de l'opération
                                getRowClass: function (record, _rowIndex, _rowParams, _store) {
                                    var sCSS = '';
                                    sCSS = parseInt(record.get('act_estdujour')) == 1 ? 'thot-grid-modified-entity thot-bold' : sCSS;
                                    return sCSS;
                                },
                                loadMask: false,
                                emptyText: 'Aucune activté'
                            },
                            columns: [{
                                    xtype: 'gridcolumn',
                                    dataIndex: 'org_libelle',
                                    text: 'Atelier',
                                    width: 120
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'eps_libelle',
                                    text: 'Equipe',
                                    width: 100
                                },
                                {
                                    xtype: 'gridcolumn',
                                    text: 'Opérateur',
                                    flex: 1,
                                    renderer: function (_oGrid, _oCell, oData) {
                                        var sReturn = oData.data.usr_nom + ' ' + oData.data.usr_prenom;
                                        return sReturn;
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'rsc_code',
                                    text: 'Equipement',
                                    flex: 1,
                                    renderer: function (_sValue, _oCell, oData) {
                                        var sReturn = oData.data.rsc_code;
                                        if (oData.data.ald_code == 'RGL') {
                                            /* il s'agit d'une opération de réglage */
                                            sReturn +=
                                                '<div style="float:right; margin-right:10px" class="thot-tag thot-tag-REG">' +
                                                oData.get('ald_libelle') +
                                                '</div>'; //statusOn
                                        }
                                        return sReturn;
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'act_date_debut',
                                    text: 'Date début',
                                    formatter: 'date("d/m/Y H:i")',
                                    minWidth: 125,
                                    resizable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'act_date_fin',
                                    text: 'Date Fin',
                                    formatter: 'date("d/m/Y H:i")',
                                    minWidth: 125,
                                    resizable: false
                                },
                                // {
                                //     xtype: 'gridcolumn',
                                //     // dataIndex: 'etatopn',
                                //     text: 'Durée',
                                //     width: 60
                                // },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'bon',
                                    text: 'Qté Bon',
                                    align: 'right',
                                    width: 100,
                                    summaryType: 'sum'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'rbt',
                                    text: 'Qté. Rebut',
                                    align: 'right',
                                    width: 100,
                                    renderer: function (sValue, _oCell, _oData) {
                                        var sReturn = sValue;
                                        if (parseInt(sValue) > 0) {
                                            sReturn =
                                                '<span class=\'thot-bold-label icon-error\' style=\'font-weight: bold;\'>' + sValue + '</span>';
                                        }
                                        return sReturn;
                                    },
                                    summaryType: 'sum'
                                }

                            ]
                        }, { // Grille des données consolidées relatives à l'opération sélectionnée 
                            xtype: 'gridpanel',
                            // ui: 'thot-panel-border',
                            title: 'Détail consolidé (J-1)',
                            tooltip: 'le calcul de la consolidation est déclenché en fin de journée de travail (après l\'équipe de nuit)' +
                                '</br>La consolidation calcule la répartition des temps et quantités en fonction des situations de simultanéité, collaboration, multi-postes</br>' +
                                'ce qui peut occasionner des écarts entre les données saisies et les données consolidées</br>' +
                                'les activités réalisées ce jour ne sont pas encore prises en compte dans la consolidation',
                            itemId: 'consolidation',
                            flex: 1,
                            stateful: true,
                            stateId: 'searchOF-grdActCsl',
                            store: {
                                type: 'activitiesopncsl'
                            },
                            features: [{
                                ftype: 'summary',
                                dock: 'bottom'
                            }],
                            viewConfig: {
                                loadMask: false,
                                emptyText: 'Aucune donnée consolidée disponible'
                            },
                            columns: [{
                                xtype: 'gridcolumn',
                                dataIndex: 'org_libelle',
                                text: 'Atelier',
                                width: 120
                            }, {
                                xtype: 'gridcolumn',
                                dataIndex: 'date_prod',
                                text: 'Date production',
                                width: 120
                            }, {
                                xtype: 'gridcolumn',
                                dataIndex: 'eps_libelle',
                                text: 'Equipe',
                                width: 120
                            }, {
                                xtype: 'gridcolumn',
                                dataIndex: 'usr_nom',
                                text: 'Opérateur',
                                width: 120,
                                renderer: function (_oGrid, _oCell, oData) {
                                    var sReturn = oData.data.usr_nom + ' ' + oData.data.usr_prenom;
                                    return sReturn;
                                }
                            }, {
                                xtype: 'gridcolumn',
                                dataIndex: 'rsc_code',
                                text: 'Equipement',
                                width: 120
                            }, {
                                xtype: 'gridcolumn',
                                dataIndex: 'tpsoperateur',
                                text: 'Temps opérateur',
                                width: 120,
                                summaryType: 'sum',
                                summaryRenderer: function (value, _summaryData, _dataIndex) {
                                    // NOTE: HVT 2021-03-09 10:30:38, arrondi à deux chiffres après la virgule
                                    // dans certains cas la somme est correcte mais il arrive d'obtenir un float avec 10 0 après la virgule, c'est pas beau !
                                    return value.toFixed(2);
                                }
                            }, {
                                xtype: 'gridcolumn',
                                dataIndex: 'tpsmachine',
                                text: 'Temps machine',
                                width: 120,
                                summaryType: 'sum',
                                summaryRenderer: function (value, _summaryData, _dataIndex) {
                                    return value.toFixed(2);
                                }

                            }, {
                                xtype: 'gridcolumn',
                                dataIndex: 'tpsreglage',
                                text: 'Temps réglage',
                                width: 120,
                                summaryType: 'sum',
                                summaryRenderer: function (value, _summaryData, _dataIndex) {
                                    return value.toFixed(2);
                                }

                            }, {
                                xtype: 'gridcolumn',
                                dataIndex: 'bon',
                                text: 'Qté.Bon',
                                width: 120,
                                summaryType: 'sum'
                            }, {
                                xtype: 'gridcolumn',
                                dataIndex: 'rbt',
                                text: 'Qté.Rebut',
                                width: 120,
                                renderer: function (sValue, _oCell, _oData) {
                                    var sReturn = sValue;
                                    if (parseInt(sValue) > 0) {
                                        sReturn =
                                            '<span class=\'thot-bold-label icon-error\' style=\'font-weight: bold;\'>' + sValue + '</span>';
                                    }
                                    return sReturn;
                                },
                                summaryType: 'sum'
                            }]
                        }]
                    }]
                }
            ]
        }]
    }]
});