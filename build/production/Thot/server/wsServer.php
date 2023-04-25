<?php

/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details. */

ini_set('display_errors', 1);
error_reporting(E_ALL);
$sParamPath = 'localParams/webSockets.json';
$sParamFile = file_get_contents('../'. $sParamPath);
$oWsParam = json_decode($sParamFile);

//echo var_export($oWsParam,true);

require(__DIR__ . '/wsLib/SplClassLoader.php');

$classLoader = new SplClassLoader('WebSocket', __DIR__ . '/wsLib');
$classLoader->register();

$server = new \WebSocket\Server($oWsParam->server->addr, $oWsParam->server->port, false);

// server settings:
$server->setMaxClients(100);
$server->setCheckOrigin(false);
/*
$server->setAllowedOrigin($oWsParam->server->addr);

foreach ($oWsParam->server->allowedorig as $iInd=>$sOrig) {
	$server->setAllowedOrigin($sOrig);
}
 * 
 */

$server->setMaxConnectionsPerIp(100);
$server->setMaxRequestsPerMinute(2000);

// Hint: Status application should not be removed as it displays usefull server informations:
$server->registerApplication('status', \WebSocket\Application\StatusApplication::getInstance());
$server->registerApplication('thot', \WebSocket\Application\Thot::getInstance());

$server->run();
?>
