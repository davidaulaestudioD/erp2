<?php
require 'vendor/autoload.php'; 
header("Content-Type: application/json");

$url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
$cliente = new MongoDB\Client($url);

$bd = $cliente->erp;
$coleccion = $bd->empresas;

//RECOGER DATOS
$nombre = $_POST['nombre'] ?? null;
$telefono = $_POST['telefono'] ?? null;
$email = $_POST['email'] ?? null;
$personaContacto = $_POST['personaContacto'] ?? null;
$rama = $_POST['rama'] ?? null;
$ofertas = $_POST['ofertas'] ?? [];

if (!$nombre || !$telefono || !$email || !$personaContacto || !$rama) {
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos requeridos para añadir la empresa."
    ]);
    exit();
}

//ARRAY PARA AÑADIR
$documento = [
    "nombre" => $nombre,
    "telefono" => $telefono,
    "email" => $email,
    "personaContacto" => $personaContacto,
    "rama" => $rama,
    "ofertas" => $ofertas
];

try {
    //INSERCION
    $resultado = $coleccion->insertOne($documento);
    //COMPROBAR INSERCION
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
