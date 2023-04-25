/**
 * @author  Hervé Valot
 * @description fonctions communes de gestion des autorisations utilisateur
 */
Ext.define('Thot.com.util.Acl', {
    singleton: true,

    /**
     * @author  Hervé Valot
     * @description vérifie les droits d'un utilisateur sur une vue de l'application
     * @description vrifie les autorisations dans l'objet Thot.app.appConfig.process 
     * @param {string} view nom de la vue sur laquelle vérifier les droits de l'utilisateur 
     * @returns {boolean} true = utilisateur autorisé, false = non
     */
    isUserAllowed: function (view) {
        /**
         * option pécimiste, l'utilisateur n'a pas les droits sur le formulaire demandé
         * pas d'utilisateur connecté, refuser les autorisations
         * si la vue n'est pas dans l'objet c'est que c'est un oubli administrateur
         * la fonction retourne 'false'
         * principe de sécurité, si on demande l'autorisation c'est que le formulaire est sensible
         * on refuse donc l'accès par défaut sauf si le formulaire est explicitement autorise
         * pour l'utilisateur connecté
         */
        var bAuth = false;

        // si la vue demandée est dans l'objet thot.app.appConfig.process
        if (Thot.app.appConfig.process[view]) {
            // et si l'utilisateur connecté est autorisé 
            if (Thot.app.appConfig.process[view].users.indexOf(Thot.app.cnxParams.login) > -1) {
                // alors l'utilisateur peut utiliser le formulaire
                bAuth = true;
            }
        }

        return bAuth;
    }
});