Ext.define('Thot.view.adm.CmpAdmin', {
    extend: 'Ext.form.Panel',
    cls: 'thot-panel',
    xtype: 'appadmin',
    itemId: 'appadmin',
    requires: [
        'Ext.grid.filters.Filters',
        'Ext.grid.column.Action',
        'Thot.view.adm.CmpAdminController',
        'Thot.view.adm.CmpAdminModel'
    ],
    controller: 'adm-cmpadmin',
    viewModel: {
        type: 'adm-cmpadmin'
    },
    listeners: {
        afterrender: 'onAfterRender',
        gridRefresh: 'onGridRefresh',
    },
    layout: {
        type: 'fit',
        align: 'stretch'
    },
    flex: 1,
    items: [{
        xtype: 'tabpanel',
        // ui: 'thot-alternative',
        items: [{
                title: 'Opérateurs',
                itemId: 'userTab',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{ // conteneur gauche, grilles ateliers et tous les opérateurs et bouton d'affectation
                        xtype: 'container',
                        flex: 1,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        items: [
                            // déclaration des composants du conteneur
                            { // grille des ateliers
                                xtype: 'gridpanel',
                                title: 'Sections de production',
                                flex: 1,
                                ui: 'thot-panel-border',
                                margin: '10 5 5 10',
                                itemId: 'SectionGrd',
                                collapsible: true,
                                titleCollapse: true,
                                store: {
                                    type: 'section',
                                    autoLoad: true
                                },
                                listeners: {
                                    //render: 'onUsersSectionRender',
                                    itemclick: 'onUsersSectionSelect'
                                },
                                columns: [{
                                        header: 'Site',
                                        dataIndex: 'ste_libelle',
                                        width: 150,
                                        renderer: function (sValue, oCell, oData) {
                                            var sReturn = sValue + '/' + oData.get('sit_libelle');
                                            return sReturn;
                                        }
                                    },
                                    {
                                        header: 'Code',
                                        dataIndex: 'sab_code',
                                        width: 100
                                    },
                                    {
                                        header: 'Libellé',
                                        dataIndex: 'sab_libelle',
                                        flex: 1
                                        // width: 250
                                    }
                                ]
                            },
                            { // grille de tous les opérateurs
                                xtype: 'gridpanel',
                                title: 'Tous les opérateurs',
                                ui: 'thot-panel-border',
                                margin: '5 5 10 10',
                                flex: 2,
                                itemId: 'usersGrd',
                                collapsible: true,
                                titleCollapse: true,
                                autoScroll: true,
                                selModel: {
                                    mode: 'MULTI'
                                },
                                store: {
                                    type: 'usersmngt',
                                    groupField: 'sab_libelle'
                                },
                                listeners: {
                                    select: 'onUserSelect'
                                },
                                viewConfig: {
                                    getRowClass: function (record, rowIndex, rowParams, store) {
                                        return parseInt(record.get("rsc_estinactif")) ? "thot-deactivated" : "";
                                    }
                                },
                                features: [{
                                    ftype: 'grouping',
                                    startCollapsed: false,
                                    groupHeaderTpl: '{columnName}: {name} ({rows.length} Opérateur{[values.rows.length > 1 ? "s" : ""]})'
                                    //hideGroupHeader: true
                                }],
                                plugins: [{
                                        ptype: 'cellediting',
                                        itemId: 'userEditPlg',
                                        clicksToEdit: 1,
                                        listeners: {
                                            beforeedit: 'onUserBeforeEdit',
                                            edit: 'onUserEdit'
                                        }
                                    },
                                    {
                                        ptype: 'gridfilters',
                                        menuFilterText: 'Filtre'
                                    }
                                ],
                                columns: [ // colonnes de la grille de tous les opérateurs
                                    { // nom et image de l'opérateur
                                        dataIndex: 'usr_nom',
                                        text: 'Nom',
                                        flex: 1,
                                        filter: {
                                            type: 'string',
                                            itemDefaults: {
                                                emptyText: 'Rechercher ...'
                                            }
                                        },
                                        renderer: function (sValue, oCell, oData) {
                                            var sReturn = "";
                                            var sSimultane = "";

                                            sReturn =
                                                '<div class="thot-card-user"> <div class="img" style="background-image: url(\'resources/images/' +
                                                oData.get("rsc_image") +
                                                "')\"></div>";
                                            sReturn +=
                                                '<div class="content thot-bold-label">' +
                                                oData.get('usr_prenom') + ' ' + oData.get('usr_nom') +
                                                "</div></div>"; //class='cellBold'
                                            return sReturn;
                                        }
                                    },
                                    { // login opérateur, si présent, l'opérateur est autorisé à se connecter avec des rôles spécifiques
                                        dataIndex: 'usr_login',
                                        text: 'Login',
                                        width: 100,
                                        editor: {
                                            field: {
                                                xtype: 'textfield'
                                            }
                                        }
                                    },
                                    { // section d'affectation
                                        dataIndex: 'sab_libelle',
                                        text: 'Section',
                                        groupable: true,
                                        width: 200,
                                        renderer: function (sValue, oCell, oData) {
                                            var sReturn = '';

                                            if (sValue !== 'N/D') {
                                                sReturn = sValue;
                                            } else {
                                                sReturn = '<span class="thot-icon-question icon-red">&nbsp;</span>';
                                            }

                                            return sReturn;
                                        },
                                        filter: {
                                            type: 'list',
                                            itemDefaults: {
                                                emptyText: 'Rechercher ...'
                                            }
                                        }
                                    },
                                    // {
                                    //     dataIndex: 'rle_libelle',
                                    //     text: 'Rôle',
                                    //     width: 200
                                    // }
                                ]
                            },
                            { // barre d'outils
                                xtype: 'toolbar',
                                items: [{
                                        xtype: 'tbfill'
                                    },
                                    { // bouton d'affectation
                                        xtype: 'button',
                                        itemId: 'userToSection',
                                        text: 'Affecter le(s) opérateur(s) sélectionnés',
                                        iconCls: 'x-fa fa-chevron-circle-right fa-2x',
                                        iconAlign: 'right',
                                        disabled: true,
                                        handler: 'onUserToSectionClick'
                                    },
                                    {
                                        xtype: 'tbfill'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        flex: 1,
                        layout: 'fit',
                        items: [{ // grille liste des opérateurs de la section sélectionnée
                            xtype: 'gridpanel',
                            ui: 'thot-panel-border',
                            itemId: 'sectionUsersGrd',
                            region: 'center',
                            title: 'Opérateurs de la section',
                            flex: 1,
                            margin: '10 10 10 5',
                            store: {
                                type: 'usersmngt',
                                autoLoad: false,
                                groupField: 'rsc_estinactif'
                            },
                            plugins: [{
                                ptype: 'gridfilters',
                                menuFilterText: 'Filtre'
                            }],
                            features: [{
                                ftype: "grouping",
                                startCollapsed: false,
                                hideGroupedHeader: false,
                                /* cacher la colonne du regroupement */
                                groupHeaderTpl: '({rows.length} Opérateur{[values.rows.length > 1 ? "s" : ""]})'
                            }],
                            listeners: {
                                beforeselect: {
                                    // gestion des lignes ne devant pas être sélectionnées (ressource inutilisable)
                                    // interdit la sélection de la ligne considérée
                                    fn: function (grid, oData) {
                                        if (parseInt(oData.get('rsc_estinactif')) == 1) {
                                            return false;
                                        }
                                    }
                                },
                                rowcontextmenu: 'onSectionUserCtx',
                                // cellClick: 'onSrvUsrListCellClick'
                                /*
                                itemclick: 'onSectionUserSelect',
                                cellClick: 'onSctUsrCellClick',
                                render: 'onSectionUsersRender'
                                */
                            },
                            viewConfig: {
                                getRowClass: function (record, rowIndex, rowParams, store) {
                                    return parseInt(record.get("rsc_estinactif")) ? "thot-dimmed-info" : "";
                                }
                            },
                            columns: [ // colonnes de la grille
                                { // indicateur opérateur inactif (contrat obsolete, information PREMIUM)
                                    text: 'inactif',
                                    menuDisabled: false,
                                    tooltip: 'Inactif</br>Un opérateur inactif est indisponible pour la création d\'activités.</br>Le statut inactif est issu des données Ressources Humaines',
                                    dataIndex: 'rsc_estinactif',
                                    groupable: true,
                                    width: 32,
                                    renderer: function (sValue, oCell, oData) {
                                        var sReturn = '';
                                        if (parseInt(sValue, 10) == 1) {
                                            sReturn = '<div class="thot-icon-usr-inactif-medium" data-qtip="Cette personne n\'est plus sous contrat" data-qalign="bl-tl"> </div>';
                                        }
                                        return sReturn;
                                    }
                                }, { // nom et image
                                    text: 'Nom',
                                    dataIndex: 'usr_nom',
                                    flex: 1,
                                    filter: {
                                        type: 'string'
                                    },
                                    renderer: function (sValue, oCell, oData) {
                                        var sReturn = "";
                                        var sSimultane = "";

                                        sReturn =
                                            '<div class="thot-card-user"> <div class="img" style="background-image: url(\'resources/images/' +
                                            oData.get("rsc_image") +
                                            "')\"></div>";
                                        sReturn +=
                                            '<div class="content thot-bold-label">' +
                                            oData.get('usr_prenom') + ' ' + oData.get('usr_nom') +
                                            "</div></div>"; //class='cellBold'
                                        return sReturn;
                                    }
                                },
                                // {
                                //     text: 'Rôle',
                                //     dataIndex: 'rle_id',
                                //     flex: 1,
                                //     renderer: function (iVal, oCell, oData) {
                                //         var sRender = '<div>' + oData.get('rle_libelle') + '</div>';
                                //         sRender += '<div>' + oData.get('eqe_libelle') + (oData.get('ctt_libelle') !== '' ? ' / ' + oData.get('ctt_libelle') : '') + '</div>';
                                //         return sRender;
                                //     }
                                // },
                                {
                                    /**
                                     * case à cocher, indique si l'opérateur est pris en compte dans le suivi de cohérence
                                     * cohérence, présence/activité/horaires/log premium
                                     */
                                    xtype: 'checkcolumn',
                                    text: 'suivi de cohérence',
                                    dataIndex: 'usr_verifiercoherence',
                                    listeners: {
                                        checkchange: 'onVerifierCoherenceCheck'
                                    },
                                    menuDisabled: true,
                                    tooltip: 'vérifier la cohérence utilisateur',
                                    resizable: false,
                                    width: 32
                                }

                            ]
                        }]
                    }
                ]
            },
            { // gestion des équipements 
                title: 'Equipements',
                itemId: 'workStnTab',
                layout: {
                    align: 'stretch',
                    type: 'hbox'
                },
                listeners: {
                    //render: 'onWorkStnRender'
                },
                items: [ // conteneur gauche, grilles ateliers, tous les équipements et bouton d'affectation
                    {
                        xtype: 'container',
                        flex: 1,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        items: [ // composants du container gauche
                            { // Grille des sections de production
                                xtype: 'gridpanel',
                                ui: 'thot-panel-border',
                                flex: 1,
                                itemId: 'workStnSectionGrd',
                                title: 'Sections de production',
                                margin: '10 5 5 10',
                                store: {
                                    type: 'section',
                                    autoLoad: true
                                },
                                listeners: {
                                    //render: 'onWorkStnSectionRender',
                                    itemclick: 'onWorkStnSectionSelect'
                                },
                                columns: [{
                                        header: 'Site',
                                        dataIndex: 'ste_libelle',
                                        width: 150,
                                        renderer: function (sValue, oCell, oData) {
                                            var sReturn = sValue + '/' + oData.get('sit_libelle');
                                            return sReturn;
                                        }
                                    },
                                    {
                                        header: 'Code',
                                        dataIndex: 'sab_code',
                                        width: 100
                                    },
                                    {
                                        header: 'Libellé',
                                        dataIndex: 'sab_libelle',
                                        flex: 1
                                    }
                                ]
                            },
                            { // grille de tous les équipements
                                xtype: 'gridpanel',
                                ui: 'thot-panel-border',
                                title: 'Tous les équipements',
                                margin: '5 5 10 10',
                                flex: 2,
                                itemId: 'workStnGrd',
                                selModel: {
                                    mode: 'MULTI'
                                },
                                store: {
                                    type: 'workstn'
                                },
                                listeners: {
                                    itemclick: 'checkWstnTrsEnable'
                                },
                                plugins: 'gridfilters',
                                features: [{
                                    ftype: 'grouping',
                                    startCollapsed: false,
                                    groupHeaderTpl: '{columnName}: {name} ({rows.length} Equipement{[values.rows.length > 1 ? "s" : ""]})'
                                    //hideGroupHeader: true
                                }],
                                columns: [{
                                        dataIndex: 'rsc_code',
                                        text: 'Code',
                                        width: 200,
                                        filter: {
                                            type: 'string'
                                        }
                                    },
                                    {
                                        dataIndex: 'rsc_libelle',
                                        text: 'Libellé',
                                        width: 200,
                                        filter: {
                                            type: 'string'
                                        },
                                    },
                                    {
                                        dataIndex: 'sab_libelle',
                                        text: 'Section',
                                        flex: 1,
                                        renderer: function (sValue, oCell, oData) {
                                            var sReturn = '';

                                            if (sValue !== 'N/D') {
                                                sReturn = sValue;
                                            } else {
                                                sReturn = '<span class="thot-icon-question icon-red">&nbsp;</span>';
                                            }

                                            return sReturn;
                                        }
                                    }
                                ]
                            },
                            { // barre d'outils
                                xtype: 'toolbar',
                                items: [{
                                        xtype: 'tbfill'
                                    },
                                    { // bouton d'affectation
                                        xtype: 'button',
                                        itemId: 'wkstnToSection',
                                        text: 'Affecter le(s) équipements(s) sélectionnés',
                                        iconCls: 'x-fa fa-chevron-circle-right fa-2x',
                                        iconAlign: 'right',
                                        disabled: true,
                                        handler: 'onWkstnToSectionClick'
                                    },
                                    {
                                        xtype: 'tbfill'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        flex: 1,
                        layout: 'fit',
                        items: [{
                            /** Grille des équipements de la section de production sélectionnée */
                            xtype: 'gridpanel',
                            ui: 'thot-panel-border',
                            title: 'Equipements de la section',
                            itemId: 'sectionWstnGrd',
                            flex: 1,
                            margin: '10 10 10 5',
                            store: {
                                type: 'workstn',
                                autoload: false
                            },
                            plugins: 'gridfilters',
                            listeners: {
                                rowcontextmenu: 'onSectionWstnCtx',
                                celldblclick: 'onCellDblClick'
                            },
                            columns: [{
                                    dataIndex: 'rsc_code',
                                    text: 'Code',
                                    width: 100,
                                    filter: {
                                        type: 'string'
                                    },
                                },
                                {
                                    dataIndex: 'rsc_libelle',
                                    text: 'Libellé',
                                    flex: 1
                                },
                                // DEV: 2019-03-04 17:20:50 HVT, colonne actions pour gestion de l'équipement
                                {
                                    xtype: 'actioncolumn',
                                    width: 32,
                                    menuDisabled: true,
                                    sortable: false,
                                    resizable: false,
                                    items: [{
                                        /* éditer les paramètres de l'équipement */
                                        iconCls: 'x-fa thot-icon-edit',
                                        // glyph: 'xf044@FontAwesome',
                                        handler: 'onEditEqp',
                                        tooltip: 'Paramètres de l\'équipement'
                                    }]
                                }, { // indicateur paramétrage non défini
                                    dataIndex: 'prmnok',
                                    text: '',
                                    tooltip: 'Indicateur de défaut de paramétrage',
                                    width: 32,
                                    renderer: function (sValue, oCell, oData) {
                                        var sReturn = '';
                                        if (parseInt(oData.get('prmnok')) == 1) {
                                            sReturn = '<div class="thot-icon-prmnok-medium icon-warning" data-qtip="Paramétrage non défini." data-qalign="bl-tl"></div>';
                                        }
                                        return sReturn;
                                    }
                                }
                            ]
                        }]
                    }
                ]
            },
            { // gestion des sections
                title: 'Sections',
                itemId: 'sectionTab',
                ui: 'thot-panel-border',
                margin: '5 5 5 5',
                layout: {
                    align: 'stretch',
                    type: 'vbox'
                },
                items: [{
                    xtype: 'gridpanel',
                    itemId: 'sectionGrd',
                    flex: 1,
                    store: {
                        type: 'section'
                    },
                    columns: [{
                            dataIndex: 'ste_libelle',
                            text: 'Société',
                            width: 200,
                            filter: {
                                type: 'text'
                            }
                        },
                        {
                            dataIndex: 'sit_libelle',
                            text: 'Site',
                            width: 200,
                            filter: {
                                type: 'text'
                            }
                        },
                        {
                            dataIndex: 'sab_libelle',
                            text: 'Section',
                            width: 200,
                            filter: {
                                type: 'text'
                            }
                        }
                    ]
                }]
            },
            {
                title: 'FPS',
                itemId: 'fpsTab',
                layout: 'border',          
                items:[
                    {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    region: 'center',
                    items:[{
                        xtype: 'gridpanel',
                        itemId: 'fpsGrid',
                        title: 'Liste des FPS',
                        features: [{
                            ftype: 'grouping',
                            startCollapsed: false,
                            hideGroupedHeader: false,
                            groupHeaderTpl: '{columnName}: {name} ({rows.length} Activité{[values.rows.length > 1 ? "s" : ""]})'
                        }],
                        header:{
                            items:[
                                {
                                xtype: 'button',
                                itemId: 'btnFPSAjout',
                                iconCls: 'x-fa fa-plus',
                                enableToggle: true,
                                tooltip: 'Ajouter FPS',
                                margin: '0 10 0 0',
                                listeners:{
                                    click: 'NewFPS'
                                },
                            },
                            {
                                xtype: 'button',
                                itemId: 'btnFPSSupprimer',
                                iconCls: 'x-fa fa-minus',
                                enableToggle: true,
                                tooltip: 'Supprimer un FPS',
                                margin: '0 10 0 0',
                                disabled: true,
                                listeners:{
                                    click: 'DelFPS'
                                },
                            },
                        ]
                        },
                        listeners:{
                            select: 'onFPSSelect',
                            Refresh: 'GridFpsRefresh'

                        },
                        flex: 2,
                        height: 500,
                        margin: '5 10 5 5',
                        store: {
                            type: 'fichepsstore'
                        },
                        columns: [
                            {
                                dataIndex: 'fps_code',
                                text: 'Code du FPS',
                                flex: 1,
                            },
                            {
                                dataIndex: 'fpg_libelle',
                                text: 'Type',
                                flex: 1,
                            },
                            {
                                dataIndex: 'fps_chemin',
                                text: 'chemin d\'accès',
                                flex: 3,
                            }
                        ]
                    }
                    ,{
                        xtype: 'container',
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        flex: 2,
                        items:[                        
                        {
                            xtype: 'gridpanel',
                            itemId: 'eqpGrid',
                            title: 'Liste Équipement',
                            height: 300,
                            margin: '10 10 10 10',
                            store: {
                                type: 'aqtfpsstore'
                            },
                            listeners:{
                                select: 'onFPSEqtSelect',
                                gridRefresh: 'onGridRefresh',
                                Refresh: 'GridEqtRefresh'
                            },
                            header: {
                                items:[
                                    {
                                        xtype: 'button',
                                        itemId: 'btnEqtAjout',
                                        iconCls: 'x-fa fa-plus',
                                        enableToggle: true,
                                        tooltip: 'Ajoute un équipement liée à la FPS',
                                        margin: '0 10 0 0',
                                        listeners:{
                                            click: 'NewEqt',
                                        },
                                        disabled: true,
                                    },
                                    {
                                        xtype: 'button',
                                        itemId: 'btnEqtSupprimer',
                                        iconCls: 'x-fa fa-minus',
                                        enableToggle: true,
                                        tooltip: 'Supprimer un équipement de la FPS',
                                        margin: '0 10 0 0',
                                        listeners:{
                                            click: 'DelEqt'
                                        },
                                        disabled: true
                                    }
                                ]
                            },
                            columns: [
                                {
                                    dataIndex: 'rsc_code',
                                    text: 'Code de l\'équipement',
                                    flex: 1,
                                },
                                {
                                    dataIndex: 'rsc_libelle',
                                    text: 'Machine',
                                    flex: 1,
                                },
                                {
                                    dataIndex: 'org_libelle',
                                    text: 'Secteur',
                                    flex: 1,
                                },
                                {
                                    dataIndex: '',
                                    text: 'GMAO',
                                    flex: 1,
                                }
                            ]
                        },
                        {
                            xtype: 'gridpanel',
                            itemId: 'personneGrid',
                            listeners:{
                                select: 'onFPSUserSelect',
                                gridRefresh: 'onGridRefresh',
                                Refresh: 'GridUsrRefresh'
                            },
                            title: 'Liste Signature',
                            header: {
                                items:[
                                    {
                                        xtype: 'button',
                                        itemId: 'btnUserAjout',
                                        iconCls: 'x-fa fa-user-plus',
                                        enableToggle: true,
                                        disabled: true,
                                        tooltip: 'Ajoutée une nouvelle personne à la FPS',
                                        listeners:{
                                            click: 'NewUsr'
                                        },
                                        margin: '0 10 0 0'
                                    },
                                    {
                                        xtype: 'button',
                                        itemId: 'btnUserSupprimer',
                                        iconCls: 'x-fa fa-user-times',
                                        enableToggle: true,
                                        disabled: true,
                                        tooltip: 'Supprimer un signataire de la FPS',
                                        listeners:{
                                            click: 'DelUser'
                                        },
                                    }
                                ]
                            },
                            height: 300,
                            margin: '10 10 10 10',
                            store: {
                                type: 'userfpsstore'
                            },
                            
                            columns: [{
                                    dataIndex: 'nom',
                                    text: 'Nom',
                                    flex: 1,
                                },
                                {
                                    dataIndex: 'org_libelle',
                                    text: 'Secteur',
                                    flex: 1,
                                },
                                {
                                    dataIndex: 'fpu_date',
                                    text: 'Date Signature',
                                    flex: 1,
                                }
                            ]
                        }]
                    }
                ]},
                {
                    xtype: 'panel', //Mettre container si panel ne fonctionne pas
                    itemId: 'pdfPanel',
                    title: 'PDF',
                    items:{
                        xtype: 'component',
                        itemId: 'pdfview',
                        html: '<iframe src="" width="100%" height="100%"></iframe>',
                        flex: 1,
                        height: 650,
                    },
                    collapsible: true,
                    collapseDirection: 'right',
                    titleCollapse: false,
                    headerPosition: 'left',
                    animCollapse: false,
                    hideCollapseTool: true,
                    width: 500,
                    region: 'east',
                    split: true,
                }
            ]
            }
        ]
    }]
});