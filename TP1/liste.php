<?php

$host = 'localhost';
$base = 'tp_web';
$user = 'root';
$motdepasse = 'Ndao2004';

try {
    $db = new PDO("mysql:host=$host;dbname=$base;charset=utf8", $user, $motdepasse);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $reponse = $db->query("SELECT * FROM donnee");
    $personnes = $reponse->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Erreur : " . $e->getMessage());
}
?>

<html>
<body>
    <h2>Liste des personnes enregistrées</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
        <thead>
            <tr style="background-color: #ddd;">
                <th>Prénom</th>
                <th>Nom</th>
                <th>Age</th>
                <th>Genre</th>
                <th>Adresse</th>
                <th>Groupe Sanguin</th>
                <th>Rhesus</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($personnes as $p): ?>
                <tr>
                    <td><?php echo $p['prenom']; ?></td>
                    <td><?php echo $p['nom']; ?></td>
                    <td><?php echo $p['age']; ?></td>
                    <td><?php echo $p['genre']; ?></td>
                    <td><?php echo $p['adresse']; ?></td>
                    <td><?php echo $p['groupe_sanguin']; ?></td>
                    <td><?php echo $p['rhesus']; ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <br>
    <a href="formulaire.html">Ajouter une autre personne</a>
</body>
</html>