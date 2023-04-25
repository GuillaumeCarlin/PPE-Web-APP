// HVT 18/10/2016, remplacé template DIV par template TABLE ci-après
//var oUserActTplOld = new Ext.XTemplate(
//		'<div class="cellBold"><span class="thot-bold-label">Début :</span>{[Ext.Date.explicitDate(values.act_date_debut)]}</div>',
//		'<div class="cellBold"><span class="thot-bold-label">Equipement :</span>{eqp_code_realise} {eqp_libelle_realise}</div>',
//		'<div class="cellBold"><span class="thot-bold-label">OF :</span>{odf_code} {odf_libelle}</div>',
//		'<div class="cellBold"><span class="thot-bold-label">Op :</span>{opn_code}</div>'
//		);
//var oUserAleaTplOld = new Ext.XTemplate(
//    '<div class="cellBold"><span class="thot-bold-label">Début </span>: {[Ext.Date.explicitDate(values.ala_date_debut)]}</div>',
//    '<div class="cellBold"><span class="thot-bold-label">Equipement </span>: {rqp_libelle}</div>',
//    '<div class="cellBold"><span class="thot-bold-label">Aléa </span>: {ald_libelle}</div>'
//);


var oUserActTpl = new Ext.XTemplate(
    '<table>',
    '<tr>',
    '<td class="thot-bold-label" style="text-align: right">OF :</td>',
    '<td><div class="thot-bold-label thot-maxsized-info ">{odf_code}</div></td>',
    '</tr>',
    '<tr>',
    '<td class="thot-bold-label" style="text-align: right">Op :</td>',
    '<td>{opn_code} {pst_libelle}</td>',
    '</tr>',
    '<tr>',
    '<td class="thot-bold-label" style="text-align: right">Equipement :</td>',
    '<td>{eqp_code_realise} {eqp_libelle_realise}</td>',
    '</tr>',
    '<tr>',
    '<td class="thot-bold-label" style="text-align: right">Début :</td>',
    '<td>{[Ext.Date.explicitDate(values.act_date_debut)]}</td>',
    '</tr>',
    '</table>'
);
var oUserAleaTpl = new Ext.XTemplate(
    '<table>',
    '<tr>',
    '<td class="thot-bold-label" style="text-align: right">Aléa :</td>',
    '<td>{ald_libelle}</td>',
    '</tr>',
    '<tr>',
    '<td class="thot-bold-label" style="text-align: right">Equipement :</td>',
    '<td>{rqp_code_realise}</td>',
    '</tr>',
    '<tr>',
    '<td class="thot-bold-label" style="text-align: right">Début :</td>',
    '<td>{[Ext.Date.explicitDate(values.ala_date_debut)]}</td>',
    '</tr>',
    '</table>'
);


Ext.define('Thot.view.usr.CmpTeamStatus', {
    extend: 'Ext.form.Panel',
    cls: 'thot-panel',
    xtype: 'teamstatus',
    requires: [
        'Thot.view.usr.CmpTeamStatusController',
        'Thot.view.usr.CmpTeamStatusModel',
        'Ext.grid.feature.Grouping',
        'Ext.grid.filters.Filters',
        'Thot.store.usr.TeamStatusS'
    ],
    controller: 'usr-cmpteamstatus',
    viewModel: {
        type: 'usr-cmpteamstatus'
    },
    layout: {
        type: 'border'
    },
    listeners: {
        afterrender: 'onAfterRender',
        gridRefresh: 'onGridRefresh'
    },
    title: 'Statut équipes',
    items: [{
        xtype: 'gridpanel',
        itemId: 'grdTeamStatus',
        plugins: [{
            ptype: 'gridfilters',
            menuFilterText: 'Filtre'
        }],
        region: 'center',
        stateful: true,
        stateId: 'teamstatus-grdTeamStatus',
        flex: 1,
        store: {
            type: 'teamstatus'
        },
        features: [{
            ftype: 'grouping',
            startCollapsed: false,
            groupHeaderTpl: '{columnName}: {name} ({rows.length} Opérateur{[values.rows.length > 1 ? "s" : ""]})',
            hideGroupHeader: true
        }],
        tbar: [{
            xtype: 'button',
            text: 'Actualiser',
            iconCls: 'fa fa-refresh',
            handler: 'gridRefresh'
        }],
        /*
         plugins: [
         {
         ptype: 'rowexpander',
         rowBodyTpl: new Ext.XTemplate(
         '<p>Les chaussetes de l\'archiduchesse</p>',
         '<p>sont passées chez Sosh</p>'
         )
         }
         ],
         */
        columns: [{
            header: 'Opérateur',
            hideable: false,
            dataIndex: 'usr_nom',
            width: 250,
            renderer: function (sValue, oCell, oData) {
                var sReturn = "";
                var sLabel = '';
                sLabel = oData.get('usr_prenom') + ' ' + oData.get('usr_nom');
                if (parseInt(oData.get('coherence')) == 0) {
                    sReturn = '<div class="thot-tag-cell thot-tag-cell-inconsistency"></div>';
                }
                sReturn += '<div class="thot-card-user"> <div class="img" style="background-image: url(\'resources/images/' + oData.get('usr_photo') + '\')"></div>';
                sReturn += '<div class="content thot-bold-label">' + sLabel + '</div></div>'; //class='cellBold'
                return sReturn;
            },
            filter: {
                type: 'string',
                itemDefaults: {
                    emptyText: 'Rechercher ...'
                }
            }
        },
        {
            // indique si l'opérateur est officiellement absent
            dataIndex: 'presence_theorique',
            tooltip: 'Absence déclarée',
            menuDisabled: true,
            hideable: false,
            resizable: false,
            width: 32,
            renderer: function (sValue, oCell, oData) {
                var sReturn = "";
                if (parseInt(oData.get('presence_theorique')) == 0) {
                    sReturn = "<div class='thot-icon-home-medium' data-qtip='Absence déclarée'>&nbsp;</div>";
                } else {
                    sReturn = "";
                }
                return sReturn;
            }
        }, {
            // indique si l'opérateur est censé être présent à l'heure d'actualisation de cette liste
            dataIndex: 'rh_presence_theorique',
            tooltip: 'Présence requise',
            menuDisabled: true,
            hideable: false,
            resizable: false,
            width: 32,
            renderer: function (sValue, oCell, oData) {
                var sReturn = "";
                if (parseInt(oData.get('rh_presence_theorique')) == 0) {
                    sReturn = "";
                } else {
                    sReturn = "<div class='thot-icon-clock-medium' data-qtip='Présence requise'>&nbsp;</div>";
                }
                return sReturn;
            }
        },
        {
            // indicateur de présence, pointage RH
            dataIndex: 'presence',
            tooltip: 'Pointage RH',
            menuDisabled: true,
            hideable: false,
            resizable: false,
            width: 32,
            renderer: function (sValue, oCell, oData) {
                var sReturn = "";
                sReturn = "<div class='thot-icon-logedin-medium' data-qtip='" + oData.get('rh_sensevenement_libelle') + ' à ' + oData.get('rh_dateheureevenement') + "'>&nbsp;</div>";

                if (sValue.toLowerCase() == 'out') {
                    sReturn = "<div class='thot-icon-logedout-medium'  data-qtip='" + oData.get('rh_sensevenement_libelle') + ' à ' + oData.get('rh_dateheureevenement') + "'>&nbsp;</div>";
                }

                return sReturn;
            }
        },
        {
            dataIndex: 'nbactiviteencours',
            tooltip: "Activité en cours",
            menuDisabled: true,
            hideable: false,
            resizable: false,
            width: 32,
            renderer: function (sValue, oCell, oData) {
                var sReturn = "";
                if (parseInt(sValue, 10) > 0) {
                    sReturn = "<div class='thot-act-running-medium icon-green' data-qtip='Activité en cours'></div>";
                    // sReturn = "<div class='thot-icon-activity-medium icon-green' data-qtip='Activité en cours'></div>";
                }
                return sReturn;
            }
        },
        {
            // indicateur de cohérence etre la présence théorique, réelle et l'activité de l'opérateur
            dataIndex: 'coherence',
            tooltip: 'Indicateur de cohérence',
            menuDisabled: false,
            hideable: false,
            resizable: false,
            width: 32,
            renderer: function (sValue, oCell, oData) {
                var sReturn = "";

                if (parseInt(sValue, 10) < 1) {
                    sReturn = "<div class='thot-icon-inconsistency-medium' data-qtip='Incohérence détectée'>&nbsp;</div>";
                }
                return sReturn;
            },
            filter: {
                // activation du filtrage
                type: 'list',
                // forcé par défaut sur les valeurs 0 (incohérent) 
                // possibilité pour l'utilisateur d'afficher toutes les situations
                // mais l'incohérence est prioritaire et donc affichée seule par défaut
                value: 0
            }
        },
        {
            header: 'Equipe',
            groupable: true,
            dataIndex: 'eps_libelle',
            minWidth: 150,
            resizable: false,
            filter: {
                type: 'list'
            }
        },
        {
            header: 'Horaire',
            groupable: true,
            dataIndex: 'rh_heuredebut_hms',
            width: 150,
            resizable: false,
            renderer: function (sValue, oCell, oData) {
                var sReturn = "";
                sReturn = "<div><a class='thot-icon-logedin-small' data-qtip='Entrée théorique'> </a>" + oData.get('rh_heuredebut_hms') + "</div>";
                sReturn += "<div><a class='thot-icon-logedout-small' data-qtip='Sortie théorique'> </a>" + oData.get('rh_heurefin_hms') + "</div>";

                return sReturn;
            }
        },
        {
            header: 'Atelier',
            groupable: true,
            dataIndex: 'org_libelle',
            minWidth: 150,
            flex: 1,
            filter: {
                type: 'list'
            }
        }
        ],
        listeners: {
            itemclick: 'onItemClick'
        },
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: [{
                xtype: 'displayfield',
                itemId: 'nbPresents',
                cls: 'thot-label-indicateur thot-success',
                fieldLabel: 'Présents'
            },
            {
                xtype: 'displayfield',
                itemId: 'nbActifs',
                cls: 'thot-label-indicateur thot-success',
                fieldLabel: 'Actifs'
            },
            {
                xtype: 'displayfield',
                itemId: 'nbInco',
                cls: 'thot-label-indicateur thot-error',
                fieldLabel: 'Incohérents'
            },
            {
                xtype: 'displayfield',
                itemId: 'nbTotal',
                cls: 'thot-label-indicateur thot-standard',
                fieldLabel: 'Total'
            }
            ]
        }]
    },
    {
        xtype: 'panel',
        itemId: 'userAct',
        // ui: 'thot-panel',
        region: 'east',
        width: 400,
        collapsed: true,
        collapsible: true,
        title: 'Détail opérateur',
        items: [{
            xtype: 'fieldset',
            itemId: 'userdet',
            ui: 'thot-fieldset-nostyle',
            html: ''
        },
        {
            xtype: 'gridpanel',
            itemId: 'grdUserAct',
            minHeight: 150,
            store: {
                type: 'useract'
            },
            // viewConfig: {
            //     loadMask: false,
            // },
            columns: [{
                text: 'Activités',
                xtype: 'templatecolumn',
                tpl: oUserActTpl,
                flex: 1
            }]
        },
        {
            xtype: 'gridpanel',
            itemId: 'grdUserAlea',
            minHeight: 150,
            store: {
                type: 'useralea'
            },
            columns: [{
                text: 'Aléa libre',
                xtype: 'templatecolumn',
                tpl: oUserAleaTpl,
                flex: 1
            }]
        }
        ]
    }
    ]
});