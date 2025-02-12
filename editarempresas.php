<?php
require 'vendor/autoload.php'; 
header("Content-Type: application/json");

$url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
$cliente = new MongoDB\Client($url);

$bd = $cliente->erp;
$coleccion = $bd->empresas;

//ID EMPRESA, SI NO NULL
$id = $_POST['id'] ?? null;
if (!$id) {
    echo json_encode([
        "success" => false,
        "message" => "No se ha proporcionado el ID de la empresa"
    ]);
    exit();
}

//ARRAY PARA ACTUALIZAR
$actualizar = [];

if (isset($_POST['nombre']) && trim($_POST['nombre']) !== "") {
    $actualizar['nombre'] = $_POST['nombre'];
}
if (isset($_POST['telefono']) && trim($_POST['telefono']) !== "") {
    $actualizar['telefono'] = $_POST['telefono'];
}
if (isset($_POST['email']) && trim($_POST['email']) !== "") {
    $actualizar['email'] = $_POST['email'];
}
if (isset($_POST['personaContacto']) && trim($_POST['personaContacto']) !== "") {
    $actualizar['personaContacto'] = $_POST['personaContacto'];
}
if (isset($_POST['rama']) && trim($_POST['rama']) !== "") {
    $actualizar['rama'] = $_POST['rama'];
}

if (empty($actualizar)) {
    echo json_encode([
        "success" => false,
        "message" => "No se proporcionaron datos para actualizar"
    ]);
    exit();
}

try {
    //ACTUALIZA LOS DATOS
    $resultado = $coleccion->updateOne(
        ["_id" => new MongoDB\BSON\ObjectId($id)],
        ['$set' => $actualizar]
    );
    if ($resultado->getModifiedCount() > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No se realizaron cambios en la empresa"
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
