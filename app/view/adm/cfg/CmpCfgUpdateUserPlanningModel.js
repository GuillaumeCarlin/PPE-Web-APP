Ext.define('Thot.view.adm.cfg.CmpCfgUpdateUserPlanningModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.adm.cfg.cmpcfgupdateuserplanning',

    // données spécifiques du formulaire, ici les libellés et informations du formulaire
    data: {
        fieldSetTitle: 'Mise à jour des données RH opérateur',
        options: {
            activation: {
                libelle: 'Activer la mise à jour',
                description: 'Activer/Désactiver la mise à jour des données RH des opérateurs' +
                    '</br><b>Données actualisées :</b>' +
                    '<ul>' +
                    '    <li>Equipe (Nuit/matin/Après-midi/Journée</li>' +
                    '    <li>Temps exigible</li>' +
                    '    <li>Absence planifiée</li>' +
                    '</ul>'
            },
            intervalle: {
                libelle: 'Intervalle de mise à jour',
                description: 'Indiquer l\'intervalle de mise à jour (en minutes).'
            },
            planning: {
                libelle: 'Planning d\'exécution',
                description: 'Sélectionner les jours durant lesquels la vérification doit être réalisée.'
            }

        }
    }

});