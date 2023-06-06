<?php
include_once  '\commun\SessionClass.php';

$aDb = [
	'typebase'=> 'MsSql',
	'nombase'=> 'BD_THOT_THT',
	'host'=>'10.30.103.67',
	'username'=>'sa',
	'passe'=>'123456789+aze'
];

////var_dump($aDb);
//echo "</br>";
////var_dump(pdo_drivers());

//echo "AppBase -> " . $oSession->AppBase;

//echo "</br> Connexion";
//$Bdd = new GestBdd($oSession->AppBase);
//echo "</br> Connexion OK";
echo "CC";
try{
    $Requete = 'SELECT * FROM s_temps.TR_JOUR_JOR';

    $Data = QryToArray($Requete);
    echo "</br>";
    var_dump($Data);
}
catch(PDOException $e){
    echo $e;
    echo "Test";
}

function TestQry($Requete, $CnxDb){
    $CnxDb = new PDO('sqlsrv:Server=10.30.103.67;Database=BD_THOT_THT', 'sa', '123456789+aze');
    $CnxDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $oResult = $CnxDb->prepare($Requete); 
    $oResult->execute(); 
    $aListe = $oResult->fetchAll(PDO::FETCH_ASSOC);
    return $aListe;
}


function QryToArray2($Requete, $CnxDb, $sIndice = ""){
    $aExecReq = array("success" => true, "errno" => 0, "message" => '');
    $aTypeChamp = array();
    //---- Nouvelle connexion MsSql (avec PDO)
    $oResult = $CnxDb->prepare($Requete);
    $oResult->execute();
    echo "</br>";
    var_dump($oResult);
    echo "</br>";
    var_dump($oResult->fetch());


    $aDatas = null;
    $aRow = array();
    $iIndRec = 0;
    if ($oResult !== false) {
        if ($oResult->columnCount() > 0) {
        //---- Récupération des définitions des colonnes de la requête
        foreach (range(0, $oResult->columnCount() - 1) as $iIndCol) {
            $aCol = $oResult->getColumnMeta($iIndCol);
            $sFieldName = $aCol['name'];
            $aTypeChamp[$sFieldName] = $aCol;
        }
        //---- Nom de la colonne type
        $sTypeCol = 'sqlsrv:decl_type';
        //---- On parcours les enregistrements reçus
        while ($oRecord = $oResult->fetch()) {
            $aRow = array();
        //---- On parcours les champs de l'enregistrement
        foreach ($oRecord as $sKey => $sValue) {
            switch ($aTypeChamp[$sKey][$sTypeCol]) {
                case "date":
                case "datetime":
                    /*
                    error_log($sValue);
                    $sValue = $this->FormatSql($sValue, "DSQL", "L");
                    error_log('----> '.$sValue);
                        */
                    break;

                case "int":
                    $sValue = intval($this->FormatSql($sValue, "N", "L"));
                    break;

                case "decimal":
                    $sValue = floatval($this->FormatSql($sValue, "N", "L"));
                    break;

                default:
                    break;
            }

            $aRow[$sKey] = $sValue;
        }

            //---- Table de retour indicé numériquement ou sur la valeur d'un des champs de la requête
            //    Ex : si $aRow=['champ1'=>'Valeur1', 'champ2'=>'Valeur2', 'champ3'=>'Valeur3']
            //        $sIndice='champ2'
            //    Alors $aDatas['Valeur2']=['champ1'=>'Valeur1', 'champ2'=>'Valeur2', 'champ3'=>'Valeur3']
            //    Sinon $aDatas[$iIndRec]=['champ1'=>'Valeur1', 'champ2'=>'Valeur2', 'champ3'=>'Valeur3']
        if ($sIndice != "") {
            $sValIndice = $aRow[$sIndice];
            $aDatas[$sValIndice] = $aRow;
        } else {
            $aDatas[$iIndRec] = $aRow;
        }

        $iIndRec++;
    }
    }
    $oResult->closeCursor();
    }
return $aDatas;
}
?>