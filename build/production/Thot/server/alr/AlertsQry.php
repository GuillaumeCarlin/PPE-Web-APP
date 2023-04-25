<?php

$aAlerts = [
	'list'=>'exec s_alerte.P_R_ALR_LIST_SAB @SAB_ID_STRING=%1$s',
	'detail'=>'exec s_alerte.P_R_ALR_SELECT_DETAIL @ALR_ID=%1$s',
	'update'=>'exec s_alerte.P_U_ALR_UPDATE_TERMINER @ALR_ID=%1$s, @RSC_ID=%2$s, @COMMENTAIRE=%3$s, @TERMINER=%4$s',
	'alertcreate'=>'exec s_alerte.P_C_ALR_INSERT @ACT_ID = %1$s, @ALR_LIBELLE= %2$s'
];
?>
