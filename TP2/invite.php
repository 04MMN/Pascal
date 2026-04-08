<?php
// On active le rapport d'erreurs pour voir s'il y a un souci de nom de colonne
error_reporting(E_ALL); 
ini_set('display_errors', 1);

$MySql_Host = "localhost"; 
$MySql_User = "root"; 
$MySql_Passw = "Ndao2004"; 
$bdd = "exo";

?>
<meta charset="utf-8">
<?php

// 1. Connexion avec mysqli (obligatoire pour PHP 8)
$id_connexion = mysqli_connect($MySql_Host, $MySql_User, $MySql_Passw, $bdd);

if (!$id_connexion) {
    die("Erreur de connexion : " . mysqli_connect_error());
}

// 2. Requête avec jointure
$query = "SELECT * FROM auteur, citations WHERE auteur.idauteur = citations.idauteur"; 
$result = mysqli_query($id_connexion, $query); 

if ($result) {
    // 3. Récupération des résultats par noms de colonnes
    while($row = mysqli_fetch_array($result)) { 
        // Note : j'utilise 'texte' au lieu de $row[5] pour être sûr de prendre la citation
        echo "« " . htmlspecialchars($row['texte']) . " »<br>";  
        
        echo "D'après " . htmlspecialchars($row['prenom']) . " " . htmlspecialchars($row['nom']) . ", ";
        echo "écrivain du " . htmlspecialchars($row['siecle']) . "e siècle<br><br>"; 
    }
} else {
    echo "Erreur dans la requête : " . mysqli_error($id_connexion);
}

// 4. Fermeture de la connexion
mysqli_close($id_connexion);


?>