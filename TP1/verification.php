<?php

$login_saisi = $_POST['log'];
$pwd_saisi   = $_POST['pwd'];

$host = 'localhost';
$base = 'tp_web';
$user = 'root';
$motdepasse = 'Ndao2004';

try {
    $db = new PDO("mysql:host=$host;dbname=$base;charset=utf8", $user, $motdepasse);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    
    $sql = "SELECT * FROM connexion WHERE id = :log AND motdepasse = :pwd";
    $stmt = $db->prepare($sql);
    $stmt->execute([
        'log' => $login_saisi,
        'pwd' => $pwd_saisi
    ]);

    $utilisateur = $stmt->fetch();

    if ($utilisateur) {
        
        header('Location: formulaire.html');
        exit();

    } else {
        
        echo "<h3 style='color:red;'>Login ou mot de passe incorrect.</h3>";
        echo "<a href='login.html'>Retour à la page de connexion</a>";
    }

} catch (PDOException $e) {
    die("Erreur : " . $e->getMessage());
}
?>