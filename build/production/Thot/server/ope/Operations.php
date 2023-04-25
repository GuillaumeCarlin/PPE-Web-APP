<?php

include_once '..\commun\SessionClass.php';

//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();

require($oSession->ParentPath . "server/variablesEtFiltres.php");
$bDebug = false;
$sDebugAction = '';

if ($sDebugAction!=='') {
	if ($action!==$sDebugAction) {
		$bDebug = false;
	}
}

if ($bDebug) {
	error_log("========================" . basename(__FILE__).' : '.$action . "=====================");
	error_log("_POST : " . var_export($_POST, true));
	error_log("_GET : " . var_export($_GET, true));
}

//---- Include de la classe de gestion des données ----
//include($oSession->ParentPath . "server/Bdd.php");
$Bdd = new GestBdd($oSession->AppBase);
include("OperationsQry.php");

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
	case 'LstWorkStnOpe':
		$sQry = sprintf($aOperations['workstncurrope'],$aSpecFilter['rsc_id']);
		
		//---- Liste des opérations possibles pour un équipement
		if (isset($aSpecFilter['noof'])) {
			$sQry = sprintf($aOperations['workstncurrope'],$aSpecFilter['rsc_id']).', @ODF_CODE=\''.$aSpecFilter['noof'].'\'';
		}
		
		$aListe = $Bdd->QryToArray($sQry);
		$bSucces = (count($aListe) > 0);
		break;
	case 'LstOfOpe':
		//---- Liste des opérations possibles pour un n° d'OF
		$aListe = $Bdd->QryToArray(sprintf($aOperations['ofcurrope'],$aSpecFilter['odf_id']));
		$bSucces = (count($aListe) > 0);
		break;
	case 'realOpeOf':
		//---- Liste des opérations réalisées sur un OF
		$aListe = $Bdd->QryToArray(sprintf($aOperations['realopeof'],$aSpecFilter['odf_id']));
		$bSucces = (count($aListe) > 0);
		break;
	case 'OfList':
		//---- Liste des OF dont le numéro contient odf_code (complet ou partiel)
		$aListe = $Bdd->QryToArray(sprintf($aOperations['oflist'],$aSpecFilter['odf_code']));
		$bSucces = (count($aListe) > 0);
		break;
}

switch ($action) {
	case 'LstWorkStnOpe':
	case 'LstOfOpe':
	case 'realOpeOf':
	case 'OfList':
		$oJson = array(
			"success" => $bSucces,
			"NbreTotal" => count($aListe),
			"liste" => $aListe
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
