<?php
	$this->SysStrTable='SELECT lower(column_name) AS NomChamp, LOWER(data_type) AS TypeChamp, character_maximum_length AS Longueur '.
						'FROM INFORMATION_SCHEMA.columns '.
						'WHERE table_name  = \'%1$s\' '.
						'ORDER BY table_name, ordinal_position';
	
	/*------------------------------------------------------------------------------------
	* Paramètres de l'appli
	*------------------------------------------------------------------------------------*/
	$this->SysLitPrm='SELECT Parametre.CodeParametre, Parametre_Det.CodeDetail, Parametre_Det.Valeur, Parametre.IdParametre, Parametre_Det.IdParametre_Det, Parametre_Det.ModifLe '.
						'FROM Parametre INNER JOIN Parametre_Det ON Parametre.IdParametre = Parametre_Det.IdParametre '.
						'%1$s '.	# WHERE qqchose ou chaine vide
						'ORDER BY Parametre.CodeParametre, Parametre_Det.CodeDetail';

	//---- Ajout d'un paramètre
	$this->SysAjoutParam='insert into parametre (codeparametre) values (%1$s)';

	//---- Ajout d'un détail de paramètre
	$this->SysAjoutParamDet='insert into parametre_det (idparametre,codedetail,valeur,ModifLe) values(%1$s,%2$s,%3$s,%4$s)';

	//---- MAJ d'un détail de paramètre
	$this->SysMajParamDet='update parametre_det set codedetail=%2$s , valeur=%3$s, ModifLe=%4$s where idparametre_det=%1$s';

	/*---------------------------------------------------------------------------------
	* Requêtes concernant les verrous
	*----------------------------------------------------------------------------------*/
	$this->SysLock = array (
		'set'=>'INSERT INTO verrou (NomTable, ValId, Session, Login, PoseLe) VALUES (%1$s, %2$s, %3$s, %4$s, GETDATE())',
		'read'=>'SELECT verrou.IdVerrou, verrou.NomTable, verrou.ValId, verrou.Session, verrou.Login, ltrim(rtrim(Utilisateur.Prenom)) + \' \' + ltrim(rtrim(Utilisateur.Nom)) AS nomprenom, verrou.PoseLe '.	//, %1$s AS Existe '.
				'FROM verrou left outer JOIN Utilisateur ON (verrou.Login = Utilisateur.Login and Utilisateur.Desactive<1) '.
				'where verrou.NomTable=%1$s and verrou.ValId=%2$s',
		'del'=> array(
			# Verrou d'un Id enreg.
			'id'=>'DELETE FROM Verrou WHERE NomTable=%1$s AND ValId=%2$s AND Login=%3$s',
			# Verrous d'une session
			'session'=>'DELETE FROM verrou where Session=\'%1$s\'',
			# Verrous d'une session pour une table donnée
			'table'=>'DELETE FROM verrou where Session=\'%1$s\' AND NomTable=\'%2$s\'',
			# Verrous d'un login
			'login'=>'DELETE FROM verrou where Login=%1$s'
		)
	);
	
	# Pose d'un verrou
	$this->SysSetLock='exec dbo.SetLock %1$s, %2$s, %3$s, %4$s';
	$this->SysPoseVerrou="INSERT INTO Verrou (NomTable, ValId, Session, Login, PoseLe) VALUES (%1s, %2s, %3s, %4s, %5s)";

	//---- Suppression d'un (ou plusieurs) verrou(s)
	$this->SysSuppVerrou=array();
	# Verrou d'un Id enreg.
	$this->SysSuppVerrou["ID"]='DELETE FROM Verrou WHERE NomTable=%1$s AND ValId=%2$s AND Login=%3$s';
	# Verrous d'une session
	$this->SysSuppVerrou["SESSION"]='DELETE FROM verrou where Session=\'%1$s\'';
	# Verrous d'une session pour une table donnée
	$this->SysSuppVerrou["TABLE"]='DELETE FROM verrou where Session=\'%1$s\' AND NomTable=\'%2$s\'';
	# Verrous d'un login
	$this->SysSuppVerrou["LOGIN"]='DELETE FROM verrou where Login=%1$s';

	//---- Lecture d'un verrou
	$this->SysInfosVerrou='SELECT IDVERROU, NOMTABLE, VALID, SESSION, LOGIN, dbo.LibUtilisateur((select idutilisateur from Utilisateur where login=Verrou.Login),\'PN\') AS NomPrenom,POSELE FROM Verrou ';
	$this->SysLitVerrou=$this->SysInfosVerrou.'WHERE NomTable=%1$s AND ValId=%2$s';

	# Lecture d'un verrou mais par son Id
	$this->SysLitVerrouParId=$this->SysInfosVerrou.'WHERE IdVerrou=%1$s';
	
	/*---------------------------------------------------------------------------------
	* Requêtes concernant les formulaires
	*----------------------------------------------------------------------------------*/
	$this->SysInfosFormulaire='SELECT IdFormulaire, Name, dbo.Libelle(sys_mip_form.idlibelle,'.$this->IdLangue.',default) AS Libelle, TopPos, LeftPos, Height, Width, Modal '.
								'FROM sys_mip_form where name in (%1$s)';

	/*---------------------------------------------------------------------------------
	* Requêtes concernant les impressions
	*----------------------------------------------------------------------------------*/
	$this->SysCreeImp='INSERT INTO impressions (Etat, CreeLe, CreePar, Client, ServeurG10, ServeurImp, BaseFP, Imprimante, sParametre, iParametre1, iParametre2, iParametre3, Original, Copie, CopieBis) VALUES ('.
						'%1$s, %2$s, %3$s, %4$s, %5$s, %6$s, %7$s, %8$s, %9$s, %10$s, %11$s, %12$s, %13$s, %14$s, %15$s)';

	/*---------------------------------------------------------------------------------
	* Requêtes concernant les paniers
	*----------------------------------------------------------------------------------*/
	$this->SysSauvePanier=array();
	$this->SysSauvePanier["TETE"]='INSERT INTO Panier (NOMPANIER, IDFORMULAIRE, NOMCHAMP, CREEPAR, CREELE, VISIBILITE) VALUES '.
							'(%1$s, %2$s, %3$s, %4$s, %5$s, %6$s)';
	$this->SysSauvePanier["DETAIL"]='INSERT INTO Panier_Det (IdPanier,Identifiant) VALUES (%1$s, %2$s)';

	$this->SysTrouvePanier='SELECT IdPanier FROM Panier WHERE NomPanier=%1$s AND IdFormulaire=%2$s AND NomChamp=%3$s AND CreePar=%4$s';

	$this->SysSuppPanier='DELETE FROM Panier WHERE IdPanier=%1$s'; //--- Le Trigger s'occupe du détail...
?>
