Ext.define('Thot.view.act.cor.FormRevisionHorsProdController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.act-cor-formrevisionhorsprod',
    dataFields: { // champs du formulaire
        comboUsers: {
            convert: function (aDatas) {
                return aDatas.usr_id;
            }
        },
        ala_date_debut: {
            convert: function (aDatas) {
                var sFormat = '';
                var sValue = aDatas.ala_date_debut;

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
        ala_date_fin: {
            convert: function (aDatas) {
                var sFormat = '';
                var sValue = aDatas.ala_date_fin;

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
                if (!aDatas.ala_date_debut || !aDatas.ala_date_fin) {
                    return '00:00:00';
                }

                var oStartDate = (typeof aDatas.ala_date_debut == 'object' ? aDatas.ala_date_debut : Ext.String.toDate(aDatas.ala_date_debut));
                var oEndDate = (typeof aDatas.ala_date_fin == 'object' ? aDatas.ala_date_fin : Ext.String.toDate(aDatas.ala_date_fin));
                var iSeconds = Ext.Date.diff(oStartDate, oEndDate, 's');
                var oTime = Ext.Date.millisecToTime(iSeconds * 1000);

                if (sFormat == 'sql') {
                    return 0;
                }

                return oTime.time;
            }
        },
        aecusr_nom: {
            template: new Ext.Template([
                '{aecusr_prenom} {aecusr_nom}'
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
            //* - charger les données de la liste des ateliers
            oMe._loadOrg();
            //* - charge la liste la combo des opérations complémentaires
            oMe._loadAlea(true);

            return;
        } else { // mode correction
            /**
             * fonctionnement en mode correction
             */
            //* - masquer la sélection de l'atelier
            oForm.query('#org_id')[0].setHidden(true);
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
            oMsg.msg('avert', 'Vous n\'êtes pas habilité à modifier cette activité');
        }

        /**
         * affiche le masque (ombrage) du formulaire le temps de charger les données
         */
        oForm.mask('Chargement des informations de l\'activité ...');

        /**
         * chargement des informations de l'aléa
         * mise à jour des champs du formulaire
         */
        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'loadAlea',
                ala_id: oForm.param.idenreg
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var aRecord = oBack.liste[0];
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
                     * mise à jour de la liste des aléas libres
                     */
                    oMe._loadAlea(true);

                    /**
                     * masque les informations de correction si inexistantes
                     */
                    oForm.query('#contCorrection')[0].setHidden(parseInt(oBack.liste[0].aec_estcorrigee) === 0 ? true : false);
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', 'Impossible de récupérer le détail de l\'activité');
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
     * @author : Hervé VALOT
     * @description	Charge la liste des opérateurs de la section de production ou a eu lieu l'activité
     * @version 20200407    HVT création
     */
    _loadOrgUser: function (sOrgId) {
        var oForm = this.getView();
        var oUsersCbo = oForm.query('#usr_id')[0];
        // var oUsersCbo = oForm.query('#comboUsers')[0];
        var oUsersStore = oUsersCbo.getStore();

        // mise à jour du filtre du store
        var aFilter = [{
            type: 'sab_id',
            value: sOrgId
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
     * @author  Hervé Valot
     * @date    20200410
     * @description	Charge la liste des aléas libres
     * @version 20161017	Hervé Valot	création
     */
    _loadAlea: function (afterRender) {
        var oMe = this;
        var oForm = this.getView();
        var oAleaCbo = oForm.query('#ald_id')[0];
        var oAleaStore = oAleaCbo.getStore();

        // mise à jour du filtre du store
        // on ne veut que les aléas libres utilisateur
        var aFilter = [{
            type: 'sourcetype',
            value: '1'
        }];

        // Application du filtre au store
        oAleaStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        // vide le store
        oAleaStore.removeAll();

        // recharge le store
        oAleaStore.load();
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
        this.getView().isValid();
    },

    /**
     * @author Hervé Valot
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

        if (oForm.getFieldValue('ala_date_debut') !== null && oForm.getFieldValue('ala_date_fin') !== null) {
            if (oForm.getFieldValue('ala_date_debut') > oForm.getFieldValue('ala_date_fin')) {
                var oMsg = Thot.app.MessageInfo();
                oMsg.init(5000);
                oMsg.msg('avert', 'La date de fin doit être supérieure à la date de début');
                bContinue = false;
            }
        }

        if (bContinue) {
            //---- On recalcul la durée
            oForm.setFieldValue('duree', oMe.dataFields.duree.convert({
                ala_date_debut: oForm.getFieldValue('ala_date_debut'),
                ala_date_fin: oForm.getFieldValue('ala_date_fin')
            }));
        }

        // NOTE: 2020-05-20 15:01:46 désactivé le 20/05/2020 suite à réunion projet, demande Fred Brechon
        // vérification de la durée, doit être < 8 h
        // la vérification est déclenchée dés que la chaine "durée" contient au moins 8 caractères (00:00:00)
        // if (Ext.getCmp('duree').getValue().length >= 8 && bContinue) {

        //     // modification de l'affichage de l'indicateur si dépassement de la limite
        //     if (Thot.com.dt.DateTimeCalc.convertHMSToSec(Ext.getCmp('duree').getValue()) > 28800) {
        //         Ext.getCmp('duree').addCls('thot-error-indicator');
        //         this.getView().query('#ala_date_debut')[0].setValidation('La durée de l\'activité doit être inférieure à 8h00');
        //         this.getView().query('#ala_date_fin')[0].setValidation('La durée de l\'activité doit être inférieure à 8h00');
        //     } else {
        //         Ext.getCmp('duree').removeCls('thot-error-indicator');
        //         this.getView().query('#ala_date_debut')[0].setValidation();
        //         this.getView().query('#ala_date_fin')[0].setValidation();
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
     * @author  Hervé Valot
     * @date    20200410
     * @Description Clic sur 'Valider', enregistre les corrections apportées à l'activité
     * @version 20200410    Herv Valot   création
     */
    onValidClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var iUserId = Thot.app.contexte.userId;

        // on désactive le formulaire et on affiche le masque "patientez"
        oForm.mask('Mise à jour de l\'activité en cours ...');

        // créer le tableau d'informations à renvoyer au backend
        var aFormFields = {
            org_id: Ext.getCmp('org_id').getValue(),
            usr_id: Ext.getCmp('usr_id').getValue(),
            ald_id: Ext.getCmp('ald_id').getValue(),
            ala_date_debut: oForm.query('#ala_date_debut')[0].getSubmitValue(),
            ala_date_fin: oForm.query('#ala_date_fin')[0].getSubmitValue(),
            aec_commentaire: Ext.getCmp('aec_commentaire').getValue()
        };
        //---- Doit-on utiliser un IdUser de substitution (Ex. : Si des users PQR utilisent l'appli,
        // ils seront identifiés comme s'ils étaient F. Brechon (petite pirouette pour les tests)
        if (Thot.app.appConfig.process[oForm.itemId].usersub) {
            if (Thot.app.appConfig.process[oForm.itemId].usersub[Thot.app.cnxParams.login]) {
                iUserId = Thot.app.appConfig.process[oForm.itemId].usersub[Thot.app.cnxParams.login];
            }
        }

        // validation du formulaire
        if (!oForm.isValid()) {
            var oMsg = Thot.app.MessageInfo();
            oMsg.init(5000);
            oMsg.msg('error', 'Erreur de validation du formulaire');

            // on retire le masque "patientez"
            oForm.unmask();
            return;
        }

        // préparation des paramètres de la requête Ajax
        var oParams = {
            appName: Thot.app.appConfig.name,
            action: (oForm.param.idenreg == 0 ? 'newFreeAlea' : 'updateAla'),
            // on indique au backend que l'opération se fait en mode correction (pour la création)
            mode: 'correction',
            ala_id: oForm.param.idenreg, // identifiant de l'aléa corrigée
            rsc_id: iUserId, // identifiant de l'opérateur authentifié qui a réalisé les corrections
            ald_id: Ext.getCmp('ald_id').getValue(),
            org_id: Ext.getCmp('org_id').getValue(),
            fields: Ext.encode(aFormFields),
            originalval: Ext.encode(oForm.originalValues),
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
                    oMsg.msg('error', oBack.message);
                }
            }
        });
    }
});