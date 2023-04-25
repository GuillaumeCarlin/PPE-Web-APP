Ext.define('Thot.view.adm.cfg.CmpCfgGOMModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.adm.cfg.cmpcfggom',

    // données spécifiques du formulaire, ici les libellés et informations du formulaire
    data: {
        fieldSetTitle: 'Transfert d\'informations contrôle SPC',
        options: {
            activation: {
                libelle: 'Activer le transfert d\'informations',
                description: 'Activer/Désactiver la création du fichier informations production' +
                    '</br><b>Portée :</b>' +
                    '</br>le fichier d\'informations production est généré si l\'équipement utilisé produit des pièces finies' +
                    '</br>Cette option peut être activée dans le gestionnaire de configuration des équipements.'
            },
            rootfolder: {
                libelle: 'Dossier racine',
                description: 'Définir le chemin du dossier racine des fichiers d\'information production' +
                    '</br><b>Important :</b>' +
                    '</br>La modification de ce paramètre doit être réalisée par un administrateur du système SPC GOM.' +
                    '</br>Le dossier indiqué doit exister.' +
                    '</br>Le compte de service de l\'application doit avoir les droits en lecture/écriture sur ce dossier' +
                    '</br>utiliser des / pour les séparateurs du chemin, ne pas utiliser les \\.' +
                    '</br>Ne pas ajouter de / de terminaison en fin de chemin.'

            }
        }
    }

});