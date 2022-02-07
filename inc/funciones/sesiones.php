<?php
//Comprueba si el usuario esta autenticado
function usuario_autenticado(){
    if(!revisar_usuario() ){//Si no te has logeado te manda al login
        header('Location:login.php');
        exit();
    }
}
//Indica si la sesión esta iniciada
function revisar_usuario(){
    return isset($_SESSION['nombre']);
}
session_start();//Ir de una página a otra
usuario_autenticado();
