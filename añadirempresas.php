<?php
require 'vendor/autoload.php'; 
header("Content-Type: application/json");

$url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
$cliente = new MongoDB\Client($url);

$bd = $cliente->erp;
$coleccion = $bd->empresas;

// Recoger los datos enviados por POST
$nombre = $_POST['nombre'] ?? null;
$telefono = $_POST['telefono'] ?? null;
$email = $_POST['email'] ?? null;
$personaContacto = $_POST['personaContacto'] ?? null;
$rama = $_POST['rama'] ?? null;
$ofertas = $_POST['ofertas'] ?? [];

// Validar que se hayan recibido los campos obligatorios
if (!$nombre || !$telefono || !$email || !$personaContacto || !$rama) {
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos requeridos para añadir la empresa."
    ]);
    exit();
}

// Crear el documento a insertar
$documento = [
    "nombre" => $nombre,
    "telefono" => $telefono,
    "email" => $email,
    "personaContacto" => $personaContacto,
    "rama" => $rama,
    "ofertas" => $ofertas
];

try {
    $resultado = $coleccion->insertOne($documento);
    if ($resultado->getInsertedCount() == 1) {
        echo json_encode([
            "success" => true,
            "id" => (string)$resultado->getInsertedId()  // Se convierte a cadena para mayor comodidad
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No se pudo añadir la empresa."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
