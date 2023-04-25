/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.application({
    name: "Thot",

    extend: "Thot.Application",

    requires: [
        "Ext.ux.DateTimeField",

        // les libellés de l'application, centralisé dans un singleton
        "Thot.Labels",

        "Thot.view.act.CmpCurrentAct",
        "Thot.view.act.CmpFreeAleas",
        "Thot.view.act.CmpHistoAct",
        "Thot.view.act.CmpQualityAct", //
        "Thot.view.act.CmpRevision",
        // activités : détail
        "Thot.view.act.FormActDet",
        // activités : création
        "Thot.view.act.FormCreateAct",
        "Thot.view.act.FormCreateQualityAct",
        "Thot.view.act.FrmCreateUnplanedAct",
        "Thot.view.act.FrmCreateSettingAct",
        "Thot.view.act.FormFreeAleas",
        // activités : correction
        "Thot.view.act.cor.FormRevision",
        "Thot.view.act.cor.FormRevisionQualite",
        "Thot.view.act.cor.FormRevisionHorsProd",
        "Thot.view.act.cor.FormRevisionNonPlanifie",
        "Thot.view.act.cor.FormRevisionReglage",
        //
        "Thot.view.act.alt.CmpActCard",
        // administration et configuration
        "Thot.view.adm.CmpAdmin",
        "Thot.view.adm.CmpImportExport",
        "Thot.view.adm.CmpReports",
        "Thot.view.adm.CmpRessAttrib",
        "Thot.view.adm.FrmEquipementAlternative",
        // configuration
        "Thot.view.adm.CmpConfigApp",
        "Thot.view.adm.cfg.CmpCfgUsrCheck",
        "Thot.view.adm.cfg.CmpCfgGOM",
        "Thot.view.adm.cfg.CmpCfgMarquage",
        "Thot.view.adm.cfg.CmpCfgUpdateUserPlanning",
        "Thot.view.adm.cfg.CmpCfgTolerance",
        // 'Thot.view.adm.cmp.CmpMgrActivityCombine', // DEV: 2019-04-17 11:50:51 HVT : en cours
        "Thot.view.alr.FormAlertDet",
        "Thot.view.cmp.CmpDetailOf",
        "Thot.view.cmp.CompActDet",
        "Thot.view.cmp.CompActProdDet",
        "Thot.view.main.Main",
        "Thot.view.msg.FormMessageNew",
        "Thot.view.msg.CmpMessageList",
        // 'Thot.view.pck.gridFilter',
        "Thot.view.pck.NumKeyBoard",
        "Thot.view.pck.TreePicker",
        "Thot.view.rpt.CmpRapportOf",
        "Thot.view.sch.CmpSearch",
        "Thot.view.sct.FormSectionSelect",
        "Thot.view.usr.CmpTeamStatus",
        "Thot.view.usr.FormAuth",
        "Thot.view.main.ContainerActUser",
        "Thot.view.usr.CmpUserStatusAlerte",

        "Thot.view.sch.CmpScheduler",

        // Test ajout du composant equipe dans la page Stat
        "Thot.view.stat.CmpListEquipe",
        "Thot.store.stat.StatistiqueListUserS",

        // Ajout du composant sheet dans la page Stat
        "Thot.view.stat.CmpSheetEquipe",
        "Thot.store.stat.StatistiqueSheetUserS",

        // Ajout du composant Information Personne Sheet
        "Thot.store.stat.StatistiqueInformationPersonneSheetS",
        "Thot.store.stat.StatistiqueInformationPersonneSheetDS",
        'Thot.store.stat.StatistiqueInformationPersonneSheetDS',
        // Ajout du Container Statistique
        "Thot.view.stat.ContainerStat",

        // Ajout du Panel Reglage
        "Thot.view.stat.CmpReglage",
        "Thot.store.stat.StatistiqueReglageS",

        //Container API
        "Thot.view.api.ContainerAPI",
        "Thot.store.api.ApiS",
        "Thot.store.api.ApiUpdateS",

        // Formulaire Api
        "Thot.view.api.FormNewKey",
        "Thot.store.api.ApiFormS",

        // Page des fiches FPS
        'Thot.store.adm.FichePSStore',
        'Thot.store.adm.UserFPSStore',
        'Thot.store.adm.EqtFPSStore',
        'Thot.view.adm.FormCreateFPS',
        'Thot.store.adm.FormFPSListUserS',
        'Thot.store.adm.FormInsDelUsrFPSS',
        'Thot.store.adm.FormFPSListEqtS',
        'Thot.store.adm.FormFPSListFpgS',

        'Thot.store.act.ActHistoS',
        'Thot.store.act.ActivitieS',
        'Thot.store.act.ActQtyS',
        'Thot.store.alr.AlertsS',
        'Thot.store.act.EntHistoS',
        'Thot.store.act.FreeAleasS',
        'Thot.store.act.FreeAleasListS',
        'Thot.store.act.QtyTypeS',
        'Thot.store.act.ActivitiesOpnS',
        'Thot.store.act.ActivitiesOpnCslS',
        // 'Thot.store.adm.ActCombineS', // DEV: 2019-04-17 12:18:31 HVT : en cours
        "Thot.store.msg.MessageListS",
        "Thot.store.msg.MessageObjetS",
        "Thot.store.ope.OpCompListS",
        "Thot.store.ope.OfOperListS",
        "Thot.store.ope.OfOperListCslS",
        "Thot.store.ope.OperationsS",
        "Thot.store.ope.OfOperS",
        "Thot.store.ope.OfListS",
        "Thot.store.ope.OpnListS",
        "Thot.store.sct.SectionS",
        "Thot.store.sct.SiteS",
        "Thot.store.usr.ContractS",
        "Thot.store.usr.RolesS",
        "Thot.store.usr.TeamS",
        "Thot.store.usr.UsersMngtS",
        "Thot.store.usr.UsersProdS",
        "Thot.store.usr.UserStatusErrorS",
        "Thot.store.wst.CtrlWorkStnS",
        "Thot.store.wst.WorkStnS",
        "Thot.store.wst.WorkStnOpnS",
        "Thot.store.wst.WorkStnSelectS",
        "Thot.store.adm.EqpReplacementS",
        // fonctions globales de l'application
        "Thot.com.dt.DateTimeCalc",
        "Thot.com.util.Acl"
        //Thot ux
        // 'Thot.ux.form.HorizontalRule'
        // DEV:
    ],
    // The name of the initial view to create. With the classic toolkit this class
    // will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
    // modern toolkit, the main view will be added to the Viewport.
    //
    mainView: "Thot.view.main.Main"

    //-------------------------------------------------------------------------
    // Most customizations should be made to Thot.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------
});
