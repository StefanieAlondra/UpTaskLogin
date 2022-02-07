eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);

}

function validarRegistro(e) {
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

    //console.log(usuario + " " + password);

    if (usuario === '' || password === '') {
        //la validacion fallo 
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Ambos campos son obligatorios!'
        })
    } else {
        //Swal.fire({type: 'success',title: 'Correcto',text: 'Tu cuenta ha sido creada!'})
        //ambos campos son correctos, mandar ejecutar ajax

        //datos que se envian al servidor 
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);
        //console.log(datos.get('usuario'));

        //crear llamado a ajax 
        var xhr = new XMLHttpRequest();
        //abrir la conexion.
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);
        //retono de datos 
        xhr.onload = function() {
                if (this.status === 200) {
                    //console.log(JSON.parse(xhr.responseText));
                    var respuesta = JSON.parse(xhr.responseText);
                    console.log(respuesta);
                    //si la respuesta es correcta
                    if (respuesta.respuesta === 'correcto') {
                        //si es un nuevo usuario
                        if (respuesta.tipo === 'crear') {
                            Swal({
                                type: 'success',
                                title: 'Usuario creado',
                                text: 'Tu cuenta ha sido creada correctamente !'
                            });
                        } else if (respuesta.tipo === 'login') {
                            Swal({
                                    type: 'success',
                                    title: 'Login Correcto',
                                    text: 'Preiona OK para abrir el dashboard'
                                })
                                .then(resultado => {
                                    if (resultado.value) {
                                        window.location.href = 'index.php';
                                    }
                                })
                        }
                    } else {
                        //Hubo un error
                        Swal({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'error'
                        });
                    }

                }
            }
            //enviar la peticion
        xhr.send(datos);
    }
}