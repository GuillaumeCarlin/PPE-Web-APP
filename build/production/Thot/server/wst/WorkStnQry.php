<?php

$aLists = [
	'workstn' => 'exec s_ressource.P_R_RSC_SELECT_SERVICE @RST_CODE=\'EQP\', @SAB_ID=%1$s',
	'workstnselect' => 'exec s_ressource.P_R_EQP_SELECT_SERVICE @SAB_ID = %1$s',
	'sectionworkstn' => 'exec s_ressource.P_R_EQP_SELECT_SERVICE @SAB_ID = %1$s'
];

$aProc = [
	'sectionwstnattrib' => 'exec s_ressource.P_C_RCA_INSERT @RSC_ID=%1$s, @ORG_ID=%2$s',
	'sectionwstndelete' => 'exec s_ressource.P_D_RCA_DELETE @RSC_ID=%1$s, @ORG_ID=%2$s'
];
?>