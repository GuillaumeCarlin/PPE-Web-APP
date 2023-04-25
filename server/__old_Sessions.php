<?php

/* -----------------------------------------------------------------------------------------------------------
 *  description: gestion des sessions par la bdd
 *                            -------------------
 *   copyright        : F_D_V copyright creative commmon cc by-no :
 *                     pas d'utilisation commerciale autorisée, droit de modification, l'auteur doit être cité
 *                     pour plus d'information http://creativecommons.org/licenses/by-nc/2.0/fr/
 * Code original : http://openclassrooms.com/courses/stocker-les-sessions-dans-votre-base-de-donnees
 * Plus 			http://culttt.com/2013/02/04/how-to-save-php-sessions-to-a-database/
 * ----------------------------------------------------------------------------------------------------------- */
include_once 'Bdd.php';
$aPathParts = pathinfo($_SERVER['PHP_SELF']);
$aDir = explode('/', $aPathParts['dirname']);
$sParents = str_repeat('../', count($aDir) - 2);
$sBasesPath = 'localParams/Bases.json';

class Session extends GestBdd {
	public $bDb = false;
	public $session_time = 3600;
	public $session = array();
	public $aBases = array();
	public $AppBase = array();
	public $aTypeChamp = array();
	public $ParentPath = '';
	public $sessDb = null;
	private $SessUser;
	public $sAppBase = array();
	var $iTime = 48;

	public function __construct($sAppName, $sBasesPath, $sAppBase, $sUser, $bDb) { //, $sBasesPath, $sBaseName, $sUser, $bClear
		//---- Détermination du chemin qui permet de remonter à la racine
		$aPathParts = pathinfo($_SERVER['PHP_SELF']);
		$aDir = explode('/', $aPathParts['dirname']);
		$sParents = str_repeat('../', count($aDir) - 2);
		$this->ParentPath = $sParents;
		//---- Durée de vie des cookies
		$this->session_time = ($this->iTime * 3600);

		if ($sUser !== '') {
			$this->SessUser = $sUser;
		}

		//---- Maintenant on cherche les infos de connexion à la base
		//	- Soit dans le fichier JSON (si Session est appelé depuis index.php)
		//	- Soit dans les cookies (si Session est appelé par un PHP du répertoire 'server')
		//	  Ca permet de gagner un peu de temps
		$aAppName = explode('-', $sAppName);
		$this->sAppBase = $sAppBase; //$aApplis[$aAppName[0]]['base']; //
		//---- Nouvelle session (lecture du fichier JSON)
		$sBasesFile = file_get_contents($this->ParentPath . $sBasesPath);
		$this->storeBases(json_decode($sBasesFile));
		$this->bDb = $bDb;

		//on précise les méthodes à employer pour les sessions
		if ($this->bDb) {
			session_set_save_handler(
					array($this, 'open'), array($this, 'close'), array($this, 'read'), array($this, 'write'), array($this, 'destroy'), array($this, 'gc')
			);
		}
		return true;
	}

	public function storeBases($aBases) {
		//---- On stocke dans $this->aBases les paramètres de toutes les bases présentes dans Bases.json
		foreach ($aBases as $sBase => $aParams) {
			$this->aBases[$sBase] = array();

			foreach ($aParams as $sParamName => $sValue) {
				$this->aBases[$sBase][$sParamName] = $sValue;
			}
		}
	}

	public function open() {//pour l'ouverture
		if ($this->bDb) {
			$this->sessDb = new GestBdd($this->aBases['BD_AUTH']);
			$this->gc(); //on appelle la fonction gc
			return $this->sessDb->cnxStatus; //true ou false selon la réussite ou non de la connexion à la bdd
		}
		else {
			return true;
		}
	}

	//---- Lecture des données de la session
	public function read($sid) {
		if ($this->bDb) {
			$sQuery = "SELECT sess_datas FROM AppSession WHERE sess_id = '$sid' ";
			//$aDatas = $this->query($sQuery);
			$aDatas = $this->sessDb->QryToArray($sQuery);
			error_log(var_export($aDatas,true));

			if (count($aDatas) < 1) {
				return FALSE;
			}
			else {
				return $aDatas[0]['sess_datas']; //on retourne la valeur de sess_datas
			}
		}
		else {
			return $_SESSION;
		}
	}

	public function write($sid, $data) {//écriture
		$iExpire = intval(time() + $this->session_time); //calcul de l'expiration de la session
		$sExpire = date('Y-m-d H:i:s', $iExpire);
		//$data = str_replace('\'', '\'\'', $data);

		if ($this->SessUser == '') {
			if (isset($_SESSION)) {
				if (isset($_SESSION[$_SESSION['AppName']]['UTILISATEUR']['login'])) {
					$this->SessUser = $_SESSION[$_SESSION['AppName']]['UTILISATEUR']['login'];
				}
			}
		}

		$sQuery = sprintf('if exists(SELECT sess_id FROM AppSession WHERE sess_id = %1$s) ' .
				'UPDATE AppSession SET sess_user=%2$s, sess_datas = %3$s, sess_expire = %4$s WHERE sess_id = %1$s ' .
				'else ' .
				'INSERT INTO AppSession (sess_id, sess_user, sess_datas, sess_expire) VALUES(%1$s,%2$s,%3$s,%4$s)',
				$this->sessDb->FormatSql($sid, 'C'),
				$this->sessDb->FormatSql($this->SessUser, 'C'),
				$this->sessDb->FormatSql($data, 'U'),
				$this->sessDb->FormatSql($sExpire, 'D')
		);
		error_log($sQuery);
		$this->sessDb->QryExec($sQuery);

		return $this->sessDb->aExecReq['success'];
	}

	public function close() {//fermeture
		//error_log('-- close');
		//$this->connect->close();
	}

	public function destroy($sid) {//destruction
		$sQuery = "DELETE FROM AppSession WHERE sess_id = '$sid' "; //on supprime la session de la bdd
		//$aExec = $this->sessDb->QryExec($sQuery);
		$this->sessDb->QryExec($sQuery);

		$this->connect = null;
		return $this->sessDb->aExecReq['success'];
	}

	public function gc() {//nettoyage
		$sExpire = date('Y-m-d H:i:s', time());
		$sQuery = "DELETE FROM AppSession WHERE sess_expire < CONVERT(datetime,'$sExpire',120)"; //on supprime les vieilles sessions 
		$this->sessDb->QryExec($sQuery);

		return $this->sessDb->aExecReq['success'];
	}

	//fin de la classe (l'école est finie, quoi !)
}

//--------------------------------------------------
// Init de la session
//--------------------------------------------------
$bDb = false;

if (!isset($sAppName)) {
	if (isset($_POST['appName'])) {
		$sAppName = $_POST['appName'];
	}

	if (isset($_GET['appName'])) {
		$sAppName = $_GET['appName'];
	}
}
$sUser = '';
$sAppBase = '';

if (isset($database)) {
	$sAppBase = $database;
}

if (isset($sLoginWin)) {
	$sUser = $sLoginWin;
}

if ($bDb) {
	ini_set('session.save_handler', 'user'); //on définit l'utilisation des sessions en personnel
}

try {
	$oSession = new Session($sAppName, $sBasesPath, $sAppBase, $sUser, $bDb); //, $sBasesPath, $sBaseName, $sUser, $bClearSession);
	session_start(); //on démarre la session
}
catch (Exception $e) {
	error_log('-------- Crash Session -------');
	error_log($e->getTraceAsString());
	error_log('----------');
	error_log(var_export($_SESSION, true));
	error_log('------------------------------');
}

//error_log('---- After session_start');
//error_log(var_export($_SESSION,true));

//---- Est-ce une nouvelle session ?
$bNewSess = true;
if (isset($_SESSION['AppName'])) {
	if ($_SESSION['AppName']===$sAppName) {
		$bNewSess = false;
	}
}

if ($bNewSess) {
	//error_log('Nouvelle session : '.$sAppName);
	$_SESSION = array();
	$_SESSION['AppName'] = $sAppName;
	
	//---- Si aucune base n'a été expressément demandée, on prend la base par défaut
	$aAppBases = array();
	$sDefault = $sAppBase;
	$bDefault = false;

	foreach ($oSession->aBases as $sBase=>$aBase) {
		$bDefault = false;

		//---- Est-ce une base 'appli' ?
		if (isset($aBase['appli'])) {
			if ($aBase['appli'] > 0) {
				$aAppBases[$sBase] = false;
			}

			if (isset($aBase['defaut'])) {
				$bDefault = $aBase['defaut'] > 0;
			}
		}

		if ($bDefault) {
			if ($sDefault == '') {
				$sDefault = $sBase;
			}

			$aAppBases[$sBase] = true;
		}
	}

	//---- Si aucune base 'appli' n'a été déclarée comme base par défaut, on prend la première
	//	S'il y en a pas... eh ben je peux rien faire, il faut quand même un minimum, je suis pas 
	//	magicien non plus, il y a des moments où il faut arréter les conneries... bon ok j'me calme
	if ($sDefault == '') {
		$sDefault = key($aAppBases);
	}

	$oSession->sAppBase = $sDefault;
	$_SESSION[$sAppName]["NOMCLIENT"] = $oSession->sAppBase;
	$_SESSION[$sAppName]["BASES"] = $oSession->aBases;
}
else {
	//error_log('---- Session connue : '.$sAppName);
	$oSession->sAppBase = $_SESSION[$sAppName]["NOMCLIENT"];
}

$oSession->AppBase = $oSession->aBases[$oSession->sAppBase];
//error_log(var_export($_SESSION,true));

?>
