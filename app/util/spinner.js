// alternative way using singleton:
Ext.define('Thot.util.Spinner', {
    // singleton: true,
    statics: {
        /**
         * 
         * @param {*} statut 1/0 indique l'état du spinner à appliquer
         * @author  Hervé Valot
         * @date    20190213
         * @description active l'animation du spinner général (ici le logo de l'application) pour visualiser une activité en cours
         */
        spinner: function (statut) {

            // identification de l'objet spinner (id unique dans le DOM)
            // var oSpinner = document.getElementById('spinner');

            if (statut == 1) {
                // animation = on, flash, infinie
                document.getElementById('spinner').className = 'flash animated infinite';
            } else {
                // restaurer l'état statique
                document.getElementById('spinner').className = '';
            }
            return statut;
        }
    }

});