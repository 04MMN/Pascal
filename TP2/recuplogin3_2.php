<?php
session_start();
error_reporting(E_ALL); // Activé pour le debug, à remettre à 0 en production

$nom_user = isset($_GET['nom_user']) ? $_GET['nom_user'] : "";
$mot_de_passe = isset($_GET['mot_de_passe']) ? $_GET['mot_de_passe'] : "";

$_SESSION["nom_user"] = $nom_user;
$_SESSION["mot_de_passe"] = $mot_de_passe;

$MySql_Host = "localhost"; 
$MySql_User = "root"; 
$MySql_Passw = "Ndao2004"; 
$bdd = "exo";
$authentifie = false; // Utilisation d'un booléen clair

// Connexion
$id_connexion = @mysql_connect($MySql_Host, $MySql_User, $MySql_Passw) or die("Erreur de connexion au serveur");
@mysql_select_db($bdd, $id_connexion) or die("Erreur de connexion à la base de données"); 

// Requête
$query = "SELECT nom_user, pass_user FROM utilisateur"; 
$result = mysql_query($query, $id_connexion); 

// Vérification des identifiants
while($row = mysql_fetch_row($result)) { 
    $Nom = $row[0]; 
    $pass = $row[1]; 

    if (strcmp(trim($nom_user), trim($Nom)) == 0 && strcmp(trim($mot_de_passe), trim($pass)) == 0) {
        $authentifie = true;
        break; // On a trouvé le bon utilisateur, on sort de la boucle
    }
} 

// Fermeture de la connexion SQL avant les redirections/affichages
mysql_close($id_connexion);

// Actions selon le résultat de l'authentification
if ($authentifie) {
    include("accueil3.php");
    exit(); // On arrête le script ici pour ne pas charger le reste
} else {
    include("index.html");
    echo '<script>alert("Login ou mot de passe incorrect");</script>';
    exit();
}
?>