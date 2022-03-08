
$(document).ready(function(){

    async function getTareas(){

        const result = await $.ajax({
            type: "GET",
            url: "http://localhost:3000/tareas",
            async: true,
            
        });

        return result;
    }

    async function newTarea(tarea){
        const result = await $.ajax({
            type: "POST",
            url: "http://localhost:3000/tareas",
            data: tarea,
            async: true,
            
        });

        return result;
    }

    $('#nuevaTareaBtn').click(async function(e){

        e.preventDefault();

        tarea ={
            "nombre": $('#tareaNombre').val(),
            "descripcion":$('#tareaDescripcion').val(),
            "fechaFin":$('#tareaFechaFin').val(),
            "duracion":$('#tareaDuracion').val(),
            "tiempoRegistrado": "00:00",
            "status": "pendiente"
        }

        const res = await newTarea(tarea);
        render(res);
        //if(key){buscarPorIndex(key);}

    });

    async function renderisarTareas(){
        const res = await getTareas();
        res.forEach(element => {
            render(element);
        });
    }

    function render(element){
        var card = "<div class='col'>\n\
                            <div class='card position-relative shadow'>\n\
                                <div class='card-body'>\n\
                                    <button type='button' class='btn-close position-absolute top-0 end-0'style='margin:1em;' aria-label='Close'></button>\n\
                                    <h5 class='card-title'>"+element.nombre+"</h5>\n\
                                    <p class='card-text'>"+element.descripcion+"</p>\n\
                                </div>\n\
                                <ul class='list-group list-group-flush'>\n\
                                    <li class='list-group-item'>Estado: "+element.status+"</li>\n\
                                    <li class='list-group-item'>Fecha de fin: "+element.fechaFin+"</li>\n\
                                    <li class='list-group-item'>Duracion: "+element.duracion+" min</li>\n\
                                    <li class='list-group-item'>Tiempo registrado: "+element.tiempoRegistrado+"</li>\n\
                                </ul>\n\
                                <div class='card-body mx-auto'>\n\
                                    <button type='button' class='btn btn-outline-primary'>Iniciar</button>\n\
                                    <button type='button' class='btn btn-outline-warning''>Pausar</button>\n\
                                    <button type='button' class='btn btn-outline-danger''>Detener</button>\n\
                                </div>\n\
                            </div>\n\
                        </div>";
                        
        $('#tareasCardsDiv').append(card);
    }

    renderisarTareas();
    
});