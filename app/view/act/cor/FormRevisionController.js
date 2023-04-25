Ext.define('Thot.view.act.cor.FormRevisionController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.act-formrevision',
    dataFields: { // champs du formulaire
        comboUsers: {
            convert: function (aDatas) {
                return aDatas.usr_id;
            }
        },
        odf_code: {
            convert: function (aDatas) {
                return aDatas.odf_code.trim();
            }
        },
        gam_code: {
            convert: function (aDatas) {
                return (aDatas.gam_code !== null ? aDatas.gam_code.trim() : 'N/D');
            }
        },
        // eqppln_code: {
        //     convert: function (aDatas) {
        //         return aDatas.eqppln_rsc_code.trim() + (aDatas.eqppln_rsc_libelle !== '' ? ' / ' + aDatas.eqppln_rsc_libelle.trim() : '');
        //     }
        // },
        odf_quantite_lancee: {
            convert: function (aDatas) {
                return parseInt(aDatas.odf_quantite_lancee);
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
        tempsmontagej: {
            convert: function (aDatas, sFormat) {
                var iDays = 0;

                if (parseFloat(aDatas.opn_temps_montage_j) > 1) {
                    iDays = Math.floor(parseFloat(aDatas.opn_temps_montage_j));
                }

                return iDays;
            }
        },
        tempsmontageh: {
            convert: function (aDatas, sFormat) {
                var iSecDay = (60 * 60) * 24; // Nbre de secondes dans 1 journée
                var fSource = parseFloat(aDatas.opn_temps_montage_j);
                var iDays = 0;

                if (aDatas.opn_temps_montage_j) {
                    // fSource = parseFloat(aDatas.opn_temps_montage_j);

                    // if (parseFloat(aDatas.opn_temps_montage_j) > 1) {
                    if (fSource > 1) {
                        // extraction du nombre de jours entiers
                        iDays = Math.trunc(fSource);
                        // extraction de la partie décimale (utilisation modulo 1)
                        fSource = fSource % 1;
                        // fSource = fSource - iDays; // ancien calcul
                        // par sécurité, peut-être inutile
                        fSource = (fSource < 0 ? 0 : fSource);
                    }
                }


                var fTime = iSecDay * fSource;
                var oTime = Ext.Date.millisecToTime(fTime * 1000);
                return oTime.time;
            }
        },
        tempsreglagej: {
            convert: function (aDatas, sFormat) {
                var iDays = 0;

                if (parseFloat(aDatas.opn_temps_reglage_j) > 1) {
                    iDays = Math.floor(parseFloat(aDatas.opn_temps_reglage_j));
                }

                return iDays;
            }
        },
        tempsreglageh: {
            convert: function (aDatas, sFormat) {
                var iSecDay = (60 * 60) * 24; // Nbre de secondes dans 1 journée
                var fSource = parseFloat(aDatas.opn_temps_reglage_j);
                var iDays = 0;

                if (aDatas.opn_temps_reglage_j) {
                    fSource = parseFloat(aDatas.opn_temps_reglage_j);

                    if (fSource > 1) {
                        // extraction du nombre de jours entiers
                        iDays = Math.trunc(fSource);
                        // extraction de la partie décimale (utilisation modulo 1)
                        fSource = fSource % 1;
                        // fSource = fSource - iDays; // ancien calcul
                        // par sécurité, peut-être inutile
                        fSource = (fSource < 0 ? 0 : fSource);
                    }
                }


                var fTime = iSecDay * fSource;
                var oTime = Ext.Date.millisecToTime(fTime * 1000);
                return oTime.time;
            }
        },
        tempsunitj: {
            convert: function (aDatas, sFormat) {
                var iDays = 0;

                if (aDatas.ope_temps_unitaire_j) {
                    if (parseFloat(aDatas.ope_temps_unitaire_j) > 1) {
                        iDays = Math.floor(parseFloat(aDatas.ope_temps_unitaire_j));
                    }
                }

                return iDays;
            }
        },
        tempsunith: {
            convert: function (aDatas, sFormat) {
                var iSecDay = (60 * 60) * 24; // Nbre de secondes dans 1 journée
                var fSource = 0;
                var iDays = 0;

                if (aDatas.ope_temps_unitaire_j) {
                    fSource = parseFloat(aDatas.ope_temps_unitaire_j);

                    // if (parseFloat(aDatas.ope_temps_unitaire_j) > 1) {
                    if (fSource > 1) {
                        // extraction du nombre de jours entiers
                        iDays = Math.trunc(fSource);
                        // extraction de la partie décimale (utilisation modulo 1)
                        fSource = fSource % 1;
                        // fSource = fSource - iDays; // ancien calcul
                        // par sécurité, peut-être inutile
                        fSource = (fSource < 0 ? 0 : fSource);
                    }
                }

                var fTime = iSecDay * fSource;
                var oTime = Ext.Date.millisecToTime(fTime * 1000);
                return oTime.time;
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
        nptr: {
            convert: function (aDatas, sFormat) {
                if (!aDatas.act_date_debut || !aDatas.act_date_fin) {
                    return '00:00:00';
                }

                var oStartDate = (typeof aDatas.act_date_debut == 'object' ? aDatas.act_date_debut : Ext.String.toDate(aDatas.act_date_debut));
                var oEndDate = (typeof aDatas.act_date_fin == 'object' ? aDatas.act_date_fin : Ext.String.toDate(aDatas.act_date_fin));
                var iSeconds = Ext.Date.diff(oStartDate, oEndDate, 's');
                var fSource = parseFloat(aDatas.ope_temps_unitaire_j);
                var fTime = 86400 * fSource; // Nbre sec./Jr * portion de jour = Nbre de sec.

                var nResult = 0;

                if (sFormat == 'sql') {
                    return 0;
                }

                if (fSource > 0) {
                    nResult = Math.floor(iSeconds / fTime);
                }

                return nResult;
            }
        },
        pdt_libelle: {
            template: new Ext.Template([
                '{pdt_complement}-{nce_libelle}-{pdt_libelle}'
            ])
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
            oMe.loadOrg();
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

        // // NOTE: hvt un test de timer pour actualiser un objet de l'UI
        // var task, clock = oForm.query('#time')[0];
        // // Start a simple clock task that updates a div once per second
        // task = {
        //     run: function () {
        //         clock.setHtml(Ext.Date.format(new Date(), 'g:i:s A'));
        //     },
        //     interval: 1000
        // };
        // Ext.TaskManager.start(task);
        // // NOTE: fin

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

        oForm.mask('Chargement des informations de l\'activité ...');

        /**
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
                var oQtyGrd = oForm.query('#quantityGrd')[0];
                var oQtyStr = oQtyGrd.getStore();
                var aFilter = [];
                if (oBack.success) {
                    /**
                     * mise à jour des champs du formulaire
                     * utilise la fonction de l'override Panel updateForm
                     */
                    oForm.updateForm(oBack.liste[0], oMe.dataFields);

                    /**
                     * mise à jour de la grille des quantités
                     */
                    aFilter = [{
                        type: 'act_id',
                        value: oForm.param.idenreg
                    }];

                    oQtyStr.setExtraParams({
                        storefilters: {
                            specfilter: aFilter
                        }
                    });
                    oQtyStr.load();

                    /**
                     * mise à jour de la combo des équipements
                     */
                    oMe.loadOpnEqp(oBack.liste[0].opn_id, true);

                    /**
                     * mise à jour de la liste des opérations
                     */
                    oMe.loadOfOper(oBack.liste[0].odf_id, true);

                    /**
                     * mise à jour de la liste des opérateurs
                     */
                    oMe.loadOrgUser(oBack.liste[0].org_id);

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
    loadOrg: function () {
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
     * @author : edblv
     * @description	Charge la liste des opérations liées à un OF
     * @version 20161017	edblv	création
     */
    loadOfOper: function (sOfId, afterRender) {
        var oMe = this;
        var oForm = this.getView();
        var oOperationCbo = oForm.query('#opn_id')[0];
        var oOperationStr = oOperationCbo.getStore();
        var aFilter = [{
            type: 'odf_id',
            value: sOfId
        }, {
            type: 'opn_estdisponible',
            value: 1
        }];

        //---- Chargement des opérations liées à cet OF
        oOperationStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        // vide le store
        oOperationStr.removeAll();

        // recharge le store
        oOperationStr.load();

        // efface la combo pour forcer l'utilisateur à faire une selection
        if (!afterRender) {
            // on efface que si on est en phase correction, pas au chargement
            oOperationCbo.setValue(null);
            // on efface aussi le fieldlabel associé
            oForm.query('#eqppln_rsc_code')[0].setValue(null);
            // on recharge la liste des équipements utilisables, on ne passe pas de numéro d'op
            oMe.loadOpnEqp(null, false);
        }
    },

    /**
     * @author : Hervé VALOT
     * @description	Charge la liste des opérateurs de la section de production ou a eu lieu l'activité
     * @version 20200407    HVT création
     */
    loadOrgUser: function (sOrgId) {
        var oForm = this.getView();
        var oUsersCbo = oForm.query('#usr_id')[0];
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
     * @description mise à jour de la liste des équipements en fonction de l'opération sélectionnée
     * @param {String} sOpnId identifiant de l'opération dont récupérer les ressources utilisables
     * @version 20200408    Hervé Valot Création
     */
    loadOpnEqp: function (sOpnId, afterRender) {
        var oForm = this.getView();
        var oWorkStnCbo = oForm.query('#eqp_id')[0];
        var oWorkStnStore = oWorkStnCbo.getStore();

        // si on n'a pas d'identifiant d'opération on désactive les objets de sélection de l'équipement
        if (sOpnId == null) {
            // vide le store
            oWorkStnStore.removeAll();
            // efface la sélection de la combobox
            oWorkStnCbo.setValue(null);
            // désactive la combobox
            oForm.query('#eqp_id')[0].setDisabled(true);
            // efface le fieldlabel
            oForm.query('#eqp_code')[0].setValue(null);
            // on sort de la fonction ici
            return;
        } else {
            // active la combobox
            oForm.query('#eqp_id')[0].setDisabled(false);
        }

        // préparation du filtre du store
        aFilter = [{
            type: 'opn_id',
            value: sOpnId
        }];

        // mise à jour du filtre du store
        oWorkStnStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        // vide le store
        oWorkStnStore.removeAll();

        // recharge le store
        oWorkStnStore.load();

        // efface la combo pour forcer l'utilisateur à faire une selection
        if (!afterRender) {
            // on efface que si on est en phase correction, pas au chargement
            oWorkStnCbo.setValue(null);
            // on efface aussi le fieldlabel associé
            oForm.query('#eqp_code')[0].setValue(null);
        }
    },

    /**
     * @author  Hervé Valot
     * @description Charge la liste des utilisateurs en fonction du choix dans la liste des ateliers
     * @param {*} oCombo la combo des ateliers
     * @param {*} oRecord l'enregistrement sélectionné dans la combo
     */
    onSectionSel: function (oCombo, oRecord) {
        var // identification du store de la liste des utilisateurs
            oUsersStore = this.getView().query('#usr_id')[0].getStore(),
            // récupération de l'id de l'atelier sélectionné et ajout au filtre 
            // qui sera passé à la liste des opérateurs
            aFilter = [{
                type: 'sab_id',
                value: oRecord.get('sab_id')
            }];
        // vide le store
        oUsersStore.removeAll();
        // applique le filtre
        oUsersStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        // chargement du store
        oUsersStore.load();
    },

    /**
     * @author : edblv
     * @description met à jour les informations de temps en fonction de l'équipement sélectionné
     * @version 20161017	edblv	création
     */
    onEqpmtSel: function (oCombo, oRecord) {
        var oMe = this;
        var oForm = this.getView();

        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'EqpTimes',
                odf_id: oForm.getFieldValue('odf_id'),
                opn_id: oForm.getFieldValue('opn_id'),
                eqp_id: oRecord.get('rsc_id')
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    oForm.clearFields([
                        'ope_temps_unitaire_j',
                        'tempsunitj',
                        'tempsunith'
                    ]);

                    //---- On met à jour les champs du formulaire (mais seulement ceux qui sont dans oBack.liste)
                    if (oBack.liste) {
                        oForm.updateForm(oBack.liste[0], oMe.dataFields, ['tempsunitj', 'tempsunith']);
                    } else {
                        oForm.setFieldValue('ope_temps_unitaire_j', 0);
                        oForm.setFieldValue('tempsunitj', 0);
                        oForm.setFieldValue('tempsunith', 0);
                    }

                    oMe.nptrUpdate();
                    // mise à jour du champ ressource utilisée
                    oForm.setFieldValue('eqp_code', oRecord.data.rsc_code + (oRecord.data.rsc_libelle !== '' ? ' / ' + oRecord.data.rsc_libelle : ''));

                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", 'Impossible de récupérer les temps de l\'équipement');
                }
            }
        });
    },

    /**
     * @author : edblv
     * @description Selection d'un opération dans la combo
     * @version 20161028	edblv	création
     */
    onOperationSel: function (oCombo, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'OpeTimes',
                odf_id: oRecord.get('odf_id'),
                opn_id: oRecord.get('opn_id'),
                eqp_id: oRecord.get('rsc_id')
                // eqp_id: oForm.getFieldValue('eqp_id')
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                if (oBack.success) {
                    oForm.clearFields([
                        'opn_temps_montage_j',
                        'opn_temps_reglage_j',
                        'ope_temps_unitaire_j',
                        'tempsmontagej',
                        'tempsmontageh',
                        'tempsreglagej',
                        'tempsreglageh',
                        'tempsunitj',
                        'tempsunith'
                    ]);

                    //---- On met à jour les champs du formulaire (mais seulement ceux qui sont dans oBack.liste)
                    oForm.updateForm(
                        oBack.liste[0],
                        oMe.dataFields,
                        [
                            'tempsmontagej',
                            'tempsmontageh',
                            'tempsreglagej',
                            'tempsreglageh',
                            'tempsunitj',
                            'tempsunith'
                        ]
                    );
                    oMe.nptrUpdate();
                    // mise à jour du champ ressource prévue
                    oForm.setFieldValue('eqppln_rsc_code', oRecord.data.rsc_code_theo + (oRecord.data.rsc_libelle_theo !== '' ? ' / ' + oRecord.data.rsc_libelle_theo : ''));
                    // mise à jour des ressources utilisables, on n'est pas an phase afterRender (chargement formulaire)
                    oMe.loadOpnEqp(oRecord.data.opn_id, false);
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", 'Impossible de récupérer les temps de l\'opération');
                }
            }
        });
    },

    /**
     * @author : edblv
     * date   : 02/11/16 10:14
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Recalcul du NPTR après selection d'équipement ou d'opération
     * ou modif de temps opérateur
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    nptrUpdate: function () {
        var oMe = this;
        var oForm = this.getView();

        //---- Puis on recalcul le nptr
        oForm.setFieldValue('nptr', oMe.dataFields.nptr.convert({
            act_date_debut: oForm.getFieldValue('act_date_debut'),
            act_date_fin: oForm.getFieldValue('act_date_fin'),
            ope_temps_unitaire_j: oForm.getFieldValue('ope_temps_unitaire_j')
        }));

    },

    /**
     * @author : edblv
     * date   : 02/11/16 11:03
     * @scrum : RND#ND-ND.ND
     *
     * #Description
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
                // var oMsg = Thot.app.MessageInfo();
                // oMsg.init(5000);
                // oMsg.msg("avert", 'La date de fin doit être supérieure à la date de début');
                bContinue = false;
            } else {}
        }

        if (bContinue) {
            //---- On recalcul la durée
            oForm.setFieldValue('duree', oMe.dataFields.duree.convert({
                act_date_debut: oForm.getFieldValue('act_date_debut'),
                act_date_fin: oForm.getFieldValue('act_date_fin')
            }));
            //---- Puis on recalcul le nptr
            oMe.nptrUpdate();
        }

        // NOTE: 2020-05-20 15:01:27 désactivé le 20/05/2020 suite à réunion projet, demande Fred Brechon
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

        // vérifie la validité du formulaire
        oForm.isValid();
    },

    /**
     * @author : edblv
     * date   : 17/11/16 10:21
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Sortie du champ 'Temps de montage' (Jr ou Hre)
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onMountTimeBlur: function (oField) {
        var oMe = this;
        var oForm = this.getView();
        var iDays = oForm.getFieldValue('tempsmontagej');
        var iSec = Ext.Date.timeToSec(oForm.getFieldValue('tempsmontageh'));
        oForm.setFieldValue('opn_temps_montage_j', (iDays + (iSec / 86400)));
    },

    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Sortie du champ 'Temps de réglage' (Jr ou Hre)
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onSetTimeBlur: function (oField) {
        var oMe = this;
        var oForm = this.getView();
        var iDays = oForm.getFieldValue('tempsreglagej');
        var iSec = Ext.Date.timeToSec(oForm.getFieldValue('tempsreglageh'));
        oForm.setFieldValue('opn_temps_reglage_j', (iDays + (iSec / 86400)));
    },

    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Sortie du champ 'Temps unitaire' (Jr ou Hre)
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onUnitTimeBlur: function (oField) {
        var oMe = this;
        var oForm = this.getView();
        var iDays = oForm.getFieldValue('tempunitj');
        var iSec = Ext.Date.timeToSec(oForm.getFieldValue('tempsunith'));
        oForm.setFieldValue('ope_temps_unitaire_j', (iDays + (iSec / 86400)));
        //---- Puis on recalcul le nptr
        oMe.nptrUpdate();
    },

    /**
     * @author edblv
     * @description	vérifie l'existance de l'OF saisi et déclenche le chargement des opérations associées
     * @description se produit lorsque le champ perd le focus
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onOfBlur: function (oField) {
        var oMe = this;
        var oForm = this.getView();
        var oOfId = oForm.query('#odf_id')[0];

        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'ofExists',
                odf_code: oField.getValue()
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                if (oBack.success) {
                    /**
                     * mise à jour du champ masqué pour conserver l'ID de l'OF
                     */
                    oOfId.setValue(oBack.liste[0].odf_id);
                    /**
                     * mise à jour des informations de l'OF
                     * on passe l'identifiant de l'OF et son numéro
                     */
                    oMe.loadOfData(oBack.liste[0].odf_id, oField.getValue());
                    /**
                     * charge la liste des opérations de l'OF
                     */
                    oMe.loadOfOper(oBack.liste[0].odf_id, false);
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", 'N° d\'O.F. non trouvé');
                }
            }
        });
    },

    /**
     * @author  Hervé Valot
     * @date    20200408
     * @description déclenche la mise à jour des informations de l'OF depuis le bouton 
     */
    onUpdateOFDataClick: function () {
        // passe l'objet champ de saisie odf_code à la fonction onOfBlur
        var oOFCode = this.getView().query('#odf_code')[0];
        // lance l'action associée au champ
        this.onOfBlur(oOFCode);
    },

    /**
     * @author  Hervé Valot
     * @param {String} sOfId 
     * @description mise à jour des informations de l'OF
     * @version 20200408    Hervé Valot création
     */
    loadOfData: function (sOfId, OfNum) {
        var oMe = this;
        var oForm = this.getView();

        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'ofDetail',
                odf_id: sOfId,
                ofnum: OfNum
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    oForm.clearFields([
                        'odf_quantite_lancee',
                        'pdt_libelle',
                        'gam_code'
                    ]);

                    //---- On met à jour les champs du formulaire (mais seulement ceux qui sont dans oBack.liste)
                    if (oBack.liste) {
                        // oForm.updateForm(oBack.liste[0], oMe.dataFields);
                        oForm.setFieldValue('odf_quantite_lancee', oBack.liste[0].odf_quantite_lancee);
                        oForm.setFieldValue('pdt_libelle', oBack.liste[0].pdt_libelle);
                        oForm.setFieldValue('gam_code', (oBack.liste[0].gam_code !== null ? oBack.liste[0].gam_code : 'N/D'));
                    } else {
                        oForm.setFieldValue('odf_quantite_lancee', 'N/D');
                        oForm.setFieldValue('pdt_libelle', 'N/D');
                        oForm.setFieldValue('gam_code', 'N/D');
                    }

                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", 'Impossible de récupérer les informations de l\'OF');
                }
            }
        });

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
     * @author : edblv
     * @Description Clic sur 'Valider', enregistre les corrections apportées à l'activité
     * @version 20161014    edblv   création
     */
    onValidClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oQtyGrd = (oForm.param.idenreg == 0 ? oForm.query('#quantityGrdCreate')[0] : oForm.query('#quantityGrd')[0]);
        var iUserId = Thot.app.contexte.userId;

        // on désactive le formulaire et on affiche le masque "patientez"
        oForm.mask('Mise à jour de l\'activité en cours ...');

        // créer le tableau d'informations à renvoyer au backend
        var aFormFields = {
            org_id: Ext.getCmp('org_id').getValue(),
            odf_id: Ext.getCmp('odf_id').getValue(),
            opn_id: Ext.getCmp('opn_id').getValue(),
            opn_temps_montage_j: Ext.getCmp('opn_temps_montage_j').getValue(),
            opn_temps_reglage_j: Ext.getCmp('opn_temps_reglage_j').getValue(),
            ope_temps_unitaire_j: Ext.getCmp('ope_temps_unitaire_j').getValue(),
            usr_id: Ext.getCmp('usr_id').getValue(),
            eqp_id: Ext.getCmp('eqp_id').getValue(),
            // on utilise query sur itemId car la présence d'un id sur le datetimefield fait planter le calendrier (ne s'affiche pas)
            act_date_debut: oForm.query('#act_date_debut')[0].getSubmitValue(),
            act_date_fin: oForm.query('#act_date_fin')[0].getSubmitValue(),
            acr_commentaire: Ext.getCmp('acr_commentaire').getValue()
        };

        // créer le tableau des quantités
        var aQuantity = {
            qtp_id: oQtyGrd.getColumnValues('qtp_id'),
            // en fonction du mode on prend les quantités dans la grille correction ou création
            qty: (oForm.param.idenreg == 0 ? oQtyGrd.getColumnValues('qty') : oQtyGrd.getColumnValues('qte_valeur'))
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
            oMsg.msg("error", 'Erreur de validation du formulaire');

            // on retire le masque "patientez"
            oForm.unmask();
            return;
        }

        // création du tableau de paramètres à passer au backend
        var oParams = {
            appName: Thot.app.appConfig.name,
            // si idenreg == 0 on passe en création forcée, sinon en mise à jour
            action: (oForm.param.idenreg == 0 ? 'NewActivitie' : 'updateAct'),
            // on indique au backend que l'opération se fait en mode correction (pour la création)
            mode: 'correction',
            act_id: oForm.param.idenreg, // identifiant de l'activité corrigée
            rsc_id: iUserId, // identifiant de l'opérateur authentifié qui a réalisé les corrections
            fields: Ext.encode(aFormFields),
            originalval: Ext.encode(oForm.originalValues),
            quantity: Ext.encode(aQuantity)
        };

        // appel au backend pour déclencher l'action attendue (création/correction)
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