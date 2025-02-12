<?php   
require 'vendor/autoload.php';

header('Content-Type: application/json');

$url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
$cliente = new MongoDB\Client($url);
$bd = $cliente->erp;
$coleccion = $bd->alumnos;

//RECOJO EL DNI DEL ALUMNO, SI NO NULL
$dniAlumno = $_POST['dni'] ?? null;

if (!$dniAlumno) {
    echo json_encode(['success' => false, 'message' => 'DNI no proporcionado']);
    exit;
}

//ARRAY CON LA DATA A CAMBIAR
$updateData = [];
$camposPermitidos = ['nombre', 'apellidos', 'direccion', 'telefono', 'email', 'formacion', 'promocion', 'foto', 'oferta', 'trabajando'];

foreach ($camposPermitidos as $campo) {
    if (isset($_POST[$campo]) && $_POST[$campo] !== "") {
        $updateData[$campo] = $_POST[$campo];
    }
}
if (empty($updateData)) {
    echo json_encode(['success' => false, 'message' => 'No se enviaron datos para actualizar']);
    exit;
}

try {
    //ACTUALIZAR EL ALUMNO
    $resultado = $coleccion->updateOne(
        ['dni' => $dniAlumno],
        ['$set' => $updateData]
    );

    //SI SE ACTUALIZO GUARDO LOS NUEVO DATOS EN UNA VARIABLE
    if ($resultado->getModifiedCount() > 0) {
        
        $alumnoActualizado = $coleccion->findOne(['dni' => $dniAlumno], ['projection' => ['_id' => 0]]);

        echo json_encode(['success' => true, 'message' => 'Alumno actualizado correctamente', 'alumno' => $alumnoActualizado]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se realizaron cambios']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
