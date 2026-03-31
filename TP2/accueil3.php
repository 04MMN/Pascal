<?php
$MySql_Host = "localhost"; 
$MySql_User = "root"; 
$MySql_Passw = "Ndao2004"; 
$bdd = "exo";

$id = mysqli_connect($MySql_Host, $MySql_User, $MySql_Passw, $bdd);

if (!$id) {
    echo "Erreur de connexion : " . mysqli_connect_error();
} else {
    // Requête de jointure
    $query = "SELECT * FROM auteur, citations WHERE auteur.idauteur = citations.idauteur"; 
    $result = mysqli_query($id, $query); 

    if ($result && mysqli_num_rows($result) > 0) {
        echo "<h3>Liste des Citations enregistrées :</h3>";
        while($row = mysqli_fetch_array($result)){ 
            echo "<div style='margin-bottom:15px; border-bottom:1px dashed #ccc;'>";
            echo "« " . htmlspecialchars($row['texte']) . " »<br>";  
            echo "<i>D'après " . htmlspecialchars($row['prenom']) . " " . htmlspecialchars($row['nom']) . " (" . htmlspecialchars($row['siecle']) . "e siècle)</i>";
            echo "</div>";
            
        }
    } else {
        echo "<p>Aucune citation à afficher pour le moment.</p>";
    }
    
    mysqli_close($id);
}

?>

<hr>
<nav>
    <a href="nouvelle_citation.php">Ajouter une citation</a> | 
    <a href="nouvel_auteur.html">Ajouter un auteur</a> | 
    <a href="deconnexion.php" style="color:red;">Déconnexion</a>
</nav>