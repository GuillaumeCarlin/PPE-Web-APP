<?php

include_once  '..\commun\SessionClass.php';

//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();
$aVariables[] = 'stat_id';
$aVariables[] = 'stat_nom';
$aVariables[] = 'stat_prenom';
$aVariables[] = 'stat_atelier';
$aVariables[] = 'stat_tpsexige';
$aVariables[] = 'stat_tpsreleve';
$aVariables[] = 'stat_niveau';
$aVariables[] = 'listuser';


require($oSession->ParentPath . "server/variablesEtFiltres.php");
$bDebug = false;
$aDebugAction = [];

if ($bDebug) {
    error_log("========================" . basename(__FILE__) . ' : ' . $action . "=====================");
    error_log("_POST : " . var_export($_POST, true));
    error_log("_GET : " . var_export($_GET, true));
}

//---- Include de la classe de gestion des données ----
$Bdd = new GestBdd($oSession->AppBase);
include("StatistiqueQry.php");
switch ($action) {
    case 'LstUser':
        $Requete = $aStatistiqueQry['listuser'];
        if ($aSpecFilter['date'] == 'NaN' || isset($aSpecFilter['ToleranceMax']) || isset($aSpecFilter['ToleranceMin'])){
            $aSpecFilter['parametre'] = 'Automatique';
        }
        switch($aSpecFilter['parametre']){
            case 'Automatique':
                if($aSpecFilter['showdelete'] == 'true'){
                    $Requete = $Requete . ' @EstInactif = %1$s, @EstCoherent = %2$s, @Org = %3$s';
                    $aListe = $Bdd->QryToArray(sprintf($Requete, 1, 0, $Bdd->FormatSql($aSpecFilter['org'], 'C')));
                    break;
                }else{
                    $aListe = $Bdd->QryToArray($Requete);
                    break;
                }
            case 'Manuel':
                $Requete = $Requete . ' @Date = %1$s,  @ToleranceMax = %2$s, @ToleranceMin = %3$s, @Org = %4$s';
                if($aSpecFilter['showdelete'] == 'true'){
                    $Requete = $Requete . ', @EstInactif = %5$s, @EstCoherent = %6$s';
                    $aListe = $Bdd->QryToArray(sprintf($Requete, $Bdd->FormatSql($aSpecFilter['date'], 'C'), $Bdd->FormatSql($aSpecFilter['tolerancemax'], 'N'), $Bdd->FormatSql($aSpecFilter['tolerancemin'], 'N'),$Bdd->FormatSql($aSpecFilter['org'], 'C'), 1, 0));
                    break;
                }else{
                    $aListe = $Bdd->QryToArray(sprintf($Requete, $Bdd->FormatSql($aSpecFilter['date'], 'C'), $Bdd->FormatSql($aSpecFilter['tolerancemax'], 'N'), $Bdd->FormatSql($aSpecFilter['tolerancemin'], 'N'), $Bdd->FormatSql($aSpecFilter['org'], 'C')));
                    break;
                }
        }

        if(isset($aListe) && count($aListe) == 0){
            $bSucces = $Bdd->aExecReq['success'];
            break;
        }
        elseif (isset($aListe)) {
            foreach ($aListe as $key => $values) {
                $aListe[$key]["Bullet"] = [$aListe[$key]["tpsexigible"], $aListe[$key]["tpspointe"], $aListe[$key]["tolerancemax"], 0, $aListe[$key]["tolerancemin"]];
            }
            $bSucces = $Bdd->aExecReq['success'];
            break;
        }

    case 'LstEquipe':
        $Requete = $aStatistiqueQry['listequipe'];
        if ($aSpecFilter['date'] == 'NaN' || isset($aSpecFilter['ToleranceMax']) || isset($aSpecFilter['ToleranceMin'])){
            $aSpecFilter['parametre'] = 'Automatique';
        }
        switch($aSpecFilter['parametre']){
            case 'Automatique':
                if($aSpecFilter['showdelete'] == 'true'){
                    $Requete = $Requete . ' @EstInactif = %1$s, @EstCoherent = %2$s, @Org = %3$s';
                    $aListe = $Bdd->QryToArray(sprintf($Requete, 1, 0, $Bdd->FormatSql($aSpecFilter['org'], 'C')));
                    break;
                }else{
                    $aListe = $Bdd->QryToArray($Requete);
                    break;
                }
            case 'Manuel':
                $Requete = $Requete . ' @date = %1$s, @ToleranceMax = %2$s, @ToleranceMin = %3$s, @Org = %4$s';
                if($aSpecFilter['showdelete'] == 'true'){
                    $Requete = $Requete . ', @EstInactif = %5$s, @EstCoherent = %6$s';
                    $aListe = $Bdd->QryToArray(sprintf($Requete, $Bdd->FormatSql($aSpecFilter['date'], 'C'), $Bdd->FormatSql($aSpecFilter['tolerancemax'], 'N'),  $Bdd->FormatSql($aSpecFilter['tolerancemin'], 'N'), $Bdd->FormatSql($aSpecFilter['org'], 'C'), 1, 0));
                    break;
                }else{
                    $aListe = $Bdd->QryToArray(sprintf($Requete, $Bdd->FormatSql($aSpecFilter['date'], 'C'), $Bdd->FormatSql($aSpecFilter['tolerancemax'], 'N'),  $Bdd->FormatSql($aSpecFilter['tolerancemin'], 'N'), $Bdd->FormatSql($aSpecFilter['org'], 'C')));
                    break;
                }
        }
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'infopersonnesheet':
        $aListe = $Bdd->QryToArray(sprintf($aStatistiqueQry['listinfopersonne'], $Bdd->FormatSql($aSpecFilter['date'], 'C'), $Bdd->FormatSql($aSpecFilter["identifiant"], 'C')));
        $bSucces = $Bdd->aExecReq['success'];
        break;
    case 'infopersonnesheetd':
        $aListe = $Bdd->QryToArray(sprintf($aStatistiqueQry['listinfopersonned'], $Bdd->FormatSql($aSpecFilter['date'], 'C'), $Bdd->FormatSql($aSpecFilter["identifiant"], 'C')));
        $bSucces = $Bdd->aExecReq['success'];
        break;
    case 'getToleranceParam':
        $aListe = $Bdd->QryToArray(sprintf($aStatistiqueQry['gettoleranceparam']));
        $bSucces = $Bdd->aExecReq['success'];
        break;
    case 'LstAlerte':
        $Requete = $aStatistiqueQry['listalerte'];
        if(isset($aSpecFilter['date']) && $aSpecFilter['date'] != 'NaN'){
            $Requete = $Requete . ', @Date = %3$s';
            $aListe = $Bdd->QryToArray(sprintf($Requete, $Bdd->FormatSql($aSpecFilter['niveau'], 'C'), $Bdd->FormatSql($aSpecFilter['org'], 'C'), $Bdd->FormatSql($aSpecFilter['date'], 'C')));
        }else {
            $aListe = $Bdd->QryToArray(sprintf($Requete, $Bdd->FormatSql($aSpecFilter['niveau'], 'C'), $Bdd->FormatSql($aSpecFilter['org'], 'C')));
        }
        $bSucces = $Bdd->aExecReq['success'];
        break;
    case 'getDate':
       $aListe = $Bdd->QryToArray($aStatistiqueQry['getdate']);
       $bSucces = $Bdd->aExecReq['success'];
       break;
}

switch ($action) {
    case 'getDate' :
    case 'LstAlerte':
    case 'infopersonnesheet':
    case 'LstEquipe':
    case 'LstUser':
    case 'getToleranceParam':
    case 'infopersonnesheetd':
        if(isset($aListe)){
            $oJson = array(
                "success" => $bSucces,
                "NbreTotal" => count($aListe),
                "liste" => $aListe
            );
        }else{
            $oJson = array(
                "success" => $bSucces,
                "NbreTotal" => 0,
                "liste" => $aListe
            );
        }
        break;
}

echo json_encode($oJson);