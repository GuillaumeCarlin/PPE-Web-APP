<?php
$sAppName = "API-RSC";
include_once '..\..\..\server\commun\SessionClass.php';
include_once 'Key.php';


// On crée un objet Key pour pouvoir vérifier le token de vérification
$Cle = new Key();

// On vérifie que la requête envoyée possède bien un token de vérification. Dans le cas contraire on initialise le token à null (la fonction verify renvoie false si la clé est null)
if (isset(getallheaders()['Authorization'])) {
    $APK =  getallheaders()['Authorization'];
} else {
    $APK = NULL;
}

//On vérifie que la requête possède un type de format pour le renvoie de donnée (XML/JSON). Dans le cas contraire on définit le format JSON par défaut
if (isset(getallheaders()['Accept'])) {
    $Format = explode('/', getallheaders()['Accept'])[1];
} else {
    $Format = 'json';
}

// On récupère la date de la requête
if (isset($_GET['date'])) {
    $date = $_GET['date'];
} else {
    $date = null;
}

// On test le Token de la requete
if($Cle->Verify($APK) == true){
    // On crée un objet BDD pour pouvoir effectuées les requêtes
    $Bdd = new GestBdd($oSession->AppBase);

    include("RSCQry.php");
    switch ($action) {
        case 'nbcycle':
            $Identifiant = str_replace('_', ' ', $Identifiant); //Remplace les _ en espaces (Machine_4 -> Machine 4)
                $aListe = $Bdd->QryToArray(sprintf($aODFQry['select_Qte_Produit'], $Bdd->FormatSql($date, 'C'), $Bdd->FormatSql($Identifiant, 'C')));

                // La procedure posède une vérification des données. Si les données ne sont pas bonne on renvoie les informations d'erreur de la procédure
                if($aListe[0]['reussis'] == 'false'){
                    $oJson = array(
                        'success' => 'False',
                        'message' => $aListe[0]['erreur'],
                        'error_code' => $aListe[0]['erreurcode'],
                        'data' => $aListe[0]['erreurinformation']);
                    http_response_code(400); // On définit le code http de réponse à 400 (Bad Request : La syntaxe de la requête est erronée.)
                    $bSucces = false;
                }else{
                    $bSucces = $Bdd->aExecReq['success'];
                }
                break;
    }

    switch ($action) {
        case 'nbcycle':
            if($bSucces){
                $oJson = array(
                    'success' => $bSucces,
                    'message' => 'La requete a reussis',
                    'data' => $aListe
                );
            }
            break;
        // Si les actions ne sont pas dans la liste alors on renvoie une erreur
        default :
        $oJson = array(
            'statut' => '400',
            'NbreTotal' => 0,
            'Erreur' => $action . ' ne fait pas partie des actions possible'
        );
        http_response_code(400);
        break;
    }

    // On encode avec les données au bon format 
    if($Format == 'xml'){
        echo xmlrpc_encode($oJson);
    }else{
        echo json_encode($oJson);
    }

}
else{
    // Si l'identifiant n'est pas validé on renvoie une erreur
    $oJson = array(
        'statut' => '401',
        'NbreTotal' => 0,
        'Erreur' => 'L\'identifiant n\'est pas valide'
    );
    http_response_code(401);

    // On encode avec les données au bon format 
    if($Format == 'xml'){
        echo xmlrpc_encode($oJson);
    }else{
        echo json_encode($oJson);
    }
}