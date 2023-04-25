/**
 * @author  Hervé Valot
 * @description validateurs vtype personnalisés
 */
Ext.apply(Ext.form.field.VTypes, {
    'daterange': function (val, field) {
        // le vtype daterange vérifie la validité des dates de début et fin d'un calendrier
        // si la date de début est postérieure à la date de fin ou 
        // si la date de fin est antèrieure à la date de début
        // alors les données sont non valides (marque les champs non valides ce qui emp^che de valider le formulaire)
        // dans tous les cas, défini les dates de début max et de fin min sur les champs
        var date = field.parseDate(val);
        if (!date) {
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            // la valeur de date début a changé, on met à jour la date maxi de la date de fin
            var end = field.up('form').query('datetimefield[endDateField=end_date]')[0];
            end.setMinValue(date);
            end.validate();
            this.dateRangeMax = date;
        } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            // la valeur de date fin a changé, on met à jour la date mini de la date de début
            var start = field.up('form').query('datetimefield[startDateField=start_date]')[0];
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMin = date;
        }

        return true;
    },

    'daterangeText': 'La date de début doit être antérieure à la date de fin.'
});
/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('Thot.Application', {
    extend: 'Ext.app.Application',
    name: 'Thot',
    stores: [],
    requires: [
        'Ext.container.Viewport',
        'Thot.util.HttpStateProvider'
    ],
    cnxParams: {},
    appConfig: {},
    contexte: {},
    globalValues: {},
    aSysMsg: [],
    aWindows: [],
    database: '',

    init: function () {
        var oMe = this;
        var oNow = new Date();
        var iTime = oNow.getTime();
        var oCnxParams = {
            directOpen: false,
            prefix: 'THOT',
            nomenu: 10,
            database: '',
            login: ''
        };

        // pour enregistrement des config de grille dans le localstorage
        // les config statefull et stateId doivent être définies
        // pour que la config de grille soit enregistrée
        Ext.state.Manager.setProvider(
            Ext.create('Ext.state.LocalStorageProvider')
        );

        oCnxParams.name = oCnxParams.prefix + '-' + iTime;

        if (oMe.database !== '') {
            oCnxParams.database = oMe.database;
        }

        if (typeof (Storage) !== 'undefined') {
            if (Storage !== 'null') {
                //oCnxParams = Ext.decode(sessionStorage.getItem("cnxParams"));

            }

            sessionStorage.setItem('cnxParams', Ext.encode(oCnxParams));
        }

        this.cnxParams = oCnxParams;

        Ext.Ajax.request({
            async: false, // Connexion asynchrone puisqu'on doit attendre d'avoir une session pour travailler
            url: 'server/StartApp.php',
            params: {
                appName: oMe.cnxParams.name,
                action: 'Start',
                login: oMe.cnxParams.login,
                database: oCnxParams.database
                //oMe.database
            },
            callback: function (opt, success, oResponse) {
                var oAppli = Ext.decode(oResponse.responseText);
                var sGridKey = '';

                oMe.appConfig = {
                    base: oAppli.app.base,
                    client: oAppli.app.client,
                    datestructure: oAppli.app.datestructure,
                    datemaj: oAppli.app.datemaj,
                    dev: oAppli.app.dev,
                    directOpen: oCnxParams.directOpen,
                    gridsConfig: [],
                    libelle: oAppli.app.libelle,
                    name: oCnxParams.name,
                    nomenu: oCnxParams.nomenu,
                    numreq: oAppli.app.numreq,
                    process: {},
                    websockets: oAppli.app.websockets
                };
                for (var sForm in oAppli.grids) {
                    for (var sGrid in oAppli.grids[sForm]) {
                        sGridKey = sForm + '-' + sGrid;
                        oMe.appConfig.gridsConfig[sGridKey] = Ext.decode(oAppli.grids[sForm][sGrid]);
                    }
                }


                // NOTE: HVT 2021-04-11 15:25:23 : inutile, pas d'autje,tification à l'ouverture de l'application
                if (oMe.cnxParams.login !== '') {
                    Ext.state.Manager.setProvider(new Thot.util.HttpStateProvider({
                        //userId: Thot.app.contexte.IdUtilisateur,
                        userLogin: oMe.cnxParams.login,
                        url: 'server/usr/Users.php',
                        gridsState: oMe.appConfig.gridsConfig,
                        stateRestoredCallback: function () {}
                    }));
                }
            }
        });
    },
    /**
     * @author : edblv
     * @date   :
     * @scrum  : RND#ND-ND.ND
     *
     * @description actions au démarrage de l'application
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    launch: function () {
        var oMe = this;
        this.aSysMsg.errtitle = 'Erreur';
        this.aSysMsg.averttitle = 'Avertissement';
        this.aSysMsg.infotitle = 'Info';
        this.aSysMsg.loaderr = 'Chargement impossible...';
        this.aSysMsg.srverr = 'Erreur serveur...';
        this.aSysMsg.bookmarks = 'Favoris';
        this.aSysMsg.addtobookmarks = 'Ajouter à mes favoris';
        this.aSysMsg.bookmarkexist = 'Ce formulaire fait déjà parti de vos favoris';
        this.aSysMsg.bookmarksuccess = 'Favoris ajouté avec succès !';

        this.viewport = Ext.ComponentQuery.query('#mainTab')[0];

        /**
         * @author : hvt
         * date   : 07/10/2016
         * @scrum : RND#ND-ND.ND
         *
         * #Description
         * suppression du splashscreen de démarrage
         *
         * @version JJMMAA hvt RND#ND-ND.ND Création
         */
        var splash = Ext.get('splash');
        splash.fadeOut({
            remove: true,
            usedisplay: false
        });
    },
    /**
     * @author : edblv
     * date   : 27/05/16 11:15
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Ouverture d'une fenêtre contenant un widget
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    openWidget: function (sWidget) {
        var oMe = this;
        var oAppli = Thot.app;
        var iClientWidth = document.body.clientWidth;
        var iClientHeight = document.body.clientHeight;
        var aSize = Thot.app.viewport.getSize();
        var oFormPosit = {};
        var oConfig = {};
        var oParams = {};
        var aStatusBarItems = [];

        aStatusBarItems.push('->');

        if (arguments.length > 1) {
            oParams = arguments[1];
        }

        /**
         * détermination de la largeur et hauteur de la fenêtre (Window)
         * soit les paramètres passés par l'appelant, soit les valeurs par défaut
         */
        oFormPosit = {
            width: (oParams.width ? oParams.width : 600),
            height: (oParams.height ? oParams.height : 400)
        };

        /**
         * détermination de la position de la fenêtre
         * centrée à l'écran
         * calcul en fonction de la taille de la fenêtre du navigateur
         */
        oFormPosit.top = (oParams.top ? oParams.top : ((iClientHeight / 2) - (oFormPosit.height / 2)));
        oFormPosit.left = (oParams.left ? oParams.left : ((iClientWidth / 2) - (oFormPosit.width / 2)));

        //initialisation des attributs de l'objet oBaseParam (valeurs par défaut)
        var oBaseParam = {
            top: oFormPosit.top,
            left: oFormPosit.left,
            width: oFormPosit.width,
            height: oFormPosit.height,
            resizable: (typeof oParams.resizable !== 'undefined' ? oParams.resizable : true),
            widget: sWidget,
            alias: (oParams.alias ? oParams.alias : sWidget),
            title: (oParams.title ? oParams.title : 'Thot'),
            modal: (oParams.modal ? oParams.modal : false),
            param: {
                idenreg: 0,
                bookmarkable: false,
                idmenu: 0
            }
        };

        if (oParams.param) {
            if (oParams.param.recordId) {
                oBaseParam.param.idenreg = oParams.param.recordId;
            }

            if (oParams.param.custom) {
                oBaseParam.param.custom = oParams.param.custom;
            }
        }

        if (typeof oAppli.aWindows[oBaseParam.alias] === 'undefined') {
            oConfig = {
                itemId: oBaseParam.alias,
                title: oBaseParam.title,
                closable: true,
                minimizable: false,
                maximizable: true,
                modal: oBaseParam.modal,
                resizable: oBaseParam.resizable,
                width: oBaseParam.width,
                height: oBaseParam.height,
                minWidth: 350,
                x: oBaseParam.left,
                // y: oBaseParam.top,
                constrainHeader: true,
                //constrain: true,
                header: {
                    titlePosition: 0
                },
                layout: {
                    align: 'stretch',
                    type: 'fit'
                },
                items: [{
                    xtype: oBaseParam.widget,
                    param: oBaseParam.param
                }]
            };

            //----- Paramètres supplèmentaires en fonction du type de fenêtre
            if (oBaseParam.modal) {
                // Fenêtres modales
                oConfig.modal = true;
                //oConfig.draggable = false;
                oConfig.closable = true;
            } else {
                // Fenêtres non modales
                oConfig.renderTo = Ext.get('app_panel'); //app_panel-body
            }

            //-----Instanciation de la nouvelle fenêtre
            oAppli.aWindows[oBaseParam.alias] = Ext.create('Ext.window.Window', oConfig); //'widget.window'
        }

        oAppli.aWindows[oBaseParam.alias].show();
        return oAppli.aWindows[oBaseParam.alias];
    },
    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description : affiche une notification push sur le bureau de l'utilisateur
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    notify: function (oData) {
        var oMe = this;
        if (window.Notification && Notification.permission !== 'denied') {
            Notification.requestPermission(function (status) { // status is "granted", if accepted by user
                var oNotif = {
                    body: oData.text,
                    icon: 'favico.ico',
                    // icon: "resources/images/ThotMessageNotify.ico",
                    requireInteraction: false,
                    silent: true
                };

                // if (oData.icon) {
                //     oNotif.icon = oData.infos.icon;
                // }

                // if (oData.valid) {
                //     oNotif.requireInteraction = oData.infos.valid;
                // }
                var n = new Notification('Thot', oNotif);
                setTimeout(function () {
                    // pour chrome, ferme la notification après 3 secondes
                    n.close();
                }, 3000);
            });
        }
    },
    /**
     * @author : edblv
     * date   : 23/09/16 16:22
     * @scrum : RND#ND-ND.ND
     *
     * @description     lecture du localStorage pour récupérer les sections supervisées
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    getSection: function () {
        var oMe = this;
        var sCurrentSection = localStorage.getItem('currentSection');
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

        return oCurrentSection;
    },
    /**
     * @author  Hervé VALOT
     * @description affiche un message d'information pour mise à jour de l'application si une mise à jour est détectée sur le serveur
     */
    onAppUpdate: function () {
        // affiche le message de mise à jour de l'application
        Ext.MessageBox.alert({
            title: 'Mise à jour',
            message: 'Une mise à jour de l\'application est disponible.</br>Cliquer sur OK pour mettre à jour !</br>Mise à jour automatique dans <span id="rebours">5</span> secondes',
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.WARNING,
            closable: false,
            // lorsque l'utilisateur clique sur le seul bouton OK
            fn: function (btn) {
                if (btn === 'ok') {
                    // recharge la page de l'application
                    window.location.reload(true);
                }
            }
        });

        /**
         * @author  Hervé VALOT
         * @date    20201122
         * @description lance un timer de 5 secondes, après écoulement des 5 secondes, recharge la page
         */
        function autoReload() {
            Ext.defer(function () {
                window.location.reload(true);
            }, 5000);
        }

        // lance le timer
        autoReload();
    },

    /**
     * @author : edblv
     * date   : 02/06/16 15:33
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Affichage d'un message en haut de l'écran
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    MessageInfo: function () {
        var oMe = this;
        var msgCt;
        var iDureeAffiche = 1000;

        return {
            msg: function (sType, format) {
                var msgCt = Ext.get('msg-div');

                if (msgCt == null) {
                    msgCt = Ext.DomHelper.insertFirst(document.body, {
                        id: 'msg-div'
                    }, true);
                }
                var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
                var m = Ext.DomHelper.append(msgCt, oMe.createBox(sType, s), true);
                m.hide();
                m.slideIn('t').ghost('t', {
                    delay: iDureeAffiche,
                    remove: true
                });
            },
            init: function (iTemps) {
                if (arguments.length > 0) {
                    iDureeAffiche = iTemps;
                }
            }
        };
    },
    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description création de la div devant accueillir le message de la notification glissante
     *              appelée par la fonction de retour "msg" de la fonction "MessageInfo"
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    createBox: function (sType, s) {
        var oMe = this;
        var sTitle = 'infotitle';
        var sStyle = 'msg';

        switch (sType) {
            case 'error':
                sTitle = 'errtitle';
                sStyle = 'msg-error';
                break;
            case 'avert':
                sTitle = 'averttitle';
                sStyle = 'msg-warning';
                break;
            case 'info':
                sTitle = 'infotitle';
                sStyle = 'msg';
                break;
        }
        return '<div class="' + sStyle + '"><p>' + s + '</p></div>';
    }
});