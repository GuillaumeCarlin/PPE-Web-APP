<?php
include_once '..\commun\SessionClass.php';
require($oSession->ParentPath . "server/variablesEtFiltres.php");



$bDebug = false;
$aDebugAction = [];
if ($bDebug) {
    error_log("========================" . basename(__FILE__) . ' : ' . $action . "=====================");
    error_log("_POST : " . var_export($_POST, true));
    error_log("_GET : " . var_export($_GET, true));
}
$Bdd = new GestBdd($oSession->AppBase);

include("ApiQry.php");
switch ($action) {
    case 'LstAPK':
        $aListe = $Bdd->QryToArray($aAPIQry['listapk']);
        $bSucces = $Bdd->aExecReq['success'];
        break;
        
    case 'Update':
        if (!isset($_POST['key'])) {
            if($_POST['boolapp'] == '1'){
                $Key = uniqid() . uniqid();
            }
            else {
                $Key = uniqid();
            }
        }else{
            $Key = $_POST['key'];
        }
        $aListe = $Bdd->QryToArray(sprintf($aAPIQry['updateKey'], $Bdd->FormatSql($_POST['rsc_id'], 'C'), $Bdd->FormatSql($Key, 'C')));
        $bSucces = $Bdd->aExecReq['success'];
        break;
    
    case 'Insert':
        if (!isset($_POST['key'])) {
            if($_POST['boolapp'] == '1'){
                $Key = uniqid() . uniqid();
            }
            else {
                $Key = uniqid();
            }
        }else{
            $Key = $_POST['key'];
        }
        $aListe = $Bdd->QryToArray(sprintf($aAPIQry['insertKey'], $Bdd->FormatSql($_POST['rsc_id'], 'C'), $Bdd->FormatSql($Key, 'C')));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'listRscSansKey':
        if(isset($aSpecFilter['app'])){
            $aListe = $Bdd->QryToArray($aAPIQry['listRscSansKey'] . ' @App = ' . $aSpecFilter['app']);
        }else {
            $aListe = $Bdd->QryToArray($aAPIQry['listRscSansKey']);
        }
        $bSucces = $Bdd->aExecReq['success'];
        break;
}

switch ($action) {
    case 'listRscSansKey':
    case 'Update':
    case 'Insert':
    case 'LstAPK':
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