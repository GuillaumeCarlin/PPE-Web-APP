//HVT 18/10/2016, remplacé template DIV par template TABLE ci-après
//var oHistoTplold = new Ext.XTemplate(
//      '<div class="cellBold"><span class="thot-bold-label">Of </span>: {odf_code} {odf_libelle} <span class="thot-bold-label">Qté lancée </span>: {odf_quantite_lancee}</div>',
//      '<div class="cellBold"><span class="thot-bold-label">Op </span>: {opn_code} <span class="thot-bold-label">Qté bonne </span>: {qte_bon} <span class="thot-bold-label">Qté rebut </span>: {qte_qrbt}</div>',
//          '<div class="cellBold"><span class="thot-bold-label">Poste </span>: {pst_libelle}</div>',
//      '<div class="cellBold"><span class="thot-bold-label">Equipement </span>: {eqp_code_realise} {eqp_libelle_realise}</div>',
//      '<div class="cellBold"><span class="thot-bold-label">Opérateur </span>: {usr_prenom} {usr_nom}</div>'
//);

var oHistoTpl = new Ext.XTemplate(
    '<table>',
    '<tr >',
    '<td class="thot-bold-label" style="text-align: right">Début :</td>',
    '<td style="min-width: 120px">{date_debut}</td>',
    '<td class="thot-bold-label" style="text-align: right">Atelier :</td>',
    '<td style="min-width: 250px">{org_libelle}</td>',
    '<td class="thot-bold-label" style="text-align: right">OF :</td>',
    '<td style="min-width: 150px">{odf_code}</td>',
    '<td class="thot-bold-label" style="text-align: right">Qté lancée :</td>',
    '<td style="min-width: 100px">{odf_quantite_lancee}</td>',
    '</tr>',
    '<tr>',
    '<td class="thot-bold-label" style="text-align: right">Fin :</td>',
    '<td>{date_fin}</td>',
    '<td class="thot-bold-label" style="text-align: right">Opérateur :</td>',
    '<td>{usr_prenom} {usr_nom}</td>',
    '<td class="thot-bold-label" style="text-align: right">Op :</td>',
    '<td>{opn_code}</td>',
    '<td class="thot-bold-label" style="text-align: right">Qté bonne :</td>',
    '<td>{qte_bon}</td>',
    '</tr>',
    '<tr>',
    '<td></td>',
    '<td></td>',
    '<td class="thot-bold-label" style="text-align: right">Equipement :</td>',
    '<td>{eqp_code_realise} {eqp_libelle_realise}</td>',
    '<td class="thot-bold-label" style="text-align: right">Poste :</td>',
    '<td>{pst_libelle}</td>',
    '<td class="thot-bold-label" style="text-align: right">Qté rebut :</td>',
    '<td class="icon-error">{qte_qrbt}</td>',
    '</tr>',
    '</table>'
);

Ext.define('Thot.view.act.CmpHistoAct', {
    extend: 'Ext.form.Panel',
    xtype: 'histoact',
    // ui: 'thot-panel',
    cls: 'thot-panel',

    requires: [
        'Thot.view.act.CmpHistoActController',
        'Thot.view.act.CmpHistoActModel'
    ],
    controller: 'act-cmphistoact',
    viewModel: {
        type: 'act-cmphistoact'
    },
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    listeners: {
        afterrender: 'onAfterRender',
        gridRefresh: 'onGridRefresh'
    },
    title: 'Historique',
    items: [{
        xtype: 'gridpanel',
        itemId: 'grdHisto',
        //margin: '0 0 0 5',
        flex: 1,
        autoScroll: true,
        store: {
            type: 'acthisto'
        },
        tbar: [{
            xtype: 'segmentedbutton',
            itemId: 'histoNbLines',
            selectedValue: 25,
            items: [{
                    text: '25 dernières',
                    nblines: 25,
                    pressed: true
                },
                {
                    text: '50 dernières',
                    nblines: 50
                },
                {
                    text: '75 derniéres',
                    nblines: 75
                }
            ],
            listeners: {
                toggle: 'onHistoNbLinesSel'
            }
        }],
        columns: [{
            text: 'Activité',
            xtype: 'templatecolumn',
            tpl: oHistoTpl,
            flex: 1
        }]
    }]
});