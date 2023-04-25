Ext.define('Thot.view.act.cor.FormRevisionNonPlanifieController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.act-cor-formrevisionnonplanifie',
    dataFields: { // champs du formulaire
        comboUsers: {
            convert: function (aDatas) {
                return aDatas.usr_id;
            }
        },
        act_date_debut: {
            convert: function (aDatas) {
                var sFormat = '';
                var sValue = aDatas.act_date_debut;

                if (arguments.length > 1) {
                    sFormat = arguments[1];
                }

                switch (sFormat) {
                    case 'sql':
                        return Ext.Date.toSql(sValue);
                    default:
                        return Ext.String.toDate(sValue);
                }
            }
        },
        act_date_fin: {
            convert: function (aDatas) {
                var sFormat = '';
                var sValue = aDatas.act_date_fin;

                if (arguments.length > 1) {
                    sFormat = arguments[1];
                }

                switch (sFormat) {
                    case 'sql':
                        return Ext.Date.toSql(sValue);
                    default:
                        return Ext.String.toDate(sValue);
                }
            }
        },
        duree: {
            convert: function (aDatas, sFormat) {
                if (!aDatas.act_date_debut || !aDatas.act_date_fin) {
                    return '00:00:00';
                }

                var oStartDate = (typeof aDatas.act_date_debut == 'object' ? aDatas.act_date_debut : Ext.String.toDate(aDatas.act_date_debut));
                var oEndDate = (typeof aDatas.act_date_fin == 'object' ? aDatas.act_date_fin : Ext.String.toDate(aDatas.act_date_fin));
                var iSeconds = Ext.Date.diff(oStartDate, oEndDate, 's');
                var oTime = Ext.Date.millisecToTime(iSeconds * 1000);

                if (sFormat == 'sql') {
                    return 0;
                }

                return oTime.time;
            }
        },
        acrusr_nom: {
            template: new Ext.Template([
                '{acrusr_prenom} {acrusr_nom}'
            ])
        }
    },
    /**
     * @author : edblv
     * @description actions après le rendu du formulaire
     * @version 20160101    edblv
     * @version 20200408    hvt ajout gestion des champs complémentaires (correction, informations secondaires)
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        var oValidBtn = oForm.query('#valid')[0];

        // vérifie le mode de fonctionnement du formulaire
        // si idenreg = 0 on est en mode création, pas de préchargement des champs du formulaire
        if (oForm.param.idenreg == 0) { // mode création
            /**
             * fonctionnement en mode création
             */
            //* - afficher la sélection de l'atelier
            oForm.query('#org_id')[0].setVisible(true);
            //* - masquer la grille de modification des quantités
            oForm.query('#quantityGrd')[0].setHidden(true);
            //* - afficher la grille de création des quantités
            oForm.query('#quantityGrdCreate')[0].setVisible(true);
            //* - charger les données de la liste des ateliers
            oMe._loadOrg();
            // initialisation de l'id de l'OF 200
            oMe._getOf200Id();
            //* - charge la liste la combo des opérations complémentaires
            // FIXME: HVT 2020-06-12 12:11:17, remplacer l'id en dur oct_id=2 par une valeur à récupérer je ne sais pas encore ou !
            oMe._loadOpnComp(4, true);

            return;
        } else { // mode correction
            /**
             * fonctionnement en mode correction
             */
            //* - charger les données de l'activité à corriger en fonction de son id passé en paramètre (oForm.param.idenreg)
            //* - masquer la sélection de l'atelier
            oForm.query('#org_id')[0].setHidden(true);
            //* - afficher la grille de modification des quantités
            oForm.query('#quantityGrd')[0].setVisible(true);
            //* - masquer la grille de création des quantités
            oForm.query('#quantityGrdCreate')[0].setHidden(true);
        }

        /**
         * désactivation du bouton OK pour éviter de créer une correction sans avoir apporté de modifications au formulaire
         */
        oValidBtn.setDisabled(true);
        /**
         * vérifie si le formulaire est sécurisé
         * vérification des autorisations de l'utilisateur authentifié
         */
        if (!Thot.com.util.Acl.isUserAllowed(oForm.itemId)) {
            // masquer le bouton de validation pour interdire la validation des corrections
            oValidBtn.setVisible(false);
            var oMsg = Thot.app.MessageInfo();
            oMsg.init(5000);
            oMsg.msg("avert", 'Vous n\'êtes pas habilité à modifier cette activité');
        }


        /**
         * affiche le masque (ombrage) du formulaire le temps de charger les données
         */
        oForm.mask('Chargement des informations de l\'activité ...');

        /**
         * chargement des informations de l'activité non planifiée
         * mise à jour des champs du formulaire
         */
        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'ActDetail',
                act_id: oForm.param.idenreg
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                if (oBack.success) {

                    /**
                     * mise à jour des champs du formulaire
                     * utilise la fonction de l'override Panel updateForm
                     */
                    oForm.updateForm(oBack.liste[0], oMe.dataFields);

                    /**
                     * mise à jour de la liste des opérateurs
                     * uniquement les opérateurs de la même section que celle de l'aléa
                     */
                    oMe._loadOrgUser(oBack.liste[0].org_id);

                    /**
                     * mise à jour de la liste des équipements
                     * uniquement les opérateurs de la même section que celle de l'aléa
                     */
                    oMe._loadOrgEqp(oBack.liste[0].org_id);

                    /**
                     * mise à jour de la combo des opérations complémentaires
                     */
                    oMe._loadOpnComp(oBack.liste[0].oct_id, true);

                    /**
                     * mise à jour de la grille des quantités
                     */
                    oMe._loadQuantities();

                    /**
                     * masque les informations de correction si inexistantes
                     */
                    oForm.query('#contCorrection')[0].setHidden(parseInt(oBack.liste[0].acr_estcorrigee) === 0 ? true : false);
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", 'Impossible de récupérer le détail de l\'activité');
                }
                oForm.unmask();
            }
        });
    },

    /**
     * @author  Hervé Valot
     * @description Chargement de la liste des ateliers supervisés
     */
    _loadOrg: function () {
        var // identification du store de la liste des ateliers
            oSectionStore = this.getView().query('#org_id')[0].getStore(),
            // définition du filtre du store des sections
            aFilter = [{
                type: 'sab_id',
                // récupération des sections supervisées (paramètre application) 
                // pour n'afficher que ces sections dans la liste
                value: Thot.app.getSection().idsection
            }];
        // mise à jour du store des ateliers
        oSectionStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        // chargement du store
        oSectionStore.load();
    },

    /**
     *  @function   getOf200Id
     *  @author     Hervé Valot
     *  @description    récupère l'identifiant de l'OF200 et le stock sur le formulaire
     *  @version    20190129    Création
     */
    _getOf200Id: function () {
        var oOF200Id = this.getView().query('#odf_id')[0];

        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'GetOf200Id',
            },
            success: function () {
                // si tous se passe bien, rien de particulier à faire
            },
            failure: function () {
                // sinon, rien de plus
            },
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                if (oBack.success) {
                    oOF200Id.setValue(oBack.liste[0].odf_id);
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", 'l\'OF de rattachement des opérations non planifiées n\'est pas défini');
                }
            }
        });
    },

    /**
     * @author : Hervé VALOT
     * @description	met à jour la liste des opérateurs de la section de production ou a eu lieu l'activité
     * @param {Number} iSabId identifiant de la section d'atelier dont lister les opérateurs
     * @version 20200407    HVT création
     */
    _loadOrgUser: function (iSabId) {
        var oForm = this.getView();
        var oUsersCbo = oForm.query('#usr_id')[0];
        var oUsersStore = oUsersCbo.getStore();

        // mise à jour du filtre du store
        var aFilter = [{
            type: 'sab_id',
            value: iSabId
        }];

        // application du filtre au store
        oUsersStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        // vide le store de la combobox
        oUsersStore.removeAll();

        // charge le store
        oUsersStore.load();
    },

    /**
     * @author  Hervé VALOT
     * @description met à jour la liste des équipements en fonction de la section d'atelier sélectionnée
     * @param {Number} iSabId identifiant de la section d'atelier dont lister les équipements
     * @version 20200612
     */
    _loadOrgEqp: function (iSabId) {
        var oForm = this.getView(),
            oEqpCbo = oForm.query('#eqp_id')[0],
            oEqpStore = oEqpCbo.getStore();

        // mise à jour du filtre du store
        var aFilter = [{
                type: 'sab_id',
                value: iSabId
            },
            {
                type: 'inactif',
                value: 0 // occulter les équipements inactifs
            }
        ];

        // vider le store
        oEqpStore.removeAll();

        // appliquer le filtre au store
        oEqpStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        // charger le store, et actualise le contenu de la liste de la combo
        oEqpStore.load();
    },

    /**
     * @author  Hervé VALOT
     * @description mise à jour de la liste des opérations complémentaires
     * @param {String} sOpnType identifiant du type d'opération complémentaire
     * @version 20200408    Hervé Valot Création
     */
    _loadOpnComp: function (iOpnType, afterRender) {
        var oForm = this.getView();
        var oOpcCbo = oForm.query('#opc_id')[0];
        var oOpcCboStore = oOpcCbo.getStore();

        // si on n'a pas d'identifiant d'opération on désactive les objets de sélection de l'équipement
        if (iOpnType == null) {
            // vide le store
            oOpcCboStore.removeAll();
            // efface la sélection de la combobox
            oOpcCbo.setValue(null);
            // désactive la combobox
            oForm.query('#opc_id')[0].setDisabled(true);
            // efface le fieldlabel
            oForm.query('#opc_code')[0].setValue(null);
            // on sort de la fonction ici
            return;
        } else {
            // active la combobox
            oForm.query('#opc_id')[0].setDisabled(false);
        }

        // préparation du filtre du store
        aFilter = [{
            type: 'oct_id',
            value: iOpnType
        }];

        // mise à jour du filtre du store
        oOpcCboStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        // vide le store
        oOpcCboStore.removeAll();

        // recharge le store
        oOpcCboStore.load();

        // efface la combo pour forcer l'utilisateur à faire une selection
        if (!afterRender) {
            // on efface que si on est en phase correction, pas au chargement
            oOpcCbo.setValue(null);
        }
    },

    /**
     * @author : Hervé VALOT
     * @description	Charge les quantités déclarées sur l'activité
     * @version 20200407    HVT création
     */
    _loadQuantities: function () {
        var oForm = this.getView();
        var oQtyStr = oForm.query('#quantityGrd')[0].getStore();

        //mise à jour du filtre du store
        var aFilter = [{
            type: 'act_id',
            value: oForm.param.idenreg
        }];

        // application du filtre au store
        oQtyStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        // vide le store
        oQtyStr.removeAll();

        // charge le store
        oQtyStr.load();

    },


    /**
     * @author  Hervé Valot
     * @description Charge la liste des utilisateurs en fonction du choix dans la liste des ateliers
     * @param {*} oCombo la combo des ateliers
     * @param {*} oRecord l'enregistrement sélectionné dans la combo
     */
    onSectionSel: function (oCombo, oRecord) {
        /**
         * actualisation de la liste des opérateurs de la section sélectionnée
         */
        this._loadOrgUser(oRecord.get('sab_id'));
        /**
         * actualisation de la liste des équipements de la section sélectionnée
         */
        this._loadOrgEqp(oRecord.get('sab_id'));
    },

    /**
     * @author Hervé VALOT
     * @description met à jour le complément d'information équipement (libellé)
     * @version 20200420    Hervé Valot	création
     */
    onEqpmtSel: function (oCombo, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        // mise à jour du champ ressource utilisée
        oForm.setFieldValue('eqp_code', oRecord.data.rsc_code + (oRecord.data.rsc_libelle !== '' ? ' / ' + oRecord.data.rsc_libelle : ''));
    },

    /**
     * @author Hervé VALOT
     * @date   20200410
     * @Description modification de la date de début, calcul de la durée
     * Modif de la date début ou fin
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onDateChange: function (oField) {
        var oMe = this;
        var oForm = this.getView();
        var bContinue = true;

        if (oForm.getFieldValue('act_date_debut') !== null && oForm.getFieldValue('act_date_fin') !== null) {
            if (oForm.getFieldValue('act_date_debut') > oForm.getFieldValue('act_date_fin')) {
                var oMsg = Thot.app.MessageInfo();
                oMsg.init(5000);
                oMsg.msg("avert", 'La date de fin doit être supérieure à la date de début');
                bContinue = false;
            }
        }

        if (bContinue) {
            //---- On recalcul la durée
            oForm.setFieldValue('duree', oMe.dataFields.duree.convert({
                act_date_debut: oForm.getFieldValue('act_date_debut'),
                act_date_fin: oForm.getFieldValue('act_date_fin')
            }));
        }

        // NOTE: 2020-05-20 15:01:21 désactivé le 20/05/2020 suite à réunion projet, demande Fred Brechon
        // vérification de la durée, doit être < 8 h
        // la vérification est déclenchée dés que la chaine "durée" contient au moins 8 caractères (00:00:00)
        // if (Ext.getCmp('duree').getValue().length >= 8 && bContinue) {

        //     // modification de l'affichage de l'indicateur si dépassement de la limite
        //     if (Thot.com.dt.DateTimeCalc.convertHMSToSec(Ext.getCmp('duree').getValue()) > 28800) {
        //         // if (seconds > 28800) {
        //         Ext.getCmp('duree').addCls('thot-error-indicator');
        //         this.getView().query('#act_date_debut')[0].setValidation('La durée de l\'activité doit être inférieure à 8h00');
        //         this.getView().query('#act_date_fin')[0].setValidation('La durée de l\'activité doit être inférieure à 8h00');
        //     } else {
        //         Ext.getCmp('duree').removeCls('thot-error-indicator');
        //         this.getView().query('#act_date_debut')[0].setValidation();
        //         this.getView().query('#act_date_fin')[0].setValidation();
        //     }
        // }

        // actualise la validité du formulaire
        oForm.isValid();
    },

    /**
     * @author : edblv
     * @Description Clic sur 'Annuler', ferme la formulaire sans modification
     * @version 20161014    edblv   création
     */
    onCancelClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oWin = oForm.up('window');
        oWin.close();
    },

    /**
     * @author  Hervé VALOT
     * @date    20200410
     * @Description Clic sur 'Valider', enregistre les corrections apportées à l'activité
     * @version 20200410    Herv Valot   création
     */
    onValidClick: function () {
        var oMe = this;
        var oForm = this.getView();
        // sélection de la grille en fonction du mode du formulaire
        var oQtyGrd = (oForm.param.idenreg == 0 ? oForm.query('#quantityGrdCreate')[0] : oForm.query('#quantityGrd')[0]);
        var iUserId = Thot.app.contexte.userId;

        // on désactive le formulaire et on affiche le masque "patientez"
        oForm.mask('Mise à jour de l\'activité en cours ...');

        // créer le tableau d'informations à renvoyer au backend
        var aFormFields = {
            org_id: Ext.getCmp('org_id').getValue(),
            act_id: Ext.getCmp('act_id').getValue(),
            odf_id: Ext.getCmp('odf_id').getValue(),
            usr_id: Ext.getCmp('usr_id').getValue(),
            eqp_id: Ext.getCmp('eqp_id').getValue(),
            opc_id: Ext.getCmp('opc_id').getValue(),
            // on utilise query sur itemId car la présence d'un id sur le datetimefield fait planter le calendrier (ne s'affiche pas)
            act_date_debut: oForm.query('#act_date_debut')[0].getSubmitValue(),
            act_date_fin: oForm.query('#act_date_fin')[0].getSubmitValue(),
            acr_commentaire: Ext.getCmp('acr_commentaire').getValue(),
        };

        // créer le tableau des quantités
        var aQuantity = {
            qtp_id: oQtyGrd.getColumnValues('qtp_id'),
            // en fonction du mode on prend les quantités dans la grille correction ou création
            qty: (oForm.param.idenreg == 0 ? oQtyGrd.getColumnValues('qty') : oQtyGrd.getColumnValues('qte_valeur'))
        };

        // validation du formulaire
        if (!oForm.isValid()) {
            var oMsg = Thot.app.MessageInfo();
            oMsg.init(5000);
            oMsg.msg("error", 'Erreur de validation du formulaire');

            // on retire le masque "patientez"
            oForm.unmask();
            return;
        }

        // création du tableau de paramètres à passer au backend
        var oParams = {
            appName: Thot.app.appConfig.name,
            // si idenreg == 0 on passe en création forcée, sinon en mise à jour
            action: (oForm.param.idenreg == 0 ? 'newCompAct' : 'updateUnplanedAct'),
            // on indique au backend que l'opération se fait en mode correction (pour la création)
            mode: 'correction',
            act_id: oForm.param.idenreg, // identifiant de l'activité corrigée
            rsc_id: iUserId, // identifiant de l'opérateur authentifié qui a réalisé les corrections
            fields: Ext.encode(aFormFields),
            originalval: Ext.encode(oForm.originalValues),
            quantity: Ext.encode(aQuantity)
        };

        // exécution de la requête
        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: oParams,
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    oMe.onCancelClick();
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", oBack.message);
                    // on retire le masque "patientez"
                    oForm.unmask();
                }
            }
        });
    }
});