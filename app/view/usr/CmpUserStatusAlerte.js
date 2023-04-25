Ext.define('Thot.view.usr.CmpUserStatusAlerte', {
    extend: 'Ext.form.Panel',
    xtype: 'userstatusalerte',
    // cls: 'x-panel-thot-panel-noborder',
    cls: 'alert-panel left-long-shadow',

    requires: [
        'Thot.view.usr.CmpUserStatusAlerteController',
        'Thot.view.usr.CmpUserStatusAlerteModel',
        'Ext.grid.feature.Grouping',
        'Ext.grid.feature.Summary',
        'Ext.grid.filters.Filters',
        'Thot.store.usr.TeamStatusS'
    ],

    controller: 'usr-cmpuserstatusalerte',
    viewModel: {
        type: 'usr-cmpuserstatusalerte'
    },
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    listeners: {
        afterrender: 'onAfterRender',
        gridRefresh: 'onGridRefresh'
    },
    title: 'Incohérences opérateurs',
    items: [{
        xtype: 'container',
        layout: 'form',
        items: [{
            xtype: 'fieldset',
            layout: 'form',
            collapsible: true,
            padding: 0,
            title: 'Conditions de vérification',
            defaults: {
                ui: 'thot-field-compact'
            },
            items: [{
                xtype: 'displayfield',
                itemId: 'chk_activite_plannning',
                labelWidth: 80,
                fieldLabel: 'Planning / Activité',
                value: '?' // valeur mise à jour par le controlleur
            }, {
                xtype: 'displayfield',
                itemId: 'chk_pointage_activite',
                labelWidth: 80,
                fieldLabel: 'Pointage / Activité',
                value: '?' // valeur mise à jour par le controlleur
            }, {
                xtype: 'displayfield',
                itemId: 'chk_pointage_planning',
                labelWidth: 80,
                fieldLabel: 'Pointage / Planning',
                value: '?' // valeur mise à jour par le controlleur
            }]
        }]
    }, {
        xtype: 'gridpanel',
        itemId: 'grdUserAlerte',
        flex: 1,
        store: {
            type: 'userstatuserror'
        },
        features: [{ // fonctionnalités additionnelles
            ftype: 'grouping',
            startCollapsed: false,
            groupHeaderTpl: '{columnName}: {name} ({rows.length} Opérateur{[values.rows.length > 1 ? "s" : ""]})',
            hideGroupHeader: true
        }],
        plugins: [{ // plugins de la grille
            ptype: 'gridfilters',
            menuFilterText: 'Filtre'
        }],
        // tbar: [{ // barre d'outils supérieure
        //     xtype: 'button',
        //     toolTip: 'Actualiser',
        //     iconCls: 'fa fa-refresh',
        //     handler: 'gridRefresh',
        //     hidden: true
        // }],
        hideHeaders: true,
        columns: [{
                header: 'Opérateur',
                dataIndex: 'usr_nom',
                summaryType: 'count',
                hideable: false,
                groupable: false,
                menuDisabled: false,
                flex: 1,
                // width: 250,
                renderer: function (sValue, oCell, oData) {
                    var sReturn = "";
                    var sLabel = '';
                    var dt = new Date(oData.get('rh_dateheureevenement')).toLocaleString('fr-FR');
                    sLabel = oData.get('usr_prenom') + ' ' + oData.get('usr_nom');
                    // if (parseInt(oData.get('coherence')) == 0) { //bordure latérale rouge, indicateur incohérence
                    //     sReturn = '<div class="thot-tag-cell thot-tag-cell-inconsistency"></div>';
                    // }
                    sReturn += '<div class="thot-card-user"> <div class="img" style="background-image: url(\'resources/images/' + oData.get('usr_photo') + '\')"></div>';
                    sReturn += '<div class="content thot-bold-label" style="color: #d50000;">' + sLabel + '</div>';
                    sReturn += '<div class="content">&nbsp;</div>';
                    // icônes de statut
                    sReturn += '<div class="content">';
                    if (parseInt(oData.get('presence_theorique')) == 0) {
                        sReturn += "<span class='thot-icon-home-medium' style='padding-right:10px;' data-qtip='Absence justifiée'>&nbsp;</span>";
                    } else {
                        // sReturn += "<span class='thot-icon-home-medium' style='padding-right:10px; color:#e8e8e8 !important'>&nbsp;</span>";
                        sReturn += "<span class='thot-icon-clock-medium' style='padding-right:10px;'  data-qtip='Présence requise de ${oData.get('rh_heuredebut_hms').substring(0,8)} à ${oData.get('rh_heurefin_hms').substring(0,8)}'>&nbsp;</span>";
                    }
                    // if (parseInt(oData.get('presence_theorique')) == 0) {
                    //     sReturn += "<span class='thot-icon-clock-medium'  style='padding-right:10px; color:#e8e8e8 !important'>&nbsp;</span>";
                    // } else {
                    //     sReturn += "<span class='thot-icon-clock-medium' style='padding-right:10px;'  data-qtip='Présence requise'>&nbsp;</span>";
                    // }
                    if (oData.get('presence').toLowerCase() == 'out') {
                        // sReturn += "<span class='thot-icon-logedout-medium' style='padding-right:10px;'  data-qtip='" + oData.get('rh_sensevenement_libelle') + ' à ' + oData.get('rh_dateheureevenement') + "'>&nbsp;</span>";
                        sReturn += "<span class='thot-icon-logedout-medium' style='padding-right:10px;'  data-qtip='" + oData.get('rh_sensevenement_libelle') + ' le ' + dt + "'>&nbsp;</span>";
                    } else {
                        // sReturn += "<span class='thot-icon-logedin-medium' style='padding-right:10px;'  data-qtip='" + oData.get('rh_sensevenement_libelle') + ' à ' + oData.get('rh_dateheureevenement') + "'>&nbsp;</span>";
                        sReturn += "<span class='thot-icon-logedin-medium' style='padding-right:10px;'  data-qtip='" + oData.get('rh_sensevenement_libelle') + ' le ' + dt + "'>&nbsp;</span>";
                    }
                    if (parseInt(oData.get('activites_encours'), 10) == 1) {
                        sReturn += "<span class='thot-act-running-medium icon-green' style='padding-right:10px;'  data-qtip='" + (oData.get('arc_nb') > 1 ? oData.get('arc_nb') + ' activités' : '1 activité') + ' en cours' + "'>&nbsp;</span>";
                    } else {
                        sReturn += "<span class='thot-act-running-medium'  style='padding-right:10px; color:#e8e8e8 !important'>&nbsp;</span>";
                    }
                    sReturn += "<span style='padding-left:10px;'>" + oData.get('eps_libelle') + "</span>";
                    sReturn += '</div></div>';
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
                header: 'Atelier',
                hidden: true,
                groupable: true,
                dataIndex: 'org_libelle',
                minWidth: 150,
                filter: {
                    type: 'list'
                }
            }
        ]
    }, {
        xtype: 'displayfield',
        itemId: 'dateupdate',
        labelWidth: 100,
        fieldLabel: 'Données du',
        value: '00/00/0000 00:00:00' // valeur mise à jour par le controlleur
    }]
});