Ext.define('Thot.view.usr.CmpTeamStatusController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.usr-cmpteamstatus',
    /**
     * @author : edblv
     * date   : 07/09/16 17:03
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Afterrender du composant
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onAfterRender: function () {
        var oMe = this;
        var oForm = this.getView();
        var oNbPresents = oForm.query('#nbPresents')[0];
        var oNbActifs = oForm.query('#nbActifs')[0];
        var oNbInco = oForm.query('#nbInco')[0];
        var oNbTotal = oForm.query('#nbTotal')[0];
        var oTeamStatGrd = oForm.query('#grdTeamStatus')[0];
        var oTeamStatStr = oTeamStatGrd.getStore();

        oTeamStatStr.on({
            load: function (oStore, aRecords) {
                var iNbPresents = 0;
                var iNbActifs = 0;
                var iNbInco = 0;

                for (var iRec in aRecords) {
                    if (aRecords[iRec].get('presence').toLowerCase() == 'in') {
                        iNbPresents++;
                    }

                    if (parseInt(aRecords[iRec].get('nbactiviteencours'), 10) > 0) {
                        iNbActifs++;
                    }

                    if (parseInt(aRecords[iRec].get('coherence'), 10) < 1) {
                        iNbInco++;
                    }
                }

                oNbPresents.setValue(iNbPresents);
                oNbActifs.setValue(iNbActifs);
                oNbInco.setValue(iNbInco);
                oNbTotal.setValue(aRecords.length);
            }
        });
    },
    /**
     * @author : edblv
     * date   : 07/09/16 17:03
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Refresh de la grille
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onGridRefresh: function (aFilter) {
        var oMe = this;
        var oForm = this.getView();
        var oTeamStatGrd = oForm.query('#grdTeamStatus')[0];
        var oTeamStatStr = oTeamStatGrd.getStore();
        //---- Application du filtre
        oTeamStatStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        oMe.gridRefresh();
    },

    /**
     * @author : edblv
     * date   : 08/09/16 11:44
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Raffraichissement de la grille
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    gridRefresh: function () {
        var oMe = this;
        var oForm = this.getView();
        var oTeamStatGrd = oForm.query('#grdTeamStatus')[0];
        var oTeamStatStr = oTeamStatGrd.getStore();

        oTeamStatStr.removeAll();
        oTeamStatStr.load();
    },
    /**
     * @author : edblv
     * date   : 13/09/16 10:40
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Clic sur une ligne de la grille
     *
     * @version JJMMAA edblv RND#ND-ND.ND Création
     */
    onItemClick: function (oGrid, oRecord) {
        var oMe = this;
        var oForm = this.getView();
        var oUserActPnl = oForm.query('#userAct')[0];
        var oUserActGrd = oUserActPnl.query('#grdUserAct')[0];
        var oUserAleaGrd = oUserActPnl.query('#grdUserAlea')[0];
        var oUserActStr = oUserActGrd.getStore();
        var oUserAleaStr = oUserAleaGrd.getStore();
        var oUserFst = oUserActPnl.query('#userdet')[0];
        //		var sUserFstTitle = '<span class="x-fa fa-sign-in fa-2x icon-green">&nbsp;</span>';
        var sUserFstPresence = 'thot-icon-logedin-large';
        var oUserTpl = new Ext.Template([
            '<span style="width: 92px;" class="{clsPresence}">&nbsp;</span><span class="{cls}"></span><br>',
            '<div class="thot-card-user"> <div class="img" style="background-image: url(\'resources/images/{usr_photo}\')"></div>',
            '<div class="content thot-bold-label">{usr_prenom} {usr_nom}</div>',
            '</div>',

            '<table>',
            '<tr>',
            '<td class="" style="font-weight: bold; text-align: right">Atelier :</td>',
            '<td>{org_libelle}</td>',
            '</tr>',
            '<tr>',
            '<td class="" style="font-weight: bold; text-align: right">Equipe :</td>',
            '<td>{eps_libelle}</td>',
            '</tr>',
            '<tr>',
            '<td class="" style="font-weight: bold; text-align: right">Horaire :</td>',
            '<td>',
            '<span><a class="thot-icon-logedin-small">&nbsp;</a>{rh_heuredebut_hms} </span > ',
            '<span><a class="thot-icon-logedout-small">&nbsp;</a>{rh_heurefin_hms}</span>',
            '</td>',
            '</tr>',
            '</table>',
            '{message_incoherence}'
        ]);
        var oUserTpl2 = new Ext.Template([
            ' <div class="flags">',
            '    <div class = "flag {clsPresence}"></div>',
            '    <div class = "flag {cls}"></div>',
            '    <div class = "flag">dev3</div>',
            '    <div class = "flag">dev4</div>',
            '  </div>',
            '  <div class = "usrimage" style = "background-image: url(\'resources/images/{usr_photo}\')"></div>',
            '  <div class = "data">',
            '    <div class = "content thot-bold-label">{usr_prenom} {usr_nom}</div>',
            '    <div>{org_libelle}</div>',
            '    <div>{eps_libelle}</div>',
            '    <div>',
            '        <a class="thot-icon-logedin-small"></a>{rh_heuredebut_hms}',
            '        <a class="thot-icon-logedout-small"></a>{rh_heurefin_hms}',
            '    </div>',
            '    {message_incoherance}',
            '  </div>'
        ]);

        var aFilter = [];

        oUserActPnl.expand();
        //---- Mise à jour du titre du fieldset Opérateur
        if (oRecord.get('presence').toLowerCase() == 'out') {
            //			sUserFstTitle = '<span class="x-fa fa-sign-out fa-2x icon-red">&nbsp;</span>';
            sUserFstPresence = 'thot-icon-logedout-large';
        }

        //		sUserFstTitle = 'Opérateur';
        //		oUserFst.setTitle('');

        // définir les erreurs si il y en a
        var s_message_incoherence = "";
        if (oRecord.get('coherence') < 1) {
            s_message_incoherence = '<ul style="color: #d50000; border-left: 5px solid #d50000; background: #ffd5d5; padding-top: 5px; padding-bottom: 5px;">';

            // si presence_plagehoraire = 1 et presence_pointage = 0
            if (oRecord.get('presence_plagehoraire') == 1 && oRecord.get('presence_pointage') == 0) {
                // alors message = 'Opérateur absent dans la plage horaire de présence théorique.'
                s_message_incoherence += '<li>Opérateur absent dans la plage horaire de présence théorique.</li>';
            }

            // si presence_plagehoraire = 0 et presence_pointage = 1
            if (oRecord.get('presence_plagehoraire') == 0 && oRecord.get('presence_pointage') == 1) {
                // alors message = 'Opérateur présent en dehors de la plage horaire de présence théorique.'
                s_message_incoherence += '<li>Opérateur présent en dehors de la plage horaire de présence théorique.</li>';
            }

            // si presence_plagehoraire = 1 et nbactiviteencours = 0
            if (oRecord.get('presence_plagehoraire') == 1 && oRecord.get('nbactiviteencours') == 0) {
                // alors message = 'Opérateur présent en dehors de la plage horaire de présence théorique.'
                s_message_incoherence += '<li>Opérateur inactif dans la plage horaire de présence théorique.</li>';
            }

            // presence_pointage = 0 et nbactiviteencours > 0
            if (oRecord.get('presence_pointage') == 0 && oRecord.get('nbactiviteencours') > 0) {
                // message = 'Activité en cours sur opérateur absent.'
                s_message_incoherence += '<li>Activité en cours sur opérateur absent.</li>';
            }

            // presence_pointage = 1 et nbactiviteencours = 0
            if (oRecord.get('presence_pointage') == 1 && oRecord.get('nbactiviteencours') == 0) {
                // message = 'Opérateur présent inactif.'
                s_message_incoherence += '<li>Opérateur présent inactif.</li>';
            }

            // presence_theorique = 0 et nbactiviteencours > 0
            if (oRecord.get('presence_theorique') == 0 && oRecord.get('nbactiviteencours') > 0) {
                // message = 'Activité en cours hors plage horaire de présence théorique.'
                s_message_incoherence += '<li>Activité en cours hors plage horaire de présence théorique.</li>';
            }
            s_message_incoherence += '</ul>';
        }

        //---- Mise à jour du contenu du fieldset Opérateur
        oUserFst.update(oUserTpl.apply({
            cls: oRecord.get('coherence') < 1 ? 'thot-icon-inconsistency-large' : '',
            clsPresence: sUserFstPresence,
            usr_nom: oRecord.get('usr_nom'),
            usr_prenom: oRecord.get('usr_prenom'),
            org_libelle: oRecord.get('org_libelle'),
            eps_libelle: oRecord.get('eps_libelle'),
            rh_heuredebut_hms: oRecord.get('rh_heuredebut_hms'),
            rh_heurefin_hms: oRecord.get('rh_heurefin_hms'),
            message_incoherence: s_message_incoherence,
            usr_photo: oRecord.get('usr_photo')

        }));

        // vider le store des grilles activités et aléas
        oUserActStr.removeAll();
        oUserAleaStr.removeAll();

        //if (oRecord.get('nbactiviteencours') > 0) {
        aFilter.push({
            type: 'usr_id',
            value: oRecord.get('usr_id')
        });

        //---- MAJ grille activités
        oUserActStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        oUserActStr.load();

        //---- MAJ grille aléas
        oUserAleaStr.setExtraParams({
            storefilters: {
                specfilter: aFilter
            }
        });

        oUserAleaStr.load();
        //}
    }
});