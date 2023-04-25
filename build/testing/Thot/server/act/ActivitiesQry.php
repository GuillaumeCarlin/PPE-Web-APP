<?php

$aActivities = [
	'alealist'=>'exec s_alea.P_R_ALD_LIST %1$s',
	'newalea'=>'exec s_alea.P_C_ALA_INSERT @ACT_ID = %1$s, @ALD_ID = %2$s',
	'newfreealea'=>'exec s_alea.P_C_ALA_INSERT @RSC_ID_STRING=\'%1$s\', @ALD_ID=%2$s %3$s',
	'editfreealea'=>'exec s_alea.P_U_ALA_UPDATE_COMPLET @ALA_ID= %1$s, @RSC_ID_STRING=\'%2$s\', @ALD_ID=%3$s %4$s',
	'loadalea'=>'exec s_alea.P_R_ALA_SELECT @ALA_ID=%1$s',
	'loadaleaprog'=>'exec s_alea.P_R_ALP_SELECT @ALP_ID=%1$s',
	'resscurrentact' => 'exec s_activite.P_R_ACT_SELECT_COUNT @RSC_ID = %1$s',
	'resscurrentala' => 'exec s_alea.P_R_ALA_SELECT_COUNT @RSC_ID = %1$s',
	'aleaend'=>'exec s_alea.P_U_ALA_UPDATE_TERMINER @ALA_ID = %1$s',
	'freealeas'=>'exec s_alea.P_R_ALA_LIST_LIBRE_SAB @SAB_ID_STRING= \'%1$s\'',
	'sectioncurract' => 'exec s_activite.p_r_act_list_sab @SAB_ID = %1$s',
	'activitieshisto'=> 'EXEC s_activite.P_R_ACT_LIST_SAB_HISTO %1$s',
	'qtytypelist' => 'exec s_activite.P_R_QTP_LIST',
	'ofexists' => 'exec s_production.P_R_ODF_SELECT_ID @ODF_CODE=%1$s',
	'ofdetails' => 'exec s_production.P_R_ODF_SELECT_DETAIL @ODF_ID=%1$s',
	'createctrl' => 'exec s_activite.P_R_ACT_SELECT_SIMULTANE @RSC_ID_STRING = %1$s',
	'create' => 'DECLARE @ACT_ID D_N_ID; exec s_activite.P_C_ACT_INSERT @OPN_ID = %1$s, @ODF_ID = %2$s, @ORG_ID = %3$s, @RSC_ID_STRING = %4$s, @FORCE=%5$s, @ACT_ID=@ACT_ID OUTPUT; SELECT @ACT_ID as act_id',
	'update' => 'exec s_activite.P_C_ACT_INSERT_CORRECTION %1$s %2$s',
	'mrkcreate' => 'exec s_activite.P_C_MRK_INSERT @ACT_ID=%1$s, @DEBUTFIN=\'%2$s\'',
	'actdetail' => 'exec s_activite.P_R_ACT_select_detail @ACT_ID = %1$s',
	'opetime' => 'exec s_production.P_R_OPN_SELECT_TEMPS @OPN_ID= %1$s, @ODF_ID=%2$s',
	'usertime' => 'exec s_production.P_R_OPE_SELECT @OPN_ID= %1$s, @ODF_ID=%2$s, @EQP_ID=%3$s',
	'qtydetail' => 'exec s_activite.P_R_QTE_LIST %1$s',
	'qtyinsert' => 'exec s_activite.P_C_QTE_INSERT @ACT_ID = %1$s, @RSC_ID = %2$s, @QTP_ID = %3$s, @QTE_VALEUR = %4$s',
	'stopsuspend' => 'exec s_activite.P_U_ACT_UPDATE_TERMINER @ACT_ID = %1$s, @ACTION = %2$s, @QUANTITE = %3$s',
	'useract' => 'exec s_activite.P_R_ACT_LIST_RSC @RSC_ID = %1$s',
	'useralea' => 'exec s_alea.P_R_ALA_LIST_LIBRE_RSC @RSC_ID = %1$s'
];
?>
