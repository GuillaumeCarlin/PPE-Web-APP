Ext.define('Thot.view.stat.CmpListEquipe', {
    extend: 'Ext.form.Panel',
    cls: 'thot-panel',
    xtype: 'statistique',
    requires: [
        'Thot.view.stat.CmpListEquipeController',
        'Thot.store.stat.StatistiqueListUserS'
    ],
    controller: 'stat-cmplistequipe',

    // listeners: {
    //     gridRefresh: 'onGridRefresh',
    // },
    
    
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    title: 'Relevés de temps individuels',
    items:[
                {
                xtype: 'gridpanel',
                flex: 1,
                itemId: 'ListeUser',
                reference: 'ListUser',
                stateful: true,
                stateId: 'listequipe-listeuser',
                plugins: 'gridfilters',
                features: [{
                    ftype: 'grouping',
                    startCollapsed: false,
                    hideGroupedHeader: false,
                    /* cacher la colonne du regroupement */
                    groupHeaderTpl: '{columnName}: {name} ({rows.length} Activité{[values.rows.length > 1 ? "s" : ""]})'
                }],
                layout: {
                    type: 'fit',
                    align: 'stretch'
                },
                store: {
                    type: 'statuserlist'
                },
                listeners: {
                    afterrender: 'onAfterRender',
                    //gridRefresh: 'onGridRefresh',
                    select: 'onOperationClick',
                    refresh: 'refresh'
                },
                viewConfig: {
                    preserveScrollOnRefresh: true,
                    loadMask: false,
                    emptyText: 'Aucun utilisateur trouvée',
                    getRowClass: function (record, rowIndex, rowParams, store) {
                        var sCSS = "";
                        sCSS = parseInt(record.get("booleen")) == 0 ? "thot-grid-modified-entity" : sCSS;
                        return sCSS;
                    },
                },
                columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'nom',
                            text: 'Nom',
                            minWidth: 150,
                            tooltip: 'Nom de la personne',
                            renderer: function (sValue, oCell, oData) {
                                var sReturn = "";
                                var sLabel = '';
                                sLabel = oData.get('nom') + ' ' + oData.get('prenom');
                                sReturn += '<div class="thot-card-user"> <div class="img" style="background-image: url(\'resources/images/' + oData.get('image') + '\')"></div>';
                                if (oData.get('booleen') == 0) {
                                    sReturn += '<div class="content thot-bold-label" style="color: #d50000;">' + sLabel + '</div>';
                                }else{
                                    sReturn += '<div class="content thot-bold-label">' + sLabel + '</div></div>';
                                }
                                return sReturn;
                            },
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'atelier',
                            text: 'atelier',
                            minWidth: 150,
                            tooltip: 'Atelier de la personne',
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'equipe',
                            groupable: true,
                            text: 'Equipe',
                            minWidth: 150,
                            tooltip: 'Equipe de la personne',
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'tpsexigible',
                            text: 'Temps exigible',
                            minWidth: 150,
                            tooltip: 'Temps que la personne doit réaliser',
                            align: 'right',
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'tpspointe',
                            text: 'Temps pointé',
                            tooltip: 'Temps que la personne à réaliser',
                            minWidth: 160,
                            align: 'right',
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'ecartabsolue',
                            text: 'Écart absolu',
                            tooltip: 'Temps que la personne à réaliser',
                            minWidth: 150,
                            align: 'right',
                        },
                        {
                            flex: 1,
                            dataIndex: 'Bullet',
                            xtype: 'widgetcolumn',
                            widget: {
                                xtype: 'sparklinebullet',
                            },
                            align: 'center',
                        }
                    ]
                }, 
                {
                    xtype: 'panel',
                    title: 'Détail journée opérateur',
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                    },
                    height: 260,
                    items:[{
                        xtype: 'container', // mettre en panel pour afficher
                        itemId: 'InformationPersonne',
                        width: 300,
                        defaults: {
                            ui: 'thot-field-compact',
                            value: ''
                        },
                    items: [
                        {
                            xtype: 'container',
                            layout:{
                                type: 'hbox',
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    dataIndex: 'nom',
                                    fieldLabel: 'Nom',
                                    itemId: 'Nom',
                                    margin: '0 5 0 0'
                                },
                                {
                                xtype: 'image',
                                itemId: 'Img',
                                src: '',
                                height: 20,
                                width: 20,
                            }
                        ]
                    },
                    {
                        xtype: 'displayfield',
                        dataIndex: 'equipe',
                        fieldLabel: 'Equipe',
                        itemId: 'Equipe'
                    }, {
                        xtype: 'displayfield',
                        dataIndex: 'poste',
                        fieldLabel: 'Poste',
                        itemId: 'Poste'
                    }, {
                        xtype: 'displayfield',
                        dataIndex: 'atelier',
                        fieldLabel: 'Atelier',
                        itemId: 'Atelier'
                    }, {
                        xtype: 'displayfield',
                        dataIndex: 'tpsexigible',
                        fieldLabel: 'Temps exigible',
                        itemId: 'tempsexiger'
                    }, {
                        xtype: 'displayfield',
                        dataIndex: 'tpsrelever',
                        fieldLabel: 'Temps Pointé',
                        itemId: 'tempspointe'
                    },
                    {
                        xtype: 'displayfield',
                        dataIndex: 'date',
                        fieldLabel: 'Date',
                        itemId: 'date',
                    }]
                },
                { // tabpanel pour affichage des données consolidées et des activités
                    xtype: 'tabpanel',
                    flex: 1,
                    activeTab: 0,
                    items: [
                    {
                        xtype: 'gridpanel',
                        title: 'Activité',
                        flex: 1,
                        itemId: 'InformationPersonneSheetA',
                        reference: 'InformationPersonneSheet',
                        stateful: true,
                        stateId: 'listequipe-informationpersonnesheet',
                        store: {
                            type: 'informationpersonnesheetd'
                        },
                        columns: [{
                            xtype: 'gridcolumn',
                            dataIndex: 'org_libelle',
                            text: 'Atelier',
                            width: 150,
                            tooltip: 'Tâche réalisée',
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'eps_libelle',
                            text: 'Equipe',
                            width: 125,
                            tooltip: 'Tâche réalisée',
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'opn_id',
                            text: 'Opération',
                            width: 150,
                            tooltip: 'Tâche réalisée',
                            renderer: function (_sValue, _oCell, oData) {
                                var sReturn = oData.data.rsc_code;
                                console.log(oData.data);
                                if (oData.data.ald_code == 'RGL') {
                                    sReturn +=
                                        '<div style="float:right; margin-right:10px" class="thot-tag thot-tag-REG">' +
                                        'Réglage' +
                                        '</div>';
                                }
                                return sReturn;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'odf_id',
                            text: 'ODF',
                            width: 100,
                            tooltip: 'Tâche réalisée',
                            align: 'right',
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'pdt_libelle',
                            text: 'Produit',
                            width: 150,
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'libelle',
                            text: 'Tâche',
                            width: 150,
                            tooltip: 'Tâche réalisée',
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'rsc_code',
                            text: 'Machine',
                            width: 150,
                            tooltip: 'Tâche réalisée',
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'datedebut',
                            text: 'Début',
                            width: 150,
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'datefin',
                            text: 'Fin',
                            width: 150,
                        },                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'duree',
                            text: 'Durée',
                            width: 100,
                        }]
                    },
                    // TODO: 'Supprimer les informations users et unload les grilles des personnes'

                    {
                        xtype: 'gridpanel',
                        title: 'Détail consolidé',
                        flex: 1,
                        itemId: 'InformationPersonneSheetD',
                        reference: 'InformationPersonneSheet',
                        stateful: true,
                        stateId: 'listequipe-informationpersonnesheet',
                        store: {
                            type: 'informationpersonnesheet'
                        },
                        columns: [{
                            xtype: 'gridcolumn',
                            dataIndex: 'desig',
                            text: 'Tâche',
                            width: 150,
                            tooltip: 'Tâche réalisée',
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'machine',
                            text: 'Machine',
                            tooltip: 'Machine utilisée',
                            width: 150,
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'tempspointe',
                            text: 'Temps Pointé',
                            tooltip: 'Durée de réalisation de la tâche',
                            align: 'right',
                            width: 150,
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'tempsreglage',
                            text: 'Temps Réglage',
                            tooltip: 'Temps passé aux réglage de la machine',
                            align: 'right',
                            width: 150,
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'tempsreglageallouer',
                            text: 'Temps Réglage Alloué',
                            tooltip: 'Temps alloué au réglage de la machine',
                            align: 'right',
                            width: 200,
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'tempsmachine',
                            text: 'Temps Machine',
                            tooltip: 'Durée d\'utilisation de la machine',
                            align: 'right',
                            width: 160
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'total',
                            text: 'Quantité Total',
                            tooltip: 'Quantité Total',
                            align: 'right',
                        },  
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'bonne',
                            text: 'Quantité bonne',
                            tooltip: 'Quantité Produit',
                            align: 'right',
                        },                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'rebut',
                            text: 'Quantité Rébut',
                            tooltip: 'Quantité rébut',
                            align: 'right',
                        },                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'objectif',
                            text: 'Tps gamme objectif',
                            align: 'right',
                        }]
                    }
                ]
            }
        ]
    }]
});