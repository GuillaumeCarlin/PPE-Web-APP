Ext.define('Thot.view.adm.cmp.CmpMgrActivityCombine', {
    extend: 'Ext.grid.Panel',
    xtype: 'cmpmgractivitycombine',

    /**
     * @author  Hervé Valot
     * @date    20190417
     * @description     composant pour la gestion des combinaisons d'activités (administration)
     *                  l'administrateur peut définir sur chaque niveau de l'arborescence organisation
     *                  quel type d'activité peut être créé si un certain type est déja en cours pour un opérateur donné
     *                  l'administrateur peut définir plusieurs combinaisons (uniques sur le niveau)
     *                  les combinaisons sont bidirectionnelles, si l'admin autorise la création du type 2 à partir du type 1 alors type 1 depuis type 2 est autorisé
     * @version 20190417
     *
     */

    requires: [
        'Thot.view.adm.cmp.CmpMgrActivityCombineController',
        'Thot.view.adm.cmp.CmpMgrActivityCombineModel'
    ],

    controller: 'adm-cmp-cmpmgractivitycombine',
    viewModel: {
        type: 'adm-cmp-cmpmgractivitycombine'
    },

    html: 'Hello, World!! on va définir les combinaisons de types d\'activités',
    // définition de la barre d'outils supérieure
    tbar: [{
        text: 'Ajouter une combinaison',
        handler: 'onAddClick'
    }],
    // les plugins de la grille
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    // fonctionnalités additionnelles
    features: [{
        ftype: 'grouping'
    }],
    // définition du store
    store: {
        model: 'Thot.model.adm.ActCombineM'
    },
    // les colonnes de la grille
    columns: [{
            header: 'Niveau de l\'organisation',
            groupable: true,
            minWidth: 150,
            dataIndex: 'sab_libelle',
            editor: {
                xtype: 'combobox',
                store: {
                    type: 'section',
                    autoLoad: true
                }
            }
        },
        {
            header: 'Type activité en cours',
            groupable: true,
            minWidth: 150,
            editor: {
                xtype: 'combobox',
                store: [
                    [1, 'Production'],
                    [2, 'Qualité'],
                    [3, 'Non planifié'],
                    [4, 'Hors production']
                ]
            }
        },
        {
            header: 'Type activité cible',
            groupable: true,
            minWidth: 150,
            editor: {
                xtype: 'combobox',
                store: [
                    [1, 'Production'],
                    [2, 'Qualité'],
                    [3, 'Non planifié'],
                    [4, 'Hors production']
                ]
            }
        }

    ]
});