<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Saisie Citation</title>
</head>
<body>
    <h2>Ajouter une citation</h2>
    <form action="recupnouvelle_citation.php" method="GET">
        <fieldset>
            <legend>Informations</legend>
            <br>
            Texte de la citation : <input type="text" size="50" name="citation" required><br><br>
            
            Siècle : <input type="text" size="27" name="siecle"><br><br>

            Auteur : 
            <select name="id_auteur" required>
                <option value="">-- Choisir un auteur --</option>
                <?php
                $MySql_Host = "localhost"; 
                $MySql_User = "root"; 
                $MySql_Passw = "Ndao2004"; 
                $bdd = "exo";

                $conn = mysqli_connect($MySql_Host, $MySql_User, $MySql_Passw, $bdd);

                if (!$conn) {
                    die("Erreur de connexion : " . mysqli_connect_error());
                }

                $query = "SELECT idauteur, nom, prenom FROM auteur ORDER BY nom ASC"; 
                $result = mysqli_query($conn, $query); 

                while($row = mysqli_fetch_array($result)) {
                    // On utilise les noms de colonnes idauteur, prenom et nom
                    echo '<option value="'.$row['idauteur'].'">'.$row['prenom'].' '.$row['nom'].'</option>';
                }

                mysqli_close($conn);
                ?>
            </select>
            <br>
        </fieldset>
        <br>
        <input type="submit" name="val" value="Enregistrer">
    </form>
</body>
</html>