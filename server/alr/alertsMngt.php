<?php
/**
 * @author Hervé VALOT
 * @description Classe de gestion des alertes de production
 */
class alertsMngt extends GestBdd
{

    public $aAlerts = [];
    private $BddClass;

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
    public function __construct($aBase)
    {
        include_once 'AlertsQry.php';
        $this->aAlerts = $aAlertsQRY;
        $this->BddClass = new GestBdd($aBase);
    }

    public function getBDD(){
        return $this->BddClass;
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
    public function alertCheck($sAction, $oParams)
    {
        switch ($sAction) {
            case 'NewActivitie':
                if (intval($oParams->closed) > 0) {
                    $iRule = 1;
                    $sMessage = 'Création d\'une activité sur une opération terminée';
                    $this->QryExec(sprintf($this->aAlerts['alertcreate'], $oParams->act_id, $this->FormatSql($sMessage, 'C'), $iRule));
                }
                break;

            /**
                 * @author        Hervé Valot
                 * @version        20190115
                 * @description    alerte sur création d'une nouvelle opération complémentaire
                 */
            case 'NewCompAct':
                break;

            case 'Suspend':
            case 'Stop':
                $iTot = 0;
                $iNptr = intval($oParams->expqty->nptr);
                $iEdge = floor($iNptr * 0.1);

                foreach ($oParams->qty->qty as $iInd => $sValue) {
                    $iTot += intval($sValue);
                }

                $sAlerteMessage = 'La quantité saisie (%1$s) est %2$s au Nombre de pièces réalisables %3$s %4$s (NPTR nominal %5$s).';
                // vérifie la somme des quantités déclarées par rapport au NPTR mini
                if ($iTot < (intval($oParams->expqty->expectedMin))) {
                    // identifiant de la règle concernant les Qauntités inférieures au NPTR
                    $iRule = 3;
                    // création du message complémentaire
                    $sMessage = sprintf($sAlerteMessage, $iTot, 'inférieure', 'mini', $oParams->expqty->expectedMin, $oParams->expqty->nptr);
                    // enregistrement de l'alerte en base de données
                    $this->QryExec(sprintf($this->aAlerts['alertcreate'], $oParams->act_id, $this->FormatSql($sMessage, 'C'), $iRule));
                }

                // vérifie la somme des quantités déclarées par rapport au NPTR maxii
                if ($iTot > intval($oParams->expqty->expectedMax)) {
                    // identifiant de la règle concernant les Qauntités supérieures au NPTR
                    $iRule = 4;
                    // création du message complémentaire
                    $sMessage = sprintf($sAlerteMessage, $iTot, 'supérieure', 'maxi', $oParams->expqty->expectedMax, $oParams->expqty->nptr);
                    // enregistrement de l'alerte en base de données
                    $this->QryExec(sprintf($this->aAlerts['alertcreate'], $oParams->act_id, $this->FormatSql($sMessage, 'C'), $iRule));
                }

                break;

            // FIXME: hvt 2020-05-13 09:14:25, à revoir dans le cadre de la gestion des alertes
            // case 'updateAct':
            //     $bModif = false;
            //     $aCheckFields = [
            //         'tempsmontagej' => ['value' => NULL, 'modif' => false],
            //         'tempsmontageh' => ['value' => NULL, 'modif' => false],
            //         'tempsreglagej' => ['value' => NULL, 'modif' => false],
            //         'tempsreglageh' => ['value' => NULL, 'modif' => false],
            //         'tempsunitj' => ['value' => NULL, 'modif' => false],
            //         'tempsunith' => ['value' => NULL, 'modif' => false]
            //     ];

            //     foreach ($aCheckFields as $sField => $aField) {
            //         if (isset($oParams->originalvalues->$sField)) {
            //             $aCheckFields[$sField]['value'] = $oParams->fields->$sField;

            //             if ($oParams->fields->$sField !== $oParams->originalvalues->$sField->value) {
            //                 $aCheckFields[$sField]['modif'] = true;
            //                 $bModif = true;
            //             }
            //         }
            //     }

            //     if ($bModif) {
            //         $sMessage = 'Modification d\'une donnée de gamme';
            //         //error_log(sprintf($this->aAlerts['alertcreate'], $oParams->act_id, $this->FormatSql($sMessage, 'C')));
            //         $this->QryExec(sprintf($this->aAlerts['alertcreate'], $oParams->act_id, $this->FormatSql($sMessage, 'C')));
            //     }
            //     break;

            default:
                break;
        }
    }

}
