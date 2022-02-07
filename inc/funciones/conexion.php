<?php

$conn = new mysqli ('localhost', 'root', 'Morita123', 'uptask');
if($conn->connect_error){
    echo $conn->connect_error;//verifica que este conectada o manda error

}
$conn->set_charset('utf8');//para acentos ene y eso
?>