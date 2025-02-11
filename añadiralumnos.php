<?php
require 'vendor/autoload.php';

header('Content-Type: application/json');

try {
    // Conexión a MongoDB
    $url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
    $cliente = new MongoDB\Client($url);
    $bd = $cliente->erp;
    $coleccion = $bd->alumnos;

    // Obtener los datos JSON enviados desde el frontend
    $data = $_POST;

    // Validar que todos los campos requeridos están presentes
    if (
        empty($data['dni']) || empty($data['nombre']) || empty($data['apellidos']) ||
        empty($data['direccion']) || empty($data['telefono']) || empty($data['email']) ||
        empty($data['formacion']) || empty($data['promocion']) || empty($data['foto'])
    ) {
        echo json_encode([
            'success' => false,
            'message' => 'Todos los campos son obligatorios.'
        ]);
        exit;
    }

    // Verificar si el alumno ya existe (basado en el DNI)
    $existe = $coleccion->findOne(['dni' => $data['dni']]);

    if ($existe) {
        echo json_encode([
            'success' => false,
            'message' => 'El alumno con este DNI ya existe.'
        ]);
        exit;
    }

    // Insertar un nuevo alumno en la colección
    $resultado = $coleccion->insertOne([
        'nombre' => $data['nombre'],
        'apellidos' => $data['apellidos'],
        'dni' => $data['dni'],
        'direccion' => $data['direccion'],
        'telefono' => $data['telefono'],
        'email' => $data['email'],
        'formacion' => $data['formacion'],
        'promocion' => $data['promocion'],
        'oferta' => $data['oferta'],
        'trabajando' => $data['trabajando'],
        'foto' => $data['foto']
    ]);

    // Verificar si la inserción fue exitosa
    if ($resultado->getInsertedCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Alumno añadido correctamente.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al añadir el alumno.'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error en la inserción: ' . $e->getMessage()
    ]);
}
?>
