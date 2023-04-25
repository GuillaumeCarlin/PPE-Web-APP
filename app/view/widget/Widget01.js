
Ext.define('Thot.view.widget.Widget01',{
    extend: 'Ext.container.Container',
    xtype: 'widget01',

    requires: [
        'Thot.view.widget.Widget01Controller',
        'Thot.view.widget.Widget01Model'
    ],

    controller: 'widget-widget01',
    
    viewModel: {
        type: 'widget-widget01'
    },

    data: { 
        // liste des attributs spécifiques du Widget.
        // ces attributs seront initalisés lors de l'appel du Widget
        titre: '',
        valeur: '',
        couleurValeur: ''
    },

    tpl: [
        // décrit la forme du widget (HTML) et la position des attributs
        '<div><h1>{titre}</h1><span style="font-size: 40px; color: {couleurValeur}">{valeur}</span></div>'
    ]
});
