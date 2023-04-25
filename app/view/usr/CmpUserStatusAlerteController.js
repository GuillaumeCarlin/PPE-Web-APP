Ext.define('Thot.view.usr.CmpUserStatusAlerteController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.usr-cmpuserstatusalerte',
    /**
     * @author : Hervé VALOT
     * @date   : 2019-12-05
     * @Description après rendu du formulaire
     *              mise à jour du compteur d'incohérences
     *              mise à jour de la date d'actualisation (lecture BDD)
     *              afficher/masquer le formulaire en fonction du nombre d'incohérences
     *
     * @version 2019-12-05 HVT  Création
     */
    onAfterRender: function () {
        const oForm = this.getView(),
            // oNbInco = oForm.query('#nbInco')[0],
            oDateUpdate = oForm.query('#dateupdate')[0],
            oUserStatusErrorGrd = oForm.query('#grdUserAlerte')[0],
            oUserStatusErrorStr = oUserStatusErrorGrd.getStore();
        var iCount = 0,
            dDateActualisation = '';

        oUserStatusErrorStr.on({
            load: function (oStore, aRecords) {
                // comptabiliser le store
                iCount = oUserStatusErrorStr.getCount();
                // oNbInco.setValue(iCount);
                if (iCount == 0) {
                    // cacher le volet si le compteur est à 0
                    oForm.setHidden(true);
                } else {
                    // l'afficher si il est supérieur à 0
                    oForm.setHidden(false);
                    // le déployer si il était plié
                    oForm.setCollapsed(false);
                    // récupérer la date d'actualisation pour l'afficher
                    dDateActualisation = new Date(aRecords[0].data.usp_datemiseajour).toLocaleString('fr-FR');
                    oDateUpdate.setValue(dDateActualisation);
                    // conditions de vérification
                    oForm.query('#chk_activite_plannning')[0].setValue((parseInt(aRecords[0].data.chk_activite_plannning) == 0 ? 'désactivé' : 'activé'));
                    oForm.query('#chk_pointage_activite')[0].setValue((parseInt(aRecords[0].data.chk_pointage_activite) == 0 ? 'désactivé' : 'activé'));
                    oForm.query('#chk_pointage_planning')[0].setValue((parseInt(aRecords[0].data.chk_pointage_planning) == 0 ? 'désactivé' : 'activé'));
                    // mettre à jour le compteur d'utilisateur en statut oncoherent
                    oForm.setTitle('<p>Incohérences opérateurs<thot-sticky class="usr-inconsistency" data-qtip="Nombre d\'incohérences utilisateur en cours." data-qalign="tr-br">' + oUserStatusErrorStr.count() + '</thot-sticky>');
                }
            }
        });
    },
    /**
     * @author : Hervé VALOT
     * @date   : 2019-12-05
     * @Description Déclenchée par l'événement 'gridRefresh'
     *
     * @version 2019-12-05 HVT  Création
     */
    onGridRefresh: function (aFilter) {
        const oForm = this.getView(),
            oUserAlertGrd = oForm.query('#grdUserAlerte')[0],
            oUserAlertStr = oUserAlertGrd.getStore();
        // mise à jour du filtre (on passe la liste des sections supervisées)
        oUserAlertStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });
        // on vide le store
        oUserAlertStr.removeAll();
        // on le recharge
        oUserAlertStr.load();
        // this.gridRefresh();
    },
    /**
     * @author      Hervé Valot
     * @date        2019-12-05
     * @description Rafraichissement de la grille
     * @version 2019-12-05 HVT  Création
     */
    gridRefresh: function () {
        const oForm = this.getView(),
            oUserAlertGrd = oForm.query('#grdUserAlerte')[0],
            oUserAlertStr = oUserAlertGrd.getStore();
        // on vide le store
        oUserAlertStr.removeAll();
        // on le recharge
        oUserAlertStr.load();
    }
});