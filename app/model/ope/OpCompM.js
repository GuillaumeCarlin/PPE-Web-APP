/**
 * @author Hervé Valot
 * @description Modèle des opérations complémentaires
 * @description magasin d'opérations utilisables pour la création des opérations non planifiées
 */
Ext.define('Thot.model.ope.OpCompM', {
    extend: 'Ext.data.Model',

    fields: [{ // identifiant
            name: 'opc_id',
            type: 'int'
        },
        { // rang dans la série
            name: 'opc_rang',
            type: 'int'
        },
        { // code
            name: 'opc_code',
            type: 'string'
        },
        { // base, les données de base ne peuvent pas être supprimées
            name: 'opc_base',
            type: 'int'
        },
        { // libellé
            name: 'opc_libelle',
            type: 'string'
        },
        { // inactif, option désactivée
            name: 'opc_estinactif',
            type: 'int'
        }
    ]
});