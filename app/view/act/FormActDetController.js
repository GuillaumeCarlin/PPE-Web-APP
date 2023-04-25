/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define('Thot.view.act.FormActDetController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.act-formactdet',
    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        const oAleaBtn = oForm.query('#aleaBtn')[0],
            oStopActBtn = oForm.query('#stopBtn')[0],
            oSuspendActBtn = oForm.query('#suspendBtn')[0];
        oMe.action = '';

        // gestion de l'affichage des boutons du formulaire
        //     si l'activité est collaborative, l'opérateur ne peut que suspendre l'opération
        //     si l'activité est de type qualité, l'opérateur ne peut que terminer l'opération
        //     dans tous les autres cas, l'opérateur peut terminer ou suspendre

        if (parseInt(oForm.config.param.custom.data.collaboration) > 1) {
            // on n'affiche que le bouton suspendre
            oSuspendActBtn.setHidden(false);
            oStopActBtn.setHidden(true);
        } else {
            if (oForm.param.custom.data.oct_code == 'QUAL') {
                // on n'affiche que le bouton terminer
                oSuspendActBtn.setHidden(true);
                oStopActBtn.setHidden(false);
            } else {
                if (oForm.param.custom.data.oct_code == 'PROD') {
                    // on affiche les deux bouton
                    oSuspendActBtn.setHidden(false);
                    oStopActBtn.setHidden(false);
                    // si un aléa est en cours on change l'intitulé du bouton des aléas
                    if (oForm.param.custom.get('ala_id') > 0) {
                        // affiche le bouton, masqué par défaut
                        oAleaBtn.setHidden(false);
                        oAleaBtn.setText('Terminer l\'aléa en cours');
                        if (oForm.param.custom.data.alt_code == 'REG') {
                            // on est en mode réglage, on ne peut que terminer le réglage
                            oStopActBtn.setHidden(true);
                            oSuspendActBtn.setHidden(true);
                            oAleaBtn.setText('Terminer le réglage en cours');
                        }
                    }
                } else {
                    oAleaBtn.setHidden(true);
                }
            }
        }
    },
    /**
     * @author : edblv
     * date   : 08/06/16 09:48
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Suspendre une activité
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onSuspendClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oPanel = oForm.query('#actionPnl')[0];
        var oLayout = oPanel.getLayout();
        var oWin = oForm.up('window');

        oMe.increaseWin(150);

        oMe.action = 'Suspend';
        oLayout.next();

        // // passe le focus à la grille des quantités
        // NOTE: HVT 2021-04-21 19:37:06, provoque un problème de validation des données de la grille des quantités (il faut sélectionner toutes les cellules même sans rien saisir pour éviter le bug)
        //  var oQtyGrid = oForm.query('#quantity')[0];
        //     context;
        // context = oQtyGrid.getView().getPosition(0, 1);
        // oQtyGrid.setActionableMode(true, context);
        // oQtyGrid.startEditing(0, 1);


        // si on a à faire à une collaboration (collaboration > 1)
        if (parseInt(oForm.config.param.custom.data.collaboration) > 1) {
            // c'est le dernier utilisateur de la collaboration qui saisira les Quantités
            // tant que la collaboration est en cours les quantités saisies sont à 0
            // la épartition des quantités se fera lorsque le dernier collaborateur
            // terminer son activté
            // afficher un mssage à l'utilisateur pour l'informer et confirmr la fin d'activité

            // fermer le formulaire détail activité
            // afficher le message de demande de confirmation
            Ext.Msg.show({
                title: 'Activité collaborative en cours',
                message: 'Seul le dernier opérateur d\'une activité collaborative peut saisir les quantités produites. </br> aucune quantité à saisir, voulez-vous terminer l\'activité  ?',
                // message: 'aucune quantité à saisir, voulez-vous terminer l\'activité  ?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.INFO,
                fn: function (btn) {
                    if (btn == 'yes') {
                        // on enregistre l'activité
                        // on place la quantité bon à 0
                        var oMain = Thot.app.viewport;
                        var oACtProdDetail = oForm.query('#actProdDetCmp')[0];
                        var oNptr = oACtProdDetail.query('#nptr')[0];
                        var aQuantity = {
                            qtp_id: ['1'], //id du type quantité 'bon'
                            qty: ['0']
                        };
                        var aExpectedQty = {
                            prevQty: oACtProdDetail.query('#qtyPrevOpe')[0].getValue(),
                            expectedQty: oACtProdDetail.query('#expectedQty')[0].getValue(),
                            expectedMin: oACtProdDetail.query('#expectedMin')[0].getValue(),
                            expectedMax: oACtProdDetail.query('#expectedMax')[0].getValue(),
                            nptr: oNptr.getValue()
                        };

                        Ext.Ajax.request({
                            url: 'server/act/Activities.php',
                            params: {
                                appName: Thot.app.appConfig.name,
                                action: 'NoQuantityCheck',
                                act_id: oForm.param.idenreg,
                                ope_id: oForm.param.custom.get('usr_id_realise'),
                                expectedqty: Ext.encode(aExpectedQty),
                                quantity: Ext.encode(aQuantity),
                                alt_qterequis: 0, //isalea
                                ala_id: oForm.param.custom.get('ala_id')
                            },
                            success: function () {},
                            failure: function () {},
                            callback: function (opt, success, oResponse) {
                                var oBack = Ext.decode(oResponse.responseText);

                                if (oBack.success) {
                                    oMain.fireEvent('send', 'maj', oForm.xtype, ['currentAct', 'histoAct']);
                                    // oMe.onCancelClick();
                                } else {
                                    oBack.oMsg = [];

                                    for (var iIndMsg in oBack.message) {
                                        oBack.oMsg[iIndMsg] = Thot.app.MessageInfo();
                                        oBack.oMsg[iIndMsg].init(5000);
                                        oBack.oMsg[iIndMsg].msg('error', oBack.message[iIndMsg]);
                                    }
                                }
                            }
                        });
                    } else { // on ne fait rien et on ferme le message

                    }
                    oWin.close();
                }
            });
        }
    },
    /**
     * @author : edblv
     * date   : 08/06/16 09:48
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Terminer une activité
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onStopClick: function () {
        var oMe = this;
        var oForm = this.getView();
        // var oPanel = oForm.query('#actionPnl')[0];
        var oActDetail = oForm.query('#actDetCmp')[0];
        var oPreviousActClosed = oActDetail.query('#opnp_estterminee')[0];
        // var oLayout = oPanel.getLayout();
        // var bContinue = true;
        var oMsg = Thot.app.MessageInfo();

        if (parseInt(oForm.config.param.custom.data.collaboration) > 1) {
            //---- Si l'opération est collaborative, nombre de collaborateurs > 1
            oMsg.init(5000);
            oMsg.msg('error', 'Action non autorisée, opération collaborative, seul le dernier opérateur pourra terminer l\'opération');
            return;
        }

        // OCT_ID > 1 -- opération autre que production
        if (oActDetail.record.oct_id > 1) {
            oMe._onStopClick();
            return;
        }

        //---- Si l'opération précédente n'est pas terminée on ne peut pas terminer l'opération en cours (cohérence de la chronologie de la gamme)
        if (parseInt(oPreviousActClosed.getValue()) < 1) {
            oMsg.init(5000);
            oMsg.msg('error', 'L\'opération précédente n\'est pas terminée. Action non autorisée');
        } else {
            oMe._onStopClick();
        }
    },

    _onStopClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oPanel = oForm.query('#actionPnl')[0];
        var oLayout = oPanel.getLayout();
        var oActDetail = oForm.query('#actDetCmp')[0];

        oMe.increaseWin(150);
        oMe.action = 'Stop';

        // le mode de fermeture peut varier en fonction du type d'opération
        switch (parseInt(oActDetail.record.oct_id)) {
            case 1: // production
                oMe.action = 'Stop';
                break;
            case 2: // qualité
                oMe.action = 'StopLimitedControl';
                break;
            case 3: // hors prod, aléa
                break;
            case 4: // non planifié
                oMe.action = 'NoQuantityCheck';
                break;
            default:
                oMe.action = 'Stop'; // tests restrictifs par défaut
        }

        oLayout.next();

        // // passe le focus à la grille des quantités
        // NOTE: HVT 2021-04-21 19:37:06, provoque un problème de validation des données de la grille des quantités (il faut sélectionner toutes les cellules même sans rien saisir pour éviter le bug)
        // var oQtyGrid = oForm.query('#quantity')[0],
        //     context;
        // context = oQtyGrid.getView().getPosition(0, 1);
        // oQtyGrid.setActionableMode(true, context);

    },
    /**
     * @author : edblv
     * date   : 14/06/16 14:39
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Déclarer un aléa'/'Terminer un aléa'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onAleaClick: function () {
        var oMe = this;
        var oForm = this.getView();

        if (oForm.param.custom.get('ala_id') > 0) {
            //---- Terminer un aléa
            oMe.aleaEnd();
        } else {
            //---- Commencer un aléa
            oMe.aleaStart();
        }
    },
    /**
     * @author : edblv
     * date   : 16/06/16 13:33
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Déclarer un aléa
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    aleaStart: function () {

        var oMe = this;
        var oForm = this.getView();
        var oPanel = oForm.query('#actionPnl')[0];
        var oLayout = oPanel.getLayout();
        var oAleaTab = oPanel.query('#alea')[0];
        oLayout.setActiveItem('alea');
        oMe.increaseWin(250);

        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'AleaList',
                org_id: oForm.param.custom.data.org_id,
                oct_id: oForm.param.custom.data.oct_id
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var oTab = {};
                var sCatCode = '';
                var bNewTab = false;

                if (oBack.success) {
                    for (var iCat in oBack.liste) {
                        if (oBack.liste[iCat].alo_code !== sCatCode) {
                            //---- Changement de catégorie (donc d'onglet)
                            if (sCatCode !== '') {
                                //---- Si on n'est pas sur la première
                                // catégorie, on crée le nouvel onglet
                                oAleaTab.add(oTab);
                            }

                            sCatCode = oBack.liste[iCat].alo_code;
                            bNewTab = true;
                        }

                        if (bNewTab) {
                            oTab = {
                                title: oBack.liste[iCat].alo_libelle,
                                itemId: sCatCode,
                                bodyPadding: 10,
                                layout: {
                                    type: 'column'
                                },
                                items: []
                            };

                            bNewTab = false;
                        }

                        oTab.items.push({
                            xtype: 'button',
                            itemId: sCatCode + '_' + oBack.liste[iCat].ald_code,
                            columnWidth: 0.3,
                            text: oBack.liste[iCat].ald_libelle,
                            ald_id: oBack.liste[iCat].ald_id,
                            scale: 'large',
                            width: 220,
                            margin: '0 15 10 0',
                            handler: 'onSelAleaClick'
                        });
                    }
                    //---- Et on ajoute le dernier onglet
                    oAleaTab.add(oTab);
                }
            }
        });
    },
    /**
     * @author : edblv
     * date   : 16/06/16 13:33
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Terminer un aléa
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    aleaEnd: function () {
        var oMe = this;
        var oForm = this.getView();
        //aléa reglage, on doit demander les quantités produites en réglage
        if (oForm.items.items[0].record.alt_qterequis == 1) {
            var oPanel = oForm.query('#actionPnl')[0];
            var oLayout = oPanel.getLayout();
            oMe.increaseWin(150);
            oMe.action = 'Suspend'; // on déclenche l'action suspendre
            oLayout.next();
            // NOTE: HVT 2023-02-11 19:34:33, fait planter la validation des quantités
            // passe le focus à la grille des quantités
            // var oQtyGrid = oForm.query('#quantity')[0],
            //     context;
            // context = oQtyGrid.getView().getPosition(0, 1);
            // oQtyGrid.setActionableMode(true, context);
        }
        //aléa autre que reglage
        else {
            var oMain = Thot.app.viewport;

            Ext.Ajax.request({
                url: 'server/act/Activities.php',
                params: {
                    appName: Thot.app.appConfig.name,
                    action: 'AleaEnd',
                    ala_id: oForm.param.custom.get('ala_id')
                },
                success: function () {},
                failure: function () {},
                callback: function (opt, success, oResponse) {
                    var oBack = Ext.decode(oResponse.responseText);

                    if (oBack.success) {
                        oMain.fireEvent('send', 'maj', oForm.xtype, ['currentAct']);
                        oMe.onCancelClick();
                    }
                }
            });
        }
    },
    /**
     * @author : edblv
     * date   : 14/06/16 15:01
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Agrandi la fenêtre courante
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    increaseWin: function (iHeight) {
        var oMe = this;
        var oForm = oMe.getView();
        var oWin = oForm.up('window');
        var iWidth = 0;

        if (arguments.length > 1) {
            iWidth = arguments[1];
            oWin.setWidth(oWin.getWidth + iWidth);
        }

        oWin.setHeight(oWin.getHeight() + iHeight);
        oWin.setPosition(oWin.getX() - (iWidth / 2), oWin.getY() - (iHeight / 2));
    },
    /**
     * @author : edblv
     * date   : 09/06/16 11:38
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Validation en cours de frappe sur champ Quantité
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onPickerValueChange: function (oField, sValue, sOldValue) {
        var oPicker = oField.getPicker();
        oPicker.validField(oField, sValue, sOldValue);
    },
    /**
     * @author : edblv
     * @date   : 09/06/16 11:38
     * @description Fin de saisie d'une quantité, fait la somme des quantités saisies et met à jour le champ de formulaire Qté.déclarée
     * @version 20190424    HVT, modifié pour renvoyer undefined si les quantités ne sont pas renseignées (suite correction opérateur)
     */
    onQtyChange: function () {
        var oMe = this;
        var oForm = oMe.getView();
        var oQtyGrd = oForm.query('#quantity')[0];
        var oTotalQty = oForm.query('#totalQty')[0];
        var aQuantity = {
            qtp_id: oQtyGrd.getColumnValues('qtp_id'),
            qty: oQtyGrd.getColumnValues('qty')
        };
        var nTotal = 0;
        var bCalculated = false;
        for (var iInd in aQuantity.qtp_id) {
            if (aQuantity.qty[iInd] !== undefined && aQuantity.qty[iInd] !== '' && aQuantity.qty[iInd] !== null) {
                nTotal += parseFloat(aQuantity.qty[iInd]);
                bCalculated = true;
            }
        }
        if (bCalculated) { // si il y a eu calcul
            oTotalQty.setValue(Ext.util.Format.number(nTotal, '0.00'));
        } else { // sinon on renvoie undefined (nécessaire pour le script de validation des quantités)
            oTotalQty.setValue(undefined);
        }
    },
    /**
     * @author : edblv
     * date   : 14/06/16 15:50
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur un bouton 'Aléa'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onSelAleaClick: function (oBtn) {
        var oMe = this;
        var oForm = this.getView();
        var oMain = Thot.app.viewport;

        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'newAlea',
                act_id: oForm.param.idenreg,
                ald_id: oBtn.ald_id
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    oMain.fireEvent('send', 'maj', oForm.xtype, ['currentAct']);
                    oMe.onCancelClick();
                }
            }
        });
    },
    /**
     * @author : edblv
     * date   : 08/06/16 16:49
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Valider', déclenche la validation du formulaire en fonction de l'action définie
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onValidClick: function () {
        var oMe = this;
        var oForm = this.getView();
        // appelle la validation du formulaire avec les parametres action et type activité 
        oForm.getValid(oMe.action, oForm.param.custom.data.oct_code);
    },
    /**
     * @author : edblv
     * date   : 23/06/16 16:42
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Traitement du retour (true/false) de la méthode
     * de validation du formulaire (override/form/Panel.js -> getValid())
     *
     * notes HVT 20190120
     * cette fonction est appelée par le listener validForm du Panel, voir FormActDet.js ligne 20
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    _fTest: function (bValid) {
        var oMe = this;
        // var oForm = oMe.getView();

        if (bValid) {
            switch (oMe.action) {
                case 'Suspend':
                case 'Stop':
                case 'StopLimitedControl':
                case 'NoQuantityCheck':
                    oMe.saveQty();
                    break;
            }
        }
    },

    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * @description fermeture du formulaire sur annulation
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onCancelClick: function () {
        var oMe = this;
        var oForm = oMe.getView();
        var oWin = oForm.up('window');
        oWin.close();
    },
    /**
     * @author : edblv
     * date   : 23/06/16 16:45
     * @scrum : RND#ND-ND.ND
     *
     * @description Sauvegarde les quantités saisies puis termine l'action
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    saveQty: function () {
        var oMe = this;
        var oForm = this.getView();
        var oACtProdDetail = oForm.query('#actProdDetCmp')[0];
        var oNptr = oACtProdDetail.query('#nptr')[0];
        var oMain = Thot.app.viewport;
        var oQtyGrd = oForm.query('#quantity')[0];
        var aQuantity = {
            qtp_id: oQtyGrd.getColumnValues('qtp_id'),
            qty: oQtyGrd.getColumnValues('qty')
        };

        // préparattion du tableau des quantités pour enregistrement et analyse
        // si besoin de générer des alertes de dépassement NPTR
        var aExpectedQty = {
            prevQty: oACtProdDetail.query('#qtyPrevOpe')[0].getValue(),
            expectedQty: oACtProdDetail.query('#expectedQty')[0].getValue(),
            expectedMin: oACtProdDetail.query('#expectedMin')[0].getValue(),
            expectedMax: oACtProdDetail.query('#expectedMax')[0].getValue(),
            nptr: oNptr.getValue()
        };

        Ext.Ajax.request({
            url: 'server/act/Activities.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: oMe.action,
                act_id: oForm.param.idenreg,
                ope_id: oForm.param.custom.get('usr_id_realise'),
                expectedqty: Ext.encode(aExpectedQty),
                quantity: Ext.encode(aQuantity),
                alt_qterequis: oForm.items.items[0].record.alt_qterequis, //isalea
                ala_id: oForm.param.custom.get('ala_id')
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    oMain.fireEvent('send', 'maj', oForm.xtype, ['currentAct', 'histoAct']);
                    oMe.onCancelClick();
                } else {
                    oBack.oMsg = [];

                    for (var iIndMsg in oBack.message) {
                        oBack.oMsg[iIndMsg] = Thot.app.MessageInfo();
                        oBack.oMsg[iIndMsg].init(5000);
                        oBack.oMsg[iIndMsg].msg('error', oBack.message[iIndMsg]);
                    }
                }
            }
        });
    },
});