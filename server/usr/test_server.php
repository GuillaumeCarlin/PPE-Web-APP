<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../wsLib/client/lib/class.websocket_client.php';

$clients = array();
$clients[] = new WebsocketClient;

$iInd = 0;
$bConnected = true;
while (!$clients[0]->connect('webdev.proform.dom', 8000, '/thot', 'localhost')) {
	$iInd++;
	
	if ($iInd>10) {
		$bConnected = false;
		break;
	}
}

if ($bConnected) {
	$aInfos = [
		'source'=> basename(__FILE__),
		'login'=>'edblv',
		'infos'=>['currentAct', 'histoAct']
	];
	$payload = json_encode(array(
		'action' => 'maj',
		'data' => $aInfos
	));

	echo 'Envoie de :<br>';
	echo var_export($payload);
	$clients[0]->sendData($payload);
}
else {
	echo "Pas de connexion";
}
?>