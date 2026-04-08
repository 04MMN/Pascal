<?php
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'drone_plat'; 
$user = 'root';
$pass = 'Ndao2004'; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => "Connexion échouée: " . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';

if ($action == 'get_all_data') {
    $stmt = $pdo->query("SELECT * FROM drone");
    echo json_encode(['drones' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    exit;
}

if ($action == 'save_mission') {
    $drone_id = $_POST['drone_id'];
    $nom = $_POST['nom_mission'];
    $date = $_POST['date_mission'];

    try {
        $pdo->beginTransaction();
        $ins = $pdo->prepare("INSERT INTO missions (drone_id, nom_mission, date_mission) VALUES (?, ?, ?)");
        $ins->execute([$drone_id, $nom, $date]);

        $upd = $pdo->prepare("UPDATE drone SET status = 'mission' WHERE id = ?");
        $upd->execute([$drone_id]);

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => "Mission enregistrée !"]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}
