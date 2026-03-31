<?php
// Activation des erreurs pour le développement
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Récupération des données
$nom_user2 = isset($_GET['nom_user2']) ? $_GET['nom_user2'] : "";
$mot_de_passe2 = isset($_GET['mot_de_passe2']) ? $_GET['mot_de_passe2'] : "";
$conf_mot_de_passe2 = isset($_GET['conf_mot_de_passe2']) ? $_GET['conf_mot_de_passe2'] : "";

$MySql_Host = "localhost"; 
$MySql_User = "root"; 
$MySql_Passw = "Ndao2004"; 
$bdd = "exo";

// Vérification que les champs ne sont pas vides
if ($nom_user2 != "" && $mot_de_passe2 != "" && $conf_mot_de_passe2 != "") {
    
    // Comparaison des mots de passe
    if (strcmp($mot_de_passe2, $conf_mot_de_passe2) !== 0) {
        echo '<script>alert("Les mots de passe entrés ne sont pas identiques");</script>';
        include("creercompte3.html");
        exit(); // On arrête l'exécution ici
    } else {
        // 1. Connexion avec MySQLi (le "i" est obligatoire)
        $id = mysqli_connect($MySql_Host, $MySql_User, $MySql_Passw, $bdd);

        if (!$id) {
            die("Erreur de connexion : " . mysqli_connect_error());
        }

        // 2. Sécurisation des données (pour gérer les apostrophes dans le nom)
        $user_safe = mysqli_real_escape_string($id, $nom_user2);
        $pass_safe = mysqli_real_escape_string($id, $mot_de_passe2);

        // 3. Requête d'insertion
        $query = "INSERT INTO utilisateur (nom_user, pass_user) VALUES ('$user_safe', '$pass_safe')"; 
        $result = mysqli_query($id, $query); 

        if ($result) {
            echo '<script>alert("Compte ajouté avec succès");</script>';
            mysqli_close($id);
            include("index.html");
            exit();
        } else {
            echo "Erreur SQL : " . mysqli_error($id);
            mysqli_close($id);
        }
    }
} else {
    echo '<script>alert("Veuillez remplir tous les champs");</script>';
    include("creercompte3.html");
}
?>