<?php

include_once '..\commun\SessionClass.php';

//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();
$aVariables[] = 'usr_id';
$aVariables[] = 'opn_id';
$aVariables[] = 'odf_id';
$aVariables[] = 'etat';

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
$Bdd = new GestBdd($oSession->AppBase);
include("OperationsQry.php");

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
    case 'LstWorkStnOpe':
        $sQry = sprintf($aOperations['workstncurrope'], $aSpecFilter['rsc_id']);

        //---- Liste des opérations possibles pour un équipement
        if (isset($aSpecFilter['noof'])) {
            $sQry = sprintf($aOperations['workstncurrope'], $aSpecFilter['rsc_id']) . ', @ODF_CODE=\'' . $aSpecFilter['noof'] . '\'';
        }

        $aListe = $Bdd->QryToArray($sQry);
        if (isset($aListe)) {
            $bSucces = true;
        } else {
            $bSucces = false;
        }
        break;

    case 'LstOfOpe':
        //---- Liste des opérations possibles pour un n° d'OF
        $aListe = $Bdd->QryToArray(sprintf($aOperations['ofcurrope'], $aSpecFilter['odf_id']));
        $bSucces = (count($aListe) > 0);
        break;

    case 'realOpeOf':
        //---- Liste des opérations réalisées sur un OF
        // si le paramère opn_estrealisable est fourni on le passe à la procédure stockée, on ne recevra que les opérations réalisables
        if (isset($aSpecFilter['opn_estdisponible'])) {
            $sFilter = '@ODF_ID = ' . $aSpecFilter['odf_id'] . ',@OPN_ESTDISPONIBLE = ' . $aSpecFilter['opn_estdisponible'];
        }
        // sinon on ne passe que l'odf_id, on recevra toutes les opérations
        else {
            $sFilter = '@ODF_ID = ' . $aSpecFilter['odf_id'];
        }

        $aListe = $Bdd->QryToArray(sprintf($aOperations['realopeof'], $sFilter));
        $bSucces = (count($aListe) > 0);
        break;

    case 'realOpeOfCsl':
        //---- Liste des opérations réalisées sur un OF
        // si le paramère opn_estrealisable est fourni on le passe à la procédure stockée, on ne recevra que les opérations réalisables
        if (isset($aSpecFilter['opn_estdisponible'])) {
            $sFilter = '@ODF_ID = ' . $aSpecFilter['odf_id'] . ',@OPN_ESTDISPONIBLE = ' . $aSpecFilter['opn_estdisponible'];
        }
        // sinon on ne passe que l'odf_id, on recevra toutes les opérations
        else {
            $sFilter = '@ODF_ID = ' . $aSpecFilter['odf_id'];
        }

        $aListe = $Bdd->QryToArray(sprintf($aOperations['realopeofcsl'], $sFilter));
        $bSucces = (count($aListe) > 0);
        break;

    case 'OfList':
        // variable pour contenir les options à passer à la procédure SQL
        $sFilter = '';
        if (isset($aSpecFilter['rsc_id'])) {
            // le paramètre rsc_id a été reçu, on ne va retourner que les opérations réalisables sur cet équipement
            $sFilter = '@ODF_CODE = ' . $aSpecFilter['odf_code'] . ', @RSC_ID = ' . $aSpecFilter['rsc_id'];
        } else {
            // on n'a reçu que le paramètre odf_code
            $sFilter = '@ODF_CODE = ' . $aSpecFilter['odf_code'];
        }

        //---- Liste des OF dont le numéro contient odf_code (complet ou partiel)
        $aListe = $Bdd->QryToArray(sprintf($aOperations['opnlistbyofid'], $sFilter));
        // $aListe = $Bdd->QryToArray(sprintf($aOperations['oflist'], $aSpecFilter['odf_code']));
        if (isset($aListe)) {
            $bSucces = true;
        } else {
            $bSucces = false;
        }
        break;

        /**
         * @author  Hervé Valot
         * @description retourne la liste des opérations d'un OF ou réalisables sur un équipement en fonction des paramètres reçus
         * @method  GET
         */
    case 'OpnList':
        // variable pour contenir les options à passer à la procédure SQL
        $sFilter = '';
        if (isset($aSpecFilter['rsc_id'])) {
            // le paramètre rsc_id a été reçu, on ne va retourner que les opérations réalisables sur cet équipement
            $sFilter = '@ODF_CODE = ' . $aSpecFilter['odf_code'] . ', @RSC_ID = ' . $aSpecFilter['rsc_id'];
        } else {
            // on n'a reçu que le paramètre odf_code
            $sFilter = '@ODF_CODE = ' . $aSpecFilter['odf_code'];
        }

        //---- Liste des OF dont le numéro contient odf_code (complet ou partiel)
        $aListe = $Bdd->QryToArray(sprintf($aOperations['oflistbyressource'], $sFilter));
        // $aListe = $Bdd->QryToArray(sprintf($aOperations['oflist'], $aSpecFilter['odf_code']));
        $bSucces = (count($aListe) > 0);
        break;

        /**
         * @author  Hervé Valot
         * @description retourne la liste des opérations complémentaires
         * @method  GET
         */
    case 'OpCompList':
        $sFilter = '';
        $sFilter = '@TYPE = ' . $aSpecFilter['oct_id'];
        $aListe = $Bdd->QryToArray(sprintf($aOperations['opcomplist'], $sFilter));
        $bSucces = (count($aListe) > 0);
        break;

        /**
         * @author  Hervé Valot
         * @date    20200916
         * @description marque une opération non réalisée
         * @method  PATCH
         */
    case 'setNonRealisee':
        $Bdd->QryExec(sprintf($aOperations['setnonrealisee'], $usr_id, $opn_id));
        $bSucces = $Bdd->aExecReq['success'];
        break;

        /**
         * @author  Hervé VALOT
         * @date    20200918
         * @description  efface les opérations elligibles de l'OF et l'OF si il ne reste plus d'opération
         * @method     DELETE
         */
    case 'deleteOpn':
        $Bdd->QryExec(sprintf($aOperations['deleteopn'], $odf_id));
        $bSucces = $Bdd->aExecReq['success'];
        break;

        /**
         * @author  Hervé VALOT
         * @date    20201011
         * @description défini l'état d'une opération passée par son ID
         * @method  PUT
         */
    case 'setOpnState':
        /* les variables utilisées
        - $opn_id, identifiant de l'opération à traiter
        - $etat, indique l'état cible pour l'opération
            - AF, à faire
            - CO, commencée
            - TE, terminée
            - NR, on réalisée, requiert l'id de l'utilisateur
            - DL, supprimée (suppresson physique dans la base de données)
        - $usr_id, identifiant de l'utilisateur à l'origine du changement d'état

        les traitements spécifiques sont gérés par la procédure stockée SQL
        */

        // état cible : NON REALISE
        if ($etat == 'NR') {
            $Bdd->QryExec(sprintf($aOperations['setnonrealisee'], $usr_id, $opn_id));
            $bSucces = $Bdd->aExecReq['success'];
        }
        // état cible : SUPPRIMER - supprime physiquement l'opération
        elseif ($etat == 'DL') {
            $Bdd->QryExec(sprintf($aOperations['deleteopnsingle'], $opn_id));
            $bSucces = $Bdd->aExecReq['success'];
        }
        // état cible :  A FAIRE ou COMMENCEE ou TERMINEE - agit sur les dates de début et fin réelles
        else {
            $Bdd->QryExec(sprintf($aOperations['setopnstate'], $opn_id, $Bdd->FormatSql($etat, 'C')));
            $bSucces = $Bdd->aExecReq['success'];
        }

        break;
}

switch ($action) {
        // actions de type GET
    case 'LstWorkStnOpe':
    case 'LstOfOpe':
    case 'realOpeOf':
    case 'realOpeOfCsl':
    case 'OfList':
    case 'OpnList':
    case 'OpCompList':
        if (isset($aListe)) {
            $oJson = array(
                "success" => $bSucces,
                "NbreTotal" => count($aListe),
                "liste" => $aListe
            );
        } else {
            $oJson = array(
                "success" => $bSucces,
                "NbreTotal" => 0,
                "liste" => $aListe
            );    
        }
        
        $oJson = array(
            "success" => $bSucces,
            "NbreTotal" => count($aListe),
            "liste" => $aListe
        );
        break;
        // actions de type PUT,PATCH,DELETE
    case 'setOpnState':
    case 'setNonRealisee':
    case 'deleteOpn':
        $oJson = array(
            'success' => $bSucces,
            "errorMessage" => $Bdd->aExecReq
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
