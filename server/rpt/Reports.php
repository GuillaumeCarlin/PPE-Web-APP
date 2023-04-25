<?php

include_once '..\commun\SessionClass.php';

//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();
$aVariables[] = 'date_export';

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
include("ReportsQry.php");
$aMessages = [];

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
		// création du rapport d'activité quotidien
	case 'exportquotidien':
		$aListe = $Bdd->QryToArray(sprintf($aAlerts['exportquotidien'], $Bdd->FormatSql($date_export, 'C')));
		$aMessages[] = $Bdd->aExecReq['message'];
		$bSucces = $Bdd->aExecReq['success'];
		break;
}

switch ($action) {
	case 'exportquotidien':
		$oJson = array(
			"success" => $bSucces,
			"errorMessage" => $Bdd->aExecReq
		);
		break;

	default:
		$oJson = array(
			"success" => false,
			"NbreTotal" => 0,
			"nomnoeud" => array()
		);
		break;
}

ob_clean(); // vide le output buffer, évite la présence de caractère \ufeff en tête de fichier JSON
echo json_encode($oJson);
