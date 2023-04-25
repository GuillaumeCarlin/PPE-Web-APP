Ext.define('Thot.view.act.FormCreateActController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.act-formcreateact',
    /**
     * @author : edblv
     * date   : 01/06/16 15:40
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * afterRender du formulaire
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oUsersGrd = oForm.query('#operatorSel')[0];
        var oUsersStr = oUsersGrd.getStore();
        var oSectionCombo = oForm.query('#sectionCbo')[0];

        // lecture de la chaine des id des sections supervisées dans le localStorage
        oMe.currentSection = Thot.app.getSection();
        // si la chaine des id est vide alors on ne peut pas aller plus loin
        if (oMe.currentSection.idsection === '') {
            var oMsg = Thot.app.MessageInfo();
            oMsg.init(5000);
            oMsg.msg('error', 'Aucune section à superviser n\'a été seléctionnée');
            oSectionCombo.setDisabled(true);
            return;
        }

        // on transforme la chaine des id de sections en tableau
        var aSection = oMe.currentSection.idsection.split(',');
        // on identifie la combo des sections et son store
        var oSectionCbo = oForm.query('#sectionCbo')[0];
        var oSectionStr = oSectionCbo.getStore();
        // on met à jour le filtre du store utilisateurs
        var aFilter = [];
        aFilter.push({
            type: 'sab_id',
            value: oMe.currentSection.idsection
        });
        aFilter.push({
            type: 'oct_id_membre2',
            value: oForm.param.custom.oct_id_membre2
        });
        // on met à jour la combo des sections supervisées (uniquement celles sélectionnées)
        oSectionStr.setExtraParams({ // application du filtre
            storefilters: {
                specfilter: aFilter
            }
        });
        oSectionStr.load(); // chargement du store des sections
        // si il n'y a qu'une seule section supervisée
        if (aSection.length < 2) { // la longueur du tableau est inférieure à 2 (un seul élément)
            oMe.selectedSection(oMe.currentSection.idsection);
            oSectionCbo.setValue(oMe.currentSection.idsection);
            //application du filtre courant au store des utilisateurs
            oUsersStr.setExtraParams({
                storefilters: {
                    specfilter: aFilter
                }
            });
            // chargement du store utilisateurs
            oUsersStr.load();
            // désactive la liste des sections, il n'y en a qu'une, inutile de développer la liste
            oSectionCombo.setDisabled(true);
        } else {
            oSectionCbo.validate();
        }

        var oClosedOfBtn = oForm.query('#closedOf')[0];
        var oOperationGrd = oCard.query('#operationSel')[0];
        var oOperationStr = oOperationGrd.getStore();

        oOperationStr.dataLoaded = false;
        oOperationStr.closedOfMode = false;
        oOperationStr.on({
            load: function (_oData) {
                if (!oOperationStr.closedOfMode) {
                    oClosedOfBtn.hide();
                    oMe.opeFilter();
                }
                oOperationStr.dataLoaded = true;
            }
        });
    },

    // // DEV: HVT 2019-12-19 18:16:14 test filtrage
    // // ça fonctionne, il faut maintenant ajouter 26 boutons (par une fonction pour aller plus vite)
    // // et proposer un filtrage rapide par la première lettre du nom
    // onFilterAclick: function () {
    //     const oForm = this.getView(),
    //         oCard = oForm.query('#cardPanel')[0],
    //         oUsersGrd = oCard.query('#operatorSel')[0],
    //         oUsersStr = oUsersGrd.getStore(),
    //         oBtn = oCard.query('#filterA')[0];

    //     if (oBtn.pressed == true) {

    //         oUsersStr.filter('usr_nom', oBtn.text);
    //     } else {
    //         oUsersStr.clearFilter();
    //     }
    // },
    /**
     * @author : edblv
     * date   : 13/06/16 10:04
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Mise à jour du fil d'ariane
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    arianeUpdate: function () {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        var sActiveCard = oLayout.getActiveItem().itemId;
        var oOperatorId = oCard.query('#selectedOperId')[0];
        var oOperatorLabel = oCard.query('#selectedOper')[0];
        var oWorkStnId = oCard.query('#selectedWorkStnId')[0];
        var oWorkStnLabel = oCard.query('#selectedWorkStn')[0];
        var oOperationId = oCard.query('#selectedOperationId')[0];
        var oOperationLabel = oCard.query('#selectedOperation')[0];
        var oAriane = oForm.query('#ariane')[0];
        var sAriane = '';
        var sArianeSep = ' <a class="thot-ariane-sep"></a> ';

        if (oOperatorLabel.getValue()) {
            sAriane = '<a class="thot-ariane-info">' + oOperatorLabel.getValue() + '</a>';
        }

        switch (sActiveCard) {
            case 'workStnSel':
                if (oWorkStnLabel.getValue() !== '' && oWorkStnLabel.getValue() !== undefined) {
                    sAriane += sArianeSep + '<a class="thot-ariane-info">' + oWorkStnLabel.getValue() + '</a>';
                }
                break;

            case 'operationSel':
                sAriane += sArianeSep + '<a class="thot-ariane-info">' + oWorkStnLabel.getValue() + '</a>';

                if (oOperationLabel.getValue() !== '' && oOperationLabel.getValue() !== undefined) {
                    sAriane += sArianeSep + '<a class="thot-ariane-info">' + oOperationLabel.getValue() + '</a>';
                }
                break;
        }

        oAriane.setValue(sAriane);
    },
    /**
     * @author : edblv
     * date   : 10/06/16 09:20
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Selection d'une section dans la combo sur volet 1
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onSectionSel: function (_oCombo, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oSelectedSabId = oCard.query('#selectedSabId')[0];
        var oUsersGrd = oCard.query('#operatorSel')[0];
        var oUsersStr = oUsersGrd.getStore();
        var oWorkStnGrd = oCard.query('#workStnSel')[0];
        var oWorkStnStr = oWorkStnGrd.getStore(),
            oBtnNonrealisee = oForm.query('#nonrealisee')[0];

        var aFilter = [];
        aFilter.push({
            type: 'sab_id',
            value: oRecord.get('sab_id')
        });
        aFilter.push({
            type: 'oct_id_membre2',
            value: oForm.param.custom.oct_id_membre2
        });

        oMe.selectedSection(oRecord.get('sab_id'));
        //---- Chargement des users du service courant
        oUsersStr.removeAll();
        oUsersStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oUsersStr.load();
        oBtnNonrealisee.setVisible(false);

    },
    /**
     * @author Hervé Valot
     * @description filtre le store des utilisateurs
     */
    onUserFilter: function () {
        var oMe = this,
            oForm = oMe.getView(),
            oCard = oForm.query('#cardPanel')[0],
            oUsersGrd = oCard.query('#operatorSel')[0],
            oUsersStr = oUsersGrd.getStore(),
            oUserFilter = oCard.query('#searchfield')[0];

        var aFilter = [];

        // création du filtre
        oUsersStr.filter('usr_nom', oUserFilter.getValue());
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
    selectedSection: function (iSabId) {
        var oMe = this;
        var oForm = this.getView();
        var oSelectedSabId = oForm.query('#selectedSabId')[0];
        oSelectedSabId.setValue(iSabId);
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
    onTypeUserClick: function (_oContainer, oBtn, _bPressed) {
        var oMe = this;
        var oForm = this.getView();
        var oSectionCbo = oForm.query('#sectionCbo')[0];
        var oUsersGrd = oForm.query('#operatorSel')[0];
        var oUsersStr = oUsersGrd.getStore();

        if (oSectionCbo.getValue() == null) {
            var oMsg = Thot.app.MessageInfo();
            oMsg.init(5000);
            oMsg.msg('error', 'Il faut sélectionner une section');
        } else {
            var aFilter = [];
            aFilter.push({
                type: 'sab_id',
                value: (oBtn.itemId == 'allUsers' ? 'all' : oSectionCbo.getValue())
            });
            aFilter.push({
                type: 'oct_id_membre2',
                value: oForm.param.custom.oct_id_membre2
            });

            //---- Chargement des users
            oUsersStr.removeAll();
            oUsersStr.setExtraParams({
                storefilters: {
                    specfilter: aFilter
                }
            });
            oUsersStr.load();
        }
    },
    /**
     * @author : edblv
     * date   : 02/06/16 11:30
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Selection d'un opérateur
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onOperatorSel: function (_oGrid, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oOperId = oCard.query('#selectedOperId')[0];
        var oOperLabel = oCard.query('#selectedOper')[0];
        var oWorkStnStr = oCard.query('#workStnSel')[0].getStore(),
            oBtnNonrealisee = oForm.query('#nonrealisee')[0];

        oOperId.setValue(oRecord.get('usr_id'));
        oOperLabel.setValue(oRecord.get('usr_prenom') + ' ' + oRecord.get('usr_nom'));
        oMe.arianeUpdate();
        // récupération des paramètres pour mise à jour des équipements
        var aFilter = [];
        aFilter.push({
            type: 'sab_id',
            value: oForm.query('#selectedSabId')[0].value
        });
        aFilter.push({
            type: 'usr_id',
            value: oRecord.get('usr_id')
        });
        //---- Chargement des équipements du service courant
        oWorkStnStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oWorkStnStr.load();
        oBtnNonrealisee.setVisible(false);
    },
    /**
     * @author : edblv
     * date   : 02/06/16 11:58
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Sélection d'un équipement
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onWorkStnSel: function (_oGrid, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oWorkStnId = oCard.query('#selectedWorkStnId')[0];
        var oWorkStnLabel = oCard.query('#selectedWorkStn')[0];
        var oSearchOf = oForm.query('#ofNum')[0]; // le champ de recherche OF
        var oGroupBtn = oForm.query('#opeType')[0], // le groupe de boutons toggle
            oAltOpeBtn = oForm.query('#altOpe')[0], // le toggle op alternatives
            oActOpeBtn = oForm.query('#actOpe')[0], // le toggle op active
            oStopOpeBtn = oForm.query('#stopOpe')[0], // le toggle op terminée
            oBtnNonrealisee = oForm.query('#nonrealisee')[0];
        var oMsg = Thot.app.MessageInfo();
        oWorkStnId.assistEnabled = (oRecord.get('surutilisation') > 0);

        if (oRecord.get('rsc_estchargee') < 1) { // l'équipement n'a pas de charge
            oMsg.init(5000);
            oMsg.msg('avert', 'Aucune opération n\'est planifiée sur cet équipement');
        }

        if (parseInt(oRecord.get('ext'), 10) == 0) { // ressource externe, pas de blocage
            if (oRecord.get('surutilisation') > 1 && oRecord.get('imt') == 0) {
                oMsg.init(5000);
                oMsg.msg('avert', 'Seul le mode collaboratif est possible sur cet équipement');
            }
        }

        oWorkStnId.setValue(oRecord.get('rsc_id'));
        oWorkStnLabel.setValue(oRecord.get('rsc_code') + ' / ' + oRecord.get('rsc_libelle'));

        // actualisation des informations affichées et restauration de l'état des contrôles du formulaire
        oMe.arianeUpdate();
        oSearchOf.setValue(undefined);
        oAltOpeBtn.setPressed(false);
        oActOpeBtn.setPressed(false);
        oStopOpeBtn.setPressed(false);
        oMe.operationSel();

        oBtnNonrealisee.setVisible(false);
    },
    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Mise à jour du store des opération après sélection d'un équipement
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    operationSel: function () {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oWorkStnId = oCard.query('#selectedWorkStnId')[0];
        var oOperationGrd = oCard.query('#operationSel')[0];
        var oOperationStr = oOperationGrd.getStore();
        var oClosedOfBtn = oForm.query('#closedOf')[0];
        var bClosedOF = false;
        var oOfNum = oForm.query('#ofNum')[0];
        var aFilter = [{
            type: 'rsc_id',
            value: oWorkStnId.getValue()
        }];

        //---- Chargement des opérations liées à cet équipement
        oOperationStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        // vider le champ de recherche des OF
        oOfNum.setValue(null);

        oOperationStr.clearFilter();
        oOperationStr.removeAll();
        oOperationStr.load();
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
    opeFilter: function () {
        var oForm = this.getView();
        // identification des grilles nécessaires
        var oGrid = oForm.query('#operationSel')[0],
            oWstnGrid = oForm.query('#workStnSel')[0];
        // variables pour identification des boutons et objets de l'interface
        var oGroupBtn = oForm.query('#opeType')[0], // le groupe de boutons toggle
            oAltOpeBtn = oForm.query('#altOpe')[0], // le toggle op alternatives
            oActOpeBtn = oForm.query('#actOpe')[0], // le toggle op active
            oStopOpeBtn = oForm.query('#stopOpe')[0], // le toggle op terminée
            oAssistBtn = oForm.query('#assist')[0], // le bouton assistance (collaboratif)
            oSearchOf = oForm.query('#ofNum')[0]; // le champ de recherche OF
        // variables pour identification de la carte active
        var oCard = oForm.query('#cardPanel')[0],
            oLayout = oCard.getLayout(),
            sActiveCard = oLayout.getActiveItem().itemId;
        // variable pour stocker l'enregistrement équipement sélectionné
        var oRecord = oWstnGrid.getSelectionModel().getSelection()[0].data;
        // variable pour stocker le tableau des filtres à appliquer au store
        var aFilter = [];
        var bAssist = false;

        if (sActiveCard == 'workStnSel') {
            // si l'équipement est collaboratif (CLB=1) et utilisé alors on est en mode collaboratif exclusivement

            // initialisation des boutons
            oActOpeBtn.setVisible(false); // on cache le bouton bascule "opération en cours"
            oActOpeBtn.pressed = false; // on lève le bouton
            oAltOpeBtn.setVisible(false); // on cache le bouton bascule "opération alternative"
            oAltOpeBtn.pressed = false; // on lève le bouton
            oStopOpeBtn.setVisible(false); // on cache le bouton bascule "opération terminée"
            oStopOpeBtn.pressed = false; // on lève le bouton
            oAssistBtn.setVisible(false); // on cache le bouton "collaboratif"

            // gestion de la collaboration
            // si l'équipement est collaboratif
            if (parseInt(oRecord.clb, 10) == 1) {
                // si l'équipement collaboratif est actif
                if (parseInt(oRecord.surutilisation, 10) > 0) {
                    // on ne peut faire que du collaboratif
                    // on passe le bouton "collaboratif" à enfoncé pour la suite (état utilisé pour forcer la création d'activités collaboratives)
                    oAssistBtn.pressed = true;
                    oSearchOf.setVisible(false);
                    // mise à jour du filtre du store pour n'afficher que les opérations en cours
                    aFilter.push({
                        property: 'encours',
                        value: 1
                    }, {
                        // ce filtre permet de n'afficher que l'opération en cours sur l'équipement sélectionné dans le cas d'une collaboration
                        property: 'eqp_id_ec',
                        value: parseInt(oRecord.rsc_id)
                    });
                    // il y a un cas particulier actif + CLB + IMT à traiter pour permettre à l'opérateur d'activer le mode collaboratif
                    // si l'équipement est immatériel
                    if (parseInt(oRecord.imt, 10) == 1) {
                        // on affiche le bouton bascule "afficher les op actives"
                        oActOpeBtn.setVisible(true);
                        oSearchOf.setVisible(true);
                        // mise à jour du filtre du store, on n'affiche que les opérations en cours sur la ressource
                        aFilter.push({
                            type: 'rsc_id',
                            value: oRecord.rsc_id
                        });
                    }
                    // gestion des boutons affichés sur la page des opérations
                    oActOpeBtn.setVisible(false); // on cache le bouton bascule "opération en cours"
                    oAltOpeBtn.setVisible(false); // on cache le bouton bascule "opération alternative"
                    oStopOpeBtn.setVisible(false); // on cache le bouton bascule "opération terminée"
                }
                // si l'équipement collaboratif est inactif
                else {
                    // on ne peut pas collaborer sur un équipement inactif
                    // on passe le bouton "collaboratif" à levé pour la suite et caché
                    oAssistBtn.pressed = false;
                    oAssistBtn.setVisible(false);
                    // les boutons opération active, alternative et terminée sont disponibles
                    oActOpeBtn.setVisible(true);
                    oAltOpeBtn.setVisible(true);
                    oStopOpeBtn.setVisible(true);
                    // le champ de recherche est visible
                    oSearchOf.setVisible(true);
                    // mise àjour des filtres
                    aFilter.push({
                        type: 'rsc_id',
                        value: oRecord.rsc_id
                    });
                    aFilter.push({ // filtre par défaut, n'affiche que les opérations planifiées
                        property: 'priorite',
                        value: 2
                    }, { // exclusion des opérations terminées
                        property: 'opn_estterminee',
                        value: 0
                    });
                }
            } else {
                // l'équipement n'est pas collaboratif
                // l'équipement est inactif, quel que soient ses attributs (IMT, STD, AUT, MPS)
                if (parseInt(oRecord.surutilisation, 10) == 0) {
                    // on doit pouvoir choisir une opération planifiée (filtre par défaut), alternative (activée avec un bouton) ou chercher une opération terminée (champ de recherche)
                    oActOpeBtn.setVisible(true);
                    oAltOpeBtn.setVisible(true);
                    oStopOpeBtn.setVisible(true);
                    oSearchOf.setVisible(true);
                } else // l'équipement est actif
                {
                    // il est immatériel
                    if (parseInt(oRecord.imt, 10) == 1) {
                        // on doit pouvoir afficher les opérations en cours (bouton), planifiées, alternatives et faire des recherches
                        oActOpeBtn.setVisible(true);
                        oAltOpeBtn.setVisible(true);
                        oStopOpeBtn.setVisible(true);
                        oSearchOf.setVisible(true);
                    }
                    // il est multipostes
                    if (parseInt(oRecord.mps, 10) == 1) {
                        // on doit pouvoir afficher les opérations planifiées, alternatives et faire des recherches
                        oAltOpeBtn.setVisible(true);
                        oActOpeBtn.setVisible(true);
                        oStopOpeBtn.setVisible(true);
                        oSearchOf.setVisible(true);
                    }
                    // pour les autres cas, AUT et STD, on ne peut rien faire si l'équipement est actif
                }
                // filtre sur opérations planifiées par défaut
                aFilter.push({
                    property: 'priorite',
                    value: 2
                }, {
                    property: 'opn_estterminee',
                    value: 0
                }, {
                    property: 'encours',
                    value: 0
                });
            }
        }

        if (sActiveCard == 'operationSel') {
            //---- Clic sur un des deux boutons bascule
            oGroupBtn.setDisabled(false);

            if (!oAltOpeBtn.pressed) { // opérations alternatives désactivé
                // affichage uniquement des opérations planifiées sur l'équipement
                aFilter.push({
                    property: 'priorite',
                    value: 2
                });
            }
            if (!oActOpeBtn.pressed) { // opérations en cours désactivé
                aFilter.push({
                    property: 'encours',
                    value: 0
                });
            }
            if (!oStopOpeBtn.pressed) { // opérations en cours désactivé
                aFilter.push({
                    property: 'opn_estterminee',
                    value: 0
                });
            }
        }
        oGrid.getStore().clearFilter();
        oGrid.getStore().setFilters(aFilter);
    },
    /**
     * @author : edblv
     * date   : 02/06/16 14:02
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Selection d'une opération
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onOperationSel: function (_oGrid, oRecord) {
        var oMe = this,
            oForm = this.getView(),
            oCard = oForm.query('#cardPanel')[0],
            oOperId = oCard.query('#selectedOperationId')[0],
            oOperLabel = oCard.query('#selectedOperation')[0],
            oBtnNonrealisee = oCard.query('#nonrealisee')[0];

        oOperId.setValue(oRecord.get('opn_id'));
        oOperLabel.setValue(oRecord.get('odf_code') + ' / ' + oRecord.get('opn_code') + ' : ' + oRecord.get('pst_libelle'));
        oMe.arianeUpdate();

        //si l'opération n'est pas commencée alors on peut afficher le bouton "Non réalisée"
        oBtnNonrealisee.setVisible(oRecord.get('opn_date_debutreel') == undefined ? true : false);
    },
    /**
     * @author : edblv
     * date   : 24/06/16 14:31
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Validation en cours de frappe sur champ n° OF
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onPickerValueChange: function (oField, sValue, sOldValue) {
        var oMe = this;
        var oForm = this.getView();
        var oPicker = oField.getPicker();
        var oGrid = oForm.query('#operationSel')[0];
        var oStore = oGrid.getStore();
        oPicker.validField(oField, sValue, sOldValue);

        oStore.filter('odf_code', oField.getValue());

        // if (oField.getValue() !== undefined && oField.getValue() !== '') {
        //     if (oStore.closedOfMode) {
        //         //---- Si on est en mode 'OF Terminé' on relance une requête dans la base
        //         oMe.operationSel(true);
        //     } else {
        //         //---- Si on n'est pas en mode 'OF Terminé', on continu à filtrer dans le store
        //         oStore.filter('odf_code', oField.getValue());
        //     }
        // } else {
        //     if (oStore.closedOfMode) {
        //         //---- Si on est en mode 'OF Terminé' on remet en place le filtre d'origine
        //         oStore.closedOfMode = false;
        //         oMe.operationSel(false);
        //     } else {
        //         oMe.opeFilter();
        //     }
        // }
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
    onClosedOfClick: function (oBtn) {
        var oMe = this;
        var oForm = this.getView();
        var oOfNum = oForm.query('#ofNum')[0];

        if (!oBtn.pressed) {
            oOfNum.setValue('');
        } else {
            oMe.operationSel(oBtn.pressed);
        }
    },
    /**
     * @author : edblv
     * date   : 01/06/16 16:02
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Précédent'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onPreviousClic: function (oBtn) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        var oNextBtn = oCard.query('#next')[0];
        var sActiveCard = oLayout.getActiveItem().itemId;

        if (sActiveCard !== 'operatorSel') {
            oNextBtn.setDisabled(false);
            oNextBtn.setText('Suivant');
            oNextBtn.setIconCls('thot-icon-next');
            oLayout.prev();
            oMe.arianeUpdate();

            switch (oLayout.getActiveItem().itemId) {
                case 'operatorSel':
                    oBtn.setDisabled(true);
                    break;
            }
        }
    },
    /**
     * @author : edblv
     * date   : 01/06/16 16:02
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Suivant'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onNextClic: function (oBtn) {
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oLayout = oCard.getLayout();
        var oPreviousBtn = oCard.query('#previous')[0];
        var sActiveCard = oLayout.getActiveItem().itemId;
        var oOperId = oCard.query('#selectedOperId')[0];
        var oWorkStnId = oCard.query('#selectedWorkStnId')[0];
        var oOperationId = oCard.query('#selectedOperationId')[0];
        var oAssistBtn = oCard.query('#assist')[0];
        var oGroupBtn = oForm.query('#opeType')[0];
        var bNext = true;
        var oMsg = Thot.app.MessageInfo();

        switch (sActiveCard) {
            case 'operatorSel':
                //---- Si on est sur 'Sélection d'opérateur', on ne peut pas
                //	passer au suivant tant qu'on n'a pas sélectionné un opérateur
                if (parseInt(oOperId.getValue(), 10) < 1) {
                    oMsg.init(5000);
                    oMsg.msg('error', 'Il faut sélectionner un opérateur');
                    bNext = false;
                }
                break;
            case 'workStnSel':
                //---- Si on est sur 'Sélection d'équipement', on ne peut pas
                //	passer au suivant tant qu'on n'a pas sélectionné un équipement
                if (parseInt(oWorkStnId.getValue(), 10) < 1) {
                    oMsg.init(5000);
                    oMsg.msg('error', 'Il faut sélectionner un équipement');
                    bNext = false;
                }
                break;
            case 'operationSel':
                //---- Si on est sur 'Sélection d'opération', on ne peut pas
                //	terminer tant qu'on n'a pas sélectionné une opération
                if (parseInt(oOperationId.getValue(), 10) < 1) {
                    oMsg.init(5000);
                    oMsg.msg('error', 'Il faut sélectionner une opération');
                    bNext = false;
                } else {
                    oBtn.setDisabled(true); //DEV: HVT 2023-02-03 11:12:55, test pour éviter le double-clic qui engendre la création de doublons
                    oMe.createActCtrl();
                }

                bNext = false;
                break;
        }

        //---- Si l'action 'Suivant' est validée
        if (bNext) {
            oPreviousBtn.setDisabled(false);
            oLayout.next();
            oMe.arianeUpdate();

            switch (oLayout.getActiveItem().itemId) {
                case 'operationSel':
                    oGroupBtn.setDisabled(false);

                    //---- Activation/Désactivation du bouton 'Assistance'
                    if (oWorkStnId.assistEnabled) {
                        oAssistBtn.setDisabled(false);
                    } else {
                        oAssistBtn.setDisabled(true);
                    }

                    oBtn.setText('Terminé');
                    oBtn.setIconCls('thot-icon-validate');
                    break;
            }
        }
    },
    /**
     * @author : edblv
     * date   : 14/06/16 12:08
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Contrôle avant création d'activité
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    createActCtrl: function () {
        var oMe = this;
        var oForm = this.getView();
        oForm.getValid();
    },
    /**
     * @author : edblv
     * date   : 23/06/16 15:43
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Traitement du retour (true/false) de la méthode
     * de validation du formulaire (override/form/Panel.js -> getValid())
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    _fTest: function (bResult) {
        var oMe = this;
        var oForm = this.getView();

        if (bResult) {
            //---- On crée la tâche
            oMe.createActivitie();
        } else {
            //---- On arrête là
            oMe.onCancelClic();
        }
    },
    /**
     * @author : edblv
     * date   : 03/06/16 10:01
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Création d'une activité
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    createActivitie: function () { // iOperationId, iOfId, iOperatorId, iWorkStnId
        var oMe = this;
        var oForm = this.getView();
        var oCard = oForm.query('#cardPanel')[0];
        var oWin = oForm.up('window');
        var oSelectedSabId = oForm.query('#selectedSabId')[0];
        var oOperId = oCard.query('#selectedOperId')[0];
        var oWorkStnId = oCard.query('#selectedWorkStnId')[0];
        var oOperationGrd = oCard.query('#operationSel')[0];
        var oAssistBtn = oForm.query('#assist')[0];
        var aOperation = oOperationGrd.getSelectionModel().getSelection();

        // on désactive le formulaire et on affiche le masque "patientez"
        oForm.mask('création de l\'activité en cours ...');

        // appel PHP pour créer l'activité Production
        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'NewActivitie',
                mode: 'production',
                ope_id: aOperation[0].get('opn_id'), // iOperationId,
                odf_id: aOperation[0].get('odf_id'), // iOfId,
                org_id: oSelectedSabId.getValue(),
                rsc_id: oOperId.getValue() + ',' + oWorkStnId.getValue(), // iOperatorId + ', ' + iWorkStnId
                closedoper: aOperation[0].get('opn_estterminee'),
                assistance: (oAssistBtn.pressed ? 1 : 0)
            },
            success: function () {},
            failure: function () {},
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var oMain = Thot.app.viewport;

                if (oBack.success) {
                    //---- Si l'activité à bien été créée, on envoie le message Websocket
                    oMain.fireEvent('send', 'maj', oForm.xtype, ['currentAct']);

                    // ...et on ferme la fenêtre
                    oWin.close();
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', 'Impossible de créer cette opération...');

                    // on réactive le bouton NEXT et on retire le masque "patientez"
                    oCard.query('#next')[0].setDisabled(false); //DEV: HVT 2023-02-03 11:18:46
                    oForm.unmask();

                }
            }
        });
    },
    /**
     * @author Hervé Valot
     * @description marque l'opération sélectionné comme non réalisée
     * @date 20200916
     */
    onNonRealiseeClick: function () {
        var oForm = this.getView(),
            oWin = oForm.up('window'),
            oCard = oForm.query('#cardPanel')[0],
            oOperationGrid = oCard.query('#operationSel')[0],
            oUsrID = oCard.query('#selectedOperId')[0],
            aOperation = oOperationGrid.getSelectionModel().getSelection();

        // demander confirmation
        Ext.MessageBox.alert({
            title: 'Déclarer l\'opération non réalisée',
            message: 'L\'opération va être marquée non réalisée, veulliez confirmer',
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.Msg.WARNING,
            closable: false,
            fn: function (btn) {
                if (btn === 'ok') { // l'opérateur a confirmé
                    // afficher le masque du formulaire, éviter de cliquer sur un autre bouton
                    oForm.mask();

                    // dclencher la requête AJAX
                    Ext.Ajax.request({
                        url: 'server/ope/Operations.php',
                        // déclaration des paramètres à passer au backend
                        params: {
                            appName: Thot.app.appConfig.name,
                            action: 'setNonRealisee',
                            usr_id: oUsrID.getValue(), // opérateur déclarant l'opération non réalisée
                            opn_id: aOperation[0].get('opn_id') // opération non réalisée
                        },
                        success: function () {},
                        failure: function () {},
                        callback: function (_opt, _success, oResponse) {
                            var oBack = Ext.decode(oResponse.responseText);

                            if (oBack.success) {
                                // DEV: 2020-09-16 16:35:13 HVT pas d'actualisation à passer pour l'instant
                                // DEV: à reprendre si émission d'une alerte 

                                // on ferme la fenêtre
                                oWin.close();
                            } else {
                                var oMsg = Thot.app.MessageInfo();
                                oMsg.init(5000);
                                oMsg.msg('error', 'Impossible de terminer l\'action demandée.');

                                // on retire le masque "patientez"
                                oForm.unmask();
                            }
                        }
                    });
                }
            }
        });

    },
    /**
     * @author : edblv
     * date   : 01/06/16 16:02
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Annuler'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onCancelClic: function () {
        var oMe = this;
        var oForm = this.getView();
        var oWin = oForm.up('window');
        oWin.close();
    }

});