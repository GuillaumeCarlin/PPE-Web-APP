<?php
include_once 'Key.php';
// On crée un objet Key qui vas permettre d'utiliser toutes les fonctions de la class Key dont on a besoin
$Cle = new Key();

if (!isset($Key)) { // Si aucune Clé n'est définie on initialise la clé pour qu'elle puisse être prise en compte dans la fonction verifyApp 
    $Key = NULL;
}

if ( $Cle->VerifyApp($Identifiant) == true) { // On lance la fonction de vérification d'identifiant (L'identifiant doit être celui d'une Application)

    // On lance la bonne fonction selon l'action voulut
    switch ($action) {
        case 'Insert':
            if(isset($Key)){
                $Result = $Cle->InsertNewKey($RSC_ID, $Key);    
            }else{
                $Result = $Cle->InsertNewKey($RSC_ID);
            }
            break;
        
        case 'Update':
            if(isset($Key)){
                $Result = $Cle->updateKey($RSC_ID, $Key);    
            }else{
                $Result = $Cle->updateKey($RSC_ID);
            }
            break;
    }

    switch ($action) {
        case 'Update':
        case 'Insert':
            if($Result[0]['reussis'] == 'false'){       // Mise en forme de la réponse en fonction du résultat de la requête
                $oJson = array(
                    "success" => 'false',
                    "message" => $Result[0]['erreur'],
                    "error_code" => "400",  
                    "data" => $Result[0]['erreurinformation']);
                    http_response_code(400);
            }else {
                $oJson = array(
                    "success" => 'true',
                    "message" => 'La requete a reussis',
                    "data" => $Result[0]['information']
                );
            }
            break;

        default :  // Si l'action de la requête n'existe pas
            $oJson = array(
                'statut' => '400',
                'Erreur' => $action . ' ne fait pas partie des actions possible'
            );
            http_response_code(400);
        break;
    }
    echo json_encode($oJson);

} else { // Si l'identifiant n'est pas bon
    $oJson = array(
        'statut' => '401',
        'NbreTotal' => 0,
        'Erreur' => 'L\'identifiant n\'est pas valide'
    );
    http_response_code(401);
    echo json_encode($oJson);
}
