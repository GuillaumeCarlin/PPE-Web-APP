
Ext.define('Thot.view.tdb.CmpTdb',{
    extend: 'Ext.panel.Panel',
    xtype: 'tdb',

    requires: [
        'Thot.view.tdb.CmpTdbController',
        'Thot.view.tdb.CmpTdbModel'
    ],

    controller: 'tdb-cmptdb',
    viewModel: {
        type: 'tdb-cmptdb'
    },

    items: [
        {
            xtype: 'widget01',
            data: {
                titre: 'Effectif théorique',
                valeur: '12',
                couleurValeur: 'green'
            }
        },
        {
            xtype: 'panel',
            flex: 1,
            items: [
                {
                    xtype: 'cmpactcard'
                }
            ]
        }
    ]
});
