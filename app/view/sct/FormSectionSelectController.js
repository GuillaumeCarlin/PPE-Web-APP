Ext.define('Thot.view.sct.FormSectionSelectController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sct-formsectionselect',
    /**
     * @author : edblv
     * date   : 27/05/16 11:47
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Afterrender du formulaire
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        var oWin = oForm.up('window');
        var oSocietyCbo = oForm.query('#society')[0];
        var oSocietyStr = oSocietyCbo.getStore();
        var oSiteCbo = oForm.query('#site')[0];
        var oSiteStr = oSiteCbo.getStore();
        var oSectionPck = oForm.query('#section')[0];
        var oSectionTvw = oSectionPck.getPicker();
        var sCurrentSection = localStorage.getItem('currentSection');

        oSocietyStr.on({
            load: function () { }
        })
        /*
         * Ca reviendra plus tard
        oSiteStr.on({
            load: function(oStore) {
                oStore.insert(0, [
                    {
                        org_id: 0,
                        sit_rang: 0,
                        sit_code: '',
                        org_libelle: 'Tout',
                        org_description: ''
                    }
                ]);
            }
        })
        */

        oForm.currentSection = {
            idsociete: 1,
            idsite: 2,
            idsection: 3,
            label: {
                society: 'Atelier 1',
                site: 'CHAP',
                section: 'FV'
            }
        };

        if (sCurrentSection !== null) {
            oForm.currentSection = Ext.decode(sCurrentSection);
        }

        oWin.returnValue = oForm.currentSection;

        oSectionTvw.setStore(Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            root: {
                name: 'Section',
                expanded: true
            },
            proxy: {
                type: 'ajax',
                url: 'server/sct/Societe.php?action=SectionTV',
                reader: {
                    type: 'json',
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeLoad: function (oStore, oParam) {
                    oStore.getProxy().extraParams.appName = Thot.app.appConfig.name;
                }
            }
        }));

        if (oForm.currentSection.idsociete > 0) {
            oMe.siteCboFilter(oForm.currentSection.idsociete);
            oSocietyCbo.setValue(oForm.currentSection.idsociete);
            oSocietyCbo.textValue = oForm.currentSection.label.society;
        }

        if (oForm.currentSection.idsite > 0) {
            oMe.sectionPckFilter(oForm.currentSection.idsite, true);
            oSiteCbo.setValue(oForm.currentSection.idsite);
            oSiteCbo.textValue = oForm.currentSection.label.site;
        }
    },
    /**
     * @author : edblv
     * date   : 30/05/16 11:36
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Selection dans la combo 'Société'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onSocietySel: function (oCombo, oItem) {
        var oMe = this;
        var oForm = this.getView();
        var oSectionPck = oForm.query('#section')[0];
        var oSectionTvw = oSectionPck.getPicker();
        var oSectionStr = oSectionTvw.getStore();
        oSectionStr.removeAll();
        oSectionPck.idValue = 0;
        oSectionPck.textValue = '';
        oSectionPck.setRawValue('');
        oCombo.textValue = oItem.get(oCombo.getDisplayField());
        oMe.siteCboFilter(oItem.get('org_id'));
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
    siteCboFilter: function (iIdSociety) {
        var oMe = this;
        var oForm = this.getView();
        var oSiteCbo = oForm.query('#site')[0];
        var oSiteStr = oSiteCbo.getStore();
        var aFilter = [{
            type: 'org_id',
            value: iIdSociety
        }];

        oSiteCbo.setValue(0);
        oSiteStr.removeAll();
        oSiteStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oSiteStr.load();
    },
    /**
     * @author : edblv
     * date   : 30/05/16 17:45
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Selection d'un site
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onSiteSel: function (oCombo, oItem) {
        var oMe = this;
        var oForm = this.getView();
        oCombo.textValue = oItem.get(oCombo.getDisplayField());
        oMe.sectionPckFilter(oItem.get('org_id'));
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
    sectionPckFilter: function (iIdSite) {
        var oMe = this;
        var oForm = this.getView();
        var oSectionPck = oForm.query('#section')[0];
        var oSectionTvw = oSectionPck.getPicker();
        var oSectionStr = oSectionTvw.getStore();
        var bSelectCurrent = false;
        var aFilter = [];

        if (arguments.length > 1) {
            bSelectCurrent = arguments[1];
        }

        oSectionStr.removeAll();
        oSectionPck.idValue = 0;
        oSectionPck.textValue = '';
        oSectionPck.setRawValue('');

        aFilter.push({
            type: 'org_id',
            value: iIdSite
        });

        if (bSelectCurrent) {
            aFilter.push({
                type: 'checkcurr',
                value: oForm.currentSection.idsection
            });
        }

        oSectionStr.getProxy().extraParams.specfilter = Ext.encode(aFilter);

        oSectionStr.on({
            load: function (oStore, aRecords) {
                if (aRecords.length > 0) {
                    oSectionTvw.getSelected();
                }
            }
        });

        oSectionStr.load();

    },
    /**
     * @author : edblv
     * date   : 31/05/16 13:53
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Validation'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    validSelect: function () {
        var oMe = this;
        var oForm = this.getView();
        var oWin = oForm.up('window');
        var oSocietyCbo = oForm.query('#society')[0];
        var oSiteCbo = oForm.query('#site')[0];
        var oSectionPck = oForm.query('#section')[0];

        oWin.returnValue = {
            idsociete: oSocietyCbo.getValue(),
            idsite: oSiteCbo.getValue(),
            idsection: oSectionPck.idValue,
            label: {
                society: oSocietyCbo.textValue,
                site: oSiteCbo.textValue,
                section: oSectionPck.textValue
            }
        };

        oWin.close();
    },
    /**
     * @author : edblv
     * date   : 06/06/16 10:45
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur 'Annuler'
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onCancelClick: function () {
        var oMe = this;
        var oForm = this.getView();
        var oWin = oForm.up('window');
        oWin.close();
    }
});