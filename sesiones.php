<?php

//INICIA LA SESION Y GUARDA EL VALOR DEL ROL E INDICA SI ESTA LA SESION INICIADA O NO
session_start();

if (isset($_SESSION["usuario"]) && isset($_SESSION["rol"])) {
    echo json_encode(["sesion_activa" => true, "rol" => $_SESSION["rol"]]);
} else {
    echo json_encode(["sesion_activa" => false]);
}
?>
