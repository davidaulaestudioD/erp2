<?php
require 'vendor/autoload.php'; 
header("Content-Type: application/json");

// Conexión a MongoDB
$url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
$cliente = new MongoDB\Client($url);

$bd = $cliente->erp;
$coleccion = $bd->empresas;

// Se espera que se envíe el ID de la empresa
$id = $_POST['id'] ?? null;
if (!$id) {
    echo json_encode([
        "success" => false,
        "message" => "No se ha proporcionado el ID de la empresa"
    ]);
    exit();
}

// Preparar el arreglo con los campos a actualizar.
// Solo se incluyen aquellos que se envían y que no están vacíos.
$updateFields = [];

if (isset($_POST['nombre']) && trim($_POST['nombre']) !== "") {
    $updateFields['nombre'] = $_POST['nombre'];
}
if (isset($_POST['telefono']) && trim($_POST['telefono']) !== "") {
    $updateFields['telefono'] = $_POST['telefono'];
}
if (isset($_POST['email']) && trim($_POST['email']) !== "") {
    $updateFields['email'] = $_POST['email'];
}
if (isset($_POST['personaContacto']) && trim($_POST['personaContacto']) !== "") {
    $updateFields['personaContacto'] = $_POST['personaContacto'];
}
if (isset($_POST['rama']) && trim($_POST['rama']) !== "") {
    $updateFields['rama'] = $_POST['rama'];
}
if (isset($_POST['ofertas']) && trim($_POST['ofertas']) !== "") {
    $updateFields['ofertas'] = $_POST['ofertas'];
}

if (empty($updateFields)) {
    echo json_encode([
        "success" => false,
        "message" => "No se proporcionaron datos para actualizar"
    ]);
    exit();
}

try {
    // Realizar la actualización en la colección
    $resultado = $coleccion->updateOne(
        ["_id" => new MongoDB\BSON\ObjectId($id)],
        ['$set' => $updateFields]
    );
    if ($resultado->getModifiedCount() > 0) {
        echo json_encode(["success" => true]);
    } else {
        // Puede ocurrir que los datos sean iguales a los existentes
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
