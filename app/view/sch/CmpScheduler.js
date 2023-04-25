/**
 * DEV: 2019-07-18 10:52:02 HVT: préparation module planning pour présenter les travaux planifiés
 *      - à voir avec Philippe, ajouter la possibilité de compléter les informations ordonnancement avec
 *        des informations de production qui peuvent être différentes d'un secteur à l'autre
 */

/**
 * @author      Hervé Valot
 * @description module d'affichage du planning ordonnancement en fonction du service supervisé
 * @version     0.1 développement
 * @date        2019-07-18
 */
Ext.define('Thot.view.sch.CmpScheduler', {
    extend: 'Ext.panel.Panel',
    // extend: 'Sch.panel.SchedulerGrid',
    ui: 'thot-panel',
    xtype: 'scheduler',

    requires: [
        'Thot.view.sch.CmpSchedulerController',
        'Thot.view.sch.CmpSchedulerModel'
    ],

    controller: 'sch-cmpscheduler',
    viewModel: {
        type: 'sch-cmpscheduler'
    },

    html: 'Un de ces jours, il y aura un planning ici :) !'
});