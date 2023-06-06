<?php

//include_once '..\commun\SessionClass.php';

//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();
$aVariables[] = 'org_id';
$aVariables[] = 'sab_id';

include_once '../variablesEtFiltres.php';


$CnxDb = new PDO('sqlsrv:Server=10.30.103.67;Database=BD_THOT_THT', 'sa', '123456789+aze');
$CnxDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
function TestQry($Requete, $CnxDb){
    $oResult = $CnxDb->prepare($Requete); 
    $oResult->execute(); 
    $aListe = $oResult->fetchAll(PDO::FETCH_ASSOC);
    return $aListe;
}


if (isset($_GET['action'])) {
    $action = $_GET['action'];
}elseif (isset($_POST['action'])) {
    $action = $_POST['action'];
}


//---- Include de la classe de gestion des données ----
//include($oSession->ParentPath . "server/Bdd.php");

class Societe {

	public function __construct()
    {}

	function loadSection($sQuery, $iIdSite, $iIdParent = null, $aCurrentSel = null) {
		$sParentFilter = "null";

		if ($iIdParent != null) {
			$sParentFilter = $iIdParent;
		}

		$aSections = TestQry(sprintf($sQuery, $iIdSite, $sParentFilter), $CnxDb);

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

$Soc = new Societe();
include("SocieteQry.php");

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
	case 'LstSociete':
		$aListe = TestQry($aLists['society'], $CnxDb);
		$bSucces = (count($aListe) > 0);
		break;

	case 'LstSite':
		$Requete = $aLists['site'];
		$aListe = TestQry($Requete, $CnxDb);
		$bSucces = true;
		break;

	case 'LstSection':
		$sFilter = '';
		
		if (isset($aSpecFilter['sit_id'])) {
			$sFilter = '@SIT_ID='.$aSpecFilter['sit_id'];
		}
		
		if (isset($aSpecFilter['sab_id'])) {
			$sFilter = '@SAB_ID_STRING='.$aSpecFilter['sab_id'];
		}
		$Requete = sprintf($aLists['section'], $sFilter);
		$aListe = TestQry($Requete, $CnxDb);
		$bSucces = true;
		break;

	case 'SectionTV':
		if (isset($aSpecFilter['org_id'])) {
			$aCurrentSel = [];

			if (isset($aSpecFilter['checkcurr'])) {
				$aCurrentSel = explode(',', $aSpecFilter['checkcurr']);
			}

			$aListe = $Soc->loadSection($aLists['sectiontv'], $aSpecFilter['org_id'], null, $aCurrentSel);
			$bSucces = true;
		}

		break;

	case 'InfoSection':
		$aListe = TestQry(sprintf($aInfos['section']));
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
