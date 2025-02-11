<?php
require 'vendor/autoload.php'; 
header("Content-Type: application/json");

$url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
$cliente = new MongoDB\Client($url);
$bd = $cliente->erp;
$coleccion = $bd->empresas;

// Filtrar empresas que tengan el campo 'ofertas' y que el array no esté vacío
$cursor = $coleccion->find([
    "ofertas" => ['$exists' => true, '$ne' => []]
]);

$empresas = iterator_to_array($cursor);
echo json_encode($empresas);
?>
