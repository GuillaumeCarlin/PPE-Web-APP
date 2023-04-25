<?php

Class alertsMngt extends GestBdd {

	var $aAlerts = [];

	/**
	 * @author : edblv
	 * date   : 01/01/2000
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * Constructeur de la classe GestBdd
	 *
	 * @version JJ/MM/AA edblv RND#ND-ND.ND Création
	 */
	function __construct($aBase) {
		include_once 'AlertsQry.php';
		$this->aAlerts = $aAlerts;
		return $this->GestBdd($aBase);
	}

	/**
	 * @author : edblv
	 * date   : 
	 * @scrum : RND#ND-ND.ND
	 *
	 * #Description
	 * 
	 *
	 * @version JJ/MM/AA edblv RND#ND-ND.ND Création
	 */
	function alertCheck($sAction, $oParams) {
		switch ($sAction) {
			case 'NewActivitie':
				if (intval($oParams->closed)>0) {
					$sMessage = 'Création d\'une activité sur une opération terminée';
					$this->QryExec(sprintf($this->aAlerts['alertcreate'], $oParams->act_id, $this->FormatSql($sMessage, 'C')));
				}
				break;

			case 'Stop':
				$iTot = 0;
				$iNptr = intval($oParams->expqty->nptr);
				$iEdge = floor($iNptr * 0.1);

				foreach ($oParams->qty->qty as $iInd => $sValue) {
					$iTot += intval($sValue);
				}

				if ($iTot < ($iNptr - $iEdge)) {
					$sMessage = 'Qté saisie inférieure au NPTR';
					$this->QryExec(sprintf($this->aAlerts['alertcreate'], $oParams->act_id, $this->FormatSql($sMessage, 'C')));
				}

				if ($iTot > ($iNptr + $iEdge)) {
					$sMessage = 'Qté saisie supérieure au NPTR';
					$this->QryExec(sprintf($this->aAlerts['alertcreate'], $oParams->act_id, $this->FormatSql($sMessage, 'C')));
				}

				break;

			case 'updateAct':
				$bModif = false;
				$aCheckFields = [
					'tempsmontagej' => ['value' => NULL, 'modif' => false],
					'tempsmontageh' => ['value' => NULL, 'modif' => false],
					'tempsreglagej' => ['value' => NULL, 'modif' => false],
					'tempsreglageh' => ['value' => NULL, 'modif' => false],
					'tempsunitj' => ['value' => NULL, 'modif' => false],
					'tempsunith' => ['value' => NULL, 'modif' => false]
				];

				foreach ($aCheckFields as $sField => $aField) {
					if (isset($oParams->originalvalues->$sField)) {
						$aCheckFields[$sField]['value'] = $oParams->fields->$sField;

						if ($oParams->fields->$sField !== $oParams->originalvalues->$sField->value) {
							$aCheckFields[$sField]['modif'] = true;
							$bModif = true;
						}
					}
				}

				if ($bModif) {
					$sMessage = 'Modification d\'une donnée de gamme';
					//error_log(sprintf($this->aAlerts['alertcreate'], $oParams->act_id, $this->FormatSql($sMessage, 'C')));
					$this->QryExec(sprintf($this->aAlerts['alertcreate'], $oParams->act_id, $this->FormatSql($sMessage, 'C')));
				}
				break;

			default:
				break;
		}
	}

}

?>