<?php

include_once '..\commun\SessionClass.php';

//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();
$aVariables[] = 'alr_id';
$aVariables[] = 'rsc_id';
$aVariables[] = 'commentaire';
$aVariables[] = 'terminer';
require($oSession->ParentPath . "server/variablesEtFiltres.php");
$bDebug = false;
$sDebugAction = '';

if ($sDebugAction !== '') {
	if ($action !== $sDebugAction) {
		$bDebug = false;
	}
}

if ($bDebug) {
	error_log("========================" . basename(__FILE__) . ' : ' . $action . "=====================");
	error_log("_POST : " . var_export($_POST, true));
	error_log("_GET : " . var_export($_GET, true));
}

//---- Include de la classe de gestion des données ----
//include($oSession->ParentPath . "server/Bdd.php");
$Bdd = new GestBdd($oSession->AppBase);
include("AlertsQry.php");
$aMessages = [];

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
	case 'alertLst':
		//error_log(sprintf($aAlerts['list'], $Bdd->FormatSql($aSpecFilter['sab_id'], 'C')));
		$aListe = $Bdd->QryToArray(sprintf($aAlerts['list'], $Bdd->FormatSql($aSpecFilter['sab_id'], 'C')));
		$bSucces = (count($aListe) > 0);
		break;

	case 'alertDetail':
		$aListe = $Bdd->QryToArray(sprintf($aAlerts['detail'], $alr_id));
		$bSucces = (count($aListe) > 0);
		break;

	case 'alertUpdate':
		$Bdd->QryExec(sprintf($aAlerts['update'], $alr_id, $rsc_id, $Bdd->FormatSql($commentaire, 'C'), $terminer));
		$bSucces = $Bdd->aExecReq['success'];
		break;
}

switch ($action) {
	case 'alertDetail':
	case 'alertLst':
		$oJson = array(
			"success" => $bSucces,
			"NbreTotal" => count($aListe),
			"liste" => $aListe
		);
		break;

	case 'alertUpdate':
		$oJson = array(
			"success" => $bSucces,
			"errorMessage" => $Bdd->aExecReq
		);
		break;

	default :
		$oJson = array(
			"success" => false,
			"NbreTotal" => 0,
			"nomnoeud" => array()
		);
		break;
}

echo json_encode($oJson);
?>
