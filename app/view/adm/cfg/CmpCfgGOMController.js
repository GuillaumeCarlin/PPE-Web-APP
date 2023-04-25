/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/

Ext.define('Thot.view.adm.cfg.CmpCfgGOMController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.adm-cfg-cmpcfggom',

    /**
     * @author Hervé Valot
     * @description miseà jour du formulaire au rendu
     * @date 20200811
     */
    onAfterRender: function () {
        // mise à jour des options de configuration de l'application, passe le groupe d'options en paramètres
        this._getOptionValue('SPC');
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
                    // mise à jour des options de l'interface utilisateur pour haque option retournée par la requête
                    JSON.parse(oResponse.responseText).liste.forEach(function (item, idx) {
                        switch (oBack.liste[idx].ppe_data_type) {
                            case 'string':
                                if (typeof oForm.query('#' + item.ppe_code)[0] !== 'undefined') {
                                    oForm.query('#' + item.ppe_code)[0].setValue(item.ppe_value);
                                }
                                break;
                            case 'number':
                                if (typeof oForm.query('#' + item.ppe_code)[0] !== 'undefined') {
                                    oForm.query('#' + item.ppe_code)[0].setValue(Number(item.ppe_value));
                                }
                                break;
                            case 'boolean':
                                if (typeof oForm.query('#' + item.ppe_code)[0] !== 'undefined') {
                                    oForm.query('#' + item.ppe_code)[0].setValue(Boolean(parseInt(item.ppe_value)));
                                }
                                break;
                            default:
                                console.log('Type de données inconnu ou non défini');
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
     * @description Active le bouton Appliquer pour enregistremet des modifications
     * @date 20200813
     */
    enableApplyBtn: function () {
        this.getView().query('#btnApply')[0].setDisabled(false);
    },

    /**
     * @author Hervé Valot
     * @date 20200812
     * @description enregistre le paramétrage en base de données
     */
    onApplyClick: function () {
        // variables por récupération des informations des objets du formulaire
        var oMe = this,
            oForm = oMe.getView(),
            // paramètres de configuration
            oSPCActif = oForm.query('#SPC_ACTIF')[0],
            oRootFolder = oForm.query('#SPCRootFolder')[0];


        // mise à jour des options de la tache
        oMe._setAppParametre(oSPCActif, oSPCActif.value, '');
        oMe._setAppParametre(oRootFolder, '0', oRootFolder.value);

        oForm.query('#btnApply')[0].setDisabled(true);
    },

    /**
     * @author Hervé Valot
     * @date 2020-08-07
     * @description déclenche la mise à jour des paramètres en base de données
     * @param {Object} oFormField le champ de formulaire ou CheckBox sélectionné
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
    }
});