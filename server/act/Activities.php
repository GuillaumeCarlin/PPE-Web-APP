<?php

include_once '..\commun\SessionClass.php';
include_once '../alr/alertsMngt.php';

/**
 * @author  Hervé VALOT
 * @description classe de gestion du log fichiers externes
 */
class extraFileLog
{
    // fichier de log spécifique pour la création de fichiers externes (SPC, MARKEM)
    const LOG_FILE = '../../log/extraFileLog_';

    /**
     * log des fichiers MARKEM CoLOS
     */
    public function colos($file, $data)
    {
        $date = date('d.m.Y H:i:s');
        $log = $date . " INF MRK creation du fichier " . $file . " data: " . $data . "\n";
        error_log($log, 3, self::LOG_FILE . date('Ymd') . '.log');
    }

    /**
     * log des fichiers SPC GOM
     */
    public function spc($file, $sens)
    {
        $date = date('d.m.Y H:i:s');
        if ($sens == 'in') {
            $log = $date . " INF SPC creation du fichier " . $file . "\n";
        } else {
            $log = $date . " INF SPC suppression du fichier " . $file . "\n";
        }
        error_log($log, 3, self::LOG_FILE . date('Ymd') . '.log');
    }
    /**
     * log des erreurs SPC GOM
     */
    public function spcError($file, $msg)
    {
        $date = date('d.m.Y H:i:s');
        $log = $date . " ERR SPC erreur gestion du fichier " . $file . " message : " . $msg . "\n";
        error_log($log, 3, self::LOG_FILE . date('Ymd') . '.log');
    }
}
//------------------------------------------------------------------
// Appel‚ par le module AJAX
//------------------------------------------------------------------
//---- Déclaration des variables
$aVariables = array();
$aVariables[] = 'ope_id';
$aVariables[] = 'odf_id';
$aVariables[] = 'ofnum';
$aVariables[] = 'odf_code';
$aVariables[] = 'org_id';
$aVariables[] = 'rsc_id';
$aVariables[] = 'act_id';
$aVariables[] = 'ala_id';
$aVariables[] = 'ald_id';
$aVariables[] = 'usr_id';
$aVariables[] = 'sourcetype';
$aVariables[] = 'quantity';
$aVariables[] = 'expectedqty';
$aVariables[] = 'originalval';
$aVariables[] = 'closedoper';
$aVariables[] = 'fields';
$aVariables[] = 'opn_id';
$aVariables[] = 'eqp_id';
$aVariables[] = 'opc_id';
$aVariables[] = 'assistance';
$aVariables[] = 'schedule';
$aVariables[] = 'alt_qterequis';
$aVariables[] = 'compacttype';
$aVariables[] = 'isnewopn';
$aVariables[] = 'oct_id';
$aVariables[] = 'ent_id';
$aVariables[] = 'motif';
$aVariables[] = 'restore';
$aVariables[] = 'estsupprimee';
$aVariables[] = 'mode';

require $oSession->ParentPath . "server/variablesEtFiltres.php";
$bDebug = true;
$sDebugAction = '';

if ($sDebugAction !== '') {
    if ($action !== $sDebugAction) {
        $bDebug = false;
    }
}

if ($bDebug) {
    error_log("========================" . basename(__FILE__) . ' : ' . $action . "=====================");
    error_log("_POST : " . var_export($_POST, true));
    error_log("_GET : " . var_export($_GET, true));
}

//---- Include de la classe de gestion des données ----
//include($oSession->ParentPath . "server/Bdd.php");
$ClassMngt = new alertsMngt($oSession->AppBase);
$Bdd = $ClassMngt->getBDD();
include "ActivitiesQry.php";
$aMessages = [];

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
    case 'FreeAleaList':
        // DEV: 2019-03-21 16:27:16, HVT, voir si possibilité de fusionner avec 'AleaList'
        $sFilter = '';

        if (isset($aSpecFilter['sourcetype'])) {
            $sourcetype = $aSpecFilter['sourcetype'];
        };

        if ($sourcetype !== '') {
            $sFilter = '@LIBRE=1, @ORIGINE=' . $sourcetype;
        } else {
            $sFilter = '@ORG_ID=' . $org_id . ', @OCT_ID=' . $oct_id;
        };

        // $aListe =  $Bdd->Qr yToArray(spr i ntf($aActivities['alealist'], $sFilter));
        $aListe = $Bdd->QryToArray(sprintf($aActivities['freealealist'], $sFilter));
        $bSucces = (count($aListe) > 0);
        break;

    case 'AleaList':
        // DEV: 2019-03-21 16:27:16, HVT, prévoir de recevoir deux paramètres
        // - ORG_ID, identifiant de la section
        // - ATT_ID, identifiant du type d'activité en cours
        // afin de pouvoir filtrer la liste des aléas renvoyés par la base de données
        $sFilter = '';

        if ($sourcetype !== '') {
            $sFilter = '@LIBRE=1, @ORIGINE=' . $sourcetype;
        } else {
            $sFilter = '@ORG_ID=' . $org_id . ', @OCT_ID=' . $oct_id;
        };

        // $aListe = $Bdd->QryToArray(sprintf($aActivities['alealist'], $sFilter));
        $aListe = $Bdd->QryToArray(sprintf($aActivities['alealistv2'], $sFilter));
        $bSucces = (count($aListe) > 0);
        break;

    case 'GetOf200Id':
        $aListe = $Bdd->QryToArray($aActivities['getof200id']);

        $bSucces = (count($aListe) > 0);
        break;

    case 'UnplanedOPList':
        // renvoie la liste des opérations non planifiées (OF200)
        $aListe = $Bdd->QryToArray(sprintf($aActivities['compactlist'], $compacttype));
        $bSucces = (count($aListe) > 0);
        break;

    case 'CompActList': // renvoi la liste des activités complémentaires
        $aListe = $Bdd->QryToArray(sprintf($aActivities['compactlist'], $compacttype));
        $bSucces = (count($aListe) > 0);
        break;

        /**
         * @author  Hervé Valot
         * @description    création activité sur opération complémentaire, en mode standard ou correction
         */
    case 'newCompAct':
        /* liste des paramètres optionnels
        - chaine vide par défaut
        - sera complétée dans le cas de la création depuis le mode correction */
        $sOptionalPrm = '';
        // comportement en mode création, utilisation majoritaire de l'application
        $iForce = 0;
        // résultat optimiste par défaut
        $bSuccess = true;

        // mise à jour des paramètres et préparation des données pour le mode "correction"
        if ($mode == 'correction') {
            // on utilise le mode forcé de la procédure SQL
            $iForce = 1;

            // préparation des paramètres complémentaires à passer à la procédure SQL
            $oFields = json_decode($fields);

            /* préparation de la chaine XML des quantités */
            $sQuantityXML = ''; // chaine vide par défaut, on vérifie par la suite si il y a des quantités à placer dans cette chaine
            if ($quantity !== '') {
                $aQuantity = json_decode($quantity);
                $sQuantityXML = '<QUANTITES>';
                $sQuantityAtt = '';

                foreach ($aQuantity->qtp_id as $iInd => $iQtyTypeId) {
                    $sQuantityAtt = '';

                    if ($aQuantity->qty[$iInd] !== null) {
                        $sQuantityAtt = '" VALEUR="' . $aQuantity->qty[$iInd];
                    }
                    $sQuantityXML .= '<QTE QTP_ID="' . $iQtyTypeId . '" RSC_ID="' . $oFields->usr_id . $sQuantityAtt . '" />';
                }

                $sQuantityXML .= '</QUANTITES>';
            }

            /* récupération des paramètres pour la création de l'opération complémentaire */
            $odf_id = $oFields->odf_id;
            $eqp_id = $oFields->eqp_id;
            $opc_id = $oFields->opc_id;
            /* récupération des paramètres pour la création de l'activité */
            $org_id = $oFields->org_id;

            /* préparation des paramètres optionnels de la requête, seront ajoutés aux paramètres obligatoires */
            $sOptionalPrm .= ', @DATEDEBUT        =' . $Bdd->FormatSql($oFields->act_date_debut, 'C');
            $sOptionalPrm .= ', @DATEFIN          =' . $Bdd->FormatSql($oFields->act_date_fin, 'C');
            $sOptionalPrm .= ', @ENCOURS          = 0'; // l'opération créée ne peut pas être en cours en mode correction
            $sOptionalPrm .= ', @QUANTITE         =' . $Bdd->FormatSql($sQuantityXML, 'C');
            $sOptionalPrm .= ', @CORRECTION       = 1'; // indique à SQL de gérer le mode correction (trace dans les historiques de correction)
            $sOptionalPrm .= ', @USR_ID_COR       =' . $rsc_id;
            $sOptionalPrm .= ', @COMMENTAIRE      =' . $Bdd->FormatSql($oFields->acr_commentaire, 'C');

            /*  ATTENTION, le paramètre $rsc_id contient au départ l'id du correcteur,
            il prend ensuite la valeur chaine de la liste des ressources utilisées
            il faut donc respecter l'ordre d'assignation et d'utilisation de ce paramètre
             */
            /* préparation du tableau des ressources */
            $aRessources = [];

            if ($oFields->usr_id !== '') {
                $aRessources[] = $oFields->usr_id;
            }

            if ($oFields->eqp_id !== '') {
                $aRessources[] = $oFields->eqp_id;
            }
            /* conversion du tableau des ressources en chaine de valeurs séparées par des virgules pour utilisation dans la procédure SQL */
            $rsc_id = join(',', $aRessources);
        }

        /* exécution des requêtes vers la base de données */
        /**
         * création ou identification, et récupération de l'identifiant de l'activité complémentaire
         * traitement réalisé par la procédure SQL
         * @param {int} $odf_id identifiant de l'OF sur lequel créer ou réutiliser l'opération complémentaire
         * @param {int} $eqp_id identifiant de l'équipement utilisé pour affectation à l'opération compl��mentaire
         * @param {int} $opc_id identifiant de l'opération complémentaire à créer/utiliser
         */
        $Liste = $Bdd->QryToArray(sprintf($aActivities['compactcreate'], $odf_id, $eqp_id, $opc_id));
        // si echèc de la requête on met fin au processus
        if (!$Bdd->aExecReq['success']) {
            // echec de la création, on n'a pas d'opération à utiliser, on ne peut pas aller plus loin
            $bSucces = false;
        } else {
            // récupération de l'opc_id, identifiant de l'opération complémentaire
            $aListe = $Liste[0];
            // identifiant de l'opération complémentaire attribué au paramètre opn_id
            $opn_id = $aListe['_newopnid'];
            $isnewopn = $aListe['_isnewop'];
            /**
             * création de la nouvelle activité
             * @param {int} $opn_id identifiant de l'opération traitée par l'activité
             * @param {int} $odf_id identifiant de l'of contenant l'opération
             * @param {int} $org_id identifiant de la section d'atelier ou a lieu l'activité
             * @param {string} $rsc_id chaine d'identifiants des ressources utilisées par l'activité
             * @param {int} $iForce 0 = normal, 1 = forcé, permet de créer des informations normalement gérées par la base de données (dates)
             * @param {string} $sOptionalPrm chaine contenant les paramètres optionnels, nécessaire pour les création en mode correction ($iForce=1)
             */
            $ListeB = $Bdd->QryToArray(sprintf($aActivities['create'], $opn_id, $odf_id, $org_id, $Bdd->FormatSql($rsc_id, 'C'), $iForce, $sOptionalPrm));
            // si erreur en base de données on arrête le traitement et on retourne une erreur à l'appelant
            if (!$Bdd->aExecReq['success']) {
                $bSucces = false;
            } else {
                // sinon, tout s'est bien passé
                // on complète après en mode création si les traitements spécifiques se sont bien passés ou pas
                $bSucces = true;
                $aListe = $ListeB;
            }
        }

        /* traitement spécifique au mode création */
        if ($bSucces && $mode !== 'correction') {
            $iActId = $ListeB[0]['act_id'];
            // $Bdd->QryExec(sprintf($aActivities['mrkcreate'], $iActId, 'D'));

            // DEV: 2022-09-06 09:29:19 HVT - mise en place création déclencheur COLOS direct et fichier GOM
            // acquisition des informations communes pour la création des fichiers externes
            $aData = $Bdd->QryToArray(sprintf($aActivities['infoSPC'], $iActId));

            // création du fichier SPC (GOM)
            // ce fichier contient des informations de production pour ajout aux données de mesure SPC
            // date, atelier, opérateur, équipement, description équipement, numéro OF, numéro Opération
            // si l'équipement est paramétré "production piece finie" et la gestion SPC est active
            if ($aData[0]["productionpiecefinie"] == 1 && $aData[0]['spcactif'] == 1) {
                // création du tableau de données
                // première ligne = tableau des entêtes de colonnes csv
                // deuxième ligne, données csv
                $aSPCData = array(
                    ['date', 'atelier', 'operateur', 'equipement', 'description equipement', 'OF', 'Operation', 'type operation', 'idproduit', 'desig', 'desig2'],
                    [$aData[0]['dateactivite'], $aData[0]['atelier'], $aData[0]['operateur'], $aData[0]['equipement'], $aData[0]['equipementlibelle'], trim($aData[0]['of']), trim($aData[0]['op']), $aData[0]['typeopn'], $aData[0]['idproduit'], $aData[0]['desig'], $aData[0]['desig2']]
                );

                // initialisation du chemin complet du fichier à créer
                $fileName = $aData[0]['spcrootfolder'] . '/' . trim($aData[0]['of']) . ".csv";

                // création du fichier et écriture des données csv
                try {

                    $file = fopen($fileName, 'w');
                    foreach ($aSPCData as $row) {
                        fputcsv($file, $row, ";", '"');
                    }

                    // fermeture du fichier
                    fclose($file);

                    // log l'évenement
                    $log = new extraFileLog();
                    $log->spc($fileName, 'in');
                } catch (Exception $e) {
                    // log l'évenement
                    $log = new extraFileLog();
                    $log->spcError($fileName, $e->getMessage());
                }
            }
            // création du fichier déclencheur CoLOS
            // ce fichier contient le numéro d'OF pour que CoLOS puisse collecter les données de marquage
            // si l'équipement est paramétré "marquage" et la gestion CoLOS est active et il n'y a pas de collaboration en cours
            if ($aData[0]["transfertmarquage"] == 1 && $aData[0]['marquageactif'] == 1 && $aData[0]['collaborationencours'] == 0) {

                // initialisation du chemin complet du fichier à créer
                $fileName = $aData[0]['markemrootfolder'] . '/' . trim($aData[0]['chemincolosnom']) . '/' . trim($aData[0]['chemincolosnom']) . ".txt";

                // création du fichier et écriture des données
                $file = fopen($fileName, 'w');
                fwrite($file, $aData[0]['of']);

                // fermeture du fichier
                fclose($file);

                // log l'évenement
                $log = new extraFileLog();
                $log->colos($fileName, $aData[0]['of']);
            }

            //---- Si création d'activité sur une opération terminée
            //    génération d'une alerte
            $ClassMngt->alertCheck($action, (object) [
                'act_id' => $iActId,
                'closed' => $closedoper,
            ]);

            $bSucces = true;
            $aListe = $Bdd->aExecReq;
        }

        break;

    case 'newAlea':
        $Bdd->QryExec(sprintf($aActivities['newalea'], $act_id, $ald_id));
        //$aActDet = $Bdd->QryToArray(sprintf($aActivities['actdetail'], $act_id));
        $aMessages[] = $Bdd->aExecReq['message'];
        $bSucces = $Bdd->aExecReq['success'];
        break;

        /**
         * @author  Hervé Valot
         * @description création d'un aléa libre (Hors production) en mode production ou correction
         */
    case 'newFreeAlea':
        /* liste des paramètres optionnels
        - chaine vide par défaut
        - sera complétée dans le cas de la création depuis le mode correction */
        $sOptionalPrm = '';
        // comportement en mode création, utilisation majoritaire de l'application
        $iForce = 0;
        // résultat optimiste par défaut
        $bSuccess = true;
        // données de programmation de l'aléa
        $sSchedule = '';
        if (isset($scheddule)) {

            $oSchedule = json_decode($schedule);

            if ($oSchedule->alp_date_debutprog !== null) {
                $sSchedule = ', @USR_ID = ' . $oSchedule->userId;
                $sSchedule .= ', @ALP_DATE_DEBUTPROG = ' . $Bdd->FormatSql($oSchedule->alp_date_debutprog, 'C');
                $sSchedule .= ', @ALP_DATE_FINPROG = ' . $Bdd->FormatSql($oSchedule->alp_date_finprog, 'C');
                $sSchedule .= ', @ALP_ESTACTIF = ' . ($oSchedule->alp_estactif ? 1 : 0);
                $sSchedule .= ', @ALP_ESTIMPOSE = ' . ($oSchedule->alp_estimpose ? 1 : 0);
                $sSchedule .= ', @ALP_ABONNEMENT = ' . ($oSchedule->acceptNotif ? 1 : 0);
                $sSchedule .= ', @ALP_COMMENTAIRE = ' . $Bdd->FormatSql($oSchedule->alp_commentaire, 'C');
            }
        }

        // mise à jour des paramètres et préparation des données pour le mode "correction"
        if ($mode == 'correction') {
            // on utilise le mode forcé de la procédure SQL
            $iForce = 1;

            // préparation des paramètres optionnels à passer à la procédure SQL
            $oFields = json_decode($fields);
            /* préparation des paramètres optionnels de la requête, seront ajoutés aux paramètres obligatoires */
            $sOptionalPrm .= ', @ALA_DATEDEBUT    =' . $Bdd->FormatSql($oFields->ala_date_debut, 'C');
            $sOptionalPrm .= ', @ALA_DATEFIN      =' . $Bdd->FormatSql($oFields->ala_date_fin, 'C');
            $sOptionalPrm .= ', @ENCOURS          = 0'; // l'opération créée ne peut pas être en cours en mode correction
            $sOptionalPrm .= ', @CORRECTION       = 1'; // indique à SQL de gérer le mode correction (trace dans les historiques de correction)
            $sOptionalPrm .= ', @USR_ID_COR       =' . $rsc_id; // id de l'opérateur correcteur
            $sOptionalPrm .= ', @COMMENTAIRE      =' . $Bdd->FormatSql($oFields->aec_commentaire, 'C'); // commentaire de correction

            /*  ATTENTION, le paramètre $rsc_id contient au départ l'id du correcteur,
            il prend ensuite la valeur chaine de la liste des ressources utilisées
            il faut donc respecter l'ordre d'assignation et d'utilisation de ce paramètre
             */
            /* préparation du tableau des ressources */
            $aRessources = [];

            if ($oFields->usr_id !== '') {
                $aRessources[] = $oFields->usr_id;
            }

            if (isset($oFields->eqp_id) && $oFields->eqp_id !== '') {
                $aRessources[] = $oFields->eqp_id;
            }
            /* conversion du tableau des ressources en chaine de valeurs séparées par des virgules pour utilisation dans la procédure SQL */
            $rsc_id = join(',', $aRessources);
        }

        /* exécution des requêtes vers la base de données */
        /**
         * création de l'aléa corrigé
         * @param {String} $rsc_id liste des identifiants des ressources au format chaine
         * @param {int} $ald_id identifiant du type d'aléa à créer
         * @param {int} $org_id identifiant de l'atelier dans lequel l'aléa se produit
         * @param {String} $sScheddule chaine contenant les paramètres de programmation de l'aléa si nécessaire
         * @param {String} $sOptionalPrm chaine contenant les paramètres optionnels de l'aléa
         */
        $Bdd->QryExec(sprintf($aActivities['newfreealea'], $rsc_id, $ald_id, $org_id, $sSchedule, $sOptionalPrm));
        $aMessages[] = $Bdd->aExecReq['message'];
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'editFreeAlea':
        $oSchedule = json_decode($schedule);
        $sSchedule = '';

        if ($oSchedule->alp_date_debutprog !== '' && strtolower($oSchedule->alp_date_debutprog) !== 'null') {
            $sSchedule = ', @USR_ID = ' . $oSchedule->userId;
            $sSchedule .= ', @ALP_DATE_DEBUTPROG = ' . $Bdd->FormatSql($oSchedule->alp_date_debutprog, 'C');
            $sSchedule .= ', @ALP_DATE_FINPROG = ' . $Bdd->FormatSql($oSchedule->alp_date_finprog, 'C');
            $sSchedule .= ', @ALP_ESTACTIF = ' . ($oSchedule->alp_estactif ? 1 : 0);
            $sSchedule .= ', @ALP_ESTIMPOSE = ' . ($oSchedule->alp_estimpose ? 1 : 0);
            $sSchedule .= ', @ALP_ABONNEMENT = ' . ($oSchedule->acceptNotif ? 1 : 0);
            $sSchedule .= ', @ALP_COMMENTAIRE = ' . $Bdd->FormatSql($oSchedule->alp_commentaire, 'C');
        }

        $Bdd->QryExec(sprintf($aActivities['editfreealea'], $ala_id, $rsc_id, $ald_id, $sSchedule));
        $aMessages[] = $Bdd->aExecReq['message'];
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'validRessource':
        $aListe = [
            //---- Activités en cours sur cette ressource
            'currentact' => $Bdd->QryToArray(sprintf($aActivities['resscurrentact'], $rsc_id)),
            //---- Aléas en cours sur cette ressource
            'currentala' => $Bdd->QryToArray(sprintf($aActivities['resscurrentala'], $rsc_id)),
        ];
        $aMessages[] = $Bdd->aExecReq['message'];
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'loadAlea':
        $aListe = $Bdd->QryToArray(sprintf($aActivities['loadalea'], $ala_id));
        $bSucces = (count($aListe) > 0);
        break;

    case 'AleaEnd':
        $Bdd->QryExec(sprintf($aActivities['aleaend'], $ala_id));
        $aMessages[] = $Bdd->aExecReq['message'];
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'LstFreeAleas':
        $aListe = $Bdd->QryToArray(sprintf($aActivities['freealeas'], $aSpecFilter['sab_id']));
        $aMessages[] = $Bdd->aExecReq['message'];
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'LstActivities':
        $aListe = $Bdd->QryToArray(sprintf($aActivities['sectioncurract'], $aSpecFilter['sab_id']));
        $bSucces = (count($aListe) >= 0);
        break;

    case 'LstActEC':
        // var_dump('------------- PrmBase De Activités --------------');
        // var_dump($oSession->AppBase);
        // var_dump('-------------------------------------------------');
        // var_dump('------------- Donnée de la classeBDD B ------------');
        // var_dump($Bdd->getPrmBase());
        // var_dump('-------------------------------------------------');
        $aListe = $Bdd->QryToArray(sprintf($aActivities['sectioncurract'], $Bdd->FormatSql($aSpecFilter['sab_id'], 'C')));


        if(isset($aListe)){
            $bSucces = true;       // Comment vérifier que la requete est bonne ?
        } else{
            $bSucces = false;
        }                         // Si un résultat -> Bon, Si pas de résultat -> Faux / Pas de donnée mais requete bonne


        //$bSucces = (count($aListe) >= 0);
        break;

        /**
         * @author  Hervé Valot
         * @date    20200820
         * @description retoure la liste des activités liées à une opération passée en paramètre par son id de BDD
         */
    case 'LstActOpn':
        $aListe = $Bdd->QryToArray(sprintf($aActivities['activitieopn'], $Bdd->FormatSql($aSpecFilter['opn_id'], 'C')));
        if(isset($aListe)){
            $bSucces = true;
        }else{
            $bSucces = false;
        }
        break;
        /**
         * @author  Hervé Valot
         * @date    20200820
         * @description retoure la liste des activités consolidées liées à une opération passée en paramètre par son id de BDD
         */
    case 'LstActOpnCsl':
        $aListe = $Bdd->QryToArray(sprintf($aActivities['activitieopncsl'], $Bdd->FormatSql($aSpecFilter['opn_id'], 'C')));
        if(isset($aListe)){
            $bSucces = true;
        }else{
            $bSucces = false;
        }
        break;

    case 'ofExists':
        $aListe = $Bdd->QryToArray(sprintf($aActivities['ofexists'], $Bdd->FormatSql($odf_code, 'C')));
        if(isset($aListe)){
            $bSucces = true;
        }else{
            $bSucces = false;
        }
        break;

    case 'ofDetail':
        if ($odf_id == null) {
            //---- Si on n'a pas odf_id, ça veut dire qu'on a un ofnum à partir duquel on peut retrouver l'odf_id
            $aOf = $Bdd->QryToArray(sprintf($aActivities['ofexists'], $Bdd->FormatSql($ofnum, 'N')));
            $odf_id = $aOf[0]['odf_id'];
        }

        $aListe = $Bdd->QryToArray(sprintf($aActivities['ofdetails'], $Bdd->FormatSql($odf_id, 'N')));
        if(isset($aListe)){
            $bSucces = true;
        }else{
            $bSucces = false;
        }
        break;

    case 'ActHisto':
        $aHistoFilter = [];
        $sHistoFilter = '';

        foreach ($aSpecFilter as $sFieldName => $sValue) {
            switch ($sFieldName) {
                case 'sab_id':
                    $aHistoFilter[] = '@SAB_ID_STRING=' . $Bdd->FormatSql($sValue, 'C');
                    break;

                case 'nblines':
                    $aHistoFilter[] = ' @NBLIGNES=' . $sValue;
                    break;

                case 'odf_code':
                    $aHistoFilter[] = ' @ODF_CODE=' . $Bdd->FormatSql($sValue, 'C');
                    break;

                case 'bornedebut':
                    $aHistoFilter[] = ' @DATEDEBUTHISTO=' . $Bdd->FormatSql($sValue, 'C');
                    break;

                case 'bornefin':
                    $aHistoFilter[] = ' @DATEFINHISTO=' . $Bdd->FormatSql($sValue, 'C');
                    break;

                case 'dateref':
                    if ($sValue == 'd') {
                        $aHistoFilter[] = ' @DATEFILTRECRITERE=\'D\'';
                    } else {
                        $aHistoFilter[] = ' @DATEFILTRECRITERE=\'F\'';
                    }
                    break;
            }
        }

        if (count($aHistoFilter) > 0) {
            $sHistoFilter = join(', ', $aHistoFilter);
        }

        //error_log($sHistoFilter);
        $aListe = $Bdd->QryToArray(sprintf($aActivities['activitieshisto'], $sHistoFilter));
        $bSucces = (count($aListe) > 0);
        break;

        /**
         * @description liste des entités (activités et aléas)
         */
    case 'EntHisto':
        $aHistoFilter = [];
        $sHistoFilter = '';

        foreach ($aSpecFilter as $sFieldName => $sValue) {
            switch ($sFieldName) {
                case 'sab_id':
                    $aHistoFilter[] = '@SAB_ID_STRING=' . $Bdd->FormatSql($sValue, 'C');
                    break;

                    // case 'nblines':
                    //     $aHistoFilter[] = ' @NBLIGNES=' . $sValue;
                    //     break;

                    // case 'odf_code':
                    //     $aHistoFilter[] = ' @ODF_CODE=' . $Bdd->FormatSql($sValue, 'C');
                    //     break;

                case 'bornedebut':
                    $aHistoFilter[] = ' @DATEDEBUTHISTO=' . $Bdd->FormatSql($sValue, 'C');
                    break;

                case 'bornefin':
                    $aHistoFilter[] = ' @DATEFINHISTO=' . $Bdd->FormatSql($sValue, 'C');
                    break;

                case 'estsupprimee':
                    $aHistoFilter[] = ' @SUPPRIMEE =' . $sValue;
                    break;

                    // case 'dateref':
                    //     if ($sValue == 'd') {
                    //         $aHistoFilter[] = ' @DATEFILTRECRITERE=\'D\'';
                    //     } else {
                    //         $aHistoFilter[] = ' @DATEFILTRECRITERE=\'F\'';
                    //     }
                    //     break;
            }
        }

        if (count($aHistoFilter) > 0) {
            $sHistoFilter = join(', ', $aHistoFilter);
        }

        //error_log($sHistoFilter);
        $aListe = $Bdd->QryToArray(sprintf($aActivities['entitieshisto'], $sHistoFilter));

        if(isset($aListe)){
            $bSucces = true;
        }else{
            $bSucces = false;
        }

        //$bSucces = (count($aListe) > 0);
        break;

    case 'QtyTypeLst':
        $aListe = $Bdd->QryToArray($aActivities['qtytypelist']);
        $bSucces = (count($aListe) > 0);
        break;

    case 'NewActCtrl':
        $aListe = $Bdd->QryToArray(sprintf($aActivities['createctrl'], $Bdd->FormatSql($rsc_id, 'C')));
        $bSucces = $Bdd->aExecReq['success'];
        break;

        /**
         * @author  Hervé Valot
         * @description création nouvelle activité de production en mode standard ou correction (cration activité manquante)
         */
    case 'NewActivitie':
        $sOptionalPrm = ''; /* liste des paramètres optionnels */

        /* identifier le mode de fonctionnement attendu */
        if ($mode == 'correction') {
            $oFields = json_decode($fields);
            /* préparation du XML des quantités */
            $sQuantityXML = ''; // chaine vide par défaut, on vérifie par la suite si il y a des quantités à placer dans cette chaine
            if ($quantity !== '') {
                $aQuantity = json_decode($quantity);
                $sQuantityXML = '<QUANTITES>';
                $sQuantityAtt = '';

                foreach ($aQuantity->qtp_id as $iInd => $iQtyTypeId) {
                    $sQuantityAtt = '';

                    if ($aQuantity->qty[$iInd] !== null) {
                        $sQuantityAtt = '" VALEUR="' . $aQuantity->qty[$iInd];
                    }

                    $sQuantityXML .= '<QTE QTP_ID="' . $iQtyTypeId . '" RSC_ID="' . $oFields->usr_id . $sQuantityAtt . '" />';
                    //}
                }

                $sQuantityXML .= '</QUANTITES>';
            }
            /* préparation du tableau des ressources */
            $aRessources = [];

            if ($oFields->usr_id !== '') {
                $aRessources[] = $oFields->usr_id;
            }

            if ($oFields->eqp_id !== '') {
                $aRessources[] = $oFields->eqp_id;
            }
            /* préparation des paramètres optionnels de la requête, seront ajoutés aux paramètres obligatoires */
            $sOptionalPrm .= ', @DATEDEBUT        =' . $Bdd->FormatSql($oFields->act_date_debut, 'C');
            $sOptionalPrm .= ', @DATEFIN          =' . $Bdd->FormatSql($oFields->act_date_fin, 'C');
            $sOptionalPrm .= ', @ENCOURS          = 0';
            // $sOptionalPrm .=', @TEMPS_REGLAGE_J  ='. $Bdd->FormatSql($oFields->opn_temps_reglage_j, 'N');
            $sOptionalPrm .= ', @TEMPS_UNITAIRE_J =' . $Bdd->FormatSql($oFields->ope_temps_unitaire_j, 'N');
            $sOptionalPrm .= ', @QUANTITE         =' . $Bdd->FormatSql($sQuantityXML, 'C');
            $sOptionalPrm .= ', @CORRECTION       =1';
            $sOptionalPrm .= ', @USR_ID_COR       =' . $rsc_id;
            $sOptionalPrm .= ', @COMMENTAIRE      =' . $Bdd->FormatSql($oFields->acr_commentaire, 'C');

            $iForce = 1;
            $rsc_id = join(',', $aRessources);
            $ope_id = $oFields->opn_id;
            $odf_id = $oFields->odf_id;
            $org_id = $oFields->org_id;

            $Bdd->QryExec(sprintf($aActivities['create'], $ope_id, $odf_id, $org_id, $Bdd->FormatSql($rsc_id, 'C'), $iForce, $sOptionalPrm));

            if (!$Bdd->aExecReq['success']) {
                $bSucces = false;
            } else {
                $bSucces = true;
                $aListe = $Bdd->aExecReq;
            }
        } else {
            $iForce = 0;
            if ($closedoper || $assistance) {
                $iForce = 1;
            }
            $Liste = $Bdd->QryToArray(sprintf($aActivities['create'], $ope_id, $odf_id, $org_id, $Bdd->FormatSql($rsc_id, 'C'), $iForce, $sOptionalPrm)); // FIXME: L'erreur provient du fait que la requete ne renvoie pas l'identifiant
            //var_dump(sprintf($aActivities['create'], $ope_id, $odf_id, $org_id, $Bdd->FormatSql($rsc_id, 'C'), $iForce, $sOptionalPrm));   // Cela envoie donc une requete avec une variable null. La requete vas donc finir par = et provoquer une erreur
            if (!$Bdd->aExecReq['success']) {
                $bSucces = false;
            } else {
                // récupération de l'id de l'activité
                $iActId = $Liste[0]['act_id'];

                // acquisition des informations communes pour la création des fichiers externes
                $aData = $Bdd->QryToArray(sprintf($aActivities['infoSPC'], $iActId)); // FIXME: Provoque une erreur dans la fonction QryToArray car $iActId vide

                // création du fichier SPC (GOM)
                // ce fichier contient des informations de production pour ajout aux données de mesure SPC
                // date, atelier, opérateur, équipement, description équipement, numéro OF, numéro Opération
                // si l'équipement est paramétré "production piece finie" et la gestion SPC est active
                if ($aData[0]["productionpiecefinie"] == 1 && $aData[0]['spcactif'] == 1) {
                    // création du tableau de données
                    // première ligne = tableau des entêtes de colonnes csv
                    // deuxième ligne, données csv
                    $aSPCData = array(
                        ['date', 'atelier', 'operateur', 'equipement', 'description equipement', 'OF', 'Operation', 'type operation', 'idproduit', 'desig', 'desig2'],
                        [$aData[0]['dateactivite'], $aData[0]['atelier'], $aData[0]['operateur'], $aData[0]['equipement'], $aData[0]['equipementlibelle'], trim($aData[0]['of']), trim($aData[0]['op']), $aData[0]['typeopn'], $aData[0]['idproduit'], $aData[0]['desig'], $aData[0]['desig2']]
                    );

                    // initialisation du chemin complet du fichier à créer
                    $fileName = $aData[0]['spcrootfolder'] . DIRECTORY_SEPARATOR . trim($aData[0]['of']) . ".csv";

                    // création du fichier et écriture des données csv
                    try {
                        $file = fopen($fileName, 'w');
                        foreach ($aSPCData as $row) {
                            fputcsv($file, $row, ";", '"');
                        }

                        // fermeture du fichier
                        fclose($file);

                        // log l'évenement
                        $log = new extraFileLog();
                        $log->spc($fileName, 'in');
                    } catch (Exception $e) {
                        // log l'évenement
                        $log = new extraFileLog();
                        $log->spcError($fileName, $e->getMessage());
                    }
                }

                // création du fichier déclencheur CoLOS
                // ce fichier contient le numéro d'OF pour que CoLOS puisse collecter les données de marquage
                // si l'équipement est paramétré "marquage" et la gestion CoLOS est active et il n'y a pas de collaboration en cours
                if ($aData[0]["transfertmarquage"] == 1 && $aData[0]['marquageactif'] == 1 && $aData[0]['collaborationencours'] == 0) {

                    // initialisation du chemin complet du fichier à créer
                    $fileName = $aData[0]['markemrootfolder'] . DIRECTORY_SEPARATOR . trim($aData[0]['chemincolosnom']) . DIRECTORY_SEPARATOR . trim($aData[0]['chemincolosnom']) . ".txt";

                    // création du fichier et écriture des données
                    $file = fopen($fileName, 'w');
                    fwrite($file, $aData[0]['of']);

                    // fermeture du fichier
                    fclose($file);

                    // log l'évenement
                    $log = new extraFileLog();
                    $log->colos($fileName, $aData[0]['of']);
                }

                //---- Si création d'activité sur une opération terminée
                //    génération d'une alerte
                $ClassMngt->alertCheck($action, (object) [
                    'act_id' => $iActId,
                    'closed' => $closedoper,
                ]);

                $bSucces = true;
                $aListe = $Bdd->aExecReq;
            }
        }
        break;

        /**
         * @author  Hervé VALOT
         * @description Création d'une activité de réglage (activité + aléa réglage)
         * @description utilisée aussi pour la création d'activités de réglage manquante (depuis module de correction)
         */
    case 'NewAleaReglage':
        /* liste des paramètres optionnels
        - chaine vide par défaut
        - sera complétée dans le cas de la création depuis le mode correction */
        $sOptionalPrm = '';
        // comportement en mode création, utilisation majoritaire de l'application
        $iForce = 0;
        // résultat optimiste par défaut
        $bSuccess = true;

        // mise à jour des paramètres et préparation des données pour le mode "correction"
        if ($mode == 'correction') {
            // on utilise le mode forcé de la procédure SQL
            $iForce = 1;

            // préparation des paramètres complémentaires à passer à la procédure SQL
            $oFields = json_decode($fields);
            /* préparation de la chaine XML des quantités */
            $sQuantityXML = ''; // chaine vide par défaut, on vérifie par la suite si il y a des quantités à placer dans cette chaine
            if ($quantity !== '') {
                $aQuantity = json_decode($quantity);
                $sQuantityXML = '<QUANTITES>';
                $sQuantityAtt = '';

                foreach ($aQuantity->qtp_id as $iInd => $iQtyTypeId) {
                    $sQuantityAtt = '';

                    if ($aQuantity->qty[$iInd] !== null) {
                        $sQuantityAtt = '" VALEUR="' . $aQuantity->qty[$iInd];
                    }
                    $sQuantityXML .= '<QTE QTP_ID="' . $iQtyTypeId . '" RSC_ID="' . $oFields->usr_id . $sQuantityAtt . '" />';
                }

                $sQuantityXML .= '</QUANTITES>';
            }

            /* préparation des paramètres optionnels de la requête, seront ajoutés aux paramètres obligatoires */
            $sOptionalPrm .= ', @CORRECTION    = 1'; // indique à SQL de gérer le mode correction (trace dans les historiques de correction)
            $sOptionalPrm .= ', @USR_ID_COR    =' . $rsc_id;
            $sOptionalPrm .= ', @COMMENTAIRE   =' . $Bdd->FormatSql($oFields->acr_commentaire, 'C');
            $sOptionalPrm .= ', @ALA_DATEDEBUT =' . $Bdd->FormatSql($oFields->act_date_debut, 'C');
            $sOptionalPrm .= ', @ALA_DATEFIN   =' . $Bdd->FormatSql($oFields->act_date_fin, 'C');
            $sOptionalPrm .= ', @ENCOURS       = 0'; // l'opération créée ne peut pas être en cours en mode correction
            $sOptionalPrm .= ', @QUANTITE      =' . $Bdd->FormatSql($sQuantityXML, 'C');

            /*  ATTENTION, le paramètre $rsc_id contient au départ l'id du correcteur,
            il prend ensuite la valeur chaine de la liste des ressources utilisées
            il faut donc respecter l'ordre d'assignation et d'utilisation de ce paramètre
             */
            /* préparation du tableau des ressources */
            $aRessources = [];

            if ($oFields->usr_id !== '') {
                $aRessources[] = $oFields->usr_id;
            }

            if ($oFields->eqp_id !== '') {
                $aRessources[] = $oFields->eqp_id;
            }
            /* conversion du tableau des ressources en chaine de valeurs séparées par des virgules pour utilisation dans la procédure SQL */
            $rsc_id = join(',', $aRessources);
        }

        /* création de l'activité réglage (la procédure stockée SQL gère les deux objets ) */
        $Bdd->QryExec(sprintf($aActivities['aleareglage'], $opn_id, $odf_id, $org_id, $Bdd->FormatSql($rsc_id, 'C'), $sOptionalPrm));
        $aMessages[] = $Bdd->aExecReq['message'];
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'ActDetail':
        $aListe = $Bdd->QryToArray(sprintf($aActivities['actdetail'], $act_id));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'OpeTimes':
        $aListe = $Bdd->QryToArray(sprintf($aActivities['opetime'], $opn_id, $odf_id));
        $aUserTime = $Bdd->QryToArray(sprintf($aActivities['usertime'], $opn_id, $odf_id, $eqp_id));

        if (count($aUserTime) > 0) {
            $aListe[0] = array_merge($aListe[0], $aUserTime[0]);
        }
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'EqpTimes':
        //error_log(sprintf($aActivities['usertime'], $opn_id,$odf_id, $eqp_id));
        $aListe = $Bdd->QryToArray(sprintf($aActivities['usertime'], $opn_id, $odf_id, $eqp_id));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'QtyDetail':
        $sFilter = '';
        if (isset($aSpecFilter['act_id'])) {
            $sFilter = '@ACT_ID=' . $aSpecFilter['act_id'];
        }

        $aListe = $Bdd->QryToArray(sprintf($aActivities['qtydetail'], $sFilter));
        $bSucces = $Bdd->aExecReq['success'];
        break;

    case 'ActQty':
        $aMessages = [];
        $aQuantity = json_decode($quantity);

        foreach ($aQuantity->qtp_id as $iInd => $iQtyTypeId) {
            if ($aQuantity->qty[$iInd] !== '' && $aQuantity->qty[$iInd] !== null) {
                $Bdd->QryExec(sprintf($aActivities['qtyinsert'], $act_id, $ope_id, $iQtyTypeId, $aQuantity->qty[$iInd]));
                $bSucces = $Bdd->aExecReq['success'];

                if (!$Bdd->aExecReq['success']) {
                    $aMessages[] = $Bdd->aExecReq['message'];
                }
            }
        }

        break;

        /**
         * @author  Hervé Valot
         * @date    20200410
         * @description mise à jour des données d'un aléa (module correction)
         */
    case 'updateAla': // correction d'un aléa (hors production)
        /**
         * paramètres obligatoires
         */
        $sExpectedPrm = sprintf('@ALA_ID_ORG = %1$s, @RSC_ID = %2$s', $ala_id, $rsc_id);

        /**
         * paramètres optionnels passés dans un tableau
         * ces paramètres ne sont envoyés à la procédure SQL que si ils sont renseignés
         */
        $oFields = json_decode($fields); // tableau des nouvelles valeurs
        $oOrigVal = json_decode($originalval); // tableau des valeurs d'origine de l'aléa
        $sOptionalPrm = ''; // chaine contenant les valeurs des paramètres optionnels (procédure SQL)

        if (intval($oFields->ald_id) > 0) { // identifiant de la définition de l'aléa
            $sOptionalPrm .= sprintf(', @ALD_ID = %1$s', $oFields->ald_id);
        }

        if ($oFields->ala_date_debut !== '') { // date de début de l'aléa
            $sOptionalPrm .= sprintf(', @ALA_DATE_DEBUT = %1$s', $Bdd->FormatSql($oFields->ala_date_debut, 'C'));
        }

        if ($oFields->ala_date_fin !== '') { // date de fin de l'aléa
            $sOptionalPrm .= sprintf(', @ALA_DATE_FIN = %1$s', $Bdd->FormatSql($oFields->ala_date_fin, 'C'));
        }

        if ($oFields->usr_id !== '' || $oFields->eqp_id !== '') { // ressources consommées par l'aléa
            $aRessources = [];

            if ($oFields->usr_id !== '') { // l'opérateur
                $aRessources[] = $oFields->usr_id;
            }

            $sOptionalPrm .= sprintf(', @RSC_ID_STRING = %1$s', $Bdd->FormatSql(join(',', $aRessources), 'C'));
        }

        if ($oFields->aec_commentaire !== '') { // commentaire de correction
            $sOptionalPrm .= sprintf(', @COMMENTAIRE = %1$s', $Bdd->FormatSql($oFields->aec_commentaire, 'C'));
        }

        /**
         * mise à jour du corps de la procédure stockée et exécution
         */
        $Bdd->QryExec(sprintf($aActivities['updateala'], $sExpectedPrm, $sOptionalPrm));
        $bSucces = $Bdd->aExecReq['success'];
        $aMessages[] = $Bdd->aExecReq['message'];

        if ($bSucces) {
            //---- Test si alerte
            $ClassMngt->alertCheck($action, (object) [
                'act_id' => $act_id,
                'fields' => $oFields,
                'originalvalues' => $oOrigVal,
            ]);
        }

        break;

        /**
         * @author  Hervé Valot
         * @date    20200511
         * @description mise à jour des données d'une activité réglage (module correction)
         */
    case 'updateSettingAct': // correction d'une activité non planifiée
        // pas de code ici, le traitement se fait en conditionnel dans le cas 'updateAct'
        // pas de break pour pouvoir enchainer sur le cas
        /**
         * @author  Hervé Valot
         * @date    20200410
         * @description mise à jour des données d'une activité non planifiée (module correction)
         */
    case 'updateUnplanedAct': // correction d'une activité non planifiée
        // pas de code ici, le traitement se fait en conditionnel dans le cas 'updateAct'
        // pas de break pour pouvoir enchainer sur le cas
        /**
         * @author  Hervé Valot
         * @date    20200505
         * @description mise à jour des activités qualité
         */
    case 'updateQualityAct':
        // pas de code ici, le traitement se fait en conditionnel dans le cas 'updateAct'
        // pas de break pour pouvoir enchainer sur le cas
        /**
         * @author  Hervé Valot
         * @date    20200410
         * @description mise à jour des données d'une activité de production (module correction)
         */
    case 'updateAct': // correction d'une activité de production et non planifiée

        // transforme le JSON reçu en objet PHP exploitable
        $oFields = json_decode($fields);
        $oOrigVal = json_decode($originalval);
        $sOptionalPrm = ''; // chaine pour enregistrer les paramètres optionnels à passer à la procédure SQL

        // traites les quantités reçues (si il y en a) et génère la chaine XML à passer à la procédure SQL
        $sQuantityXML = ''; // chaine vide par défaut, on vérifie par la suite si il y a des quantités à placer dans cette chaine
        if ($quantity !== '') {
            $aQuantity = json_decode($quantity);
            $sQuantityXML = '<QUANTITES>';
            $sQuantityAtt = '';

            foreach ($aQuantity->qtp_id as $iInd => $iQtyTypeId) {
                $sQuantityAtt = '';

                if ($aQuantity->qty[$iInd] !== null) {
                    $sQuantityAtt = '" VALEUR="' . $aQuantity->qty[$iInd];
                }

                $sQuantityXML .= '<QTE QTP_ID="' . $iQtyTypeId . '" RSC_ID="' . $oFields->usr_id . $sQuantityAtt . '" />';
                //}
            }

            $sQuantityXML .= '</QUANTITES>';
        }

        /**
         * si on met à jour une activité non planifiée ou qualité il faut
         * vérfier l'existance de l'opération complémentaire
         * et la créer si nécessaire (la création est gérée par la procédure SQL)
         *
         * les activités non planifiées sont classées dans l'OF 200
         * les activités qualité sont ajoutées à l'OF indiqué juste après la dernière opération disponible
         * une opération est créée pour chaque paire équipement/service bénéficiaire de l'opération
         * en BDD les opérations doivent faire référence à un équipement (RSC_ID NOT NULL)
         */

        if ($action == 'updateUnplanedAct' || $action == 'updateQualityAct') {
            $Bdd->QryExec(sprintf($aActivities['compactcreate'], $oFields->odf_id, $oFields->eqp_id, $oFields->opc_id));
            // retour de la base de données
            if (!$Bdd->aExecReq['success']) {
                // echec de la création, on n'a pas d'opération à utiliser, on ne peut pas aller plus loin
                $bSucces = false;
                break;
            } else {
                $aListe = $Bdd->aExecReq;
                // on récupère l'identifiant de l'opération qui vient d'être créée (ou existante)
                // et on met à jour le tableau de paramètres reçu
                $oFields->opn_id = $aListe['results'][0]['_newopnid'];
                // $opn_id = $aListe['results'][0]['_newopnid'];
            }
        }

        /**
         * traitement spécifique aux activités de production et réglage
         */
        if ($action == 'updateAct' || $action == 'updateSettingAct') {

            if (floatval($oFields->opn_temps_montage_j) > 0) {
                $sOptionalPrm .= sprintf(', @TEMPS_MONTAGE_J = %1$s', $Bdd->FormatSql($oFields->opn_temps_montage_j, 'N'));
            }

            if (floatval($oFields->opn_temps_reglage_j)) {
                $sOptionalPrm .= sprintf(', @TEMPS_REGLAGE_J = %1$s', $Bdd->FormatSql($oFields->opn_temps_reglage_j, 'N'));
            }

            if (floatval($oFields->ope_temps_unitaire_j)) {
                $sOptionalPrm .= sprintf(', @TEMPS_UNITAIRE_J = %1$s', $Bdd->FormatSql($oFields->ope_temps_unitaire_j, 'N'));
            }
        }

        /**
         * traitement commun, création de l'activité de correction
         */
        // Constitution de la chaîne de paramètres a passer à la procédure
        // 2 paramètres obligatoires
        $sExpectedPrm = sprintf('@RSC_ID = %1$s, @ACT_ID_ORG = %2$s', $rsc_id, $act_id);

        // 10 paramètres optionnels, passés en paramètres dans un tableau
        // $oFields = json_decode($fields);

        /**
         * les paramètres optionnels sont ajoutés à la requête uniquement si ils sont définis
         */
        if (intval($oFields->opn_id) > 0) {
            $sOptionalPrm .= sprintf(', @OPN_ID = %1$s', $oFields->opn_id);
        }

        if (intval($oFields->odf_id) > 0) {
            $sOptionalPrm .= sprintf(', @ODF_ID = %1$s', $oFields->odf_id);
        }

        /* pour l'instant on ne gère pas la possibilité de changer l'activité de section de production
        if (intval($oFields->org_id)>0) {
        $sOptionalPrm .= sprintf(', @ORG_ID = %1$s', $oFields->org_id);
        }
         */

        if ($oFields->act_date_debut !== '') {
            $sOptionalPrm .= sprintf(', @ACT_DATE_DEBUT = %1$s', $Bdd->FormatSql($oFields->act_date_debut, 'C'));
        }

        if ($oFields->act_date_fin !== '') {
            $sOptionalPrm .= sprintf(', @ACT_DATE_FIN = %1$s', $Bdd->FormatSql($oFields->act_date_fin, 'C'));
        }

        if ($oFields->acr_commentaire !== '') {
            $sOptionalPrm .= sprintf(', @COMMENTAIRE = %1$s', $Bdd->FormatSql($oFields->acr_commentaire, 'C'));
        }

        if ($oFields->usr_id !== '' || $oFields->eqp_id !== '') {
            $aRessources = [];

            if ($oFields->usr_id !== '') {
                $aRessources[] = $oFields->usr_id;
            }

            if ($oFields->eqp_id !== '') {
                $aRessources[] = $oFields->eqp_id;
            }

            $sOptionalPrm .= sprintf(', @RSC_ID_STRING = %1$s', $Bdd->FormatSql(join(',', $aRessources), 'C'));
        }

        if ($sQuantityXML !== '') {
            $sOptionalPrm .= sprintf(', @QUANTITE = %1$s', $Bdd->FormatSql($sQuantityXML, 'C'));
        }

        if ($action == 'updateSettingAct') {
            $sOptionalPrm .= sprintf(', @ALA_ID_ORG = %1$s', $oFields->ala_id);
            $Bdd->QryExec(sprintf($aActivities['updatealeareglage'], $sExpectedPrm, $sOptionalPrm));
        } else {
            $Bdd->QryExec(sprintf($aActivities['update'], $sExpectedPrm, $sOptionalPrm));
        }
        $bSucces = $Bdd->aExecReq['success'];
        $aMessages[] = $Bdd->aExecReq['message'];

        if ($bSucces) {
            //---- Test si alerte
            $ClassMngt->alertCheck($action, (object) [
                'act_id' => $act_id,
                'fields' => $oFields,
                'originalvalues' => $oOrigVal,
            ]);
        }
        break;

        /**
         * @author  Hervé Valot
         * @date    20200410
         * @description fin d'activité. les cas Suspendre/Stop/Stop avec contrôle limité/ pas de vérification quantité
         *              sont gérés dans le cas NoQuantityCheck
         */
    case 'Suspend':
    case 'Stop':
    case 'StopLimitedControl':
    case 'NoQuantityCheck':
        $aQuantity = json_decode($quantity);
        $aExpectedQty = json_decode($expectedqty);
        $sQuantityXML = '<QUANTITES>';
        $aVariables[7];
        $aVariables[6];
        // création de la chaine XML des quantités
        foreach ($aQuantity->qtp_id as $iInd => $iQtyTypeId) {
            if ($aQuantity->qty[$iInd] !== '' && $aQuantity->qty[$iInd] !== null) {
                $sQuantityXML .= '<QTE QTP_ID="' . $iQtyTypeId . '" RSC_ID="' . $ope_id . '" VALEUR="' . $aQuantity->qty[$iInd] . '" />';
            }
        }

        // fermeture de la chaine XML
        $sQuantityXML .= '</QUANTITES>';

        if ($alt_qterequis > 0) {
            // dans le cas des aléas de type réglage on doit pouvoir saisir des quantités
            // dans ce cas particulier on a fait le choix de terminer l'aléa et l'activité porteuse de l'aléa en même temps
            // pour simplifier la gestion ultèrieure.

            // met fin à l'aléa
            $Bdd->QryExec(sprintf($aActivities['aleaend'], $ala_id));
        }
        // TODO: gérer les différents cas de figure, prod/qualité/non planifié soit en stop, soit en suspend
        if ($action == 'Stop') {
            //---- Terminer
            $Bdd->QryExec(sprintf($aActivities['stopsuspend'], $act_id, '1', $Bdd->FormatSql($sQuantityXML, 'C')));
        } else {
            //---- Suspendre
            $Bdd->QryExec(sprintf($aActivities['stopsuspend'], $act_id, '0', $Bdd->FormatSql($sQuantityXML, 'C')));
        }

        if ($Bdd->aExecReq['success']) {
            // gestion des alertes
            $ClassMngt->alertCheck($action, (object) [
                'act_id' => $act_id,
                'qty' => $aQuantity,
                'expqty' => $aExpectedQty,
            ]);
            // TODO: hvt 2022-07-25 22:50:37 prévoir la gestion directe, sans passer par le service File d'attente MARKEM
            //---- Création de l'enregistrement de fin de marquage
            // $Bdd->QryExec(sprintf($aActivities['mrkcreate'], $act_id, 'F'));
            $bSucces = true;

            // Suppression du déclencheur SPC si nécessaire
            // DEV: HVT 2022-07-25 15:58:49 création des fichiers externes (déclencheurs)
            // acquisition des informations de production de l'activité
            $aData = $Bdd->QryToArray(sprintf($aActivities['infoSPC'], $act_id));
            error_log(var_export($aData, true));

            if ($aData[0]["productionpiecefinie"] == 1) {
                // le paramétrage de l'équipement est à production piecefinie = 1
                // initialisation du chemin complet du fichier à supprimer
                $fileName = $aData[0]['spcrootfolder'] . '/' . trim($aData[0]['of']) . ".csv";
                // suppression du fichier si il existe encore
                if (file_exists($fileName)) {
                    @unlink($fileName);
                }
                if (file_exists($fileName)) {
                    // log de l'évenement
                    $log = new extraFileLog();
                    $log->spcError($fileName, 'Erreur lors de la suppression du fichier, le fichier n\'a pas ete supprime');
                } else {
                    // log de l'évenement
                    $log = new extraFileLog();
                    $log->spc($fileName, 'out');
                }
            }

            // création du déclencheur CoLOS de fin de marquage
            // si l'équipement est paramétré "marquage" et la gestion CoLOS est active et il n'y a pas de collaboration en cours
            if ($aData[0]["transfertmarquage"] == 1 && $aData[0]['marquageactif'] == 1 && $aData[0]['collaborationencours'] == 0) {

                // initialisation du chemin complet du fichier à créer
                $fileName = $aData[0]['markemrootfolder'] . '/' . trim($aData[0]['chemincolosnom']) . '/' . trim($aData[0]['chemincolosnom']) . ".txt";

                // création du fichier et écriture des données
                $file = fopen($fileName, 'w');
                // le code FINOP indique à CoLOS d'envoyer un message spécifique à l'imprimante (pas de marquage disponible)
                fwrite($file, 'FINOP');

                // fermeture du fichier
                fclose($file);

                // log de l'évenement
                $log = new extraFileLog();
                $log->colos($fileName, $aData[0]['of'] . ' FINOP');
            }
        } else {
            $bSucces = false;
            $aMessages[] = $Bdd->aExecReq['message'];
        }

        break;

        /**
         * @author  Hervé VALOT
         * @date    20201127
         * @description termine une activité non planifiée, pas de quantité enregistrée sur ce type d'activité
         */
    case 'stopUnplanedActivity':
        $Bdd->QryExec(sprintf($aActivities['stopunplanedactivity'], $act_id, '0', null));
        if ($Bdd->aExecReq['success']) {
            //---- Création de l'enregistrement de fin de marquage
            $Bdd->QryExec(sprintf($aActivities['mrkcreate'], $act_id, 'F'));
            $bSucces = true;
        } else {
            $bSucces = false;
            $aMessages[] = $Bdd->aExecReq['message'];
        }
        break;

    case 'UserAct':
        $aListe = $Bdd->QryToArray(sprintf($aActivities['useract'], $aSpecFilter['usr_id']));
        $bSucces = true;
        break;

    case 'UserAlea':
        $aListe = $Bdd->QryToArray(sprintf($aActivities['useralea'], $aSpecFilter['usr_id']));
        $bSucces = true;
        break;

        /**
         * @author  Hervé Valot
         * suppression d'une activité
         * pas de suppression physique, marqueur de suppression uniquement
         * informations de suppression requises
         * - identifiant de l'opérateur
         * - identifiant de l'activité
         */
    case 'deleteAct':
        // paramètres obligatoires
        $sFilter = ' @ACT_ID=' . $ent_id;
        $sFilter .= ' ,@RSC_ID=' . $usr_id;
        // construction de la chaine de paramètres optionnels
        if (isset($motif)) {
            $sFilter .= " ,@COMMENTAIRE=" . $Bdd->FormatSql($motif, 'C');
        }
        if ($restore == '') {
            $sFilter .= ' ,@RESTORE=0';
        }

        $Bdd->QryExec(sprintf($aActivities['deleteact'], $sFilter));
        $aMessages[] = $Bdd->aExecReq['message'];
        $bSucces = $Bdd->aExecReq['success'];
        break;
        /**
         * @author  Hervé Valot
         * suppression d'un aléa
         * pas de suppression physique, marqueur de suppression uniquement
         * informations de suppression requises
         * - identifiant de l'opérateur
         * - identifiant de l'activité
         */
    case 'deleteAlea':
        // paramètres obligatoires
        $sFilter = ' @ALA_ID=' . $ent_id;
        $sFilter .= ' ,@RSC_ID=' . $usr_id;
        // construction de la chaine de paramètres optionnels
        if (isset($motif)) {
            $sFilter .= " ,@COMMENTAIRE=" . $Bdd->FormatSql($motif, 'C');
        }
        if ($restore == '') {
            $sFilter .= ' ,@RESTORE=0';
        }

        $Bdd->QryExec(sprintf($aActivities['deleteala'], $sFilter));
        $aMessages[] = $Bdd->aExecReq['message'];
        $bSucces = $Bdd->aExecReq['success'];
        break;
}

switch ($action) {
    case 'FreeAleaList':
    case 'AleaList':
    case 'LstActEC':
    case 'LstActOpn':
    case 'LstActOpnCsl':
    case 'LstFreeAleas':
    case 'ofExists':
    case 'ofDetail':
    case 'validRessource':
    case 'ActHisto':
    case 'EntHisto':
    case 'QtyTypeLst':
    case 'NewActCtrl':
    case 'ActDetail':
    case 'QtyDetail':
    case 'UserAct':
    case 'UserAlea':
    case 'OpeTimes':
    case 'EqpTimes':
    case 'loadAlea':
    case 'CompActList':
    case 'UnplanedOPList':
    case 'GetOf200Id':
        if(isset($aListe)){
    
            $oJson = array(
                "success" => $bSucces,
                "NbreTotal" => count($aListe),
                "liste" => $aListe,
            );
        }else{
            $oJson = array(
                "success" => $bSucces,
                "NbreTotal" => 0,
                "liste" => $aListe,
            );
        }
        break;

    case 'NewActivitie':
    case 'newCompAct':
    case 'newAlea':
    case 'newFreeAlea':
    case 'NewAleaReglage':
    case 'editFreeAlea':
    case 'AleaEnd':
    case 'Stop':
    case 'Suspend':
    case 'StopLimitedControl':
    case 'stopUnplanedActivity':
    case 'NoQuantityCheck';
    case 'ActQty':
    case 'updateAct':
    case 'updateQualityAct':
    case 'updateUnplanedAct':
    case 'updateSettingAct':
    case 'updateAla':
    case 'deleteAct':
    case 'deleteAlea':
        $oJson = array(
            'success' => $bSucces,
            'message' => $aMessages,
        );
        break;

    default:
        $oJson = array(
            "success" => false,
            "NbreTotal" => 0,
            "nomnoeud" => array(),
        );
        break;
}

ob_clean(); // vide le output buffer, évite la présence de caractère \ufeff en tête de fichier JSON
echo json_encode($oJson);
