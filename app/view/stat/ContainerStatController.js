Ext.define('Thot.view.stat.ContainerStatController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-containerstat',


    onAfterRender: function () {
        var oForm = this.getView();

        this._getToleranceParametre();
        this._getDate();

        oForm.query('#ListeEquipe')[0].fireEvent('afterrender');
        oForm.query('#ListeUser')[0].fireEvent('afterrender');
    },


    onGridsRefresh: function () {
        aFilter = this._getFilter();
        aFilterA = this._getFilterAlerte();

        aFilter.push({type: 'parametre', value: 'Manuel'})

        var oForm = this.getView(),
        oStatEquipe = oForm.query('#ListeEquipe')[0].query('#ListeEquipe')[0];
        oStatPersonne = oForm.query('#ListeUser')[0].query('#ListeUser')[0];

        oAlerteC = oForm.query('#ListAlerte')[0].query('#ListeAlerteC')[0];
        oAlerteM = oForm.query('#ListAlerte')[0].query('#ListeAlerteM')[0];

        oStatPersonne.fireEvent('refresh', aFilter);
        oStatEquipe.fireEvent('refresh', aFilter);

        oAlerteC.fireEvent('refresh', aFilterA);
        oAlerteM.fireEvent('refresh', aFilterA);
        
        this.getView().query('#ListeUser')[0].query('#InformationPersonneSheetA')[0].getStore().loadData([],false);
        this.getView().query('#ListeUser')[0].query('#InformationPersonneSheetD')[0].getStore().loadData([],false);

        oForm = this.getView().query('#ListeUser')[0];
        oForm.query('#Nom')[0].setValue('');
        oForm.query('#Equipe')[0].setValue('');
        oForm.query('#Poste')[0].setValue('');
        oForm.query('#Atelier')[0].setValue('');
        oForm.query('#tempsexiger')[0].setValue('');
        oForm.query('#tempspointe')[0].setValue('');
        oForm.query('#Img')[0].setSrc('');
        oForm.query('#date')[0].setValue('');
    },


    onClick: function(){
        aFilter = this._getFilter()
        aFilter.push({type: 'parametre', value: 'Manuel'})

        oStatEquipe = this.getView().query('#ListeEquipe')[0].query('#ListeEquipe')[0],
        oStatEquipe.fireEvent('refresh', aFilter);

        oStatPersonne = this.getView().query('#ListeUser')[0].query('#ListeUser')[0],
        oStatPersonne.fireEvent('refresh', aFilter);
        },


    onApplyClick: function(){
        aFilter = this._getFilter()
        aFilter.push({type: 'parametre', value: 'Manuel'})
        
        oStatEquipe = this.getView().query('#ListeEquipe')[0].query('#ListeEquipe')[0],
        oStatEquipe.fireEvent('refresh', aFilter);

        oStatPersonne = this.getView().query('#ListeUser')[0].query('#ListeUser')[0],
        oStatPersonne.fireEvent('refresh', aFilter);
    },


    onDateSelect: function () {

        aFilter = this._getFilter()
        aFilter.push({type: 'parametre', value: 'Manuel'})

        oStatEquipe = this.getView().query('#ListeEquipe')[0].query('#ListeEquipe')[0];
        oStatEquipe.fireEvent('refresh', aFilter);

        oStatPersonne = this.getView().query('#ListeUser')[0].query('#ListeUser')[0];
        oStatPersonne.fireEvent('refresh', aFilter);

        oStatActivite = this.getView().query('#ListeUser')[0].query('#InformationPersonneSheetA')[0];
        oStatActiviteD = this.getView().query('#ListeUser')[0].query('#InformationPersonneSheetD')[0];

        oStatActivite.getStore().loadData([],false);
        oStatActiviteD.getStore().loadData([],false);

        oForm = this.getView().query('#ListeUser')[0];
        oForm.query('#Nom')[0].setValue('');
        oForm.query('#Equipe')[0].setValue('');
        oForm.query('#Poste')[0].setValue('');
        oForm.query('#Atelier')[0].setValue('');
        oForm.query('#tempsexiger')[0].setValue('');
        oForm.query('#tempspointe')[0].setValue('');
        oForm.query('#Img')[0].setSrc('');
        oForm.query('#date')[0].setValue('');
    },


    onDateSelectAlerte: function () {
        var aFilter = this._getFilterAlerte();

        oAlerteM = this.getView().query('#ListAlerte')[0].query('#ListeAlerteM')[0],
        oAlerteM.fireEvent('refresh', aFilter);

        oAlerteC = this.getView().query('#ListAlerte')[0].query('#ListeAlerteC')[0],
        oAlerteC.fireEvent('refresh', aFilter);
    },


    _getToleranceParametre: function () {
        oForm = this.getView();
        Ext.Ajax.request({
            url: 'server/stat/Statistique.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'getToleranceParam',
            },
            async: 'false',
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);
                if (oBack.success) {
                    oForm.query('#toleranceMax')[0].setValue(oBack.liste[0].tolerancemax);
                    oForm.query('#toleranceMin')[0].setValue(oBack.liste[0].tolerancemin);                    
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', oBack.errorMessage.message);
                }
            }
        });
    },

    _getDate: function(){
        oForm = this.getView();
        Ext.Ajax.request({
            url: 'server/stat/Statistique.php',
            params: {
                appName: Thot.app.appConfig.name,
                action: 'getDate',
            },
            async: 'false',
            success: function () {},
            failure: function () {},
            callback: function (opt, success, oResponse) {
                var oBack = Ext.decode(oResponse.responseText);   
                if (oBack.success) {
                    var DateTest = oBack.liste[0].date.toString()
                    var DateInitialiser = DateTest[6] + DateTest[7] + '/' + DateTest[4] + DateTest[5] + '/' + DateTest[0] + DateTest[1] + DateTest[2] + DateTest[3];
                    oForm.query('#datefield')[0].setValue(DateInitialiser);
                    oForm.query('#DateFieldReglage')[0].setValue(DateInitialiser);
                    oForm.query('#datefield')[0].setMaxValue(DateInitialiser);
                    oForm.query('#DateFieldReglage')[0].setMaxValue(DateInitialiser);
                } else {
                    var oMsg = Thot.app.MessageInfo();
                    oMsg.init(5000);
                    oMsg.msg('error', oBack.errorMessage.message);
                }
            }
        });
    },


    _getFilter: function() {
        var oForm = this.getView();
        Liste = oForm.query('#datefield')[0].rawValue.split('/');
        var vDate = Liste[2] + Liste[1] + Liste[0];
        var vToleranceMax = oForm.query('#toleranceMax')[0].getValue();
        var vToleranceMin = oForm.query('#toleranceMin')[0].getValue();
        var vShowDelete = oForm.query('#btnShowSuppressedStat')[0].pressed;
        var vSection = Thot.app.getSection().idsection;

        var aFilter = [{
            type: 'date',
            value: vDate 
        },{
            type: 'ToleranceMax',
            value: vToleranceMax
        },{
            type: 'ToleranceMin',
            value: vToleranceMin
        },{
            type: 'ShowDelete',
            value: vShowDelete
        },{
            type: 'org',
            value: vSection
        }]
        return aFilter;
    },


    _getFilterAlerte: function(){
        var oForm = this.getView();
        Liste = oForm.query('#DateFieldReglage')[0].rawValue.split('/');
        var vDate = Liste[2] + Liste[1] + Liste[0];
        var vSection = Thot.app.getSection().idsection;

        var aFilter = [{
            type: 'date',
            value: vDate 
        },{
            type: 'org',
            value: vSection
        }]
        return aFilter;
    }

});