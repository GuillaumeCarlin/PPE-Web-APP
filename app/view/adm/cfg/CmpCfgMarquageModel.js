Ext.define('Thot.view.adm.cfg.CmpCfgMarquageModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.adm.cfg.cmpcfgmarquage',

    // données spécifiques du formulaire, ici les libellés et informations du formulaire
    data: {
        fieldSetTitle: 'Marquage automatique (MARKEM)',
        options: {
            activation: {
                libelle: 'Activer le marquage',
                description: 'Activer/Désactiver le message de demande de marquage' +
                    '</br><b>Portée :</b>' +
                    '</br>le message de demande de marquage est transmis au service de gestion du marquage pour les équipements disposant d\'une imprimante compatible' +
                    '</br>Cette option peut être activée dans le gestionnaire de configuration des équipements.'
            },
            rootfolder: {
                libelle: 'Dossier racine',
                description: 'Définir le chemin du dossier racine des fichiers déclencheurs' +
                    '</br><b>Important :</b>' +
                    '</br>La modification de ce paramètre doit être réalisée par un administrateur CoLOS.' +
                    '</br>Le dossier indiqué doit exister.' +
                    '</br>Le compte de service de l\'application doit avoir les droits en lecture/écriture sur ce dossier' +
                    '</br>utiliser des / pour les séparateurs du chemin, ne pas utiliser les \\.' +
                    '</br>Ne pas ajouter de / de terminaison en fin de chemin.'

            }
        }
    }

});