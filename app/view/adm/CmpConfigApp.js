/**
 * @author	Hervé VALOT
 * @description	conteneur principal des composants de configuration de l'application
 */
Ext.define('Thot.view.adm.CmpConfigApp', {
    extend: 'Ext.form.Panel',
    xtype: 'configapp',
    // ui: 'thot-main',
    cls: 'thot-panel',

    requires: [
        'Thot.view.adm.CmpConfigAppController',
        'Thot.view.adm.CmpConfigAppModel'
    ],

    controller: 'adm-cmpconfigapp',

    viewModel: {
        type: 'adm-cmpconfigapp'
    },

    layout: 'form',
    scrollable: 'vertical',

    title: 'Configuration de l\'application',

    items: [ // placer ici les différents blocs de configuration de l'application
        { // paramétres de suivi de la cohérence des opérateurs
            xtype: 'adm.cfg.cmpcfgusrcheck',
        },
        { // paramétres de mise à jour des données planning RH des opérateurs
            xtype: 'adm.cfg.cmpcfgupdateuserplanning'
        },
        { // paramétres d'activation du marquage automatique (MARKEM)
            xtype: 'adm.cfg.cmpcfgmarquage'
        },
        { // paramétres d'activation du marquage automatique (MARKEM)
            xtype: 'adm.cfg.cmpcfggom'
        },
        { // paramétres de la tolérance
            xtype: 'adm.cfg.cmpcfgtolerance'
        }
    ]
});