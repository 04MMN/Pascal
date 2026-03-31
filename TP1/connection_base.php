<?php

if (isset($_POST['val'])) {

   
    $nom      = $_POST['nm'];
    $prenom   = $_POST['pr'];
    $age      = $_POST['age'];
    $genre    = $_POST['g'];
    $adresse  = $_POST['ad'];
    $groupe_s = $_POST['gs'];
    $rhesus   = $_POST['rh'];

   
    $host = 'localhost';
    $base = 'tp_web';
    $user = 'root';
    $motdepasse = 'Ndao2004';

    try {
      
        $db = new PDO("mysql:host=$host;dbname=$base;charset=utf8", $user, $motdepasse);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

       
        $sql = "INSERT INTO donnee (nom, prenom, age, genre, adresse, groupe_sanguin, rhesus) 
                VALUES (:nom, :prenom, :age, :genre, :adresse, :gs, :rh)";

        $requete = $db->prepare($sql);

        $requete->execute([
            'nom'     => $nom,
            'prenom'  => $prenom,
            'age'     => $age,
            'genre'   => $genre,
            'adresse' => $adresse,
            'gs'      => $groupe_s,
            'rh'      => $rhesus
        ]);

        echo "<h3 style='color: green;'>Données enregistrées avec succès dans la table 'donnee' !</h3>";

    } catch (PDOException $e) {
        
        die("<h3 style='color: red;'>Erreur : " . $e->getMessage() . "</h3>");
    }

} else {
   
    echo "Accès refusé. Veuillez remplir le formulaire.";
}
?>