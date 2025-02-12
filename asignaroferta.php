<?php
require 'vendor/autoload.php';
header("Content-Type: application/json");

$url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
$client = new MongoDB\Client($url);
$db = $client->erp;

$alumnosColeccion = $db->alumnos;
$empresasColeccion = $db->empresas;

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
    //ACTUALIZAR EL CAMPO TRABAJANDO Y OFERTAS DEL ALUMNO
    $resultadoAlumno = $alumnosColeccion->updateOne(
        [ "dni" => $dni ],
        [ '$set' => [ "oferta" => $nuevaOferta, "trabajando" => "Si" ] ]
    );
    
    //ELIMINAR LA OFERTA DEL ARRAY OFERTAS
    $resultadoUnset = $empresasColeccion->updateOne(
        [ "_id" => new MongoDB\BSON\ObjectId($empresaId) ],
        [ '$unset' => [ "ofertas.$offerIndex" => 1 ] ]
    );
    
    //SE BORRAN LAS OFERTAS CON NULL DE VALOR
    $resultadoPull = $empresasColeccion->updateOne(
        [ "_id" => new MongoDB\BSON\ObjectId($empresaId) ],
        [ '$pull' => [ "ofertas" => null ] ]
    );
    
    //COMPROBAR SI SE APLICARON LAS MODIFICACIONES
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
