eventListeners();
//lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {

    //document ready 
    document.addEventListener('DOMContentLoaded', function() {
        actualizarProgreso();
    });

    //Boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    //Boton prara una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    //Botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);

}

function nuevoProyecto(e) {
    e.preventDefault();
    console.log('Presionaste el nuevo proyecto');


    //crea un input para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    //seleccionar el ID  con el nuevo proyecton
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    //al presionar enter crear nuevo proyecto
    inputNuevoProyecto.addEventListener('keypress', function(e) {
        //console.log(e);
        var tecla = e.which || e.keyCode;
        if (tecla === 13) {
            // console.log('presionaste enter')
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });
}

function guardarProyectoDB(nombreProyecto) {
    //++ crear ajax
    var xhr = new XMLHttpRequest();

    //enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    //++ abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    //++el la carga
    xhr.onload = function() {
        if (this.status === 200) {
            //console.log(JSON.parse(xhr.responseText));
            //obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

            //comprobar la insercion
            if (resultado === 'correcto') {
                //fue exitoso
                if (tipo === 'crear') {
                    //se creo nuevo proyecto
                    //inyectar en el html
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                        ${proyecto}
                        </a>
                    `;
                    //agregar al html
                    listaProyectos.appendChild(nuevoProyecto);
                    //enviar alerta
                    Swal({
                            type: 'success',
                            title: 'El proyecto: ' + proyecto + ' se creo correctamente.',
                            text: 'success'
                        })
                        .then(resultado => {
                            //redireccionar a la nueva url
                            if (resultado.value) {
                                window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                            }
                        });

                } else {
                    //se actualizo o elimino 
                }

            } else {
                //hubo un error
                Swal({
                    type: 'error',
                    title: 'Hubo un error',
                    text: 'error'
                });
            }


        }

    }

    //++enviar el request
    xhr.send(datos);
}

//++agregar una nueva tarea al proyecto actual
function agregarTarea(e) {
    e.preventDefault();
    //console.log('Click en el enviar');
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    //validar que el campo tenga algo escrito 
    if (nombreTarea === '') {
        swal({
            title: 'Error',
            text: 'Una tarea no puede estar vacia',
            type: 'error'
        });
    } else {
        //la tarea tiene balgo, insertar en php
        //crear llamado a ajax
        var xhr = new XMLHttpRequest();

        //crear form-data
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        //Abrir la  conexion
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        //ejecutarlo y respuesta
        xhr.onload = function() {
                if (this.status === 200) {
                    //todo correcto
                    var respuesta = JSON.parse(xhr.responseText);
                    //console.log(respuesta);
                    //asignar valores
                    var resultado = respuesta.respuesta,
                        tarea = respuesta.tarea,
                        id_insertado = respuesta.id_insertado,
                        tipo = respuesta.tipo;

                    if (resultado === 'correcto') {
                        //se agrego correctamente 
                        if (tipo === 'crear') {
                            //lanzar alerta
                            Swal({
                                type: 'success',
                                title: 'Tarea Creada',
                                text: 'La tarea: ' + tarea + ' se creo correctamente'
                            });

                            //seleccionar el parrafo con la lista vacia
                            var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                            if (parrafoListaVacia.length > 0) {
                                document.querySelector('.lista-vacia').remove();
                            }


                            //constrruir el template 
                            var nuevaTarea = document.createElement('li');
                            //agregamos el ID
                            nuevaTarea.id = 'tarea:' + id_insertado;
                            //agregamos la clase tarea 
                            nuevaTarea.classList.add('tarea');
                            //construir en el html
                            nuevaTarea.innerHTML = `
                             <p>${tarea}</p>
                             <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                             `;
                            //agregarlo al HTML
                            var listado = document.querySelector('.listado-pendientes ul');
                            listado.appendChild(nuevaTarea);
                            //limpiar el formulario
                            document.querySelector('.agregar-tarea').reset();

                            //actualizar progreso
                            actualizarProgreso();

                        }
                    } else {
                        //hubo un error 
                        Swal({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'error'
                        });
                    }
                }
            }
            //enviar la consulta
        xhr.send(datos);
    }
}
//Cambia el estado de las tareas o  las elimina
function accionesTareas(e) {
    e.preventDefault();
    //console.log('click en listado');
    if (e.target.classList.contains('fa-check-circle')) {
        //console.log('editar');
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);

        }
    }
    if (e.target.classList.contains('fa-trash')) {
        //console.log('eliminar');
        Swal({
            title: 'Estas seguro que lo quieres borrar?',
            text: "esta accion no es reversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'SI, borrar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;

                //borrar bd 
                eliminarTareaBD(tareaEliminar);


                //borrar html
                //console.log(tareaEliminar);
                tareaEliminar.remove();


                Swal(
                    'Eliminado!',
                    'La tarea fue eliminada.',
                    'success'
                )
            }
        })

    }
}

//completa o descompleta una tarea
function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(":");
    //console.log(idTarea[1]);
    //crear llamado a ajax
    var xhr = new XMLHttpRequest();
    //informacion
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    //console.log(estado); 0-1
    datos.append('estado', estado);

    // abrir la conexion 
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    //on load
    xhr.onload = function() {
            if (this.status == 200) {
                console.log(JSON.parse(xhr.responseText));
                //actualizar progreso
                actualizarProgreso();

            }
        }
        //enviar la consulta
    xhr.send(datos);


}

//eliminar de la base de datos
function eliminarTareaBD(tarea) {
    // console.log(tarea);
    var idTarea = tarea.id.split(":");


    //crear llamado a ajax
    var xhr = new XMLHttpRequest();

    //informacion
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');


    // abrir la conexion 
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //on load
    xhr.onload = function() {
            if (this.status == 200) {
                console.log(JSON.parse(xhr.responseText));

                //comprobar que haya tareas restantes 
                var listaTareasRestantes = document.querySelectorAll('li.tarea');
                if (listaTareasRestantes.length === 0) {
                    document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>no hay tareas en este proyecto</p>";
                }
                //actualizar progreso
                actualizarProgreso();

            }
        }
        //enviar la consulta
    xhr.send(datos);

}
//actualiza el avance del proyecto 
function actualizarProgreso() {
    //obtener todas las tareas 
    const tareas = document.querySelectorAll('li.tarea');

    //obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    //determinar el avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
    //console.log(avance);

    //asignar el avance a la barra
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance + '%';

    //alerta de 100%
    if (avance === 100) {
        Swal({
            type: 'success',
            title: 'Felicidades !!!!',
            text: 'Haz terminado tu proyecto'
        });

    }

}