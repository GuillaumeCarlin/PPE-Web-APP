<?php

/**
 * @author  Hervé VALOT
 * @date    20191204
 * @description     détermine la version de l'application lue dans le fichier VersionInfo.xml généré par le commit SVN
 *
 * @version 2019-12-04 HVT création
 */

// lire le fichier XML VersionInfo.xml
echo $_SERVER['PHP_SELF'];







    $aChemin = explode("/", str_replace("//", "/", $_SERVER['PHP_SELF']));
    $sRacine = str_repeat("../", count($aChemin) - 3);
    $fp = file($sRacine . "VersionInfo.txt");
    foreach ($fp as $lu) {

        if (strstr($lu, "URL")) {
            break;
        }
    }
    $pieces = explode("/", $lu);
    foreach ($pieces as $lu) {

        if (strstr($lu, "%23")) {
            break;
        }
    }

    $iRev = str_replace("%23", "#", $lu);

    foreach ($fp as $lu) {

        if (strstr($lu, "Date de la derni")) {
            break;
        }
    }
    $pieces = explode(":", $lu);
    $sDate = explode("+", $pieces[1] . ':' . $pieces[2] . ':' . $pieces[3]);
    $time = strtotime($sDate[0]);
    $newformat = date('m-d-Y H:i:s', $time);
    //Révision
    foreach ($fp as $lu) {
        if (strstr($lu, "Révision")) {
            break;
        }
    }
    $aRev = explode(':', $lu);
    $aRes = array(
        "iVer" => $iRev,
        "iRev" => $aRev[1],
        "from" => $newformat
    );
    echo $aRes["iVer"];

    return json_encode($aRes);
