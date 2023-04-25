/**
 * @author  Hervé Valot
 * @date    20200414
 * @description vue des activités en cours sous forme de dataview
 * 
 * en prévision d'un affichage atelier pour visualiser les OF réalisés en amont
 * et anticipation des tâches à venir.
 */

Ext.define('Thot.view.act.alt.CmpActCard', {
    extend: 'Ext.panel.Panel',
    xtype: 'cmpactcard',
    cls: "thot-panel",

    requires: [
        'Thot.view.act.alt.CmpActCardController',
        'Thot.view.act.alt.CmpActCardModel',
        'Ext.view.View'
    ],

    controller: 'act-alt-cmpactcard',
    viewModel: {
        type: 'act-alt-cmpactcard'
    },

    layout: 'fit',

    items: [{
            xtype: 'dataview',
            reference: 'dataview',
            scrollable: 'vertical',
            itemSelector: 'div.thot-activity-main-card',
            /**
             * tpl : description HTML du "template" pour l'affichage des informations
             */
            tpl: [
                '<tpl for=".">',
                '   <div class="thot-activity-main-card">',
                '       <div class="thot-activity-card-table">',
                '           <div class="thot-activity-card-tablebody">',
                '               <div class="thot-activity-card-row header">',
                '                   <div class="thot-activity-card-cell">{org_libelle}</div>',
                '                   <div class="thot-activity-card-cell ofnumber rightcol">{odf_code}</div>',
                '               </div>',
                '               <div class="thot-activity-card-row">',
                '                   <div class="thot-activity-card-cell">',
                '                       <div class="thot-bold-label">{pst_libelle}</div > ',
                '                       <div class="thot-bold-label">{pdt_code}</div>',
                '                   </div>',
                '                   <div class="thot-activity-card-cell rightcol">',
                '                       <div class="usrimage" style="background-image: url(resources/images/{rsc_image})"></div>',
                '                   </div>',
                '               </div>',
                '           </div>',
                '       </div>',
                '   </div>',
                '</tpl>'
            ],
            bind: {
                store: '{activitiesS}'
            },
            listeners: {
                itemclick: function (record, item, index, e) {
                    Ext.MessageBox.alert('OF : ' + item.data.odf_code);
                }
            }
        }

    ]
});