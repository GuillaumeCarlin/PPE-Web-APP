Ext.define("Thot.view.main.MainController", {
    extend: "Ext.app.ViewController",
    alias: "controller.main",
    needRole: [],
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
    onBeforeRender: function () {
        // var oMe = this;
        // var oForm = this.getView();
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
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        var oHelpBtn = oForm.query("#helpBtn")[0];

        //---- On fait la liste des objets soumis a autorisation
        for (var iIndObj in oForm.items.items) {
            if (oForm.items.items[iIndObj].disabled) {
                oMe.needRole.push(oForm.items.items[iIndObj].itemId);
            }
        }

        oMe.getUser();

        // mise à jour du chemin vers la documentation sur le bouton de la barre d'outils principale
        oHelpBtn.setHref(document.location.href + "/documentation/");

        // chargement des informations de version pour affichage sur l'interface utilisateur
        oMe.getAppInfo();

        //---- Connexion au serveur websockets
        oMe.webSocketsCnx();

        // FIXME: HVT 2021-03-26 16:19:20 : fonctionne en dev mais déconne en prod
        /**
         * @description lance la connexion avec le serveur websocket à intervalle défini dans le fichier de configuration
         *              pour palier aux problèmes de connexion WIFI de certains postes
         *              la perte de connexion entraine la déconnexion du WS et donc plus d'actualisation en temps réel
         *              lors de la modification des activités en cours de l'atelier supervisé.
         */
        // setInterval(function () {
        //     oMe.webSocketsCnx();
        // }, Thot.app.appConfig.websockets.checkcnxinterval);
    },

    /**
     * @author Hervé Valot
     * @description récupère les informations de version de l'application pour affichage sur l'interface
     * @date 20200901
     */
    getAppInfo: function () {
        var oMe = this,
            oForm = oMe.getView(),
            oBtnAppInfo = oForm.query("#btnappinfo")[0];

        Ext.Ajax.request({
            url: "server/AppInfo.php",
            success: function () {},
            failure: function () {},
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                oBtnAppInfo.setText(oBack.Tag == "trunk" ? "Dév." : oBack.Tag);

                oBtnAppInfo.setTooltip(
                    "<h3>" +
                        Thot.Labels.labels.about +
                        " TH<i class=\"fa fa-circle-o-notch\"></i>T</h3>" +
                        "<b>" +
                        Thot.Labels.labels.version +
                        " : </b>" +
                        oBack.Tag +
                        "</br><b>" +
                        Thot.Labels.labels.revision +
                        " : </b>" +
                        oBack.Rev +
                        "</br><b>" +
                        Thot.Labels.labels.date +
                        " : </b>" +
                        new Date(oBack.Date).toLocaleString()
                );
            }
        });
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
    getUser: function () {
        var oMe = this;
        // var oForm = oMe.getView();
        // var oLogoutBtn = oForm.query('#logoutBtn')[0];
        // var oUserName = oForm.query('#username')[0];

        //---- Ici, on fait un login sans password puisque
        //	c'est le SSO qui fournit le login
        Ext.Ajax.request({
            url: "server/usr/Users.php",
            params: {
                appName: Thot.app.appConfig.name,
                action: "login",
                login: Thot.app.cnxParams.login
            },
            success: function () {},
            failure: function () {},
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                if (oBack.success) {
                    if (oBack.liste.length > 0) {
                        Thot.app.contexte.userName = oBack.liste[0].sn;
                        Thot.app.contexte.userFirstName = oBack.liste[0].givenname;
                    }

                    oMe.getRole();
                    oMe.getSectionLabel();
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg("error", Thot.Labels.messages.errorlogin);
                }
            }
        });
    },

    /**
     * @author : edblv
     * date   : 21/06/16 15:17
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Récupération du (des) rôle(s) du user et
     * déverrouillage des objets si nécessaire
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    getRole: function () {
        var oMe = this;
        var oForm = this.getView();

        Ext.Ajax.request({
            url: "server/usr/Users.php",
            params: {
                appName: Thot.app.appConfig.name,
                action: "getrole",
                login: Thot.app.cnxParams.login
            },
            success: function () {},
            failure: function () {},
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var oBackData = [];
                var oObj = null;
                var sObject = "";

                if (oBack.success) {
                    oBackData = oBack.liste[0];
                    Thot.app.contexte.userId = oBackData.rsc_id;
                    Thot.app.contexte.adminAppli = oBackData.sa;

                    //---- 1° On remet à false tout les objets soumis à un role
                    for (var iIndObj in oMe.needRole) {
                        oObj = oForm.query("#" + oMe.needRole[iIndObj])[0];
                        oObj.setDisabled(true);
                    }

                    //---- 2° On active les objets faisant partie du rôle actuel
                    for (var iInd in oBackData.objects) {
                        sObject = oBackData.objects[iInd];
                        oObj = oForm.query("#" + sObject);

                        if (oObj.length > 0) {
                            oObj[0].setDisabled(false);
                        }
                    }

                    if (oBackData.process) {
                        Thot.app.appConfig.process = oBackData.process;
                    }

                    // TODO: 2020-09-17 18:38:19 HVT rendre l'activation plus "automatique" en fonction du contenu du fichier roles.json
                    /* vérification des autorisations des formulaires des tab, activation/désactivation des objets contrôlés*/
                    oForm.query("#searchTab")[0].query("#search")[0].getController("sch-cmpsearch").checkAuth();
                    oForm.query("#revisionTab")[0].query("#actrevision")[0].getController("act-cmprevision").checkAuth();
                }
            }
        });
    },
    /**
     * @author : edblv
     * date   : 06/06/16 16:28
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Charge le détail du fil d'ariane
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    getSectionLabel: function () {
        var oMe = this;
        var oForm = this.getView();
        var oSectionId = oForm.query("#sectionId")[0];
        var oCurrentSection = Thot.app.getSection();
        var oSectionLbl = oForm.query("#sectionLabel")[0];
        var oInfoSectionBtn = oForm.query("#infoSectionBtn")[0];
        var sAriane = "";

        if (oCurrentSection.idsection !== "") {
            // il y a des sections à superviser
            oSectionId.setValue(oCurrentSection.idsection);
            Thot.app.globalValues.idsection = oCurrentSection.idsection;
        } else {
            sAriane = Thot.Labels.messages.noworkshop;
            oSectionLbl.setValue(sAriane);
            oInfoSectionBtn.setVisible(false);
            return;
        }

        Ext.Ajax.request({
            url: "server/sct/Societe.php",
            params: {
                appName: Thot.app.appConfig.name,
                action: "InfoSection",
                sab_id: oCurrentSection.idsection
            },

            success: function () {},

            failure: function () {},

            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var aInfos = [];

                // //---- Connexion au serveur websockets
                // oMe.webSocketsCnx();

                if (oBack.liste !== null) {
                    aInfos = oBack.liste[0];
                    if (oBack.liste.length > 1) {
                        //---- Plusieurs section
                        oSectionLbl.setValue(Thot.Labels.messages.multipleworkshop);
                        oInfoSectionBtn.sectionList = oBack.liste;
                        oInfoSectionBtn.setVisible(true);
                    } else {
                        //---- Une seule section
                        sAriane = aInfos.ste_libelle + " / " + aInfos.sit_libelle + " / " + aInfos.sab_libelle;
                        oSectionLbl.setValue(sAriane);
                        oInfoSectionBtn.setVisible(false);
                    }
                }
                oMe.onListsRefresh();
            }
        });
    },
    /**
     * @author : edblv
     * @scrum : RND#ND-ND.ND
     * @description essaie d'établir la connexion Websocket
     * @version  edblv RND#ND-ND.ND Création
     */
    webSocketsCnx: function () {
        var oMe = this;
        var oForm = this.getView();
        var oMsg = Thot.app.MessageInfo();

        if (oForm.socket === null || oForm.socket.readyState !== 1) {
            //---- Déclaration de la connexion websocket
            var serverUrl =
                Thot.app.appConfig.websockets.server.protocole +
                // 'ws://' +
                Thot.app.appConfig.websockets.server.addr +
                ":" +
                Thot.app.appConfig.websockets.server.port;
            if (Thot.app.appConfig.websockets.server.app) {
                serverUrl += "/" + Thot.app.appConfig.websockets.server.app;
            }

            if (window.MozWebSocket) {
                oForm.socket = new MozWebSocket(serverUrl);
            } else if (window.WebSocket) {
                oForm.socket = new WebSocket(serverUrl);
                setTimeout(function () {
                    if (oForm.socket.readyState !== 1) {
                        // capturer le bouton et changer son UI
                        Ext.getCmp("wssignal").removeCls("icon-wsok");
                        Ext.getCmp("wssignal").addCls("icon-wsnok");
                        oMsg.init(5000);
                        oMsg.msg("avert", Thot.Labels.messages.nowss);
                    } else {
                        Ext.getCmp("wssignal").removeCls("icon-wsnok");
                        Ext.getCmp("wssignal").addCls("icon-wsok");
                    }
                }, 2000);
            }

            oForm.socket.onopen = function (_e) {
                /*on "écoute" pour savoir si la connexion vers le serveur websocket s'est bien faite */
                Ext.getCmp("wssignal").removeCls("icon-wsnok");
                Ext.getCmp("wssignal").addCls("icon-wsok");
            };
            oForm.socket.onmessage = function (oMessage) {
                // devrait afficher le nombre de clients connectés
                oMe.onRecieve(oMessage);
            };
            oForm.socket.onclose = function (_e) {
                /*on est informé lors de la fermeture de la connexion vers le serveur*/
                Ext.getCmp("wssignal").removeCls("icon-wsok");
                Ext.getCmp("wssignal").addCls("icon-wsnok");
            };
            oForm.socket.onerror = function (_e) {
                /*on traite les cas d'erreur*/
            };
        }
    },
    /**
     * @author : edblv
     * date   : 02/08/16 15:13
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Envoie un message Websocket
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onSend: function (sAction, sControllerId, aInfos) {
        var oMe = this;
        var oForm = oMe.getView();
        var oWsMsg = {
            target: Thot.app.cnxParams.prefix,
            action: sAction,
            data: {
                source: sControllerId,
                login: Thot.app.cnxParams.login,
                infos: aInfos,
                sections: Thot.app.globalValues.idsection
            }
        };
        // DEV: HVT 2021-04-26 15:10:18 cas des notifications, le message est différent
        if (sAction === "notification") {
            var oNotif = {
                target: Thot.app.cnxParams.prefix,
                action: sAction,
                data: {
                    text: aInfos[0]
                }
            };
        }
        // vérification du statut du websocket avant envoi du message
        // infos ici: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
        // readyState = 0 > connecting, 1 > connected, 2 > closing, 3 > closed
        // on lance la connexion WS (qui ne se déclenche que si elle n'est pas établie)
        this.webSocketsCnx();
        if (oForm.socket.readyState == 1) {
            oForm.socket.send(Ext.encode(oWsMsg));
            if (sAction === "notification") {
                oForm.socket.send(Ext.encode(oNotif));
            }
        }
    },
    /**
     * @author : edblv
     * date   : 02/08/16 09:41
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Gestion des messages reçus du Websockets
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     * @version 231019 hvt  modification du case 'maj', ajout du split sur tableau aSections
     */
    onRecieve: function (oWsMessage) {
        var oMe = this;
        var oForm = oMe.getView();
        /*on récupère les messages provenant du serveur websocket */
        var oMessage = Ext.decode(oWsMessage.data);
        var sTarget = oMessage.target ? oMessage.target : "all";
        var sAction = oMessage.action ? oMessage.action : "maj";
        var oData = oMessage.data;
        var aSections = [];
        var aCurrentSections = Thot.app.globalValues.idsection.split(",");
        var bUpdate = false;
        var bNotif = false;
        // var sComponent = '';
        var aComponents = [];
        var aFilter = [
            {
                type: "sab_id",
                value: Thot.app.globalValues.idsection
            }
        ];
        // NOTE: 2020-08-06 13:20:17 HVT test réception WsMessage
        switch (sAction) {
            case "update":
                // on force la mise à jour de l'application par message WS
                Thot.app.onAppUpdate();
                break;

            case "notification":
                // il s'agit d'une notification push à afficher sur le bureau utilisateur
                if (sTarget === Thot.app.cnxParams.prefix || sTarget === "all") {
                    //---- Cette appli est-elle concernée par la notification
                    bNotif = true;
                }

                if (oData.recip) {
                    //---- Si des destinataires sont précisés et que je n'en fait pas partie
                    if (oData.recip.indexOf(Thot.app.cnxParams.login) < 0) {
                        bNotif = false;
                    }
                }

                if (bNotif) {
                    Thot.app.notify(oData);
                }
                break;

            case "maj":
                // il s'agit d'un message WebSocket de mise à jour des données
                //---- Si la Maj concerne cette appli
                if (sTarget == Thot.app.cnxParams.prefix) {
                    var iInd;
                    // si la section passée en paramètre est 'all' on met à jour quelles que soient les sections supervisées
                    if (oData.sections == "all") {
                        bUpdate = true;
                    } else {
                        // on explose la chaine oData.sections sur la , pour créer le tableau des sections à mettre à jour
                        aSections = oData.sections.split(",");

                        // pour chaque entrée du tableau des sections à mettre à jour
                        // de l'entrée 0 à la dernière entrée du tableau
                        // par incrément de 1
                        for (iInd = 0; iInd < aSections.length; iInd++) {
                            // vérifier dans le tableau des sections supervisées si la même valeur existe
                            if (aCurrentSections.indexOf(aSections[iInd]) > -1) {
                                bUpdate = true;
                                // si il y a une section commune alors on met à jour, inutile d'aller plus loin, on sort de la boucle
                                break;
                            }
                        }
                    }

                    if (bUpdate) {
                        //---- mise à jour des grilles passées dans le tableau "infos"
                        for (iInd in oData.infos) {
                            // construction du tableau des grille à mettre à jour
                            aComponents = oForm.query(oData.infos[iInd].toLowerCase());

                            // mise à jour des grilles identifiées par déclenchement de l'évènement 'gridRefresh'
                            for (var iCmp in aComponents) {
                                aComponents[iCmp].fireEvent("gridRefresh", aFilter);
                            }
                        }
                    }
                }
                break;
        }
    },
    /**
     * @author : edblv
     * date   : 27/06/16 10:41
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Changement d'onglet
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onTabChange: function (_oTabPanel, oTargetTab, _oSourceTab) {
        var oMe = this;
        // var oForm = oMe.getView();
        var sFormId = oTargetTab.items.keys[0];
        oMe.onListsRefresh([sFormId]);
        if (oTargetTab.itemId == "searchTab") {
            if (typeof oTargetTab.items.items[0].getController("sch-cmpsearch").checkAuth() == "function") {
                oTargetTab.items.items[0].getController("sch-cmpsearch").checkAuth();
            }
        }
    },

    /**
     * @author : edblv
     * date   : 20/06/16 17:18
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur le bouton 'Authentification'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onAuthClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oMainToolBar = oForm.query("#maintoolbar")[0], // la barre d'outils principale
            oUserName = oForm.query("#username")[0], // label pour l'affichage du nom de l'utilisateur connecté
            oIcoUser = oForm.query("#usericon")[0], // icon utilisateur
            oBtnLogin = oForm.query("#authBtn")[0], // bouton de connexion
            oBtnLogOut = oForm.query("#logoutBtn")[0]; // bouton de déconexion

        var oWin = Thot.app.openWidget("userauth", {
            title: Thot.Labels.labels.authentification,
            alias: "userauth",
            modal: true,
            resizable: false,
            height: 250,
            width: 300
        });
        oWin.on({
            destroy: function (oWin) {
                // lorsque le formulaire est fermé
                if (oWin.returnValue !== null) {
                    if (oWin.returnValue.login !== "") {
                        // si la connexion est établie
                        Thot.app.contexte.userName = oWin.returnValue.nom;
                        Thot.app.contexte.userFirstName = oWin.returnValue.prenom;
                        Thot.app.cnxParams.login = oWin.returnValue.login;

                        // cacher le bouton "se connecter" et afficher le bouton "se déconnecter"
                        oIcoUser.setHidden(false);
                        oBtnLogOut.setHidden(false);
                        oBtnLogin.setHidden(true);
                        // afficher le nom de l'utilisateur connecté
                        oUserName.setValue(oWin.returnValue.prenom + " " + oWin.returnValue.nom);
                        // modifier la couleur de la barre de menu pour indiquer que l'on est en mode administrateur (voir avec la méthode addCls)
                        oMainToolBar.addCls("thot-admin-background");
                        document.getElementById("spinner").classList.add("thot-admin");
                        // mise à jour de l'interface en fonction du role utilisateur
                        oMe.getRole();
                    }
                }
            }
        });
    },
    /**
     * @author : edblv
     * date   : 08/03/17 16:45
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Deconnexion de l'utilisateur courant
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onLogoutClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oMainToolBar = oForm.query("#maintoolbar")[0], // la barre d'outils principale
            oUserName = oForm.query("#username")[0], // label pour l'affichage du nom de l'utilisateur connecté
            oIcoUser = oForm.query("#usericon")[0], // icon utilisateur
            oBtnLogin = oForm.query("#authBtn")[0], // bouton de connexion
            oBtnLogOut = oForm.query("#logoutBtn")[0]; // bouton de déconexion

        oUserName.setValue("");
        Thot.app.contexte.userName = "";
        Thot.app.contexte.userFirstName = "";
        Thot.app.cnxParams.login = "";

        // permutation des boutons de connexion/déconnexion
        oIcoUser.setHidden(true);
        oBtnLogOut.setHidden(true);
        oBtnLogin.setHidden(false);
        // restaurer la couleur de la barre de menu
        oMainToolBar.removeCls("thot-admin-background");
        document.getElementById("spinner").classList.remove("thot-admin");

        oMe.getUser();
    },

    /**
     * @author : edblv
     * date   : 27/05/16 11:01
     * @scrum : RND#ND-ND.ND
     *
     * @description déclenche l'affichage du formulaire de définition des sections supervisées
     * @description et met à jour le localStorage
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onSectionClic: function (_oBtn) {
        var oMe = this;
        // var oForm = oMe.getView();
        // var oSectionId = oForm.query('#sectionId')[0];
        // var oSectionLbl = oForm.query('#sectionLabel')[0];
        var oWin = Thot.app.openWidget("sectionselect", {
            title: Thot.Labels.actions.selectWorkshop.title,
            alias: "section",
            modal: true,
            resizable: false,
            height: 250
        });

        oWin.on({
            destroy: function (oWin) {
                if (oWin.returnValue !== null) {
                    localStorage.setItem("currentSection", Ext.encode(oWin.returnValue));
                    oMe.getSectionLabel();
                }
            }
        });
    },
    /**
     * @author  :   Hervé Valot
     * @description : affiche le formulaire de rédaction d'un nouveau message
     * @date    : 2019/06/24
     */
    onNewNoteClick: function () {
        var oMe = this;
        var oForm = oMe.getView();
        // var oMain = oForm.up("app-main");
        var oWin = Thot.app.openWidget("noteedit", {
            title: Thot.Labels.actions.newNote.title,
            alias: "noteedit",
            modal: true,
            resizable: true,
            height: 600,
            width: 850,
            param: {
                custom: {
                    // passe les paramètres dans le cas ou le formulaire serait ouvert depuis une activité ou un aléa
                    act_id: "",
                    ala_id: ""
                }
            }
        });

        oWin.on({
            destroy: function () {
                oForm.fireEvent("listsrefresh");
            }
        });
    },
    /**
     * @author : edblv
     * date   : 06/06/16 15:56
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur bouton infos pour affichages des section courantes
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onInfoSectionClic: function (oBtn) {
        var oMe = this;
        // var oForm = oMe.getView();
        var oBtnPos = oBtn.getXY();
        var aMenuItems = [];
        // var sSociety = '';
        // var sSite = '';

        for (var iInd in oBtn.sectionList) {
            aMenuItems.push({
                text: oBtn.sectionList[iInd].ste_libelle + " / " + oBtn.sectionList[iInd].sit_libelle + " / " + oBtn.sectionList[iInd].sab_libelle,
                //				cls: 'thot-label',
                textAlign: "left"
            });
        }

        //---- Si le menu n'est pas vide, on l'affiche
        if (aMenuItems.length > 0) {
            if (!oMe.infosMenu) {
                oMe.infosMenu = Ext.create("Ext.menu.Menu", {
                    //					width: 500,
                    plain: true,
                    items: aMenuItems
                });
            } else {
                oMe.infosMenu.removeAll();
                oMe.infosMenu.add(aMenuItems);
            }

            oBtnPos[1] += 25;
            oMe.infosMenu.showAt(oBtnPos);
        }
    },
    /**
     * @author : edblv
     * date   : 08/07/16 15:36
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Rafraichit toute les listes dispo
     * Parcours toutes les forms dispo et déclenche l'évènement gridRefresh de chacune d'elle
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     * @version 20191017 hvt modification pour ne refraichir que les objets de l'onglet actif
     */
    onListsRefresh: function () {
        var oMe = this;
        var oForm = oMe.getView();
        // var aForms = oForm.query('form');
        var aItems = [];
        var bTakeIt = true;
        var oSectionId = oForm.query("#sectionId")[0];
        var aFilter = [
            {
                type: "sab_id",
                value: oSectionId.getValue()
            }
        ];

        // 20191017 - code pour ne rafraichir que les objets de l'onglet actif
        // identification de l'onglet actif
        // et mise à jour du tableau aForms pour contenir les objets à rafraichir
        var oActiveTab = Ext.ComponentQuery.query("#mainTab")[0].getActiveTab(),
            aForms = oActiveTab.query("form");
        // 20191017 FIN ^^^^^^^^^^^^^^^^

        if (arguments.length > 0) {
            aItems = arguments[0];
        }
        for (var iForm in aForms) {
            //---- Test si seulement formulaires choisis
            if (aItems.length > 0) {
                bTakeIt = aItems.indexOf(aForms[iForm].itemId) > -1;
            }
            if (bTakeIt) {
                if (aForms[iForm].events.gridrefresh) {
                    aForms[iForm].fireEvent("gridRefresh", aFilter);
                }
            }
        }
    },
    /**
     * @author  Hervé Valot
     * @function    onFullscreenClick
     * @description bascule l'affichage du navigateur plein écran/normal
     */
    onFullscreenClick: function () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            // mise à jour de l'icône du bouton
            // document.getElementById('fullscreenBtn').className='';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
});
