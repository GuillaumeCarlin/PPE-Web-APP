<?php
//---- Déclaration des variables
$Comptage = false;
$aVariables = array();
$aVariables[] = "appName";
$aVariables[] = "action";
$aVariables[] = "login";
$aVariables[] = "database";


require("variablesEtFiltres.php");
$iSessionTime = 48;
$sLoginWin = $login;
$bDebug = false;

if ($bDebug) {
	error_log("_POST : " . var_export($_POST, true));
	error_log("_GET : " . var_export($_GET, true));
}

//---- On rapatrie ici tout ce qui se trouvais dans index.php
//---- Init des variables d'identification de l'appli (pour les sessions)
$sAppName = "THOT";
$sLoginWin = "";
$sRemoteUser = "";
$sDataBase = '';

//---- On cherche a connaître le login Windows de l'utilisateur courant (SSO)
// if (isset($_SERVER['REMOTE_USER'])) {
//     $sRemoteUser = $_SERVER['REMOTE_USER'];
// }

// if ($sRemoteUser == "") {
//     if (isset($_SERVER['PHP_AUTH_USER'])) {
//         $sRemoteUser = $_SERVER['PHP_AUTH_USER'];
//     }
// }

// if ($sRemoteUser !== "") {
//     //---- Récupération du login windows
//     $aRemoteUser = explode('\\', $_SERVER['REMOTE_USER']);

//     if (count($aRemoteUser) > 1) {
//         list($sDomain, $sLogin) = $aRemoteUser;
//         $sLoginWin = $sLogin;
//     } else {
//         $sLoginWin = $sRemoteUser;
//     }
// } else {
//     if (strtolower($_SERVER["HTTP_HOST"]) == 'localhost' && strtolower(gethostname()) == 'stn-w7p-edu') {
//         $sLoginWin = 'edblv';
//     }
// }

/*
$oCnxParams = array(
    'directOpen' => isset($_GET["Param"]) ? true : false,
    'prefix' => $sAppName,
    'nomenu' => 10,
    'database' => $sDataBase,
    'login' => $sLoginWin
);
*/
//----------------------------------------------------------


// require_once('commun\SessionClass.php');
require_once('commun/SessionClass.php');

//require_once 'Xml.php';

//---- Include de la classe de gestion des données ----
//include("Bdd.php");
$Bdd = new GestBdd($oSession->AppBase);

//---- Include de la liste des requêtes de structures (doit être fait après l'instanciation de $Bdd) ----
include("RequetesStr.php");

$aMaj = array();
$bSucces = false;
$aAppli = array();
$aUser = array();
$sTypeCnx = "";
$aParametres = array();

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
	case "Start":
		/**
		 * @description Collecte les paramètres généraux à passer à l'application
		 */
		$_SESSION[$sAppName]["UTILISATEUR"]["login"] = $sLoginWin;

		/**
		 * @description COnfiguration du serveur Websocket
		 */
		//---- Lecture des paramètres du websockets
		$sParamPath = 'localParams/webSockets.json';
		$sParamFile = file_get_contents('../'. $sParamPath);
		$oWsParam = json_decode($sParamFile);
		// place les paramètres du webscocket dans la SESSION PHP
		$_SESSION[$sAppName]["websockets"] = $oWsParam;

		//---- Lecture des config de grids
		// $oGridsConfig = [];

		// if ($sLoginWin!=='') {
		// 	$sPrefPath = $oSession->ParentPath . 'localParams/users/'.$sLoginWin;

		// 	if (!is_dir($sPrefPath)) {
		// 		mkdir($sPrefPath,777,true);
		// 	}

		// 	$oConfigFile = [
		// 		'path' => $sPrefPath.'/gridConfig.json',
		// 		'content' => ''
		// 	];

		// 	if (file_exists($oConfigFile['path'])) {
		// 		//---- Un fichier JSON existe déjà pour ce user
		// 		//	on le charge
		// 		$oConfigFile['content'] = file_get_contents($oConfigFile['path']);
		// 		$oGridsConfig = json_decode($oConfigFile['content'],true);
		// 	}
		// }

		$aAppli = array(
			'name' => $sAppName, // nom de l'application
			'dev' => isset($Bdd->PrmBase["dev"]) ?$Bdd->PrmBase["dev"] :0, // booleen pour indiquer si on est en mode développement
			'websockets'=>$oWsParam // paramètres du erveur websocket
			// 'base' => $Bdd->PrmBase["nombase"],
			// 'client' => $Bdd->PrmBase["client"],
			// 'libelle' => $Bdd->PrmBase["libbase"],
			// 'numreq'=> 'ND',
			// 'datestructure'=>'ND',
			// 'datemaj'=>'ND',
		);

		$bSucces = true;
		break;
}

switch ($action) {
	case "Start":
		$oJson = array(
			"success" => $bSucces,
			"app" => $aAppli,
			// "user" => $aUser,
			// "grids" => $oGridsConfig
		);
		break;
}

ob_clean(); // vide le output buffer, évite la présence de caractère \ufeff en tête de fichier JSON
echo json_encode($oJson);
