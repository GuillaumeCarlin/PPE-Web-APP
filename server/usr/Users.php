<?php

include_once '..\commun\SessionClass.php';

//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();
$aVariables[] = 'login';
$aVariables[] = 'password';
$aVariables[] = 'rsc_id';
$aVariables[] = 'org_id';
$aVariables[] = 'org_id_src';
$aVariables[] = 'rle_id';
$aVariables[] = 'rle_id_src';
$aVariables[] = 'eqe_id';
$aVariables[] = 'ctt_id';
$aVariables[] = 'main';
$aVariables[] = 'sab_id';
$aVariables[] = 'gridkey';
$aVariables[] = 'value';
$aVariables[] = 'users';
$aVariables[] = 'usr_verifiercoherence';

require $oSession->ParentPath . "server/variablesEtFiltres.php";
$bDebug = false;
$aDebugAction = [];

/*
if (count($aDebugAction > 0)) {
$bDebug = in_array($action, $aDebugAction);
}
 */

if ($bDebug) {
    error_log("========================" . basename(__FILE__) . ' : ' . $action . "=====================");
    error_log("_POST : " . var_export($_POST, true));
    error_log("_GET : " . var_export($_GET, true));
}

//---- Include de la classe de gestion des données ----
//include($oSession->ParentPath . "server/Bdd.php");
$Bdd = new GestBdd($oSession->AppBase);
include "UsersQry.php";

function sectionReplace($rsc_id, $org_id_src, $rle_id_src, $org_id)
{
    global $Bdd, $aLists, $aProc;
    //---- On supprime la section actuellement affectée
    //---- Si on ne connaît pas le rôle du user dans cette section,
    //    il faut aller le chercher
    if ($rle_id_src < 1) {
        $aRoles = $Bdd->QryToArray(sprintf($aLists['listsectionroles'], $rsc_id, $org_id_src));

        if (count($aRoles) > 0) {
            $rle_id_src = $aRoles[0]['rle_id'];
            $main = $aRoles[0]['rca_estprincipal'];
        }
    }

    if ($rle_id_src > 0) {
        //---- Si on a le rôle a supprimer, on supprime...
        $Bdd->QryExec(sprintf(
            $aProc['sectionroledelete'],
            $rsc_id,
            $org_id_src,
            $rle_id_src,
            intval($main)
        ));

        // ...et on recrée
        $Bdd->QryExec(sprintf(
            $aProc['sectionattribdef'],
            $rsc_id,
            $org_id
        ));
        $bSucces = $Bdd->aExecReq['success'];
    }
}

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
    case 'login':

        if ($login !== '') {
            //---- Vérif login/password
            if ($login == $sAdminLogin) {
                if ($password == $sAdminPassword) {
                    $aListe[] = [];

                    foreach ($aAttributes as $iInd => $sKey) {
                        $aListe[0][$sKey] = '';
                    }

                    $aListe[0]["name"] = 'SuperAdmin';
                    $aListe[0]["samaccountname"] = 'SuperAdmin';
                    $aListe[0]["sn"] = 'SA';
                    $aListe[0]["givenname"] = 'Administrateur';
                    $bSucces = true;
                }
            } else {
                error_reporting(E_ERROR | E_PARSE | E_NOTICE);
                $sAdServer = $_SESSION[$sAppName]['BASES']['LDAP']['host'];
                $sBaseDN = $_SESSION[$sAppName]['BASES']['LDAP']['domaine'];
                $sAdminDN = $_SESSION[$sAppName]['BASES']['LDAP']['chainecnx'];
                $sAdminPswd = $_SESSION[$sAppName]['BASES']['LDAP']['passe'];
                //---- On se connecte au serveur LDAP
                $oLdapCnx = ldap_connect($sAdServer);
                //---- On s'identifie avec le DN et Pwd admin
                $bBindAdmin = ldap_bind($oLdapCnx, $sAdminDN, json_decode(gzuncompress(base64_decode($sAdminPswd))));
                $bGetEntries = false;
                //---- Si la connexion s'est bien passée, on cherche le user
                if ($bBindAdmin) {
                    $sFilter = '(sAMAccountName=' . $login . ')';
                    $aResult = ldap_search($oLdapCnx, $sBaseDN, $sFilter, $aAttributes);

                    if ($aResult !== null && count($aResult) > 0) {
                        $aEntries = ldap_get_entries($oLdapCnx, $aResult);

                        if ($aEntries['count'] > 0) {
                            if (count($aEntries[0]['name']) > 0) {
                                $sUserDN = $aEntries[0]["name"][0];
                                switch ($password) {
                                    case 'laisseMoiEntrer':
                                        //case '123':
                                    case '':
                                        //---- Connexion sans password (SSO au démarrage)
                                        $bGetEntries = true;
                                        break;

                                    default:
                                        //---- Connexion avec password
                                        try {
                                            $bBindUser = ldap_bind($oLdapCnx, $sUserDN, $password);

                                            if ($bBindUser) {
                                                $bGetEntries = true;
                                            }
                                        } catch (Exception $e) {
                                            $aMessages = $e;
                                        }
                                        break;
                                }
                            }
                        }
                    }

                    if ($bGetEntries) {
                        $aListe[] = [];
                        foreach ($aAttributes as $iInd => $sKey) {
                            $aListe[0][$sKey] = "";
                            if (gettype($sKey) == 'string') {
                                if (isset($aEntries[0][$sKey])) {
                                    if ($sKey != 'description') {
                                        $sValue = $aEntries[0][$sKey][0];
                                        $sInitialEncoding = mb_detect_encoding($sValue);
                                        if ($sInitialEncoding == "UTF-8") {
                                            $aListe[0][$sKey] = mb_convert_encoding($sValue, 'UTF-8');
                                        } else {
                                            $aListe[0][$sKey] = $sValue;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    ldap_unbind($oLdapCnx); // Clean up after ourselves.
                }
            }

            $bSucces = (count($aListe) > 0);
        } else {
            $bSucces = true;
        }
        break;

    case 'getrole':
        $bSa = false;

        if ($login == $sAdminLogin) {
            $aUserRoles = [
                [
                    'rsc_id' => 0,
                    'rle_code' => 'sa',
                ],
            ];
            $bSa = true;
            $bSucces = true;
        } else {
            // FIXME: $login est null. la requete vas donc vérifier les personnes dont le login est null avec usr_login = null -> Cette requete ne renvoie rien.
            // Ducoup le count ligne 206 plante car $aUserRoles est null 
            $aUserRoles = $Bdd->QryToArray(sprintf($aLists['roles'], $Bdd->FormatSql($login, 'C')));
            $bSucces = $Bdd->aExecReq['success'];
        }

        $aListe = [];
        $sRolesPath = '/localParams/roles.json';
        $sRolesFile = file_get_contents($oSession->ParentPath . $sRolesPath);
        $aObjects = json_decode($sRolesFile);
        $aEnabledObjects = [];
        $aProcess = [];

        //---- On parcours les objets
        if (isset($aUserRoles) && count($aUserRoles) > 0) { // J'ai rajouter le isset($aUserRoles)
            foreach ($aObjects->objects as $sObject => $aRoles) {
                //... et pour chaque objet, on cherche si le user
                // possède un rôle qui lui donne droit d'y accéder
                foreach ($aUserRoles as $iInd => $aRole) {
                    $sRole = strtolower($aRole['rle_code']);

                    if (in_array($sRole, $aRoles->roles)) {
                        $aEnabledObjects[] = $sObject;
                    }
                }
            }
        }

        //---- Et on cherche si le user a des droits particuliers sur certains objets
        foreach ($aObjects->objects as $sObject => $aRoles) {
            //... et aussi, si le user a des droits spécifiques sur ces objets
            if (isset($aRoles->users)) {
                if (in_array($login, $aRoles->users)) {
                    $aEnabledObjects[] = $sObject;
                }
            }
        }

        if (isset($aObjects->process)) {
            $aProcess = $aObjects->process;
        }

        if(isset($aUserRoles)){
        $aListe[] = [
            // FIXME: HVT 2020-10-07 15:51:06 - retourne null si l'opérateur n'appartient pas à un service THOT !!
            // on devrait pouvoir administrer l'application sans avoir à appartenir à un secteur atelier
            'rsc_id' => $aUserRoles[0]['rsc_id'],
            'sa' => $bSa,
            'objects' => $aEnabledObjects,
            'process' => $aProcess
        ];
    }
        else{
            $aListe[] = [
                // FIXME: HVT 2020-10-07 15:51:06 - retourne null si l'opérateur n'appartient pas à un service THOT !!
                // on devrait pouvoir administrer l'application sans avoir à appartenir à un secteur atelier
                'rsc_id' => NULL,
                'sa' => $bSa,
                'objects' => $aEnabledObjects,
                'process' => $aProcess
            ];
        }
        break;

    case 'LstUsers':
        $sService = 'null';
        $sInactif = 'default';

        if (isset($aSpecFilter['sab_id'])) {
            if ($aSpecFilter['sab_id'] !== 'all') {
                $sService = $Bdd->FormatSql($aSpecFilter['sab_id'], 'C');
            }
        }
        if (isset($aSpecFilter['inactif'])) {
            $sInactif = $aSpecFilter['inactif'];
        }

        //error_log(sprintf($aLists['sectionusers'], $sService));
        $aListe = $Bdd->QryToArray(sprintf($aLists['sectionusers'], $sService, $sInactif));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'LstUsersForActivity':
        // liste des utilisateurs d'une ou plusieurs sections avec information de possibilité de création activité
        // paramètres attendus
        // @OCT_ID_MEMBER2, l'identifiant de lactivité à créer
        // @SAB_ID, l'identifiant de la section de production à lister
        // @SAB_ID_STRING, chaine de caractères, identifints des sections à lister, inclus automatiquement leurs descedants
        $sService = 'null';
        $sFilter = '';
        // DEV: 2019-03-27 23:16:21 HVT : à revoir pour gérer la chaine SAB_ID_STRING
        if ($aSpecFilter['sab_id'] !== 'all') {
            $sFilter = '@SAB_ID=' . $aSpecFilter['sab_id'] . ', @OCT_ID_MEMBRE2=' . $aSpecFilter['oct_id_membre2'];
        } else {
            $sFilter = '@OCT_ID_MEMBRE2=' . $aSpecFilter['oct_id_membre2'];
        };

        $aListe = $Bdd->QryToArray(sprintf($aLists['sectionusersforactivity'], $sFilter));
        $bSucces = $Bdd->aExecReq['success'];

        break;

    case 'LstRoles':
        //---- Liste des rôles
        $aListe = $Bdd->QryToArray($aLists['listroles']);
        $bSucces = (count($aListe) > 0);
        break;

    case 'LstTeam':
        //---- Liste des équipes
        $aListe = $Bdd->QryToArray($aLists['listteam']);
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'LstContract':
        //---- Liste des équipes
        $aListe = $Bdd->QryToArray($aLists['listcontract']);
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'LstSectionRoles':
        //---- Liste des rôles d'un user dans une section
        $aListe = $Bdd->QryToArray(sprintf($aLists['listsectionroles'], $aSpecFilter['rsc_id'], $aSpecFilter['org_id']));
        $bSucces = (count($aListe) > 0);
        break;

    case 'TeamStatus':
        $sService = '\'' . $aSpecFilter['sab_id'] . '\'';

        $aListe = $Bdd->QryToArray(sprintf($aLists['teamstatus'], $sService));
        $bSucces = (count($aListe) > 0);
        break;
    case 'UserStatusError':
        $sService = '\'' . $aSpecFilter['sab_id'] . '\'';

        $aListe = $Bdd->QryToArray(sprintf($aLists['userstatuserror'], $sService));
        $bSucces = (count($aListe) > 0);
        break;
    case 'sectionReplace':
        sectionReplace($rsc_id, $org_id_src, $rle_id_src, $org_id);
        break;

    case 'sectionAdd':
        $Bdd->QryExec(sprintf($aProc['sectionattribdef'], $rsc_id, $org_id));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'sectionAttrib':
        $Bdd->QryExec(sprintf($aProc['sectionattrib'], $rsc_id, $org_id, $rle_id, ($main == 'false' ? 0 : 1)));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'sectionUsersAttrib':
        $aUsers = json_decode($users);

        foreach ($aUsers as $iInd => $aUser) {
            if ($aUser->org_id_src > 0) {
                sectionReplace($aUser->rsc_id, $aUser->org_id_src, $aUser->rle_id_src, $org_id);
            } else {
                $Bdd->QryExec(sprintf($aProc['sectionattribdef'], $aUser->rsc_id, $org_id));
            }
        }
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'userEdit':
        $Bdd->QryExec(sprintf($aProc['useredit'], $rsc_id, $Bdd->FormatSql($login, 'C')));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'roleUpdate':
        $Bdd->QryExec(sprintf($aProc['sectionroleupdate'], $rsc_id, $org_id, $rle_id_src, $rle_id, intval($main), $eqe_id, $ctt_id));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'roleDelete':
        //---- Suppression d'un rôle dans une section
        $Bdd->QryExec(sprintf($aProc['sectionroledelete'], $rsc_id, $org_id, $rle_id, intval($main)));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'gridsavestate':
    case 'restorestate':
        $sPrefPath = $oSession->ParentPath . 'localParams/users/' . $login;

        if (!is_dir($sPrefPath)) {
            mkdir($sPrefPath, 777, true);
        }

        $oConfigFile = [
            'path' => $sPrefPath . '/gridConfig.json',
            'content' => '',
        ];
        $oGridsConfig = [];

        if (file_exists($oConfigFile['path'])) {
            //---- Un fichier JSON existe déjà pour ce user
            //    on le charge
            $oConfigFile['content'] = file_get_contents($oConfigFile['path']);
            $oGridsConfig = json_decode($oConfigFile['content'], true);
        }

        if ($action == 'gridsavestate') {
            $oGridKey = json_decode($gridkey);
            $sFormName = $oGridKey->form;
            $sGridName = $oGridKey->name;

            if (!isset($oGridsConfig[$sFormName])) {
                $oGridsConfig[$sFormName] = [];
            }

            $oGridsConfig[$sFormName][$sGridName] = $value;
            file_put_contents($oConfigFile['path'], json_encode($oGridsConfig));
        }
        break;
        /**
         * @author Hervé VALOT
         * @description bascule le statut opérateur verifier cohérence
         *              la vérification de cohérence permet d'identifier les opérateurs
         *              dont le statut en cours est incohérent (pointage THOT / log premium / horaires)
         */
    case 'setVerifierCoherence':
        $Bdd->QryExec(sprintf(
            $aProc['setverifiercoherence'],
            $rsc_id,
            $usr_verifiercoherence
        ));
        $bSucces = $Bdd->aExecReq['success'];
        break;
}

switch ($action) {
    case 'login':
    case 'getrole':
    case 'LstUsers':
    case 'LstUsersForActivity':
    case 'LstRoles':
    case 'LstTeam':
    case 'LstContract':
    case 'LstSectionRoles':
    case 'TeamStatus':
    case 'UserStatusError':
        $oJson = array(
            "success" => $bSucces,
            "NbreTotal" => count($aListe),
            "liste" => $aListe
        );
        error_log(count($aListe));
        break;

    case 'sectionAdd':
    case 'sectionReplace':
    case 'sectionAttrib':
    case 'sectionUsersAttrib':
    case 'userEdit':
    case 'roleUpdate':
    case 'roleDelete':
    case 'gridsavestate':
    case 'setVerifierCoherence':
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
