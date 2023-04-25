/*
Dans le repértoire /etc/systemd/system/ 
Créer un service file (Ex. thotWs.service) sous la forme :

[Unit]
Description=Thot WebSocket
After=tlp-init.service

[Service]
ExecStart=/var/www/html/thot/server/wsLib/thotWs.sh

[Install]
WantedBy=default.target

Ensuite :
chmod 664 /etc/systemd/system/thotWs.service
systemctl daemon-reload 
systemctl enable thotWs.service
*/
var WebSocketServer = require('ws').Server;
var oWss = new WebSocketServer({
	port: 8181
});

function heartbeat() {
	this.isAlive = true;
}
// Broadcast to all.
oWss.broadcast = function broadcast(data) {
	oWss.clients.forEach(function each(client) {
		client.send(data);
	});
};

oWss.on('connection', function connection(ws) {
	ws.on('message', function message(data) {
		// Broadcast to everyone else.
		oWss.clients.forEach(function each(client) {
			if (client !== ws)
				client.send(data);
		});
	});

	ws.isAlive = true;

	ws.on('pong', heartbeat);
});