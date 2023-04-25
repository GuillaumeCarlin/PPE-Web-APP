Ext.define('Thot.overrides.GridPanel', {
    override: 'Ext.grid.Panel',
    gridconfigver: 2,
    filter: 'local',
    aFilters: [],
    viewConfig: {
        emptyText: '<div class="emptyText">Aucune donnée</div>',
        deferEmptyText: false
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
    refresh: function () {
        var oMe = this;
        var oStore = oMe.getStore();
        //oStore.removeAll();
        oStore.load();
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
    getSortConfig: function () {
        var me = this;
        var oStore = me.getStore();
        var aSort = [];

        for (var iIndItm = 0; iIndItm < oStore.sorters.items.length; iIndItm++) {
            aSort[aSort.length] = {
                property: oStore.sorters.items[iIndItm].property,
                direction: oStore.sorters.items[iIndItm].direction,
                root: oStore.sorters.items[iIndItm].root == 'undefined' ? 'data' : oStore.sorters.items[iIndItm].root
            };
        }

        return aSort;
    },
    applySortConfig: function (oSavedConfig) {
        var oStore = this.getStore();
        var oConfig = {};
        var aSort = {};
        var oHeaders = this.getView().getHeaderCt();
        var aColumns = oHeaders.getGridColumns(true);

        if (oSavedConfig !== null) {
            if (oSavedConfig.length > 0) {
                var oGridConfig = Ext.decode(oSavedConfig[0].contenudetails);

                if (oGridConfig.version) {
                    //---- Si la propriété version existe et si elle a la même valeur que
                    // gridconfigver de l'override FormPanel, on applique la config
                    if (oGridConfig.version == this.gridconfigver) {
                        oConfig = oGridConfig.config;

                        for (var sGridName in oConfig) {
                            if (sGridName == this.itemId) {
                                aSort = oConfig[sGridName].sort;
                            }
                        }
                    }
                }
            }
        }

        //---- Application des sorters
        if (aSort.length > 0) {
            oStore.sort(aSort);
            //oStore.getProxy().setExtraParam('sort',Ext.encode(aSort));
        }
    },
    addEmptyRow: function (oRowValue) {
        var oStore = this.getStore();
        var oProxy = oStore.getProxy();
        var oModel = oProxy.getModel();
        var oRow = Ext.create(oProxy.model.modelName, oRowValue);

        oStore.insert(0, oRow);
    },
    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Efface le filtre appliqué à une colonne
     * @param {objet} oColumn Column sur laquelle le bouton 'Effacer' à été cliqué
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    clearColumnFilter: function (oColumn) {
        var oMe = this;
        var aButtons = oColumn.items.items;
        var bApplyFlt = true;

        if (aButtons.length > 0) {
            if (arguments.length > 1) {
                bApplyFlt = arguments[1];
            }

            delete oMe.aFilters[oColumn.dataIndex];
            //aButtons[0].cls='FilterBtnOff';
            aButtons[1].setHidden(true);

            if (bApplyFlt) {
                oMe.applyFilters();
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
    clearFilters: function () {
        var oMe = this;
        var oColumnMgr = oMe.columnManager;
        var aColumnsHdr = oColumnMgr.headerCt.gridDataColumns;
        var aColumns = [];

        if (oColumnMgr.secondHeaderCt) {
            var aColumnsSHdr = oColumnMgr.secondHeaderCt.gridDataColumns;
            aColumns = aColumnsHdr.concat(aColumnsSHdr);
        } else {
            aColumns = aColumnsHdr;
        }

        for (var iCol in aColumns) {
            oMe.clearColumnFilter(aColumns[iCol], false);
        }

        //---- Pour être totalement sûr que tous les filtres sont bien supprimés,
        // je réinitialise le tableau
        oMe.aFilters = [];
        oMe.applyFilters();
    },

    /**
     * @author : edblv
     * date   : 20/05/16 16:11
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Applique tous les filtres définis sur les colonnes de la grid
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    applyFilters: function () {
        if (this.filter == 'local') {
            this.localFilters();
        } else {
            this.remoteFilter();
        }
    },
    /**
     * @author : edblv
     * date   : 01/07/16 08:09
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Recharge le store avec les filtres définis sur les colonnes
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    remoteFilter: function () {
        var oMe = this;
        var oGridPager = oMe.down('pagingtoolbar');
        var oStore = oMe.getStore();
        var aFilter = [];

        for (var sItem in oMe.aFilters) {
            aFilter.push({
                type: sItem,
                value: oMe.aFilters[sItem][0].value
            });
        }

        oStore.setExtraParams({
            storefilters: {
                specfilter: aFilter,
                filter: []
            }
        });
        oStore.load();

        if (oGridPager) {
            oGridPager.bindStore(oStore);
        }
    },
    /**
     * @author : edblv
     * date   : 01/07/16 08:21
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Filtre le store en local
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    localFilters: function () {
        var oMe = this;
        var oStore = oMe.getStore();
        var aColumns = oMe.getColumns();
        var sColumn = '';
        var oTestFilter = new Ext.util.Filter({
            filterFn: function (oItem) {
                var bAccept = true;
                var bMatch = true;

                for (var sColumn in oMe.aFilters) {
                    for (var iInd in oMe.aFilters[sColumn]) {
                        bMatch = oMe.testValue(
                            oItem,
                            oMe.aFilters[sColumn][iInd]
                        );

                        if (!bMatch) {
                            bAccept = false;
                        }
                    }
                }

                return bAccept;
            }
        });

        for (var iCol in aColumns) {
            sColumn = aColumns[iCol].dataIndex;

            if (oMe.aFilters[sColumn]) {
                aColumns[iCol].setStyle({
                    backgroundColor: '#E8F6FA',
                    backgroundImage: 'url(resources/images/16x16/funnel.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center left',
                    paddingLeft: '20px'
                });
            } else {
                aColumns[iCol].setStyle({
                    backgroundColor: '',
                    backgroundImage: '',
                    paddingLeft: '0px'
                });
            }
        }

        oStore.filter(oTestFilter);
    },
    /**
     * @author : edblv
     * date   : 01/07/16 11:21
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Effectue les tests de comparaison d'une colonne
     * avec le critère du filtre
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    testValue: function (oItem, oFilter) {
        var oMe = this;
        var oForm = this.getView();
        var aFields = oFilter.fieldname.split(',');
        var uFieldValue = null;
        var uFilterValue = oFilter.value;
        var iLen = 0;
        var bMatch = false;

        //---- Compare la ou les valeur(s) du ou des champ(s) avec le fitre
        // Généralement sur un seul champ mais si la propriété fields du filter
        // est renseignée, sur les champs indiqués dans fields
        // Il suffit qu'un des champs match pour qu'on accepte la valeur
        for (var iInd in aFields) {
            uFieldValue = oItem.get(aFields[iInd]);

            switch (oFilter.operator) {
                case 'in':
                    if (uFieldValue.toLowerCase().indexOf(uFilterValue) > -1) {
                        bMatch = true;
                    }
                    break;
                case 'start':
                    iLen = uFilterValue.length;
                    if (uFieldValue.toLowerCase().substr(0, iLen) == uFilterValue) {
                        bMatch = true;
                    }
                    break;
                case 'eq':
                    if (uFieldValue == uFilterValue) {
                        bMatch = true;
                    }
                    break;
                case 'gteq':
                    if (uFieldValue >= uFilterValue) {
                        bMatch = true;
                    }
                    break;
                case 'lteq':
                    if (uFieldValue <= uFilterValue) {
                        bMatch = true;
                    }
                    break;
            }
        }

        return bMatch;
    },

    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Ajoute un item dans le menu contextuel de la grid
     *
     * @version JJ/MM/AA edblv RND#ND-ND.ND Création
     */
    addMenuItem: function (oNewItem) {
        var iPos = null;

        if (arguments.length > 1) {
            iPos = arguments[1];

            if (iPos > this.menuitems.length) {
                iPos = this.menuitems.length;
            }
        } else {
            iPos = this.menuitems.length;
        }

        this.menuitems.splice(iPos, 0, oNewItem);
    },
    /**
     * @author : edblv
     * date   : 24/06/14 10:43
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Affichage du menu contextuel de la grid courante
     *
     * @version 24/06/14 edblv RND#ND-ND.ND Création
     */
    showMenu: function (oView, oRecord, oItem, iIndex, oEvent, oOpt) {
        var aXy = oEvent.getXY();

        if (!this.contextmenu) {
            this.contextmenu = Ext.create('Ext.menu.Menu', {
                items: this.menuitems
            });
        }

        this.contextmenu.grid = this;
        this.contextmenu.record = oRecord;
        this.contextmenu.showAt(aXy);
    },
    /**
     * @author : edblv
     * date   : 19/12/14 09:50
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Retourne un tableau contenant la liste des valeurs d'une colonne
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     * @argument {string} sColumn Nom de la colonne dont on veut connaître les valeurs
     */
    getColumnValues: function (sColumn) {
        var oStore = this.store;
        var aData = oStore.data.items;
        var aValues = [];
        var iIndRec = 0;

        for (iIndRec = 0; iIndRec < aData.length; iIndRec++) {
            aValues.push(aData[iIndRec].data[sColumn]);
        }

        return aValues;
    },
    /**
     * @author : edblv
     * date   : 03/10/16 12:02
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Retourne l'index d'une colonne
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    getColumnIndex: function (sName) {
        var aColumns = this.getColumns()
        var iInd = -1;

        for (var iCol in aColumns) {
            if (aColumns[iCol].dataIndex == sName) {
                iInd = iCol;
            }
        }

        return iInd;
    },

    /**
     * @author : edblv
     * date   : 03/03/15 15:50
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Retourne les valeurs d'une colonne dans la plage des items sélectionnés
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    getSelectedColumn: function (sColumn) {
        var aSelection = this.getSelectionModel().getSelection();
        var aValues = [];
        var iIndRec = 0;

        for (iIndRec = 0; iIndRec < aSelection.length; iIndRec++) {
            aValues.push(aSelection[iIndRec].data[sColumn]);
        }

        return aValues;
    }
});