<?php
	//---- Liste des tables de la base en cours
	$StrLstTables='SELECT TABLE_NAME AS Ident, TABLE_NAME '.
					'FROM INFORMATION_SCHEMA.TABLES '.
					'WHERE TABLE_CATALOG=\'%1$s\' '.
					'ORDER BY TABLE_NAME';

	//---- Liste des champs d'une table
	$StrLstChamps='SELECT lower(column_name) AS NomChamp, LOWER(data_type) AS TypeChamp, character_maximum_length AS Longueur '.
					'FROM INFORMATION_SCHEMA.columns '.
					'WHERE table_name  = \'%1$s\' '.
					'ORDER BY table_name, ordinal_position';

	//---- Clé primaire d'une table
	$StrClePrimaire='EXEC sp_pkeys @table_name=\'%1$s\'';

	//---- Paramètres de l'appli
	$StrLitPrm='SELECT Parametre.CodeParametre, Parametre_Det.CodeDetail, Parametre_Det.Valeur '.
				'FROM Parametre INNER JOIN Parametre_Det ON Parametre.IdParametre = Parametre_Det.IdParametre '.
				'ORDER BY Parametre.CodeParametre, Parametre_Det.CodeDetail';

	//---- Liste des tables de la base
	$StrTables="SELECT TABLES.TABLE_NAME AS NomTable FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'ProForm' ORDER BY TABLE_NAME ";

	//---- Liste des paramètres
	$StrLstParam="SELECT IdParametre, Code, Libelle FROM sys_parametres ORDER BY Libelle";

	//---- Liste des détails d'un paramètre
	$StrLstDetParam="SELECT sys_parametres_det.IdDetail, sys_parametres_det.CodeDetail, sys_parametres_det.Valeur ".
					"FROM sys_parametres_det WHERE IdParametre=%1s ORDER BY CodeDetail";

	//---- Pose d'un verrou sur un enreg.
	/*
	$StrPoseVerrou="INSERT INTO Verrou (NomTable, ValId, Session, Login, PoseLe) VALUES (%1s, %2s, %3s, %4s, %5s)";

	//---- Suppression d'un (ou plusieurs) verrou(s)
	//---- Verrou d'un Id
	$StrSuppVerrou["ID"]='DELETE FROM Verrou WHERE NomTable=%1$s AND ValId=%2$s AND Login=%3$s';
	//---- Verrous d'une session
	$StrSuppVerrou["SESSION"]='DELETE FROM verrou where Session=\'%1$s\'';
	//---- Verrous d'une session pour une table donnée
	$StrSuppVerrou["TABLE"]='DELETE FROM verrou where Session=\'%1$s\' AND NomTable=\'%2$s\'';
	//---- Verrous d'un login
	$StrSuppVerrou["LOGIN"]='DELETE FROM verrou where Login=%1$s';

	//---- Lecture d'un verrou
	$StrInfosVerrou='SELECT IDVERROU, NOMTABLE, VALID, SESSION, LOGIN, dbo.LibUtilisateur((select idutilisateur from Utilisateur where login=Verrou.Login),\'PN\') AS NomPrenom,POSELE FROM Verrou ';
	$StrLitVerrou=$StrInfosVerrou.'WHERE NomTable=%1$s AND ValId=%2$s';

	//---- Lecture d'un verrou mais par son Id
	$StrLitVerrouParId=$StrInfosVerrou.'WHERE IdVerrou=%1$s';
	*/
	
	//--------------------------------------------------------------------------
	// Requêtes concernant la gestion des menus
	//--------------------------------------------------------------------------

	//---- Comptage des options de menu 
	$StrCmptOptMnu="SELECT COUNT(*) AS Nbre FROM sys_menu %1s";
	
	//---- Création d'un nouveau menu
	$StrCreerMenu='INSERT INTO sys_nommenu (Libelle) values (%1$s)';

	//---- Création d'une entrée dans le nouveau menu
	$StrCreerEntree='INSERT INTO sys_menu (NoMenu,idlibelle,IdPere,NumOrdre) values (%1$s,1,0,1)';

	//---- Retrouver l'IdPere d'un menu
	$StrMenuPere='SELECT sys_menu.IdMenu,sys_menu.idlibelle,dbo.Libelle(sys_menu.idlibelle,'.$Bdd->IdLangue.',default)  AS Libelle '.
					'FROM sys_menu '.
					'WHERE IdPere=0 AND sys_menu.numordre=%1$s';

	//---- Options de menu d'un niveau
	# L'intégralité des options
	$StrOptions["TOUT"]='SELECT sys_menu.IdMenu, sys_menu.NoMenu, sys_menu.idlibelle,dbo.Libelle(sys_menu.idlibelle,'.$Bdd->IdLangue.',default)  AS Libelle, sys_menu.actionmenu, sys_menu.image, sys_menu.SepApres, (SELECT count(*) FROM sys_menu Enfants WHERE Enfants.IdPere=sys_menu.IdMenu) AS NbreEnfants, sys_menu.numordre '.
						'FROM sys_menu '.
						'WHERE IdPere=%2$s %3$s order by sys_menu.numordre';

	# en fonction des droits de l'utilisateur connecté
	$StrOptions["SELECT"]='SELECT sys_menu.IdMenu, sys_menu.idlibelle, dbo.Libelle(sys_menu.idlibelle,'.$Bdd->IdLangue.',default)  AS Titre, sys_menu.actionmenu, '.
						'sys_menu.AutresVar, sys_menu.image, sys_menu.PosHaut, sys_menu.PosGauche, sys_menu.Hauteur, sys_menu.Largeur, sys_menu.Resize, '.
						'sys_menu.Modale, sys_menu.DansFrame, sys_menu.SepApres, '.
						'(SELECT count(*) FROM sys_menu Enfants WHERE Enfants.IdPere=sys_menu.IdMenu) AS NbreEnfants, sys_menu.numordre, '.
						'(SELECT count(*) FROM Droit where Droit.TypeDroit=\'OPTMNU\' AND Droit.idEntite=sys_menu.IdMenu AND Droit.IdGroupe IN (SELECT uti_groupe.IdGroupe FROM uti_groupe where uti_groupe.IdUtilisateur=%1$s)) AS Droits ';

	$StrOptions["UTI"]=sprintf($StrOptions["SELECT"],'%1$s').'%4$s '.
						'FROM sys_menu  '.
						'WHERE IdPere=%2$s %3$s '.
						'order by sys_menu.numordre';

	$StrOptions["BOOKMARK"]=sprintf($StrOptions["SELECT"],'%1$s').
						'FROM sys_menu '.
						'where IdMenu in (select idmenu from UtiPreferences where IdUtilisateur=%1$s and bookmark=1) '.
						'and IdMenu in (select idmenu from sys_menu where NoMenu=%2$s) '.
						'order by sys_menu.numordre';

	//---- Liste des groupes ayant des droits sur une omption de menu
	$StrGrpDroit='SELECT Droit.IdDroit, Droit.IdGroupe, groupe.nom '.
				'FROM Droit LEFT OUTER JOIN groupe on groupe.idgroupe=Droit.idgroupe '.
				'WHERE Droit.TypeDroit=\'OPTMNU\' AND Droit.idEntite=%1$s ORDER BY groupe.nom';

	//---- Suppression des groupes sur des options de menu
	$StrSuppGrpOpt='DELETE FROM Droit WHERE Droit.TypeDroit=\'OPTMNU\' AND Droit.idEntite IN (%1$s)';

	//---- Affectation de plusieurs groupe à une option de menu
	$StrAffecteGrpOpt='INSERT INTO Droit (idEntite, TypeDroit, IdGroupe) SELECT %1$s AS idEntite, \'OPTMNU\' AS TypeDroit, groupe.IdGroupe FROM groupe WHERE groupe.IdGroupe IN (%2$s)';

	//---- Liste des options de menu 
	$StrLstOptMnu='SELECT IdMenu, NumOrdre, (SELECT Libelle FROM sys_libelle_Langue WHERE IdLibelle=sys_menu.IdLibelle AND sys_libelle_Langue.IdLangue='.$Bdd->IdLangue.') AS Libelle, '.
					'(SELECT count(*) FROM sys_menu fils WHERE fils.IdPere=sys_menu.IdMenu) AS NbreOption '.
					'FROM sys_menu %1s ORDER BY sys_menu.IdPere, sys_menu.numordre';

	//---- Droits sur une option de menu
	$StrDroitsMenu='SELECT IdGroupe, 0 AS Droit, nom, (select idDroit FROM Droit WHERE Droit.TypeDroit=\'OPTMNU\' AND idEntite=%1$s AND Droit.IdGroupe=groupe.IdGroupe) AS IdMenuDroit '.
					'FROM groupe ORDER BY groupe.nom ';
	
	//---- Application/Suppression d'un droit sur une option de menu
	$StrDroitOpt["DONNE"]='INSERT INTO Droit (idEntite, TypeDroit, IdGroupe) VALUES (%1$s, \'OPTMNU\', %2$s)';
	$StrDroitOpt["RETIRE"]='DELETE FROM Droit WHERE Droit.TypeDroit=\'OPTMNU\' AND idEntite=%1$s AND IdGroupe=%2$s';

	//---- Insérer une option (décalage vers le bas à partir d'une option)
	$StrInsereOpt["AVANT"]='UPDATE sys_menu SET NumOrdre=NumOrdre+1 WHERE IdPere=%1$s AND NumOrdre>=%2$s';
	$StrInsereOpt["APRES"]='UPDATE sys_menu SET NumOrdre=NumOrdre+1 WHERE IdPere=%1$s AND NumOrdre>%2$s';

	//---- Déplacer une option (changement d'IdPere)
	# 1° Trouver le n° ordre maxi sur le noeud de destination
	$StrMoveOpt["NUMORDREMAX"]='select max(numordre) AS MAXNUMORDRE from sys_menu where idpere=%1$s';
	# 2° Modifier l'IdPere et le n° ordre sur l'Item d'origine
	$StrMoveOpt["MOVE"]='UPDATE sys_menu set IdPere=%1$s, NumOrdre=%2$s WHERE IdMenu=%3$s';

	//---- Supprimer une option (décalage vers le bas à partir d'une option)
	$StrSuppOpt='DELETE FROM sys_menu WHERE IdMenu=%1$s';

	//---- Libellé du parent d'une option
	$StrInfosPere="SELECT sys_libelle_Langue.Libelle AS LibParent ".
					"FROM sys_menu INNER JOIN sys_libelle_Langue ON sys_libelle_Langue.IdLibelle = sys_menu.IdLibelle AND IdLangue=".$Bdd->IdLangue." ".
					"WHERE idmenu =%1s";
	//--------------------------------------------------------------------------
	$StrLstListe='exec dbo.LstListe';

	//---- Liste des formulaires 
	$StrLstForm='SELECT sys_formulaire.IdFormulaire, sys_formulaire.NomFormulaire, sys_libelle_Langue.Libelle, sys_formulaire.TypeFormulaire,sys_formulaire.Javascript '.
				'FROM sys_formulaire INNER JOIN sys_libelle_Langue ON sys_libelle_Langue.IdLibelle = sys_formulaire.IdLibelle AND sys_libelle_Langue.IdLangue='.$Bdd->IdLangue.' '.
				'%1$s '.
				'%2$s';
				//'ORDER BY sys_formulaire.NomFormulaire';

	//---- Comptage des barres d'outils
	$StrCmptBOutils='SELECT count(*) AS Nbre FROM sys_boutils %1$s';

	//---- Liste des barres d'outils
	$StrLstBOutils='SELECT * FROM ('.
					'SELECT IdBoutils, Code, libelle, ROW_NUMBER() OVER (ORDER BY %4$s) AS __NumLigne FROM sys_boutils %3$s '.
					') sys_boutils WHERE __NumLigne>=%1$s AND __NumLigne<=%2$s ';

	//---- Liste des barres d'outils (pour la combo auto complétion)
	$StrLstBOutils2="SELECT sys_boutils.IdBoutils, sys_boutils.Libelle ".
					"FROM sys_boutils ".
					"WHERE sys_boutils.libelle LIKE '%1s' ".
					"ORDER BY sys_boutils.libelle ";

	//---- Liste des bouton d'une barre d'outils
	$StrLstBoutons="SELECT sys_boutons.IdBouton, sys_boutons.NomBouton, sys_boutons.NumOrdre, sys_libelle_Langue.Libelle ".
					"FROM sys_boutons LEFT JOIN sys_libelle_Langue ON sys_libelle_Langue.IdLibelle = sys_boutons.IdLibelle ".
					"WHERE IdBoutils=%1s AND idlangue=1".
					"ORDER BY NumOrdre";
	//-- Suppression dce barre d'outils via formulaire
	$StrSupBOutils='DELETE FROM sys_boutils where IDBOUTILS=%1$s';
	
	//---- Liste des barre d'outils rattachées à un formulaire
	$StrLstBOutilsForm="SELECT IdBoutils, Code, Libelle ".
						"FROM sys_boutils WHERE IdBoutils IN (SELECT sys_formboutils.IdBoutils FROM sys_formboutils WHERE sys_formboutils.IdFormulaire=%1s)";
	
	//---- Rattachement d'une barre d'outils à un formulaire
	$StrAttBoutils="INSERT INTO sys_formboutils (IdFormulaire, IdBoutils) VALUES (%1s, %2s)";
	
	//---- Liste des bouton d'une barre d'outils (à partir du formulaire)
	$StrBoutons="SELECT sys_boutils.Code, sys_boutons.NomBouton, ".
				"(SELECT sys_libelle_Langue.Libelle FROM sys_libelle_Langue WHERE sys_libelle_Langue.IdLibelle = sys_boutons.IdLibelle AND sys_libelle_Langue.IdLangue =".$Bdd->IdLangue.") AS Libelle, ".
				"sys_boutons.ImageActif, sys_boutons.ImageInactif, sys_boutons.Action ".
				"FROM sys_boutils INNER JOIN sys_boutons ON sys_boutons.IdBoutils = sys_boutils.IdBoutils ".
				"WHERE sys_boutils.IdBoutils IN (SELECT IdBoutils FROM sys_formboutils WHERE IdFormulaire =%1s) ".
				"ORDER BY sys_boutils.Code, sys_boutons.NumOrdre";

	//---- Infos d'un formulaire
	$StrFormulaire='SELECT sys_formulaire.IdFormulaire, sys_formulaire.TypeFormulaire, sys_formulaire.NomBase, sys_formulaire.IdLibelle, sys_libelle_Langue.Libelle, sys_formulaire.TablePrincipale, sys_formulaire.TableJointure, sys_formulaire.NomId, sys_formulaire.TypeId, sys_formulaire.IncrementAuto, sys_formulaire.NomIdParent, '.
					'sys_formulaire.TypeIdParent, sys_formulaire.TableJointure, sys_formulaire.ZoneBOutils, sys_formulaire.ZoneDialogue, sys_formulaire.ZoneCommune,sys_formulaire.Favoris,sys_formulaire.ZoneValid, sys_formulaire.Boutons, sys_formulaire.GestBoutons, sys_formulaire.HauteurZDial, sys_formulaire.HauteurZCommune, '.
					'(SELECT COUNT( * ) FROM sys_onglet WHERE sys_onglet.IdFormulaire = sys_formulaire.IdFormulaire) AS NbreOnglet, '.
					'sys_formulaire.Validation, sys_formulaire.ApresMaj, sys_formulaire.Maj4D '.
					'FROM sys_formulaire INNER JOIN sys_libelle_Langue ON sys_libelle_Langue.IdLibelle = sys_formulaire.IdLibelle AND IdLangue ='.$Bdd->IdLangue.' '.
					'WHERE %1$s';

	$StrAjoutFicJS='INSERT INTO sys_formjs (IdFormulaire) VALUES(%1$s)';
	$StrModifFicJS='UPDATE sys_formjs SET Repertoire=%1$s, Fichier=%2$s WHERE IdFormJs=%3$s';
	$StrFichiersJS='SELECT IdFormJs, Repertoire, Fichier FROM sys_formjs WHERE IdFormulaire=%1$s';

	//---- Liste des onglets d'un formulaire
	$StrOngForm='SELECT sys_onglet.IdOnglet, sys_onglet.NomOnglet, sys_libelle_Langue.Libelle '.
				'FROM sys_onglet INNER JOIN sys_libelle_Langue ON sys_libelle_Langue.IdLibelle = sys_onglet.IdLibelle AND IdLangue ='.$Bdd->IdLangue.' '.
				//'WHERE sys_onglet.IdFormulaire=(SELECT IdFormulaire FROM sys_formulaire WHERE sys_formulaire.IdFormulaire=%1s) '.
				'WHERE sys_onglet.IdFormulaire=%1$s '.
				'ORDER BY sys_onglet.NumOrdre';

	//---- Comptage des libellés d'un formulaire
	$StrCmptFormLib="SELECT count(*) AS Nbre FROM sys_formlib %1s";
	
	//---- Liste des libellés rattachés à un formulaire (+ les libellés système)
	/*
	$StrLstFormLibEtSys='SELECT sys_libelle.NomLibelle, dbo.Libelle() AS Libelle '. //sys_libelle_Langue.Libelle
						'FROM sys_libelle_Langue RIGHT OUTER JOIN sys_libelle ON sys_libelle.IdLibelle=sys_libelle_Langue.IdLibelle '.
						'WHERE (sys_libelle.NomLibelle LIKE \'SYS_%%\' AND sys_libelle_Langue.IdLangue='.$Bdd->IdLangue.') OR sys_libelle_Langue.IdLibelle IN (SELECT sys_formlib.IdLibelle FROM sys_formlib WHERE sys_formlib.IdFormulaire=%1$s) '.
						'AND (sys_libelle_Langue.IdLangue='.$Bdd->IdLangue.')';
	*/

	$StrLstFormLibEtSys='SELECT sys_libelle.NomLibelle, dbo.Libelle(sys_libelle.IdLibelle,'.$Bdd->IdLangue.',default) AS Libelle '. //sys_libelle_Langue.Libelle
						'FROM sys_libelle '.
						'WHERE (sys_libelle.NomLibelle LIKE \'SYS_%%\') OR sys_libelle.IdLibelle IN (SELECT sys_formlib.IdLibelle FROM sys_formlib WHERE sys_formlib.IdFormulaire=%1$s) ';

	//---- Liste des libellés rattachés à un formulaire (sans les libellés système)
	// Requête utilisée pour la grille du formulaire de saisie de formulaire
	/*
	$StrLstLibDuForm='SELECT sys_formlib.IdFormLib, sys_formlib.IdLibelle, sys_libelle_Langue.Libelle '.
					'FROM sys_formlib INNER JOIN sys_libelle_Langue ON sys_libelle_Langue.IdLibelle=sys_formlib.IdLibelle AND sys_libelle_Langue.IdLangue='.$Bdd->IdLangue.' '.
					'WHERE sys_formlib.IdFormulaire=%1$s';
	*/

	//---- Liste des libellés rattachés à un formulaire (sans les libellés système)
	//	retourne le nom du libellé et le libellé traduit
	$StrLstLibDuForm=array();
	$StrLstLibDuForm["COMMUN"]='SELECT sys_formlib.IdFormLib, sys_libelle.NomLibelle, dbo.Libelle(sys_formlib.IdLibelle,'.$Bdd->IdLangue.',default) AS Libelle '.
								'FROM dbo.sys_formulaire INNER JOIN dbo.sys_formlib on sys_formlib.IdFormulaire=sys_formulaire.IdFormulaire '.
								'INNER JOIN dbo.sys_libelle on sys_libelle.IdLibelle=sys_formlib.IdLibelle %1$s';
	$StrLstLibDuForm["CONDIDFORM"]='WHERE sys_formlib.IdFormulaire=%1$s';
	$StrLstLibDuForm["CONDNOMFORM"]='WHERE sys_formulaire.NomFormulaire=%1$s';

	//---- Rechercher l'existence d'un libellé
	$StrLibExiste='select sys_libelle.NomLibelle, sys_libelle_Langue.Libelle '.
					'from dbo.sys_libelle_Langue '.
					'left join dbo.sys_libelle on sys_libelle.IdLibelle=sys_libelle_Langue.IdLibelle '.
					'where sys_libelle_Langue.Libelle=%1$s and sys_libelle_Langue.IdLangue=1';

	//---- Suppression d'un libellé dans un formulaire
	$StrSuppLibForm='DELETE FROM sys_formlib WHERE IdFormLib=%1$s';

	//---- Liste des champs d'un onglet
	$StrLstChmOng="SELECT sys_champ.IdChamp, sys_champ.NumOrdre, sys_champ.NomChamp, sys_libelle_Langue.Libelle, sys_champ.TypeHTML, sys_champ.TypeSql, '' AS Details ".
					"FROM sys_champ LEFT OUTER JOIN sys_libelle_Langue ON sys_libelle_Langue.IdLibelle = sys_champ.IdLibelle AND IdLangue=".$Bdd->IdLangue.
					" WHERE IdOnglet =%1s ORDER BY NumOrdre";

	//---- Définition des champs d'un formulaire
	$StrChamps='SELECT sys_champ.IdChamp, sys_formulaire.NomFormulaire, sys_onglet.NomOnglet, sys_onglet.NumOrdre, sys_onglet.TypeOnglet, sys_onglet.RemplissageManuel, '.
				'dbo.Libelle(sys_onglet.IdLibelle,'.$Bdd->IdLangue.',default) AS LibOnglet, sys_champ.TableDest, sys_champ.NomChamp, '.
				'dbo.Libelle(sys_champ.IdLibelle,'.$Bdd->IdLangue.',default) AS LibChamp, sys_champ.NumOrdre AS NumOrdreChm, sys_champ.Position, sys_champ.TypeHtml, '.
				'sys_champ.ForcerMajusc, sys_champ.ValDefautVal, sys_champ.ValDefautFnc, sys_champ.GestPanier, sys_champ.NomIdUnique, sys_champ.Tableau, sys_champ.Ligne, sys_champ.Colonne, sys_champ.LargCol, sys_champ.BoutonsNavig, sys_champ.TypeMasque, '.
				'dbo.LibOptLst(\'msk\'+sys_champ.TypeMasque,sys_champ.Masque) AS Masque, '.
				'sys_champ.Obligatoire, sys_champ.TypeSql, sys_champ.Aspect, sys_champ.FichierPhp, sys_champ.NomListe, sys_champ.AjoutLigVide, sys_champ.AjoutLigNonRens, sys_champ.TableLiee, '.
				'sys_champ.NomId, sys_champ.ValeurLiaison, sys_champ.FonctionSQL, sys_champ.ChampLib, sys_champ.NomFormEnreg, sys_champ.LargHaut, sys_champ.SurSelection, sys_champ.Longueur, sys_champ.NombreCaract, sys_champ.Hauteur, sys_champ.Evenements, \'\' AS DetChamp, \'\' AS DetChampAlt, '.
				'sys_champ.NomNoeud, sys_champ.Champs '.
				'FROM sys_champ INNER JOIN sys_onglet ON sys_onglet.IdOnglet = sys_champ.IdOnglet INNER JOIN sys_formulaire ON sys_formulaire.IdFormulaire = sys_onglet.IdFormulaire '.
				'WHERE sys_formulaire.IdFormulaire = %1$s '.
				'ORDER BY sys_onglet.NumOrdre, sys_champ.NumOrdre';

	$StrPrefChamp='SELECT ContenuDetails '.
					'FROM UtiPreferences INNER JOIN UtiPrefDetails ON UtiPrefDetails.IdUtiPref=UtiPreferences.IdUtiPref '.
					'WHERE UtiPreferences.IdUtilisateur=%1$s AND UtiPreferences.NomFormulaire=\'%2$s\' AND UtiPrefDetails.NomChamp=\'%3$s\'';

	//----- Recherche si tableau dans l'onglet
	$StrChampsTable='SELECT nomchamp as ident, nomchamp FROM SYS_CHAMP WHERE TYPEHTML =\'TABLE\' AND IDONGLET= %1$s';

	//---- Toutes les infos d'un champ
	$StrInfosChamp="SELECT * FROM sys_champ WHERE IdChamp=%1s";
	
	//---- Renumérotation vers le bas
	$StrRenumBas="update sys_champ SET NumOrdre=NumOrdre+1 WHERE IdOnglet=%1s AND NumOrdre>=%2s";

	//---- Suppression d'un onglet de formulaire
	# 1° les détails des champs de l'onglet
	$StrSuppOnglet["DETAIL"]='DELETE FROM sys_grid WHERE IdChamp IN (SELECT IdChamp FROM sys_champ WHERE IdOnglet =%1$s)';
	# 2° les champs de l'onglet
	$StrSuppOnglet["CHAMPS"]='DELETE FROM sys_champ WHERE IdOnglet=%1$s';
	# 3° l'onglet
	$StrSuppOnglet["ONGLET"]='DELETE FROM sys_onglet WHERE IdOnglet=%1$s';

	//---- Suppression d'un champ de formulaire
	# 1° Le champ
	$StrSuppChamp["CHAMP"]='DELETE FROM sys_champ WHERE IdChamp=%1$s';
	# 2° Les détails du champ
	$StrSuppChamp["DETAIL"]='DELETE FROM sys_grid WHERE IdChamp=%1$s';

	//---- Liste des colonnes d'une grille 
	$StrGrid='SELECT sys_grid.IdCol, sys_grid.NomCol, sys_grid.NomSql,  sys_grid.NumOrdre, sys_libelle_Langue.Libelle, sys_grid.Largeur, sys_grid.NumOrdreTri,sys_grid.ColNonTriable , sys_grid.SensTri, sys_grid.TypeAff '.
				'FROM sys_grid INNER JOIN sys_libelle_Langue ON sys_libelle_Langue.IdLibelle = sys_grid.idLibelle AND idlangue ='.$Bdd->IdLangue.
				' WHERE idchamp =%1$s ORDER BY sys_grid.NumOrdre';

	//---- Liste les libelles en fonction de l'idenreg (saisie libelle)
	$StrLstLibellesSais='SELECT idlangue,libelle,nomlibelle,idliblangue '.
						'FROM sys_libelle INNER JOIN sys_libelle_langue ON sys_libelle.idlibelle = sys_libelle_langue.idlibelle  '.
						'WHERE sys_libelle.idlibelle=\'%1$s\'';

	//---- Liste des groupes de libellé
	$StrLstGrpLibelles='SELECT IdGroupeLib, Code, sys_libelle_Langue.Libelle '.
						'FROM sys_groupelib INNER JOIN sys_libelle_Langue ON (sys_libelle_Langue.IdLibelle=sys_groupelib.IdLibelle AND sys_libelle_Langue.IdLangue='.$Bdd->IdLangue.') '.
						'ORDER BY %1$s';

	//---- Liste des libellés d'un groupe
	$StrLstLibellesGrp='SELECT sys_grplib_lib.IdGrpLibLib, sys_libelle.NomLibelle, sys_libelle_Langue.Libelle,sys_grplib_lib.IdLibelle '.
						'FROM sys_grplib_lib INNER JOIN sys_libelle on sys_libelle.IdLibelle=sys_grplib_lib.IdLibelle '.
						'INNER JOIN sys_libelle_Langue ON (sys_libelle_Langue.IdLibelle=sys_grplib_lib.IdLibelle AND sys_libelle_Langue.IdLangue='.$Bdd->IdLangue.') '.
						'%1$s ORDER BY %2$s';

	//---- Rattachement d'un libellé à un groupe
	$StrAttLibGroupe='INSERT INTO sys_grplib_lib (IdGroupeLib, IdLibelle) VALUES (%1$s, %2$s)';
	
	// Les Libelles
	$StrCompteLibelles='SELECT count(*) AS Nbre FROM sys_libelle_langue %1$s';
	
	//---- Liste avec les lignes
	$StrLstLibelles='SELECT * FROM '.
					'(SELECT sys_libelle_Langue.IdLibelle, sys_libelle.nomlibelle,sys_libelle_Langue.Libelle, ROW_NUMBER() OVER (ORDER BY %4$s) AS __NumLigne '.
					'FROM sys_libelle_Langue inner join sys_libelle on  sys_libelle.idlibelle = sys_libelle_langue.idlibelle %3$s AND IdLangue= '.$Bdd->IdLangue.') '.
					' _Tbl WHERE __NumLigne>=%1$s AND __NumLigne<=%2$s';

	$StrLstLib="SELECT sys_libelle_Langue.IdLibelle, sys_libelle_Langue.Libelle ".
				"FROM sys_libelle_Langue ".
				"WHERE sys_libelle_Langue.Libelle LIKE '%1s' AND idlangue =".$Bdd->IdLangue.
				" ORDER BY sys_libelle_Langue.Libelle";

	//---- Liste des langues pour les libelles
	$StrLstLangue='exec dbo.LstLangue'; //procedure stockée

	//---- Mise à jour du libelle en fonction de son IdLibelle et IdLangue
	$StrMajLibLangue='UPDATE sys_libelle_langue SET Libelle=%1$s WHERE IdLibelle=%2$s AND Idlangue=%3$s';

	//---- Mise à jour du libelle en fonction de son IdLibLangue
	$MajLibelle='UPDATE sys_libelle_langue SET  Idlangue=%1$s, Libelle=%2$s  WHERE IdLibLangue= %3$s';

	//---- Ajouter un nouveau libelle (...et le trigger crée les 3 langues)
	$StrAjoutLibelle='INSERT INTO sys_libelle (NomLibelle) VALUES (%1$s)';

	//---- Ajouter un nouveau libelle (nouvelle langue)
	$AjoutLangue='INSERT INTO sys_libelle_langue (Idlangue,IdLibelle) VALUES (%1$s,\'%2$s\')';

	//---- supprimer une langue pour un libelle
	$StrDeleteLibLang='DELETE FROM sys_libelle_langue WHERE idliblangue=%1$s';

	//---- Suppression d'un libelle via le formulaire et de toutes les langues
	$StrDeleteEnregLib='DELETE FROM sys_libelle WHERE idlibelle =%1$s';
	$StrDeleteEnregLang='DELETE FROM sys_libelle_langue WHERE idlibelle =%1$s';

	//Suppression d'un groupe de libelles
	$StrDeleteEnregLibGrp='DELETE FROM sys_groupelib WHERE idgroupelib =%1$s';
	//Supression d'un libellé rattaché à un groupe
	$StrDeleteEnregLibRatGrp='DELETE FROM sys_grplib_lib WHERE sys_grplib_lib.IdGrpLibLib=%1$s';
	/*-------------------------------------------------------------------------------------
	* Requêtes concernant les messages
	-------------------------------------------------------------------------------------*/
	$StrLstMessages='SELECT * FROM (SELECT IdMessage, CodeMessage, Description, ROW_NUMBER() OVER (ORDER BY CodeMessage) AS __NumLigne '.
					' FROM sys_message  %1$s ) sys_message '.
					'WHERE __NumLigne>=%2$s AND __NumLigne<=%3$s ';


	$StrCompteMess='SELECT count(*) AS Nbre FROM sys_message %1$s';

	//---- Message dans la langue choisie
	$StrMessage='SELECT * FROM dbo.sys_libelle_Langue '.
				'INNER JOIN dbo.sys_libelle ON sys_libelle.IdLibelle=sys_libelle_Langue.IdLibelle AND sys_libelle_Langue.IdLangue='.$Bdd->IdLangue.
				'WHERE sys_libelle.NomLibelle=\'%1$s\'';

	//----- Suppression d'un message via le formulaire
	$StrSupMessage='DELETE FROM sys_message WHERE  IdMessage =%1$s';

	/*-------------------------------------------------------------------------------------
	* Requêtes concernant les utilisateurs
	*------------------------------------------------------------------------------------*/
	//---- Création d'un utilisateur (avec infos récupérées depuis LDAP)
	$StrCreeUtilisateur='INSERT INTO Utilisateur (Login, IdUtilisateur4D, Nom, Prenom, AdresseEMail, PassWd) VALUES (%1$s, 0, %2$s, %3$s, %4$s, HASHBYTES(\'SHA1\',CONVERT(nvarchar(4000),\'0\')))';

	//---- Infos sur un utilisateur
	$StrUtilisateurBase='SELECT utilisateur.IdUtilisateur, utilisateur.Login, utilisateur.Nom, utilisateur.Prenom, utilisateur.TypeUser, utilisateur.ExpirationPassWd, utilisateur.IdLangue, utilisateur.IdUtilValideur, utilisateur.AdresseEmail FROM utilisateur ';
	$StrUtilisateurLogin=$StrUtilisateurBase.' WHERE utilisateur.login=\'%1$s\' and utilisateur.Desactive<1';
	$StrUtilisateurId=$StrUtilisateurBase.' WHERE utilisateur.IdUtilisateur=%1$s';
	$StrUtilisateur=$StrUtilisateurBase.' WHERE utilisateur.login=\'%1$s\' AND utilisateur.passwd=HASHBYTES(\'SHA1\',CONVERT(nvarchar(4000),\'%2$s\'))';

	$StrGroupesUti='SELECT uti_groupe.IdGroupe, groupe.nom, groupe.AdminAppli '.
					'FROM dbo.uti_groupe INNER JOIN dbo.groupe on groupe.idGroupe=uti_groupe.IdGroupe '.
					'WHERE uti_groupe.IdUtilisateur=%1$s';

	$StrIsReferent='select count(*) AS Nbre from service where idutilreferent=%1$s';
	$StrMajPassWd='UPDATE Utilisateur set PassWd=HASHBYTES(\'SHA1\',CONVERT(nvarchar(4000),\'%2$s\')), ExpirationPassWd=\'%3$s\' WHERE login=\'%1$s\'';

	$StrLibForm='SELECT NOMFORMULAIRE, LIBELLE FROM SYS_FORMULAIRE INNER JOIN sys_libelle_Langue ON sys_libelle_Langue.IDLIBELLE = SYS_FORMULAIRE.IDLIBELLE AND IDLANGUE = '.$Bdd->IdLangue.' '.
				'WHERE NOMFORMULAIRE IN (%1$s)';


	$StrTexteMail='SELECT dbo.Libelle((select sys_libelle.IdLibelle from dbo.sys_libelle where sys_libelle.NomLibelle=\'%1$s\'),1,default) AS objet, '.
					'dbo.Libelle((select sys_libelle.IdLibelle from dbo.sys_libelle where sys_libelle.NomLibelle=\'%2$s\'),1,default) AS texte, '.
					'dbo.Libelle((select sys_libelle.IdLibelle from dbo.sys_libelle where sys_libelle.NomLibelle=\'CLIQUEZICI\'),1,default) AS cliquezici';
?>
