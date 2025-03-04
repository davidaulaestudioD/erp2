<?php
require 'vendor/autoload.php'; 
header("Content-Type: application/json");

$url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
$cliente = new MongoDB\Client($url);
$bd = $cliente->erp;
$coleccion = $bd->empresas;

$empresaNombre = $_POST['empresaNombre'] ?? null;
$descripcion = $_POST['descripcion'] ?? null;

if (!$empresaNombre || !$descripcion) {
    echo json_encode([
        "success" => false, 
        "message" => "Faltan datos requeridos: se necesita el nombre de la empresa y la descripción de la oferta."
    ]);
    exit();
}

try {
    //ACTUALIZA EL CAMPO OFERTAS PARA AÑADIR LA NUEVA
    $resultado = $coleccion->updateOne(
        [ "nombre" => $empresaNombre ],   // Se busca la empresa por su nombre
        [ '$push' => [ "ofertas" => $descripcion ] ]  // Se añade la descripción al array 'ofertas'
    );
    
    //COMPRUEBA QUE SE MODIFICO
    if ($resultado->getModifiedCount() > 0) {
        echo json_encode([
            "success" => true, 
            "message" => "Oferta añadida correctamente."
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "No se encontró la empresa o la oferta ya estaba presente."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false, 
        "message" => $e->getMessage()
    ]);
}
?>
