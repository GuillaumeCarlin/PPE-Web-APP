<?php

include_once '..\commun\SessionClass.php';

//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();
$aVariables[] = 'node';
$aVariables[] = 'ech_id';
$aVariables[] = 'ecs_libelle';
$aVariables[] = 'ecs_proc';
$aVariables[] = 'ecs_trigrm';

require($oSession->ParentPath . "server/variablesEtFiltres.php");
$bDebug = true;
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

class Admin extends GestBdd {

	var $aModules = [];

	function importModules($iIdParent = 0) {
		$aTree = [];
		$aChildren = [];

		foreach ($this->aModules as $iInd => $aModule) {
			$bTakeIt = false;
			
			if ($iIdParent < 1) {
				//---- Si l'IdParent n'est pas précisé, on ne récupère que les niveaux 0 (donc les parents)
				$bTakeIt = ($aModule['ecs_niveau'] < 1);
			}
			else {
				//---- Sinon, on ne récupère que les enfants du parent demandé
				$bTakeIt = ($aModule['ecs_id_parent'] == $iIdParent);
			}
			
			if ($bTakeIt) {
				$aNode = [
					'nodeid' => 'node_' . $aModule['ecs_id'],
					'cls' => 'x-tree-noicon',
					'status' => '',
					'log' => '',
					'expanded' => true,
					'checked' => false
				];
				$aTree[] = array_merge($aNode, $aModule);
			}
		}
		
		if (count($aTree) > 0) {
			//---- On parcours ce niveau pour chercher les (éventuels) enfants
			foreach ($aTree as $iInd => $aModule) {
				$aChildren = $this->importModules($aModule['ecs_id']);
				
				if (count($aChildren) > 0) {
					$aTree[$iInd]['children'] = $aChildren;
				}
				else {
					$aTree[$iInd]['leaf'] = true;
				}
			}
		}

		return $aTree;
	}

}

$Bdd = new Admin($oSession->AppBase);
include("AdminQry.php");
$aMessages = [];

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
	case 'LstImportProc':
		if ($node == 'root') {
			$Bdd->aModules = $Bdd->QryToArray($aAdmin['importproclst']);
			$aListe = $Bdd->importModules();
		}

		$bSucces = (count($aListe) > 0);
		break;

	case 'ImportStart':
		$aListe = $Bdd->QryToArray($aAdmin['importstart']);
		$bSucces = $Bdd->aExecReq['success'];
		break;
	
	case 'ImportProc':
		set_time_limit(120);
		
		if ($ecs_proc!=='') {
			$aListe = $Bdd->QryToArray(sprintf($aAdmin['importprocstep'],
				$ech_id,
				$Bdd->FormatSql($ecs_trigrm, 'C'),
				$Bdd->FormatSql($ecs_libelle, 'C')
			));
			$bSucces = $Bdd->aExecReq['success'];

			if ($bSucces) {
				$Bdd->QryExec(sprintf('exec %1$s @ECE_ID=%2$s',$ecs_proc,intval($aListe[0]['ece_id'])));
			}

			$bSucces = $Bdd->aExecReq['success'];
		}
		else {
			$bSucces = true;
		}
		break;
	
	case 'ImportEnd':
		$Bdd->QryExec(sprintf($aAdmin['importend'],$ech_id));
		$aEqpmt = $Bdd->QryToArray($aAdmin['ctrl_eqp']);
		$aUsr = $Bdd->QryToArray($aAdmin['ctrl_usr']);

		$aListe = [
			'eqp' => count($aEqpmt),
			'usr' => count($aUsr)
		];
		$bSucces = $Bdd->aExecReq['success'];
		break;
	
	case 'CtrlUsers':
		$aListe = $Bdd->QryToArray($aAdmin['ctrl_usr']);
		$bSucces = $Bdd->aExecReq['success'];
		break;

	case 'CtrlWorkStn':
		$aListe = $Bdd->QryToArray($aAdmin['ctrl_eqp']);
		$bSucces = $Bdd->aExecReq['success'];
		break;
}

switch ($action) {
	case 'CtrlWorkStn':
	case 'CtrlUsers':
		$oJson = array(
			"success" => $bSucces,
			"NbreTotal" => count($aListe),
			"liste" => $aListe
		);
		break;

	case 'LstImportProc':
		$oJson = array(
			"success" => $bSucces,
			"children" => $aListe
		);
		break;

	case 'ImportStart':
	case 'ImportProc':
	case 'ImportEnd':
		$oJson = array(
			"success" => $bSucces,
			"output" => $aListe,
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
