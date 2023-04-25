Ext.define('Thot.store.ope.OperationsS', {
    extend: 'Ext.data.Store',
    model: 'Thot.model.ope.OperationsM',
    alias: 'store.operations',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'server/ope/Operations.php?action=LstWorkStnOpe',
        method: 'POST',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'liste',
            idProperty: 'opn_id',
            totalProperty: 'NbreTotal'
        }
    },
    filters: [
        /* hvt: 2017/02/07
            le store contient par défaut l'ensemble des opérations planifiées, alternatives et actives (activité en cours) pour l'équipement demandé
            il faut pouvoir le filtrer pour n'afficher que les informations nécessaires :
            - mode assistance ON -> que les opérations actives
            - mode assistance OFF
                - opérations alternatives ON -> filtre en cours + opérations alternatives
                - opérations actives ON -> filtre en cours + opérations actives
         */
        { // filtre par défaut, n'affiche que les opérations planifiées
            property: 'priorite',
            value: 2
        },
        { // exclusion des activités en cours
            property: 'encours',
            value: 0
        },
        {
            // exclusion des op terminées
            property: 'opn_estterminee',
            value: 0
        }
    ]
});