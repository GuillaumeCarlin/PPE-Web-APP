<?php

$aStatistiqueQry = [
  'listuser' => 'exec s_ressource.P_R_USR_RAPPORT_LIST',
  'listequipe' => 'exec s_rapport.RAPPORT_HORRAIRE_PAR_DATE',
  'listinfopersonne' => 'exec s_rapport.P_R_List_ACT_USR @date =  %1$s, @Identifiant = %2$s',
  'listinfopersonned' => 'exec s_rapport.P_R_List_ACT_USR_DETAIL @date =  %1$s, @Identifiant = %2$s',
  'gettoleranceparam' => 'exec s_systeme.P_R_PPE_LIST_TOLERANCE',
  'listalerte' => 'exec s_rapport.P_R_List_Alerte @TypeAlerte = %1$s, @Org = 3',
  'getdate' => 'SELECT s_temps.F_S_SELECT_DATE_PROD_PREC() AS date'
];