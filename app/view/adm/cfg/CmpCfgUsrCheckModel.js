Ext.define('Thot.view.adm.cfg.CmpCfgUsrCheckModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.adm.cfg.cmpcfgusrcheck',

    // données spécifiques du formulaire, ici les libellés et informations du formulaire
    data: {
        fieldSetTitle: 'Vérification cohérence opérateurs',
        options: {
            checkUsrStatus: {
                libelle: 'Vérifier la cohérence',
                description: 'Activer/Désactiver la vérification de la cohérence des opérateurs'
            },
            pointagePlanning: {
                libelle: 'Pointage RH / Planning',
                description: 'Vérifier la cohérence entre le pointage RH et le planning quotidien de l\'opérateur.' +
                    '</br><b>Conditions d\'incohérence :</b>' +
                    '</br>le pointage RH en cours est <i>"absent"</i> durant la plage horaire de présence théorique.' +
                    '</br>le pointage RH en cours est <i>"présent"</i> en dehors de la plage horaire de présence théorique ou durant une absence RH déclarée (congés, maladie, etc...)'
            },
            activitePlanning: {
                libelle: 'Activité / Planning',
                description: 'Vérifier la cohérence entre les activités THOT et le planning RH quotidien de l\'opérateur.' +
                    '</br><b>Conditions d\'incohérence:</b>' +
                    '</br>Présence d\'une activité en cours en dehors de la plage horaire de présence théorique ou durant une absence RH déclarée (congés, maladie, etc...).' +
                    '</br>Absence d\'activité en cours durant la plage horaire de présence théorique.'
            },
            activitePointage: {
                libelle: 'Activité / Pointage RH',
                description: 'Vérifier la cohérence entre les activités en cours et le pointage RH.' +
                    '</br><b>Conditions d\'incohérence:</b>' +
                    '</br>Présence d\'activités en cours sans pointage RH <i>"présent"</i>' +
                    '</br>Absence d\'activité en cours avec pointage RH <i>"présent"</i>'
            },
            intervalle: {
                libelle: 'Intervalle de vérification',
                description: 'Indiquer l\'intervalle de vérification de la cohérence des opérateurs (en minutes).' +
                    '</br>Lors de la vérification le volet de la liste des opérateurs en défaut est automatiquement ouvert si celui-ci a été préalablement fermé.' +
                    '</br>En plus de cette vérification programmée, la liste des opérateurs en défaut est automatiquement actualisée à chaque modification de la liste des activités (création ou fin d\'activité)'
            },
            planning: {
                libelle: 'Planning d\'exécution',
                description: 'Sélectionner les jours durant lesquels la vérification doit être réalisée.'
            }
        }
    }

});