<!DOCTYPE html>
<meta charset="utf-8" />

<!DOCTYPE html>
<title>THOT - WebSocket (PROD)</title>
<link href='favico.ico' rel='shortcut icon' />

<script language="javascript" type="text/javascript">
    //    var wsUri = "ws://172.16.10.66:8181/";
    var wsUri = "ws://192.168.254.101:8181/";
    var output;

    function init() {
        output = document.getElementById("output");
        testWebSocket();
    }

    function testWebSocket() {
        websocket = new WebSocket(wsUri);
        websocket.onopen = function(evt) {
            onOpen(evt)
        };
        websocket.onclose = function(evt) {
            onClose(evt)
        };
        websocket.onmessage = function(evt) {
            onMessage(evt)
        };
        websocket.onerror = function(evt) {
            onError(evt)
        };
    }

    function onOpen(evt) {
        var horodatage = new Date();
        writeToScreen('<div><h4>' + horodatage + '</h4></div><div class="message" style="color:#00e509"><span>CONNECTE</span></div>');
        //doSend("WebSocket ok");
    }

    function onClose(evt) {
        var horodatage = new Date();
        writeToScreen('<div><h4>' + horodatage + '</h4></div><div class="message" style="color:red">DECONNECTE</div>');
    }

    function onMessage(evt) {
        var horodatage = new Date();
        writeToScreen('<div><h4>' + horodatage + '</h4></div><div class="message">MESSAGE: ' + evt.data + '</div>');
        //websocket.close();
    }

    function onError(evt) {
        var horodatage = new Date();
        writeToScreen('<div><h4>' + horodatage + '</h4></div><div style="color: red;">ERREUR:</div> ' + evt.data);
    }

    function doSend(message) {
        writeToScreen("SENT: " + message);
        websocket.send(message);
    }

    function writeToScreen(message) {
        var pre = document.createElement("p");
        pre.style.wordWrap = "break-word";
        pre.innerHTML = message;
        output.appendChild(pre);
    }

    window.addEventListener("load", init, false);
</script>
<script>
    function getWSIP() {
        var wsip = document.getElementById("wsip").value;
        init();
    }
</script>
<html>

<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title></title>
    <style>
        html,
        body {
            font-family: "Noto Sans";
            margin: 0;
            padding: 0;
            background-color: #f3f3f3;
        }

        h1 {
            font-size: 1.5em;
            background-color: #025b80;
            color: white;
            padding: 5px;
            margin: 0px;
        }

        h2 {
            font-size: 1em;
            background-color: #555;
            color: white;
            margin: 0px;
            padding: 5px;
        }

        h3 {
            font-size: 1em;
            background-color: #e6e6e6;
            margin: 0px;
            padding: 5px;
        }

        h4 {
            font-size: 0.7em;
            margin: 3px;
            font-weight: 200;
            color: #BDBDBD;
        }

        #output {
            margin: 10px;
        }

        .message {
            padding: 8px;
            background-color: #fff;
        }

        .message:hover {
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 12px 0 rgba(0, 0, 0, 0.19);
        }
    </style>
</head>

<body>
    <h1> THOT - Outils d'Administration</h1>
    <h2> Websocket server : <?php echo $_SERVER['SERVER_NAME']; ?> (<?php echo $_SERVER['SERVER_SOFTWARE']; ?>) (<?php echo $_SERVER['REMOTE_ADDR']; ?>)</h2>
    <h3>messages</h3>
    <div id="output"></div>
</body>

</html>