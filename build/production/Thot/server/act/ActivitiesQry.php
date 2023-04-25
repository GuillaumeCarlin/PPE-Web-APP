<?php

$aActivities = [
	'alealist'			=> 'EXEC s_alea.P_R_ALD_LIST %1$s',
	'aleaend'			=> 'EXEC s_alea.P_U_ALA_UPDATE_TERMINER @ALA_ID = %1$s',
	'editfreealea'		=> 'EXEC s_alea.P_U_ALA_UPDATE_COMPLET @ALA_ID= %1$s, @RSC_ID_STRING=\'%2$s\', @ALD_ID=%3$s %4$s',
	'freealeas'			=> 'EXEC s_alea.P_R_ALA_LIST_LIBRE_SAB @SAB_ID_STRING= \'%1$s\'',
	'loadalea'			=> 'EXEC s_alea.P_R_ALA_SELECT @ALA_ID=%1$s',
	'loadaleaprog'		=> 'EXEC s_alea.P_R_ALP_SELECT @ALP_ID=%1$s',
	'newalea'			=> 'EXEC s_alea.P_C_ALA_INSERT @ACT_ID = %1$s, @ALD_ID = %2$s',
	'newfreealea'		=> 'EXEC s_alea.P_C_ALA_INSERT @RSC_ID_STRING=\'%1$s\', @ALD_ID=%2$s %3$s',
	'resscurrentala' 	=> 'EXEC s_alea.P_R_ALA_SELECT_COUNT @RSC_ID = %1$s',
	'useralea' 			=> 'EXEC s_alea.P_R_ALA_LIST_LIBRE_RSC @RSC_ID = %1$s',

	'actdetail' 		=> 'EXEC s_activite.P_R_ACT_select_detail @ACT_ID = %1$s',
	'activitieshisto'	=> 'EXEC s_activite.P_R_ACT_LIST_SAB_HISTO %1$s',
	'create' 			=> 'DECLARE @ACT_ID D_N_ID; EXEC s_activite.P_C_ACT_INSERT @OPN_ID = %1$s, @ODF_ID = %2$s, @ORG_ID = %3$s, @RSC_ID_STRING = %4$s, @FORCE=%5$s, @ACT_ID=@ACT_ID OUTPUT; SELECT @ACT_ID as act_id',
	'createctrl' 		=> 'EXEC s_activite.P_R_ACT_SELECT_SIMULTANE @RSC_ID_STRING = %1$s',
	'mrkcreate' 		=> 'EXEC s_activite.P_C_MRK_INSERT @ACT_ID=%1$s, @DEBUTFIN=\'%2$s\'',
	'qtydetail' 		=> 'EXEC s_activite.P_R_QTE_LIST %1$s',
	'qtyinsert' 		=> 'EXEC s_activite.P_C_QTE_INSERT @ACT_ID = %1$s, @RSC_ID = %2$s, @QTP_ID = %3$s, @QTE_VALEUR = %4$s',
	'qtytypelist' 		=> 'EXEC s_activite.P_R_QTP_LIST',
	'resscurrentact' 	=> 'EXEC s_activite.P_R_ACT_SELECT_COUNT @RSC_ID = %1$s',
	'sectioncurract' 	=> 'EXEC s_activite.p_r_act_list_sab @SAB_ID = %1$s',
	'stopsuspend' 		=> 'EXEC s_activite.P_U_ACT_UPDATE_TERMINER @ACT_ID = %1$s, @ACTION = %2$s, @QUANTITE = %3$s',
	'update' 			=> 'EXEC s_activite.P_C_ACT_INSERT_CORRECTION %1$s %2$s',
	'useract' 			=> 'EXEC s_activite.P_R_ACT_LIST_RSC @RSC_ID = %1$s',
	
	'compactlist' 		=> 'EXEC s_production.P_R_OPN_LIST_COMPACT @TYPE=%1$s',
	'compactcreate'		=> 'EXEC s_production.P_C_OPN_COMPLEMENTAIRE @ODF_ID=%1$s, @RSC_ID=%2$s, @OPC_ID = %3$s',
	'ofdetails' 		=> 'EXEC s_production.P_R_ODF_SELECT_DETAIL @ODF_ID=%1$s',
	'ofexists' 			=> 'EXEC s_production.P_R_ODF_SELECT_ID @ODF_CODE=%1$s',
	'opetime' 			=> 'EXEC s_production.P_R_OPN_SELECT_TEMPS @OPN_ID= %1$s, @ODF_ID=%2$s',
    'usertime' 			=> 'EXEC s_production.P_R_OPE_SELECT @OPN_ID= %1$s, @ODF_ID=%2$s, @EQP_ID=%3$s',
    
    'unplanedoplist'    => 'EXEC s_production.P_R_OPN_NONPLANIFIE',
    'getof200id'        => 'EXEC s_production.P_R_ODF_SELECT_OF200ID'
];
