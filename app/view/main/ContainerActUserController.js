Ext.define('Thot.view.main.ContainerActUserController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-containeractuser',

    /**
     * @author : Hervé VALOT
     * date   : 2019-12-04
     * @Description
     * Rafraichit toute les grilles du formulaire
     *
     * @version 2019-12-04 HVT création
     */
    onGridsRefresh: function (aFilter) {
        var oForm = this.getView(),
            oCurrentAct = oForm.query('#currentactivities')[0],
            oUserIncoherence = oForm.query('#userstatusalerte')[0];

        //---- Act. en cours, on déclenche l'événement sur le composant
        oCurrentAct.fireEvent('gridRefresh', aFilter);
        // on déclenche l'événement de mise à jour de l agrille des incohérences utilisateur
        oUserIncoherence.fireEvent('gridRefresh', aFilter);

    },
});