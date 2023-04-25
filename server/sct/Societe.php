<?php

include_once '..\commun\SessionClass.php';

//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();
$aVariables[] = 'org_id';
$aVariables[] = 'sab_id';

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

class Societe extends GestBdd {

	function loadSection($sQuery, $iIdSite, $iIdParent = null, $aCurrentSel = null) {
		$sParentFilter = "null";

		if ($iIdParent != null) {
			$sParentFilter = $iIdParent;
		}

		$aSections = $this->QryToArray(sprintf($sQuery, $iIdSite, $sParentFilter));

		foreach ($aSections as $iInd => $aSection) {
			$aSections[$iInd]['checked'] = false;

			if (in_array($aSection['sab_id'], $aCurrentSel)) {
				$aSections[$iInd]['checked'] = TRUE;
			}

			if ($aSection['leaf'] < 1) {
				//---- On est sur une branche
				$aSections[$iInd]['expanded'] = true;
				$aChildren = $this->loadSection($sQuery, $iIdSite, $aSection["sab_id"], $aCurrentSel);

				if (count($aChildren) > 0) {
					$aSections[$iInd]['children'] = $aChildren;
				}
			}
		}

		return $aSections;
	}

}

$Bdd = new Societe($oSession->AppBase);
include("SocieteQry.php");

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
	case 'LstSociete':
		$aListe = $Bdd->QryToArray($aLists['society']);
		$bSucces = (count($aListe) > 0);
		break;

	case 'LstSite':
		$aListe = $Bdd->QryToArray(sprintf($aLists['site'], $aSpecFilter['org_id']));
		$bSucces = true;
		break;

	case 'LstSection':
		$sFilter = '';
		
		if (isset($aSpecFilter['sit_id'])) {
			$sFilter = '@SIT_ID='.$aSpecFilter['sit_id'];
		}
		
		if (isset($aSpecFilter['sab_id'])) {
			$sFilter = '@SAB_ID_STRING='.$Bdd->FormatSql($aSpecFilter['sab_id'],'C');
		}
		
		$aListe = $Bdd->QryToArray(sprintf($aLists['section'], $sFilter));
		$bSucces = true;
		break;

	case 'SectionTV':
		if (isset($aSpecFilter['org_id'])) {
			$aCurrentSel = [];

			if (isset($aSpecFilter['checkcurr'])) {
				$aCurrentSel = explode(',', $aSpecFilter['checkcurr']);
			}

			$aListe = $Bdd->loadSection($aLists['sectiontv'], $aSpecFilter['org_id'], null, $aCurrentSel);
			$bSucces = true;
		}

		break;

	case 'InfoSection':
		$aListe = $Bdd->QryToArray(sprintf($aInfos['section'], $Bdd->FormatSql($sab_id, 'C')));
		$bSucces = true;
		break;
}

switch ($action) {
	case 'LstSociete':
	case 'LstSite':
	case 'LstSection':
	case 'InfoSection':
		//$aListe[0]['org_description']='Mon cul';
		//echo var_export($aListe,true);
		//echo '<hr>';
		$oJson = array(
			"success" => $bSucces,
			"NbreTotal" => count($aListe),
			"liste" => $aListe
		);
		
		/*
		$arr = array('a' => 1, 'b' => 2, 'c' => 3, 'd' => 4, 'e' => 5);
		echo json_encode($arr);
		echo '<hr>';
		ob_clean(); // vide le output buffer, évite la présence de caractère \ufeff en tête de fichier JSON
echo json_encode($oJson);

		echo json_last_error();
		*/
		break;

	case 'SectionTV':
		$oJson = array(
			"success" => $bSucces,
			"children" => $aListe
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

ob_clean(); // vide le output buffer, évite la présence de caractère \ufeff en tête de fichier JSON
echo json_encode($oJson);
