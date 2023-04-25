/**
 * @author Hervé Valot
 * @description Composant de gestion des corrections des entités
 */
Ext.define('Thot.view.act.CmpRevisionController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.act-cmprevision',
    adminFunctionAllowed: false,

    /**
     * @author : edblv
     * date   : 24/06/16 10:43
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = oMe.getView();
        var oDateDebutHisto = oForm.query('#dateDebutHisto')[0];
        var oDateFinHisto = oForm.query('#dateFinHisto')[0];
        oDateDebutHisto.setValue(new Date());
        oDateFinHisto.setValue(new Date());
        // initialiser la date maxi de recalcul de l'export si nécessaire
        // ne peut être supérieur à la date de la veille (l'export se fait à 5h10 pour la journée J-1)
        var oDateRecalc = oForm.query('#dateExportRecalc');
        var dMaxDate = new Date() - (24 * 3600 * 1000);
        // dMaxDate = dMaxDate.getTime - (24 * 3600 * 1000);
        oDateRecalc.maxValue = dMaxDate;
    },

    /**
     * @author Hervé Valot
     * @description vérifie les autorisations de l'utilisateur connecté (si il y en a un) et affiche les objets sécurisé de l'interface utilisateur
     * @date 20200917
     */
    checkAuth: function () {
        /* vérification des autorisation utilisateur pour affichage des outils d'administration des OF */
        var oForm = this.getView(),
            // objets de l'interface soumis à autorisation
            oBtnShowSuppressed = oForm.query('#btnShowSuppressed')[0],
            obtnMenuCreateAct = oForm.query('#btnMenuCreateAct')[0],
            ogroupRecalcConsolidation = oForm.query('#groupRecalcConsolidation')[0],
            // colonne outils de la grille
            oGridActionColumn = oForm.query('#activities')[0].getColumns()[18],

            // permission de l'utilisateur courant sur le formulaire et ses objets contrôlés
            bPermission = Thot.com.util.Acl.isUserAllowed(oForm.itemId);

        // application des autorisations aux objets contrôlés
        // oBtnShowSuppressed.setVisible(bPermission);
        obtnMenuCreateAct.setVisible(bPermission);
        ogroupRecalcConsolidation.setVisible(bPermission);
        // NOTE: hvt 2021-03-26 17:34:21, ça plante le menu si on cache la colonne !!
        // oGridActionColumn.isHideable(!bPermission);
        // oGridActionColumn.setHidden(!bPermission);
        oGridActionColumn.setWidth(bPermission * 60);

        this.adminFunctionAllowed = bPermission;

        // // placer le focus sur le champ de recherche
        // var oSearchField = oForm.query('#noof')[0];
        // oSearchField.focus(true);
    },
    /**
     * @author : edblv
     * date   : 27/06/16 10:56
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onGridRefresh: function () {
        var oMe = this;
        var oForm = this.getView();
        var oGrid = oForm.query('#activities')[0];
        var oStore = oGrid.getStore();
        var oDateDebutHisto = oForm.query('#dateDebutHisto')[0];
        var oDateFinHisto = oForm.query('#dateFinHisto')[0];
        var oDateRefDeb = oForm.query('#debutact')[0];
        var sCurrentSection = localStorage.getItem('currentSection');
        var oBtnShowSuppressed = this.getView().query('#btnShowSuppressed')[0];
        var aFilter = [];
        var oCurrentSection = {
            idsociete: 0,
            idsite: 0,
            idsection: '',
            label: {
                society: '',
                site: '',
                section: ''
            }
        };

        if (sCurrentSection !== null) {
            oCurrentSection = Ext.decode(sCurrentSection);
        }

        oStore.removeAll();

        if (
            oDateDebutHisto.getValue() == undefined ||
            oDateDebutHisto.getValue() == ''
        ) {
            oDateDebutHisto.setValue(new Date());
        }

        if (
            oDateFinHisto.getValue() == undefined ||
            oDateFinHisto.getValue() == ''
        ) {
            oDateFinHisto.setValue(new Date());
        }

        if (oCurrentSection.idsection) {
            aFilter.push({
                type: 'sab_id',
                value: oCurrentSection.idsection
            });
        }

        aFilter.push({
            type: 'bornedebut',
            value: Ext.Date.format(oDateDebutHisto.getValue(), 'Y-m-d')
        });

        aFilter.push({
            type: 'bornefin',
            value: Ext.Date.format(oDateFinHisto.getValue(), 'Y-m-d')
        });

        if (oDateRefDeb.getValue()) {
            aFilter.push({
                type: 'dateref',
                value: 'd'
            });
        }

        aFilter.push({
            type: 'estsupprimee',
            value: oBtnShowSuppressed.pressed ? 1 : 0
        });
        // oStore.on({
        //     load: function (oStore, aRecords) { }
        // });


        if (aFilter.length > 0) {
            oStore.setExtraParams({
                storefilters: {
                    specfilter: aFilter
                }
            });
        }

        oStore.load();
    },

    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onDateRefChange: function (oObj, bValue) {
        var oMe = this;
        var oForm = this.getView();

        if (bValue) {
            oMe.onGridRefresh();
        }
    },

    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onDateKeyPress: function (oObj, oEl, oEvent) {
        var oMe = this;
        var oForm = this.getView();
    },

    /**
     * @author Hervé Valot
     * @description Retire tous les filtres de la grille
     */
    onGridClearFilter: function () {
        var oGrid = this.getView().query('#activities')[0];
        // The "filters" property is added to the grid (this) by gridfilters
        oGrid.filters.clearFilters();
    },

    /**
     * @author Hervé Valot
     * @description Toggle, affiche/masque les entités supprimées
     */
    onSuppressedShowClick: function () {
        var oGrid = this.getView().query('#activities')[0];
        var oBtn = this.getView().query('#btnShowSuppressed')[0];
        var aFilter = [];

        // définition du filtre du store de la grille
        aFilter.push({ // filtre par défaut, masque les éléments supprimés
            type: 'estsupprimee',
            value: oBtn.pressed ? 1 : 0
        });

        // applique le filtre au store
        oGrid.getStore().setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        // actualise la grille
        oGrid.refresh();
    },

    /**
     * @author	Hervé VALOT
     * @date	20200119
     * @description	déclenche le calcul d'un export quotidien à une date définie
     */
    onBtnRecalcExport: function () {
        // récupération et formatage de la date à recalculer
        var oDatefield = this.getView().query('#dateExportRecalc')[0],
            sDateExport = Ext.Date.format(oDatefield.getValue(), 'Ymd'),
            // bouton de recalcul (pour le désactiver le temps du calcul)
            oBtnRecalcExport = this.getView().query('#btnRecalcExport')[0];
        var oMsg = Thot.app.MessageInfo();

        if (oDatefield.value == undefined) {
            oMsg.init(5000);
            oMsg.msg(
                'avert',
                'Veuillez indiquer la date à consolider'
            );
            return;
        }
        // désactivation du bouton pour éviter les déclenchements multiples
        oBtnRecalcExport.setDisabled(true);

        // appel de la procédure de recalcul
        Ext.Ajax.request({
            url: 'server/rpt/Reports.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'exportquotidien',
                date_export: sDateExport
            },
            success: function () {},
            failure: function () {},
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var oMain = Thot.app.viewport;

                if (oBack.success) {
                    // on affiche une notifiation glissante
                    oMsg.init(5000);
                    oMsg.msg(
                        'info',
                        'Le rapport quotidien du {sDateExport} a été correctement régénéré.'
                    );
                } else {
                    // on affiche une notifiation glissante
                    oMsg.init(5000);
                    oMsg.msg(
                        'error',
                        'Erreur lors du calcul du rapport quotidien du {sDateExport}'
                    );
                }
                // réactivation du bouton
                oBtnRecalcExport.setDisabled(false);
            }
        });
    },

    /**
     * @author  Hervé Valot
     * @description déclenche la confirmation de suppression d'une entité de la grille
     * @version 20200204
     */
    onEntityDeleteClick: function (grid, rowIndex, colIndex) {
        if (!this.adminFunctionAllowed) { // si le formulaire est sécurisé, pas d'utilisateur ayant les droits suffisants connecté
            return;
        }
        var oRecord = grid.getStore().getAt(rowIndex).data;
        // var oRecord = rowIndex.data;

        switch (oRecord.estsupprimee) {
            case 0: // à supprimer
                confirm = Ext.MessageBox.show({ // message de confirmation et de saisie d'un commentaire optionnel
                    title: 'Supprimer',
                    msg: 'Motif de la suppression (optionel):',
                    icon: Ext.MessageBox.QUESTION,
                    width: 300,
                    buttons: Ext.MessageBox.YESNO,
                    buttonText: { // redéfinir le texte des bouttons
                        yes: 'Supprimer',
                        no: 'Annuler'
                    },
                    multiline: true,
                    scope: this,
                    // traitement de la réponse utilisateur
                    fn: this._deleteEntity,
                    // paramètres complémentaires pour traitement par _deleteEntity
                    ent_id: oRecord.ent_id,
                    ent_type: oRecord.ent_type,
                    record: oRecord
                });
                break;
            case 1: // à restaurer
                confirm = Ext.MessageBox.confirm({ // message de confirmation et de saisie d'un commentaire optionnel
                    title: 'Restaurer',
                    msg: 'Confirmer la restauration de l\'activité.',
                    icon: Ext.MessageBox.QUESTION,
                    width: 300,
                    buttons: Ext.MessageBox.YESNO,
                    buttonText: { // redéfinir le texte des bouttons
                        yes: 'Restaurer',
                        no: 'Annuler'
                    },
                    scope: this,
                    // traitement de la réponse utilisateur
                    fn: this._deleteEntity,
                    // paramètres complémentaires pour traitement par _deleteEntity
                    ent_id: oRecord.ent_id,
                    ent_type: oRecord.ent_type,
                    record: oRecord
                });
                break;
        }


    },

    /**
     * @author  Hervé Valot
     * @description traite la suppression d'une entité après saisie du commentaire (onEntityDeleteClick)
     * @param {*} sValue valeur du bouton pressé par l'utilisateur
     * @param {*} sTexte contenu du motif de suppression 
     * @param {*} oObj objet MessageBox avec ses propriétés complémentaires (ent_id et ent_type) 
     */
    _deleteEntity: function (sValue, sTexte, oObj) {
        var oMe = this;
        var sUrl = '',
            sAction = '';

        // on récupère l'identifiant de l'utilisateur connecté
        var iUserId = Thot.app.contexte.userId;

        // on récupère le statut actuel de l'enregistrement pour savoir si il s'agit
        // d'une suppression ou restauration, pour ajuster le message de retour
        var sTypeAction = oObj.record.estsupprimee == 0 ? 'supprimée' : 'restaurée';

        if (sValue == 'no') { // l'opérateur a annulé la suppression
            return; //on termine tout de suite
        }

        // déterminer le type d'entité à supprimer
        if (oObj.ent_type == 'ACT') {
            // TODO: hvt 2020-04-16 15:48:10 gérer le cas des réglages
            // suppression d'un aléa et d'une activité
            // à prévoir, si suppression d'une activité alors on supprime tous les aléas qui lui sont rattachés
            // à faire dans la procédure SQL

            // c'est une activité
            sUrl = 'server/act/Activities.php';
            sAction = 'deleteAct';
        } else {
            // c'est un aléa
            sUrl = 'server/act/Activities.php';
            sAction = 'deleteAlea';
        }

        // déclenche la suppression
        // si le retour est OK on supprime l'objet du store
        Ext.Ajax.request({
            url: sUrl,
            params: {
                appName: Thot.app.appConfig.name,
                action: sAction,
                ent_id: oObj.ent_id,
                usr_id: iUserId,
                motif: sTexte
            },
            success: function () {},
            failure: function () {},
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var oMsg = Thot.app.MessageInfo();
                if (oBack.success) {
                    // on affiche une notifiation glissante
                    oMsg.init(5000);
                    oMsg.msg(
                        'info',
                        'Activité ' + sTypeAction
                    );
                    oMe.onGridRefresh();
                    // oObj.record.drop(); // retire l'enregistrement du store
                } else {
                    // on affiche une notifiation glissante
                    oMsg.init(5000);
                    oMsg.msg(
                        'error',
                        'Erreur, l\'activité n\'a pas été ' + sTypeAction
                    );
                }
            }
        });
    },

    /**
     * @author  Hervé Valot
     * @description déclenché sur double-clique sur une ligne de la grille
     * @description passe les informations à la fonction _editEntity, action par défaut du double-clic
     * @param {*} oGrid grille d'origine du double-clic
     * @param {*} oRecord ligne de la grille
     */
    onRowDblClick: function (oGrid, oRecord) {
        if (!this.adminFunctionAllowed) { // si le formulaire est sécurisé, pas d'utilisateur ayant les droits suffisants connecté
            return;
        }
        // si l'objet est supprimé on ne réagit pas au double-clic
        if (oRecord.data.estsupprimee == 1) {
            return;
        }
        // passe l'objet entité à éditer à la fonction _editEntity
        this._editEntity(oRecord.data);
    },

    /**
     * @author  Hervé Valot
     * @description Identifie le type d'entité de la ligne à éditer et défini le formulaire de correction à utiliser
     * @param {*} grid grille d'origine de l'action
     * @param {*} rowIndex index de la ligne ou l'action a été déclenchée
     * @param {*} colIndex index de la colonne ou l'action s'est produite
     */
    onRowEditClick: function (grid, rowIndex, colIndex, record) {
        if (!this.adminFunctionAllowed) { // si le formulaire est sécurisé, pas d'utilisateur ayant les droits suffisants connecté
            return;
        }
        // passe l'objet entité à éditer à la fonction _editEntity
        this._editEntity(grid.getStore().getAt(rowIndex).data);
    },

    /**
     * @author Hervé Valot
     * @description interne, analyse l'entité à modifier et déclenche l'appel du formulaire associé
     * @param {*} oRecord objet contenant les données de l'entité à modifier
     */
    _editEntity: function (oRecord) {
        var bContinue = true; // booleen pour indiquer si on peut continuer (pas d'erreur)
        var sMsgTst = '';

        var sWidget = '', //nom du formulaire à afficher pour éditer l'entité
            sWidgetTitle = '', // titre à afficher dans le formulaire
            sWidgetAlias = '', // Alias du widget
            iWidgetHeihgt = 0, // hauteur du formulaire
            iWidgetWidth = 0; // largeur du formulaire

        switch (oRecord.ent_type) {

            case 'ALA': // ALEA, Hors production
                sWidget = 'frmrevisionhorsprod';
                sWidgetTitle = 'Edition de l\'activité Hors production';
                sWidgetAlias = 'updateact';
                iWidgetHeihgt = 360;
                iWidgetWidth = 750;
                break;

            case 'ACT': // ACTIVITE

                switch (oRecord.oct_code) {

                    case 'NPLN': // non planifié
                        sWidget = 'frmrevisionnonplanifie';
                        sWidgetTitle = 'Edition de l\'activité Non Planifiée';
                        sWidgetAlias = 'updateact';
                        iWidgetHeihgt = 500;
                        iWidgetWidth = 750;
                        break;

                    case 'QUAL': // qualité
                        sWidget = 'frmrevisionqualite';
                        sWidgetTitle = 'Edition de l\'activité Qualité';
                        sWidgetAlias = 'updateact';
                        iWidgetHeihgt = 650;
                        iWidgetWidth = 750;
                        break;

                    case 'PROD': // production et ?
                        if (oRecord.alt_code == 'REG') { // c'est un réglage
                            sWidget = 'frmrevisionreglage';
                            sWidgetTitle = 'Edition de l\'activité Réglage';
                            sWidgetAlias = 'updateact';
                            iWidgetHeihgt = 650;
                            iWidgetWidth = 750;

                        } else { // activité de production standard
                            sWidget = 'frmrevision';
                            sWidgetTitle = 'Edition de l\'activité de production';
                            sWidgetAlias = 'updateact';
                            iWidgetHeihgt = 690;
                            iWidgetWidth = 750;
                        }
                        break;

                    default: // pas de type opération !! problème
                        sMsgTst = 'Entité non identifiable, contactez l\'administrateur !';
                        bContinue = !bContinue;
                }
                break;

            default: // ni ACT ni ALA !! problème
                sMsgTst = 'Entité non identifiable, contactez l\'administrateur !';
                bContinue = !bContinue;
        }
        // }

        if (bContinue) { // lance le formulaire adapté à l'entité si aucune erreur précédente
            this._showForm({
                widget: sWidget,
                title: sWidgetTitle,
                alias: sWidgetAlias,
                height: iWidgetHeihgt,
                width: iWidgetWidth,
                param: {
                    recordId: oRecord.ent_id // passe l'identifiant de l'entité pour charger les informations dans le formulaire de correction
                }
            });
        }
    },

    /**
     * @author  Hervé Valot
     * @description déclenche l'affichage du formulaire de création d'une activité manquante
     */
    onCreateMenuOptionClick: function (item) {
        if (!this.adminFunctionAllowed) { // si le formulaire est sécurisé, pas d'utilisateur ayant les droits suffisants connecté
            return;
        }

        var sWidget = '', //nom du formulaire à afficher pour éditer l'entité
            sWidgetTitle = '', // titre à afficher dans le formulaire
            sWidgetAlias = '', // Alias du widget
            iWidgetHeihgt = 0, // hauteur du formulaire
            iWidgetWidth = 0; // largeur du formulaire

        // en fonction de l'option cliquée (item.action, propriété définie sur chaque option du menu)
        // on déclenche l'affichage du formulaire approprié.
        switch (item.action) {
            case 'production':
                sWidget = 'frmrevision';
                sWidgetTitle = 'Création d\'une activité de production';
                sWidgetAlias = 'updateact';
                iWidgetHeihgt = 690;
                iWidgetWidth = 750;
                break;
            case 'qualite':
                sWidget = 'frmrevisionqualite';
                sWidgetTitle = 'Création d\'une activité qualité';
                sWidgetAlias = 'updateact';
                iWidgetHeihgt = 690;
                iWidgetWidth = 750;
                break;
            case 'nonplanifie':
                sWidget = 'frmrevisionnonplanifie';
                sWidgetTitle = 'Création d\'une activité Non Planifiée';
                sWidgetAlias = 'updateact';
                iWidgetHeihgt = 500;
                iWidgetWidth = 750;
                break;
            case 'horsproduction':
                sWidget = 'frmrevisionhorsprod';
                sWidgetTitle = 'Création d\'une activité Hors production';
                sWidgetAlias = 'updateact';
                iWidgetHeihgt = 360;
                iWidgetWidth = 750;
                break;
            case 'reglage':
                sWidget = 'frmrevisionreglage';
                sWidgetTitle = 'Edition de l\'activité Réglage';
                sWidgetAlias = 'updateact';
                iWidgetHeihgt = 650;
                iWidgetWidth = 750;
                break;
        }

        // affichage du formulaire identifié en fonction de l'option de menu cliquée
        // affichage en mode création (le formulaire se configure à l'ouverture en fonction de recordId)
        // recordId = 0 --> mode création. autre, mode correction, chargement des données de l'activité à corriger
        this._showForm({
            widget: sWidget,
            title: sWidgetTitle,
            alias: sWidgetAlias,
            height: iWidgetHeihgt,
            width: iWidgetWidth,
            param: {
                recordId: 0 // l'identifiant 0 n'existe pas, il permet d'indiquer au formulaire qu'il doit passer en mode création
            }
        });

    },

    /**
     * @author      Hervé Valot
     * @description ouvre un formulaire en fonction des paramètres passés en objet
     * @param oParam objet contenant les paramètres du formulaire à afficher
     */
    _showForm: function (oParam) {
        var oMe = this;

        var oWin = Thot.app.openWidget(oParam.widget, {
            title: oParam.title,
            alias: oParam.alias,
            modal: true,
            resizable: true,
            height: oParam.height,
            width: oParam.width,
            param: (oParam.param ? oParam.param : {})
        });

        oWin.on({
            destroy: function (oWin) {
                oMe.onGridRefresh();
            }
        });
    }

});