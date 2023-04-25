Ext.define('Thot.view.adm.cmp.CmpMgrActivityCombineController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.adm-cmp-cmpmgractivitycombine',

    /**
     * @author  Hervé Valot
     * @date    20190417
     * @description ajoute un enregistrement dans la grille
     */
     onAddClick: function () {
         var view = this.getView(),
             rec = new Thot.model.adm.ActCombineM({
                 rsc_id: '',
                 epe_id_membre1: '',
                 epe_id_membre2: '',
             });

         view.store.insert(0, rec);
         view.findPlugin('cellediting').startEdit(rec, 0);
     }
});
