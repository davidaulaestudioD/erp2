<?php
session_start();

if (isset($_SESSION["usuario"]) && isset($_SESSION["rol"])) {
    echo json_encode(["sesion_activa" => true, "rol" => $_SESSION["rol"]]);
} else {
    echo json_encode(["sesion_activa" => false]);
}
?>
