Ext.define('Thot.view.adm.cfg.CmpCfgToleranceModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.adm.cfg.cmpcfgtolerance',

    // données spécifiques du formulaire, ici les libellés et informations du formulaire
    data: {
        fieldSetTitle: 'Mise à jour des valeurs de Tolérance',
        options: {
            activation: {
                libelle: 'Activer la tolérance asymétrique ',
                description: 'La tolérance symétrique permet de ne pas attribuer le même temps de tolérance Maximum et Minimum'
            },
            toleranceS: {
                libelle: 'Intervalle de tolérance',
                description: 'Indiquer l\'intervalle de tolérance souhaiter'
            },
            toleranceAMax: {
                libelle: 'Intervalle de tolérance Maximum',
                description: 'Indiquer l\'intervalle de tolérance Maximum souhaiter'
            },
            toleranceAMin: {
                libelle: 'Intervalle de tolérance Minimum',
                description: 'Indiquer l\'intervalle de tolérance Minimum souhaiter'
            }
        }
    }

});