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


//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();
$aVariables[] = 'node';
$aVariables[] = 'ech_id';
$aVariables[] = 'ecs_libelle';
$aVariables[] = 'ecs_proc';
$aVariables[] = 'ecs_trigrm';
$aVariables[] = 'sab_id';

$aVariables[] = 'rsc_id';
$aVariables[] = 'rsc_code';
$aVariables[] = 'rsc_libelle';
$aVariables[] = 'rsc_estinactif';
$aVariables[] = 'eqp_estacquisitionauto';
$aVariables[] = 'eqp_estlimite';
$aVariables[] = 'eqp_nombre_occurence';
$aVariables[] = 'imt';
$aVariables[] = 'std';
$aVariables[] = 'aut';
$aVariables[] = 'mps';
$aVariables[] = 'clb';
$aVariables[] = 'mrk';
$aVariables[] = 'mrkfolder';
$aVariables[] = 'fni';
$aVariables[] = 'task';
$aVariables[] = 'parametre';
$aVariables[] = 'value';
$aVariables[] = 'value_generique';

/*
class Admin extends GestBdd
{

    var $aModules = [];

    function importModules($iIdParent = 0)
    {
        $aTree = [];
        $aChildren = [];

        foreach ($this->aModules as $iInd => $aModule) {
            $bTakeIt = false;

            if ($iIdParent < 1) {
                //---- Si l'IdParent n'est pas précisé, on ne récupère que les niveaux 0 (donc les parents)
                $bTakeIt = ($aModule['ecs_niveau'] < 1);
            } else {
                //---- Sinon, on ne récupère que les enfants du parent demandé
                $bTakeIt = ($aModule['ecs_id_parent'] == $iIdParent);
            }

            if ($bTakeIt) {
                $aNode = [
                    'nodeid' => 'node_' . $aModule['ecs_id'],
                    'cls' => 'x-tree-noicon',
                    'status' => '',
                    'log' => '',
                    'expanded' => true,
                    'checked' => false
                ];
                $aTree[] = array_merge($aNode, $aModule);
            }
        }

        if (count($aTree) > 0) {
            //---- On parcours ce niveau pour chercher les (éventuels) enfants
            foreach ($aTree as $iInd => $aModule) {
                $aChildren = $this->importModules($aModule['ecs_id']);

                if (count($aChildren) > 0) {
                    $aTree[$iInd]['children'] = $aChildren;
                } else {
                    $aTree[$iInd]['leaf'] = true;
                }
            }
        }

        return $aTree;
    }
}*/

//$Bdd = new Admin($oSession->AppBase);
include("AdminQry.php");
$aMessages = [];
//---- Execution de la requête correspondant à l'action passée en paramètre ----
switch ($action) {
    case 'LstImportProc':
        if ($node == 'root') {
            $Bdd->aModules = $Bdd->QryToArray($aAdmin['importproclst']);
            $aListe = $Bdd->importModules();
        }

        if(isset($aListe)){
            $bSucces = true;
        }else{
            $bSucces = false;
        }

        break;

    case 'ImportStart':
        $aListe = $Bdd->QryToArray($aAdmin['importstart']);
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'VerifyPDF':
        // N'ayant pas le fichier des fps on initialie un pdf par défaut
        /*
        $url = "http"; 
        $url .= "://"; 
        $url .= $_SERVER['HTTP_HOST']; 
        $url .= '/Thot/resources/Documents/FPS/';
        error_log($url);
        $rFile = 'http://localhost/Thot/resources/Documents/FPS/' . $_POST['fichier'];
        $check = @fopen($rFile, 'r');
        if(!$check){
            error_log('Fichier non trouvé');
            $bSucces = false;
            $aMessages = 'Fichier non trouvé dans le dossier';
        }else{
            error_log('Fichier trouvé');
            $bSucces = true;
            $aMessages = 'Fichier Trouvé';
            fclose($check);
        }
        */
        $bSucces = true;
        $aMessages = 'Fichier Trouvé';
        break;

    case 'GetFPSList':
        $aListe = TestQry($aAdmin['getfpslist'], $CnxDb);
        $bSucces = "success";
        break;

    case 'GetUSRList':
        $aListe = TestQry(sprintf($aAdmin['getusrlist'], $aSpecFilter['id_fps'], $aSpecFilter['id_rsc']), $CnxDb);
        $bSucces = "success";
        break;

    case 'GetEqtFPSList':
        $aListe = TestQry(sprintf($aAdmin['geteqtlist'],$aSpecFilter['id_fps']), $CnxDb);
        $bSucces = "success";
        break;
    case 'GetAllUSR':
        $aListe = TestQry(sprintf($aAdmin['getalllist_usr'], $aSpecFilter['id_fps'], $aSpecFilter['id_rsc']), $CnxDb);
        $bSucces = "success";
        break;

    case 'GetAllEQT':
        $aListe = TestQry(sprintf($aAdmin['getalllist_eqt'], $aSpecFilter['id_fps']), $CnxDb);
        $bSucces = "success";
        break;

    case 'FPS_User':
        $Requete = $aAdmin['modify_fps_user'];
        switch ($_POST['type']) {
            case 'INSERT':
                $Requete = $Requete . ' @Type = \'%1$s\' ,@UsrId =  %2$s, @RscId  =  %3$s, @FpsId =  %4$s, @Date  =  %5$s';
                TestQry(sprintf($Requete,$_POST['type'], $_POST['usr_id'], $_POST['rsc_id'], $_POST['fps_id'], $_POST['date']), $CnxDb);
                $aListe = array();
                $bSucces = "success";
                break;
         
            case 'DELETE':
                $Requete = $Requete . ' @Type = \'%1$s\', @UsrId =  %2$s, @FpsId = %3$s ,@RscId = %4$s';
                $Requete = sprintf($Requete, $_POST['type'], $_POST['usr_id'], $_POST['fps_id'],$_POST['rsc_id']);
                TestQry($Requete, $CnxDb);
                $aListe = array();
                $bSucces = "success";
                break;
        }
        break;

    case 'FPS_Eqt':
        TestQry(sprintf($aAdmin['modify_fps_eqt'], $_POST['type'], $_POST['rsc_id'], $_POST['fps_id']), $CnxDb);
        $aListe = array();
        $bSucces = "success";
    break;

    case 'FPS_Fps':
        $Requete = $aAdmin['modify_fps_fps'];
        switch ($_POST['type']) {
            case 'INSERT':
                $Requete = $Requete . ', @FpgId = %2$s, @FpsChemin = \'%3$s\', @FpsCode = \'%4$s\'';
                $Requete = sprintf($Requete, $_POST['type'], $_POST['fpg_id'], $_POST['fps_chemin'], $_POST['fps_code']);
                TestQry($Requete, $CnxDb);
                $aListe = array();
                $bSucces = "success";
                break;
            case 'DELETE':
                $Requete = $Requete . ', @FpsId = %2$s';
                $Requete = sprintf($Requete, $_POST['type'],$_POST['fps_id']);
                TestQry($Requete, $CnxDb);
                $aListe = array();
                $bSucces = "success";
                break;
        }
        break;

    case 'Get_FPG':
        $aListe = TestQry($aAdmin['getalllist_fpg'], $CnxDb);
        $bSucces = "success";
        break;

    case 'ImportProc':
        set_time_limit(120);

        if ($ecs_proc !== '') {
            $aListe = $Bdd->QryToArray(sprintf(
                $aAdmin['importprocstep'],
                $ech_id,
                $Bdd->FormatSql($ecs_trigrm, 'C'),
                $Bdd->FormatSql($ecs_libelle, 'C')
            ));
            $bSucces = $Bdd->aExecReq['success'];

            if ($bSucces) {
                $Bdd->QryExec(sprintf('exec %1$s @ECE_ID=%2$s', $ecs_proc, intval($aListe[0]['ece_id'])));
            }

            $bSucces = $Bdd->aExecReq['success'];
        } else {
            $bSucces = true;
        }
        break;

    case 'ImportEnd':
        $Bdd->QryExec(sprintf($aAdmin['importend'], $ech_id));
        $aEqpmt = $Bdd->QryToArray($aAdmin['ctrl_eqp']);
        $aUsr = $Bdd->QryToArray($aAdmin['ctrl_usr']);

        $aListe = [
            'eqp' => count($aEqpmt),
            'usr' => count($aUsr)
        ];
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'CtrlUsers':
        $aListe = $Bdd->QryToArray($aAdmin['ctrl_usr']);
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'CtrlWorkStn':
        $aListe = $Bdd->QryToArray($aAdmin['ctrl_eqp']);
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'ParametresEqp':
        // récupération des paramètres d'un équipemet par son id
        $aListe = $Bdd->QryToArray(sprintf($aAdmin['getparametreseqp'], $Bdd->FormatSql($rsc_id, 'N')));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'SetParametresEqp':
        // enregistrement des paramètres de l'équipement par son id et tableau des paramètres
        // création de la chaine de paramètres attendue par la procédure stockée SQL
        $sParametres = ''; // chaine de parametres, conversion du tableau en chaine

        $sParametres .= ' @RSC_ID = ' . $rsc_id;
        $sParametres .= ', @RSC_CODE = ' . $Bdd->FormatSql($rsc_code, 'C');
        $sParametres .= ', @RSC_LIBELLE = ' . $Bdd->FormatSql($rsc_libelle, 'C');
        $sParametres .= ($rsc_estinactif == 'true' ? ', @RSC_ESTINACTIF = 1' : '');
        $sParametres .= ($eqp_estacquisitionauto == 'true' ? ', @EQP_ESTACQUISITIONAUTO = 1' : '');
        $sParametres .= ($eqp_estlimite == 'true' ? ', @EQP_ESTLIMITE = 1' : '');
        $sParametres .= ', @EQP_NOMBRE_OCCURENCE = ' . $eqp_nombre_occurence;
        $sParametres .= ($imt == 'true' ? ', @IMT = 1' : '');
        $sParametres .= ($std == 'true' ? ', @STD = 1' : '');
        $sParametres .= ($aut == 'true' ? ', @AUT = 1' : '');
        $sParametres .= ($mps == 'true' ? ', @MPS = 1' : '');
        $sParametres .= ($clb == 'true' ? ', @CLB = 1' : '');
        $sParametres .= ($mrk == 'true' ? ', @MRK = 1' : '');
        $sParametres .= ($fni == 'true' ? ', @FNI = 1' : '');
        $sParametres .= (strlen($mrkfolder) > 0 ? ', @MRKFOLDER = ' . $Bdd->FormatSql($mrkfolder, 'C') : '');


        // injecter la chaine de paramètres dans le corps de requête et lancer la requête
        $Bdd->QryExec(sprintf($aAdmin['setparametreseqp'], $sParametres));
        // récupère le statut d'exécution de la requête
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'eqpListReplacement':
        // liste des équipements d'un secteur à partir d'un id équipement de départ
        $aListe = $Bdd->QryToArray(sprintf($aAdmin['listreplacement'], $aSpecFilter['sab_id'], $aSpecFilter['rsc_id']));
        $bSucces = $Bdd->aExecReq['success'];
        break;

        /**
         * @author Hervé Valot
         * @description met à jour un paramètre de configuration de l'application
         * @version 20200807
         */
    case 'SetAppParametre':
        // mise à jour du code de la requête et exécution
        $Bdd->QryExec(sprintf($aAdmin['setappparametre'], $Bdd->FormatSql($parametre, 'C'), $Bdd->FormatSql(($value == 'true' ? '1' : '0'), 'N'), $Bdd->FormatSql($value_generique, 'C')));
        $bSucces = $Bdd->aExecReq['success'];
        break;

        /**
         * @author  Hervé Valot
         * @description mise à jour d'un paramètre de la table CRON
         * @version 20200807
         */
    case 'SetCronTaskParametre':
        $sParametre = ''; // chaine pour contenir le paramètre et la valeur à mettre à jour

        // en fonction de la valeur de parametre on mettra à jour une information 
        // spécifique de la tache indiquée dans le paramètre task
        switch ($parametre) {
            case 'Planning': //mise à jour de la liste des jours d'exécution
                $sParametre = '@JOUR=' . $Bdd->FormatSql($value, 'C');
                break;
            case 'Activation': // activation/désactivation de la tache
                $sParametre = '@ESTINACTIF=' . $Bdd->FormatSql($value, 'N');
                break;
            case 'Mode': // mode de programmation (INTERVAL / ONTIME)
                $sParametre = '@PROG_MODE=' . $Bdd->FormatSql($value, 'C');
                break;
            case 'Temps': // valeur de temps de déclenchement en secondes
                $sParametre = '@PROG_TEMPS=' . $Bdd->FormatSql($value, 'N');
                break;
        }

        // mise à jour de la requête et exécution
        $Bdd->QryExec(sprintf($aAdmin['setcronparametre'], $Bdd->FormatSql($task, 'C'), $sParametre));
        $bSucces = $Bdd->aExecReq['success'];
        break;

        /**
         * @author  Hervé Valot
         * @description returne la liste des options de configuration et leurs valeurs
         * @version 20200808 
         */
    case 'GetAppParametreByGroup':
        $aListe = $Bdd->QryToArray(sprintf($aAdmin['getappparametrebygroup'], $Bdd->FormatSql($parametre, 'C')));
        $bSucces = $Bdd->aExecReq['success'];
        break;

        /**
         * @author  Hervé Valot
         * @description lecture des paramètres du CRON en fonction de l tache passée en paramètre
         * @version 20200811
         */
    case 'GetCronParametreByTask':
        $aListe = $Bdd->QryToArray(sprintf($aAdmin['getcronparametrebytask'], $Bdd->FormatSql($parametre, 'C')));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'getToleranceParam':
        $aListe = $Bdd->QryToArray(sprintf($aAdmin['gettoleranceparam']));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'setToleranceParam':
        switch($parametre){
            case 'ToleranceS':
                $aListe = $Bdd->QryToArray(sprintf($aAdmin['settoleranceparam_s'],  $Bdd->FormatSql($value, 'C')));
                $bSucces = $Bdd->aExecReq['success'];
                break;
            case 'ToleranceAMax':
                $aListe = $Bdd->QryToArray(sprintf($aAdmin['settoleranceparam_a_max'],  $Bdd->FormatSql($value, 'C')));
                $bSucces = $Bdd->aExecReq['success'];
                break;
            case 'ToleranceAMin':
                $aListe = $Bdd->QryToArray(sprintf($aAdmin['settoleranceparam_a_min'],  $Bdd->FormatSql($value, 'C')));
                $bSucces = $Bdd->aExecReq['success'];
                break;
        }
        break;
}

//---- données retournées à l'appelant
switch ($action) {
    case 'CtrlWorkStn':
    case 'CtrlUsers':
    case 'ParametresEqp':
    case 'eqpListReplacement':
    case 'GetAppParametreByGroup':
    case 'getToleranceParam':
    case 'GetCronParametreByTask':
    case 'GetFPSList':
    case 'GetUSRList':
    case 'GetEqtFPSList':
    case 'GetAllUSR': 
    case 'FPS_User':
    case 'GetAllEQT':
    case 'FPS_Eqt':
    case 'FPS_Fps':
    case 'Get_FPG':       
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

    case 'LstImportProc':
        $oJson = array(
            "success" => $bSucces,
            "children" => $aListe
        );
        break;

    case 'ImportStart':
    case 'ImportProc':
    case 'ImportEnd':
        $oJson = array(
            "success" => $bSucces,
            "output" => $aListe,
            "errorMessage" => $Bdd->aExecReq
        );
        break;

    case 'SetAppParametre':
    case 'SetCronTaskParametre':
    case 'setToleranceParam':
    case 'SetParametresEqp':
    case 'VerifyPDF':
        $oJson = array(
            'success' => $bSucces,
            'message' => $aMessages
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