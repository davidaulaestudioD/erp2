<?php   
/*
require 'vendor/autoload.php';

header('Content-Type: application/json');

// Configuración de la conexión con MongoDB
$url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
$cliente = new MongoDB\Client($url);

$bd = $cliente->erp;
$coleccion = $bd->alumnos;

// Obtener los datos enviados por POST
$datos = $_POST;

// Eliminar el DNI del array para evitar modificarlo
unset($datos['dni']);

// Filtrar los datos para excluir valores vacíos
$actualizacion = [];
foreach ($datos as $clave => $valor) {
    if (!empty($valor)) { 
        $actualizacion[$clave] = $valor;
    }
}

// Si no hay datos a actualizar, no hacer la operación
if (empty($actualizacion)) {
    echo json_encode(['success' => false, 'message' => 'No se realizaron cambios']);
    exit;
}

try {
    $resultado = $coleccion->updateOne(
        ['dni' => $dniAlumno],
        ['$set' => $actualizacion]
    );

    if ($resultado->getModifiedCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Alumno actualizado correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se realizaron cambios']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
    */

    require 'vendor/autoload.php';

header('Content-Type: application/json');

// Configuración de MongoDB Atlas
$url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
$cliente = new MongoDB\Client($url);
$bd = $cliente->erp;
$coleccion = $bd->alumnos;

// Obtener datos enviados por POST
$dniAlumno = $_POST['dni'] ?? null;

if (!$dniAlumno) {
    echo json_encode(['success' => false, 'message' => 'DNI no proporcionado']);
    exit;
}

// Crear array con los campos a actualizar
$updateData = [];
$camposPermitidos = ['nombre', 'apellidos', 'direccion', 'telefono', 'email', 'formacion', 'promocion', 'foto', 'oferta', 'trabajando'];

foreach ($camposPermitidos as $campo) {
    if (isset($_POST[$campo]) && $_POST[$campo] !== "") {
        $updateData[$campo] = $_POST[$campo];
    }
}

// Si no hay datos para actualizar, salir
if (empty($updateData)) {
    echo json_encode(['success' => false, 'message' => 'No se enviaron datos para actualizar']);
    exit;
}

try {
    // Actualizar el alumno
    $resultado = $coleccion->updateOne(
        ['dni' => $dniAlumno],
        ['$set' => $updateData]
    );

    if ($resultado->getModifiedCount() > 0) {
        // Obtener datos actualizados
        $alumnoActualizado = $coleccion->findOne(['dni' => $dniAlumno], ['projection' => ['_id' => 0]]);

        echo json_encode(['success' => true, 'message' => 'Alumno actualizado correctamente', 'alumno' => $alumnoActualizado]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se realizaron cambios']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
