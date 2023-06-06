<?php
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

include_once '../variablesEtFiltres.php';



//$Bdd = new GestBdd($oSession->AppBase);

include("ApiQry.php");
switch ($action) {
    case 'LstAPK':
        $aListe = TestQry($aAPIQry['listapk'], $CnxDb);
        $bSucces = "success";
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
        $Requete = sprintf($aAPIQry['updateKey'], $_POST['rsc_id'], $Key);
        $aListe = TestQry($Requete , $CnxDb);
        $bSucces = "success";
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

        $aListe = TestQry(sprintf($aAPIQry['insertKey'], $_POST['rsc_id'], $Key), $CnxDb);
        $bSucces = "success";
        break;

    case 'listRscSansKey':
        if(isset($aSpecFilter['app'])){
            $aListe = TestQry($aAPIQry['listRscSansKey'] . ' @App = ' . $aSpecFilter['app'], $CnxDb);
        }else {
            $aListe = TestQry($aAPIQry['listRscSansKey'], $CnxDb);
        }
        $bSucces = "success";
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