# Liste des hypothèses d'améliorations mineurs à apporter
retirer le TAG TODO: aprés réalisation pour conserver la trace des améliorations apportées.

// TODO: 2019-03-05 12:21:18, filtre liste des opérateurs
filtrer sur une information à créer : ESTOPERATEUR, pour pouvoir exclure des listes les personnes qui ne seront pas des ressources pour les activités
exclure les opérateurs qui ne sont pas affectés à des secteurs de production (simplification des listes)

// TODO: 2019-03-05 12:23:40, Liste opérateurs, créer un composant pour factoriser la fonctionnalité (actuellement plusieurs copies pour chaque création d'activité, type d'activité)

// TODO: 2019-03-05 12:24:28, Ariane, factoriser la fonctionnalité en créant un composant

// TODO: 2019-03-05 12:24:49, Liste des équipements, comme pour les opérateurs, créer un composant pour factoriser la fonctionnalité.

// TODO: 2019-03-05 13:29:47, Règles de validation des activités, revoir le mécanisme, le déporter coté PHP plutot que par les scripts JS actuels.

// TODO: 2019-03-05 13:33:05, Actualisation des listes, revoir le mécanisme pour n'actuaiser que la liste affichée, inutile d'actualiser l'ensemble de l'application (perte de temps)

// TODO: 2019-03-05 14:24:14, Websocket et SSL, si on passe le site en SSL (https) il faut aussi que le websocket passe en WSS sinon la connexion est refusée par le navigateur à cause de l'incohérence SSL entre les deux serveurs (http et ws).