<?php
require 'vendor/autoload.php';

header('Content-Type: application/json');

try {
    $url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
    $cliente = new MongoDB\Client($url);
    $bd = $cliente->erp;
    $coleccion = $bd->alumnos;

    
    $data = $_POST;

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

    //COMPROBAMOS SI EXISTE EL ALUMNO
    $existe = $coleccion->findOne(['dni' => $data['dni']]);

    if ($existe) {
        echo json_encode([
            'success' => false,
            'message' => 'El alumno con este DNI ya existe.'
        ]);
        exit;
    }

    //INSERCION NUEVO ALUMNO
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

    //COMPROBAR SI SE INSERTO
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
