<?php
//---- Infos à propos d'un formulaire
$sReqInfosForm='select IdFormulaire, Name, dbo.Libelle(sys_mip_form.idlibelle,'.$Bdd->IdLangue.',default) AS Libelle, TopPos, LeftPos, Height, Width, Modal, '.
				'dbo.Libelle((select IdLibelle from sys_libelle where NomLibelle=%2$s),'.$Bdd->IdLangue.',default) AS _Libelle, UtiPrefDetails.ContenuDetails '.
				'from sys_mip_form '.
				'left outer join UtiPreferences on UtiPreferences.NomFormulaire=sys_mip_form.Name and UtiPreferences.IdUtilisateur=%3$s '.
				'left outer join UtiPrefDetails on UtiPrefDetails.IdUtiPref=UtiPreferences.IdUtiPref and UtiPrefDetails.TypePreference=\'FormPosit\' '.
				'where Name =%1$s';

//---- Config des grids d'un formulaire
$sReqGridConfig='SELECT UtiPreferences.IdUtiPref, UtiPrefDetails.ContenuDetails '.
				'FROM UtiPreferences LEFT OUTER JOIN '.
				'UtiPrefDetails ON UtiPrefDetails.IdUtiPref = UtiPreferences.IdUtiPref '.
				'WHERE (UtiPreferences.NomFormulaire = %1$s) AND (UtiPreferences.IdUtilisateur = %2$s) '.
				'AND (UtiPrefDetails.TypePreference = %3$s)';

//---- Libellé liés à un formulaire (par groupe)
$sReqFormLabels='SELECT lower(GroupName.NomLibelle) AS GroupName, lower(LabelName.NomLibelle) AS LabelName, dbo.Libelle(sys_mip_formgrouplib.IdLabel,'.$Bdd->IdLangue.',default) AS Libelle '.
				'FROM sys_mip_formgrouplib INNER JOIN sys_mip_group ON sys_mip_formgrouplib.IdGroup = sys_mip_group.IdGroup '.
				'INNER JOIN sys_libelle AS GroupName ON sys_mip_group.IdLibelle = GroupName.IdLibelle '.
				'INNER JOIN sys_libelle AS LabelName ON sys_mip_formgrouplib.IdLabel = LabelName.IdLibelle '.
				'WHERE (sys_mip_formgrouplib.IdForm = %1$s) order by GroupName asc, LabelName asc';

$sReqCreateBookmark='insert into UtiPreferences (IdUtilisateur, NomFormulaire, Bookmark, IdMenu) values (%1$s, %2$s, 1, %3$s)';
$sReqFindBookmark='select IdUtiPref from UtiPreferences where IdMenu=%1$s and IdUtilisateur=%2$s';

//---- Création d'un widget (formlaire ou composant)
$sReqCreateWidget='INSERT INTO sys_mip_form (Name, TopPos, LeftPos, Height, Width, Modal) '.
					'VALUES (%1$s, %2$s, %3$s, %4$s, %5$s, 0)';
//---- Création d'un group de libellé
$sReqCreateWidgetGroup='INSERT INTO sys_mip_formgroup select %1$s as idformulaire, idgroup from sys_mip_group';
//---- Liste des groupes de libellés
$sReqGroupList='select IdGroup, lower(sys_libelle.NomLibelle) as GroupName '.
				'from sys_mip_group inner join sys_libelle on sys_libelle.IdLibelle=sys_mip_group.IdLibelle';
/*
		'SELECT sys_mip_formgroup.IdFormGroup, LOWER(sys_libelle.NomLibelle) AS GroupName '.
				'FROM sys_libelle RIGHT OUTER JOIN sys_mip_group ON sys_libelle.IdLibelle = sys_mip_group.IdLibelle '.
				'RIGHT OUTER JOIN sys_mip_formgroup ON sys_mip_group.IdGroup = sys_mip_formgroup.IdGroup '.
				'where sys_mip_formgroup.idformulaire=%1$s';
*/
//---- Création d'un libellé (si inexistant et retour de l'Id et Nom)
$sReqCreateLabel='exec dbo.CreeLibelle %1$s, %2$s';
//---- Attachement d'un libellé à un groupe
$sReqAttachLabel='exec dbo.AttachLabel %1$s, %2$s, %3$s';

//---- Detail d'une liste
$ReqDetListe='exec dbo.ListeDetail \'%1$s\', \'%2$s\'';

//---- Update divers
$sReqUpdate='UPDATE %1$s set %2$s where %3$s';
?>
