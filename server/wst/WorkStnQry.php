<?php

$aLists = [
    'workstn' => 'exec s_ressource.P_R_RSC_SELECT_SERVICE @RST_CODE=\'EQP\', @SAB_ID=%1$s',
    'workstn2' => 'exec s_ressource.P_R_RSC_SELECT_SERVICE @RST_CODE=\'EQP\' %1$s', // modification pour gestion des équipements inactifs
    'workstnselect' => 'exec s_ressource.P_R_EQP_SELECT_SERVICE @SAB_ID = %1$s',
    'workstnselect2' => 'exec s_ressource.P_R_EQP_SELECT_SERVICE_V2 @SAB_ID = %1$s, @USR_ID = %2$s',
    'sectionworkstn' => 'exec s_ressource.P_R_EQP_SELECT_SERVICE @SAB_ID = %1$s',
    'operationworkstn' => 'exec s_ressource.P_R_EQP_LIST_OPERATION @OPN_ID = %1$s'
];

$aProc = [
    'sectionwstnattrib' => 'exec s_ressource.P_C_RCA_INSERT @RSC_ID=%1$s, @ORG_ID=%2$s',
    'sectionwstndelete' => 'exec s_ressource.P_D_RCA_DELETE @RSC_ID=%1$s, @ORG_ID=%2$s',
    'setreplacement' => 'exec s_ressource.P_IUD_EQP_SetReplacement @SELECTION=%1$s, @RSC_ID_INITIAL=%2$s, @RSC_ID_REMPLACE=%3$s, @MODE=%4$s',
];