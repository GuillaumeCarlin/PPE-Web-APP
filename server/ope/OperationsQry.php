<?php

$aOperations = [
    //----------- lectures -----------------
	'workstncurrope' 	=> 'EXEC s_production.P_R_OPN_SELECT_MACHINE @EQP_ID=%1$s',
	'ofcurrope' 		=> 'EXEC s_production.P_R_OPN_SELECT_OF @ODF_ID=%1$s',
	'realopeof' 		=> 'EXEC s_production.P_R_OPN_LIST_DETAILOF %1$s',
	'realopeofcsl' 		=> 'EXEC s_rapport.P_R_OPN_LIST_DETAILOF_CSL %1$s',
	'oflist'			=> 'EXEC s_production.P_R_ODF_LIST_BYCODE @ODF_CODE= %1$s',
	'oflistbyressource' => 'EXEC s_production.P_R_OPN_LIST_BYODFCODE %1$s',
	'opnlistbyofid' 	=> 'EXEC s_production.P_R_ODF_LIST_BYODFCODE %1$s',
    'opcomplist' 		=> 'EXEC s_production.P_R_OPN_LIST_COMPACT %1$s',
    //----------- écritures ----------------
    'setnonrealisee'    => 'EXEC s_production.P_C_ONR_INSERT @RSC_ID=%1$s, @OPN_ID=%2$s',
    'setopnstate'       => 'EXEC s_production.P_U_OPN_SETSTATE @OPN_ID=%1$s, @ETATCIBLE=%2$s',
    //----------- suppressions -------------
    'deleteopn'         => 'EXEC s_production.P_D_OPN_DELETE @ODF_ID=%1$s',
    'deleteopnsingle'   => 'EXEC s_production.P_D_OPN_DELETE_SINGLE @OPN_ID=%1$s'
];