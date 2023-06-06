<?php
$aAdmin = [
    'importproclst'             => 'exec s_echange.P_R_ECS_LIST',
    'importstart'               => 'EXEC s_echange.P_R_ECH_SELECT_NEWECH',
    'importprocstep'            => 'EXEC s_echange.P_R_ECE_SELECT_NEWECE @ECH_ID=%1$s, @ECE_CODE=%2$s, @LIBELLE=%3$s',
    'importend'                 => 'exec s_echange.P_U_ECH_UPDATE @ECH_ID=%1$s',
    'ctrl_eqp'                  => 'exec s_ressource.[P_R_EQP_VerifAffectation]',
    'ctrl_usr'                  => 'exec s_ressource.P_R_USR_VerifAffectation',
    'listreplacement'           => 'EXEC s_ressource.P_R_EQP_LIST_REPLACE @SAB_ID=%1$s, @RSC_ID=%2$s',
    // gestion des paramètres des équipements
    'getparametreseqp'          => 'EXEC s_ressource.P_R_EQP_PARAMETRES @EQP_ID=%1$s',
    'setparametreseqp'          => 'EXEC s_ressource.P_IU_EQP_PARAMETRE %1$s',
    // gestion des parametres de l'application
    'setappparametre'           => 'EXEC s_systeme.P_U_PPE_UPDATE @PARAMETRE = %1$s , @VALEUR = %2$s, @VALEUR_GENERIQUE = %3$s',
    'getappparametrebygroup'    => 'EXEC s_systeme.P_R_PPE_LIST_BYGROUP @GROUPE=%1$s',
    // gestion des paramètres du CRON
    'setcronparametre'          => 'EXEC s_systeme.P_U_CTB_UPDATE @CODE=%1$s, %2$s',
    'getcronparametrebytask'    => 'EXEC s_systeme.P_R_CTB_SELECT_BYTASK @TACHE = %1$s',
    
    //Gestion des tolérances
    'gettoleranceparam'         => 'exec s_systeme.P_R_PPE_LIST_TOLERANCE',
    'settoleranceparam_s'       => 'exec s_systeme.P_U_PPE_UPDATE_TOLERANCES @Valeur = %1$s',
    'settoleranceparam_a_max'   => 'exec s_systeme.P_U_PPE_UPDATE_TOLERANCEA_MAX @ValeurMax =  %1$s',
    'settoleranceparam_a_min'   => 'exec s_systeme.P_U_PPE_UPDATE_TOLERANCEA_MIN @ValeurMin =  %1$s',

    // Page FPS
    'getfpslist'                => 'exec s_ressource.P_R_GET_LIST_FPS',
    'getusrlist'                => 'exec s_ressource.P_R_GET_USR_FPS @ID_FPS = %1$s, @ID_RSC = %2$s',
    'geteqtlist'                => 'exec s_ressource.P_R_GET_EQT_FPS @ID_FPS = %1$s',

    'getalllist_usr'            => 'exec s_ressource.P_R_GET_ALL_USR_FPS @FPS_ID = %1$s, @RSC_ID = %2$s',
    'getalllist_eqt'            => 'exec s_ressource.P_R_GET_ALL_EQT_FPS @FpsId = %1$s',
    'getalllist_fpg'            => 'exec s_ressource.P_R_GET_ALL_FPG_FPS',

    'modify_fps_user'           => 'exec s_ressource.P_C_FPS_USR_INSERT_DELETE',
    'modify_fps_eqt'            => 'exec s_ressource.P_C_FPS_EQT_INSERT_DELETE @Type = \'%1$s\', @RscId = %2$s, @FpsId = %3$s',
    'modify_fps_fps'            => 'exec s_ressource.P_C_FPS_FPS_INSERT_DELETE @Type = \'%1$s\'',

];
