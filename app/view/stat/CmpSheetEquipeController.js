Ext.define('Thot.view.stat.CmpSheetEquipeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.stat-cmpsheetequipe',

    onAfterRender: function () {
        var oForm = this.getView();
        var oListeEquipe = oForm.query('#ListeEquipe')[0];


        aFilter = [{
           type: 'parametre',
           value: 'Automatique'
        },{
           type: 'ShowDelete',
           value: 'false',
        },{
            type: 'org',
            value: Thot.app.getSection().idsection
        }];
        
        oListeEquipe.getStore().setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oListeEquipe.getStore().load();
    },

    onGridRefresh: function (aFilter) {
        var oMe = this;
        var oForm = oMe.getView();
        var oGridNotes = oForm.query('#ListeEquipe')[0];
        var oGridNotesStore = oGridNotes.getStore()
        oGridNotesStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oGridNotesStore.reload();
    },

    refresh: function(aFilter){
        var oMe = this;
        var oForm = oMe.getView();
        var oGridNotes = oForm.query('#ListeEquipe')[0];
        var oGridNotesStore = oGridNotes.getStore();
        oGridNotesStore.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        oGridNotesStore.reload();
    }
});