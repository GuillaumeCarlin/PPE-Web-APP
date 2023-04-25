<?php

$aDb = [
	'typebase'=> 'MsSql',
	'nombase'=> 'BD_AUTH_PRF',
	'host'=>'SVW2K8R2SQL1\DEV',
	'username'=>'gmpi',
	'passe'=>'eJxTCnAwNS8yLFYCAAsvAlc='
];

include_once 'Bdd.php';
$oSession = new GestBdd($aDb);

/*
$oConnect = new pdo(
		'dblib:host=' . $aDb['host'] . ';dbname=' . $aDb['dba'], $aDb['user'], $aDb['password']
);
*/

error_log(var_export($aDb,true));

if ($oSession->CnxDb) {
	/*
	$bCnx = true;
	$oConnect->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
	$oConnect->setAttribute(PDO::ATTR_CASE, PDO::CASE_LOWER);
	*/
	echo 'Session : Connexion BDD Ok !!';
	$sQuery = 'if exists(SELECT sess_id FROM AppSession WHERE sess_id = \'inf2qqekr4mpk2n7smmcmbvo33\') UPDATE AppSession SET sess_user=NULL, sess_datas = N\'AppName|s:18:"THOT-1480670689065";THOT-1480670689065|a:2:{s:9:"NOMCLIENT";s:7:"THOTDEV";s:5:"BASES";a:4:{s:7:"BD_AUTH";a:6:{s:8:"typebase";s:5:"MsSql";s:7:"libbase";s:23:"Base dauthentification";s:4:"host";s:16:"SVW2K8R2SQL1\DEV";s:7:"nombase";s:11:"BD_AUTH_PRF";s:8:"username";s:4:"Gmpi";s:5:"passe";s:24:"eJxTCnAwNS8yLFYCAAsvAlc=";}s:13:"THOTDEVDBUSER";a:9:{s:8:"typebase";s:5:"MsSql";s:7:"libbase";s:18:"Thot dÃƒÂ©v. Proform";s:4:"host";s:16:"SVW2K8R2SQL1\DEV";s:7:"nombase";s:15:"BD_THOT_DEV_THD";s:6:"client";s:7:"PROFORM";s:8:"username";s:10:"thotdbuser";s:5:"passe";s:28:"eJxTKsnIL0lJKi1OLVICAB2JBIk=";s:5:"appli";b:1;s:3:"dev";s:1:"1";}s:7:"THOTDEV";a:10:{s:8:"typebase";s:5:"MsSql";s:7:"libbase";s:18:"Thot dÃƒÂ©v. Proform";s:4:"host";s:16:"SVW2K8R2SQL1\DEV";s:7:"nombase";s:15:"BD_THOT_DEV_THD";s:6:"client";s:7:"PROFORM";s:8:"username";s:4:"Gmpi";s:5:"passe";s:24:"eJxTCnAwNS8yLFYCAAsvAlc=";s:5:"appli";b:1;s:6:"defaut";b:1;s:3:"dev";s:1:"1";}s:4:"LDAP";a:5:{s:8:"typebase";s:4:"Ldap";s:4:"host";s:18:"ldap://172.16.10.1";s:7:"domaine";s:65:"OU=PROFORM - UTILISATEURS ET GROUPES,OU=PROFORM,DC=proform,DC=dom";s:9:"chainecnx";s:8:"_SRVLdap";s:5:"passe";s:28:"eJxTCnYwNi8ziDQuVgIAENEC5w==";}}}\', sess_expire = convert(datetime,\'2016-12-04\')  WHERE sess_id = \'inf2qqekr4mpk2n7smmcmbvo33\' else INSERT INTO AppSession (sess_id, sess_user, sess_datas, sess_expire) VALUES(\'inf2qqekr4mpk2n7smmcmbvo33\',NULL,N\'AppName|s:18:"THOT-1480670689065";THOT-1480670689065|a:2:{s:9:"NOMCLIENT";s:7:"THOTDEV";s:5:"BASES";a:4:{s:7:"BD_AUTH";a:6:{s:8:"typebase";s:5:"MsSql";s:7:"libbase";s:23:"Base d\'authentification";s:4:"host";s:16:"SVW2K8R2SQL1\DEV";s:7:"nombase";s:11:"BD_AUTH_PRF";s:8:"username";s:4:"Gmpi";s:5:"passe";s:24:"eJxTCnAwNS8yLFYCAAsvAlc=";}s:13:"THOTDEVDBUSER";a:9:{s:8:"typebase";s:5:"MsSql";s:7:"libbase";s:18:"Thot dÃƒÂ©v. Proform";s:4:"host";s:16:"SVW2K8R2SQL1\DEV";s:7:"nombase";s:15:"BD_THOT_DEV_THD";s:6:"client";s:7:"PROFORM";s:8:"username";s:10:"thotdbuser";s:5:"passe";s:28:"eJxTKsnIL0lJKi1OLVICAB2JBIk=";s:5:"appli";b:1;s:3:"dev";s:1:"1";}s:7:"THOTDEV";a:10:{s:8:"typebase";s:5:"MsSql";s:7:"libbase";s:18:"Thot dÃƒÂ©v. Proform";s:4:"host";s:16:"SVW2K8R2SQL1\DEV";s:7:"nombase";s:15:"BD_THOT_DEV_THD";s:6:"client";s:7:"PROFORM";s:8:"username";s:4:"Gmpi";s:5:"passe";s:24:"eJxTCnAwNS8yLFYCAAsvAlc=";s:5:"appli";b:1;s:6:"defaut";b:1;s:3:"dev";s:1:"1";}s:4:"LDAP";a:5:{s:8:"typebase";s:4:"Ldap";s:4:"host";s:18:"ldap://172.16.10.1";s:7:"domaine";s:65:"OU=PROFORM - UTILISATEURS ET GROUPES,OU=PROFORM,DC=proform,DC=dom";s:9:"chainecnx";s:8:"_SRVLdap";s:5:"passe";s:28:"eJxTCnYwNi8ziDQuVgIAENEC5w==";}}}\',convert(datetime,\'2016-12-04\') ))';
	echo '<div>'.$sQuery.'</div>';
	$oSession->QryExec($sQuery);
	
	echo '<div>'.var_export($oSession->aExecReq,true).'</div>';
	/*
	$oResult = $oConnect->query();

	if ($oResult!==false) {
		echo '<div>Yesss...</div>';
		
		while($oRecord = $oResult->fetch()) {
			echo var_export($oRecord,true);
			$aRow=array();

			//---- On parcours les champs de l'enregistrement
			foreach($oRecord as $sKey => $sValue) {
				$aRow[] = $sValue;
			}
			
			echo '<div> - '.join($aRow, ', ').'</div>';
		}
	}
	else {
		$aErr = $oConnect->errorInfo();
		echo '<div>Pas bon...</div>';
		error_log(var_export($aErr,true));
	}
	*/
}
else {
	echo 'Session : Connexion BDD Ko';
}

?>