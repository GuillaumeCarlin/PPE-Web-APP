<?php

$aOperations = [
	'workstncurrope' 	=> 'EXEC s_production.P_R_OPN_SELECT_MACHINE @EQP_ID=%1$s',
	'ofcurrope' 		=> 'EXEC s_production.P_R_OPN_SELECT_OF @ODF_ID=%1$s',
	'realopeof' 		=> 'EXEC s_production.P_R_OPN_LIST_DETAILOF @ODF_ID=%1$s',
	'oflist'			=> 'EXEC s_production.P_R_ODF_LIST_BYCODE @ODF_CODE= %1$s'
];
