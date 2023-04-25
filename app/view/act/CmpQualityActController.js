// NOTE: HVT 2021-03-29 22:52:08 - Obsolete
/**
 * @author  Hervé Valot
 * @date    2018/12/18
 * @scrum   R1#6
 *
 * @description controlleur de la vue des activités qualité
 *
 * @version 181218 HVT, création
 */
Ext.define('Thot.view.act.CmpQualityActController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.act-cmpqualityact',

    /**
     * @author      Hervé VALOT
     * @function    onAfterRender
     * @memberof    CmpQualityActController
     * @description après rendu de la vue, mise à jour des données de la vue
     */
    onAfterRender: function () {
        var oMe = this; // cet objet
        var oForm = oMe.getView(); // la vue associée
        // var oQualityActivitiesGrid = oForm.query('#grdQualActivities')[0]; // la grille des activités qualité, recherche dans le formualire
        var oQualityActivitiesStore = oForm.getStore(); // le magasin de données
        var oActiveQualityActivities = oForm.query('#activeQualityActivities')[0]; // le champ indicateur du nombre d'activités en cours
        var oSuspendedQualityactivities = oForm.query('#suspendedQualityActivities')[0]; // le champ indicateur des activités suspendues

        // manipulation du store
        oQualityActivitiesStore.on({
            /**
             * @function filterchange
             * @description afficher/masquer le bouton "effacer filtres" en fonction du statut de filtrage de la grille
             * @param   oStore, l'objet Store à surveiller
             * @param   oFilters, l'objet définissant le filtrage
             */
            filterchange: function (oStore, oFilters) {
                var oClearFltBtn = oForm.query('#clearFilters')[0]; // recherche le bouton dans le formulaire par son ID

                if (oFilters.length > 0) {
                    // si il y a des filtres définis, on affiche le bouton
                    oClearFltBtn.show();
                } else {
                    // sinon on le cache
                    oClearFltBtn.hide();
                }
            },
            /**
             * @function    load
             * @description met à jour les indicateurs d'activités en cours / suspendues
             * @param       oStore, l'objet store associé à la vue
             * @param       aRecords, tableau des données à afficher
             */

            /**
             * @todo   renommer la fonction pour correspondre à son fonctionnement, mise à jour indicateurs
             */
            load: function (oStore, aRecords) {
                var iActiveTasks = 0; // nombre de tâches actives, initialisé à 0 avant chargement
                var iSuspendedTask = 0; // nombre de tâches suspendues, initialisé à 0 avant chargement

                // boucle sur les enregistrements pour mise à jour des indicateurs
                for (var iRec in aRecords) {
                    if (aRecords[iRec].get('ala_id') > 0) {
                        // si la tache est sous aléa on incrémente le compteur tâche inactive
                        iSuspendedTask++;
                    } else {
                        // la tâche est active, il n'y a pas d'aléa, on incrémente le compteur tâches actives
                        iActiveTasks++;
                    }
                }

                // mise à jour des champs avec les variables
                oActiveQualityActivities.setValue(iActiveTasks);
                oSuspendedQualityactivities.setValue(iSuspendedTask);
            }
        });

    },
    /**
     * @author      Hervé VALOT
     * @date        20181218
     * @function    onClearFilterClick
     * @description clic sur le bouton "effacer filtres", supprime les filtres de la grille
     * @version     20181218 HVT, création
     */
    onClearFilterClick: function () {
        var oMe = this;
        var oForm = oMe.getView();
        var oQualityActivitiesGrid = oForm.query('#grdQualActivities')[0];

        // suppression des filtres
        oQualityActivitiesGrid.clearFilters();
    },
    /**
     * @author      Hervé VALOT
     * @date        20181218
     * @function    onGridRefresh
     * @description interception du refresh de la grille (evénement 'gridrefresh')
     * @description application du filtre en cours sur les données actualisées
     * @version     20181218 HVT, création
     */
    onGridRefresh: function (aFilter) {
        var oMe = this;
        var oForm = this.getView();
        var oQualityActivitiesGrid = oForm.query('#grdQualActivities')[0];
        var oQualityActivitiesStore = oQualityActivitiesGrid.getStore();

        // application des filtres
        oQualityActivitiesStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        // recharge le store
        oMe.actRefresh();
    },
    /**
     * @author      Hervé VALOT
     * @date        20181218
     * @function    actRefresh
     * @description vide et recharge le store de la grille
     * @version     20181218 HVT, création
     */
    actRefresh: function () {
        // var oMe = this;
        // var oForm = oMe.getView();
        // var oQualityActivitiesGrid = oForm.query('#grdQualActivities')[0];
        // var oQualityActivitiesStore = oQualityActivitiesGrid.getStore();
        const oMe = this,
            oForm = oMe.getView(),
            oQualityActivitiesGrid = oForm.query('#grdQualActivities')[0],
            oQualityActivitiesStore = oQualityActivitiesGrid.getStore();

        // vide le Store
        oQualityActivitiesStore.removeAll();
        // charge le store
        oQualityActivitiesStore.load();
        // TODO: 2019-03-08 14:12:25 HVT, vérifier si il n'y a pas plus efficace (rechercher le store avec reload()) au lieu de vider et charger.
    },
    /**
     * @author      Hervé VALOT
     * @date        20181218
     * @function    onNewActClick
     * @description ouverture du formulaire nouvealle activité
     * @version     20181218 HVT, création
     */
    onNewActClick: function () {
        var oMe = this;
        var oForm = oMe.getView();
        var oMain = oForm.up('app-main'); // retourne le viewport principal

        // création de l'objet fenêtre pour accueillir le formulaire de création de l'activité qualité
        var oWin = Thot.app.openWidget('createqualityactivity', {
            title: 'Nouvelle activité qualité',
            alias: 'newqualityact',
            modal: true,
            resizable: false,
            height: 550,
            width: 900
        });

        // gestion des événements de l'objet oWin (fenêtre du formulaire de saisie)
        oWin.on({
            // sur fermeture
            'destroy': function (_oWin) {
                oMain.fireEvent('listsRefresh');
                /**
                 * TODO:    remplacer le rafraichissement global par le rafraichissement de la grille locale
                 *          pour réduire le temps de rafraichissement de l'application
                 *          voir dans l'objet Main comment fonctionne la fonction 'listsrefresh'
                 */
                //oMe.actRefresh();
            }
        });
    },
    /**
     * @author      Hervé VALOT
     * @date        20181218
     * @function    onCellClick
     * @description gestion du clic sur une des cellules de la grille
     * @param       oView l'objet vue à partir duquel le clic est déclenché
     * @param       oComp ?? inutilisé
     * @param       iCellInd index de la celulle clickée
     * @param       oRecord objet contenant les données de la ligne
     */
    onCellClick: function (oView, oComp, iCellInd, oRecord) {
        var oMe = this;
        var oForm = oMe.getView(); // récupère la vue
        var oGrid = oView.up('grid'); // récupère la grille
        var aColumns = oGrid.getColumns(); // récupère les colonnes de la grille
        var oMain = oForm.up('app-main'); // récupère le viewport parent

        // gestion de l'action à réaliser en fonction de la cellule clickée
        switch (aColumns[iCellInd].dataIndex) {
            case 'etat': // click sur la colonne 'etat', on affiche le formulaire de fin d'activité
                var oWin = Thot.app.openWidget('qualityactdetail', {
                    title: 'Détail de l\'activité qualité',
                    alias: 'qualityactdet',
                    modal: true,
                    param: {
                        recordId: oRecord.get('act_id'),
                        custom: oRecord
                    },
                    resizable: false,
                    height: 370,
                    width: 750
                });
                // gestion des événements de l'objet oWin
                oWin.on({
                    // sur fermeture
                    'destroy': function (_oWin) {
                        oMain.fireEvent('listsRefresh');
                        //oMe.actRefresh();
                    }
                });
                break;
                // sur les cellules odf_code et opn_code on fait le même traitement, affichage du rapport OF
            case 'odf_code':
            case 'opn_code':
                var oWin = Thot.app.openWidget('rapportof', {
                    title: 'Rapport de l\'OF',
                    alias: 'rptof',
                    modal: true,
                    param: {
                        recordId: oRecord.get('odf_id'),
                        custom: oRecord
                    },
                    resizable: false,
                    height: 700,
                    width: 1100
                });
                break;
        }
    }
});