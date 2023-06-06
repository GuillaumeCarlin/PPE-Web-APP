Ext.define('Thot.view.adm.FormCreateFPSController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.adm-createfps',

    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();

        var Page = oForm.param.custom.Page;

        switch (Page) {
            case 'newuser':
                Afficher = '#NewUSR';
                Liste = [oForm.param.custom.fps_code, oForm.param.custom.rsc_code];
                this.updateAriane(Liste);
                this.onAfterRenderUSR();
                mois = (new Date().getMonth() + 1);
                jour = new Date().getDate();
                if (mois.toString().length != 2) {
                    mois = '0' + mois;
                }
                if (jour.toString().length != 2) {
                    jour = '0' + jour;
                }
                date = '' + jour + '/' + mois + '/' + new Date().getFullYear();
                oForm.query('#datefieldNewUsr')[0].setValue(date);
                oForm.query('#datefieldNewUsr')[0].setMaxValue(date);
                break;

            case 'deluser':
                Afficher = '#DelUsr'
                Liste = [oForm.param.custom.fps_code, oForm.param.custom.rsc_code, oForm.param.custom.usr_nom]
                this.updateAriane(Liste);
                oForm.query('#User')[0].setValue('Êtes-vous sûr de vouloir supprimer ' + oForm.param.custom.usr_nom + '?');
                break;

            case 'neweqt':
                Afficher = '#NewEQT';
                Liste = [oForm.param.custom.fps_code]
                this.updateAriane(Liste);
                this.onAfterRenderEqt();
                break;

            case 'deleqt':
                Afficher = '#DelEqt'
                Liste = [oForm.param.custom.fps_code]
                this.updateAriane(Liste);
                oForm.query('#Eqt')[0].setValue('Êtes-vous sûr de vouloir supprimer ' + oForm.param.custom.rsc_code)
                break;

            case 'newfps':
                Afficher = '#NewFPS';
                this.onAfterRenderFPS();
                break;

            case 'delfps':
                Afficher = '#DelFps'
                oForm.query('#FPS')[0].setValue('Êtes-vous sûr de vouloir supprimer ' + oForm.param.custom.fps_code)
                break;
        }
        oForm.query(Afficher)[0].setHidden(false);
    },



    updateAriane: function (Liste) {
        var oForm = this.getView();
        var sAriane = '';
        var sArianeSep = ' <a class="thot-ariane-sep"></a> ';
        var oAriane = oForm.query('#ariane')[0];
        sAriane = '<a class="thot-ariane-info">' + Liste[0] + '</a>'
        for (let i = 0; i < (Liste.length - 1); i++) {
            sAriane += sArianeSep + '<a class="thot-ariane-info">' + Liste[1] + '</a>';
        }
        oAriane.setValue(sAriane);
        oTest = oForm.query('#personneGrid')[0];
    },

    onAfterRenderFPS: function () {
        oForm = this.getView();
        oComboBoxFPG = oForm.query('#FpgComboBox')[0];
        oComboBoxFPG.getStore().load();
    },

    onAfterRenderUSR: function () {
        oForm = this.getView();
        oComboBoxUSR = oForm.query('#UserComboBox')[0];
        aFilter = [{
            type: 'id_fps',
            value: oForm.param.custom.fps_id // TODO: Fusionner le code machien avec le nom machine dans sql server
        }, {
            type: 'id_rsc',
            value: oForm.param.custom.rsc_id,
        }];

        oComboBoxUSR.getStore().setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        oComboBoxUSR.getStore().load();
    },

    onAfterRenderEqt: function () {
        oForm = this.getView();
        oComboBoxEQT = oForm.query('#EqtComboBox')[0];
        aFilter = [{
            type: 'id_fps',
            value: oForm.param.custom.fps_id,
        }];

        oComboBoxEQT.getStore().setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        })

        oComboBoxEQT.getStore().load();
    },

    SupWindow: function () {
        this.getView().up('window').close();
    },


    validDelFPS: function () {
        oForm = this.getView();
        vFps_Id = oForm.param.custom.fps_id;
        Ext.Ajax.request({
            url: 'server/adm/Admin.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'FPS_Fps',
                type: 'DELETE',
                fps_id: vFps_Id,
            },
            success: function () { },
            failure: function () { },
            callback: function (opt, success, oResponse) {
                oForm.up('window').close();
            }
        });
    },

    validDelUSR: function () {
        oForm = this.getView();
        vUsr_Id = oForm.param.custom.usr_id
        vFps_Id = oForm.param.custom.fps_id;
        vRsc_Id = oForm.param.custom.rsc_id;
        Ext.Ajax.request({
            url: 'server/adm/Admin.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'FPS_User',
                type: 'DELETE',
                usr_id: vUsr_Id,
                fps_id: vFps_Id,
                rsc_id: vRsc_Id,
            },
            success: function () { },
            failure: function () { },
            callback: function (opt, success, oResponse) {
                oForm.up('window').close();
            }
        });
    },

    validDelEQT: function () {
        oForm = this.getView();
        vFps_Id = oForm.param.custom.fps_id;
        vRsc_Id = oForm.param.custom.rsc_id;
        Ext.Ajax.request({
            url: 'server/adm/Admin.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'FPS_Eqt',
                type: 'DELETE',
                fps_id: vFps_Id,
                rsc_id: vRsc_Id,
            },
            success: function () { },
            failure: function () { },
            callback: function (opt, success, oResponse) {
                oForm.up('window').close();
            }
        });
    },

    validSelectFPS: function () {
        oForm = this.getView();
        vFpg = oForm.query('#FpgComboBox')[0].getValue();
        vName = oForm.query('#FPSName')[0].getValue();
        CheminVerify = oForm.query('#FPSChemin')[0].getValue()

        if (vFpg === null || vName === null || CheminVerify === null) {
            var Message = 'Information(s) manquante(s)';
            oForm.query('#error_message_fps')[0].setValue(Message);
        } else {

            //TODO: Faire une vérification des données rentrées (#FPSChemin doit être présents dans resources/Documents/FPS/) On envoie via une requete ajax le chemin a Admin.php
            // le php récupère l'url, y ajoute le chemin envoyer test et renvoie true/false
            while (CheminVerify.indexOf(' ') !== -1) {
                CheminVerify = CheminVerify.replace(' ', '%20');
            }
            Ext.Ajax.request({
                url: 'server/adm/Admin.php',
                params: {
                    appName: Thot.app.appConfig.name,
                    action: 'VerifyPDF',
                    fichier: CheminVerify
                },
                success: function () { },
                failure: function () { },
                callback: function (opt, success, oResponse) {
                    var oBack = Ext.decode(oResponse.responseText);
                    if (oBack.success) {
                        vChemin = 'resources/Documents/FPS/' + oForm.query('#FPSChemin')[0].getValue();
                        Ext.Ajax.request({
                            url: 'server/adm/Admin.php',
                            params: {
                                appName: Thot.app.appConfig.name,
                                action: 'FPS_Fps',
                                type: 'INSERT',
                                fpg_id: vFpg,
                                fps_code: vName,
                                fps_chemin: vChemin,
                            },
                            success: function () { },
                            failure: function () { },
                            callback: function (opt, success, oResponse) {
                                oForm.up('window').close();
                            }
                        });
                    } else {
                        var oMsg = Thot.app.MessageInfo();
                        oMsg.init(5000);
                        oMsg.msg('error', oBack.message);
                    }
                }
            });
        }
    },

    validSelectUSR: function () {
        oForm = this.getView();
        oUsr = oForm.query('#UserComboBox')[0];
        oDate = oForm.query('#datefieldNewUsr')[0];
        Liste = oDate.rawValue.split('/');
        vDate = Liste[2] + Liste[1] + Liste[0];
        var vUsrId = oUsr.getValue();

        if (vUsrId === null || vDate == 'NaN') {
            var Message = 'Information(s) Manquante(s)';
            oForm.query('#error_message_usr')[0].setValue(Message);
        } else {
            vFps_Id = oForm.param.custom.fps_id;
            vRsc_Id = oForm.param.custom.rsc_id;

            Ext.Ajax.request({
                url: 'server/adm/Admin.php',
                params: {
                    appName: Thot.app.appConfig.name,
                    action: 'FPS_User',
                    type: 'INSERT',
                    usr_id: vUsrId,
                    fps_id: vFps_Id,
                    date: vDate,
                    rsc_id: vRsc_Id,
                },
                success: function () { },
                failure: function () { },
                callback: function (opt, success, oResponse) {
                    oForm.up('window').close();
                }
            });
        }

    },

    validSelectEQT: function () {
        oForm = this.getView();
        vRsc_Id = oForm.query('#EqtComboBox')[0].getValue();
        vFps_Id = oForm.param.custom.fps_id;

        if (vRsc_Id === null) {
            Message = 'Information(s) manquante(s)';
            oForm.query('#error_message_eqt')[0].setValue(Message);
        } else {
            Ext.Ajax.request({
                url: 'server/adm/Admin.php',
                params: {
                    appName: Thot.app.appConfig.name,
                    action: 'FPS_Eqt',
                    type: 'INSERT',
                    fps_id: vFps_Id,
                    rsc_id: vRsc_Id,
                },
                success: function () { },
                failure: function () { },
                callback: function (opt, success, oResponse) {
                    oForm.up('window').close();
                }
            });
        }
    },

});