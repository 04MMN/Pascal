<?php
/**
 * ═══════════════════════════════════════════════════
 *  BICO-D — API Backend (api.php)
 *  Base de données : MySQL
 *  Appel : api/api.php?action=NOM_ACTION
 * ═══════════════════════════════════════════════════
 */

// ── Configuration base de données ─────────────────
define('DB_HOST',    'localhost');
define('DB_NAME',    'bicod_db');
define('DB_USER',    'root');    // ← modifier selon votre config
define('DB_PASS',    'Ndao2004');        // ← modifier selon votre config
define('DB_CHARSET', 'utf8mb4');

// ── Headers ────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

// ── Connexion PDO ──────────────────────────────────
function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET,
                DB_USER, DB_PASS,
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]
            );
        } catch (PDOException $e) {
            resp(false, 'Connexion BD impossible : ' . $e->getMessage(), [], 500);
        }
    }
    return $pdo;
}

// ── Helpers ────────────────────────────────────────
function resp(bool $ok, string $msg = '', array $data = [], int $code = 200): void {
    http_response_code($code);
    echo json_encode(array_merge(['success' => $ok, 'message' => $msg], $data), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function ok(array $data = [], string $msg = ''): void  { resp(true,  $msg, $data, 200); }
function err(string $msg, int $code = 400): void        { resp(false, $msg, [],    $code); }

// Récupère un paramètre POST (JSON body ou form-data)
function p(string $key, $default = null) {
    static $body = null;
    if ($body === null) {
        $raw  = file_get_contents('php://input');
        $body = $raw ? (json_decode($raw, true) ?? []) : [];
    }
    return $_POST[$key] ?? $body[$key] ?? $default;
}

function q(string $key, $default = null) { return $_GET[$key] ?? $default; }

// ── Routeur ────────────────────────────────────────
$action = q('action', '');

switch ($action) {

    /* ───────────────────────────────────────────────
     *  AUTH
     * ─────────────────────────────────────────────── */

   case 'login':
        /*
         * POST  api.php?action=login
         * Body  { email, password }
         */
        $email = trim(p('email', ''));
        $pwd   = p('password', '');
        
        if (!$email || !$pwd) err('Email et mot de passe requis.');

        // On récupère l'utilisateur par son email
        $st = db()->prepare('SELECT id, nom, email, role, password FROM users WHERE email = ? LIMIT 1');
        $st->execute([$email]);
        $u = $st->fetch();

        // COMPARAISON EN TEXTE CLAIR (Correction pour insertion manuelle)
        if (!$u || $pwd !== $u['password']) {
            err('Email ou mot de passe incorrect.', 401);
        }

        // On retire le mot de passe avant d'envoyer la réponse pour plus de propreté
        unset($u['password']);
        ok(['user' => $u], 'Connexion réussie.');
        break;




    /*
    creation compte
    */
    case 'register':
        /*
         * POST  api.php?action=register
         * Body  { nom, email, password }
         */
        $nom   = trim(p('nom', ''));
        $email = trim(p('email', ''));
        $pwd   = p('password', '');

        if (!$nom || !$email || !$pwd) err('Tous les champs sont requis.');

        // Vérifier si l'email existe déjà
        $check = db()->prepare('SELECT id FROM users WHERE email = ?');
        $check->execute([$email]);
        if ($check->fetch()) err('Cet email est déjà utilisé.');

        // Insertion avec rôle 'user' par défaut (défini dans le schéma SQL)
        $st = db()->prepare('INSERT INTO users (nom, email, password, role) VALUES (?, ?, ?, "user")');
        $st->execute([$nom, $email, $pwd]);

        ok(['user_id' => (int) db()->lastInsertId()], 'Compte créé avec succès !');
        break;

    /* ───────────────────────────────────────────────
     *  DRONES
     * ─────────────────────────────────────────────── */



    

    case 'get_drones':
        /*
         * GET  api.php?action=get_drones[&status=libre]
         */
        $status = q('status');
        if ($status) {
            $st = db()->prepare('SELECT * FROM drones WHERE status = ? ORDER BY nom');
            $st->execute([$status]);
        } else {
            $st = db()->query('SELECT * FROM drones ORDER BY nom');
        }
        ok(['drones' => $st->fetchAll()]);
        break;

    case 'update_drone_status':
        /*
         * POST  api.php?action=update_drone_status
         * Body  { drone_id, status }   status ∈ libre | mission | maintenance
         */
        $id     = (int) p('drone_id', 0);
        $status = p('status', '');
        if (!$id || !in_array($status, ['libre', 'mission', 'maintenance'])) err('drone_id et status valide requis.');

        $st = db()->prepare('UPDATE drones SET status = ? WHERE id = ?');
        $st->execute([$status, $id]);
        if ($st->rowCount() === 0) err('Drone introuvable.', 404);
        ok([], 'Statut mis à jour.');
        break;

    case 'add_drone':
        /*
         * POST  api.php?action=add_drone  (admin)
         * Body  { nom, type_cap, modele?, prix?, autonomie?, localisation?, description?, proprio_id? }
         */
        $nom  = trim(p('nom',      ''));
        $cap  = trim(p('type_cap', ''));
        if (!$nom || !$cap) err('nom et type_cap sont requis.');

        $st = db()->prepare('
            INSERT INTO drones (nom, type_cap, modele, status, prix, autonomie, localisation, description, proprio_id)
            VALUES (?, ?, ?, "libre", ?, ?, ?, ?, ?)
        ');
        $st->execute([
            $nom, $cap,
            trim(p('modele', '')),
            (float) p('prix', 0),
            (int)   p('autonomie', 0),
            trim(p('localisation', '')),
            trim(p('description', '')),
            ((int) p('proprio_id', 0)) ?: null,
        ]);
        ok(['drone_id' => (int) db()->lastInsertId()], 'Drone ajouté.');
        break;

    /* ───────────────────────────────────────────────
     *  RÉSERVATIONS
     * ─────────────────────────────────────────────── */

    case 'get_reservations':
        /*
         * GET  api.php?action=get_reservations[&user_id=1][&status=attente]
         */
        $where  = [];
        $params = [];
        if ($uid = (int) q('user_id', 0)) { $where[] = 'r.user_id = ?'; $params[] = $uid; }
        if ($st2 = q('status'))            { $where[] = 'r.status = ?';  $params[] = $st2; }

        $sql = 'SELECT r.*, d.nom AS drone_nom, d.type_cap, u.nom AS user_nom
                FROM reservations r
                LEFT JOIN drones d ON d.id = r.drone_id
                LEFT JOIN users  u ON u.id = r.user_id'
             . ($where ? ' WHERE ' . implode(' AND ', $where) : '')
             . ' ORDER BY r.created_at DESC';

        $st = db()->prepare($sql);
        $st->execute($params);
        ok(['reservations' => $st->fetchAll()]);
        break;

    case 'create_reservation':
        /*
         * POST  api.php?action=create_reservation
         * Body  { user_id, drone_id, nom_mission, date_mission, duree?, description? }
         */
        $userId  = (int) p('user_id',  0);
        $droneId = (int) p('drone_id', 0);
        $nom     = trim(p('nom_mission',  ''));
        $date    = p('date_mission', '');
        if (!$userId || !$droneId || !$nom || !$date) err('user_id, drone_id, nom_mission et date_mission requis.');

        // Vérifier disponibilité
        $chk = db()->prepare('SELECT status FROM drones WHERE id = ? LIMIT 1');
        $chk->execute([$droneId]);
        $drone = $chk->fetch();
        if (!$drone)                      err('Drone introuvable.', 404);
        if ($drone['status'] !== 'libre') err('Ce drone n\'est plus disponible.');

        $st = db()->prepare('
            INSERT INTO reservations (user_id, drone_id, nom_mission, date_mission, duree, description, status)
            VALUES (?, ?, ?, ?, ?, ?, "attente")
        ');
        $st->execute([$userId, $droneId, $nom, $date, p('duree', null), trim(p('description', ''))]);
        ok(['reservation_id' => (int) db()->lastInsertId()], 'Demande envoyée. En attente de validation.');
        break;

    case 'valider_reservation':
        /*
         * POST  api.php?action=valider_reservation
         * Body  { reservation_id, action }   action ∈ approuve | rejete
         */
        $resId  = (int) p('reservation_id', 0);
        $act    = p('action', '');
        if (!$resId || !in_array($act, ['approuve', 'rejete'])) err('reservation_id et action (approuve|rejete) requis.');

        $st = db()->prepare('SELECT * FROM reservations WHERE id = ? LIMIT 1');
        $st->execute([$resId]);
        $res = $st->fetch();
        if (!$res) err('Réservation introuvable.', 404);
        if ($res['status'] !== 'attente') err('Cette réservation a déjà été traitée.');

        db()->prepare('UPDATE reservations SET status = ?, updated_at = NOW() WHERE id = ?')->execute([$act, $resId]);

        if ($act === 'approuve') {
            db()->prepare('UPDATE drones SET status = "mission" WHERE id = ?')->execute([$res['drone_id']]);
        }

        ok([], 'Réservation ' . ($act === 'approuve' ? 'approuvée.' : 'rejetée.'));
        break;

    /* ───────────────────────────────────────────────
     *  DÉPÔTS
     * ─────────────────────────────────────────────── */

    case 'get_depots':
        /*
         * GET  api.php?action=get_depots[&user_id=1][&status=attente]
         */
        $where  = [];
        $params = [];
        if ($uid = (int) q('user_id', 0)) { $where[] = 'dep.user_id = ?'; $params[] = $uid; }
        if ($st2 = q('status'))            { $where[] = 'dep.status = ?';  $params[] = $st2; }

        $sql = 'SELECT dep.*, u.nom AS user_nom
                FROM depots dep
                LEFT JOIN users u ON u.id = dep.user_id'
             . ($where ? ' WHERE ' . implode(' AND ', $where) : '')
             . ' ORDER BY dep.created_at DESC';

        $st = db()->prepare($sql);
        $st->execute($params);
        ok(['depots' => $st->fetchAll()]);
        break;

    case 'create_depot':
        /*
         * POST  api.php?action=create_depot
         * Body  { user_id, nom, type_cap, modele?, prix?, autonomie?, localisation?, description? }
         */
        $userId = (int) p('user_id', 0);
        $nom    = trim(p('nom',      ''));
        $cap    = trim(p('type_cap', ''));
        if (!$userId || !$nom || !$cap) err('user_id, nom et type_cap requis.');

        $st = db()->prepare('
            INSERT INTO depots (user_id, nom, type_cap, modele, prix, autonomie, localisation, description, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, "attente")
        ');
        $st->execute([
            $userId, $nom, $cap,
            trim(p('modele', '')),
            (float) p('prix', 0),
            (int)   p('autonomie', 0),
            trim(p('localisation', '')),
            trim(p('description', '')),
        ]);
        ok(['depot_id' => (int) db()->lastInsertId()], 'Drone soumis. En attente de validation.');
        break;

    case 'valider_depot':
        /*
         * POST  api.php?action=valider_depot
         * Body  { depot_id, action }   action ∈ approuve | rejete
         */
        $depotId = (int) p('depot_id', 0);
        $act     = p('action', '');
        if (!$depotId || !in_array($act, ['approuve', 'rejete'])) err('depot_id et action (approuve|rejete) requis.');

        $st = db()->prepare('SELECT * FROM depots WHERE id = ? LIMIT 1');
        $st->execute([$depotId]);
        $depot = $st->fetch();
        if (!$depot) err('Dépôt introuvable.', 404);
        if ($depot['status'] !== 'attente') err('Ce dépôt a déjà été traité.');

        db()->prepare('UPDATE depots SET status = ?, updated_at = NOW() WHERE id = ?')->execute([$act, $depotId]);

        if ($act === 'approuve') {
            // Ajouter le drone à la flotte
            db()->prepare('
                INSERT INTO drones (nom, type_cap, modele, status, prix, autonomie, localisation, description, proprio_id)
                VALUES (?, ?, ?, "libre", ?, ?, ?, ?, ?)
            ')->execute([
                $depot['nom'], $depot['type_cap'], $depot['modele'],
                $depot['prix'], $depot['autonomie'],
                $depot['localisation'], $depot['description'],
                $depot['user_id'],
            ]);
        }

        ok([], 'Dépôt ' . ($act === 'approuve' ? 'confirmé. Drone ajouté à la flotte.' : 'rejeté.'));
        break;

    /* ───────────────────────────────────────────────
     *  STATS
     * ─────────────────────────────────────────────── */

    case 'get_stats':
        /*
         * GET  api.php?action=get_stats
         */
        $db2   = db();
        $stats = ['drones' => [], 'reservations' => [], 'depots' => []];

        foreach ($db2->query("SELECT status, COUNT(*) cnt FROM drones GROUP BY status")->fetchAll() as $r) {
            $stats['drones'][$r['status']] = (int) $r['cnt'];
        }
        $stats['reservations']['total']   = (int) $db2->query("SELECT COUNT(*) FROM reservations")->fetchColumn();
        $stats['reservations']['attente'] = (int) $db2->query("SELECT COUNT(*) FROM reservations WHERE status='attente'")->fetchColumn();
        $stats['depots']['total']         = (int) $db2->query("SELECT COUNT(*) FROM depots")->fetchColumn();
        $stats['depots']['attente']       = (int) $db2->query("SELECT COUNT(*) FROM depots WHERE status='attente'")->fetchColumn();

        ok(['stats' => $stats]);
        break;

    default:
        err('Action inconnue : ' . htmlspecialchars($action), 404);
        break;
}
