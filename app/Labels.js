/** 
 * @author Hervé VALOT
 * @description Classe Singleton de définition des libellés de l'application
 */
Ext.define('Thot.Labels', {
    singleton: true,

    actions: {
        selectWorkshop: {
            text: 'Sélectionner les ateliers à superviser',
            tooltip: 'Sélection des ateliers à superviser',
            title: 'Sélection des ateliers à superviser'
        },
        listWorkshop: {
            text: 'Liste des ateliers supervisés',
            tooltip: 'Liste des ateliers supervisés'
        },
        newNote: {
            text: 'Rédiger une nouvelle note',
            tooltip: 'Rédiger une nouvelle note',
            title: 'Nouvelle note'
        },
        login: {
            text: 'Connexion',
            tooltip: 'Authentification utilisateur',
        },
        logout: {
            text: 'Déconnexion',
            tooltip: 'Déconnexion'
        },
        help: {
            text: 'Documentation utilisateur',
            tooltip: 'Documentation utilisateur'
        },
        fullscreen: {
            text: 'Affichage plein écran',
            tooltip: 'Affichage plein écran'
        },
        checkWSS: {
            text: 'Statut du serveur Websocket',
            tooltip: 'Statut du serveur Websocket'
        },
        NewKeyAPK: {
            text: 'Ajouter une nouvelle clé',
            tooltip: 'Ajouter une nouvelle clé',
            title: 'Ajouter une nouvelle clé'
        },
        NewFPS: {
            text: 'Ajouter un nouveau Signataire',
            tooltip: 'Ajouter un nouveau Signataire',
            title: 'Ajouter un nouveau Signataire'
        },
    },
    labels: {
        dashboard: {
            text: 'Tableau de bord',
            tooltip: 'Tableau de bord'
        },
        activities: {
            text: 'Activités',
            tooltip: 'Liste des activités en cours'
        },
        alerts: {
            text: 'Alertes',
            tooltip: 'Liste des alertes de production',
            title: 'Alertes [les 100 dernières]',
            detail: 'Détail de l\'alerte'
        },
        notes: {
            text: 'Notes',
            tooltip: 'Liste des notes utilisateurs'
        },
        search: {
            text: 'Recherche',
            tooltip: 'Recherche OF'
        },
        consolidatedData: {
            text: 'Données consolidées',
            tooltip: 'Données atelier consolidées'
        },
        history: {
            text: 'Historique',
            tooltip: 'Historique/Correction des activités de production'
        },
        import: {
            text: 'Import',
            tooltip: 'Import des données de production'
        },
        parameters: {
            text: 'Paramètres',
            tooltip: 'Gestion des paramètres de l\'application'
        },
        config: {
            text: 'Configuration',
            tooltip: 'Configuration de l\'application'
        },
        analyse:{
            text: "Statistique",
            tooltip: "Statistique sur le temps de travail"
        },
        api:{
            text: 'Gestion d\'API',
            tooltip: 'Gestion des Clés d\'API'
        },
        about: 'A propos de',
        version: 'Version',
        revision: 'Revision',
        date: 'Date',
        authentification: 'Authentification',
        alertobject: {
            text: 'Objet de l\'alerte',
            tooltip: 'description de l\'alerte'
        },
        workday: {
            shorttext: 'Journée',
            longtext: 'Journée de travail',
            tooltip: 'Journée de travail de 05h00 jour J à 05h00 jour J+1'
        },
        alertdate: {
            text: 'Déclenchement',
            tooltip: 'Date/Heure de déclenchement de l\'alerte'
        },
        equipement: {
            text: 'Equipement',
            tooltip: 'Equipement de production'
        },
        user: {
            text: 'Opérateur',
            tooltip: 'Opérateur'
        },
        workshop: {
            text: 'Atelier',
            tooltip: 'Atelier de production'
        },
        workorder: {
            text: 'OF',
            tooltip: 'Ordre de fabrication'
        },
        operation: {
            text: 'OP',
            tooltip: 'Opération de fabrication'
        },
        product: {
            text: 'Produit',
            identifiant: 'Identifiant produit',
            tooltip: 'Produit'
        }
    },
    messages: {
        errorlogin: 'Login ou mot de passe incorrect !',
        noworkshop: 'Aucun atelier à superviser défini',
        multipleworkshop: 'Sélection multiple',
        nowss: 'La connexion au serveur de synchronisation n\'a pas pu étre établie.</br>L\'actualisation automatique est indisponible'
    }
});