<?php
require 'vendor/autoload.php'; 
header("Content-Type: application/json");


$url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
$cliente = new MongoDB\Client($url);

$bd = $cliente ->erp;
$coleccion = $bd->alumnos;

$resultado = $coleccion->find();

$alumnos = iterator_to_array($resultado);


echo json_encode($alumnos);
?>