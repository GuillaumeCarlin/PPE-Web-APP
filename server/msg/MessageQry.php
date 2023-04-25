<?php

$aMessageQry = [
  'listobjet' => 'EXEC s_communication.P_R_MSO_LIST',
  'listnotes' => 'EXEC s_communication.P_R_MSG_LIST @SAB_ID_STRING = %1$s',
  'savenote' => 'EXEC s_communication.P_C_MSG_INSERT %1$s',
  'getnotedatabyid' => 'EXEC s_communication.P_R_MSG_SELECT @MSG_ID = %1$s',
  'updatenotebyid' => 'EXEC s_communication.P_U_MSG_UPDATE %1$s',
  'setnotereaden' => 'EXEC s_communication.P_U_MSG_TERMINER @MSG_ID = %1$s'
];