<?php
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
	"mobile"
);

$sRolesPath = '/localParams/roles.json';
$sRolesFile = file_get_contents($oSession->ParentPath . $sRolesPath);
$aObjects = json_decode($sRolesFile);

//---- On cherche si un admin a été définit
$sAdminLogin = '';
$sAdminPassword = '';

if (isset($aObjects->admin)) {
	if (isset($aObjects->admin->login) && isset($aObjects->admin->password)) {
		$sAdminLogin = $aObjects->admin->login;
		$sAdminPassword = json_decode(gzuncompress(base64_decode($aObjects->admin->password)));
	}
}

$aLists = [
	'listroles' => 'exec s_ressource.P_R_RLE_LIST',
	'listteam' => 'exec s_organisation.P_R_EQE_LIST',
	'listcontract' => 'exec s_organisation.P_R_CTT_LIST',
	'listsectionroles' => 'exec s_ressource.P_R_USR_LIST_ROLESECTION @USR_ID=%1$s, @ORG_ID=%2$s',
	'roles' => 'exec s_ressource.P_R_USR_SELECT_ROLE @login = %1$s',
	'sectionusers' => 'exec s_ressource.P_R_RSC_SELECT_SERVICE @RST_CODE=\'USR\', @SAB_ID=%1$s',
	'teamstatus' => 'exec s_ressource.P_R_X_USR_LIST_PRESENCE_ACTIVITE @SAB_ID_STRING=%1$s'
];

$aProc = [
	'useredit' => 'exec s_ressource.P_U_USR_UPDATE_LOGIN @USR_ID = %1$s, @login = %2$s',
	'sectionattrib' => 'exec s_ressource.P_C_RCA_INSERT @RSC_ID=%1$s, @ORG_ID=%2$s, @RLE_ID=%3$s, @PRINCIPAL=%4$s',
	'sectionattribdef' => 'exec s_ressource.P_C_RCA_INSERT @RSC_ID=%1$s, @ORG_ID=%2$s',
	'sectionroleupdate' => 'exec s_ressource.P_U_USR_UPDATE_ROLE @RSC_ID=%1$s, @ORG_ID=%2$s, @RLE_ID_INITIAL=%3$s, @RLE_ID=%4$s, @RCA_ESTPRINCIPAL=%5$s, @EQE_ID = %6$s, @CTT_ID = %7$s',
	'sectionroledelete' => 'exec s_ressource.P_D_RCA_DELETE @RSC_ID=%1$s, @ORG_ID=%2$s, @RLE_ID=%3$s, @PRINCIPAL=%4$s'
]
?>