<?php

include_once '..\commun\SessionClass.php';

//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();
$aVariables[] = 'sab_id';
$aVariables[] = 'rsc_id';
$aVariables[] = 'org_id';
$aVariables[] = 'org_id_src';
$aVariables[] = 'wstn';
$aVariables[] = 'selection';
$aVariables[] = 'rsc_id_initial';
$aVariables[] = 'rsc_id_remplace';
$aVariables[] = 'mode';
$aVariables[] = 'opn_id';

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
include("WorkStnQry.php");

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
        /**
     * liste des équipements d'une ou plusieurs sectioons d'atelier
     * @param sab_id {String} liste des identificants des sections à lister
     * @param inactif {Boolean} indique si il faut retourner les équipements désactivés
     */
    case 'LstWorkStn':
        $sService = 'null';
        $sParm = '';

        if (isset($aSpecFilter['sab_id'])) {
            if ($aSpecFilter['sab_id'] !== 'all') {
                $sService = $Bdd->FormatSql($aSpecFilter['sab_id'], 'C');
            }
            $sParm .= ', @SAB_ID=' . $sService;
        };

        if (isset($aSpecFilter['inactif'])) {
            $sParm .= ', @INACTIF=' . $aSpecFilter['inactif'];
        };
        $aListe = $Bdd->QryToArray(sprintf($aLists['workstn2'], $sParm));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'WorkStnSelect':
        $sService = 'null';

        if (isset($aSpecFilter['sab_id'])) {
            if ($aSpecFilter['sab_id'] !== 'all') {
                $sService = $Bdd->FormatSql($aSpecFilter['sab_id'], 'C');
            }
        }

        // $aListe = $Bdd->QryToArray(sprintf($aLists['workstnselect'], $sService));
        $aListe = $Bdd->QryToArray(sprintf($aLists['workstnselect2'], $aSpecFilter['sab_id'], $aSpecFilter['usr_id']));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'wstnSectionAdd':
        $Bdd->QryExec(sprintf(
            $aProc['sectionwstnattrib'],
            $rsc_id,
            $org_id
        ));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'wstnSectionReplace':
        //---- On supprime la section actuellement affectée
        $Bdd->QryExec(sprintf(
            $aProc['sectionwstndelete'],
            $rsc_id,
            $org_id_src
        ));

        // ...et on recrée
        $Bdd->QryExec(sprintf(
            $aProc['sectionwstnattrib'],
            $rsc_id,
            $org_id
        ));
        $bSucces = $Bdd->aExecReq['success'];

        break;

    case 'wstnSectionDel':
        //---- On supprime la section actuellement affectée
        $Bdd->QryExec(sprintf(
            $aProc['sectionwstndelete'],
            $rsc_id,
            $org_id_src
        ));
        $bSucces = $Bdd->aExecReq['success'];

        break;

    case 'wstnSectionAttrib':
        $aWstns = json_decode($wstn);

        foreach ($aWstns as $iInd => $aWstn) {
            if ($aWstn->org_id_src > 0) {
                // TODO: 2019-03-20 14:27:45, HVT, désactivé ici mais prévoir la possibilité de transférer un équipement
                //---- On supprime la section actuellement affectée
                // $Bdd->QryExec(sprintf($aProc['sectionwstndelete'],
                //     $aWstn->rsc_id,
                //     $aWstn->org_id_src
                // ));

                // ...et on recrée
                $Bdd->QryExec(sprintf(
                    $aProc['sectionwstnattrib'],
                    $aWstn->rsc_id,
                    $org_id
                ));
            } else {
                $Bdd->QryExec(sprintf(
                    $aProc['sectionwstnattrib'],
                    $aWstn->rsc_id,
                    $org_id
                ));
            }
        }
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'setReplacement':
        // mettre à jour les données de remplacemet d'un équipement
        $Bdd->QryExec(sprintf(
            $aProc['setreplacement'],
            $selection,
            $rsc_id_initial,
            $rsc_id_remplace,
            0 // 2019-03-23 00:02:22 HVT, forcé à 0 tant que cette option n'est pas gérée
        ));
        $bSucces = $Bdd->aExecReq['success'];
        break;

        /**
         * @author  Hervé Valot
         * @date    20200408
         * @description retourne la liste des équipements utilisables pour la réalisation d'une opération
         *              prend en compte les remplacants définis dans le paramétrage équipement
         */
    case 'wstnListByOperation':
        // mise à jour de la requête et exécution pour retourner les informations demandées
        $aListe = $Bdd->QryToArray(sprintf($aLists['operationworkstn'], $aSpecFilter['opn_id']));
        $bSucces = $Bdd->aExecReq['success'];
        break;
}

switch ($action) {
    case 'LstWorkStn':
    case 'WorkStnSelect':
    case  'wstnListByOperation':
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
        break;

    case 'wstnSectionAdd':
    case 'wstnSectionReplace':
    case 'wstnSectionAttrib':
    case 'wstnSectionDel':
    case 'setReplacement':
        $oJson = array(
            "success" => $bSucces,
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
