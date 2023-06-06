<?php

//include_once  '..\commun\SessionClass.php';
$CnxDb = new PDO('sqlsrv:Server=10.30.103.67;Database=BD_THOT_THT', 'sa', '123456789+aze');
$CnxDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
function TestQry($Requete, $CnxDb){
    $oResult = $CnxDb->prepare($Requete); 
    $oResult->execute(); 
    $aListe = $oResult->fetchAll(PDO::FETCH_ASSOC);
    return $aListe;
}


if (isset($_GET['action'])) {
    $action = $_GET['action'];
}elseif (isset($_POST['action'])) {
    $action = $_POST['action'];
}


//$Requete = 'SELECT s_temps.F_S_SELECT_DATE_PROD_PREC() AS date';


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


include_once '../variablesEtFiltres.php';

$bDebug = false;
$aDebugAction = [];

if ($bDebug) {
    error_log("========================" . basename(__FILE__) . ' : ' . $action . "=====================");
    error_log("_POST : " . var_export($_POST, true));
    error_log("_GET : " . var_export($_GET, true));
}

//---- Include de la classe de gestion des données ----
//$Bdd = new GestBdd($oSession->AppBase);
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
                    $Requete = $Requete . ' @EstInactif = %1$s, @EstCoherent = %2$s, @Org = 3';
                    $Requete = sprintf($Requete, 1, 0);
                    $aListe = TestQry($Requete, $CnxDb);
                    break;
                }else{
                    //echo $Requete;
                    $aListe = TestQry($Requete, $CnxDb);
                    //var_dump($aListe);
                    break;
                }
            case 'Manuel':
                $Requete = $Requete . ' @Date = %1$s,  @ToleranceMax = %2$s, @ToleranceMin = %3$s, @Org = 3';
                if($aSpecFilter['showdelete'] == 'true'){
                    $Requete = $Requete . ', @EstInactif = %5$s, @EstCoherent = %6$s';
                    $aListe = TestQry(sprintf($Requete, $aSpecFilter['date'], $aSpecFilter['tolerancemax'], $aSpecFilter['tolerancemin'], 1, 0), $CnxDb);
                    break;
                }else{
                    $aListe = TestQry(sprintf($Requete, $aSpecFilter['date'], $aSpecFilter['tolerancemax'], $aSpecFilter['tolerancemin']), $CnxDb);
                    break;
                }
        }

        if(isset($aListe) && count($aListe) == 0){
            $bSucces = "success";
            break;
        }
        elseif (isset($aListe)) {
            foreach ($aListe as $key => $values) {
                $aListe[$key]["Bullet"] = [$aListe[$key]["TpsExigible"], $aListe[$key]["TpsPointe"], $aListe[$key]["ToleranceMax"], 0, $aListe[$key]["ToleranceMin"]];
            }
            $bSucces = "success";
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
                    $Requete = $Requete . ' @EstInactif = %1$s, @EstCoherent = %2$s, @Org = 3';
                    $aListe = TestQry(sprintf($Requete, 1, 0),$CnxDb);
                    break;
                }else{
                    $aListe = TestQry($Requete, $CnxDb);
                    break;
                }
            case 'Manuel':
                $Requete = $Requete . ' @date = %1$s, @ToleranceMax = %2$s, @ToleranceMin = %3$s, @Org = 3';
                if($aSpecFilter['showdelete'] == 'true'){
                    $Requete = $Requete . ', @EstInactif = %4$s, @EstCoherent = %5$s';
                    $aListe = TestQry(sprintf($Requete, $aSpecFilter['date'], $aSpecFilter['tolerancemax'], $aSpecFilter['tolerancemin'], 1, 0), $CnxDb);
                    break;
                }else{
                    $aListe = TestQry(sprintf($Requete, $aSpecFilter['date'], $aSpecFilter['tolerancemax'],  $aSpecFilter['tolerancemin']), $CnxDb);
                    break;
                }
        }
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'infopersonnesheet':
        $aListe = TestQry(sprintf($aStatistiqueQry['listinfopersonne'], $aSpecFilter['date'], $aSpecFilter["identifiant"]), $CnxDb);
        $bSucces = $Bdd->aExecReq['success'];
        break;
    case 'infopersonnesheetd':
        $aListe = TestQry(sprintf($aStatistiqueQry['listinfopersonned'], $aSpecFilter['date'], $aSpecFilter["identifiant"]), $CnxDb);
        $bSucces = $Bdd->aExecReq['success'];
        break;
    case 'getToleranceParam':
        $Requete = sprintf($aStatistiqueQry['gettoleranceparam']);
        $aListe = TestQry($Requete, $CnxDb);
        $bSucces = "success";
        break;
    case 'LstAlerte':
        $Requete = $aStatistiqueQry['listalerte'];
        if(isset($aSpecFilter['date']) && $aSpecFilter['date'] != 'NaN'){
            $Requete = $Requete . ', @Date = %2$s';
            $Requete = sprintf($Requete, $aSpecFilter['niveau'], $aSpecFilter['date']);
            $aListe = TestQry($Requete, $CnxDb);
        }else {
            $Requete = sprintf($Requete, $aSpecFilter['niveau']);
            $aListe = TestQry($Requete, $CnxDb);
        }
        $bSucces = "success";
        break;
    case 'getDate':
       //$aListe = $Bdd->QryToArray($aStatistiqueQry['getdate']);
       $aListe = TestQry($aStatistiqueQry['getdate'], $CnxDb);
       //var_dump($aListe);
       $bSucces = "success";
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
    default:
        $oJson = array("Success" => "False");
}

echo json_encode($oJson);