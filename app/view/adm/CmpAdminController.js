Ext.define('Thot.view.adm.CmpAdminController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.adm-cmpadmin',
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
        var oForm = oMe.getView();
        var oUsersGrd = oForm.query('#usersGrd')[0];
        var oSectionGrd = oForm.query('#sectionGrd')[0];
        var oWorkStnGrd = oForm.query('#workStnGrd')[0];
        var oFPSGrid = oForm.query('#fpsGrid')[0];

        var oUsersStr = oUsersGrd.getStore();
        var oSectionStr = oSectionGrd.getStore();
        var oWorkStnStr = oWorkStnGrd.getStore();
        var oFPSGridStr = oFPSGrid.getStore();

        oUsersStr.setExtraParams({
            storefilters: {
                specfilter: [
                    {
                        type: 'sab_id',
                        value: 'all',
                    },
                ],
            },
        });
        oUsersStr.load();
        oSectionStr.load();
        oWorkStnStr.load();
        oFPSGridStr.load();
    },
    /**
     * @author : edblv
     * date   : 20/10/17 15:25
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Déclenchée par l'événement 'gridRefresh' (lui même déclenché pat WebSocket)
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onGridRefresh: function (_aFilter) {
        var oMe = this;
        var oForm = oMe.getView();
        var oSectionGrd = oForm.query('#sectionGrd')[0];
        var oSectionUsersGrd = oForm.query('#sectionUsersGrd')[0];
        var oUsersGrd = oForm.query('#usersGrd')[0];
        var oWorkStnGrd = oForm.query('#workStnGrd')[0];
        var oWstnSctGrd = oForm.query('#workStnSectionGrd')[0];
        var oSectionWstnGrd = oForm.query('#sectionWstnGrd')[0];

        oUsersGrd.refresh();

        if (oSectionGrd.getSelection().length > 0) {
            oSectionUsersGrd.refresh();
        }

        oWorkStnGrd.refresh();

        if (oWstnSctGrd.getSelection().length > 0) {
            oSectionWstnGrd.refresh();
        }
    },
    /**
     * @author : edblv
     * date   : 26/09/16 17:46
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Render de la grid des Users
     * Déclaration du drag
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onUsersRender: function (oView) {
        oView.dragZone = new Ext.dd.DragZone(oView.getEl(), {
            getDragData: function (oEvent) {
                //var oSourceEl = oEvent.getTarget(oView.itemSelector, 10), d;
                var oSourceEl = oEvent.getTarget(),
                    d;

                if (oSourceEl) {
                    d = oSourceEl.cloneNode(true);
                    d.id = Ext.id();

                    return (oView.dragData = {
                        sourceEl: oSourceEl,
                        repairXY: Ext.fly(oSourceEl).getXY(),
                        ddel: d,
                        origine: 'Users',
                        //userData: oView.getRecord(oSourceEl)
                    });
                }
            },
            //Provide coordinates for the proxy to slide back to on failed drag.
            //This is the original XY coordinates of the draggable element.
            getRepairXY: function () {
                return this.dragData.repairXY;
            },
        });
    },
    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Render de la grid des Users d'une section
     * Déclaration du drag
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onSectionUsersRender: function (oView) {
        oView.dragZone = Ext.create('Ext.dd.DragZone', oView.getEl(), {
            /*
             On receipt of a mousedown event, see if it is within a draggable element.
             Return a drag data object if so. The data object can contain arbitrary application
             data, but it should also contain a DOM element in the ddel property to provide
             a proxy to drag.
             */
            getDragData: function (oEvent) {
                var oSourceEl = oEvent.getTarget(oView.itemSelector, 10),
                    d;

                if (oSourceEl) {
                    d = oSourceEl.cloneNode(true);
                    d.id = Ext.id();
                    return (oView.dragData = {
                        sourceEl: oSourceEl,
                        repairXY: Ext.fly(oSourceEl).getXY(),
                        ddel: d,
                        origine: 'sectionUsers',
                        userData: oEvent.record,
                    });
                }
            },
            //Provide coordinates for the proxy to slide back to on failed drag.
            //This is the original XY coordinates of the draggable element.
            getRepairXY: function () {
                return this.dragData.repairXY;
            },
        });
    },

    /**
     * @author : edblv
     * date   : 24/10/16 09:03
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onUserBeforeEdit: function () {
        return Thot.app.contexte.adminAppli;
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
    onUserEdit: function (oEditor, oEvent) {
        if (oEditor.activeColumn.field.disabled) {
            return;
        }

        Ext.Ajax.request({
            url: 'server/usr/Users.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'userEdit',
                rsc_id: oEvent.record.get('usr_id'),
                login: oEvent.value,
            },
            success: function () { },
            failure: function () { },
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (!oBack.success) {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', oBack.errorMessage.message);
                }
            },
        });
    },
    /**
     * @author : edblv
     * date   : 02/11/17 09:50
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur un user
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onUserSelect: function () {
        var oMe = this;
        oMe.checkTrsEnable();
    },

    /**
     * @author : edblv
     * date   : 27/09/16 10:44
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur un item de la grille 'Sections'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onUsersSectionSelect: function (_oGrid, oRecord) {
        var oMe = this;

        oMe.sectionUsers(
            oRecord.get('sab_id'),
            oRecord.get('sab_code'),
            oRecord.get('sab_libelle'),
        );
        oMe.checkTrsEnable();
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
    onSectionUserCtx: function (_oGrid, oRecord, iInd, _oRow, oMouseEvt) {
        var oMe = this,
            oComp = oMe.getView(),
            oSectionsGrd = oComp.query('#SectionGrd')[0],
            oSectionsStr = oSectionsGrd.getStore(),
            aItems = [],
            aSections = [];

        aItems.push({
            text: 'Modifier',
            itemId: 'edituser',
            iconCls: 'x-fa fa-pencil',
            listeners: {
                click: 'onEditUser',
                scope: oMe,
            },
        });
        aItems.push({
            text: 'Retirer',
            itemId: 'deluser',
            iconCls: 'x-fa fa-minus-circle',
            listeners: {
                click: 'onEditUser',
                scope: oMe,
            },
        });

        for (var i in oSectionsStr.getData().items) {
            aSections.push({
                itemId:
                    'section_' + oSectionsStr.getData().items[i].get('sab_id'),
                text: oSectionsStr.getData().items[i].get('sab_libelle'),
                sectionRecord: oSectionsStr.getData().items[i],
                listeners: {
                    click: 'onSectionAttrib',
                    scope: oMe,
                },
            });
        }

        aItems.push({
            text: 'Affecter à',
            itemId: 'attribuser',
            //icon: 'resources/images/16x16/bin_closed.png',
            iconCls: 'x-fa fa-plus-circle',
            record: oRecord,
            menu: aSections,
        });

        var oMenu = new Ext.menu.Menu({
            itemId: 'sectionUserMenu',
            //parentObj: oComp,
            record: oRecord,
            items: aItems,
        });
        oMenu.showAt(oMouseEvt.getXY());
        oMouseEvt.stopEvent();
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
    onEditUser: function (oItem) {
        var oMe = this,
            oForm = oMe.getView(),
            oUserRolePnl = oForm.query('#userRolePnl')[0],
            oUsersGrd = oForm.query('#usersGrd')[0],
            oMenu = oItem.parentMenu,
            oRecord = oMenu.record,
            sOption = oItem.itemId;

        switch (sOption) {
            case 'edituser':
                oUserRolePnl.expand();
                oUserRolePnl.fireEvent('roleedit', oRecord);
                break;

            case 'deluser':
                Ext.Ajax.request({
                    url: 'server/usr/Users.php',
                    params: {
                        appName: Thot.app.appConfig.name,
                        action: 'roleDelete',
                        rsc_id: oRecord.get('usr_id'),
                        org_id: oRecord.get('sab_id'),
                        rle_id: oRecord.get('rle_id'),
                        main: oRecord.get('rca_estprincipal'),
                    },
                    success: function () { },
                    failure: function () { },
                    callback: function (_opt, _success, oResponse) {
                        var oBack = Ext.decode(oResponse.responseText);

                        if (oBack.success) {
                            oMe.sectionUsers(oRecord.get('sab_id'));
                            oUsersGrd.refresh();
                        }
                    },
                });
                break;
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
    onSectionAttrib: function (oItem) {
        var oMe = this,
            oForm = this.getView(),
            oUserSectionGrd = oForm.query('#SectionGrd')[0],
            oMenu = oItem.parentMenu.parentMenu,
            oRecord = oMenu.record,
            aUsersId = [];

        aUsersId.push({
            rsc_id: oRecord.get('usr_id'),
            org_id_src: oRecord.get('sab_id'),
            rle_id_src: oRecord.get('rle_id'),
        });

        oMe.userSectionAttrib(
            {
                appName: Thot.app.appConfig.name,
                action: 'sectionUsersAttrib',
                users: JSON.stringify(aUsersId),
                org_id: oItem.sectionRecord.get('sab_id'),
            },
            oUserSectionGrd.getSelection()[0],
        );
    },

    /**
     * @author : edblv
     * date   : 27/09/16 10:44
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur un item de la grille 'Opérateur de la section'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onSectionUserSelect: function (_oGrid, _oRecord) {
        var oMe = this;

        oMe.checkTrsEnable();
    },

    /**
     * @author : edblv
     * date   : 02/11/17 09:51
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Vérifie si les conditions sont réunies pour activer le bouton 'Transfert'
     * (Sél. d'au moins un user ET sél. d'une section)
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    checkTrsEnable: function () {
        var oMe = this;
        var oForm = oMe.getView();
        var oUserGrd = oForm.query('#usersGrd')[0];
        var oUserSectionGrd = oForm.query('#SectionGrd')[0];
        var oUserToSectionBtn = oForm.query('#userToSection')[0];

        //---- Bouton d'affectation des opérateurs ésélectionnés à la section en cours
        if (
            oUserGrd.getSelection().length > 0 &&
            oUserSectionGrd.getSelection().length > 0
        ) {
            oUserToSectionBtn.setDisabled(false);
            // oUserToSectionBtn.setTooltip('Affecter ' + oUserGrd.getSelection().length + ' opérateur' + (oUserGrd.getSelection().length > 1 ? 's' : '') + ' à la section ' + oUserSectionGrd.getSelection()[0].get('sab_libelle'));
            oUserToSectionBtn.setText(
                'Affecter ' +
                oUserGrd.getSelection().length +
                ' opérateur' +
                (oUserGrd.getSelection().length > 1 ? 's' : '') +
                ' à la section ' +
                oUserSectionGrd.getSelection()[0].get('sab_libelle'),
            );
        } else {
            oUserToSectionBtn.setDisabled(true);
        }
    },
    /**
     * @author : edblv
     * date   : 02/11/17 09:57
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur le bouton 'Transfert' des users vers section
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onUserToSectionClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oUserGrd = oForm.query('#usersGrd')[0];
        var oUserSectionGrd = oForm.query('#SectionGrd')[0];
        var aUsers = oUserGrd.getSelection();
        var aUsersId = [];

        for (var iInd in aUsers) {
            aUsersId.push({
                rsc_id: aUsers[iInd].get('usr_id'),
                org_id_src: aUsers[iInd].get('sab_id'),
                rle_id_src: aUsers[iInd].get('rle_id'),
            });
        }

        oMe.userSectionAttrib(
            {
                appName: Thot.app.appConfig.name,
                action: 'sectionUsersAttrib',
                users: JSON.stringify(aUsersId),
                org_id: oUserSectionGrd.getSelection()[0].get('sab_id'),
            },
            oUserSectionGrd.getSelection()[0],
        );
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
    onUserSectionToSectionClick: function () {
        var oMe = this;
        var oForm = oMe.getView();
        // var aSectionUsers = oForm.query('#sectionUsersGrd')[0];
        // var oUserSectionGrd = oForm.query('#SectionGrd')[0];
    },

    /**
     * @author : edblv
     * date   : 03/10/16 10:50
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Mise à jour de la grille des users d'une section
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    sectionUsers: function (iSabId, sSabCode, sSabLibelle) {
        var oMe = this;
        var oForm = oMe.getView();
        var oSectionUsersGrd = oForm.query('#sectionUsersGrd')[0];

        var aFilter = [
            {
                type: 'sab_id',
                value: iSabId,
            },
            {
                type: 'inactif',
                value: 2, // pour afficher les utilisateurs actifs et inactifs
            },
        ];

        //---- Chargement de la combo des sections
        oSectionUsersGrd.getStore().setExtraParams({
            storefilters: {
                specfilter: aFilter,
            },
        });

        oSectionUsersGrd.refresh();

        // mise à jour du titre de la grille pour indiquer l'atelier actif
        oSectionUsersGrd.setTitle(
            'Opérateurs de la section ' + sSabLibelle + ' (' + sSabCode + ')',
        );
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
    onUsersSectionRender: function (oGrid) {
        var oMe = this;

        oGrid.dropZone = new Ext.dd.DropZone(oGrid.getEl(), {
            // If the mouse is over a grid row, return that node. This is
            // provided as the "target" parameter in all "onNodeXXXX" node event handling functions
            getTargetFromEvent: function (e) {
                return e.getTarget(oGrid.getView().rowSelector);
            },
            // On entry into a target node, highlight that node.
            onNodeEnter: function (target, _dd, _e, _data) {
                Ext.fly(target).addCls('my-row-highlight-class');
            },
            // On exit from a target node, unhighlight that node.
            onNodeOut: function (target, _dd, _e, _data) {
                Ext.fly(target).removeCls('my-row-highlight-class');
            },
            // While over a target node, return the default drop allowed class which
            // places a "tick" icon into the drag proxy.
            onNodeOver: function (_target, _dd, _e, _data) {
                return Ext.dd.DropZone.prototype.dropAllowed;
            },
            // On node drop we can interrogate the target to find the underlying
            // application object that is the real target of the dragged data.
            // In this case, it is a Record in the GridPanel's Store.
            // We can use the data set up by the DragZone's getDragData method to read
            // any data we decided to attach in the DragZone's getDragData method.
            onNodeDrop: function (target, _dd, oEvent, oSource) {
                var oStore = oGrid.getStore();
                var iTargetInd = parseInt(
                    target.offsetParent.dataset.recordindex,
                    10,
                );
                var oTargetRecord = oStore.getData().items[iTargetInd];
                var oSourceRecord = oSource.userData;
                var bAdd = oEvent.ctrlKey;

                if (oSourceRecord.get('sab_id') < 1) {
                    //---- Si le user seléctionné n'est dans aucun service
                    //	on est dans le même cas que l'ajout
                    bAdd = true;
                }

                if (bAdd) {
                    //---- Ajouter une section au user
                    oMe.userSectionAttrib(
                        {
                            appName: Thot.app.appConfig.name,
                            action: 'sectionAdd',
                            rsc_id: oSourceRecord.get('usr_id'),
                            org_id: oTargetRecord.get('sab_id'),
                        },
                        oTargetRecord,
                    );
                } else {
                    //---- Remplacer la section de ce user par une autre
                    oMe.userSectionAttrib(
                        {
                            appName: Thot.app.appConfig.name,
                            action: 'sectionReplace',
                            rsc_id: oSourceRecord.get('usr_id'),
                            org_id_src: oSourceRecord.get('sab_id'),
                            org_id: oTargetRecord.get('sab_id'),
                            rle_id_src: oSourceRecord.get('rle_id'),
                        },
                        oTargetRecord,
                    );
                }

                return true;
            },
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
    userSectionAttrib: function (oParams, oTargetRecord) {
        var oMe = this,
            oForm = oMe.getView();

        Ext.Ajax.request({
            url: 'server/usr/Users.php',
            params: oParams,
            success: function () { },
            failure: function () { },
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var oUsersGrd = oForm.query('#usersGrd')[0];
                var oSectionGrd = oForm.query('#SectionGrd')[0];

                if (oBack.success) {
                    oSectionGrd.getSelectionModel().select(oTargetRecord);
                    oSectionGrd.fireEvent(
                        'itemclick',
                        oSectionGrd,
                        oTargetRecord,
                    );
                    oUsersGrd.refresh();
                }
            },
        });
    },
    // DEV: 2020-07-01 11:37:30 HVT
    /**
     * @Author  Hervé VALOT
     * @description gestion des évènements clic sur la liste des opérateurs de la section d'atelier
     * @param {Object} oView
     * @param {Object} oComp
     * @param {Number} iCellInd index de la colonne de grille
     * @param {Object} oRecord  enregistrement de la ligne
     */
    onVerifierCoherenceCheck: function (
        _column,
        rowIndex,
        checked,
        _record,
        _e,
        _eOpts,
    ) {
        var oGrid = this.getView().query('#sectionUsersGrd')[0],
            oGridStore = oGrid.getStore();

        // lancer la requête Ajax pour mise à jour de la base de données
        Ext.Ajax.request({
            url: 'server/usr/Users.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'setVerifierCoherence',
                rsc_id: oGridStore.data.items[rowIndex].data.usr_id, // identifiant de l'opérateur à mettre à jour
                usr_verifiercoherence: checked | 0,
            },
            success: function () { },
            failure: function () { },
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    oGrid.refresh();
                }
            },
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
    onSctUsrCellClick: function (_oView, _oComp, iCellInd, oRecord) {
        var oMe = this,
            oForm = oMe.getView(),
            oUserRolePnl = oForm.query('#userRolePnl')[0];

        if (iCellInd > 0) {
            oUserRolePnl.expand();
            oUserRolePnl.fireEvent('roleedit', oRecord);
        }
    },
    /**
     * @author : edblv
     * date   : 26/10/16 16:33
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Déclenché par un clic sur un user dans la grid sectionUsers
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onRoleEdit: function (oRecord) {
        var oMe = this,
            oForm = oMe.getView(),
            oUserRolePnl = oForm.query('#userRolePnl')[0],
            oUserRoleCbo = oUserRolePnl.query('#userRoleCbo')[0],
            oUserTeamCbo = oUserRolePnl.query('#userTeamCbo')[0],
            oUserContractCbo = oUserRolePnl.query('#userContractCbo')[0];

        oUserRoleCbo.setValue(oRecord.get('rle_id'));
        oUserTeamCbo.setValue(oRecord.get('eqe_id'));
        oUserContractCbo.setValue(oRecord.get('ctt_id'));
    },

    /**
     * @author : edblv
     * date   : 27/10/16 09:49
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onRoleValid: function () {
        var oMe = this,
            oForm = this.getView(),
            oUserRolePnl = oForm.query('#userRolePnl')[0],
            oUserRoleCbo = oUserRolePnl.query('#userRoleCbo')[0],
            oUserTeamCbo = oUserRolePnl.query('#userTeamCbo')[0],
            oUserContractCbo = oUserRolePnl.query('#userContractCbo')[0],
            oSectionUserGrd = oForm.query('#sectionUsersGrd')[0],
            oSelectedUser = oSectionUserGrd
                .getSelectionModel()
                .getSelection()[0],
            oSelectedRole = oUserRoleCbo.getRecord(oUserRoleCbo.getValue()),
            oSelectedTeam = oUserTeamCbo.getRecord(oUserTeamCbo.getValue()),
            oSelectedContract = oUserContractCbo.getRecord(
                oUserContractCbo.getValue(),
            );

        Ext.Ajax.request({
            url: 'server/usr/Users.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'roleUpdate',
                rsc_id: oSelectedUser.get('usr_id'),
                org_id: oSelectedUser.get('sab_id'),
                rle_id_src: oSelectedUser.get('rle_id'),
                rle_id: oUserRoleCbo.getValue(),
                main: oSelectedUser.get('rca_estprincipal'),
                eqe_id: oUserTeamCbo.getValue(),
                ctt_id: oUserContractCbo.getValue(),
            },
            success: function () { },
            failure: function () { },
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    oSelectedUser.set('rle_id', oUserRoleCbo.getValue());
                    oSelectedUser.set('eqe_id', oUserTeamCbo.getValue());
                    oSelectedUser.set('ctt_id', oUserContractCbo.getValue());
                    oSelectedUser.set(
                        'rle_libelle',
                        oSelectedRole.get('rle_libelle'),
                    );
                    oSelectedUser.set(
                        'eqe_libelle',
                        oSelectedTeam.get('eqe_libelle'),
                    );
                    oSelectedUser.set(
                        'ctt_libelle',
                        oSelectedContract.get('ctt_libelle'),
                    );
                    oMe.onRoleCancel();
                }
            },
        });
    },
    /**
     * @author : edblv
     * date   : 27/10/16 09:53
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Annuler' dans le panel d'édition du rôle
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onRoleCancel: function () {
        var oMe = this,
            oForm = oMe.getView(),
            oUserRolePnl = oForm.query('#userRolePnl')[0];

        oUserRolePnl.collapse();
    },

    /**
     * @author : edblv
     * date   : 03/10/16 09:21
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onRoleDelClick: function (oGrid, rowIndex, _colIndex) {
        var oMe = this,
            oForm = this.getView(),
            oUsersGrd = oForm.query('#usersGrd')[0],
            oRecord = oGrid.getStore().getAt(rowIndex);

        Ext.Ajax.request({
            url: 'server/usr/Users.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'roleDelete',
                rsc_id: oRecord.get('usr_id'),
                org_id: oRecord.get('sab_id'),
                rle_id: oRecord.get('rle_id'),
                main: oRecord.get('rca_estprincipal'),
            },
            success: function () { },
            failure: function () { },
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    oMe.sectionUsers(oRecord.get('sab_id'));
                    oUsersGrd.refresh();
                }
            },
        });
    },

    /**-------------------------------------------------------------------------------------------
     * Méthodes concernant l'onglet 'Equipements'
     -------------------------------------------------------------------------------------------*/
    /**
     * @author : edblv
     * date   : 03/11/17 15:20
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur un item de la grid 'Equipements'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onWstnSelect: function () {
        var oMe = this;

        oMe.checkWstnTrsEnable();
    },

    /**
     * @author : edblv
     * date   : 02/11/17 09:51
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Vérifie si les conditions sont réunies pour activer le bouton 'Transfert'
     * (Sél. d'au moins un user ET sél. d'une section)
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    checkWstnTrsEnable: function () {
        var oMe = this,
            oForm = oMe.getView(),
            oWstnGrd = oForm.query('#workStnGrd')[0],
            oWstnSectionGrd = oForm.query('#workStnSectionGrd')[0],
            oWstnToSectionBtn = oForm.query('#wkstnToSection')[0];

        //---- Bouton de gauche
        if (
            oWstnGrd.getSelection().length > 0 &&
            oWstnSectionGrd.getSelection().length > 0
        ) {
            oWstnToSectionBtn.setDisabled(false);
            oWstnToSectionBtn.setText(
                'Affecter ' +
                oWstnGrd.getSelection().length +
                ' équipement' +
                (oWstnGrd.getSelection().length > 1 ? 's' : '') +
                ' à la section ' +
                oWstnSectionGrd.getSelection()[0].get('sab_libelle'),
            );
        } else {
            oWstnToSectionBtn.setDisabled(true);
        }
    },
    /**
     * @author : edblv
     * date   : 03/11/17 15:11
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur le bouton 'Transfert' des équipements vers section
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onWkstnToSectionClick: function () {
        var oMe = this,
            oForm = this.getView(),
            oWstnGrd = oForm.query('#workStnGrd')[0],
            oWstnSectionGrd = oForm.query('#workStnSectionGrd')[0],
            aWstn = oWstnGrd.getSelection(),
            aWstnId = [];
        // DEV: à prendre en exemple pour le passage de paramètres complémentaires au PHP
        for (var iInd in aWstn) {
            aWstnId.push({
                rsc_id: aWstn[iInd].get('rsc_id'),
                org_id_src: aWstn[iInd].get('sab_id'),
            });
        }

        oMe.workStnSectionAttrib(
            {
                appName: Thot.app.appConfig.name,
                action: 'wstnSectionAttrib',
                wstn: JSON.stringify(aWstnId),
                org_id: oWstnSectionGrd.getSelection()[0].get('sab_id'),
            },
            oWstnSectionGrd.getSelection()[0],
        );
    },
    /**
     * ************************ DEV ****
     * action click sur la ligne de la grille des équipements
     * @param {*} _oView
     * @param {*} _oComp
     * @param {*} _iCellInd
     * @param {*} _oRecord
     */
    onCellDblClick: function (_oView, _oComp, _iCellInd, _oRecord) {
        return;
    },
    /**
     * @author	Hervé Valot
     * @version	20190225
     * @description	action pour édition des paramètres d'un équipement
     * @param {*} grid la grille sélectionnée
     * @param {*} rowIndex la ligne
     * @param {*} _colIndex la colonne
     */
    onEditEqp: function (grid, rowIndex, _colIndex) {
        var oMe = this,
            rec = grid.getStore().getAt(rowIndex),
            oForm = this.getView(),
            aActiveSection = oForm
                .query('#workStnSectionGrd')[0]
                .getSelection()[0].data;

        oMe.showForm({
            widget: 'frmequipementalternative',
            title: "Paramètres de l'équipement",
            alias: 'eqpparam',
            height: 875,
            width: 700,
            param: {
                // on récupère l'identifiant de l'équipement de la ligne pour afficher ses paramètres
                recordId: rec.get('rsc_id'),
                // TODO: 2019-03-20 13:55:47, HVT, récupérer aussi la section active pour afficher la liste des équipements de la section
                custom: aActiveSection,
            },
            oncloseevent: 'listsRefresh',
        });
    },
    /**
     * @author : edblv
     * date   : 03/11/17 16:39
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic droit sur la grille 'Equipements de la section'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onSectionWstnCtx: function (_oGrid, oRecord, iInd, _oRow, oMouseEvt) {
        var oMe = this,
            oComp = this.getView(),
            oSectionsGrd = oComp.query('#workStnSectionGrd')[0],
            oSectionsStr = oSectionsGrd.getStore(),
            aItems = [],
            aSections = [];

        aItems.push({
            text: 'Retirer',
            itemId: 'delwstn',
            //icon: 'resources/images/16x16/bin_closed.png',
            iconCls: 'x-fa fa-minus-circle',
            listeners: {
                click: 'onDelWstn',
                scope: oMe,
            },
        });

        for (var i in oSectionsStr.getData().items) {
            aSections.push({
                itemId:
                    'section_' + oSectionsStr.getData().items[i].get('sab_id'),
                text: oSectionsStr.getData().items[i].get('sab_libelle'),
                sectionRecord: oSectionsStr.getData().items[i],
                listeners: {
                    click: 'onWstnSectionAttrib',
                    scope: oMe,
                },
            });
        }

        aItems.push({
            text: 'Affecter à',
            itemId: 'attribwstn',
            //icon: 'resources/images/16x16/bin_closed.png',
            iconCls: 'x-fa fa-plus-circle',
            record: oRecord,
            menu: aSections,
        });

        var oMenu = new Ext.menu.Menu({
            itemId: 'sectionWstnMenu',
            //parentObj: oComp,
            record: oRecord,
            items: aItems,
        });
        oMenu.showAt(oMouseEvt.getXY());
        oMouseEvt.stopEvent();
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
    onDelWstn: function (oItem) {
        var oMe = this,
            oForm = this.getView(),
            oWorkStnGrd = oForm.query('#workStnGrd')[0],
            oWstnSectionGrd = oForm.query('#workStnSectionGrd')[0],
            oMenu = oItem.parentMenu,
            oRecord = oMenu.record,
            oSection = oWstnSectionGrd.getSelection()[0],
            iSabId = oSection.get('sab_id');

        Ext.Ajax.request({
            url: 'server/wst/WorkStn.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'wstnSectionDel',
                rsc_id: oRecord.get('rsc_id'),
                org_id_src: oRecord.get('sab_id'),
            },
            success: function () { },
            failure: function () { },
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);

                if (oBack.success) {
                    oWorkStnGrd.refresh();
                    //oWstnSectionGrd.refresh();
                    oWstnSectionGrd.getSelectionModel().select(oSection);
                    oMe.sectionWstn(iSabId);
                }
            },
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
    onWstnSectionAttrib: function (oItem) {
        var oMe = this,
            oForm = this.getView(),
            oWstnSectionGrd = oForm.query('#workStnSectionGrd')[0],
            oMenu = oItem.parentMenu.parentMenu,
            oRecord = oMenu.record,
            aWstnId = [];

        aWstnId.push({
            rsc_id: oRecord.get('rsc_id'),
            org_id_src: oRecord.get('sab_id'),
        });

        oMe.workStnSectionAttrib(
            {
                appName: Thot.app.appConfig.name,
                action: 'wstnSectionAttrib',
                wstn: JSON.stringify(aWstnId),
                org_id: oItem.sectionRecord.get('sab_id'),
            },
            oWstnSectionGrd.getSelection()[0],
        );
    },

    /**
     * @author : edblv
     * date   : 03/10/16 17:12
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Render de la grid des équipements
     * Déclaration du drag
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onWorkStnRender: function (oView) {
        oView.dragZone = Ext.create('Ext.dd.DragZone', oView.getEl(), {
            /*
             On receipt of a mousedown event, see if it is within a draggable element.
             Return a drag data object if so. The data object can contain arbitrary application
             data, but it should also contain a DOM element in the ddel property to provide
             a proxy to drag.
             */
            getDragData: function (oEvent) {
                var oSourceEl = oEvent.getTarget(oView.itemSelector, 10),
                    d;

                if (oSourceEl) {
                    d = oSourceEl.cloneNode(true);
                    d.id = Ext.id();
                    return (oView.dragData = {
                        sourceEl: oSourceEl,
                        repairXY: Ext.fly(oSourceEl).getXY(),
                        ddel: d,
                        origine: 'Equipments',
                        workStnData: oEvent.record,
                    });
                }
            },
            //Provide coordinates for the proxy to slide back to on failed drag.
            //This is the original XY coordinates of the draggable element.
            getRepairXY: function () {
                return this.dragData.repairXY;
            },
        });
    },
    /**
     * @author : edblv
     * date   : 03/10/16 17:20
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Render de la grille section d'équipements
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onWorkStnSectionRender: function (oGrid) {
        var oMe = this;

        oGrid.dropZone = new Ext.dd.DropZone(oGrid.getEl(), {
            // If the mouse is over a grid row, return that node. This is
            // provided as the "target" parameter in all "onNodeXXXX" node event handling functions
            getTargetFromEvent: function (e) {
                return e.getTarget(oGrid.getView().rowSelector);
            },
            // On entry into a target node, highlight that node.
            onNodeEnter: function (target, _dd, _e, _data) {
                Ext.fly(target).addCls('my-row-highlight-class');
            },
            // On exit from a target node, unhighlight that node.
            onNodeOut: function (target, _dd, _e, _data) {
                Ext.fly(target).removeCls('my-row-highlight-class');
            },
            // While over a target node, return the default drop allowed class which
            // places a "tick" icon into the drag proxy.
            onNodeOver: function (_target, _dd, _e, _data) {
                return Ext.dd.DropZone.prototype.dropAllowed;
            },
            // On node drop we can interrogate the target to find the underlying
            // application object that is the real target of the dragged data.
            // In this case, it is a Record in the GridPanel's Store.
            // We can use the data set up by the DragZone's getDragData method to read
            // any data we decided to attach in the DragZone's getDragData method.
            onNodeDrop: function (target, _dd, oEvent, oSource) {
                var oStore = oGrid.getStore(),
                    iTargetInd = parseInt(
                        target.offsetParent.dataset.recordindex,
                        10,
                    ),
                    oTargetRecord = oStore.getData().items[iTargetInd],
                    oSourceRecord = oSource.workStnData,
                    bAdd = oEvent.ctrlKey;

                if (oSourceRecord.get('sab_id') < 1) {
                    //---- Si l'équipement seléctionné n'est dans aucun service
                    //	on est dans le même cas que l'ajout
                    bAdd = true;
                }

                if (bAdd) {
                    //---- Ajouter une section a l'équipement
                    oMe.workStnSectionAttrib(
                        {
                            appName: Thot.app.appConfig.name,
                            action: 'wstnSectionAdd',
                            rsc_id: oSourceRecord.get('rsc_id'),
                            org_id: oTargetRecord.get('sab_id'),
                        },
                        oTargetRecord,
                    );
                } else {
                    //---- Remplacer la section de ce user par une autre
                    oMe.workStnSectionAttrib(
                        {
                            appName: Thot.app.appConfig.name,
                            action: 'wstnSectionReplace',
                            rsc_id: oSourceRecord.get('rsc_id'),
                            org_id_src: oSourceRecord.get('sab_id'),
                            org_id: oTargetRecord.get('sab_id'),
                        },
                        oTargetRecord,
                    );
                }

                return true;
            },
        });
    },
    /**
     * @author : edblv
     * date   : 03/10/16 17:20
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Selection d'une section dans la grille des sections d'équipements
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onWorkStnSectionSelect: function (_oGrid, oRecord) {
        var oMe = this;

        oMe.sectionWstn(
            oRecord.get('sab_id'),
            oRecord.get('sab_code'),
            oRecord.get('sab_libelle'),
        );
        oMe.checkWstnTrsEnable();
    },
    /**
     * @author : edblv
     * date   : 04/10/16 10:10
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Mise à jour de la grille des équipements d'une section
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    sectionWstn: function (iSabId, sSabCode, sSabLibelle) {
        var oMe = this,
            oForm = oMe.getView();

        var oSectionWstnGrd = oForm.query('#sectionWstnGrd')[0];

        var aFilter = [];
        aFilter.push({
            type: 'sab_id',
            value: iSabId,
        });
        aFilter.push({
            type: 'inactif',
            value: 2,
        });

        oSectionWstnGrd.getStore().removeAll();
        oSectionWstnGrd.getStore().setExtraParams({
            storefilters: {
                specfilter: aFilter,
            },
        });
        oSectionWstnGrd.refresh();
        oSectionWstnGrd.setTitle(
            'Equipements de la section ' + sSabLibelle + ' (' + sSabCode + ')',
        );
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
    workStnSectionAttrib: function (oParams, oTargetRecord) {
        var oMe = this,
            oForm = oMe.getView();

        Ext.Ajax.request({
            url: 'server/wst/WorkStn.php',
            params: oParams,
            success: function () { },
            failure: function () { },
            callback: function (_opt, _success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                var oWorkStnGrd = oForm.query('#workStnGrd')[0];
                var oWstnSectionGrd = oForm.query('#workStnSectionGrd')[0];

                if (oBack.success) {
                    oWstnSectionGrd.getSelectionModel().select(oTargetRecord);
                    oWstnSectionGrd.fireEvent(
                        'itemclick',
                        oWstnSectionGrd,
                        oTargetRecord,
                    );
                    oWorkStnGrd.refresh();
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', oBack.errorMessage.message);
                }
            },
        });
    },
    /**
     * @author      Hervé Valot
     * @date        20190123
     * @description ouvre un formulaire en fonction des paramètres passés en objet
     * @param oParam objet contenant les paramètres du formulaire à afficher
     * @version     20190123 Création
     */
    showForm: function (oParam) {
        var oForm = this.getView(),
            oMain = oForm.up('app-main'),
            oWin = Thot.app.openWidget(oParam.widget, {
                title: oParam.title,
                alias: oParam.alias,
                modal: true,
                resizable: false,
                height: oParam.height,
                width: oParam.width,
                param: oParam.param ? oParam.param : {},
            });
        oWin.on({
            destroy: function () {
                oMain.fireEvent(oParam.oncloseevent);
            },
        });
    },

    /** ---------------------------- Controller de la page FPS ---------------------------- */

    /**
     * @author Carlin Guillaume
     * @date 28/03/2023
     * @description Permet de rafraichir uniquement le tableau des FPS et de vider les tableaux des équipements et des signataires
     */
    GridFpsRefresh: function () {
        oForm = this.getView();
        GridFps = oForm.query('#fpsGrid')[0];
        GridFps.getStore().reload();
        oForm.query('#eqpGrid')[0].getStore().loadData([], false);
        oForm.query('#personneGrid')[0].getStore().loadData([], false);

        var oBoutonUserAjout = oForm.query('#btnUserAjout')[0];
        oBoutonUserAjout.setDisabled(true);
        var oBoutonUserSup = oForm.query('#btnUserSupprimer')[0];
        oBoutonUserSup.setDisabled(true);
        var oBoutonSupprimer = oForm.query('#btnEqtSupprimer')[0];
        oBoutonSupprimer.setDisabled(true);
        var oBoutonAjout = oForm.query('#btnEqtAjout')[0];
        oBoutonAjout.setDisabled(true);
        var oBoutonSupprimerFPS = oForm.query('#btnFPSSupprimer')[0];
        oBoutonSupprimerFPS.setDisabled(true);
    },

    /**
     * @author Carlin Guillaume
     * @date 28/03/2023
     * @description Permet de rafraichir uniquement le tableau des équipements et de vider le tableau des signataires
     */
    GridEqtRefresh: function () {
        oForm = this.getView();
        GridFps = oForm.query('#eqpGrid')[0];
        GridFps.getStore().reload();
        oForm.query('#personneGrid')[0].getStore().loadData([], false);

        var oBoutonUserAjout = oForm.query('#btnUserAjout')[0];
        oBoutonUserAjout.setDisabled(true);
        var oBoutonUserSup = oForm.query('#btnUserSupprimer')[0];
        oBoutonUserSup.setDisabled(true);
        var oBoutonSupprimer = oForm.query('#btnEqtSupprimer')[0];
        oBoutonSupprimer.setDisabled(true);
    },

    /**
 * @author Carlin Guillaume
 * @date 28/03/2023
 * @description Permet de rafraichir uniquement le tableau des signataires
 */
    GridUsrRefresh: function () {
        oForm = this.getView();
        GridUsr = oForm.query('#personneGrid')[0];
        GridUsr.getStore().reload();
        var oBoutonUserSup = oForm.query('#btnUserSupprimer')[0];
        oBoutonUserSup.setDisabled(true);
    },


    /**
     * @author Carlin Guillaume
     * @date 28/03/2023
     * @description Load le tableau des équipements + le PDF + Ajuste les différents boutons lorsque l'on sélectionne une FPS
     */
    onFPSSelect: function (oGrid, oRecord, eOpts) {
        var oForm = this.getView();
        oEquipementSheet = oForm.query('#eqpGrid')[0];

        aFilter = [{
            type: 'id_fps',
            value: oRecord.data.FPS_ID,
        }];

        oEquipementSheet.getStore().setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oForm.query('#personneGrid')[0].getStore().loadData([], false);
        oEquipementSheet.getStore().reload();

        oPanelPDF = oForm.query('#pdfview')[0];
        nom = oRecord.data.FPS_CODE;
        // Chemin = oRecord.data.FPS_CHEMIN;

        Chemin = "../../resources/pdf/PDF.pdf";

        while (Chemin.indexOf('/') !== -1) {
            Chemin = Chemin.replace('/', '\\');
        }
        console.log(Chemin)

        html = '<iframe src="' + Chemin + '" width="100%" height="100%"></iframe>'
        oPanelPDF.setHtml(html);

        var oBoutonSupprimerFPS = oForm.query('#btnFPSSupprimer')[0];
        oBoutonSupprimerFPS.setDisabled(false);

        var oBoutonSupprimer = oForm.query('#btnEqtSupprimer')[0];
        oBoutonSupprimer.setDisabled(true);

        var oBoutonAjout = oForm.query('#btnEqtAjout')[0];
        oBoutonAjout.setDisabled(false);

        var oBoutonUserAjout = oForm.query('#btnUserAjout')[0];
        oBoutonUserAjout.setDisabled(true);

        var oBoutonUserSup = oForm.query('#btnUserSupprimer')[0];
        oBoutonUserSup.setDisabled(true);

    },

    /**
     * @author Carlin Guillaume
     * @date 28/03/2023
     * @description Load le tableau des users + Ajuste les différents boutons lorsque l'on sélectionne un équipement
     */
    onFPSEqtSelect: function (oGrid, oRecord, eOpts) {
        var oForm = this.getView();
        oPersonneSheet = oForm.query('#personneGrid')[0];
        aFilter = [{
            type: 'id_fps',
            value: oRecord.data.FPS_ID,
        }, {
            type: 'id_rsc',
            value: oRecord.data.RSC_ID,
        }];
        oPersonneSheet.getStore().setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oPersonneSheet.getStore().reload();

        var oBoutonSupprimer = oForm.query('#btnEqtSupprimer')[0];
        oBoutonSupprimer.setDisabled(false);

        var oBoutonUserAjouter = oForm.query('#btnUserAjout')[0];
        oBoutonUserAjouter.setDisabled(false);

        var oBoutonUserSupprimer = oForm.query('#btnUserSupprimer')[0];
        oBoutonUserSupprimer.setDisabled(true);
    },


    /**
     * @author Carlin Guillaume
     * @date 28/03/2023
     * @description Permet d'activer le bouton de suppression lorsqu'un Signataire est sélectionné'
     */
    onFPSUserSelect: function (oGrid, oRecord, eOpts) {
        oForm = this.getView();
        oBoutonSupprimer = oForm.query('#btnUserSupprimer')[0];

        oBoutonSupprimer.setDisabled(false);
    },

    /**
     * @author Carlin Guillaume
     * @date 28/03/2023
     * @description Permet de crée le formulaire d'ajout d'une FPS
     */
    NewFPS: function () {
        var oForm = this.getView();

        oWin = Thot.app.openWidget('createfps', {
            title: 'Nouvelle FPS',
            alias: 'newfps',
            modal: true,
            resizable: false,
            height: 300,
            width: 600,
            param: {
                custom: {
                    Page: 'newfps',
                }
            },
        })
        oWin.on({
            destroy: function () {
                oForm.query('#fpsGrid')[0].fireEvent('Refresh');
            },
        });
    },

    /**
     * @author Carlin Guillaume
     * @date 28/03/2023
     * @description Permet de crée le formulaire de suppression d'une FPS
     */
    DelFPS: function () {
        var oMe = this;
        var oForm = oMe.getView();
        var FPS_ID = oForm.query('#fpsGrid')[0].getSelectionModel().selected.items[0].get('FPS_ID');
        var FPS_code = oForm.query('#fpsGrid')[0].getSelectionModel().selected.items[0].get('FPS_CODE');

        oWin = Thot.app.openWidget('createfps', {
            title: 'Supprimer FPS',
            alias: 'newfps',
            modal: true,
            resizable: false,
            height: 150,
            width: 600,
            param: {
                custom: {
                    Page: 'delfps',
                    fps_id: FPS_ID,
                    fps_code: FPS_code
                }
            },
        })

        oWin.on({
            destroy: function () {
                oForm.query('#fpsGrid')[0].fireEvent('Refresh');
            },
        });

    },


    /**
     * @author Carlin Guillaume
     * @date 28/03/2023
     * @description Permet de crée le formulaire d'ajout d'un équipement
     */
    NewEqt: function () {
        var oMe = this;
        var oForm = oMe.getView();
        var FPS_ID = oForm.query('#fpsGrid')[0].getSelectionModel().selected.items[0].get('FPS_ID');
        var FPS_code = oForm.query('#fpsGrid')[0].getSelectionModel().selected.items[0].get('FPS_CODE');

        oWin = Thot.app.openWidget('createfps', {
            title: 'Nouvelle équipement',
            alias: 'newfps',
            modal: true,
            resizable: false,
            height: 300,
            width: 600,
            param: {
                custom: {
                    Page: 'neweqt',
                    fps_id: FPS_ID,
                    fps_code: FPS_code
                }
            },
        })

        oWin.on({
            destroy: function () {
                oForm.query('#eqpGrid')[0].fireEvent('Refresh');
            },
        })
    },

    /**
     * @author Carlin Guillaume
     * @date 28/03/2023
     * @description Permet de crée le formulaire de suppression d'un équipement
     */
    DelEqt: function () {
        var oMe = this;
        var oForm = oMe.getView();
        var RSC_ID = oForm.query('#eqpGrid')[0].getSelectionModel().selected.items[0].get('RSC_ID');
        var FPS_ID = oForm.query('#eqpGrid')[0].getSelectionModel().selected.items[0].get('FPS_ID');
        var RSC_CODE = oForm.query('#eqpGrid')[0].getSelectionModel().selected.items[0].get('RSC_CODE');
        var FPS_code = oForm.query('#fpsGrid')[0].getSelectionModel().selected.items[0].get('FPS_CODE');

        oWin = Thot.app.openWidget('createfps', {
            title: 'Supprimer équipement',
            alias: 'newfps',
            modal: true,
            resizable: false,
            height: 150,
            width: 600,
            param: {
                custom: {
                    Page: 'deleqt',
                    rsc_id: RSC_ID,
                    fps_id: FPS_ID,
                    rsc_code: RSC_CODE,
                    fps_code: FPS_code
                }
            },
        })

        oWin.on({
            destroy: function () {
                oForm.query('#eqpGrid')[0].fireEvent('Refresh');
            },
        })
    },

    /**
     * @author Carlin Guillaume
     * @date 28/03/2023
     * @description Permet de crée le formulaire d'ajout d'un signataire
     */
    NewUsr: function () {
        var oMe = this;
        var oForm = oMe.getView();
        var RSC_ID = oForm.query('#eqpGrid')[0].getSelectionModel().selected.items[0].get('RSC_ID');
        var FPS_ID = oForm.query('#eqpGrid')[0].getSelectionModel().selected.items[0].get('FPS_ID');
        var RSC_CODE = oForm.query('#eqpGrid')[0].getSelectionModel().selected.items[0].get('RSC_CODE');
        var FPS_code = oForm.query('#fpsGrid')[0].getSelectionModel().selected.items[0].get('FPS_CODE');

        oWin = Thot.app.openWidget('createfps', {
            title: 'Nouveau signataire',
            alias: 'newfps',
            modal: true,
            resizable: false,
            height: 300,
            width: 600,
            param: {
                custom: {
                    Page: 'newuser',
                    rsc_id: RSC_ID,
                    fps_id: FPS_ID,
                    rsc_code: RSC_CODE,
                    fps_code: FPS_code
                }
            },
        })

        oWin.on({
            destroy: function () {
                oForm.query('#personneGrid')[0].fireEvent('Refresh');
            },
        })
    },

    /**
     * @author Carlin Guillaume
     * @date 28/03/2023
     * @description Permet de crée le formulaire de suppression d'un signataire
     */
    DelUser: function () {
        var oMe = this;
        var oForm = oMe.getView();
        var RSC_ID = oForm.query('#eqpGrid')[0].getSelectionModel().selected.items[0].get('RSC_ID');
        var FPS_ID = oForm.query('#eqpGrid')[0].getSelectionModel().selected.items[0].get('FPS_ID');
        var RSC_CODE = oForm.query('#eqpGrid')[0].getSelectionModel().selected.items[0].get('RSC_CODE');
        var FPS_code = oForm.query('#fpsGrid')[0].getSelectionModel().selected.items[0].get('FPS_CODE');

        var Usr_Id = oForm.query('#personneGrid')[0].getSelectionModel().selected.items[0].get('USR_ID');
        var Usr_Nom = oForm.query('#personneGrid')[0].getSelectionModel().selected.items[0].get('NOM');

        oWin = Thot.app.openWidget('createfps', {
            title: 'Supprimer signataire',
            alias: 'newfps',
            modal: true,
            resizable: false,
            height: 150,
            width: 600,
            param: {
                custom: {
                    Page: 'deluser',
                    rsc_id: RSC_ID,
                    fps_id: FPS_ID,
                    rsc_code: RSC_CODE,
                    fps_code: FPS_code,
                    usr_id: Usr_Id,
                    usr_nom: Usr_Nom
                }
            },
        })

        oWin.on({
            destroy: function () {
                oForm.query('#personneGrid')[0].fireEvent('Refresh');
            },
        })
    },

});