<?php
require 'vendor/autoload.php';
header("Content-Type: application/json");

// Conexión a MongoDB Atlas
$url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
$client = new MongoDB\Client($url);
$db = $client->erp;

// Colecciones para alumnos y empresas
$alumnosColeccion = $db->alumnos;
$empresasColeccion = $db->empresas;

// Recoger los datos enviados por POST
$dni = $_POST['dni'] ?? null;
$nuevaOferta = $_POST['nuevaOferta'] ?? null;
$empresaId = $_POST['empresaId'] ?? null;
$offerIndex = isset($_POST['offerIndex']) ? intval($_POST['offerIndex']) : null;

if (!$dni || !$nuevaOferta || !$empresaId || $offerIndex === null) {
    echo json_encode([
        "success" => false, 
        "message" => "Faltan datos requeridos: se necesitan dni, nuevaOferta, empresaId y offerIndex."
    ]);
    exit();
}

try {
    // 1. Actualizar el alumno: cambiar el campo "trabajando" a la descripción de la oferta.
    $resultadoAlumno = $alumnosColeccion->updateOne(
        [ "dni" => $dni ],
        [ '$set' => [ "oferta" => $nuevaOferta, "trabajando" => "Si" ] ]
    );
    
    // 2. Eliminar la oferta del array "ofertas" de la empresa.
    // 2.a Se "unset" el elemento del array en la posición indicada por offerIndex.
    $resultadoUnset = $empresasColeccion->updateOne(
        [ "_id" => new MongoDB\BSON\ObjectId($empresaId) ],
        [ '$unset' => [ "ofertas.$offerIndex" => 1 ] ]
    );
    
    // 2.b Se hace un $pull para eliminar los valores nulos resultantes del unset.
    $resultadoPull = $empresasColeccion->updateOne(
        [ "_id" => new MongoDB\BSON\ObjectId($empresaId) ],
        [ '$pull' => [ "ofertas" => null ] ]
    );
    
    // Se asume éxito si la operación de alumno se realizó y la operación de pull se ejecutó (getModifiedCount() puede ser 0 si no había oferta en ese índice)
    if ($resultadoAlumno->getModifiedCount() > 0) {
        echo json_encode([
            "success" => true, 
            "message" => "Oferta asignada correctamente."
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "No se pudo asignar la oferta al alumno."
        ]);
    }
    
} catch(Exception $e) {
    echo json_encode([
        "success" => false, 
        "message" => $e->getMessage()
    ]);
}
?>
