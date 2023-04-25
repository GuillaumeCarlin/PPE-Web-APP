<?php
$sAppName = "API-ODF";
include_once '..\..\..\server\commun\SessionClass.php';
include_once 'Key.php';


// On crée un objet Key pour pouvoir faire les vérifications de clé
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

// On test le token
if($Cle->Verify($APK) == true){
    // Si le token est bon on crée une connexion à la base de donnée
    $Bdd = new GestBdd($oSession->AppBase);

    // On ajoute les requetes en lien avec les ODF
    include("ODFQry.php");

    // On lance la requete en fonction de l'action voulut
    switch ($action) {
        case 'bilanproduction':
            if($ODF_ID == 200){
                $oJson = array(
                "success" => 'false',
                "message" => 'Identifiant non autoriser',
                "error_code" => "403",  
                "data" => 'L\'identifiant 200 n\'est pas autoriser');
                http_response_code(403);
                $bSucces = false;
            }else{
                $aListe = $Bdd->QryToArray(sprintf($aODFQry['select_odf'], $Bdd->FormatSql($ODF_ID, 'C')));
                if ($aListe[0]['reussis'] == 'false') {
                     $oJson = array(
                        'success' => 'False',
                        'message' => $aListe[0]['erreur'],
                        'error_code' => $aListe[0]['erreurcode'],
                        'data' => $aListe[0]['erreurinformation']);
                    http_response_code(400);
                    $bSucces = false;
                }else {
                    $bSucces = $Bdd->aExecReq['success'];    
                }
            }
            break;
    }

    // Mise en forme de la réponse
    switch ($action) {
        case 'bilanproduction':
            if($bSucces){
                $oJson = array(
                    "success" => $bSucces,
                    "message" => 'La requete a reussis',
                    "data" => $aListe
                );
            }
            break;
        default : // Si l'action n'existe pas
        $oJson = array(
            "statut" => '400',
            "NbreTotal" => 0,
            "Erreur" => $action . ' ne fait pas partie des actions possible'
        );
        http_response_code(400);
        break;
    }

    // On encode au format demander (par default JSON)
    if($Format == 'xml'){
        echo xmlrpc_encode($oJson);
    }else{
        echo json_encode($oJson);
    }

}else{ // Réponse si le token n'est pas bon
    $oJson = array(
        'statut' => '401',
        'NbreTotal' => 0,
        'Erreur' => 'L\'identifiant n\'est pas valide'
    );
    http_response_code(401);
    
    if($Format == 'xml'){
        echo xmlrpc_encode($oJson);
    }else{
        echo json_encode($oJson);
    }
}