<?php
class wsClient {
	public $oClients = '';
	public $bConnected = true;
	
	public function __construct($oWebSockets) {
		require_once 'wsLib/client/lib/class.websocket_client.php';
		$this->oClients = new WebsocketClient;
		$iInd = 0;
		
		while (!$this->oClients->connect($oWebSockets->server->addr, $oWebSockets->server->port, '/thot', 'localhost')) {
			$iInd++;

			if ($iInd>10) {
				$this->bConnected = false;
				break;
			}
		}
	}

	public function sendMsg($sAction, $oData) {
		if ($this->bConnected) {
			$payload = json_encode(array(
				'action' => $sAction,
				'data' => $oData
			));

			$this->oClients->sendData($payload);
		}
	}
}