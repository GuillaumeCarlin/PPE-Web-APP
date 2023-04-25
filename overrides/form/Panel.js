Ext.define('Thot.overrides.FormPanel', {
    override: 'Ext.form.Panel',
    originalValues: {},

    /**
     * @author : edblv
     * date   : 21/06/16 09:16
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Prise en charge de la touche 'Entrée' pour validation du formulaire
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    validKey: function () {
        var oMe = this;

        if (oMe.validation) {
            var oValidBtn = oMe.query('#' + oMe.validation)[0];
            /*
            oMe.keyNav = Ext.create('Ext.util.KeyNav', oMe.el, {
                enter: function () {
                    oValidBtn.btnEl.dom.click()
                },
                scope: oMe
            });
            */
            oMe.keyNav = Ext.create('Ext.util.KeyNav', {
                target: oMe.el,
                enter: function () {
                    oValidBtn.btnEl.dom.click();
                },
                scope: oMe
            });
        }
    },
    /**
     * @author : edblv
     * date   : 28/10/16 09:14
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Mise à jour des champs du formulaire à partir des données reçues
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    updateForm: function (oDatas) {
        var oFormFld = {};
        var oFieldsPrc = {};
        var bDataMatch = false;
        var bTakeIt = true;
        var aDataMatch = [];

        if (arguments.length > 1) {
            oFieldsPrc = arguments[1];
        }

        if (arguments.length > 2) {
            bDataMatch = true;
            aDataMatch = arguments[2];
        }

        //---- On parcours les données reçues du serveur
        for (var sFieldName in oDatas) {
            oFormFld = this.query('#' + sFieldName);
            var sValue = null;
            //---- Si ce champ existe dans le formulaire, on le traite
            if (oFormFld.length > 0) {
                sValue = oDatas[sFieldName];

                //---- S'il se trouve dans oFieldsPrc c'est qu'il y a
                // (peut-être) un traitement à appliquer
                if (oFieldsPrc[sFieldName]) {
                    //---- S'il y a une conversion
                    if (oFieldsPrc[sFieldName].convert) {
                        sValue = oFieldsPrc[sFieldName].convert(oDatas);
                    }

                    //---- S'il y a un template
                    if (oFieldsPrc[sFieldName].template) {
                        sValue = oFieldsPrc[sFieldName].template.apply(oDatas);
                    }
                }

                oFormFld[0].setValue(sValue);
                //--- On conserve la valeur original pour pouvoir comparer avec la valeur finale
                this.originalValues[oFormFld[0].itemId] = {
                    label: oFormFld[0].fieldLabel,
                    value: sValue
                };

            }
        }

        //---- Maintenant, on parcours oFieldsPrc pour traiter les champs
        // du formulaire QUI NE SONT PAS dans l'enregistrement (donc des champs calculés)
        for (sFieldName in oFieldsPrc) {
            oFormFld = this.query('#' + sFieldName);
            var sValue = null;
            if (!oDatas[sFieldName]) {
                bTakeIt = true;

                if (bDataMatch) {
                    //---- Si bDataMatch, le champ DOIT se trouver dans bDataMatch
                    if (aDataMatch.indexOf(sFieldName) < 0) {
                        bTakeIt = false;
                    }
                }

                //---- Si le champ doit être traité
                if (bTakeIt) {
                    //---- S'il y a une conversion
                    if (oFieldsPrc[sFieldName].convert) {
                        sValue = oFieldsPrc[sFieldName].convert(oDatas);
                    }

                    if (oFormFld.length > 0) {
                        oFormFld[0].setValue(sValue);
                        //--- On conserve la valeur original pour pouvoir comparer avec la valeur finale
                        this.originalValues[oFormFld[0].itemId] = {
                            label: oFormFld[0].fieldLabel,
                            value: sValue
                        };
                    }
                }
            }
        }
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
    clearFields: function (aFields) {
        var aField = {};

        for (var iIndFld in aFields) {
            aField = this.query('#' + aFields[iIndFld]);

            if (aField.length > 0) {
                aField[0].setValue('');
            }
        }
    },

    /**
     * @author : edblv
     * date   : 28/10/16 16:02
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Retourne la valeur d'un champ du form
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    getFieldValue: function (sField) {
        var aField = this.query('#' + sField);
        var sValue = null;

        if (aField.length > 0) {
            sValue = aField[0].getValue();
        }

        return sValue;
    },
    /**
     * @author : edblv
     * date   : 28/10/16 16:59
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Met à jour la valeur d'un champ du form
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    setFieldValue: function (sField, sValue) {
        var aField = this.query('#' + sField);

        if (aField.length > 0) {
            aField[0].setValue(sValue);
        }
    },

    /**
     * @author : edblv
     * date   : 22/06/16 15:01
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Retourne un tableau contenant la liste des champs du formulaire (avec leur valeur)
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    fieldsList: function () {
        var oMe = this;
        var aFormFields = this.query('[itemId]');
        var bToServer = false;
        var aFields = {};
        var aField = [];
        var sField = '';

        if (arguments.length > 0) {
            bToServer = arguments[0];
        }

        for (var iIndFld in aFormFields) {
            aField = aFormFields[iIndFld];
            sField = aField.itemId;
            if (aField.xtype !== 'button') {
                //---- Si la liste est destinée au serveur (PHP) on fait un tableau de valeurs
                if (bToServer) {
                    aFields[sField] = '';
                } else {
                    //---- ...sinon on fait un tableau d'objets
                    aFields[sField] = {
                        type: aField.xtype,
                        value: ''
                    };
                }


                if (aField.getValue) {
                    if (bToServer) {
                        aFields[sField] = aField.getValue();
                    } else {
                        aFields[sField].value = aField.getValue();
                    }
                }

                if (!bToServer) {
                    switch (aField.xtype) {
                        case 'gridpanel':
                            aFields[sField].value = aField.getSelection();
                            break;

                        case 'panel':
                            break;
                    }
                }
            }
        }

        return aFields;
    },
    /**
     * @author : edblv
     * date   : 03/11/16 14:32
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Récupère tous les champs du formulaire et les prépares pour être
     * envoyés au PHP qui les traitera (généralement pour en faire une requête SQL)
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    fieldsToServer: function () {
        var aFields = this.fieldsList(true);
        var oFieldsProc = {};

        if (arguments.length > 0) {
            oFieldsProc = arguments[0];
        }

        //---- On parcours les champs du formulaires pour voir
        //	s'ils ont des traitements particuliers
        for (var sFieldName in aFields) {
            if (oFieldsProc[sFieldName]) {
                //---- Si le champ est présent dans oFieldsProc
                // c'est qu'il y a quelque chose à faire
                if (oFieldsProc[sFieldName].convert) {
                    //---- Si la fonction convert est présente,
                    //	c'est que le champ nécessite une conversion
                    aFields[sFieldName] = oFieldsProc[sFieldName].convert(aFields, 'sql');
                }
            }
        }
        return aFields;
    },

    /**
     * @author : edblv
     * date   : 23/06/16 10:44
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Charge le fichier JS contenant le code de validation du formulaire
     * Si pas de fichier, génère un code de validation arbitraire
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    getValid: function () {
        var oMe = this;
        var aArgs = [];

        if (arguments.length > 0) {
            aArgs = arguments;
        }
        //---- On cherche si ce formulaire possède
        // un fichier JS de validation
        Ext.Ajax.request({
            url: 'server/app/app.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'getValid',
                // passe le xtype pour identifier le fichier de validation
                // TODO: 2019-03-01 21:15:03 voir si on peut passer par une autre propriété (oMe.action par exemple)
                //	     ce serait plus simple pour multiplier les situations de vérification
                //       pour un même formulaire
                form: oMe.xtype
            },
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var aFields = oMe.fieldsList();
                var oValid = {
                    controller: {},
                    form: {},
                    valid: function (aFields, aArgs) {
                        var oMe = this;
                        //this.controller._fTest(true);
                        // on déclenche l'événement validForm du Panel qui va déclencher la fonction associée (ici _fTest())
                        oMe.form.fireEvent('validForm', false);
                    }
                };

                if (oBack.success) {
                    eval(oBack.code);
                }

                //oValid.controller = oMe.controller;
                oValid.form = oMe;
                oValid.valid(aFields, aArgs);
            }
        });
    },
    /**
     * @author : edblv
     * date   : 08/03/17 11:50
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Passe tous les champs en readOnly
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    setReadOnly: function (bReadOnly) {
        var oMe = this;
        var aFields = oMe.fieldsList();

        for (var sFieldName in aFields) {
            if (typeof oMe.query('#' + sFieldName)[0].setEditable == 'function') {
                oMe.query('#' + sFieldName)[0].setEditable(!bReadOnly);
            }

            if (typeof oMe.query('#' + sFieldName)[0].setReadOnly == 'function') {
                oMe.query('#' + sFieldName)[0].setReadOnly(bReadOnly);
            }
        }
    }
});