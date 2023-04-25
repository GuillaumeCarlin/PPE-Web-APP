<?php
require_once __DIR__.'/router.php';

$Url = explode('/', $_SERVER['REQUEST_URI']);
$Url = '/' . $Url[1] . '/' . $Url[2];

// NOTE: Pensez à mettre les rêquetes plus complexes en premiers.
// NOTE: Partir du principe que l'on envoie l'identifiant, le format (Accept) dans le header. Dans le controller crée des variables de départ type + identifiant et les initialisers avec getallheader
// NOTE: Penser à ajouter l'erreur 415 Format de requête non supporté pour une méthode et une ressource données. (Si la personne mets autre chose que JSON ou XML)


// Architecture ROUTE : Version / Object / L'identifiant / l'action
// Paramètre Génrale : Le Token et le Format sont définie dans l'entête de la requête 
// Paramètre Spécifique : Les différents paramètres sont mis dans le corps de la requête


/**
 * Exemple des différentes routes :
 * 
 *  http://localhost/Thot/api/V1/odf/150710/bilanproduction
 * 
 *  http://localhost/Thot/api/V1/rsc/Fv_4/nbcycle?date=20200502
 */

// -------------------------- ROUTE ODF ----------------------------

/**
 * @OA\Get(
 *   tags={"Tag"},
 *   path="/Thot/api/v1/odf/$odf_id/$action",
 *   summary="Permet de récupérer ",
 *   @OA\Parameter(ref="#/components/parameters/id"),
 *   @OA\Response(response=200, description="OK"),
 *   @OA\Response(response=400, description="Bad Request"),
 * )
 */
get($Url . '/v1/odf/$ODF_ID/$action', 'controller/ODF/ODFController.php');

// -------------------------- ROUTE RSC ----------------------------
/**
 * @OA\Get(
 *   tags={"Tag"},
 *   path="/Thot/api/v1/eqt/$Identifiant/$action",
 *   summary="Permet de récupérer l'historique d'un equipement",
 *   @OA\Parameter(ref="#/components/parameters/id"),
 *   @OA\Response(response=200, description="OK"),
 *   @OA\Response(response=401, description="Unauthorized"),
 *   @OA\Response(response=404, description="Not Found")
 * )
 */
get($Url . '/v1/eqt/$Identifiant/$action', 'controller/RSC/RSCController.php');


// -------------------------- ROUTE GESTION KEY --------------------
//get($Url . '/V1/KEY/$action/RSC/$RSC_ID/KEY/$Key/$Identifiant', 'controller/KEY/KEYController.php'); // Permet de définir la clé que l'on souhaite
//get($Url . '/V1/KEY/$action/RSC/$RSC_ID/$Identifiant', 'controller/KEY/KEYController.php'); // Définit une clé par défault
