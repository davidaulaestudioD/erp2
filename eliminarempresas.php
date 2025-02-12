<?php
require 'vendor/autoload.php'; 
header("Content-Type: application/json");

$url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
$cliente = new MongoDB\Client($url);

$bd = $cliente->erp;
$coleccion = $bd->empresas;

//GUARDO EL ID SI NO NULL
$id = $_POST['id'] ?? null;
if (!$id) {
    echo json_encode(["success" => false, "message" => "No se ha proporcionado el ID de la empresa"]);
    exit();
}

try {
    //ELIMINAR EMPRESA
    $resultado = $coleccion->deleteOne(["_id" => new MongoDB\BSON\ObjectId($id)]);
    if ($resultado->getDeletedCount() > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "No se encontró ninguna empresa con ese ID"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
