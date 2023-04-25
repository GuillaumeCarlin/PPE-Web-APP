<?php
include_once '..\commun\SessionClass.php';

//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();
$aVariables[] = 'form';

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
//($oSession->ParentPath . "server/Bdd.php");
$Bdd = new GestBdd($oSession->AppBase);
//include("AppQry.php");

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
	case 'getValid':
	// vérifie l'existance d'un fichier JS de validation du formulaire passé en paramère
		$sCode = '';
		$sPath = $oSession->ParentPath . 'validJs/'.$form.'.js';

		if (file_exists($sPath)) {
			$bSucces = true;
			$sCode = file_get_contents($sPath);
		}

		break;
}

// traitement du retour à faire au demandeur
switch ($action) {
	case 'getValid':
		$oJson = array(
			"success" => $bSucces,
			"code" => $sCode
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

// retour de l'objet JSON au demandeur
ob_clean(); // vide le output buffer, évite la présence de caractère \ufeff en tête de fichier JSON
echo json_encode($oJson);
