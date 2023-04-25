<?php
	$aLists=[
		'society'=>'exec s_organisation.P_R_STE_LIST',
		'site'=>'exec s_organisation.P_R_SIT_LIST @STE_ID = %1$s',
		'section'=>'exec s_organisation.P_R_SAB_LIST %1$s',
		'sectiontv'=>'exec s_organisation.P_R_SAB_LIST_niveau @SIT_ID = %1$s, @SAB_ID_PARENT = %2$s'
	];
	$aInfos=[
		'section'=>'exec s_organisation.P_R_SAB_SELECT_CHEMIN @SAB_ID = %1$s'
	];
?>