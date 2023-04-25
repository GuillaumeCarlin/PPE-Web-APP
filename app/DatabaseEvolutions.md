# Modification de la gestion de la chronologie des opérations : HVT 2019-10-17 12:00:14
## objectif :
réduire le temps d'identification des opérations de production réalisable. fonction de la chronologie de la gamme (respect de la chronologie imposé par le système).

## solution actuelle
construction de la liste des opérations réalisables par récursion (CTE récursive).
en partant de l'opération de rang 1 de la gamme, collecter les opérations suivantes tant que la précédente est commencée.
ce mécanisme entraine de nombreux cycles de lecture qui finissent par pénaliser les performances du moteur SQL.

## solution envisagée
ajout d'un marqueur dans la table des opérations TE_OPERATION_OPN.
seules les opérations dont le marqueur est à 1 peuvent être utilisées pour la création d'activités de production (à l'exception des activités de réglage qui peuvent se créer sur n'importe quelle opération à réaliser)

### Gestion du marqueur
> importation des données.

identification des opérations dont le marqueur doit passer à 1
- si le rang est 1
- si la date de début réel est non NULL
- si la date de début est NULL ***ET*** l'opération précédente est marquée à 1

#### états des opérations dans PREACTOR
0	Non Commencée,
1	Suspendue,
2	Commencée,
3	Terminée

> utilisation de l'application

lors de la modification de la date de début réel (passe de NULL à NON NULL)
- identifier l'opération de rang n+1 dans l'OF
- passer le marque de l'opération n+1 à 1

#### création d'une procédure stockée P_U_OPN_SETAVAILABLE.
Paramètres
- OPN_ID, identifiant de l'opération dont la date de début vient de passer à NON NULL

processus
- récupérer le rang de l'opération passée en paramètre (OPN_RANG)
- récupérer l'identifiant de l'OF auquel appartien l'opération passée en paramètre (ODF_ID)
- rechercher l'opération de rang N+1 dans l'OF ODF_ID
- si elle existe, passer le marqueur à 1
