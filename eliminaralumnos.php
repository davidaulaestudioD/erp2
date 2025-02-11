<?php   
require 'vendor/autoload.php';

header('Content-Type: application/json');

// Configuración de la conexión con MongoDB
$url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
$cliente = new MongoDB\Client($url);

$bd = $cliente->erp;
$coleccion = $bd->alumnos;

$dniAlumno = $_POST['dni'] ?? null;


if (!$dniAlumno) {
    echo json_encode(['success' => false, 'message' => 'DNI no proporcionado']);
    exit;
}

try {
    $resultado = $coleccion->deleteOne(['dni' => $dniAlumno]);

    if ($resultado->getDeletedCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Alumno eliminado correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se encontró un alumno con ese DNI']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>



