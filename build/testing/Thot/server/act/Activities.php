<?php

include_once '..\commun\SessionClass.php';
include_once '../alr/alertsMngt.php';

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
$aVariables[] = 'ala_id';
$aVariables[] = 'usr_id';
$aVariables[] = 'sourcetype';
$aVariables[] = 'quantity';
$aVariables[] = 'expectedqty';
$aVariables[] = 'originalval';
$aVariables[] = 'closedoper';
$aVariables[] = 'fields';
$aVariables[] = 'opn_id';
$aVariables[] = 'eqp_id';
$aVariables[] = 'assistance';
$aVariables[] = 'schedule';
		
require($oSession->ParentPath . "server/variablesEtFiltres.php");
$bDebug = false;
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
$Bdd = new alertsMngt($oSession->AppBase);
include("ActivitiesQry.php");
$aMessages = [];

//---- Execution de la requête correspondant à l'action ----
switch ($action) {
	case 'AleaList':
		$sFilter = '';

		if ($sourcetype !== '') {
			$sFilter = '@LIBRE=1, @ORIGINE=' . $sourcetype;
		}

		$aListe = $Bdd->QryToArray(sprintf($aActivities['alealist'], $sFilter));
		$bSucces = (count($aListe) > 0);
		break;

	case 'newAlea':
		$Bdd->QryExec(sprintf($aActivities['newalea'], $act_id, $ald_id));
		//$aActDet = $Bdd->QryToArray(sprintf($aActivities['actdetail'], $act_id));
		$aMessages[] = $Bdd->aExecReq['message'];
		$bSucces = $Bdd->aExecReq['success'];
		break;

	case 'newFreeAlea':
		$oSchedule = json_decode($schedule);
		$sSchedule = '';
		
		if ($oSchedule->alp_date_debutprog!==NULL) {
			$sSchedule = ', @USR_ID = '.$oSchedule->userId;
			$sSchedule .= ', @ALP_DATE_DEBUTPROG = '.$Bdd->FormatSql($oSchedule->alp_date_debutprog,'C');
			$sSchedule .= ', @ALP_DATE_FINPROG = '.$Bdd->FormatSql($oSchedule->alp_date_finprog,'C');
			$sSchedule .= ', @ALP_ESTACTIF = '.($oSchedule->alp_estactif ?1 :0);
			$sSchedule .= ', @ALP_ESTIMPOSE = '.($oSchedule->alp_estimpose ?1 :0);
			$sSchedule .= ', @ALP_ABONNEMENT = '.($oSchedule->acceptNotif ?1 :0);
			$sSchedule .= ', @ALP_COMMENTAIRE = '.$Bdd->FormatSql($oSchedule->alp_commentaire, 'C');
		}
		
		$Bdd->QryExec(sprintf($aActivities['newfreealea'], $rsc_id, $ald_id, $sSchedule));
		$aMessages[] = $Bdd->aExecReq['message'];
		$bSucces = $Bdd->aExecReq['success'];
		break;

	case 'editFreeAlea':
		$oSchedule = json_decode($schedule);
		$sSchedule = '';
		
		if ($oSchedule->alp_date_debutprog!=='' && strtolower($oSchedule->alp_date_debutprog)!=='null') {
			$sSchedule = ', @USR_ID = '.$oSchedule->userId;
			$sSchedule .= ', @ALP_DATE_DEBUTPROG = '.$Bdd->FormatSql($oSchedule->alp_date_debutprog,'C');
			$sSchedule .= ', @ALP_DATE_FINPROG = '.$Bdd->FormatSql($oSchedule->alp_date_finprog,'C');
			$sSchedule .= ', @ALP_ESTACTIF = '.($oSchedule->alp_estactif ?1 :0);
			$sSchedule .= ', @ALP_ESTIMPOSE = '.($oSchedule->alp_estimpose ?1 :0);
			$sSchedule .= ', @ALP_ABONNEMENT = '.($oSchedule->acceptNotif ?1 :0);
			$sSchedule .= ', @ALP_COMMENTAIRE = '.$Bdd->FormatSql($oSchedule->alp_commentaire, 'C');
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
			'currentala' => $Bdd->QryToArray(sprintf($aActivities['resscurrentala'], $rsc_id))
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
		$bSucces = (count($aListe) > 0);
		break;

	case 'LstActEC':
		$aListe = $Bdd->QryToArray(sprintf($aActivities['sectioncurract'], $Bdd->FormatSql($aSpecFilter['sab_id'], 'C')));
		$bSucces = (count($aListe) > 0);
		break;

	case 'ofExists':
		$aListe = $Bdd->QryToArray(sprintf($aActivities['ofexists'], $Bdd->FormatSql($odf_code, 'C')));
		$bSucces = (count($aListe) > 0);
		break;

	case 'ofDetail':
		if ($odf_id==NULL) {
			//---- Si on n'a pas odf_id, ça veut dire qu'on a un ofnum à partir duquel on peut retrouver l'odf_id
			$aOf = $Bdd->QryToArray(sprintf($aActivities['ofexists'], $Bdd->FormatSql($ofnum, 'N')));
			$odf_id = $aOf[0]['odf_id'];
		}
		
		$aListe = $Bdd->QryToArray(sprintf($aActivities['ofdetails'], $Bdd->FormatSql($odf_id, 'N')));
		$bSucces = (count($aListe) > 0);
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
					}
					else {
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

	case 'QtyTypeLst':
		$aListe = $Bdd->QryToArray($aActivities['qtytypelist']);
		$bSucces = (count($aListe) > 0);
		break;

	case 'NewActCtrl':
		$aListe = $Bdd->QryToArray(sprintf($aActivities['createctrl'], $Bdd->FormatSql($rsc_id, 'C')));
		$bSucces = $Bdd->aExecReq['success'];
		break;

	case 'NewActivitie':
		$iForce = 0;
		
		if ($closedoper) {
			$iForce = 1;
		}

		$Bdd->QryExec(sprintf($aActivities['create'], $ope_id, $odf_id, $org_id, $Bdd->FormatSql($rsc_id, 'C'), $iForce));

		if (!$Bdd->aExecReq['success']) {
			$bSucces = false;
		}
		else {
			//---- Création de l'enregistrement pour le marquage
			$iActId = $Bdd->aExecReq['results'][0]['act_id'];
			$Bdd->QryExec(sprintf($aActivities['mrkcreate'], $iActId, 'D'));
			
			//---- Si création d'activité sur une opération terminée
			//	génération d'une alerte
			$Bdd->alertCheck($action, (object) [
				'act_id'=>$iActId,
				'closed'=>$closedoper
			]);
			
			/*
			if ($closedoper) {
				$Bdd->QryExec(sprintf($aActivities['alertcreate'], $iActId, $Bdd->FormatSql('Création d\'une activité sur une opération terminée', 'C')));
			}
			*/
			
			$bSucces = true;
			$aListe = $Bdd->aExecReq;
		}
		break;

	case 'ActDetail':
		$aListe = $Bdd->QryToArray(sprintf($aActivities['actdetail'], $act_id));
		$bSucces = $Bdd->aExecReq['success'];
		break;

	case 'OpeTimes':
		$aListe = $Bdd->QryToArray(sprintf($aActivities['opetime'], $opn_id,$odf_id));
		$aUserTime = $Bdd->QryToArray(sprintf($aActivities['usertime'], $opn_id,$odf_id, $eqp_id));

		if (count($aUserTime)>0) {
			$aListe[0] = array_merge($aListe[0], $aUserTime[0]);
		}
		$bSucces = $Bdd->aExecReq['success'];
		break;

	case 'EqpTimes':
		//error_log(sprintf($aActivities['usertime'], $opn_id,$odf_id, $eqp_id));
		$aListe = $Bdd->QryToArray(sprintf($aActivities['usertime'], $opn_id,$odf_id, $eqp_id));
		$bSucces = $Bdd->aExecReq['success'];
		break;

	case 'QtyDetail':
		$sFilter = '';
		if (isset($aSpecFilter['act_id'])) {
			$sFilter = '@ACT_ID='.$aSpecFilter['act_id'];
		}

		$aListe = $Bdd->QryToArray(sprintf($aActivities['qtydetail'],$sFilter));
		$bSucces = $Bdd->aExecReq['success'];
		break;

	case 'ActQty':
		$aMessages = [];
		$aQuantity = json_decode($quantity);

		foreach ($aQuantity->qtp_id as $iInd => $iQtyTypeId) {
			if ($aQuantity->qty[$iInd] !== '' && $aQuantity->qty[$iInd] !== NULL) {
				$Bdd->QryExec(sprintf($aActivities['qtyinsert'], $act_id, $ope_id, $iQtyTypeId, $aQuantity->qty[$iInd]));
				$bSucces = $Bdd->aExecReq['success'];

				if (!$Bdd->aExecReq['success']) {
					$aMessages[] = $Bdd->aExecReq['message'];
				}
			}
		}

		break;

	case 'updateAct':
		$sQuantityXML = '';
		
		if ($quantity!=='') {
			$aQuantity = json_decode($quantity);
			$sQuantityXML = '<QUANTITES>';
			$sQuantityAtt = '';

			foreach ($aQuantity->qtp_id as $iInd => $iQtyTypeId) {
				//if ($aQuantity->qty[$iInd] !== '' && $aQuantity->qty[$iInd] !== NULL) {
					$sQuantityAtt = '';
					
					if ($aQuantity->qty[$iInd]!==NULL) {
						$sQuantityAtt = '" VALEUR="' . $aQuantity->qty[$iInd];
					}

					$sQuantityXML.='<QTE QTP_ID="' . $iQtyTypeId . '" RSC_ID="' . $rsc_id . $sQuantityAtt . '" />';
				//}
			}

			$sQuantityXML.='</QUANTITES>';
		}
		
		//---- Constitution de la chaîne de paramètres a passer à la procédure
		// 2 paramètres obligatoires
		$sExpectedPrm = sprintf('@RSC_ID = %1$s, @ACT_ID_ORG = %2$s', $rsc_id, $act_id);

		// 10 paramètres optionnels
		$oFields = json_decode($fields);
		$oOrigVal = json_decode($originalval);
		$sOptionalPrm = '';
		
		if (intval($oFields->opn_id)>0) {
			$sOptionalPrm .= sprintf(', @OPN_ID = %1$s', $oFields->opn_id);
		}

		if (intval($oFields->odf_id)>0) {
			$sOptionalPrm .= sprintf(', @ODF_ID = %1$s', $oFields->odf_id);
		}

		/*
		if (intval($oFields->org_id)>0) {
			$sOptionalPrm .= sprintf(', @ORG_ID = %1$s', $oFields->org_id);
		}
		*/

		if ($oFields->act_date_debut!=='') {
			$sOptionalPrm .= sprintf(', @ACT_DATE_DEBUT = %1$s', $Bdd->FormatSql($oFields->act_date_debut, 'C'));
		}

		if ($oFields->act_date_fin!=='') {
			$sOptionalPrm .= sprintf(', @ACT_DATE_FIN = %1$s', $Bdd->FormatSql($oFields->act_date_fin, 'C'));
		}

		if ($oFields->acr_commentaire!=='') {
			$sOptionalPrm .= sprintf(', @COMMENTAIRE = %1$s', $Bdd->FormatSql($oFields->acr_commentaire, 'C'));
		}

		if (floatval($oFields->opn_temps_montage_j)>0) {
			$sOptionalPrm .= sprintf(', @TEMPS_MONTAGE_J = %1$s', $Bdd->FormatSql($oFields->opn_temps_montage_j, 'N'));
		}
		
		if (floatval($oFields->opn_temps_reglage_j)) {
			$sOptionalPrm .= sprintf(', @TEMPS_REGLAGE_J = %1$s', $Bdd->FormatSql($oFields->opn_temps_reglage_j, 'N'));
		}
		
		if (floatval($oFields->ope_temps_unitaire_j)) {
			$sOptionalPrm .= sprintf(', @TEMPS_UNITAIRE_J = %1$s', $Bdd->FormatSql($oFields->ope_temps_unitaire_j, 'N'));
		}

		if ($oFields->usr_id!=='' || $oFields->eqp_id!=='') {
			$aRessources = [];
			
			if ($oFields->usr_id!=='') {
				$aRessources[]=$oFields->usr_id;
			}
			
			if ($oFields->eqp_id!=='') {
				$aRessources[]=$oFields->eqp_id;
			}
			
			$sOptionalPrm .= sprintf(', @RSC_ID_STRING = %1$s', $Bdd->FormatSql(join(',', $aRessources), 'C'));
		}

		if ($sQuantityXML!=='') {
			$sOptionalPrm .= sprintf(', @QUANTITE = %1$s', $Bdd->FormatSql($sQuantityXML, 'C'));
		}

		$Bdd->QryExec(sprintf($aActivities['update'],$sExpectedPrm, $sOptionalPrm));
		$bSucces = $Bdd->aExecReq['success'];
		$aMessages[] = $Bdd->aExecReq['message'];
		
		if($bSucces) {
			//---- Test si alerte
			$Bdd->alertCheck($action, (object) [
				'act_id'=>$act_id,
				'fields'=>$oFields,
				'originalvalues'=>$oOrigVal
			]);
		}
		break;

	case 'Suspend':
	case 'Stop':
		$aQuantity = json_decode($quantity);
		$aExpectedQty = json_decode($expectedqty);
		$sQuantityXML = '<QUANTITES>';

		//error_log(var_export($aExpectedQty,true));
		
		foreach ($aQuantity->qtp_id as $iInd => $iQtyTypeId) {
			if ($aQuantity->qty[$iInd] !== '' && $aQuantity->qty[$iInd] !== NULL) {
				$sQuantityXML.='<QTE QTP_ID="' . $iQtyTypeId . '" RSC_ID="' . $ope_id . '" VALEUR="' . $aQuantity->qty[$iInd] . '" />';
			}
		}

		$sQuantityXML.='</QUANTITES>';

		//$sQuery = sprintf($aActivities['stopsuspend'], '?', '?', '?');
		
		if ($action == 'Stop') {
			//---- Terminer
			$Bdd->QryExec(sprintf($aActivities['stopsuspend'], $act_id, '1', $Bdd->FormatSql($sQuantityXML, 'C')));
			
			if($Bdd->aExecReq['success']) {
				//---- Test si alerte
				$Bdd->alertCheck($action, (object) [
					'act_id'=>$act_id,
					'qty'=>$aQuantity,
					'expqty'=>$aExpectedQty
				]);
			}
		}
		else {
			//---- Suspendre
			//error_log(sprintf($aActivities['stopsuspend'], $act_id, '0', $Bdd->FormatSql($sQuantityXML, 'C')));
			$Bdd->QryExec(sprintf($aActivities['stopsuspend'], $act_id, '0', $Bdd->FormatSql($sQuantityXML, 'C')));
		}

		if ($Bdd->aExecReq['success']) {
			//---- Création de l'enregistrement de fin de marquage
			$Bdd->QryExec(sprintf($aActivities['mrkcreate'], $act_id, 'F'));
			$bSucces = true;
		}
		else {
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
}

switch ($action) {
	case 'AleaList':
	case 'LstActEC':
	case 'LstFreeAleas':
	case 'ofExists':
	case 'ofDetail':
	case 'validRessource':
	case 'ActHisto':
	case 'QtyTypeLst':
	case 'NewActCtrl':
	case 'ActDetail':
	case 'QtyDetail':
	case 'UserAct':
	case 'UserAlea':
	case 'OpeTimes':
	case 'EqpTimes':
	case 'loadAlea':
		$oJson = array(
			"success" => $bSucces,
			"NbreTotal" => count($aListe),
			"liste" => $aListe
		);
		break;

	case 'NewActivitie':
	case 'newAlea':
	case 'newFreeAlea':
	case 'editFreeAlea':
	case 'AleaEnd':
	case 'Stop':
	case 'Suspend':
	case 'ActQty':
	case 'updateAct':
		$oJson = array(
			'success' => $bSucces,
			'message' => $aMessages
		);
		break;

	default :
		$oJson = array(
			"success" => false,
			"NbreTotal" => 0,
			"nomnoeud" => array()
		);
		break;
}

echo json_encode($oJson);
?>
