<?php
$config = include __DIR__ . '/../data/config-internal.php';
$dbConfig = $config['database'];

$port = !empty($dbConfig['port']) ? $dbConfig['port'] : '3306';
$dsn = "mysql:host={$dbConfig['host']};port={$port};dbname={$dbConfig['dbname']};charset=utf8mb4";
$pdo = new PDO($dsn, $dbConfig['user'], $dbConfig['password']);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$hash = password_hash('Password123!', PASSWORD_BCRYPT);
$stmt = $pdo->prepare("UPDATE `user` SET `password` = :hash WHERE `user_name` = 'mohamed'");
$stmt->execute(['hash' => $hash]);

echo "SUCCESS: Updated mohamed password to Password123! Rows affected: " . $stmt->rowCount() . "\n";
