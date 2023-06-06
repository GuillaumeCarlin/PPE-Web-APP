<?php

$aAPIQry = [
  'listapk' => 's_systeme.P_U_GET_ALL_APK',
  'insertKey' => 'exec s_systeme.P_U_UPDATE_INSERT_APK @Type = \'Insert\', @Identifiant = %1$s, @Key = \'%2$s\'',
  'updateKey' => 'exec s_systeme.P_U_UPDATE_INSERT_APK @Type = \'Update\', @Identifiant = %1$s, @Key = \'%2$s\'',
  'listRscSansKey' => 'exec s_systeme.P_U_SELECT_RSC_SANS_APK'
];