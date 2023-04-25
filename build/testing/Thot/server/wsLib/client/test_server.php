<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'lib/class.websocket_client.php';

$clients = array();
$clients[] = new WebsocketClient;
$clients[0]->connect('127.0.0.1', 8000, '/thot', 'localhost');

echo '<h1>Connexion Ok</h1><hr>';

$aInfos = [
	'source'=> basename(__FILE__),
	'login'=>'edblv',
	'infos'=>['currentAct', 'histoAct']
];
$payload = json_encode(array(
	'action' => 'maj',
	'data' => $aInfos
));

usleep(50000);
echo 'Envoie de :<br>';
echo var_export($payload);
$clients[0]->sendData($payload);

/*
$testClients = 30;
$testMessages = 500;
for($i = 0; $i < $testClients; $i++)
{
	$clients[$i] = new WebsocketClient;
	$clients[$i]->connect('127.0.0.1', 8000, '/demo', 'localhost');
}
usleep(5000);

$payload = json_encode(array(
	'action' => 'echo',
	'data' => 'dos'
));

for($i = 0; $i < $testMessages; $i++)
{
	$clientId = rand(0, $testClients-1);
	$clients[$clientId]->sendData($payload);
	usleep(5000);
}
usleep(5000);
*/
?>