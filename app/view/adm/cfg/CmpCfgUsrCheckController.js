/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/

Ext.define('Thot.view.adm.cfg.CmpCfgUsrCheckController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.adm-cfg-cmpcfgusrcheck',

    /**
     * @author Hervé Valot
     * @description miseà jour du formulaire au rendu
     * @date 20200811
     */
    onAfterRender: function () {
        // mise àjour des données du CRON (activation / intervalle / planning), passe la tache (nom de la tache dans le cron) en paramètre
        this._getCronParametre('CRON_ChkUsrStatus');
        // mise à jour des options de configuration de l'application, passe le groupe d'options en paramètres
        this._getOptionValue('CUS');
    },

    /**
     * @author Hervé Valot
     * @description Active le bouton Appliquer pour enregistremet des modifications
     * @date 20200813
     */
    enableApplyBtn: function () {
        this.getView().query('#btnApply')[0].setDisabled(false);
    },

    /**
     * @author Hervé Valot
     * @description lit les paramètres du CRON en fonction de la tache passée en paramètre et met à jour le formulaire
     * @date 20200808
     * @param {*} sTache 
     */
    _getCronParametre: function (sTache) {
        var oMe = this,
            oForm = oMe.getView();
        // lance la requête AJAX
        Ext.Ajax.request({
            url: 'server/adm/Admin.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'GetCronParametreByTask',
                parametre: sTache // la tache à lire
            },
            success: function () {},
            failure: function () {},
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    //mise à jour des champs de formulaire du CRON
                    // activation de la tache, la base stocke l'information d'inactivité --> inactif = 1, actif = 0
                    oForm.query('#CRON_checkUsrStatus')[0].setValue(parseInt(oBack.liste[0].ctb_estinactif) == 0 ? true : false);
                    // intervalle de mise à jour, valeur de BDD à diviser par 60 pour afficher en minutes (stocké en secondes)
                    oForm.query('#CRON_intervalle')[0].setValue(parseInt(oBack.liste[0].ctb_prog_temps) / 60);
                    // mise à jur des checkbox du planning en fonction de la chaine CTB_JOUR (xxxxxxx), 7 valeurs 1/0 pour chaque jour de la semaine
                    var oCheckboxgroup = oForm.query('#CRON_Planning')[0], // groupe de checkbox du planning journalier
                        aPlanning = oBack.liste[0].ctb_jour.split(''); // ransformation de la chaine en tableau de booléens
                    oCheckboxgroup.items.items.forEach(function (item, idx) {
                        item.setValue(parseInt(aPlanning[idx]) == 1 ? true : false);
                    });
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', oBack.errorMessage.message);
                }

                oForm.query('#btnApply')[0].setDisabled(true);
            }
        });
    },

    /**
     * @author Hervé Valot
     * @description lit la liste des options de configuation depuis le backend et met à jour le formulaire
     * @date 202008008
     */
    _getOptionValue: function (groupOptions) {
        var oMe = this,
            oForm = oMe.getView();
        // lance la requête AJAX
        Ext.Ajax.request({
            url: 'server/adm/Admin.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'GetAppParametreByGroup',
                parametre: groupOptions // le code du groupe d'options à récupérer
            },
            success: function () {},
            failure: function () {},
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    // mise à jour des options de l'interface utilisateur pour chaque option retournée par la requête
                    JSON.parse(oResponse.responseText).liste.forEach(function (item, _idx) {
                        if (typeof oForm.query('#' + item.ppe_code)[0] !== 'undefined') {
                            oForm.query('#' + item.ppe_code)[0].setValue(parseInt(item.ppe_value) == 1 ? true : false);
                        }
                    });
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', 'Erreur de lecture des options de configuration');
                }

                oForm.query('#btnApply')[0].setDisabled(true);
            }
        });
    },

    /**
     * @author Hervé Valot
     * @date 20200812
     * @description enregistre le paramétrage en base de données
     */
    onApplyClick: function () {
        // constante, tache du CRON traitée dans ce formulaire
        const task = 'CRON_chkUsrStatus';

        // variables por récupération des informations des objets du formulaire
        var oMe = this,
            oForm = oMe.getView(),
            // paramètres du CRON
            oCheckboxActivateCheck = oForm.query('#CRON_checkUsrStatus')[0],
            oNumberFieldIntervalle = oForm.query('#CRON_intervalle')[0],
            oCheckboxgroupPlanning = oForm.query('#CRON_Planning')[0],
            // paramètres de la vérification
            oPointagePlanning = oForm.query('#CUS_pointagePlanning')[0],
            weekPlan = '',
            oActivitePointage = oForm.query('#CUS_activitePointage')[0],
            oActivitePlanning = oForm.query('#CUS_activitePlanning')[0];


        // mise à jour des paramètres du CRON
        // activation/désactivation, true --> 0, false --> 1 (la base stocke la désactivation de la tache = 1)
        oMe._setCronTaskParametre(task, 'Activation', (oCheckboxActivateCheck.value ? '0' : '1'));
        // intervalle en secondes (l'UI propose des minutes, il faut multiplier la valeur par 60)
        oMe._setCronTaskParametre(task, 'Temps', oNumberFieldIntervalle.value * 60);
        // planning
        // construction de la chaine des 7 booléens (1/0 pour chaque jour de la semaine)
        // crée la chaine de valeurs du groupe de checkboxes
        oCheckboxgroupPlanning.items.items.forEach(function (item, _idx) {
            weekPlan += (item.value ? 1 : 0);
        });
        oMe._setCronTaskParametre(task, 'Planning', weekPlan);

        // mise à jour des options de la tache, 
        // pour les booléens la mise à jour porte sur la valeur @VALEUR
        // le paramètre @VALEUR_GENERIQUE est passé à vide
        oMe._setAppParametre(oPointagePlanning, oPointagePlanning.value, '');
        oMe._setAppParametre(oActivitePointage, oActivitePointage.value, '');
        oMe._setAppParametre(oActivitePlanning, oActivitePlanning.value, '');

        oForm.query('#btnApply')[0].setDisabled(true);
    },

    /**
     * @author Hervé Valot
     * @date 2020-08-07
     * @description déclenche la mise à jour des paramètres en base de données sur changement de la valeur de la checkbox
     * @param {Object} oChekbox l'objet CheckBox sélectionné
     * @param {*} newValue la valeur courante de la checkbox
     * @param {*} newValueGenerique la valeur générique à enregistrer (chaine de caractères) 
     * @param {*} _oldValue l'ancienne valeur de la checkbox
     * @param {*} _eOpts The options object passed to Ext.util.Observable.addListener.
     */
    _setAppParametre: function (oFormField, newValue, newValueGenerique, _oldValue, _eOpts) {
        // déclencher la requête Ajax pour mise à jour de la base de données
        Ext.Ajax.request({
            url: 'server/adm/Admin.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'SetAppParametre',
                parametre: oFormField.config.itemId,
                value: newValue,
                value_generique: newValueGenerique
            },
            success: function () {},
            failure: function () {},
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (!oBack.success) {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', oBack.errorMessage.message);
                }
            }
        });
    },

    /**
     * @author Hervé Valot
     * @description Enregistre la valeur d'un paramètre d'une tache du CRON
     * @date 20200812
     * @param {*} sCronTask le nom de la tache du CRON à traiter
     * @param {*} sParametre le nom du paramètre à modifier
     * @param {*} sValeur la valeur du paramètre à modifier
     */
    _setCronTaskParametre: function (sCronTask, sParametre, sValeur) {
        // le paramètre en base de données est à 0 pour les taches actives, 1 pour les taches inactives (CTB_ESTINACTIF)
        // lancer la requête Ajax pour mise à jour de la base de données
        Ext.Ajax.request({
            url: 'server/adm/Admin.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'SetCronTaskParametre',
                task: sCronTask,
                parametre: sParametre,
                value: sValeur
            },
            success: function () {},
            failure: function () {},
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (!oBack.success) {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', oBack.errorMessage.message);
                }
            }
        });
    }
});