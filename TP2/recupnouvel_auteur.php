<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Récupération des données du formulaire
$prenom = isset($_GET['prenomauteur']) ? $_GET['prenomauteur'] : "";
$nom = isset($_GET['nomauteur']) ? $_GET['nomauteur'] : "";
$siecle = isset($_GET['siecle']) ? $_GET['siecle'] : "";

$MySql_Host = "localhost"; 
$MySql_User = "root"; 
$MySql_Passw = "Ndao2004"; 
$bdd = "exo";

// 1. Connexion avec mysqli
$id = mysqli_connect($MySql_Host, $MySql_User, $MySql_Passw, $bdd);

if (!$id) {
    die("Erreur serveur : " . mysqli_connect_error());
}

// 2. Sécurisation des données (pour gérer les apostrophes)
$nom_safe = mysqli_real_escape_string($id, $nom);
$prenom_safe = mysqli_real_escape_string($id, $prenom);
$siecle_safe = mysqli_real_escape_string($id, $siecle);

// 3. Insertion de l'auteur
if (!empty($nom_safe) && !empty($prenom_safe)) {
    $query = "INSERT INTO auteur (nom, prenom, siecle) VALUES ('$nom_safe', '$prenom_safe', '$siecle_safe')";
    $result = mysqli_query($id, $query);

    if ($result) {
        echo '<script>alert("Auteur ajouté avec succès");</script>';
    } else {
        echo "Erreur lors de l'ajout : " . mysqli_error($id);
    }
}

// 4. Fermeture de la connexion
mysqli_close($id);

// Redirection vers l'accueil
include("accueil3.php");
?>