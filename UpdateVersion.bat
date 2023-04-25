@ECHO OFF
REM mise à jour du fichier de version de la copie de travail

REM si les fichiers existent déjà, on les supprime
if exist .\VersionInfo.txt del .\VersionInfo.txt
if exist .\VersionInfo.xml del .\VersionInfo.xml

REM création du fichier informations de version au format texte
"c:\Program Files\TortoiseSVN\bin\svn.exe" info > VersionInfo.txt

REM création du fichier informations de version au format XML
"c:\Program Files\TortoiseSVN\bin\svn.exe" info --xml > VersionInfo.xml