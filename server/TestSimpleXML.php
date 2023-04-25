<?php

/**
 * TEST de transformation XML -> JSON
 * utilisation de la librairie simpleXML (installée par défaut avec PHP)
 *
 * 2019-07-22 12:06:08 : TEST OK, conversion XML->JSON = OK
 */
$xmlstring = '<SQL_ACTION>
  <T>
    <SQL_DML_ACTION>INSERT</SQL_DML_ACTION>
    <GAM_CODE>30909</GAM_CODE>
    <GAM_REFEXT>30909</GAM_REFEXT>
    <GAM_LIBELLE>2-3-18-1074-02E 76,2x0,5</GAM_LIBELLE>
  </T>
  <T>
    <SQL_DML_ACTION>INSERT</SQL_DML_ACTION>
    <GAM_CODE>30910</GAM_CODE>
    <GAM_REFEXT>30910</GAM_REFEXT>
    <GAM_LIBELLE>2-3-18-1074-02B 76,2x0,5</GAM_LIBELLE>
  </T>
  <T>
    <SQL_DML_ACTION>INSERT</SQL_DML_ACTION>
    <GAM_CODE>30911</GAM_CODE>
    <GAM_REFEXT>30911</GAM_REFEXT>
    <GAM_LIBELLE>2-3-18-1074-02C-D 76,2x0</GAM_LIBELLE>
  </T>
  <T>
    <SQL_DML_ACTION>INSERT</SQL_DML_ACTION>
    <GAM_CODE>30912</GAM_CODE>
    <GAM_REFEXT>30912</GAM_REFEXT>
    <GAM_LIBELLE>104/69 E2       L105 *</GAM_LIBELLE>
  </T>
  <T>
    <SQL_DML_ACTION>INSERT</SQL_DML_ACTION>
    <GAM_CODE>30913</GAM_CODE>
    <GAM_REFEXT>30913</GAM_REFEXT>
    <GAM_LIBELLE>104  / 69 E2     L105</GAM_LIBELLE>
  </T>
</SQL_ACTION>';

$xml = simplexml_load_string($xmlstring);
$json = json_encode($xml);
$array = json_decode($json, TRUE);
echo ($xmlstring);
echo ('</br>');
echo ('</br>');
echo ($json);