<?php
/*
* Copyright (c) 2019 PQR-Informatique
*
* @Script: Message.php
* @Author: Hervé Valot
* @Email: hvalot@pqr-informatique.fr
* @Créé le: 2019-07-09 16:17:29
* @Modifié par: Hervé Valot
* @Modifié le: 2019-07-09 16:18:56
* @Description: API de gestion des mesages
*/

include_once '..\commun\SessionClass.php';

//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();
$aVariables[] = 'mso_id';
$aVariables[] = 'mso_rang';
$aVariables[] = 'mso_code';
$aVariables[] = 'mso_base';
$aVariables[] = 'mso_libelle';
$aVariables[] = 'mso_estinactif';

$aVariables[] = 'msg_id';
$aVariables[] = 'msg_id_parent';
$aVariables[] = 'msg_titre';
$aVariables[] = 'msg_texte';
$aVariables[] = 'rsc_id_redacteur';
$aVariables[] = 'rsc_id_destinataire';
$aVariables[] = 'act_id';
$aVariables[] = 'ala_id';

require($oSession->ParentPath . "server/variablesEtFiltres.php");
$bDebug = false;
$aDebugAction = [];



if ($bDebug) {
    error_log("========================" . basename(__FILE__) . ' : ' . $action . "=====================");
    error_log("_POST : " . var_export($_POST, true));
    error_log("_GET : " . var_export($_GET, true));
}

//---- Include de la classe de gestion des données ----
//include($oSession->ParentPath . "server/Bdd.php");
$Bdd = new GestBdd($oSession->AppBase);
include("MessageQry.php");

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
    case 'LstObjet': // obtenir la liste des objets disponibles
        $aListe = $Bdd->QryToArray($aMessageQry['listobjet']);
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'SaveNote': // enregistrer une nouvelle note
        $sParam = ''; // chaine pour contenir les paramètres de la procédure stockée
        // ajout des paramètres obligatoires
        $sParam .= ' @MSO_ID=' . $mso_id;
        $sParam .= ' , @RSC_ID_REDACTEUR=' . $rsc_id_redacteur;
        $sParam .= ' , @MSG_TITRE=' . $Bdd->FormatSql($msg_titre, 'C');
        $sParam .= ' , @MSG_TEXTE=' . $Bdd->FormatSql($msg_texte, 'U');

        // ajout des paramètres optionnels si définis
        if ($rsc_id_destinataire != '') {
            $sParam .= ' , @RSC_ID_DESTINATAIRE=' . $rsc_id_destinataire;
        }
        if ($act_id != '') {
            $sParam .= ' , @ACT_ID=' . $act_id;
        }
        if ($ala_id != '') {
            $sParam .= ' , @ALA_ID=' . $ala_id;
        }
        if ($msg_id_parent != '') {
            $sParam .= ' , @MSG_ID_PARENT=' . $msg_id_parent;
        }

        $Bdd->QryExec(sprintf(
            $aMessageQry['savenote'],
            $sParam
        ));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'LstNotes': // obtenir la liste des messages

        // Appelle de l'executable listnotes avec comme paramètre la variable idsection remis au format chaine de character
        $aListe = $Bdd->QryToArray(sprintf($aMessageQry['listnotes'], $Bdd->FormatSql($aSpecFilter["idsection"], 'C')));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'GetNoteDataById': // obtenir les données d'une note
        $aListe = $Bdd->QryToArray(sprintf($aMessageQry['getnotedatabyid'], $msg_id));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'UpdateNoteData': // mise à jour des informations de la note
        $sParametres = ''; // chaine contenant les paramètres de la requête

        // mise à jour des paramètres
        $sParametres .= ' @MSG_ID = ' . $msg_id;
        $sParametres .= ' , @MSO_ID = ' . $mso_id;
        $sParametres .= ' , @RSC_ID_REDACTEUR = ' . $rsc_id_redacteur;
        if ($rsc_id_destinataire != '') {
            $sParametres .= ' , @RSC_ID_DESTINATAIRE = ' . $rsc_id_destinataire;
        }
        $sParametres .= ' , @MSG_TITRE = ' . $Bdd->FormatSql($msg_titre, 'C');
        $sParametres .= ' , @MSG_TEXTE = ' . $Bdd->FormatSql($msg_texte, 'U');
        // exécution de la requête avec ses paramètres
        $Bdd->QryExec(sprintf($aMessageQry['updatenotebyid'], $sParametres));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'SetNoteReaden':
        $Bdd->QryExec(sprintf($aMessageQry['setnotereaden'], $msg_id));
        $bSucces = $Bdd->aExecReq['success'];
        break;
}

switch ($action) {
    case 'LstObjet':
    case 'LstNotes':
    case 'GetNoteDataById':
        $oJson = array(
            "success" => $bSucces,
            "NbreTotal" => count($aListe),
            "liste" => $aListe
        );
        break;

    case 'SaveNote':
    case 'UpdateNoteData':
    case 'SetNoteReaden':
        $oJson = array(
            "success" => $bSucces,
            "errorMessage" => $Bdd->aExecReq
        );
        break;

    case 'restorestate':
        $oJson = array(
            "success" => true,
            "state" => $oGridsConfig,
            "errorMessage" => ''
        );
        break;

    default:
        $oJson = array(
            "success" => false,
            "NbreTotal" => 0,
            "nomnoeud" => array()
        );
        break;
}

ob_clean(); // vide le output buffer, évite la présence de caractère \ufeff en tête de fichier JSON
echo json_encode($oJson);
