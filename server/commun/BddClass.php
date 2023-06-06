<?php

class GestBdd
{

    //var $aSession = array();
    public $aBases = array();
    public $aBase = array();
    public $PrmBase = array();
    public $bInfosCnx = false;
    public $CnxDb = null;
    public $cnxStatus = false;
    public $IdLangue = 1;
    public $NomBase = "";
    public $ConvUtf8 = false;
    public $TblSsnVielles = array();
    public $NbreHresLimite = 12;
    public $ForcerEspion = false;
    public $aTypeChamp = array();
    public $bNullValue = false;
    public $aExecReq = array("success" => false, "errno" => 0, "message" => '');
    public $ForcerDroit = false;
    public $bDebug = true;
    public $sFicLog = "Bdd.log";
    public $sRacine = "";
    public $bSilent = false;



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
    // public function __construct($aBase)
    public function __construct($aBase)
    {
        require "sysQuery.php";
        
        if (isset($_SESSION)) {
            if (isset($_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["idlangue"])) {
                if ($_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["idlangue"] != "") {
                    $this->IdLangue = intval($_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["idlangue"]);
                }
            }
        }
        $this->PrmBase = $aBase;
        /*
        $this->PrmBase["typebase"] = $aBase['typebase'];
        $this->PrmBase["libbase"] = $aBase['libbase'];
        $this->PrmBase["host"] = $aBase['host'];
        $this->PrmBase["nombase"] = $aBase['nombase'];
        $this->PrmBase["username"] = $aBase['username'];
         */
        $this->PrmBase["passe"] = json_decode(gzuncompress(base64_decode($aBase['passe'])), true);
        return $this->Connexion();
    }

    public function getPrmBase(){
        return $this->PrmBase;
    }

    /**
     * @author : edblv
     * date   : 01/01/2000
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Connexion à la base
     *
     * @version JJ/MM/AA edblv RND#ND-ND.ND Création
     */
    public function Connexion()
    {
        $Retour = true;
        $ParamSqlServer = false;

        switch ($this->PrmBase["typebase"]) {
            case "MsSql":
                $ParamSqlServer = true;
                //---- Nouvelle connexion MsSql (avec PDO)
                switch (PHP_OS) {
                    case 'AlmaLinux':
                    case 'Linux':
                        //error_log(var_export($this->PrmBase,true));
                        $this->CnxDb = new pdo(
                            'sqlsrv:Server=' . $this->PrmBase["host"] . ';Database=' . $this->PrmBase["nombase"],
                            $this->PrmBase["username"],
                            $this->PrmBase["passe"]
                        );
                        break;
                    default:
                        $this->CnxDb = new pdo(
                            'sqlsrv:server=' . $this->PrmBase["host"] . ';Database=' . $this->PrmBase["nombase"],
                            $this->PrmBase["username"],
                            $this->PrmBase["passe"]
                        );
                        break;
                }

                if (!$this->CnxDb) {
                    $Retour = false;
                } else {
                    $this->CnxDb->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
                    $this->CnxDb->setAttribute(PDO::ATTR_CASE, PDO::CASE_LOWER);
                }

                break;

            case "MsSql2016":
                //---- Connexion MsSql 2016 (ODBC)
                $ParamSqlServer = true;
                $this->CnxDb = new PDO('sqlsrv:server=' . $this->PrmBase["host"] . ' ; Database = ' . $this->PrmBase["nombase"] . ' ; MultipleActiveResultSets=false', $this->PrmBase["username"], $this->PrmBase["passe-clair"]);

                if (!$this->CnxDb) {
                    $Retour = false;
                } else {
                    $this->CnxDb->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
                    $this->CnxDb->setAttribute(PDO::ATTR_CASE, PDO::CASE_LOWER);
                }

                break;
        }

        if ($ParamSqlServer && $this->CnxDb) {
            $this->QryExec("SET CONCAT_NULL_YIELDS_NULL ON");
            $this->QryExec("SET QUOTED_IDENTIFIER ON");
            $this->QryExec("SET ANSI_NULLS ON");
            $this->QryExec("SET ANSI_WARNINGS ON");
            $this->QryExec("SET ANSI_PADDING ON");
            /*
        $this->QryExec('set CURSOR_CLOSE_ON_COMMIT off');
        $this->QryExec('set ANSI_NULL_DFLT_ON on');
        $this->QryExec('set ANSI_NULLS on');
        $this->QryExec('set ANSI_WARNINGS on');
        $this->QryExec('set CONCAT_NULL_YIELDS_NULL on');
        $this->QryExec('set QUOTED_IDENTIFIER on');
         */
        }

        if ($this->bDebug) {
            for (reset($_POST); $NomVar = key($_POST); next($_POST)) {
                $this->Espion($NomVar . " : " . $_POST[$NomVar]);
            }

            for (reset($_GET); $NomVar = key($_GET); next($_GET)) {
                $this->Espion($NomVar . " : " . $_GET[$NomVar]);
            }
        }

        $this->cnxStatus = $Retour;
        return $Retour;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : FieldsToName
     * Type : Méthode de l'objet Bdd
     * Créée par : Dblv
     * Le : 05/03/2013
     * Paramètres :
     * Description :
     * Retourne un tableau indicé sur le nom des champs d'après un tableau JSON
     * ----------------------------------------------------------------------------------
     * Révisions
     * AAAA
     * JJ/MM :
     * -------------------------------------------------------------------------------- */

    public function FieldsToName($aFields)
    {
        $aReturn = array();
        $sFieldName = "";

        for ($IndFld = 0; $IndFld < count($aFields); $IndFld++) {
            $sFieldName = strtolower($aFields[$IndFld]->name);
            $aReturn[$sFieldName] = $aFields[$IndFld]->value;
        }

        return $aReturn;
    }

    /**
     * @author : edblv
     * date   : 01/09/1999
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Format une donnée pour intégrer à une requête SQL
     *
     * @version JJ/MM/AA edblv RND#ND-ND.ND Création
     */
    public function FormatSql($val, $format, $type = "M", $sDateFormat = '')
    {
        $Zero = false;
        if ($format === "Z") {
            $format = "N";
            $Zero = true;
        }

        if ($val === "NULL") {
            return "NULL";
        }

        switch ($format) {
            case "ntext":
            case "nvarchar":
            case "xml":
            case "U": //---- Unicode
                if ($type == "M") {
                    if ($val == "") {
                        $chaine = "NULL";
                    } else {
                        $chaine = $val;
                        $sInitialEncoding = mb_detect_encoding($chaine);

                        if ($sInitialEncoding != "UTF-8") {
                            $chaine = mb_convert_encoding($chaine, 'UTF-8');
                        }

                        //$chaine = "N'" . $chaine . "'";
                        $chaine = "N'" . mb_ereg_replace("'", "''", $chaine) . "'";
                    }
                } else {
                    //$chaine=$this->Unicode->Utf8rawurlencode($val);
                    $chaine = $val;
                }
                break;

            case "text":
            case "varchar":
            case "C": //---- Caractères
                if ($type == "M") {
                    if ($val == "") {
                        $chaine = "NULL";
                    } else {
                        $chaine = str_replace(chr(92), chr(92) . chr(92), $val);
                        $chaine = str_replace("'", "''", $chaine);
                        //$chaine = str_replace(chr(34), "''", $chaine);
                        switch ($this->PrmBase["typebase"]) {
                            case "MySql":
                                /*
                                $initialEncoding = mb_detect_encoding($chaine);
                                //$this->Espion($chaine." (UPDATE) : ".$initialEncoding);
                                if ($initialEncoding != "UTF-8") {
                                $chaine = utf8_encode($Chaine); //mb_convert_encoding($chaine,"UTF-8","ASCII");
                                }
                                 */

                                $chaine = "'" . $chaine . "'";
                                break;

                            default:
                                $initialEncoding = mb_detect_encoding($chaine);
                                //$this->Espion($chaine." (UPDATE) : ".$initialEncoding);
                                if ($initialEncoding != "UTF-8") {
                                    $chaine = mb_convert_encoding($chaine, "UTF-8", "ASCII");
                                }
                                $chaine = "'" . $chaine . "'";
                                break;
                        }
                    }
                } else {
                    //$chaine=$this->Unicode->Utf8rawurlencode($val);
                    $chaine = $val;
                }
                break;

            case "SRZ": //---- Sérialisée (Chaîne ou tableau en entrée)
                if ($type == "M") {
                    if ($val == "") {
                        $chaine = "NULL";
                    } else {
                        $chaine = base64_encode(gzcompress(serialize($val)));

                        $chaine = "'" . $chaine . "'";
                        break;
                    }
                } else {
                    //$chaine=$this->Unicode->Utf8rawurlencode($val);
                    //---- Le retour sera un tableau
                    $chaine = unserialize(gzuncompress(base64_decode($val)));
                }
                break;

            case "JSON": //---- JSON compressé (Chaîne ou tableau en entrée)
                if ($type == "M") {
                    if ($val == "") {
                        $chaine = "NULL";
                    } else {
                        $chaine = gzcompress(json_encode($val));

                        $chaine = "'" . $chaine . "'";
                        break;
                    }
                } else {
                    $chaine = json_decode(gzuncompress($val), true);
                }
                break;

            case "CXML": //---- Caractères destinés à être inclus dans un champ XML (en tant que texte d'un noeud)
                if ($type == "M") {
                    if ($val == "") {
                        $chaine = "";
                    } else {
                        $chaine = str_replace(chr(34), "'", $val);
                        $chaine = str_replace("'", "''", $chaine);
                    }
                } else {
                    $chaine = $val;
                }
                break;

            case "bit": // bit ne peut être égal qu'a 0 ou 1
                $val = intval(trim($val));
                if ($val > 0) {
                    $chaine = "1";
                } else {
                    $chaine = '0';
                }

                break;

            case "int":
            case "tinyint":
            case "smallint":
            case "decimal":
            case "N": //---- Numériques
                if ($type == "M") {
                    $val = trim($val);

                    if (strtolower($val) == 'null') {
                        $chaine = $val;
                    } else {
                        if ("A" . $val == "A") {
                            $chaine = "NULL";
                        } else {
                            $chaine = 0 + $val;
                        }
                    }
                } else {
                    $chaine = $val;
                }
                break;

            case "date":
            case "datetime":
            case "DH":
            case "D":
                //---- Date
                $aDate = array('J' => 0, 'M' => 0, 'A' => 0);

                if ($type == "M") {
                    // Mise à jour
                    if ($val == "") {
                        $chaine = "NULL";
                    } else {
                        // Teste si format de date JJ/MM/AAAA
                        $tablo = explode("/", substr($val, 0, 10));

                        if (count($tablo) > 2) {
                            $aDate['J'] = $tablo[0];
                            $aDate['M'] = $tablo[1];
                            $aDate['A'] = $tablo[2];
                        } else {
                            //---- On a pas reçu une date au format JJ/MM/AAAA
                            // Teste si format de date AAAA-MM-JJ
                            $tablo = explode("-", substr($val, 0, 10));

                            if (count($tablo) > 2) {
                                $aDate['J'] = $tablo[2];
                                $aDate['M'] = $tablo[1];
                                $aDate['A'] = $tablo[0];
                            }
                        }

                        if (intval($aDate['A']) < 1 || intval($aDate['M']) < 1 || intval($aDate['J']) < 1) {
                            $chaine = "NULL";
                        } else {
                            if (intval($aDate['J']) < 10) {
                                $aDate['J'] = "0" . intval($aDate['J']);
                            }

                            if (intval($aDate['M']) < 10) {
                                $aDate['M'] = "0" . intval($aDate['M']);
                            }

                            // renvoie AAAA-MM-JJ (format Sql Server)
                            $chaine = $aDate['A'] . "-" . $aDate['M'] . "-" . $aDate['J']; // ." ".date("H:i:s")
                        }
                    }
                } else {
                    // Lecture
                    if ($val == "") {
                        $chaine = "";
                    } else {
                        // Reçoit AAAA-MM-JJ HH:MM:SS (Access) et Oracle, je croit
                        //    renvoie JJ/MM/AAAA
                        $_Date = substr($val, 0, 10);
                        $tablo = explode("-", $_Date);
                        $chaine = $tablo[2] . "/" . $tablo[1] . "/" . $tablo[0];
                    }
                }

                if ($format == "DH" || $format == "datetime") {
                    //---- On ajoute l'heure
                    if ($val != "") {
                        $Heure = substr($val, 10, 9);
                        $TabHre = explode(":", $Heure);

                        if (count($TabHre) > 2) {
                            if (intval($TabHre[0]) + intval($TabHre[1]) + intval($TabHre[2]) > 0) {
                                $chaine .= $Heure;
                            }
                        }
                    }
                }

                if ($type == "M") {
                    if ($chaine != "NULL") {
                        if ($sDateFormat !== '') {
                            $chaine = "convert(datetime,'" . $chaine . "', " . $sDateFormat . ") ";
                        } else {
                            $chaine = "convert(datetime,'" . $chaine . "') ";
                        }
                    }
                }

                break;
            case "DISOG": //Date iso (AAAA.MM.JJ) pour Gantt ajouté le 05/03/12 08:48 par Marine
                //---- Date
                if ($type == "M") {
                    // Mise à jour
                    if ($val == "") {
                        $chaine = "NULL";
                    } else {
                        // Reçoit JJ/MM/AAAA ou -JJ/MM/AAAA
                        $DebDte = 0;
                        if (substr($val, 0, 1) == "-") {
                            $DebDte = 1;
                        }
                        $tablo = explode("/", substr($val, $DebDte, 10));
                        //---- Jour
                        $tablo[0] = "00" . $tablo[0];
                        $tablo[0] = substr($tablo[0], strlen($tablo[0]) - 2, 2);
                        if ($tablo[0] < 10) {
                            $jour = explode(0, $tablo[0]);
                            $tablo[0] = $jour[1];
                        }
                        //---- Mois
                        $tablo[1] = "00" . $tablo[1];
                        $tablo[1] = substr($tablo[1], strlen($tablo[1]) - 2, 2);
                        if ($tablo[1] < 10) {
                            $mois = explode(0, $tablo[1]);
                            $tablo[1] = $mois[1];
                        }
                        $chaine = $tablo[2] . "," . $tablo[1] . "," . $tablo[0];
                        if (substr($val, 0, 1) == "-") {
                            $chaine = "-" . $chaine;
                        }
                        // renvoie AAAA.MM.JJ ou -AAAA.MM.JJ
                        $chaine = $chaine;
                    }
                } else {
                    // Lecture
                    if ($val == "") {
                        $chaine = "";
                    } else {
                        // Reçoit AAAAMMJJ
                        //    renvoie JJ.MM.AAAA
                        $DebDte = 0;
                        if (substr($val, 0, 1) == "-") {
                            $DebDte = 1;
                        }
                        $val = substr($val, $DebDte, 10);
                        $tablo[0] = substr($val, 0, 4); // AAAA
                        $tablo[1] = substr($val, 4, 2); // MM
                        $tablo[2] = substr($val, 6, 2); // JJ
                        if (intval($tablo[2]) != 0) {
                            $chaine = $tablo[2] . "/";
                        }
                        if (intval($tablo[1]) != 0) {
                            $chaine .= $tablo[1] . "/";
                        }
                        if ($tablo[0] != "") {
                            $chaine .= $tablo[0];
                        }
                        if ($DebDte == 1) {
                            $chaine = "-" . $chaine;
                        }
                    }
                }
                break;
            case "DISO": // Date au format ISO (AAAAMMJJ)
                //---- Date
                if ($type == "M") {
                    // Mise à jour

                    if ($val == "") {
                        $chaine = "NULL";
                    } else {
                        // Reçoit JJ/MM/AAAA ou -JJ/MM/AAAA
                        $DebDte = 0;
                        if (substr($val, 0, 1) == "-") {
                            $DebDte = 1;
                        }
                        $tablo = explode("/", substr($val, $DebDte, 10));
                        //---- Jour
                        $tablo[0] = "00" . $tablo[0];
                        $tablo[0] = substr($tablo[0], strlen($tablo[0]) - 2, 2);
                        //---- Mois
                        $tablo[1] = "00" . $tablo[1];
                        $tablo[1] = substr($tablo[1], strlen($tablo[1]) - 2, 2);

                        $chaine = $tablo[2] . "-" . $tablo[1] . "-" . $tablo[0];
                        if (substr($val, 0, 1) == "-") {
                            $chaine = "-" . $chaine;
                        }
                        // renvoie AAAA-MM-JJ ou -AAAA-MM-JJ
                        $chaine = "'" . $chaine . "'";
                    }
                } else {
                    // Lecture
                    if ($val == "") {
                        $chaine = "";
                    } else {
                        // Reçoit AAAAMMJJ
                        //    renvoie JJ/MM/AAAA
                        $DebDte = 0;
                        if (substr($val, 0, 1) == "-") {
                            $DebDte = 1;
                        }
                        $val = substr($val, $DebDte, 10);
                        $tablo[0] = substr($val, 0, 4); // AAAA
                        $tablo[1] = substr($val, 4, 2); // MM
                        $tablo[2] = substr($val, 6, 2); // JJ
                        if (intval($tablo[2]) != 0) {
                            $chaine = $tablo[2] . "/";
                        }
                        if (intval($tablo[1]) != 0) {
                            $chaine .= $tablo[1] . "/";
                        }
                        if ($tablo[0] != "") {
                            $chaine .= $tablo[0];
                        }
                        if ($DebDte == 1) {
                            $chaine = "-" . $chaine;
                        }
                    }
                }
                break;

            case "DSQL": // Date mais la date en entrée est au format SQL (AAAA-MM-JJ)
                //---- Date
                if ($type == "M") {
                    // Mise à jour
                    if ($val == "") {
                        $chaine = "NULL";
                    } else {
                        // Reçoit AAAA-MM-JJ HH:MM:SS et
                        $tablo = explode("-", substr($val, 0, 10));
                        // renvoie AAAMMJJ (format Sql Server)
                        $chaine = "'" . $tablo[0] . $tablo[1] . $tablo[2] . substr($val, 10) . "'";
                    }
                } else {
                    // Lecture
                    if ($val == "") {
                        $chaine = "";
                    } else {
                        // Reçoit AAAA-MM-JJ HH:MM:SS.0000 (Access) et Oracle, je croit
                        //    renvoie JJ/MM/AAAA
                        $Heure = substr($val, 11, 8);
                        $TblHre = explode(":", $Heure);
                        $val = substr($val, 0, 10);
                        $tablo = explode("-", $val);
                        $chaine = $tablo[2] . "/" . $tablo[1] . "/" . $tablo[0];

                        if ($Heure != "") {
                            if ((intval($TblHre[0]) + intval($TblHre[1]) + intval($TblHre[2])) > 0) {
                                $chaine .= " " . $Heure;
                            }
                        }
                    }
                }
                break;

            case "DJC":
                if ($type == "M") {
                    // M.A.J.
                    if ($val == "") {
                        $chaine = "0";
                    } else {
                        // Reçoit JJ/MM/AAAA
                        // et renvoie un entier long (n° jour julien)
                        $tablo = explode("/", $val);
                        $chaine = gregoriantojd(
                            intval($tablo[1]), // Mois
                            intval($tablo[0]), // Jour
                            intval($tablo[2])
                        ); // Année
                    }
                } else {
                    // Lecture
                    if ($val == "0" || $val == "") {
                        $chaine = "";
                    } else {
                        // Reçoit un entier long (n° jour julien)
                        // et renvoie JJ-MM-AAAA
                        $val = jdtogregorian($val); // MM/JJ/AAAA
                        $tablo = explode("/", $val);
                        $chaine = $tablo[1] . "/" . $tablo[0] . "/" . $tablo[2];
                    }
                }
                break;

            case 'time':
            case "HM": // Heure minutes secondes
                if ($type == "M") {
                    // M.A.J.
                    if ($val == "") {
                        $chaine = "00:00";
                    } else {
                        // Reçoit HH:MM:SS
                        $chaine = "'" . $val . "'";
                    }
                } else {
                    // Lecture
                    // Reçoit HH:MM:SS.0000000
                    // et renvoie uniquement les heures et les minutes
                    $chaine = substr($val, 0, 5);
                }
                break;

            default:
                $chaine = $val;
                break;
        }

        return $chaine;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : MajEnreg
     * Type : Méthode de l'objet Bdd
     * Créée par : Dblv
     * Le : 28/12/2012
     * Paramètres :
     * Description :
     * Mise à jour d'un enregistrement
     * ----------------------------------------------------------------------------------
     * Révisions
     * AAAA
     * JJ/MM :
     * -------------------------------------------------------------------------------- */

    public function MajEnreg(&$oRecord)
    { //}$sTable, $aChamps, $sIdent, &$iIdEnreg) {
        $aStruc = $this->StructureTbl($oRecord->table);
        $aChampsMaj = array();
        $sNomChamp = "";
        $sChamps = "";
        $sUpdate = "";
        $sUpdateType = 'I';
        $aExecReq = array();

        if (intval($oRecord->idrecord) > 0) {
            $sUpdateType = 'U';
            //---- Maj d'un enreg.
            for ($IndChm = 0; $IndChm < count($oRecord->fields); $IndChm++) {
                $sNomChamp = strtolower($oRecord->fields[$IndChm]->name);

                //---- Si le champ existe dans la table, on traite
                if (isset($aStruc[$sNomChamp])) {
                    if ($sUpdate != "") {
                        $sUpdate .= ", ";
                    }

                    $aChampsMaj[$sNomChamp] = $oRecord->fields[$IndChm]->value;
                    //error_log($sNomChamp.'-'.$oRecord->fields[$IndChm]->value.' : '.$aStruc[$sNomChamp]["typechamp"].' : '.$this->FormatSql($oRecord->fields[$IndChm]->value, $aStruc[$sNomChamp]["typechamp"]));
                    $sUpdate .= $sNomChamp . "=" . $this->FormatSql($oRecord->fields[$IndChm]->value, $aStruc[$sNomChamp]["typechamp"]);
                }
            }

            $sReq = 'UPDATE %1$s SET %2$s WHERE %3$s=%4$s';
            //error_log(sprintf($sReq, $oRecord->table, $sUpdate, $oRecord->ident, $this->FormatSql($oRecord->idrecord, $aStruc[$oRecord->ident]["typechamp"])));
            $aExecReq = $this->QryExec(sprintf($sReq, $oRecord->table, $sUpdate, $oRecord->ident, $this->FormatSql($oRecord->idrecord, $aStruc[$oRecord->ident]["typechamp"])));
        } else {
            $sUpdateType = 'I';
            //---- Création d'un enreg.
            for ($IndChm = 0; $IndChm < count($oRecord->fields); $IndChm++) {
                $sNomChamp = strtolower($oRecord->fields[$IndChm]->name);

                //---- Si le champ existe dans la table, on traite
                if (isset($aStruc[$sNomChamp])) {
                    if ($sChamps != "") {
                        $sChamps .= ", ";
                        $sUpdate .= ", ";
                    }

                    $aChampsMaj[$sNomChamp] = $oRecord->fields[$IndChm]->value;
                    $sChamps .= $sNomChamp;
                    $sUpdate .= $this->FormatSql($oRecord->fields[$IndChm]->value, $aStruc[$sNomChamp]["typechamp"]);
                }
            }

            $sReq = 'INSERT INTO %1$s (%2$s) VALUES (%3$s)';
            $aExecReq = $this->QryExec(sprintf($sReq, $oRecord->table, $sChamps, $sUpdate));

            //---- Récup. de l'Id de l'enreg. créé
            $oRecord->idrecord = $this->DernierEnreg($oRecord->table);
        }

        $oRecord->updateType = $sUpdateType;
        return array("exec" => $aExecReq[0], "updatetype" => $sUpdateType, "message" => $aExecReq[1], "champs" => $aChampsMaj);
    }

    /**
     * @author : edblv
     * date   : 09/07/14
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     *
     *
     * @version JJ/MM/AA edblv RND#ND-ND.ND Création
     */
    public function update4D($aRecord)
    {
        $aExec = array(
            'success' => false,
            'message' => '',
            'messagedet' => array(),
        );

        $sTableName = $aRecord->table;
        $sIndexField = $aRecord->ident;
        $iIndexValue = intval($aRecord->idrecord);
        $sAction = 'M';

        //---- Envoie d'une requête SOAP de notification de mise à jour
        $aParam4D = array(
            'wsdl_cache' => 0,
            'trace' => 1,
            'soap_version' => SOAP_1_1,
        );

        ini_set("soap.wsdl_cache_enabled", "0");

        try {
            //error_log(var_export($this->aSession[$this->sAppName]["PARAMETRES"]['soap4d'],true));
            //---- Requête SOAP
            $clientSOAP = new SoapClient(
                $_SESSION[$_SESSION['AppName']]["PARAMETRES"]['soap']["client"],
                $aParam4D
            );

            //---- Appel de la requête de notification de mise à jour
            $ResultSoap = $clientSOAP->SOAP_MajSQL($sTableName, $iIndexValue, $sAction);

            if ($ResultSoap['vtCodeErreur'] === $sTableName) {
                //---- Si le nom de la table est retourné par 4D, ça veut dire qu'aucune MAJ côté 4D n'est associé à cette MAJ SQL
                $ResultSoap['vtCodeErreur'] = 'noupdateneeded';
            }

            $aExec['message'] = $ResultSoap['vtCodeErreur'];
            unset($clientSOAP);

            $aExec['success'] = true;
        } catch (SoapFault $SF) {
            $aExec['success'] = false;
            $aExec['message'] = "SOAPERR";
            $aExec['messagedet'] = $SF;
        }

        return $aExec;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : InfosFormulaire
     * Type : Méthode de l'objet Bdd
     * Créée par : Dblv
     * Le : 01/02/2013
     * Paramètres : aForm : tableau contenant les nom des formulaire pour lesquequels on veux des infos
     * Description :
     * Lit les paramètres concernant les formulaire
     * -------------------------------------------------------------------------------- */

    public function Erreur($Chaine, $bDetail = true)
    {
        $Forcer = $this->ForcerEspion;
        $this->ForcerEspion = true;
        $this->Espion($Chaine);
        $this->ForcerEspion = $Forcer;
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
    public function Espion($Chaine)
    {
        $bSpyOk = false;

        if (isset($_COOKIE["AFFESPIONS"])) {
            $bSpyOk = (intval($_COOKIE["AFFESPIONS"]) > 0);
        }
        if ($this->ForcerEspion) {
            $bSpyOk = true;
        }

        if ($bSpyOk) {
            error_log($Chaine);
        }
    }

    /**
     * @author : edblv
     * date   : 24/10/11 16:59
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Execute une requête passée en paramètre
     * @param string $Requete Requête à éxecuter (Etonnant, non ?)
     * @version JJ/MM/AA edblv RND#ND-ND.ND Création
     */
    public function QryExec($Requete)
    {
        $initialEncoding = mb_detect_encoding($Requete);
        $aResults = [];
        $Retour = null;

        switch ($this->PrmBase["typebase"]) {
            case "MsSql2016":
            case "MsSql":
                //---- MsSql avec PDO
                $oQry = $this->CnxDb->prepare($Requete);  // FIXME: L'erreur est là mais impossible de savoir pourquoi la requete ne renvoie pas d'identifiant avec l'action create
                $oQry->execute();                         // La préparation est bonne, l'execution se fait bien mais rien n'est récupérer
                $aCnxErr = $this->CnxDb->errorInfo();
                $aErr = $oQry->errorInfo();
                if(empty($oQry)){
                    while ($aResult = $oQry->fetch(PDO::FETCH_ASSOC)) {
                        $aResults[] = $aResult;
                    }
                }else{
                    $aResults[] = null;
                }

                $oQry->closeCursor();
                if (intval($aErr[1]) < 1) {
                    $Retour[0] = true;
                    $Retour[1] = "";
                    $Retour[2] = 0;
                } else {
                    //$aErr = $oQry->errorInfo();    //$this->CnxDb->errorInfo();
                    $Retour[0] = false;
                    $Retour[1] = $aErr[2];
                    $Retour[2] = $aErr[0];

                    if (!$this->bSilent) {
                        $this->Erreur(sprintf('QryExec Err: %1$s', $Requete));
                        $this->Erreur(sprintf('%1$s : %2$s', $aErr[0], $aErr[2]));
                    }
                }
                break;
        }

        //---- Format plus pratique (en attendant que je supprime le tableau a indice numérique)
        $Retour[3] = [
            'exec' => $Retour[0],
            'message' => $Retour[1],
        ];

        $this->aExecReq = [
            'success' => $Retour[0],
            'errno' => $Retour[2],
            'results' => $aResults,
            'message' => $Retour[1],
        ];
        return $Retour;
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
    public function qryDebug($sQuery, array $aParams = [])
    {
        $aKeys = array();
        $aValues = array();

        # build a regular expression for each parameter
        foreach ($aParams as $sKey => $sValue) {
            if (is_string($sKey)) {
                $aKeys[] = '/:' . $sKey . '/';
            } else {
                $aKeys[] = '/[?]/';
            }

            if (is_numeric($sValue)) {
                $aValues[] = intval($sValue);
            } else {
                $aValues[] = '\'' . $sValue . '\'';
            }
        }

        $sQuery = preg_replace($aKeys, $aValues, $sQuery, 1, $count);
        return $sQuery;
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
    public function StructureTbl($sNomTable)
    {
        $sReqStruc = sprintf($this->SysStrTable, $sNomTable);
        $aStruc = $this->QryToArray($sReqStruc, 'nomchamp');
        return $aStruc;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : QryToArray
     * Type : Méthode de l'objet BDD
     * Créée par : Dblv
     * Le : 25/05/11 09:16
     * Paramètres :
     * Description :
     * Execute une requête SQL et retourne le résultat dans un tableau
     * ----------------------------------------------------------------------------------
     * Révisions
     * AAAA
     * JJ/MM :
     * -------------------------------------------------------------------------------- */

    public function QryToArray($Requete, $sIndice = "", $bDebug = false)
    {
        $this->aExecReq = array("success" => true, "errno" => 0, "message" => '');
        $this->aTypeChamp = array();

        switch ($this->PrmBase["typebase"]) {
            case "MsSql":
                //---- Nouvelle connexion MsSql (avec PDO)
                $oResult = $this->CnxDb->query($Requete);
                $aDatas = null;
                $aRow = array();
                $iIndRec = 0;

                if ($bDebug) {
                    error_log('--------- QryToArray --------------');
                    error_log($Requete);
                }
                if ($oResult !== false) {
                    if ($oResult->columnCount() > 0) {

                        //---- Récupération des définitions des colonnes de la requête
                        foreach (range(0, $oResult->columnCount() - 1) as $iIndCol) {
                            $aCol = $oResult->getColumnMeta($iIndCol);
                            $sFieldName = $aCol['name'];
                            $this->aTypeChamp[$sFieldName] = $aCol;
                        }

                        //---- Nom de la colonne type
                        $sTypeCol = 'native_type';

                        switch (PHP_OS) {
                            case 'AlmaLinux':
                            case 'Linux':
                                break;
                            default:
                                $sTypeCol = 'sqlsrv:decl_type';
                                break;
                        }

                        if ($bDebug) {
                            error_log(var_export($this->aTypeChamp, true));
                        }

                        //---- On parcours les enregistrements reçus
                        while ($oRecord = $oResult->fetch()) {
                            $aRow = array();

                            //---- On parcours les champs de l'enregistrement
                            foreach ($oRecord as $sKey => $sValue) {
                                switch ($this->aTypeChamp[$sKey][$sTypeCol]) {
                                    case "date":
                                    case "datetime":
                                        /*
                                        error_log($sValue);
                                        $sValue = $this->FormatSql($sValue, "DSQL", "L");
                                        error_log('----> '.$sValue);
                                         */
                                        break;

                                    case "int":
                                        $sValue = intval($this->FormatSql($sValue, "N", "L"));
                                        break;

                                    case "decimal":
                                        $sValue = floatval($this->FormatSql($sValue, "N", "L"));
                                        break;

                                    default:
                                        break;
                                }

                                $aRow[$sKey] = $sValue;
                            }

                            //---- Table de retour indicé numériquement ou sur la valeur d'un des champs de la requête
                            //    Ex : si $aRow=['champ1'=>'Valeur1', 'champ2'=>'Valeur2', 'champ3'=>'Valeur3']
                            //        $sIndice='champ2'
                            //    Alors $aDatas['Valeur2']=['champ1'=>'Valeur1', 'champ2'=>'Valeur2', 'champ3'=>'Valeur3']
                            //    Sinon $aDatas[$iIndRec]=['champ1'=>'Valeur1', 'champ2'=>'Valeur2', 'champ3'=>'Valeur3']
                            if ($sIndice != "") {
                                $sValIndice = $aRow[$sIndice];
                                $aDatas[$sValIndice] = $aRow;
                            } else {
                                $aDatas[$iIndRec] = $aRow;
                            }

                            $iIndRec++;
                        }
                    } else {
                        if ($bDebug) {
                            error_log('La requête a fonctionnée mais n\a retournée aucune colonne');
                        }
                    }

                    //---- On ferme le curseur des résultats
                    $oResult->closeCursor();
                } else {
                    $aErr = $this->CnxDb->errorInfo();
                    $this->aExecReq = array("success" => false, "errno" => $aErr[0], "message" => $aErr[2]);
                    $this->Erreur(sprintf('QryToArray : %1$s', $Requete));
                    $this->Erreur(sprintf('%1$s : %2$s', $aErr[0], $aErr[2]));
                }
                break;

            case "MsSql2016":
                //---- Nouvelle connexion MsSql (avec PDO)
                // var_dump($this->CnxDb->query($Requete));
                $oResult = $this->CnxDb->query($Requete); // Si erreur PDOException syntaxe incorrect vers = .Cela est surement que la requete n'a pas de variable est finie donc par = 
                $aDatas = null;                           // L'erreur ne provient pas du = de la ligne de code.
                $aRow = array();
                $iIndRec = 0;

                if ($bDebug) {
                    error_log('--------- QryToArray --------------');
                    error_log($Requete);
                }
                if ($oResult !== false) {
                    if ($oResult->columnCount() > 0) {

                        //---- Récupération des définitions des colonnes de la requête
                        foreach (range(0, $oResult->columnCount() - 1) as $iIndCol) {
                            $aCol = $oResult->getColumnMeta($iIndCol);
                            $sFieldName = $aCol['name'];
                            $this->aTypeChamp[$sFieldName] = $aCol;
                        }

                        //---- Nom de la colonne type
                        $sTypeCol = 'native_type';

                        switch (PHP_OS) {
                            case 'Linux':
                                break;
                            default:
                                $sTypeCol = 'sqlsrv:decl_type';
                                break;
                        }

                        if ($bDebug) {
                            error_log(var_export($this->aTypeChamp, true));
                        }

                        //---- On parcours les enregistrements reçus
                        while ($oRecord = $oResult->fetch()) {
                            $aRow = array();

                            //---- On parcours les champs de l'enregistrement
                            foreach ($oRecord as $sKey => $sValue) {
                                switch ($this->aTypeChamp[$sKey][$sTypeCol]) {
                                    case "date":
                                    case "datetime":
                                        /*
                                        error_log($sValue);
                                        $sValue = $this->FormatSql($sValue, "DSQL", "L");
                                        error_log('----> '.$sValue);
                                         */
                                        break;

                                    case "int":
                                        $sValue = intval($this->FormatSql($sValue, "N", "L"));
                                        break;

                                    case "decimal":
                                        $sValue = floatval($this->FormatSql($sValue, "N", "L"));
                                        break;

                                    default:
                                        break;
                                }

                                $aRow[$sKey] = $sValue;
                            }

                            //---- Table de retour indicé numériquement ou sur la valeur d'un des champs de la requête
                            //    Ex : si $aRow=['champ1'=>'Valeur1', 'champ2'=>'Valeur2', 'champ3'=>'Valeur3']
                            //        $sIndice='champ2'
                            //    Alors $aDatas['Valeur2']=['champ1'=>'Valeur1', 'champ2'=>'Valeur2', 'champ3'=>'Valeur3']
                            //    Sinon $aDatas[$iIndRec]=['champ1'=>'Valeur1', 'champ2'=>'Valeur2', 'champ3'=>'Valeur3']
                            if ($sIndice != "") {
                                $sValIndice = $aRow[$sIndice];
                                $aDatas[$sValIndice] = $aRow;
                            } else {
                                $aDatas[$iIndRec] = $aRow;
                            }

                            $iIndRec++;
                        }
                    } else {
                        if ($bDebug) {
                            error_log('La requête a fonctionnée mais n\a retournée aucune colonne');
                        }
                    }

                    //---- On ferme le curseur des résultats
                    $oResult->closeCursor();
                } else {
                    $aErr = $this->CnxDb->errorInfo();
                    $this->aExecReq = array("success" => false, "errno" => $aErr[0], "message" => $aErr[2]);
                    $this->Erreur(sprintf('QryToArray : %1$s', $Requete));
                    $this->Erreur(sprintf('%1$s : %2$s', $aErr[0], $aErr[2]));
                }
                break;
        }
        return $aDatas;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : Fichier
     * Type : Méthode de l'objet BDD
     * Créée par : Dblv
     * Le : 25/05/11 09:16
     * Paramètres : $sFichier (Nom de fichier)
     * Description :
     * Formate un nom de fichier en retirant tout ce qui ne va pas !
     * ----------------------------------------------------------------------------------
     * Révisions
     * AAAA
     * JJ/MM :
     * -------------------------------------------------------------------------------- */

    public function DernierEnreg($sTableName)
    {
        $IdEnreg = 0;

        switch ($this->PrmBase["typebase"]) {
            case "MsSql":
            case "Old_MsSql":
            case "Odbc":
                $aIdent = $this->QryToArray('SELECT IDENT_CURRENT(\'' . $sTableName . '\') AS Ident');
                $IdEnreg = $aIdent[0]["ident"];
                break;

            case "MySql":
                $IdEnreg = mysql_insert_id();
                break;
        }

        return $IdEnreg;
    }

    public function InfosFormulaire($aForm)
    {
        $aListeForm = array();
        $sFiltre = "";

        for ($IndFrm = 0; $IndFrm < count($aForm); $IndFrm++) {
            if ($sFiltre != "") {
                $sFiltre .= ", ";
            }

            $sFiltre .= "'" . $aForm[$IndFrm] . "'";
        }

        $aListeForm = $this->QryToArray(sprintf($this->SysInfosFormulaire, $sFiltre), 'name');

        return $aListeForm;
    }

    public function ChargeParametres($bEnSession = true)
    {
        $aParametres = array();

        //---- 1° : Les paramètres qui sont dans la base (donc ceux qui sont pareil pour tout le monde)
        //error_log(sprintf($this->SysLitPrm, ""));
        $aParams = $this->QryToArray(sprintf($this->SysLitPrm, ""));
        //error_log(var_export($aParams,true));
        $NomParam = "";

        for ($IndPrm = 0; $IndPrm < count($aParams); $IndPrm++) {
            $sCodeParam = strtolower(trim($aParams[$IndPrm]["codeparametre"]));

            if ($sCodeParam != $NomParam) {
                $NomParam = $sCodeParam;
                $aParametres[$NomParam] = array();
            }

            $CodeDetail = strtolower(trim($aParams[$IndPrm]["codedetail"]));

            switch ($CodeDetail) {
                case "passwd":
                    $aParametres[$NomParam][$CodeDetail] = $this->FormatSql(base64_decode($aParams[$IndPrm]["valeur"]), "JSON", "L");
                    break;

                default:
                    $aParametres[$NomParam][$CodeDetail] = $aParams[$IndPrm]["valeur"];
                    break;
            }

            $aParametres[$NomParam][$CodeDetail . "_datemodif"] = $aParams[$IndPrm]["modifle"];
        }

        //---- 2° Les paramètres propres au serveur sur lequel on est
        $sParamsPath = '../localParams/parametres.json';
        $oParams = json_decode('');

        if (file_exists($sParamsPath)) {
            $sParamFile = file_get_contents($sParamsPath);
            $oParams = json_decode($sParamFile);

            foreach ($oParams as $sKey => $oDetPrm) {
                foreach ($oDetPrm as $sDetKey => $sValue) {
                    $aParametres[$sKey][$sDetKey] = $sValue;
                }
            }
        }

        if ($bEnSession) {
            $_SESSION[$_SESSION['AppName']]["PARAMETRES"] = $aParametres;
        } else {
            return $aParametres;
        }
    }

    public function SauveParametre($sCodeParam, $sCodeDetail, $sValeur)
    {
        //---- 1° : On lit les paramètres connus pour ce code
        $aParam = $this->QryToArray(sprintf($this->SysLitPrm, "WHERE CodeParametre='" . $sCodeParam . "'"));

        if (count($aParam) < 1) {
            //---- Aucun param. connu sous ce code
            $_SESSION[$_SESSION['AppName']]["PARAMETRES"][$sCodeParam] = array();

            # Création du code
            $aExecReq = $this->QryExec(sprintf($this->SysAjoutParam, $this->FormatSql($sCodeParam, "C")));
            $IdParametre = $this->DernierEnreg('parametre');

            # Création du détail
            $aExecReq = $this->QryExec(sprintf($this->SysAjoutParamDet, $IdParametre, $this->FormatSql($sCodeDetail, "C"), $this->FormatSql($sValeur, "U"), $this->FormatSql(date("d/m/Y H:i:s"), "DH")));
        } else {
            //---- Code paramètre connu, test si CodeDetail existe
            $IdParametre = 0;
            $IdDetail = 0;

            for ($IndPrm = 0; $IndPrm < count($aParam); $IndPrm++) {
                $IdParametre = $aParam[$IndPrm]["IDPARAMETRE"];

                if (trim($aParam[$IndPrm]["CODEDETAIL"]) == $sCodeDetail) {
                    //---- Trouvé
                    $IdDetail = $aParam[$IndPrm]["IDPARAMETRE_DET"];
                }
            }

            if ($IdDetail > 0) {
                //---- Maj
                $aExecReq = $this->QryExec(sprintf($this->SysMajParamDet, $IdDetail, $this->FormatSql($sCodeDetail, "C"), $this->FormatSql($sValeur, "U"), $this->FormatSql(date("d/m/Y H:i:s"), "DH")));
            } else {
                //---- Création
                $aExecReq = $this->QryExec(sprintf($this->SysAjoutParamDet, $IdParametre, $this->FormatSql($sCodeDetail, "C"), $this->FormatSql($sValeur, "U"), $this->FormatSql(date("d/m/Y H:i:s"), "DH")));
            }
        }

        $_SESSION[$_SESSION['AppName']]["PARAMETRES"][$sCodeParam][$sCodeDetail] = $sValeur;
    }

    public function ParamLocaux($aParam)
    {
        $aNodes = $aParam[0]["value"];

        for ($IndPrm = 0; $IndPrm < count($aNodes); $IndPrm++) {
            $aNode = $aNodes[$IndPrm];
            $sCodeParametre = strtolower($aNode['name']);

            $_SESSION[$_SESSION['AppName']]["PARAMETRES"][$sCodeParametre] = array();

            //---- Maintenant, on parcours les détails de ce paramètre
            for ($IndDet = 0; $IndDet < count($aNode["value"]); $IndDet++) {
                $aDetNode = $aNode["value"][$IndDet];
                $sCodeDet = strtolower($aDetNode['name']);

                $_SESSION[$_SESSION['AppName']]["PARAMETRES"][$sCodeParametre][$sCodeDet] = $aDetNode["value"];
            }
        }
    }

    public function ChargePreferences($aPrefUti)
    {
        $_SESSION[$_SESSION['AppName']]["PREFERENCES"] = array();

        for ($IndPref = 0; $IndPref < count($aPrefUti); $IndPref++) {
            $sNomPref = strtolower($aPrefUti[$IndPref]["nomchamp"]);
            $_SESSION[$_SESSION['AppName']]["PREFERENCES"][$sNomPref] = $aPrefUti[$IndPref]["contenudetails"];
        }
    }

    public function UrlSoap4D()
    {
        $sUrlSoap = "";
        $sCheminBase = "CLIENT";

        if (isset($_SESSION[$_SESSION['AppName']]["BASE"]["dev"])) {
            if ($_SESSION[$_SESSION['AppName']]["BASE"]["dev"] == "1") {
                $sCheminBase = "PQR";
            }
        }

        $sUrlSoap = $_SESSION[$_SESSION['AppName']]["PARAMETRES"]["soap"][$sCheminBase];

        return $sUrlSoap;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : TableTempo
     * Type : Méthode de l'objet Bdd
     * Créée par : Dblv
     * Le : 20/01/12 15:18
     * Paramètres :    - $Fichier (Nom du fichier qui appelle)
     *                 - $action (Action qui a déclenchée cette méthode)
     *                 - $Filtre (Filtre qui sert au test)
     * Description :
     * Appelée avant une requête qui fait une liste pour une grid pour savoir s'il faut
     * recompter le nombre total d'enregistrements
     * Retourne true ou false
     * ----------------------------------------------------------------------------------
     * Révisions
     * AAAA
     * JJ/MM :
     * -------------------------------------------------------------------------------- */

    public function LstOldSsn()
    {
        //---- On supprime toutes les sessions et tous les verrous des sessions qui ont plus de 12 heures
        //    ou qui on une date inférieure à la date du jour
        $DateJourMinuit = mktime(0, 0, 0);
        $sessPath = get_cfg_var("session.save_path") . "\\";
        $TblSessions = array();

        $this->TblSsnVielles = array();
        $dh = @opendir($sessPath);
        while (($file = @readdir($dh)) !== false) {
            if ($file != "." && $file != "..") {
                $fullpath = $sessPath . $file;
                if (!@is_dir($fullpath)) {
                    // "sess_7480686aac30b0a15f5bcb78df2a3918"
                    $TblNoSsn = explode("_", $file);
                    $NoSsn = $TblNoSsn[1];
                    // array("sess", "7480686aac30b0a15f5bcb78df2a3918")
                    //$sessValues = file_get_contents ( $fullpath );    // get raw session data
                    // this raw data looks like serialize() result, but is is not extactly this, so if you can process it... le me know
                    //$diffSess[$TblNoSsn[1]]["raw"] = $sessValues;
                    $TblSessions[$NoSsn]["age"] = time() - filectime($fullpath);
                    $TblSessions[$NoSsn]["HreLastModif"] = filemtime($fullpath);
                    $TblSessions[$NoSsn]["LastModif"] = time() - filemtime($fullpath);
                    $TblSessions[$NoSsn]["creation"] = date("d/m/Y H:i:s.", filectime($fullpath));
                    $TblSessions[$NoSsn]["modification"] = date("d/m/Y H:i:s.", filemtime($fullpath));

                    $TropVielle = false;
                    //---- Si la session date d'hier (ou plus) elle n'est plus valide
                    if ($TblSessions[$NoSsn]["HreLastModif"] < $DateJourMinuit) {
                        $TropVielle = true;
                    }
                    //---- Si la session n'a pas été modifiée depuis 12 heures (ou plus) elle n'est plus valide non plus
                    if ($TblSessions[$NoSsn]["LastModif"] >= 3600 * $this->NbreHresLimite) {
                        $TropVielle = true;
                    }

                    if ($TropVielle) {
                        $this->TblSsnVielles[$NoSsn] = $fullpath;
                    }
                }
            }
        }
        @closedir($dh);
    }

    /**
     * @author : edblv
     * date   : 10/05/16 16:16
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Valide une chaîne contenant un chemin
     * @param string $sPath Chemin à valider
     * @param string $sDest Destination du chemin (w (Windows), h (HTTP))
     *
     * @version JJ/MM/AA edblv RND#ND-ND.ND Création
     */
    public function validPath($sPath, $sDest = '')
    {
        $sSlash = '/';

        if (strtolower(substr(PHP_OS, 0, 3)) === 'win' || $sDest === 'w') {
            $sSlash = '\\';
        }

        $sPath = str_replace('/', $sSlash, $sPath);
        $sPath = str_replace('\\', $sSlash, $sPath);

        if (substr($sPath, -1, 1) !== '/' && substr($sPath, -1, 1) !== '\\') {
            $sPath .= $sSlash;
        }

        return $sPath;
    }

    /**
     * @author : edblv
     * date   : 04/05/16 10:37
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Effectue un dir dans un répertoire
     * @param string $sPath Chemin dans lequel on fait le dir
     * @param string $sJocker Fichiers recherchés (Ex. : *.pdf, *.txt...)
     * @param string $sReplacePath Chemin de remplacement (pour remplacer \\serveur\rep\srep par http://serveur/rep/srep)
     *
     * @version JJ/MM/AA edblv RND#ND-ND.ND Création
     */
    public function dir($sPath, $sJocker = '*.*', $aReplacePath = ['', ''])
    {
        $aFiles = [];
        $aDirectories = [];

        $sPath = $this->validPath($sPath);

        foreach ($aReplacePath as $iInd => $sValue) {
            if ($sValue !== '') {
                $aReplacePath[$iInd] = $this->validPath($sValue);

                /*
            if (substr($sValue, -1, 1) !== '/' && substr($sValue, -1, 1) !== '\\') {
            $sValue.='/';
            $aReplacePath[$iInd] = $sValue;
            }
             */
            }
        }

        $oDir = dir($sPath);

        if ($oDir && $oDir !== null) {
            try {
                while (false !== ($sItem = $oDir->read())) {
                    if (is_dir($sPath . $sItem)) {
                        if ($sItem !== '.' && $sItem !== '..') {
                            $aDirectories[] = $sItem;
                        }
                    } else {
                        if (strtolower(substr($sItem, 0, 5)) == 'thumb') {
                            continue;
                        }

                        $sFilePath = $sPath;

                        if ($aReplacePath[0] !== '' && $aReplacePath[1] !== '') {
                            $sFilePath = str_replace($aReplacePath[0], $aReplacePath[1], $sPath);
                        }

                        $aFiles[] = ['chemin' => $sFilePath, 'fichier' => mb_convert_encoding($sItem, 'UTF-8')];
                    }
                }

                $oDir->close();
            } catch (Exception $ex) {
                error_log('Lecture impossible de : ' . $sPath);
            }
        } else {
            error_log($oDir);
            error_log('Lecture impossible de : ' . $sPath);
        }

        return ['files' => $aFiles, 'dir' => $aDirectories];
    }

    /**
     * @author : edblv
     * date   : 13/05/16 11:10
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Remplace les caractères diacritics d'une chaîne par un caractère simple (de a à z)
     *
     * @version JJ/MM/AA edblv RND#ND-ND.ND Création
     */
    public function wd_remove_accents($str, $charset = 'utf-8')
    {
        $str = htmlentities($str, ENT_NOQUOTES, $charset);

        $str = preg_replace('#&([A-za-z])(?:acute|cedil|circ|grave|orn|ring|slash|th|tilde|uml);#', '\1', $str);
        $str = preg_replace('#&([A-za-z]{2})(?:lig);#', '\1', $str); // pour les ligatures e.g. '&oelig;'
        $str = preg_replace('#&[^;]+;#', '', $str); // supprime les autres caractères

        return $str;
    }

    /**
     * @author : edblv
     * date   :
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Démarre un transaction SQL
     *
     * @version JJ/MM/AA edblv RND#ND-ND.ND Création
     */
    public function Begin()
    {
        switch ($this->PrmBase["typebase"]) {
            case "MsSql2016":
            case "MsSql":
                $this->CnxDb->beginTransaction();
                break;
        }
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : ChargePanier
     * Type : Méthode de la classe GestBdd
     * Créée par : Dblv
     * Le : 08/12/10 11:44
     * Paramètres : $IdFormulaire (Identifiant du formulaire courant)
     *                 $NomChamp (Nom du champ dans le formulaire auquel le panier est rattaché)
     *                 $IdPanier (Identifiant du panier a charger)
     * Description :
     * Charge un panier dans la variable de session
     * -------------------------------------------------------------------------------- */

    public function Rollback()
    {
        switch ($this->PrmBase["typebase"]) {
            case "MsSql2016":
            case "MsSql":
                $this->CnxDb->rollBack();
                break;
        }
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : AjoutPanier
     * Type : Méthode de la classe GestBdd
     * Créée par : Dblv
     * Le : 02/12/10 12:13
     * Paramètres : $IdFormulaire (Identifiant du formulaire courant)
     *                 $NomChamp (Nom du champ dans le formulaire auquel le panier est rattaché)
     *                 $IdPanier (Identifiant du panier dans lequel on ajoute les éléments)
     *                 $LstId (Identifiants séparés par des virgules à ajouter au panier)
     * Description :
     * Ajoute des identifiants dans un panier (existant ou non)
     * -------------------------------------------------------------------------------- */

    public function Commit()
    {
        switch ($this->PrmBase["typebase"]) {
            case "MsSql2016":
            case "MsSql":
                $this->CnxDb->commit();
                break;
        }
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : InfosPanier
     * Type : Méthode de la classe GestBdd
     * Créée par : Dblv
     * Le : 02/12/10
     * Paramètres : $IdFormulaire (Identifiant du formulaire courant)
     *                 $NomChamp (Nom du champ dans le formulaire auquel le panier est rattaché)
     * Description :
     * Retourne un tableau avec des infos sur le panier en cours
     * -------------------------------------------------------------------------------- */

    public function Filtre($TblFiltre)
    {
        $Filtre = "";
        $TypeChm = "";

        $this->TblFiltre = array();
        $this->TblStrucTbl = array();

        for ($IndFlt = 0; $IndFlt < count($TblFiltre); $IndFlt++) {
            $NomTableFlt = strtoupper($TblFiltre[$IndFlt]["NOMTABLE"]);
            $NomChmFlt = strtoupper($TblFiltre[$IndFlt]["NOMCHAMP"]);
            $sFonctionFlt = $TblFiltre[$IndFlt]["FONCTION"];
            $Fonction = "";
            $Valeur = $TblFiltre[$IndFlt]["VALEUR"];
            $sCast = "";

            if ($sFonctionFlt != "") {
                //---- Filtre à partir d'une fonction
                //    Le type de valeur revoyée par la fonction se trouve au début de la chaîne
                //    $sFonctionFlt= [T]NomFonction(xxx,xxx,...)
                //    Ou [T] donne le type de valeur renvoyée par la fontion
                $NomChmFlt = substr($sFonctionFlt, 3);
                $sTypeVal = substr($sFonctionFlt, 1, 1);

                switch ($sTypeVal) {
                    case "D": // Date
                        $TypeChm = "datetime";
                        break;

                    case "N": // Nombre (entier, réel)
                        $TypeChm = "";
                        break;

                    default:
                        $TypeChm = "varchar";
                        break;
                }

                //$this->Erreur($NomChmFlt . " --- " . $TypeChm);
            } else {
                //---- Filtre à partir d'un champ
                //    On va chercher le type du champ dans la table
                if (!isset($this->TblStrucTbl[$NomTableFlt])) {
                    //---- On charge la structure des tables qui interviennent dans le filtre
                    $TblStrucTbl = $this->StructureTbl($NomTableFlt);
                    $TblStrucTbl = $this->TblIndiceCol($TblStrucTbl, "NOMCHAMP");
                    $this->TblStrucTbl[$NomTableFlt] = $TblStrucTbl;
                }
                $TypeChm = $this->TblStrucTbl[$NomTableFlt][$NomChmFlt]["TYPECHAMP"];

                $NomChmFlt = $NomTableFlt . "." . $NomChmFlt;
            }

            $this->TblFiltre[$NomChmFlt] = array("COMPARAISON" => "", "VALEURBRUTE" => $Valeur, "VALEURFORMATEE" => "");

            //---- D'abord on traite la valeur d'après le format du champ
            $bAjouterNull = false;

            if ($Valeur != "NULL") {
                switch ($TypeChm) {
                    case "datetime":
                        $Valeur = $this->FormatSql($Valeur, 'D');
                        break;

                    case "varchar":
                    case "char":
                    case "nchar":
                    case "nvarchar":
                        switch ($TblFiltre[$IndFlt]["COMPARAISON"]) {
                            case "COP": //Commence par
                            case "CON": //Contient
                                $Fonction = "RTRIM";
                                break;
                        }
                    // Pas de break;
                    case "ntext":
                        switch ($TblFiltre[$IndFlt]["COMPARAISON"]) {
                            case "LST":
                            case "NLS":
                                //---- Dans ce cas $Valeur est un tableau
                                $aValFinal = array();

                                for ($IndVal = 0; $IndVal < count($Valeur); $IndVal++) {
                                    if (trim($Valeur[$IndVal]) == "NULL") {
                                        $bAjouterNull = true;
                                    } else {
                                        $aValFinal[] = $this->FormatSql($Valeur[$IndVal], 'C');
                                    }
                                }

                                $Valeur = "";

                                if (count($aValFinal) > 0) {
                                    $Valeur = "(" . implode(",", $aValFinal) . ")";
                                }

                                break;

                            default:
                                $sCast = "CAST(" . $NomChmFlt . " AS nvarchar(max))";
                                $Valeur = $this->FormatSql($Valeur, 'C');
                                break;
                        }
                        break;

                    default:
                        switch ($TblFiltre[$IndFlt]["COMPARAISON"]) {
                            case "LST":
                            case "NLS":
                                //---- Dans ce cas $Valeur est un tableau
                                $aValFinal = array();

                                for ($IndVal = 0; $IndVal < count($Valeur); $IndVal++) {
                                    if (trim($Valeur[$IndVal]) == "NULL") {
                                        $bAjouterNull = true;
                                    } else {
                                        $aValFinal[] = $Valeur[$IndVal];
                                    }
                                }

                                $Valeur = "";

                                if (count($aValFinal) > 0) {
                                    $Valeur = "(" . implode(",", $aValFinal) . ")";
                                }

                                break;
                        }
                        break;
                }
            }

            //---- Ensuite on traite le type de comparaison
            $Comparaison = "";
            switch ($TblFiltre[$IndFlt]["COMPARAISON"]) {
                case "EGA": //Egale
                    $Comparaison = "=";
                    break;

                case "SUP": //Supérieur
                    $Comparaison = ">";
                    break;

                case "SEG": //Supérieur ou égale
                    $Comparaison = ">=";
                    break;

                case "INF": //Inférieur
                    $Comparaison = "<";
                    break;

                case "IEG": //Inférieur ou égale
                    $Comparaison = "<=";
                    break;

                case "NEG": //Non égale
                    $Comparaison = "<>";
                    break;

                case "LST": //Appartient à la liste
                    $Comparaison = " IN";
                    break;

                case "NLS": //N'appartient pas à la liste
                    $Comparaison = " NOT IN";
                    break;

                /*
                case "COM" : //Compris entre
                $Comparaison="=";
                break;
                 */
                case "COP": //Commence par
                    $Comparaison = " LIKE ";
                    break;

                case "CON": //Contient
                    $Comparaison = " LIKE ";
                    break;
            }
            $this->TblFiltre[$NomChmFlt]["COMPARAISON"] = $Comparaison;
            $this->TblFiltre[$NomChmFlt]["VALEURFORMATEE"] = $Valeur;

            if ($Filtre != "") {
                $Filtre .= " AND ";
            }

            if ($Fonction != "") {
                $NomChmFlt = $Fonction . "(" . $NomChmFlt . ")";
            }

            if ($TblFiltre[$IndFlt]["COMPARAISON"] == "LST" || $TblFiltre[$IndFlt]["COMPARAISON"] == "NLS") {
                $Filtre .= "(";

                if ($Valeur != "") {
                    $Filtre .= $NomChmFlt . $Comparaison . $Valeur;

                    if ($bAjouterNull) {
                        $Filtre .= " OR ";
                    }
                }

                if ($bAjouterNull) {
                    $Filtre .= $NomChmFlt . " IS NULL";
                }

                $Filtre .= ")";
            } else {
                if ($Valeur == "NULL") {
                    if ($Comparaison == "=") {
                        //---- IS (NULL)
                        $Comparaison = " IS ";
                    } else {
                        //---- IS NOT (NULL)
                        $Comparaison = " IS NOT ";
                    }
                }

                if ($sCast != "") {
                    $Filtre .= $sCast . $Comparaison . $Valeur;
                } else {
                    $Filtre .= $NomChmFlt . $Comparaison . $Valeur;
                }
            }
        }

        //$this->Erreur("Filtre : " . $Filtre);
        return $Filtre;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : TblIndiceCol
     * Type : Méthode de la classe GestBdd
     * Créée par : Dblv
     * Le :
     * Paramètres : $Tableau ($Tableau à deux dimensions indicé numériquement)
     *                 $Colonne (Colonne qui servira d'indice alpha au nouveau tableau)
     * Description :
     * Retourne un tableau indicé alphanumériquement à partir d'un tableau indicé numériquement
     *
     * Bon, j'explique :
     * J'ai ce tableau :
     * $TblNoms[0]={"NOM"=>"Toto", "QUALITE"=>"Est un con"}
     * $TblNoms[1]={"NOM"=>"Tutu", "QUALITE"=>"Est un con aussi"}
     * Si je fait : $TblNoms=TblIndiceCol($TblNoms,"NOM")
     * J'obtient :
     * $TblNoms["Toto"]={"QUALITE"=>"Est un con"}
     * $TblNoms["Tutu"]={"QUALITE"=>"Est un con aussi"}
     * ----------------------------------------------------------------------------------- */

    public function TblIndiceCol($Tableau, $Colonne)
    {
        $TblResult = array();

        for ($IndLig = 0; $IndLig < count($Tableau); $IndLig++) {
            $Indice = "";
            $TblLigne = array();
            for (reset($Tableau[$IndLig]); $NomCol = key($Tableau[$IndLig]); next($Tableau[$IndLig])) {
                if ($NomCol == $Colonne) {
                    $Indice = $Tableau[$IndLig][$NomCol];
                } else {
                    $TblLigne[$NomCol] = $Tableau[$IndLig][$NomCol];
                }
            }
            $TblResult[$Indice] = $TblLigne;
        }
        return $TblResult;
    }

    public function TableTempo($sNom, $sSelect, $sOrder, $sFrom, $sWhere)
    {
        $sReqSelect = $sSelect . ', ROW_NUMBER() OVER (ORDER BY ' . $sOrder . ') AS __NumLigne INTO ' . $sNom . ' ' . $sFrom . ' ' . $sWhere;
        $this->QryExec($sReqSelect);
    }

    public function Compte($Fichier, $action, $Filtre)
    {
        $bCompte = true;
        //$this->Erreur($Fichier."->".$action."=".$Filtre);

        if (isset($_SESSION[$_SESSION['AppName']][$Fichier])) {
            if (isset($_SESSION[$_SESSION['AppName']][$Fichier][$action])) {
                if ($_SESSION[$_SESSION['AppName']][$Fichier][$action] == $Filtre) {
                    //---- Si le filtre pour cette action n'est pas différent, pas la peine de compter
                    $bCompte = false;
                } else {
                    //$this->Erreur($_SESSION[$_SESSION['AppName']][$Fichier][$action]."!=".$Filtre,false);
                }
            } else {
                //---- Aucune référence à $action dans $_SESSION[$_SESSION['AppName']][$Fichier]
                $_SESSION[$_SESSION['AppName']][$Fichier][$action] = "";
            }
        } else {
            //---- Aucune référence à $Fichier
            $_SESSION[$_SESSION['AppName']][$Fichier] = array($action => "");
        }

        $_SESSION[$_SESSION['AppName']][$Fichier][$action] = $Filtre;
        return $bCompte;
    }

    //---------------------------------------------------------------------------------
    //    $DocXml : Objet DOMDocument déclaré dans le PHP
    //    $sRacine : Noeud auquel on s'attache pour ajouter les données
    //    $NomNoeud : Nom des noeud qui vont être créés
    //    $TblDonnees : Tableau contenant les données
    //    $TblAttr : Tableau contenant les noms des champs qui serviront d'attributs
    //                (tous les autres champs seront des UserData)
    //    $TblAttr est facultatif, s'il n'est pas précisé, tous les champs seront des UserData
    //    Ex. :
    //        $TblDonnees[0]=array("IDPERSONNE"=>123, "NOM"=>"Gotlieb", "PRENOM"=> "Marcel", "VILLE"=> "Angers")
    //        $TblDonnees[1]=array("IDPERSONNE"=>345, "NOM"=>"Gocinny", "PRENOM"=> "René", "VILLE"=> "Paris")
    //        $aAttributs=array("IDPERSONNE")
    //        TblToXML($DocXml,$sRacine,"Personne",$TblDonnees,$aAttributs)
    //    Résultat :
    //        <Personne IDPERSONNE='123'>
    //            <UserData NOMCHAMP='NOM'>Gotlieb</UserData>
    //            <UserData NOMCHAMP='PRENOM'>Marcel</UserData>
    //            <UserData NOMCHAMP='VILLE'>Angers</UserData>
    //        </Personne>
    //        <Personne IDPERSONNE='345'>
    //            <UserData NOMCHAMP='NOM'>Gocinny</UserData>
    //            <UserData NOMCHAMP='PRENOM'>René</UserData>
    //            <UserData NOMCHAMP='VILLE'>Paris</UserData>
    //        </Personne>
    //
    //    Cas particulier :
    //    -----------------
    //    On peut ajouter le paramètres $Valeur pour spécifier le nom d'un champ qui servira de valeur
    //    du noeud, mais dans ce cas, le noeud ne devra pas avoir de UserData
    //    Ex. : Les libellés des formulaires
    //        $aAttributs=array("IDLIBELLE")
    //        TblToXML($DocXml,$sRacine,"Libelle",$TblLibelle,$aAttributs,"LIBELLE")
    //    Résultat :
    //        <Libelle IDLIBELLE='BLABLA'>Texte du libellé BLABLA</LIBELLE>
    //---------------------------------------------------------------------------------

    public function ChargePanier($IdFormulaire, $NomChamp, $IdPanier)
    {
        $TblPanier = $this->QryToArray("SELECT IdPanier, NomPanier FROM Panier WHERE IdPanier=" . $IdPanier);
        if (count($TblPanier) > 0) {
            //---- Test l'existence de la variable PANIER
            if (!isset($_SESSION[$_SESSION['AppName']]["PANIER"])) {
                $_SESSION[$_SESSION['AppName']]["PANIER"] = array();
            }

            //---- Test l'existence du tableau correspondant au formulaire
            $PanierForm = "Form" . $IdFormulaire;
            if (!isset($_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm])) {
                $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm] = array();
            }

            $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp] = array("IDPANIER" => $IdPanier, "NOMPANIER" => $TblPanier[0]["NOMPANIER"], "LSTID" => array());

            //---- Et maintenant, on rempli les Id
            $TblPanierDet = $this->QryToArray("SELECT Identifiant FROM Panier_Det WHERE IdPanier=" . $IdPanier);
            for ($IndIdent = 0; $IndIdent < count($TblPanierDet); $IndIdent++) {
                $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["LSTID"][] = $TblPanierDet[$IndIdent]["IDENTIFIANT"];
            }
        }
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : TblToExtJS
     * Type : Méthode de la classe GestBdd
     * Créée par : Dblv
     * Le : 25/04/12 11:45
     * Paramètres : $DocXml : Objet PHP représentant le document XML
     *                 $oRacine : Objet PHP représentant la racine du document
     *                 $sNomNoeud : Nom du noeud correspondant à l'enreg.
     *                 $aDonnees : Tableau contenant les données
     *                 $NomId : Nom de la colonne qui servira d'identifiant
     * Description :
     * Comme TblToXML ou TblToGrid mais formaté pour les Grid de ExtJS
     * ----------------------------------------------------------------------------------- */

    public function AjoutPanier($IdFormulaire, $NomChamp, $IdPanier, $LstId)
    {
        //---- Test l'existence de la variable PANIER
        if (!isset($_SESSION[$_SESSION['AppName']]["PANIER"])) {
            $_SESSION[$_SESSION['AppName']]["PANIER"] = array();
        }

        //---- Test l'existence du tableau correspondant au formulaire
        $PanierForm = "Form" . $IdFormulaire;
        if (!isset($_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm])) {
            $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm] = array();
        }

        //---- Test l'existence du tableau correspondant au champ du formulaire
        if (!isset($_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp])) {
            $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp] = array("IDPANIER" => $IdPanier, "NOMPANIER" => "", "LSTID" => array());
        }

        $TblId = explode(",", $LstId);

        for ($IndId = 0; $IndId < count($TblId); $IndId++) {
            if (!in_array($TblId[$IndId], $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["LSTID"])) {
                //---- Si l'Id n'était pas déjà dans le panier, on le rajoute
                $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["LSTID"][] = $TblId[$IndId];

                //---- ...et si on est dans un panier enregistré, il faut le mettre à jour
                if (intval($_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["IDPANIER"]) > 0) {
                    $Requete = "INSERT INTO Panier_Det (IdPanier, Identifiant) VALUES (" . $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["IDPANIER"] . ", " . $TblId[$IndId] . ")";
                    $this->QryExec($Requete);
                    //$this->QryExec("INSERT INTO Panier_Det (IdPanier, Identifiant) VALUES (".$_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["IDPANIER"].", ".$TblId[$IndId].")");
                }
            }
        }
    }

    public function InfosPanier($IdFormulaire, $NomChamp)
    {
        $TblInfosPanier = array();
        $PanierForm = "Form" . $IdFormulaire;

        $TblInfosPanier[0] = array("IDPANIER" => 0, "NOMPANIER" => "", "NBREELEMT" => 0);

        if (isset($_SESSION[$_SESSION['AppName']]["PANIER"])) {
            if (isset($_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm])) {
                if (isset($_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp])) {
                    $TblInfosPanier[0] = array(
                        "IDPANIER" => $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["IDPANIER"],
                        "NOMPANIER" => $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["NOMPANIER"],
                        "NBREELEMT" => count($_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["LSTID"]),
                    );
                }
            }
        }

        return $TblInfosPanier;
    }

    //--------------------------------------------------------------------------
    // Equivalent de TblToXML mais adapté aux objets grille de DHTMLX
    // Tous les enregistrements sont dans un noeud nommé "row" qui n'a qu'un
    // attribut "id" qui contient l'identifiant de l'enreg. ou un n° de ligne
    // en l'absence d'identifiant
    // Les champs sont dans un noeud de "row" qui s'appelle "cell" et qui a un
    // attribut "NOMCHAMP"
    // Les champs supplémentaires (qui ne s'afficheront pas dans la grille) sont
    // stockés dans les noeuds "userdata" après les "cell". Chaque userdata
    // possède un attribut "name" dans lequel on trouve le nom du champ
    //--------------------------------------------------------------------------
    // Il faut impérativement conserver cette structure pour que les grilles
    // DHTMLX fonctionnent
    //--------------------------------------------------------------------------

    public function AbandonPanier($IdFormulaire, $NomChamp)
    {
        $PanierForm = "Form" . $IdFormulaire;

        unset($_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]);
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : TblToAgenda
     * Type : Méthode de la classe GestBdd
     * Créée par : Marine
     * Le : 21/11/11 14:27
     * Paramètres :
     *
     * Description :
     * ----------------------------------------------------------------------------------- */

    public function AjoutItemVide($aListeOrig)
    {
        $aListeRetour = array();

        //---- Ajoute une ligne vide au début du tableau
        if (count($aListeOrig) > 0) {
            $aKeys = array_keys($aListeOrig[0]);
            $aItemVide = array();

            for ($IndKey = 0; $IndKey < count($aKeys); $IndKey++) {
                $sVal = " ";

                if ($IndKey < 1) {
                    $sVal = "0";
                }

                $aItemVide[0][$aKeys[$IndKey]] = $sVal;
            }

            $aListeRetour = array_merge($aItemVide, $aListeOrig);
        } else {
            $aListeRetour = $aListeOrig;
        }

        return $aListeRetour;
    }

    public function TblToXML($DocXml, $sRacine, $NomNoeud, $TblDonnees, $TblAttr = array(), $Valeur = "", $Niveau = 0)
    {
        //---- On parcours le recordset
        for ($IndDon = 0; $IndDon < count($TblDonnees); $IndDon++) {
            //---- On répartit les colonnes entre $aAttributs et $TblUsrDat
            //---- (Sur chaque ligne puisqu'il peut y avoir un champ supplémentaire sur certains enreg.)
            //        Ex. : Une option de menu peut avoir des sous-options ou non
            $TblUsrDat = array();
            $aAttributs = array();
            $ValNoeud = "";
            for (reset($TblDonnees[$IndDon]); $NomChm = key($TblDonnees[$IndDon]); next($TblDonnees[$IndDon])) {
                if (is_array($TblDonnees[$IndDon][$NomChm])) {
                    //---- Si le champ est de type tableau : pas le choix c'est un UserData
                    $TblUsrDat[] = $NomChm;
                } else {
                    //---- Si c'est un champ 'classique', on le range ou il faut
                    if ($NomChm == $Valeur) {
                        $ValNoeud = $TblDonnees[$IndDon][$NomChm];
                    } else {
                        if (in_array($NomChm, $TblAttr)) {
                            //---- Attibut
                            $aAttributs[$NomChm] = rawurlencode($TblDonnees[$IndDon][$NomChm]);
                        } else {
                            //---- UserData
                            $TblUsrDat[] = $NomChm;
                        }
                    }
                }
            }

            //---- Création du noeud
            $Noeud = $this->AjoutNoeud($DocXml, $NomNoeud, $aAttributs, $ValNoeud);

            //---- Ajout des UserData (d'abord, les champs simples)
            for ($IndUsd = 0; $IndUsd < count($TblUsrDat); $IndUsd++) {
                $NomChm = $TblUsrDat[$IndUsd];

                if (!is_array($TblDonnees[$IndDon][$NomChm])) {
                    $ValChamp = $TblDonnees[$IndDon][$NomChm];
                    $ValChamp = $this->Encode($ValChamp);

                    $TblAttUsd = array("NOMCHAMP" => rawurlencode($NomChm));
                    $NomUsd = "UserData";
                    if ($Niveau > 0) {
                        $NomUsd .= $Niveau;
                    }
                    $UserData = $this->AjoutNoeud($DocXml, $NomUsd, $TblAttUsd);
                    $ValNoeud = $DocXml->createTextNode($ValChamp);
                    $UserData->appendChild($ValNoeud);

                    //---- Ajout du noeud UserData au noeud $Noeud
                    $Noeud->appendChild($UserData);
                }
            }

            //---- Ajout des UserData (ensuite, les tableaux -noeuds enfants-)
            for ($IndUsd = 0; $IndUsd < count($TblUsrDat); $IndUsd++) {
                $NomChm = $TblUsrDat[$IndUsd];

                if (is_array($TblDonnees[$IndDon][$NomChm])) {
                    $this->TblToXML($DocXml, $Noeud, $NomChm, $TblDonnees[$IndDon][$NomChm], array(), "", $Niveau + 1);
                }
            }

            //---- Ajout du nouveau noeud au noeud d'origine
            $sRacine->appendChild($Noeud);
        }
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : AjoutNoeud
     * Type : Méthode de la classe GestBdd
     * ----------------------------------------------------------------------------------- */

    public function AjoutNoeud($DocXml, $NomNoeud, $TblAttr = array(), $Valeur = "")
    {
        if ($Valeur != "") {
            $Noeud = $DocXml->createElement($NomNoeud, $Valeur);
        } else {
            $Noeud = $DocXml->createElement($NomNoeud);
        }

        for (reset($TblAttr); $NomAttr = key($TblAttr); next($TblAttr)) {
            $Attrib = $DocXml->createAttribute($NomAttr);
            //---- Valeur de l'attribut qui vient d'être ajouté
            $ValAttr = $DocXml->createTextNode($TblAttr[$NomAttr]);
            $Attrib->appendChild($ValAttr);

            //---- Ajout de l'attribut au noeud
            $Noeud->appendChild($Attrib);
        }

        return $Noeud;
    }

    public function Encode($Str)
    {
        $initialEncoding = mb_detect_encoding($Str);

        if ($initialEncoding != "UTF-8") {
            $Str = mb_convert_encoding($Str, 'UTF-8');
            //$Str=iconv("ISO-8859-1","UTF-8",$Str);
        }

        return $Str; //htmlentities($Str, ENT_QUOTES,'UTF-8');
    }

    public function TblToExtJS($oDocXml, $oRacine, $sNomNoeud, $aDonnees, $sNomId, $aTotaux = array("TotEnreg" => 0, "TotPage" => 0))
    {
        if ($aTotaux["TotEnreg"] < 1) {
            $aTotaux["TotEnreg"] = count($aDonnees);
        }
        if ($aTotaux["TotPage"] < 1) {
            $aTotaux["TotPage"] = 1;
        }

        //---- Ajout du noeud "TotalResults"
        $oNoeud = $this->AjoutNoeud($oDocXml, "TotalResults");
        $oValNoeud = $oDocXml->createTextNode($aTotaux["TotEnreg"]);
        $oNoeud->appendChild($oValNoeud);
        $oRacine->appendChild($oNoeud);

        //---- Ajout du noeud "TotalPages"
        $oNoeud = $this->AjoutNoeud($oDocXml, "TotalPages");
        $oValNoeud = $oDocXml->createTextNode($aTotaux["TotPage"]);
        $oNoeud->appendChild($oValNoeud);
        $oRacine->appendChild($oNoeud);

        /*
        if (count($aDonnees) > 0) {
        $this->TblToExtJs($oDocXml, $oRacine, "Item", $aDonnees, $sNomId);
        //$Bdd->TblToGridExt($Xml, $sRacine, $TblListe, $IdLigne, $aUserData);
        }
         */

        //---- On parcours le recordset
        for ($IndDon = 0; $IndDon < count($aDonnees); $IndDon++) {
            //---- Création du noeud qui va contenir l'enreg.
            $oNoeudEnreg = $this->AjoutNoeud($oDocXml, $sNomNoeud);

            //---- Ajout d'un noeud pour le champ ID
            $oNoeudId = $this->AjoutNoeud($oDocXml, $sNomId);
            $ValNoeud = $oDocXml->createTextNode($aDonnees[$IndDon][$sNomId]);
            $oNoeudId->appendChild($ValNoeud);

            //---- Ajout du noeud $oNoeudId au noeud $oNoeudEnreg
            $oNoeudEnreg->appendChild($oNoeudId);

            //---- Création du noeud qui va contenir les autres champs de l'enreg.
            $oNoeudChamps = $this->AjoutNoeud($oDocXml, "ItemAttributes");

            //---- On parcours les autres champs de l'enreg.
            for (reset($aDonnees[$IndDon]); $NomChm = key($aDonnees[$IndDon]); next($aDonnees[$IndDon])) {
                if ($NomChm != $sNomId) {
                    $oNoeudChamp = $this->AjoutNoeud($oDocXml, $NomChm);
                    $ValNoeud = $oDocXml->createTextNode($aDonnees[$IndDon][$NomChm]);
                    $oNoeudChamp->appendChild($ValNoeud);

                    //---- Ajout du noeud $oNoeudChamp au noeud $oNoeudChamps
                    $oNoeudChamps->appendChild($oNoeudChamp);
                }
            }

            //---- Ajout du noeud $oNoeudChamps au noeud $oNoeudEnreg
            $oNoeudEnreg->appendChild($oNoeudChamps);

            //---- Ajout du nouveau noeud au noeud d'origine
            $oRacine->appendChild($oNoeudEnreg);
        }
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : CreeRacine
     * Type : Méthode de l'objet Bdd
     * Créée par : Dblv
     * Le : 09/12/11 16:28
     * Paramètres :    - $Xml (référence à l'objet XML)
     *                 - $NomRacine (Nom de la racine=
     *                 - $Attribut (Nom de l'attribut
     *                 - $Valeur (Valeur de l'attribut)
     * Description :
     *
     * ----------------------------------------------------------------------------------
     * Révisions
     * AAAA
     * JJ/MM :
     * -------------------------------------------------------------------------------- */

    public function TblToChart($DocXml, $sRacine, $NomNoeud, $TblDonnees)
    {
        //---- On parcours le recordset
        for ($IndDon = 0; $IndDon < count($TblDonnees); $IndDon++) {
            $ValNoeud = "";
            for (reset($TblDonnees[$IndDon]); $NomChm = key($TblDonnees[$IndDon]); next($TblDonnees[$IndDon])) {
                $ValNoeud = $TblDonnees[$IndDon];

                //---- Création du noeud item
                $NoeudItem = $this->AjoutNoeud($DocXml, 'item', "");
                $sRacine->appendChild($NoeudItem);
                //---- Création du noeud valeur
                $NoeudValeur = $this->AjoutNoeud($DocXml, "Valeur", $ValNoeud);
                //---- Ajout de noeud valeur au noeud item
                $NoeudItem->appendChild($NoeudValeur);
            }
        }
    }

    public function TblToGrid($DocXml, $sRacine, $TblDonnees, $NomId, $aUserData = array())
    {
        $IdNull = 1;
        //---- On parcours le recordset
        for ($IndDon = 0; $IndDon < count($TblDonnees); $IndDon++) {
            //---- On répartit les colonnes entre $aAttributs et $TblUsrDat
            //---- (Sur chaque ligne puisqu'il peut y avoir un champ supplémentaire sur certains enreg.)
            //        Ex. : Une option de menu peut avoir des sous-options ou non
            $TblUsrDat = array();
            $TblCell = array();
            for (reset($TblDonnees[$IndDon]); $NomChm = key($TblDonnees[$IndDon]); next($TblDonnees[$IndDon])) {
                if ($NomChm != $NomId) {
                    if (in_array($NomChm, $aUserData)) {
                        //---- UserData
                        $TblUsrDat[] = $NomChm;
                    } else {
                        //---- Cell
                        $TblCell[] = $NomChm;
                    }
                }
            }

            //---- Création du noeud
            $Ident = "";
            switch ($NomId) {
                case "__NoLigne":
                    $Ident = $IndDon;
                    break;

                case "":
                    $Ident = "NULL" . $IdNull;
                    $IdNull++;
                    break;

                default:
                    $Ident = $TblDonnees[$IndDon][$NomId];
                    break;
            }

            $Noeud = $this->AjoutNoeud($DocXml, "row", array("id" => $Ident));

            //---- Ajout des champs (cell)
            for ($IndCel = 0; $IndCel < count($TblCell); $IndCel++) {
                $NomChm = $TblCell[$IndCel];
                $ValChamp = $TblDonnees[$IndDon][$NomChm];
                $ValChamp = $this->Encode($ValChamp);

                /*
                $initialEncoding = mb_detect_encoding($ValChamp);
                if( $initialEncoding != "UTF-8" ) {
                $ValChamp=htmlentities($ValChamp, ENT_QUOTES);    //$ValChamp;
                } else {
                $ValChamp=htmlentities($ValChamp, ENT_QUOTES,"UTF-8");    //utf8_encode($ValChamp);
                }
                 */

                $Cell = $this->AjoutNoeud($DocXml, "cell", array("NOMCHAMP" => $NomChm));
                $ValNoeud = $DocXml->createTextNode($ValChamp);
                $Cell->appendChild($ValNoeud);

                //---- Ajout du noeud UserData au noeud $Noeud
                $Noeud->appendChild($Cell);
            }

            //---- Ajout des userdata
            for ($IndUsd = 0; $IndUsd < count($TblUsrDat); $IndUsd++) {
                $NomChm = $TblUsrDat[$IndUsd];
                $ValChamp = $TblDonnees[$IndDon][$NomChm];
                $ValChamp = $this->Encode($ValChamp);

                /*
                $initialEncoding = mb_detect_encoding($ValChamp);
                if( $initialEncoding != "UTF-8" ) {
                $ValChamp=htmlentities($ValChamp, ENT_QUOTES);    //$ValChamp;
                } else {
                $ValChamp=htmlentities($ValChamp, ENT_QUOTES,"UTF-8");    //utf8_encode($ValChamp);
                }
                 */
                /*
                if( $initialEncoding != "UTF-8" ) {
                $ValChamp= $ValChamp;
                } else {
                $ValChamp= utf8_encode($ValChamp);
                }
                 */
                /*
                $initialEncoding = mb_detect_encoding($ValChamp);
                if( $initialEncoding != "UTF-8" ) {
                $ValChamp= utf8_encode($ValChamp);
                }
                $ValChamp=htmlentities($ValChamp, ENT_QUOTES);
                 */

                $UserData = $this->AjoutNoeud($DocXml, "userdata", array("name" => $NomChm));
                $ValNoeud = $DocXml->createTextNode($ValChamp);
                $UserData->appendChild($ValNoeud);

                //---- Ajout du noeud UserData au noeud $Noeud
                $Noeud->appendChild($UserData);
            }

            //---- Ajout du nouveau noeud au noeud d'origine
            $sRacine->appendChild($Noeud);
        }
    }

    public function TblToAgenda($DocXml, $sRacine, $TblDonnees, $NomId)
    {
        //---- On parcours le recordset
        for ($IndDon = 0; $IndDon < count($TblDonnees); $IndDon++) {
            for (reset($TblDonnees[$IndDon]); $NomChm = key($TblDonnees[$IndDon]); next($TblDonnees[$IndDon])) {
                //$this->Espion($NomChm . " " . $TblDonnees[$IndDon][$NomChm]);
                //---- Création du noeud
                $NoeudEvent = $this->AjoutNoeud($DocXml, 'event', array('id' => $TblDonnees[$IndDon]['IDACTIVITE'])); //<event id=''> 1er niveau
                //------------- Deuxieme ligne ------------------//
                $StartDate = $this->AjoutNoeud($DocXml, "start_date"); // deuxieme niveau
                $ValStartDate = $DocXml->createTextNode(substr($this->FormatSql($TblDonnees[$IndDon]['ACTIVITEDU'], 'DISO'), 1, 10) . " " . $TblDonnees[$IndDon]['HEUREDESAISIE']);
                $StartDate->appendChild($ValStartDate);

                $NoeudEvent->appendChild($StartDate); // Ajout de startdate a event
                //------------ Troisieme ligne ---------------//
                $EndDate = $this->AjoutNoeud($DocXml, "end_date"); // deuxieme niveau
                $ValEndDate = $DocXml->createTextNode(substr($this->FormatSql($TblDonnees[$IndDon]['ACTIVITEDU'], 'DISO'), 1, 10) . " " . $TblDonnees[$IndDon]['FINI'] . ':00');
                $EndDate->appendChild($ValEndDate);

                $NoeudEvent->appendChild($EndDate); // Ajout de enddate a event
                //-------------- Quatrieme ligne -------------------//
                $Text = $this->AjoutNoeud($DocXml, "text"); // deuxieme niveau
                $ValText = $DocXml->createTextNode($TblDonnees[$IndDon]['DETAILTRAIT']);
                $Text->appendChild($ValText);

                $NoeudEvent->appendChild($Text); // Ajout de text a event
                //----------------- Cinquieme ligne ------------------//
                $Details = $this->AjoutNoeud($DocXml, "details"); // deuxieme niveau
                $ValDetails = $DocXml->createTextNode($TblDonnees[$IndDon]['CATEGORIE']);
                $Details->appendChild($ValDetails);

                $NoeudEvent->appendChild($Details); // Ajout de details a event
            }
            $sRacine->appendChild($NoeudEvent);
        }
    }

    public function TblDdiToGantt($DocXml, $sRacine, $TblDonnees, $aProjet, $aTache)
    {
        $IdProjet = -1;
        $NoeudProjet = "";

        for ($IndDon = 0; $IndDon < count($TblDonnees); $IndDon++) {
            $NomId = $aProjet["ID"];

            if (intval($TblDonnees[$IndDon][$NomId]) != $IdProjet) {
                if ($IdProjet > -1) {
                    $sRacine->appendChild($NoeudProjet);
                }

                $NoeudProjet = $this->AjoutNoeud($DocXml, 'project', array('id' => $IndDon, 'name' => $TblDonnees[$IndDon][$aProjet["NAME"]], 'startdate' => $this->FormatSql($TblDonnees[$IndDon][$aProjet["STARTDATE"]], "DISOG"))); //<project id='' name='' startdate=''> 2eme niveau
                $IdProjet = $TblDonnees[$IndDon][$aProjet["ID"]];
            }

            //----  Creation du noeud Task
            $NoeudTask = $this->AjoutNoeud($DocXml, 'task', array('id' => $TblDonnees[$IndDon][$aTache["ID"]])); /* <task id=''> 3eme niveau */
            $NoeudProjet->appendChild($NoeudTask);

            //------------- Premiere ligne ------------------//
            $Name = $this->AjoutNoeud($DocXml, "name"); //
            $ValName = $DocXml->createTextNode($TblDonnees[$IndDon]["REALISEPAR"] . " | " . $TblDonnees[$IndDon][$aTache["ID"]] . " - " . $TblDonnees[$IndDon][$aTache["NAME"]]);
            $Name->appendChild($ValName);

            $NoeudTask->appendChild($Name); // Ajout de name a task
            //------------ Deuxieme ligne ---------------//
            $Est = $this->AjoutNoeud($DocXml, "est");
            $ValEst = $DocXml->createTextNode($this->FormatSql($TblDonnees[$IndDon][$aTache["STARTDATE"]], "DISOG"));
            $Est->appendChild($ValEst);

            $NoeudTask->appendChild($Est); // Ajout de est (date de debut) a task
            //---- calcul des tempsprevu en Heure ----//
            $Heures = 0;
            $Percent = 0;

            if ($TblDonnees[$IndDon]['TEMPSPREVU'] != 'NULL') {
                switch ($TblDonnees[$IndDon]['IDUNITETEMPS']) {
                    case "1": //déja en heure
                        $Heures = explode(".", $TblDonnees[$IndDon]['TEMPSPREVU']);
                        break;
                    case "2": //jour (8heures)
                        $Heures = explode(".", $TblDonnees[$IndDon]['TEMPSPREVU'] * 8);
                        break;
                    case "3": //semaine (40heures)
                        $Heures = explode(".", $TblDonnees[$IndDon]['TEMPSPREVU'] * 40);
                        break;
                }

                //---- calcul du % de realisation d'une ddi ----//
                if ($TblDonnees[$IndDon]["TMPSPASSE"] == 0) {
                    $Percent = 0;
                }
                if ($TblDonnees[$IndDon]["TMPSPASSE"] < $Heures[0] * 60) {
                    //---- % ----//
                    $Percent = ceil(($TblDonnees[$IndDon]["TMPSPASSE"] / ($Heures[0] * 60)) * 100);
                } else {
                    $Percent = 100;
                }
            }
            //-------------- Troisieme ligne -------------------//
            $Duration = $this->AjoutNoeud($DocXml, "duration");
            $ValDuration = $DocXml->createTextNode(($Heures[0] == "" ? "8" : $Heures[0]));
            $Duration->appendChild($ValDuration);

            $NoeudTask->appendChild($Duration); // Ajout de duration a task
            //----------------- Quatrieme ligne ------------------//
            $PercentCompleted = $this->AjoutNoeud($DocXml, "percentcompleted");
            $ValPercent = $DocXml->createTextNode($Percent);
            $PercentCompleted->appendChild($ValPercent);

            $NoeudTask->appendChild($PercentCompleted); // Ajout de pourcentages a task
            //----------------- Cinquieme ligne ------------------//

            $PredecessorTasks = $this->AjoutNoeud($DocXml, "predecessortasks");
            $ValPrede = $DocXml->createTextNode("");
            $PredecessorTasks->appendChild($ValPrede);

            $NoeudTask->appendChild($PredecessorTasks); // Ajout de predecessortasks a task
            //----------------- Sixieme ligne ------------------//
            $ChildTasks = $this->AjoutNoeud($DocXml, "childtasks");
            if ($aProjet["ID"] != 0) {
                $ChilTask = $aTache["ID"];
            } else {
                $ChilTask = "";
            }
            $ValChild = $DocXml->createTextNode($ChilTask);
            $ChildTasks->appendChild($ValChild);

            $NoeudTask->appendChild($ChildTasks); // Ajout de predecessortasks a task
        }
        $sRacine->appendChild($NoeudProjet);
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : TblToCsv
     * Type : Méthode de la classe Bdd
     * Créée par : Dblv
     * Description :
     *
     * ----------------------------------------------------------------------------------
     * Révisions
     * AAAA
     * JJ/MM :
     * -------------------------------------------------------------------------------- */

    public function TblToCsv($FichierExport, $TblDonnees, $TblLibelle = array())
    {
        $sChemin = $this->RepExport() . $this->Fichier($FichierExport);

        $hFicExport = fopen($sChemin, "w+");

        if ($hFicExport) {
            for ($IndDon = 0; $IndDon < count($TblDonnees); $IndDon++) {
                if ($IndDon == 0) {
                    $sLigne = "";
                    for (reset($TblDonnees[$IndDon]); $NomChm = key($TblDonnees[$IndDon]); next($TblDonnees[$IndDon])) {
                        if ($sLigne != "") {
                            $sLigne .= chr(9); //tabulation
                        }
                        if (isset($TblLibelle[$NomChm])) {
                            $sLigne .= $TblLibelle[$NomChm];
                        } else {
                            $sLigne .= $NomChm;
                        }
                    }
                    fputs($hFicExport, $sLigne . chr(13) . chr(10));
                }
                $sLigne = "";
                for (reset($TblDonnees[$IndDon]); $NomChm = key($TblDonnees[$IndDon]); next($TblDonnees[$IndDon])) {
                    if ($sLigne != "") {
                        $sLigne .= chr(9); //tabulation
                    }
                    $sLigne .= $TblDonnees[$IndDon][$NomChm];
                }
                fputs($hFicExport, $sLigne . chr(13) . chr(10));
            }

            fclose($hFicExport);
        } else {
            $this->Erreur("Impossible d'ouvrir le fichier " . $sChemin . " : " . $hFicExport);
        }
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : Erreur
     * Type : Méthode de la classe Bdd
     * Créée par : Dblv
     * Le : 06/06/11 10:23
     * Paramètres : $Chaine (message d'erreur)
     * Description :
     * Ecrit un message d'erreur dans un fichier de log
     * ----------------------------------------------------------------------------------
     * Révisions
     * AAAA
     * JJ/MM :
     * -------------------------------------------------------------------------------- */

    public function RepExport()
    {
        //$this->Erreur("Exp. sess. \n" . var_export($_SESSION[$_SESSION['AppName']]["PARAMETRES"],true));
        $sChemin = $_SESSION[$_SESSION['AppName']]["PARAMETRES"]["export"]["repertoire"] . "/";

        if (stristr(PHP_OS, "win")) {
            $sChemin = str_replace("/", "\\", $sChemin);
        }

        return $sChemin;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction :
     * Type : Méthode de la classe Bdd
     * Créée par : Dblv
     * Le :
     * Paramètres : $sFichier
     * Description :
     * Nettoie une chaine contenant un nom de fichier
     * ----------------------------------------------------------------------------------
     * Révisions
     * AAAA
     * JJ/MM :
     * -------------------------------------------------------------------------------- */

    public function Fichier($sFichier)
    {
        $sFichier = str_replace("/", "-", $sFichier);
        $sFichier = str_replace(":", "-", $sFichier);
        $sFichier = str_replace("\\", "-", $sFichier);
        return $sFichier;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : TblToTree
     * Type : Méthode de la classe Bdd
     * Créée par : Dblv
     * Le : 02/07/12 09:44
     * Description :
     * ----------------------------------------------------------------------------------
     * Révisions
     * AAAA
     * JJ/MM :
     * -------------------------------------------------------------------------------- */

    public function TblToTree($DocXml, $sRacine, $TblDonnees, $NomLibelle, $Ident = "0", $Niveau = 1)
    {
        $IdentItem = "";

        //---- On parcours le recordset
        for ($IndDon = 0; $IndDon < count($TblDonnees); $IndDon++) {
            //---- On répartit les colonnes entre $aAttributs et $TblUsrDat
            //---- (Sur chaque ligne puisqu'il peut y avoir un champ supplémentaire sur certains enreg.)
            //        Ex. : Une option de menu peut avoir des sous-options ou non
            $TblUsrDat = array();
            $TblCell = array();
            for (reset($TblDonnees[$IndDon]); $NomChm = key($TblDonnees[$IndDon]); next($TblDonnees[$IndDon])) {
                if ($NomChm != $NomLibelle) {
                    //---- UserData
                    $TblUsrDat[] = $NomChm;
                }
            }

            $IdentItem = $Ident . "_" . $IndDon;
            $Noeud = $this->AjoutNoeud($DocXml, "item", array("child" => $Niveau, "id" => $IdentItem, "text" => $TblDonnees[$IndDon][$NomLibelle]));

            //---- Ajout des userdata
            for ($IndUsd = 0; $IndUsd < count($TblUsrDat); $IndUsd++) {
                $NomChm = $TblUsrDat[$IndUsd];
                if (!is_array($TblDonnees[$IndDon][$NomChm])) {
                    $ValChamp = $TblDonnees[$IndDon][$NomChm];

                    $initialEncoding = mb_detect_encoding($ValChamp);
                    if ($initialEncoding != "UTF-8") {
                        $ValChamp = $ValChamp;
                    } else {
                        $ValChamp = mb_convert_encoding($ValChamp, 'UTF-8');
                    }

                    $UserData = $this->AjoutNoeud($DocXml, "userdata", array("name" => $NomChm));
                    $ValNoeud = $DocXml->createTextNode($ValChamp);
                    $UserData->appendChild($ValNoeud);

                    //---- Ajout du noeud UserData au noeud $Noeud
                    $Noeud->appendChild($UserData);
                }
            }

            //---- Ajout des UserData (ensuite, les tableaux -noeuds enfants-)
            for ($IndUsd = 0; $IndUsd < count($TblUsrDat); $IndUsd++) {
                $NomChm = $TblUsrDat[$IndUsd];

                if (is_array($TblDonnees[$IndDon][$NomChm])) {
                    $this->TblToTree($DocXml, $Noeud, $TblDonnees[$IndDon][$NomChm], $NomLibelle, $IdentItem, $Niveau + 1);
                }
            }

            //---- Ajout du nouveau noeud au noeud d'origine
            $sRacine->appendChild($Noeud);
        }
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : QryToArray
     * Type : Méthode de la classe Bdd
     * Créée par : Dblv
     * Le :
     * Paramètres : $Requete (requête SQL)
     * Description :
     * Execute une requête (SELECT) et retourne le résultat sous forme d'un tableau
     * ----------------------------------------------------------------------------------
     * Révisions
     * AAAA
     * JJ/MM :
     * -------------------------------------------------------------------------------- */

    public function TblToMenu($DocXml, $sRacine, $TblDonnees, $NomLibelle, $Ident = "0", $Niveau = 1)
    {
        $IdentItem = "";

        /* ---- On parcours le recordset */
        for ($IndDon = 0; $IndDon < count($TblDonnees); $IndDon++) {
            //---- On répartit les colonnes entre $aAttributs et $TblUsrDat
            //---- (Sur chaque ligne puisqu'il peut y avoir un champ supplémentaire sur certains enreg.)
            //        Ex. : Une option de menu peut avoir des sous-options ou non
            $TblUsrDat = array();
            $TblCell = array();
            for (reset($TblDonnees[$IndDon]); $NomChm = key($TblDonnees[$IndDon]); next($TblDonnees[$IndDon])) {
                if ($NomChm != $NomLibelle) {
                    //---- UserData
                    $TblUsrDat[] = $NomChm;
                }
            }

            $IdentItem = $Ident . "_" . $IndDon;
            $ItemActif = "true";

            if (!$this->ForcerDroit) {
                //---- Si les droits ne sont pas forcés, on test si l'item est actif ou non
                if (intval($TblDonnees[$IndDon]["DROITS"]) == 0) {
                    $ItemActif = "false";
                }

                if (intval($TblDonnees[$IndDon]["NBREENFANTS"]) == 0) {
                    if ($TblDonnees[$IndDon]["ACTIONMENU"] == "") {
                        $ItemActif = "false";
                    }
                }
            }

            $aAttributsNoeud = array(
                "id" => $IdentItem,
                "enabled" => $ItemActif,
            );
            $Noeud = $this->AjoutNoeud($DocXml, "item", $aAttributsNoeud);

            //---- Ajout des userdata
            $Separateur = false;
            for ($IndUsd = 0; $IndUsd < count($TblUsrDat); $IndUsd++) {
                $NomChm = $TblUsrDat[$IndUsd];

                if (!is_array($TblDonnees[$IndDon][$NomChm])) {
                    $ValChamp = $TblDonnees[$IndDon][$NomChm];
                    $ValChamp = $this->Encode($ValChamp);

                    if ($NomChm == "SEPAPRES") {
                        $Separateur = (intval($ValChamp) == 1);
                    }

                    /*
                    $initialEncoding = mb_detect_encoding($ValChamp);
                    if( $initialEncoding != "UTF-8" ) {
                    $ValChamp= utf8_encode($ValChamp);
                    }
                    $ValChamp=htmlentities($ValChamp, ENT_QUOTES);
                     */

                    $NomNoeud = "userdata";
                    if ($NomChm == "TITRE") {
                        $NomNoeud = "itemtext";
                    }

                    $UserData = $this->AjoutNoeud($DocXml, $NomNoeud, array("name" => $NomChm));
                    $ValNoeud = $DocXml->createTextNode($ValChamp);
                    $UserData->appendChild($ValNoeud);

                    //---- Ajout du noeud UserData au noeud $Noeud
                    $Noeud->appendChild($UserData);
                }
            }

            //---- Ajout des noeuds enfants
            for ($IndUsd = 0; $IndUsd < count($TblUsrDat); $IndUsd++) {
                $NomChm = $TblUsrDat[$IndUsd];

                if (is_array($TblDonnees[$IndDon][$NomChm])) {
                    $this->TblToMenu($DocXml, $Noeud, $TblDonnees[$IndDon][$NomChm], $NomLibelle, $IdentItem, $Niveau + 1);
                }
            }

            //---- Ajout du nouveau noeud au noeud d'origine
            $sRacine->appendChild($Noeud);

            if ($Separateur) {
                $NoeudSep = $this->AjoutNoeud($DocXml, "item", array("id" => "Sep_" . $IdentItem, "type" => "separator"));
                $sRacine->appendChild($NoeudSep);
            }
        }
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : CreeRacine
     * Type : Méthode de la classe GestBdd
     * Créée par : Dblv
     * Le : 11/10/12 13:58
     * Paramètres :
     *
     * Description :
     *
     * ----------------------------------------------------------------------------------- */

    public function CreeRacine($Xml, $NomRacine, $Attribut = "", $Valeur = "")
    {
        $sRacine = $Xml->createElement($NomRacine);

        if ($Attribut != "") {
            $oAttribut = $Xml->createAttribute($Attribut);
            $oAttribut->value = $Valeur;
            $sRacine->appendChild($oAttribut);
        }

        $Xml->appendChild($sRacine);

        return $sRacine;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : ColToTbl
     * Type : Méthode de la classe GestBdd
     * Créée par : Dblv
     * Le : 13/09/13 16:17
     * Paramètres : $aColumn ($Tableau contenant les colonnes à réunir)
     * Description :
     * Retourne un tableau à deux dimensions contenant n lignes avec pour chaque ligne
     * les colonne qui se trouvent dans $aColumn
     * ----------------------------------------------------------------------------------- */

    public function StockeDonnees($NomTable4D, $NomChmIdent, $ValIdent, $TblNomChampsMaj, $TblValChampsMaj)
    {
        $UtilCourant = $_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["login"];
        $Repertoire = $_SESSION[$_SESSION['AppName']]["PARAMETRES"]["soap"]["repstock"];
        $NomFic = "../../" . $Repertoire . "/" . $UtilCourant . "_" . mktime() . ".xml";

        $Xml = new DOMDocument('1.0', 'UTF-8');
        $Xml->formatOutput = true;
        $sRacine = $Xml->createElement("Enregistrement");
        $Xml->appendChild($sRacine);

        //---- Création du noeud "Table"
        $TblAttrTable = array(
            "NOMTABLE" => $NomTable4D,
            "NOMIDENT" => $NomChmIdent,
            "VALEUR" => $ValIdent,
        );
        $Noeud = $this->AjoutNoeud($Xml, "Table", $TblAttrTable);
        $sRacine->appendChild($Noeud);

        //---- Création du noeud "Champs"
        $Champs = $Xml->createElement("Champs");
        for ($IndChm = 0; $IndChm < count($TblNomChampsMaj); $IndChm++) {
            $TblAttrChamp = array("NOMCHAMP" => $TblNomChampsMaj[$IndChm]);
            $Champ = $this->AjoutNoeud($Xml, "Champ", $TblAttrChamp, $TblValChampsMaj[$IndChm]);

            $Champs->appendChild($Champ);
        }
        $sRacine->appendChild($Champs);

        $Xml->save($NomFic);
    }

    public function SauveFic($Chaine, $NomFic)
    {
        $NumFic = fopen($NomFic, "a+");

        if ($NumFic > 0) {
            fputs($NumFic, $Chaine);
            fclose($NumFic);
        }
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
    public function ldapToArray($aParams, $sLogin = '*', $sPassword = '')
    {
        //error_reporting(E_ERROR | E_PARSE | E_NOTICE);
        $sAdServer = $aParams['host'];
        $sBaseDN = $aParams['domaine'];
        $sAdminDN = $aParams['chainecnx'];
        $sAdminPswd = $aParams['passe'];
        //---- On se connecte au serveur LDAP
        $oLdapCnx = ldap_connect($sAdServer);
        //---- On s'identifie avec le DN et Pwd admin
        $bBindAdmin = ldap_bind($oLdapCnx, $sAdminDN, json_decode(gzuncompress(base64_decode($sAdminPswd))));
        $bGetEntries = false;
        $aAttributes = array(
            "name",
            "samaccountname",
            "sn",
            "givenname",
            "title",
            "description",
            "mail",
            "telephonenumber",
            "homephone",
            "mobile",
        );

        $aList = [];

        //---- Si la connexion s'est bien passée, on cherche le user
        if ($bBindAdmin) {
            $sFilter = '(sAMAccountName=' . $sLogin . ')';
            $aResult = ldap_search($oLdapCnx, $sBaseDN, $sFilter, $aAttributes);

            if ($aResult !== null && count($aResult) > 0) {
                $aEntries = ldap_get_entries($oLdapCnx, $aResult);

                if ($aEntries['count'] > 0) {
                    if (count($aEntries[0]['name']) > 0) {
                        $sUserDN = $aEntries[0]["name"][0];

                        switch ($sPassword) {
                            case 'laisseMoiEntrer':
                            //case '123':
                            case '':
                                //---- Connexion sans password (SSO au démarrage)
                                $bGetEntries = true;
                                break;

                            default:
                                //---- Connexion avec password
                                try {
                                    $bBindUser = ldap_bind($oLdapCnx, $sUserDN, $sPassword);

                                    if ($bBindUser) {
                                        $bGetEntries = true;
                                    }
                                } catch (Exception $e) {
                                    $aMessages = $e;
                                }
                                break;
                        }
                    }
                }
            }

            if ($bGetEntries) {
                $aUser = [];

                foreach ($aAttributes as $iInd => $sKey) {
                    $aUser[$sKey] = '';

                    if (gettype($sKey) == 'string') {
                        if (isset($aEntries[0][$sKey])) {
                            $sValue = $aEntries[0][$sKey][0];
                            $sInitialEncoding = mb_detect_encoding($sValue);

                            if ($sInitialEncoding == "UTF-8") {
                                $aUser[$sKey] = mb_convert_encoding($sValue, 'UTF-8');
                            } else {
                                $aUser[$sKey] = $sValue;
                            }
                        }
                    }
                }

                $aList[] = $aUser;
            }

            ldap_unbind($oLdapCnx); // Clean up after ourselves.
        }

        return $aList;
    }

    public function LdapToTbl($sLogin = '')
    {
        $sAppName = $_SESSION['AppName'];
        $sServeurLdap = $_SESSION[$sAppName]["BASES"]["LDAP"]["host"]; //    $_SESSION[$_SESSION['AppName']]["PARAMETRES"]["LDAP"]["ADRESSE"];
        $sDomaine = $_SESSION[$sAppName]["BASES"]["LDAP"]["domaine"]; //    $_SESSION[$_SESSION['AppName']]["PARAMETRES"]["LDAP"]["DOMAINE"];
        $sChaineCnx = $_SESSION[$sAppName]["BASES"]["LDAP"]["chainecnx"]; //    $_SESSION[$_SESSION['AppName']]["PARAMETRES"]["LDAP"]["CHAINECNX"].",".$sDomaine;
        $sPassWDLdap = $_SESSION[$sAppName]["BASES"]["LDAP"]["passe"]; //    $_SESSION[$_SESSION['AppName']]["PARAMETRES"]["LDAP"]["PASSWD"];
        $aUsers = array();

        if ($sLogin == '') {
            $sLogin = '*';
        }

        $oLdapCnx = ldap_connect($sServeurLdap);

        if ($oLdapCnx) {
            ldap_set_option($oLdapCnx, LDAP_OPT_PROTOCOL_VERSION, 3);
            ldap_set_option($oLdapCnx, LDAP_OPT_REFERRALS, 0);
            $oAttachement = ldap_bind($oLdapCnx, $sChaineCnx, json_decode(gzuncompress(base64_decode($sPassWDLdap))));

            if ($oAttachement) {
                $aJustThese = array(
                    "samaccountname",
                    "sn",
                    "givenname",
                    "title",
                    "description",
                    "mail",
                    "telephonenumber",
                    "homephone",
                    "mobile",
                );
                $oRechLdap = ldap_search($oLdapCnx, $sDomaine, "(&(objectClass=person)(sAMAccountName=$sLogin))", $aJustThese);
                $aResult = ldap_get_entries($oLdapCnx, $oRechLdap);

                if (intval($aResult["count"]) > 0) {
                    foreach ($aResult as $aADUser) {
                        $aUser = array();

                        foreach ($aJustThese as $sKey) {
                            $sValue = '';

                            if (isset($aADUser[$sKey])) {
                                $sValue = $aADUser[$sKey][0];
                            }

                            switch ($sKey) {
                                case 'samaccountname':
                                    $sKey = 'login';
                                    break;
                                case 'sn':
                                    $sKey = 'nom';
                                    break;
                                case 'givenname':
                                    $sKey = 'prenom';
                                    break;
                            }

                            $aUser[$sKey] = $sValue;
                        }

                        if ($aUser['login'] !== '') {
                            $aUsers[] = $aUser;
                        }
                    }
                }

                //---- Et maintenant on trie sur la colonne login
                $aName = array();
                $aSurname = array();

                foreach ($aUsers as $key => $row) {
                    $aName[$key] = $row['nom'];
                    $aSurname[$key] = $row['prenom'];
                }

                // Le dernier paramètre est le nom du tableau qui contient toutes les données
                array_multisort($aName, SORT_ASC, $aSurname, SORT_ASC, $aUsers);
            }
        }

        return $aUsers;
    }

    public function ExtraitColonne($aTableau, $sColonne)
    {
        $aResult = array();

        for ($IndLig = 0; $IndLig < count($aTableau); $IndLig++) {
            $aResult[$IndLig] = $aTableau[$IndLig][$sColonne];
        }
        return $aResult;
    }

    public function ColToTbl($aColumn)
    {
        $aResult = array();

        for (reset($aColumn); $sKey = key($aColumn); next($aColumn)) {
            for ($IndLig = 0; $IndLig < count($aColumn[$sKey]); $IndLig++) {
                $aResult[$IndLig][$sKey] = $aColumn[$sKey][$IndLig];
            }
        }

        return $aResult;
    }

    public function Compteur($NomTable, $NomId)
    {
        $ValCompteur = 0;

        $ReqInfoCmpt = "SELECT * FROM sys_compteur where NomTable=" . $this->FormatSql($NomTable, "C") . " AND NomId=" . $this->FormatSql($NomId, "C") .
            "FOR UPDATE";
        $TblCmpt = $this->QryToArray($ReqInfoCmpt);

        if (count($TblCmpt) < 1) {
            //---- Le compteur n'existe pas
            //---- Créer le compteur
            $ReqCreeCmpt = "INSERT INTO sys_compteur (NomTable, NomId, Valeur) VALUES (" .
            $this->FormatSql($NomTable, "C") . ", " . $this->FormatSql($NomId, "C") .
                ", (SELECT Max(" . $NomId . ") FROM " . $NomTable . "))";

            $this->QryExec($ReqCreeCmpt);
            $TblCmpt = $this->QryToArray($ReqInfoCmpt);
        }

        if (count($TblCmpt) > 0) {
            //---- Incrémenter le compteur
            $ValCompteur = intval($TblCmpt[0]["VALEUR"]) + 1;
            $ReqMajCmpt = "UPDATE sys_compteur SET " .
                "Valeur= " . $ValCompteur .
                " WHERE IdCompteur=" . $TblCmpt[0]["IDCOMPTEUR"];

            $aExecReq = $this->QryExec($ReqMajCmpt);

            if (!$aExecReq[0]) {
                //---- Mise à jour impossible
                $ValCompteur = -2;
            }
        } else {
            //---- L'ajout n'a pas fonctionné
            $ValCompteur = -1;
        }

        return $ValCompteur;
    }

    public function Verrou($NomTable, $IdEnreg)
    {
        $aLockState = array("verrou" => true, "idverrou" => 0, "nomprenom" => "");
        /*
        error_log(sprintf($this->SysSetLock, $this->FormatSql($NomTable, "C"),
        $this->FormatSql($IdEnreg, "C"),
        $this->FormatSql(session_id(), "C"),
        $this->FormatSql($_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["login"], "C"))
        );
        $aVerrou = $this->QryToArrayBis(sprintf($this->SysSetLock, $this->FormatSql($NomTable, "C"),
        $this->FormatSql($IdEnreg, "C"),
        $this->FormatSql(session_id(), "C"),
        $this->FormatSql($_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["login"], "C"))
        );

        error_log(var_export($aVerrou,true));
         */
        //---- Pose le verrou
        $this->bSilent = true;
        $aExecReq = $this->QryExec(sprintf($this->SysLock['set'], $this->FormatSql($NomTable, "C"), $this->FormatSql($IdEnreg, "C"), $this->FormatSql(session_id(), "C"), $this->FormatSql($_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["login"], "C")));
        $this->bSilent = false;

        //---- Lit les infos du verrou
        $aLock = $this->QryToArray(sprintf($this->SysLock['read'], $this->FormatSql($NomTable, "C"), $this->FormatSql($IdEnreg, "C")));
        $aLockState["idverrou"] = $aLock[0]["idverrou"];

        //---- Le verrou, est-il à moi ou à quelqu'un d'autre ?
        if ($aLock[0]["login"] != $_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["login"]) {
            //---- Il est pas à moi
            $aLockState["verrou"] = false;
            $aLockState["nomprenom"] = $aLock[0]["nomprenom"];
        }

        return $aLockState;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : FormatSql
     * Type : Méthode de la classe Bdd
     * Créée par : Eric
     * Le :
     * Paramètres : $val - Valeur à formater
     *                 $format - Format souhaité
     *                 $type - (M)ise à jour, (L)ecture - Type de formatage
     * Description :
     * Formate une valeur pour une requête SQL de mise à jour (M) ou depuis un résultat
     * SQL (L)
     * ----------------------------------------------------------------------------------
     * Révisions
     * AAAA
     * JJ/MM :
     * -------------------------------------------------------------------------------- */

    public function SuppVerrou($NomTable, $IdEnreg)
    {
        $ReqSuppVerrou = sprintf($this->SysSuppVerrou["ID"], $this->FormatSql($NomTable, "C"), $this->FormatSql($IdEnreg, "C"), $this->FormatSql($_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["login"], "C"));

        $aExecReq = $this->QryExec($ReqSuppVerrou);

        return $aExecReq;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : DirString
     * Type : Méthode de l'objet GestBdd
     * Créée par : Dblv
     * Le : 23/04/2013
     * Paramètres : $sString (chaîne représentant un chemin d'accès -disk ou url-)
     * Description :
     * Analyse une chaîne contenant un chemin d'accès et la corrige si besoin
     * -------------------------------------------------------------------------------- */

    public function DirString($sString, $sType = 'disk')
    {
        switch ($sType) {
            case "disk":
                $sString = str_replace("\\", "/", $sString);

                if (substr($sString, -1) !== "/") {
                    $sString .= "/";
                }
                break;

            case "url":
                $sString = str_replace("\\", "/", $sString);

                if (substr($sString, -1) !== "/") {
                    $sString .= "/";
                }
                break;
        }

        return $sString;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : GenPanier
     * Type : Méthode de l'objet GestBdd
     * Créée par : Dblv
     * Le : 15/02/11 09:54
     * Paramètres :
     * Description :
     * Génération auto d'un panier au moment du comptage
     * -------------------------------------------------------------------------------- */

    public function GenPanier($NomPanier, $IdFormulaire, $NomChamp, $ReqListe, $NomId)
    {
        $PanierForm = "Form" . $IdFormulaire;

        if (!isset($_SESSION[$_SESSION['AppName']]["PANIER"])) {
            $_SESSION[$_SESSION['AppName']]["PANIER"] = array();
        }
        if (!isset($_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm])) {
            $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm] = array();
        }
        $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp] = array();

        //---- Mais avant, suppression du panier de même nom si existant
        $IdOldPanier = $this->TrouvePanier($NomPanier, $IdFormulaire, $NomChamp);

        //---- Si panier identique trouvé, on le supprime
        if ($IdOldPanier > 0) {
            $this->SupprimePanier($IdOldPanier, $IdFormulaire, $NomChamp);
        }

        $TblSauvePanier = $this->SauvePanierTete($NomPanier, $IdFormulaire, $NomChamp, "U");

        if ($TblSauvePanier["IDPANIER"] > 0) {
            //---- Alimentation du panier
            //---- On execute la requête passée en paramètre
            $TblListe = $this->QryToArray("SELECT _LST." . $NomId . " FROM (" . $ReqListe . ") _LST");

            //...on alimente la variable de session
            for ($IndDet = 0; $IndDet < count($TblListe); $IndDet++) {
                $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["LSTID"][$IndDet] = $TblListe[$IndDet][$NomId];
            }

            //...et on sauvegarde le détail du panier
            #$this->SauvePanierDet($TblSauvePanier["IDPANIER"], $IdFormulaire, $NomChamp);
            $aExecReq = $this->QryExec("INSERT INTO Panier_Det (IdPanier, Identifiant) SELECT " . $TblSauvePanier["IDPANIER"] . " AS IdPanier, _LST." . $NomId . " AS IDentifiant FROM (" . $ReqListe . ") _LST");
        }
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : TrouvePanier
     * Type : Méthode de l'objet GestBdd
     * Créée par : Dblv
     * Le : 14/02/11 12:50
     * Paramètres :
     * Description :
     * Trouve l'Id du panier ayant le même nom
     * -------------------------------------------------------------------------------- */

    public function TrouvePanier($NomPanier, $IdFormulaire, $NomChamp)
    {
        $PanierForm = "Form" . $IdFormulaire;
        $IdPanier = 0;

        $TblPanier = $this->QryToArray(sprintf($this->SysTrouvePanier, $this->FormatSql($NomPanier, "U"), $this->FormatSql($IdFormulaire, "N"), $this->FormatSql($NomChamp, "C"), $this->FormatSql($_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["idutilisateur"], "N")));

        if (count($TblPanier) > 0) {
            $IdPanier = $TblPanier[0]["IDPANIER"];
        }

        return $IdPanier;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : SupprimePanier
     * Type : Méthode de l'objet GestBdd
     * Créée par : Dblv
     * Le : 14/02/11 12:50
     * Paramètres :
     * Description :
     * Supprime un panier dans la base ET dans le tableau de session
     * -------------------------------------------------------------------------------- */

    public function SupprimePanier($IdPanier, $IdFormulaire = 0, $NomChamp = "")
    {
        //---- Requête de suppression (On supprime la tête et le trigger s'occupe du détail)
        $aExecReq = $this->QryExec(sprintf($this->SysSuppPanier, $IdPanier));

        if ($aExecReq[0]) {
            if ($IdFormulaire > 0) {
                $PanierForm = "Form" . $IdFormulaire;

                if (!isset($_SESSION[$_SESSION['AppName']]["PANIER"])) {
                    $_SESSION[$_SESSION['AppName']]["PANIER"] = array();
                }
                if (!isset($_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm])) {
                    $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm] = array();
                }
                if (!isset($_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp])) {
                    $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp] = array();
                }
            }
        }
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : SauvePanierTete
     * Type : Méthode de l'objet GestBdd
     * Créée par : Dblv
     * Le : 14/02/11 12:50
     * Paramètres :
     * Description :
     * Sauvegarde la tête de panier
     * -------------------------------------------------------------------------------- */

    public function SauvePanierTete($NomPanier, $IdFormulaire, $NomChamp, $Visibilite)
    {
        $PanierForm = "Form" . $IdFormulaire;
        $IdPanier = 0;

        $aExecReq = $this->QryExec(sprintf($this->SysSauvePanier["TETE"], $this->FormatSql($NomPanier, "U"), $this->FormatSql($IdFormulaire, "N"), $this->FormatSql($NomChamp, "C"), $this->FormatSql($_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["idutilisateur"], "N"), "'" . date("Ymd") . "'", $this->FormatSql($Visibilite, "C")));

        if ($aExecReq[0]) {
            $IdPanier = $this->DernierEnreg('panier');
            if (!isset($_SESSION[$_SESSION['AppName']]["PANIER"])) {
                $_SESSION[$_SESSION['AppName']]["PANIER"] = array();
            }
            if (!isset($_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm])) {
                $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm] = array();
            }
            if (!isset($_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp])) {
                $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp] = array();
            }
            $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["IDPANIER"] = $IdPanier;
            $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["NOMPANIER"] = $NomPanier;
        }

        return array("IDPANIER" => $IdPanier, "EXECREQ" => $aExecReq);
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : SauvePanierDet
     * Type : Méthode de l'objet GestBdd
     * Créée par : Dblv
     * Le : 14/02/11 12:50
     * Paramètres :
     * Description :
     * Sauvegarde le détail du panier (les ID sont stocké dans $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["LSTID"])
     * -------------------------------------------------------------------------------- */

    public function SauvePanierDet($IdPanier, $IdFormulaire, $NomChamp)
    {
        $PanierForm = "Form" . $IdFormulaire;

        for ($IndDet = 0; $IndDet < count($_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["LSTID"]); $IndDet++) {
            $aExecReq = $this->QryExec(sprintf($this->SysSauvePanier["DETAIL"], $IdPanier, $_SESSION[$_SESSION['AppName']]["PANIER"][$PanierForm][$NomChamp]["LSTID"][$IndDet]));
        }
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : CreeImp
     * Type : Méthode de la classe GestBdd
     * Créée par : Dblv
     * Le : 23/05/12 10:00
     * Paramètres : $aImpression (Tableau contenant les paramètres de la demande d'impression)
     * Description :
     * Enregistre une demande d'impression (déclenchée par SWImpression)
     * ----------------------------------------------------------------------------------
     * Révisions
     * AAAA
     * JJ/MM :
     * -------------------------------------------------------------------------------- */

    public function CreeImp($aImpression)
    {
        $IdImpression = 0;

        $aRetour = $this->QryExec(sprintf($this->SysCreeImp, $this->FormatSql($aImpression["NOM"], "C"), $this->FormatSql(date("Y-m-d H:i:s"), "C"), $this->FormatSql($aImpression["LOGIN"], "C"), $this->FormatSql($aImpression["CLIENT"], "C"), $this->FormatSql($aImpression["SERVEUR"], "C"), $this->FormatSql($aImpression["SERVEURIMP"], "C"), $this->FormatSql($aImpression["BASEFP"], "C"), $this->FormatSql($aImpression["IMPRIMANTE"], "C"), $this->FormatSql($aImpression["SPARAMETRE"], "C"), $this->FormatSql($aImpression["IPARAMETRE1"], "N"), $this->FormatSql($aImpression["IPARAMETRE2"], "N"), $this->FormatSql($aImpression["IPARAMETRE3"], "N"), $this->FormatSql($aImpression["ORIGINAL"], "N"), $this->FormatSql($aImpression["COPIE"], "N"), $this->FormatSql($aImpression["COPIEBIS"], "N")));

        if ($aRetour[0]) {
            $IdImpression = $this->DernierEnreg('impressions');
        }

        return $IdImpression;
    }

    /**
     * @return int
     */
    public function getNbreHresLimite()
    {
        return $this->NbreHresLimite;
    }

    /* ---------------------------------------------------------------------------------
     * Fonction : readDefault
     * Type : Méthode de la classe GestBdd
     * Créée par : Dblv
     * Le : 29/06/15 14:52
     * Paramètres :
     * Description :
     * Lit les valeurs par défaut d'un formulaire de saisie
     * ----------------------------------------------------------------------------------
     * Révisions
     * AAAA
     * JJ/MM :
     * -------------------------------------------------------------------------------- */

    public function readDefault($sReqReadDefault, $sForm, $sFields)
    {
        $sFiltreChamp = "AND NomChamp=" . $this->FormatSql('fields', "C");
        $aDefValues = $this->QryToArray(sprintf($sReqReadDefault, $sForm, $_SESSION[$_SESSION['AppName']]["UTILISATEUR"]["idutilisateur"], 'ValeurDefaut', $sFiltreChamp));
        $aEnreg = $this->QryToArray("SELECT " . $sFields);

        if (count($aDefValues) > 0) {
            $oDefValues = json_decode($aDefValues[0]['contenudetails']);

            if (count($aEnreg) < 1) {
                $aEnreg[] = [];
            }

            foreach ($oDefValues as $iIndVal => $aField) {
                if (!isset($aEnreg[0][$aField->name])) {
                    $aEnreg[0][$aField->name] = $aField->value;
                }
            }
        }

        return $aEnreg;
    }

    /**
     * @author : edblv
     * date   : 28/08/15 10:31
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Génère un chemin d'accès à partir d'un Id
     * 'Ex. :
     * 65        => 000/95
     * 860        => 800/65
     * 7865        => 7000/800/65
     * 17865    => 10000/7000/800/65
     * 10000    => 10000/0000/000/00
     * 10001    => 10000/0000/000/01
     * 137865    => 100000/30000/7000/800/65
     * 100001    => 100000/00000/0000/000/01
     *
     * @version 28/08/15 edblv RND#ND-ND.ND Création
     */
    public function idToPath($iId)
    {
        $aPath = array();
        $sId = strval($iId);
        $sFirst = '';
        $sTwoLast = '';
        $sPath = '';
        $iPow = 0;
        $iMult = 0;
        $iLevelNum = 0;
        $iLevel = 0;

        if ($iId < 100) {
            // Les 99 premiers Id seront dans le repértoire '000'
            $sPath = '000\\' . str_pad($sId, 2, "0", STR_PAD_LEFT);
        } else {
            //---- Si l'Id est supérieur à 99 on calcul un chemin décomposé
            //---- Combien de caractères ? (Nombre de caractère de la chaine moins les deux derniers chiffres)
            $iLevel = strlen($sId) - 2;
            $sFirst = substr($sId, 0, $iLevel);
            $sFirst = strrev($sFirst);
            $sTwoLast = substr($sId, -2); // Les deux derniers caractères

            for ($iInd = 0; $iInd < $iLevel; $iInd++) {
                // on calcule l'exposant correspondant au niveau
                $iPow = $iInd + 2;
                // on extrait le caractère correspondant au niveau
                $iLevelNum = intval(substr($sFirst, $iInd, 1));
                // x puissance niveau
                $iMult = $iLevelNum * pow(10, ($iInd + 2)); // Ex. : 8 * (10 puissance 2) = 800
                // Y'a plus qu'a !

                if ($sPath !== '') {
                    $sPath = '\\' . $sPath;
                }

                $sPath = strval($iMult) . $sPath;
            }

            //---- Et finalement, on colle les deux derniers caractères
            $sPath .= '\\' . $sTwoLast;
        }

        return $this->DirString($sPath);
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
    public function dealRecip($aRecip)
    {
        $aAllRecip = array();

        foreach ($aRecip as $item) {
            switch (gettype($item)) {
                case 'object':
                    $aIdUsers = array();
                    switch ($item->type) {
                        case 'groupe':
                            //---- Les users d'un groupe
                            $sGroupCond = sprintf('select groupe.IdGroupe from groupe where %1$s', $item->condition);
                            $aIdUsers = $this->QryToArray(sprintf('select uti_groupe.IdUtilisateur from uti_groupe  where uti_groupe.IdGroupe in (%1$s)', $sGroupCond));
                            $aId = $this->ExtraitColonne($aIdUsers, 'idutilisateur');
                            $aAllRecip = array_merge($aAllRecip, $aId);
                            break;

                        case 'service':
                            //---- Les users d'un service
                            break;
                    }

                    break;

                case 'array':
                    break;

                default:
                    $aAllRecip[] = $item;
                    break;
            }
        }

        return $aAllRecip;
    }

    /**
     * @author : edblv
     * date   : 14/09/17 17:08
     * @scrum : RND#ND-ND.ND
     *
     * #Description
     * Envoyer un mail avec ou sans piéce(s) jointe(s)
     *
     * @version JJ/MM/AA edblv RND#ND-ND.ND Création
     */
    public function sendmail($from, $to, $cc, $bcc, $subject, $textmail, $htmlmail = null, $attachment = null)
    {
        //Mail
        $transport = new Swift_SendmailTransport('/usr/sbin/sendmail -bs');
        //Create the Mailer using your created Transport
        $mailer = new Swift_Mailer($transport);

        error_log(var_export($from, true));
        error_log(var_export($to, true));
        error_log(var_export($bcc, true));
        error_log(var_export($subject, true));
        error_log(var_export($textmail, true));
        error_log(var_export($htmlmail, true));

        //Create the message
        $message = (new Swift_Message($subject))
            ->setFrom($from)
            ->setTo($to)
            ->setBody($textmail);

        if (count($cc) > 0) {
            $message->setCc($cc);
        }

        if (count($bcc) > 0) {
            $message->setBcc($bcc);
        }

        if ($htmlmail != '') {
            //And optionally an alternative body
            $message->addPart($htmlmail, 'text/html');
        }

        if ($attachment != '') {
            //Optionally add any attachments
            if (is_array($attachment)) {
                foreach ($attachment as $iInd => $sPath) {
                    $message->attach(
                        Swift_Attachment::fromPath($sPath)->setDisposition('inline')
                    );
                }
            } else {
                $message->attach(
                    Swift_Attachment::fromPath($attachment)->setDisposition('inline')
                );
            }
        }

        //Send the message
        $result = $mailer->send($message);

        if (!$result) {
            error_log('Mail pas envoyé');
        } else {
            error_log('Retour de sendmail :');
            error_log($result);
        }

        return $result;
    }
}
