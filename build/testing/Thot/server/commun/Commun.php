<?php

include_once '..\commun\SessionClass.php';

//---- Déclaration des variables
$Comptage = false;
$aVariables = array();
$aVariables[] = "nomliste";
$aVariables[] = "param";
$aVariables[] = "mail";
$aVariables[] = "nomformulaire";
$aVariables[] = "idmenu";
$aVariables[] = "idobsolete";

require("../variablesEtFiltres.php");
$bDebug = false;

if ($bDebug) {
	error_log("_POST : " . var_export($_POST, true));
	error_log("_GET : " . var_export($_GET, true));
}

//---- Include de la classe de gestion des données ----
//include("../Bdd.php");
$Bdd = new GestBdd($oSession->AppBase);

//---- Include de la liste des requêtes de structures (doit être fait après l'instanciation de $Bdd) ----
include("../RequetesStr.php");
include("CommunReq.php"); //liste des requetes

$aMaj = array();
$bSucces = false;

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
	case "SaveParamForm":
		$bSaveLabels = false;
		$IdWidget = 0;
		$oParam = json_decode($param);
		//---- On test si le widget existe
		$aInfosWidget = $Bdd->QryToArray(sprintf($sReqInfosForm, $Bdd->FormatSql($oParam->alias, 'C'), "''"));

		if (count($aInfosWidget) > 0) {
			//---- Il existe : On met à jour... (seulement si les valeurs sont différentes)
			$IdWidget = $aInfosWidget[0]["idformulaire"];

			if ($oParam->top <> $aInfosWidget[0]["toppos"] || $oParam->left <> $aInfosWidget[0]["leftpos"] || $oParam->height <> $aInfosWidget[0]["height"] || $oParam->width <> $aInfosWidget[0]["width"]) {
				$Bdd->Begin();
				$aExecReq = $Bdd->QryToArray(sprintf($sReqUpdate, 'sys_mip_form', 'toppos=' . $oParam->top . ', leftpos=' . $oParam->left . ', height=' . $oParam->height . ', width=' . $oParam->width, 'idformulaire=' . $IdWidget
				));
				$bTransacOk = $aExecReq[0];

				if ($bTransacOk) {
					$Bdd->Commit();
				}
				else {
					$Bdd->Rollback();
				}
			}

			$bSaveLabels = true;
		}
		else {
			//---- Il n'existe pas : on le crée
			$Bdd->Begin();
			$aExecReq = $Bdd->QryToArray(sprintf($sReqCreateWidget, $Bdd->FormatSql($oParam->alias, "C"), $Bdd->FormatSql($oParam->top, "N"), $Bdd->FormatSql($oParam->left, "N"), $Bdd->FormatSql($oParam->height, "N"), $Bdd->FormatSql($oParam->width, "N")
			));
			$bTransacOk = $aExecReq[0];

			if ($bTransacOk) {
				$IdWidget = $Bdd->DernierEnreg('sys_mip_form');
				//$aExecReq = $Bdd->QryToArray(sprintf($sReqCreateWidgetGroup,$IdWidget));
				//$bTransacOk = $aExecReq[0];
			}

			if ($bTransacOk) {
				$bSaveLabels = true;
				$Bdd->Commit();
			}
			else {
				$iNoErr = $aExecReq[1];
				$Bdd->Rollback();
			}
		}

		//---- On crée les libellés (si besoin) et on les rattache au widget
		if ($bSaveLabels) {
			$aTmpFormGroup = $Bdd->QryToArray(sprintf($sReqGroupList, $IdWidget));
			$aFormGroup = $Bdd->TblIndiceCol($aTmpFormGroup, "groupname");

			for (reset($oParam->labels); $sGroup = key($oParam->labels); next($oParam->labels)) {
				$IdGroup = $aFormGroup[$sGroup]['idgroup'];

				for (reset($oParam->labels->$sGroup); $sLabel = key($oParam->labels->$sGroup); next($oParam->labels->$sGroup)) {
					//---- Création du libellé (et récupération de son Id)
					$aLabel = $Bdd->QryToArray(sprintf($sReqCreateLabel, $Bdd->FormatSql($sLabel, "C"), $Bdd->FormatSql($oParam->labels->$sGroup->$sLabel, "C")));

					if (count($aLabel) > 0) {
						//---- Rattachement du libellé au groupe du widget
						$Bdd->Begin();
						$aExecReq = $Bdd->QryToArray(sprintf($sReqAttachLabel, $IdWidget, $IdGroup, $aLabel[0]['idlibelle']));

						$bTransacOk = $aExecReq[0];

						if ($bTransacOk) {
							$Bdd->Commit();
						}
						else {
							$Bdd->Rollback();
						}
					}
				}
			}
		}
		break;

	//---- Détails d'un formulaire (pour ouverture)
	case "FormDetails":
		$oParam = json_decode($param);
		$sTitleLib = "";
		$sTitle = "";

		if (isset($oParam->title)) {
			switch (gettype($oParam->title)) {
				case "object":
					//---- Si le paramètre title à été précisé, ET que c'est un objet utilise la propriété
					//	'code' comme code libellé pour le titre de fenêtre
					$sTitleLib = $oParam->title->code;
					break;
				case "string":
					//---- Si c'est une chaîne, c'est le titre en clair
					$sTitle = $oParam->title;
					break;
			}
		}

		$aTmpInfosWidget = array();
		$aInfosWidget = array();
		$aGridConfig = array();
		$aFormLabels = array();

		if (isset($_SESSION[$_SESSION['AppName']]["UTILISATEUR"])) {
			$aTmpInfosWidget = $Bdd->QryToArray(sprintf($sReqInfosForm, $Bdd->FormatSql($oParam->alias, 'C'), $Bdd->FormatSql($sTitleLib, 'C'), $_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["idutilisateur"]));
		}

		if (count($aTmpInfosWidget) > 0) {
			if ($sTitleLib != "") {
				//---- Si un code libellé à été précisé pour le titre...
				if ($aTmpInfosWidget[0]['_libelle'] != "") {
					//... et si ce libellé à été trouvé, on l'utilise
					foreach ($oParam->title as $sKey => $sValue) {
						if ($sKey != "code") {
							//---- On remplace les variables par leur valeurs
							$aTmpInfosWidget[0]['_libelle'] = str_replace("{" . $sKey . "}", $sValue, $aTmpInfosWidget[0]['_libelle']);
						}
					}

					//---- Et on remplace le libellé du titre par ce libellé
					$aTmpInfosWidget[0]['libelle'] = $aTmpInfosWidget[0]['_libelle'];
				}
			}

			if ($sTitle != "") {
				//---- Si le libellé à été passé en clair, on l'utilise tel quel
				$aTmpInfosWidget[0]['libelle'] = $sTitle;
			}

			$aGridConfig = $Bdd->QryToArray(sprintf(
							$sReqGridConfig, $Bdd->FormatSql($oParam->alias, 'C'), $_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["idutilisateur"], $Bdd->FormatSql("GridConfig", 'C')
			));

			$aInfosWidget = $aTmpInfosWidget[0];
			$aTmpFormLabels = $Bdd->QryToArray(sprintf($sReqFormLabels, $aInfosWidget['idformulaire']));
			$sGroupName = "";
			$sLabelName = "";
			$sLabel = "";

			for ($IndLab = 0; $IndLab < count($aTmpFormLabels); $IndLab++) {
				$sLabelName = $aTmpFormLabels[$IndLab]['labelname'];
				$sLabel = $aTmpFormLabels[$IndLab]['libelle'];

				if ($aTmpFormLabels[$IndLab]['groupname'] != $sGroupName) {
					$sGroupName = $aTmpFormLabels[$IndLab]['groupname'];
					$aFormLabels[$sGroupName] = array();
				}

				$aFormLabels[$sGroupName][$sLabelName] = $sLabel;
			}
		}
		break;

	case "addbookmarks":
		$aMaj['codeerr'] = "";
		//---- On commence par vérifier s'il existe déjà
		$aFindBookmark = $Bdd->QryToArray(sprintf($sReqFindBookmark, $idmenu, $_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["idutilisateur"]));

		if (count($aFindBookmark) > 0) {
			$aMaj['codeerr'] = 'bookmarkexist';
		}
		else {
			$aExecReq = $Bdd->QryToArray(
					sprintf($sReqCreateBookmark, $_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["idutilisateur"], $Bdd->FormatSql($nomformulaire, "C"), $idmenu
					)
			);
			$bSucces = $aExecReq[0];
		}

		break;

	//---- Detail d'une liste
	case "DetListe" :
		$nomliste = '';
		$idobsolete = '';

		if (isset($aSpecFilter['nomliste'])) {
			$nomliste = $aSpecFilter['nomliste'];
		}

		if (isset($aSpecFilter['idobsolete'])) {
			$idobsolete = $aSpecFilter['idobsolete'];
		}

		$aListe = $Bdd->QryToArray(sprintf($ReqDetListe, $nomliste, $idobsolete)); //,''));
		$iEnregTotal = count($aListe);
		$bSucces = true;
		break;

	//---- Suppression d'un verrou
	case "SuppVerrou" :
		$EtatVerrou = $Bdd->SuppVerrou($from, $idenreg);
		$bSucces = $EtatVerrou[0];
		break;

	case "LitParametres" :
		$aListe = $_SESSION[$_SESSION['AppName']]["PARAMETRES"];
		$iEnregTotal = count($aListe);
		$bSucces = true;
		break;

	case "SendMail" :
		require("../class.phpmailer.php");
		require("../usr/UtilisateurReq.php");

		$iIdUtil = $_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["idutilisateur"];
		$sMailUtil = $_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["adresseemail"];
		$sNomUtil = $_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["prenom"] . ' ' . $_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["nom"];
		$oEMail = json_decode($mail);
		//$Bdd->Erreur(var_export($oEMail, true));
		$sSujet = $oEMail->subject;
		$sMessage = $oEMail->message;
		$aPieces = $oEMail->attachment;

		//---- Envoie du mail
		$oMail = new PHPMailer($_SESSION[$_SESSION['AppName']]["PARAMETRES"]["smtp"]);
		//$oMail->bStockeErr=true;
		$oMail->IsSMTP();
		$oMail->CharSet = "utf-8";

		//---- Les adresses
		//--- Expediteur
		$oMail->SetFrom($sMailUtil, $sNomUtil);
		$oMail->AddReplyTo($sMailUtil, $sNomUtil);

		//--- Destinataire(s)
		if (count($oEMail->to) > 0) {
			$aDest = $Bdd->QryToArray(sprintf($sInfosMail, join(",", $oEMail->to)));

			for ($IndDest = 0; $IndDest < count($aDest); $IndDest++) {
				$oMail->AddAddress($aDest[$IndDest]["adresseemail"], $aDest[$IndDest]["nom"] . ' ' . $aDest[$IndDest]["prenom"]);
			}
		}

		//--- Destinataire(s) en copie
		if (count($oEMail->cc) > 0) {
			$aDest = $Bdd->QryToArray(sprintf($sInfosMail, join(",", $oEMail->cc)));

			for ($IndDest = 0; $IndDest < count($aDest); $IndDest++) {
				$oMail->AddCC($aDest[$IndDest]["adresseemail"], $aDest[$IndDest]["nom"] . ' ' . $aDest[$IndDest]["prenom"]);
			}
		}

		//--- Destinataire(s) en copie cachée
		if (count($oEMail->cci) > 0) {
			$aDest = $Bdd->QryToArray(sprintf($sInfosMail, join(",", $oEMail->cci)));

			for ($IndDest = 0; $IndDest < count($aDest); $IndDest++) {
				$oMail->AddBCC($aDest[$IndDest]["adresseemail"], $aDest[$IndDest]["nom"] . ' ' . $aDest[$IndDest]["prenom"]);
			}
		}

		//---- Le sujet et le texte
		$oMail->Subject = $Bdd->Encode($sSujet);
		$sMessageText = str_replace("<BR>", "\r\n", $sMessage);
		$sMessageHTML = "<p style='font-family: verdana, arial, sans-serif;'>" . $sMessage . "</p>";
		$oMail->AltBody = str_replace("<BR>", "\r\n", $sMessageText); // message texte
		$oMail->MsgHTML($Bdd->Encode($sMessageHTML));

		//---- Les pièces jointes
		for ($IndPce = 0; $IndPce < count($aPieces); $IndPce++) {
			$aPiece = $aPieces[$IndPce];
			$oMail->AddAttachment($aPiece->path, $aPiece->name);
		}

		$bSucces = $oMail->Send();
		break;

	case 'killsess':
		//---- Suppression de tous les verrous de cette session
		$aExecReq = $Bdd->QryToArray(sprintf($Bdd->SysLock['del']['session'], session_id()));
		//---- Suppression de la session
		$oSession->destroy(session_id());
		unset($oSession);
		//error_log(session_id());
		break;
}

switch ($action) {
	case "DetListe":
		if (intval($itemvide) > 0) {
			$aListe = $Bdd->AjoutItemVide($aListe);
			$iEnregTotal++;
		}

		$oJson = array(
			"success" => $bSucces,
			"NbreTotal" => $iEnregTotal,
			"liste" => $aListe
		);
		break;

	case "SendMail" :
	case "SaveParamForm":
	case "SuppVerrou" :
		$oJson = array(
			"success" => $bSucces,
			"errorMessage" => "Erreur..."
		);
		break;

	case "addbookmarks":
		$oJson = array(
			"success" => $bSucces,
			"errorMessage" => $aMaj['codeerr']
		);
		break;

	case "FormDetails":
		$oJson = array(
			"success" => $bSucces,
			"form" => $aInfosWidget,
			"gridconfig" => $aGridConfig,
			"translation" => $aFormLabels
		);
		break;

	case 'killsess':
		$oJson = array(
			"success" => true,
		);
		break;

	default :
		$oJson = array(
			"success" => $bSucces,
			"NbreTotal" => $iEnregTotal,
			"liste" => $aListe
		);
		break;
}

echo json_encode($oJson);
?>
