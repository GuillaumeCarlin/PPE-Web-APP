<?php
$Test = "VariableEtFiltre";

//---- Déclaration des variables générales
$aVariables[] = "action";
$aVariables[] = "AutreVar";
$aVariables[] = "IdForm";
$aVariables[] = "IdParent";
$aVariables[] = "Mode";
$aVariables[] = "nomform";
$aVariables[] = "Requete";
$aVariables[] = "IdSelect";
$aVariables[] = "CodeParam";
$aVariables[] = "IdDeveloppeur";
$aVariables[] = "IdUtilisateur";
$aVariables[] = "IdListe";
$aVariables[] = "CodeListe";
$aVariables[] = "itemvide";
$aVariables[] = "IdFormulaire";
$aVariables[] = "Lettres";
$aVariables[] = "Requete";
$aVariables[] = "NomChart";
$aVariables[] = "IdEntite";
$aVariables[] = "TypeDroit";
$aVariables[] = "Attache";
$aVariables[] = "Affiche";
$aVariables[] = "IdGroupe";
$aVariables[] = "DebRea";
$aVariables[] = "datedeb";
$aVariables[] = "datefin";
$aVariables[] = "champs";
$aVariables[] = "from";
$aVariables[] = "verrou";
$aVariables[] = "ident";
$aVariables[] = "idenreg";
$aVariables[] = "record";
$aVariables[] = "specfilter";
$aVariables[] = "idsection";
$aSpecFilter = array();

//------------------------------------
// Variable envoyées par la Grid ExJs
//------------------------------------
$aVariables[]="page";
$aVariables[]="start";
$aVariables[]="limit";
$aVariables[]="sort";
$aVariables[]="filter";
$aVariables[]="group";


//----- Récupération des variables dans $_GET et $_POST -----
for ($IndVar = 0; $IndVar < count($aVariables); $IndVar++) {
	$NomVar = $aVariables[$IndVar];
	$$NomVar = "";

	if (isset($_POST)) {
		if (isset($_POST[$aVariables[$IndVar]])) {
			$$NomVar = rawurldecode($_POST[$aVariables[$IndVar]]);
		}
	}

	if (isset($_GET)) {
		if (isset($_GET[$aVariables[$IndVar]])) {
			$$NomVar = rawurldecode($_GET[$aVariables[$IndVar]]);	//utf8_decode($_GET[$aVariables[$IndVar]]);
		}
	}
}


//---- Variables nécessaires à la pagination dans les Grid
//if ($limit == 0) { // Fait Crasher l'application car les variables ne sont pas initialiser
//	$limit = 50;
//}

//if (isset($limit)) {
//	echo 'Existe';
//}else {
//	echo "N'existe pas";
//}
//
//
//if(isset($limit) && $limit == 0){
//	$limit = 50;
//}
//elseif (!isset($limit)) {
//	$limit = 50;
//}else {
//	$limit = 10;
//}
//
//
//if ($page == 0) {
//	$page = 1;
//}else {
//	$page = 1;
//}
//
//var_dump($page);
//
//$iDeb = (($limit * $page) - $limit) + 1;
//
//$iFin = ($iDeb + $limit) - 1;



//---- Autres variables utilisées dans les PHP
$aExecReq=array(
	false,	// Execution requête (true/false)
	"",		// Message d'erreur (ODBC/FreeTDS)
	0		// N° d'erreur (ODBC/FreeTDS)
);
$iNoErr=0;



//---- Variables nécessaire à l'objet JSON de retour
$aListe=array();
$bSucces=false;
$sMessage="";
$iEnregTotal=0;



//---- Variable specfilter
if ($specfilter!=='') {
	$_aSpecFilter = json_decode($specfilter);
	foreach ($_aSpecFilter as $iIndFlt=>$aCond) {
		$aSpecFilter[strtolower($aCond->type)]=$aCond->value;
	}
}


//---- Variables pour le filtre et le tri
//oFiltre=json_decode($filter);
//sFiltre="";
//sOrder="";
//
//f (count($oFiltre)>0) {
//	for ($IndFlt=0;$IndFlt<count($oFiltre);$IndFlt++) {
//		$sNomChamp = '';
//
//		if (isset($oFiltre[$IndFlt]->field)) {
//			$sNomChamp = $oFiltre[$IndFlt]->field;
//		}
//		
//		if (isset($oFiltre[$IndFlt]->fieldname)) {
//			$sNomChamp = $oFiltre[$IndFlt]->fieldname;
//		}
//		
//		if ($sNomChamp=='') {
//			continue;
//		}
//		
//		if ($sFiltre!="") {
//			$sFiltre.=" AND ";
//		}
//
//		if (isset($oFiltre[$IndFlt]->type)) {
//			switch ($oFiltre[$IndFlt]->type) {
//				case 'C':
//					$sValeur='\''.$oFiltre[$IndFlt]->value.'\'';
//					break;
//
//				default:
//					$sValeur=$oFiltre[$IndFlt]->value;
//					break;
//			}
//		}
//		else {
//			$sValeur=$oFiltre[$IndFlt]->value;
//		}
//		
//		if (isset($aSubstitChamp)) {
//			if (isset($aSubstitChamp[$sNomChamp])) {
//				$sNomChamp=$aSubstitChamp[$sNomChamp];
//			}
//		}
//
//		//NOTE:
//		echo 'Flag 3 VariableETFiltre';
//		
//		$sFiltre.=$sNomChamp;
//		$sCond='';
//		$sOperator = '';
//		
//		if (isset($oFiltre[$IndFlt]->comparison)) {
//			$sOperator = $oFiltre[$IndFlt]->comparison;
//		}
//		
//		if (isset($oFiltre[$IndFlt]->operator)) {
//			$sOperator = $oFiltre[$IndFlt]->operator;
//		}
//		//NOTE:
//		echo 'Flag 3 VariableETFiltre';
//
//		switch ($sOperator) {
//			case "in" :	//---- In (in)
//				$sCond=' in (%1$s)';
//				break;
//
//			case "notin" :	//---- Not In (not in)
//				$sCond=' not in (%1$s)';
//				break;
//
//			case "eq" :	//---- Equal to (=)
//				if (strtolower($sValeur)=="null") {
//					$sCond=' is %1$s';
//				} else {
//					$sCond='=%1$s';
//				}
//				break;
//
//			case "like" :	//---- Like (pour les chaînes uniquement)
//				$sCond=' like %1$s';
//				$sValeur=  str_replace("*", "%",$sValeur);
//				break;
//
//			case "neq" :	//---- Not Equal to (#)
//				if (strtolower($sValeur)=="null") {
//					$sCond=' is not %1$s';
//				} else {
//					$sCond='<>%1$s';
//				}
//				break;
//
//			case "lt" :	//---- Less than (<)
//				$sCond='<%1$s';
//				break;
//
//			case "gt" :	//---- Greater than (>)
//				$sCond='>%1$s';
//				break;
//
//			case "gteq" :	//---- Greater than or equal to (>=)
//				$sCond='>=%1$s';
//				break;
//
//			case "lteq" :	//---- Less than or equal to (<=)
//				$sCond='<=%1$s';
//				break;
//		}
//
//		$sFiltre.=sprintf($sCond,$sValeur);
//	}
//}

$aGroupFields=array();
$sFieldNameGrp="";
$sFieldNameOrder="";

//---- Si la liste est groupée on ajoute au début du tri, le (ou les) champ(s) de groupement (Bug ExtJs 4.1)
if ($group!="") {
	$oGroup=  json_decode($group);
	
	//for ($IndGrp=0;$IndGrp<count($oGroup);$IndGrp++) {
		$sFieldNameGrp=$oGroup->property;
		$aGroupFields[]=strtolower($sFieldNameGrp);

		if (isset($aSubstitChamp)) {
			if (isset($aSubstitChamp[$sFieldNameGrp])) {
				if (is_array($aSubstitChamp[$sFieldNameGrp])) {
					//---- Si la substitution de champ est un tableau, le champ de regroupement
					//	et le champ de tri sont différrent...
					$sFieldNameGrp=$aSubstitChamp[$sFieldNameGrp][1];
				} else {
					// ... sinon, c'est le même champ qui sert au regroupement et au tri
					$sFieldNameGrp=$aSubstitChamp[$sFieldNameGrp];
				}
			}
		}

		if ($sOrder!="") {
			$sOrder.=", ";
		}

		$sOrder.=$sFieldNameGrp." ".$oGroup->direction;
	//}
}

//---- Gestion du tri
if ($sort!="") {
	$oSort=  json_decode($sort);
	
	for ($IndTri=0;$IndTri<count($oSort);$IndTri++) {
		$sFieldNameOrder=$oSort[$IndTri]->property;

		if (!in_array($sFieldNameOrder, $aGroupFields)) {	//($sNomChampFlt!=$group) {
			if (isset($aSubstitChamp)) {
				if (isset($aSubstitChamp[$sFieldNameOrder])) {
					if (is_array($aSubstitChamp[$sFieldNameOrder])) {
						$sFieldNameOrder=$aSubstitChamp[$sFieldNameOrder][1];
					} else {
						$sFieldNameOrder=$aSubstitChamp[$sFieldNameOrder];
					}
				}
			}

			if ($sOrder!="") {
				$sOrder.=", ";
			}

			$sOrder.=$sFieldNameOrder." ".$oSort[$IndTri]->direction;
		}
	}
}

?>
