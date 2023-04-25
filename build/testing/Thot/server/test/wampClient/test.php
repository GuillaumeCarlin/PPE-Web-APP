<?php
require_once 'WAMP/WAMPClient.php';
$client = new WAMPClient('localhost:8000/demo');
$sessionId = $client->connect();

/*
//establish a prefix on server
$client->prefix("calc", "http://example.com/simple/calc#");

//you can send arbitrary number of arguments
$client->call('calc', 12,14,15);

$data = [0, 1, 2];

//or array
$client->call('calc', $data);
*/
#publish an event

//$payload can be scalar or array
$exclude = [$sessionId]; //no sense in sending the payload to ourselves
//$eligible = [...] //list of other clients ids that are eligible to receive this payload
$client->publish('topic', $payload, $exclude, []);

$client->event('topic', $payload);
$client->disconnect();
?>
