<?php

include_once '..\commun\SessionClass.php';

//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();
$aVariables[] = 'sab_id';
$aVariables[] = 'rsc_id';
$aVariables[] = 'org_id';
$aVariables[] = 'org_id_src';
$aVariables[] = 'wstn';

require($oSession->ParentPath . "server/variablesEtFiltres.php");
$bDebug = false;
$sDebugAction = '';

if ($sDebugAction!=='') {
	if ($action!==$sDebugAction) {
		$bDebug = false;
	}
}

if ($bDebug) {
	error_log("========================" . basename(__FILE__).' : '. $action . "=====================");
	error_log("_POST : " . var_export($_POST, true));
	error_log("_GET : " . var_export($_GET, true));
}

//---- Include de la classe de gestion des données ----
//include($oSession->ParentPath . "server/Bdd.php");
$Bdd = new GestBdd($oSession->AppBase);
include("WorkStnQry.php");

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
	case 'LstWorkStn':
		$sService = 'null';

		if (isset($aSpecFilter['sab_id'])) {
			if ($aSpecFilter['sab_id'] !== 'all') {
				$sService = $Bdd->FormatSql($aSpecFilter['sab_id'], 'C');
			}
		}
		
		$aListe = $Bdd->QryToArray(sprintf($aLists['workstn'],$sService));
		$bSucces = $Bdd->aExecReq['success'];
		break;
		
	case 'WorkStnSelect':
		$sService = 'null';

		if (isset($aSpecFilter['sab_id'])) {
			if ($aSpecFilter['sab_id'] !== 'all') {
				$sService = $Bdd->FormatSql($aSpecFilter['sab_id'], 'C');
			}
		}
		
		$aListe = $Bdd->QryToArray(sprintf($aLists['workstnselect'],$sService));
		$bSucces = $Bdd->aExecReq['success'];
		break;

	case 'wstnSectionAdd':
		$Bdd->QryExec(sprintf($aProc['sectionwstnattrib'],
			$rsc_id,
			$org_id
		));
		$bSucces = $Bdd->aExecReq['success'];
		break;
	
	case 'wstnSectionReplace':
		//---- On supprime la section actuellement affectée
		$Bdd->QryExec(sprintf($aProc['sectionwstndelete'],
			$rsc_id,
			$org_id_src
		));
			
		// ...et on recrée
		$Bdd->QryExec(sprintf($aProc['sectionwstnattrib'],
			$rsc_id,
			$org_id
		));
		$bSucces = $Bdd->aExecReq['success'];

		break;
		
	case 'wstnSectionDel':
		//---- On supprime la section actuellement affectée
		$Bdd->QryExec(sprintf($aProc['sectionwstndelete'],
			$rsc_id,
			$org_id_src
		));
		$bSucces = $Bdd->aExecReq['success'];

		break;
		
	case 'wstnSectionAttrib':
		$aWstns = json_decode($wstn);

		foreach ($aWstns as $iInd => $aWstn) {
			if ($aWstn->org_id_src > 0) {
				//---- On supprime la section actuellement affectée
				$Bdd->QryExec(sprintf($aProc['sectionwstndelete'],
					$aWstn->rsc_id,
					$aWstn->org_id_src
				));

				// ...et on recrée
				$Bdd->QryExec(sprintf($aProc['sectionwstnattrib'],
					$aWstn->rsc_id,
					$org_id
				));
			}
			else {
				$Bdd->QryExec(sprintf($aProc['sectionwstnattrib'],
					$aWstn->rsc_id,
					$org_id
				));
			}
		}
		$bSucces = $Bdd->aExecReq['success'];
		break;
}

switch ($action) {
	case 'LstWorkStn':
	case 'WorkStnSelect':
		$oJson = array(
			"success" => $bSucces,
			"NbreTotal" => count($aListe),
			"liste" => $aListe
		);
		break;

	case 'wstnSectionAdd':
	case 'wstnSectionReplace':
	case 'wstnSectionAttrib':
	case 'wstnSectionDel':
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
