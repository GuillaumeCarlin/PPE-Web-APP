<?php
$aAdmin = [
	'importproclst' => 'exec s_echange.P_R_ECS_LIST',
	'importstart' => 'EXEC s_echange.P_R_ECH_SELECT_NEWECH',
	'importprocstep' => 'EXEC s_echange.P_R_ECE_SELECT_NEWECE @ECH_ID=%1$s, @ECE_CODE=%2$s, @LIBELLE=%3$s',
	'importend' => 'exec s_echange.P_U_ECH_UPDATE @ECH_ID=%1$s',
	'ctrl_eqp' => 'exec s_ressource.[P_R_EQP_VerifAffectation]',
	'ctrl_usr' => 'exec s_ressource.P_R_USR_VerifAffectation'
];
?>