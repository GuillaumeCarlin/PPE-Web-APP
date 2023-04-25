<?php 
$sAppName = "API-Key";

// Mis la pour éviter les problèmes à la déclaration de variable global d'un autre fichier
/**
 * Liste des procédures stockées que l'on utilise dans la class Key
 */
global $Liste;
$Liste = [
    'getAllKey' => 'EXEC s_systeme.TE_SELECT_ALL_APIKEY_APK',
    'insertKey' => 'EXEC s_systeme.P_U_UPDATE_INSERT_APK @Type = \'Insert\', @Identifiant = %1$s, @Key = %2$s',
    'updateKey' => 'EXEC s_systeme.P_U_UPDATE_INSERT_APK @Type = \'Update\', @Identifiant = %1$s, @Key = %2$s'
];

// Pour le systeme de clé : L'utilisateur rentre une clé dans l'url, cette clé est récupérer puis on lance Verify avec la clé qui return true ou false
//  Pour l'ajout/update de clé : L'utilisateur rentre une clé dans l'url, cette clé est récupérer puis on set la clé dans l'objet Key ensuite on lance update ou createNewKey

class Key
{
    private $Key;
    private $Bdd;
    private $Qry;
    
    function __construct(){
        include_once '..\server\commun\SessionClass.php';
        $this->Bdd = new GestBdd($oSession->AppBase);;

        $this->Qry =[
            'getAllKey' => 'EXEC s_systeme.TE_SELECT_ALL_APIKEY_APK',
            'insertKey' => 'EXEC s_systeme.P_U_UPDATE_INSERT_APK @Type = \'Insert\', @Identifiant = %1$s, @Key = %2$s',
            'updateKey' => 'EXEC s_systeme.P_U_UPDATE_INSERT_APK @Type = \'Update\', @Identifiant = %1$s, @Key = %2$s'
        ];
    }

    /**
     * Permet de générer une nouvelle clé est d'affecter cette clé au paramètre Key de la class
     */
    function createNewKey(){
        $this->Key = uniqid(); //génère l’identifiant unique de 13 caractères, basé sur l’horodatage actuel
        return $this; // Renvoie This pour permettre d'enchaîner les fonctions ($Key->createNewKey()->getKey())
    }

    /**
     * Fonction de Test qui permet de renvoyer une nouvelle clé
     * 
     * @return String Une nouvelle clé 
     */
    function getNewKey(){
        return uniqid();
    }

    /** 
     * Permet d'ajouter une nouvelle clé d'authentification
     *
     * @param Integer Identifiant de la Ressource que l'on veut insérer
     * @param String Clé que l'on lie à la ressource
     */
   function InsertNewKey($Identifiant, $NewKey = NULL){
       if(!isset($NewKey)){ // Il est possbile de ne pas mettre de Clé en paramètre. Dans ce cas la fonction vas crée une nouvelle clé
           $NewKey = uniqid();
       }
       $Resultat = $this->Bdd->QryToArray(sprintf($this->Qry['insertKey'], $this->Bdd->FormatSql($Identifiant, 'N'), $this->Bdd->FormatSql($NewKey, 'C')));
       return $Resultat;
    }

    // Crée une fonction qui permet l'ajout d'une Application (générer 2 fois uniqid) + mettre une variable quands Application + Faire la même pour l'insert

   /**
    * Permet de changer la clé d'une ressource
    *
    * @param Integer Identifiant de la ressource que l'on veut modifier
    * @param String Clé que l'on souhaite mettre
    */
    function updateKey($Identifiant, $NewKey=NULL){
        if(!isset($NewKey)){  // Il est possbile de ne pas mettre de Clé en paramètre. Dans ce cas la fonction vas crée une nouvelle clé
            $NewKey = uniqid();
        }
        $Resultat = $this->Bdd->QryToArray(sprintf($this->Qry['updateKey'], $this->Bdd->FormatSql($Identifiant, 'N'), $this->Bdd->FormatSql($NewKey, 'C')));
        return $Resultat;
    }

    /** 
     * Permet de vérifier que la clé de vérification existe
     * 
     * @param String Clé à vérifier
     * @return Bool True/False
    */
    function Verify($Cle = null){
        if(!isset($Cle)){ // Permet de ne pas avoir d'erreur si on lance l'application sans Clé
            return false;
        }
        $ListeKey = $this->Bdd->QryToArray($this->Qry['getAllKey']);
        foreach ($ListeKey as $key => $value) { // Parcours la liste de toutes les clés (Application + Machine)
            if($value['apk_code'] == $Cle){
                return true;
            }
        }
        return false;
    }


    /**
     * Permet de vérifier que la clé d'une Application existe
     * 
     * @param String Clé à vérifier
     * @return Bool True/False
     */
    function VerifyApp($Cle = null){
        if(!isset($Cle)){ // Permet de ne pas avoir d'erreur si on lance l'application sans Clé
            return false;
        }
        $ListeKey = $this->Bdd->QryToArray(sprintf($this->Qry['getAllKey'] . ' @App = 1'));
        foreach ($ListeKey as $key => $value) { // Parcours la liste des Clés qui dépasse 16 Characters (Clé d'application)
            if($value['apk_code'] == $Cle){
                return true;
            }
        }
        return false;
    }

    /**
     * Permet de vérifier la liste des requêtes disponibles
     */
    function getListe(){
        return $this->Qry;
    }

    /**
     * Getter/Setter du parametre Key de la class
     */
    function getKey(){
        return $this->Key;
    }
    function setKey($Cle){
        $this->Key = $Cle;
        return $this;
    }
}