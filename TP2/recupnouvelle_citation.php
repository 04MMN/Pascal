<?php
error_reporting(E_ALL); 
ini_set('display_errors', 1);

// RÉCUPÉRATION : On ajoute l'ID de l'auteur ici
$citation = isset($_GET['citation']) ? $_GET['citation'] : "";
$id_auteur = isset($_GET['id_auteur']) ? $_GET['id_auteur'] : "";

$MySql_Host = "localhost"; 
$MySql_User = "root"; 
$MySql_Passw = "Ndao2004"; 
$bdd = "exo";

$id = mysqli_connect($MySql_Host, $MySql_User, $MySql_Passw, $bdd);

if (!$id) {
    die("Erreur de connexion : " . mysqli_connect_error());
}

$date = getdate();
$datesaisie = $date["mday"]."/".$date["mon"]."/".$date["year"];
setcookie("datelastpublication", $datesaisie, time() + 3600*24*365);

// L'insertion ne se fera que si les deux variables sont remplies
if (!empty($citation) && !empty($id_auteur)) {
    
    $citation_safe = mysqli_real_escape_string($id, $citation);
    
    // On utilise l'ID de l'auteur récupéré plus haut
    $query = "INSERT INTO citations (texte, idauteur) VALUES ('$citation_safe', '$id_auteur')";
    $result = mysqli_query($id, $query);

    if($result) {
        echo '<script>alert("Citation enregistrée !");</script>';
    } else {
        echo "Erreur lors de l'insertion : " . mysqli_error($id);
    }
} else {
    echo '<script>alert("Erreur : Veuillez remplir le texte et choisir un auteur.");</script>';
}

mysqli_close($id);

// Redirection vers l'accueil
echo '<script>window.location.href="accueil3.php";</script>';
?>