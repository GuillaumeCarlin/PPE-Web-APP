
<?php
/**
 * @author Hervé Valot
 * @description retourne un fichier JSON contenant les informations de version svn de l'application
 * @description nécessite la présence du fichier VersionInfo.txt à la racine de l'application
 * @date 20200901
 */

 //lit le contenu du fichier et place les informations dans un tableau
$aSvnInfo = file("../VersionInfo.txt");

// boucle sur les lignes du tableau pour extraire les informations requises
foreach ($aSvnInfo as $lu) {
    if (strstr($lu, "URL: http")) {
        // on récupère le numéro du TAG svn (dernière chaine de caractère après le dernier /)
        $sTagName = str_replace(array("\n", "\r"), '', substr($lu,strrpos($lu,"/")+1));
    }
    if (strstr($lu, "Revision")) {
        // on récupère le numéro de Révision svn (numéro de commit)
        $aRev = str_replace(array("\n", "\r"), '', explode(':', $lu));
    }
    if (strstr($lu, "Last Changed Author")) {
        // on récupère le nom de l'auteur du commit
        $aAuthor = str_replace(array("\n", "\r"), '', explode(':', $lu));
    }
    if (strstr($lu, "Last Changed Date")) {
        // on récupère la date et l'heure du commit
        $lastChangedDate = explode(":", $lu);
        $sDateTimeInfo = explode("+", $lastChangedDate[1] . ':' . $lastChangedDate[2] . ':' . $lastChangedDate[3]);
        $Date = strtotime($sDateTimeInfo[0]);
        $FormatedDate = date('Y-m-d H:i:s', $Date);
    }
}
// mise en tableau des informations svn
$aSvnInfo = array(
    "Tag" => ltrim($sTagName),
    "Rev" => ltrim($aRev[1]),
    "Date" => $FormatedDate,
    "Author" => ltrim($aAuthor[1])
);
// création du JSON à partir du tableau
echo json_encode($aSvnInfo);