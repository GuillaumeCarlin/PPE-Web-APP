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
// include_once 'dbMngt.php'; // PHP v7
include_once 'BddClass.php';

// include 'ChromePhp.php';
/*
$aPathParts = pathinfo($_SERVER['PHP_SELF']);
$aDir = explode('/', $aPathParts['dirname']);
$sParents = str_repeat('../', count($aDir) - 2);
*/
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
	public $bNewSess = true;
	private $SessUser;
	public $sAppBase = array();
	var $iTime = 48;

	public function __construct($sAppName, $sBasesPath, $sAppBase, $sUser, $bDb) { //, $sBasesPath, $sBaseName, $sUser, $bClear
		//---- Détermination du chemin qui permet de remonter à la racine
		$sUrl = $_SERVER['PHP_SELF'];
		$sFilePath = $sUrl;
		$sParams = '';
		
		if (isset($_SERVER['PATH_INFO'])) {
			$sParams = $_SERVER['PATH_INFO'];
			$iParamPos = strpos($sUrl, $sParams);
			
			//---- Maintenant que j'ai l'URL complète et la partie 'paramètres',
			// je vais extraire le chemin
			if ($iParamPos>0) {
				$sFilePath = substr($sUrl, 0, $iParamPos);
			}
		}
		
		
		$aPathParts = pathinfo($sFilePath);
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
			//error_log(var_export($aDatas,true));

			if (count($aDatas) < 1) {
				return FALSE;
			}
			else {
				return $aDatas[0]['sess_datas']; //on retourne la valeur de sess_datas
			}
		}
		else {
			error_log('--------- Read sess --------------');
			$this->sessSpy();
			error_log('--------------');
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
		//error_log($sQuery);
		$this->sessDb->QryExec($sQuery);

		return $this->sessDb->aExecReq['success'];
	}

	public function close() {//fermeture
		//error_log('-- close');
		//$this->connect->close();
	}

	public function destroy($sid) {//destruction
		//error_log('Destruction '.$id);
		/*
		$sQuery = "DELETE FROM AppSession WHERE sess_id = '$sid' "; //on supprime la session de la bdd
		//$aExec = $this->sessDb->QryExec($sQuery);
		$this->sessDb->QryExec($sQuery);

		$this->connect = null;
		return $this->sessDb->aExecReq['success'];
		*/
	}

	public function gc() {//nettoyage
		$sExpire = date('Y-m-d H:i:s', time());
		$sQuery = "DELETE FROM AppSession WHERE sess_expire < CONVERT(datetime,'$sExpire',120)"; //on supprime les vieilles sessions 
		$this->sessDb->QryExec($sQuery);

		return $this->sessDb->aExecReq['success'];
	}

	public function sessSpy() {
		error_log('---- Session '. session_id());
		foreach ($_SESSION as $sKey=>$aValue) {
			error_log($sKey.' : '.var_export($aValue,true));
			if (is_array($aValue)) {
				foreach ($_SESSION[$sKey] as $sSKey=>$aSValue) {
					error_log($sKey.'--->'.$sSKey.' : '.var_export($aSValue,true));
				}
			}
		}
		error_log('--------------------------------');
	}
	
	function connexionWindows() {
		$browser = $this->getBrowser();
		// Si l'utilisateur n'utilise pas windows, ou si le navigateur n'est pas chrome ni IE, échoue
		if ($browser['platform'] != 'windows' OR ( $browser['name'] != 'Google Chrome' AND $browser['name'] != 'Internet Explorer')) {
			return false;
		}

		$headers = apache_request_headers(); // Récupération des l'entêtes client

		if (@$_SERVER['HTTP_VIA'] != NULL) { // nous verifions si un proxy est utilisé : parceque l'identification par ntlm ne peut pas passer par un proxy
			return false;
		} elseif (!isset($headers['Authorization'])) { //si l'entete autorisation est inexistante
			header("HTTP/1.1 401 Unauthorized"); //envoi au client le mode d'identification
			header("Connection: Keep-Alive");
			header("WWW-Authenticate: Negotiate");
			header("WWW-Authenticate: NTLM"); //dans notre cas le NTLM
			exit;
		}

		if (!isset($headers['Authorization'])) {
			return false;
		}

		if (substr($headers['Authorization'], 0, 5) != 'NTLM ') {
			return false; // on vérifie que le client soit en NTLM
		}

		$chaine = $headers['Authorization'];
		$chaine = substr($chaine, 5); // recuperation du base64-encoded type1 message
		$chained64 = base64_decode($chaine); // decodage base64 dans $chained64
		if (ord($chained64[8]) == 1) {
			$retAuth = "NTLMSSP" . chr(000) . chr(002) . chr(000) . chr(000) . chr(000) . chr(000) . chr(000) . chr(000);
			$retAuth .= chr(000) . chr(040) . chr(000) . chr(000) . chr(000) . chr(001) . chr(130) . chr(000) . chr(000);
			$retAuth .= chr(000) . chr(002) . chr(002) . chr(002) . chr(000) . chr(000) . chr(000) . chr(000) . chr(000);
			$retAuth .= chr(000) . chr(000) . chr(000) . chr(000) . chr(000) . chr(000) . chr(000);
			$retAuth64 = base64_encode($retAuth); // encode en base64
			$retAuth64 = trim($retAuth64); // enleve les espaces de debut et de fin
			header("HTTP/1.1 401 Unauthorized"); // envoi le nouveau header
			header("WWW-Authenticate: NTLM $retAuth64"); // avec l'identification supplémentaire
			exit;
		} else if (ord($chained64[8]) == 3) {
			$lenght_domain = (ord($chained64[31]) * 256 + ord($chained64[30])); // longueur du domain
			$offset_domain = (ord($chained64[33]) * 256 + ord($chained64[32])); // position du domain.
			$domain = str_replace("\0", "", substr($chained64, $offset_domain, $lenght_domain)); // decoupage du du domain

			$lenght_login = (ord($chained64[39]) * 256 + ord($chained64[38])); // longueur du login.
			$offset_login = (ord($chained64[41]) * 256 + ord($chained64[40])); // position du login.
			$login = str_replace("\0", "", substr($chained64, $offset_login, $lenght_login)); // decoupage du login
			if (!empty($login)) {
				return $login;
			}
		}
		return false;
	}

	/**
	 * Récupère le type de navigateur de l'utilisateur avec sa version, son 
	 * @return array Tableau contenant des informations sur le navigateur de l'utilisateur
	 */
	function getBrowser() {
		$uAgent = $_SERVER['HTTP_USER_AGENT'];
		$platform = 'unknown';
		$bname = 'unknown';

		if (preg_match('/linux/i', $uAgent)) {
			$platform = 'linux';
		} elseif (preg_match('/macintosh|mac os x/i', $uAgent)) {
			$platform = 'mac';
		} elseif (preg_match('/windows|win32/i', $uAgent)) {
			$platform = 'windows';
		}

		// Next get the name of the useragent yes seperately and for good reason
		if (preg_match('/Firefox/i', $uAgent)) {
			$bname = 'Mozilla Firefox';
		} elseif (preg_match('/Chrome/i', $uAgent)) {
			$bname = 'Google Chrome';
		} elseif (preg_match('/Safari/i', $uAgent)) {
			$bname = 'Apple Safari';
		} elseif (preg_match('/Opera/i', $uAgent)) {
			$bname = 'Opera';
		} elseif (preg_match('/Netscape/i', $uAgent)) {
			$bname = 'Netscape';
		} else if (preg_match('/MSIE/i', $uAgent) OR ( preg_match('/Windows NT/i', $uAgent) AND preg_match('/Trident/i', $uAgent))) {
			$bname = 'Internet Explorer';
		}

		return array(
			'name' => $bname,
			'platform' => $platform
		);
	}
	//fin de la classe (l'école est finie, quoi !)
}

//--------------------------------------------------
// Init de la session
//--------------------------------------------------
$bDb = false;

/*
error_log('-------------sessMngt----------------');
error_log(var_export($_POST,true));
error_log(var_export($_GET,true));
error_log('-------------------------------------');
*/

if (!isset($sAppName)) {
	if (isset($_POST['appName'])) {
		$sAppName = $_POST['appName'];
	}

	if (isset($_GET['appName'])) {
		$sAppName = $_GET['appName'];
	}
}
else {
	//error_log('AppName : ('.$sAppName.')');
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
	session_start([
		'name'=>$sAppName
	]); //on démarre la session
}
catch (Exception $e) {
	error_log('-------- Crash Session -------');
	error_log($e->getTraceAsString());
	error_log('----------');
	error_log(var_export($_SESSION, true));
	error_log('------------------------------');
}

//---- Est-ce une nouvelle session ?
$bNewSess = true;
if (isset($_SESSION['AppName'])) {
	if ($_SESSION['AppName']===$sAppName) {
		$bNewSess = false;
	}
}

//$oSession->sessSpy();

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

/*
error_log('------- '.__FILE__.' ------');
error_log('------- '. session_id().' ------');
error_log(var_export($_SESSION[$sAppName],true));
error_log('-----------------------------------');

*/
