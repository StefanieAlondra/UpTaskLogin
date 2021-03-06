<?php
//obtine la pagina actual quer se ejecuta
//obtiene el nombre de la pagina qu elo esta llamndo 
function obtenerPaginaActual(){
    $archivo = basename($_SERVER['PHP_SELF']);//rewgresa el nombre del archivo actual
    $pagina = str_replace(".php", "" , $archivo);//quita el .php
    return $pagina;
}
obtenerPaginaActual();


//++CONSULTAS

//++OBTENER TODOS LOS PROYECTOS
function obtenerProyectos(){
    include 'conexion.php';
    try{
        return $conn->query('SELECT id, nombre FROM proyectos');
    }catch(Exception $e){
        echo "Error! : " . $e->getMessage();
        return false;
    }
}

//++OBTENER EL NOMBRE DEL PROYECTO
function obtenerNombreProyecto($id = null){
    include 'conexion.php';
    try{
        return $conn->query("SELECT  nombre FROM proyectos WHERE id = {$id}");
    }catch(Exception $e){
        echo "Error! : " . $e->getMessage();
        return false;
    }
}

//++OBTENER las clases DEL PROYECTO
function obtenerTareasProyecto($id = null){
    include 'conexion.php';
    try{
        return $conn->query("SELECT  id, nombre, estado FROM tareas WHERE id_proyecto = {$id}");
    }catch(Exception $e){
        echo "Error! : " . $e->getMessage();
        return false;
    }
}



?>