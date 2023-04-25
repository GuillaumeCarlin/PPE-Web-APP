# Service THOT WS
ce service met le serveur Websocket à disposition de l'application.
le serveur Websocket est utilisé pour actualiser automatiquement les clients lorsqu'une modification est apportée aux activités.

## installation du service
prérequis:
- node.js installé sur le système
- nssm.exe

pour le service lui même:
- le fichier thotWS.bat, contient la ligne de commande pour exécuter le service
- le fichier wsServerThot.js, le code node.js du serveur websocket.

### installation du service
ouvrir une invite de commande (cmd)
lancer la commande :
<code>nssm.exe install [nom du service] </code>
le nom du service est indiqué dans l'interface UI de NSSM.

#### onglet Application
- indiquer le chemin du fichier ThotWS.bat dans le champ "chemin"
- laisser les autres champs de cet onglet tels quels
#### onglet détails
- entrer le nom complet du service tel qu'il apparaitra dans la liste des services Windows
- entrer la description du service
- indiquer le mode de démarrage du service

Cliquer sur installer le service.
Ouvrir le gestionnnaire de services Windows et lancer le nouveau service pour s'assurer de son bon démarrage.

### désinstallation du service
ouvrir une invite de commande en mode administrateur
lancer la commande : <code>sc delete [nom du service]</code>

## valeurs des paramètres du service ThotWS
ci après les valeurs convenues pour les paramètres du service:
- nom du Service : ThotWS
- nom complet : Thot Websocket Server
- Description : Serveur Websocket de l'application THOT. Permet l'actualisation en temps réel des clients de l'application.
- type de démarrage : Automatique en production (manuel en développement)