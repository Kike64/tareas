
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
            data: JSON.stringify(tarea),
            dataType: "json",
            contentType: 'application/json',
            async: true,
            
        });

        render(result);
        return result;
    }

    function borrarTarea(id){
        $.ajax({
            type: "PATCH",
            url: "http://localhost:3000/tareas/"+id,
            data: JSON.stringify({"visible":false}),
            dataType: "json",
            contentType: 'application/json',
            success: function (response) {
                
            }
        });
    }

    $('#nuevaTareaBtn').on('click',async function(e){

        e.preventDefault();

        tarea ={
            "nombre": $('#tareaNombre').val(),
            "descripcion":$('#tareaDescripcion').val(),
            "fechaFin":$('#tareaFechaFin').val(),
            "duracion":$('#tareaDuracion').val(),
            "tiempoRegistrado": "00:00",
            "status": "pendiente",
            "visible": true
        }

        newTarea(tarea);
        

        $("#nuevaTareaForm")[0].reset();
        //if(key){buscarPorIndex(key);}

    });

    

    async function renderisarTareas(){
        const res = await getTareas();
        res.forEach(element => {
            render(element);
        });

        
    }

    function render(element){
        if(element.visible){
            var card = "<div class='col' id=card"+element.id+">\n\
                                <div class='card position-relative shadow'>\n\
                                    <div class='card-body'>\n\
                                        <button type='button' class='borrarTarea btn-close position-absolute top-0 end-0' style='margin:1em;' aria-label='Close' tareaId="+element.id+" id=btnBorrar"+element.id+"></button>\n\
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

            $('#btnBorrar'+element.id).on('click',function(e){
                e.preventDefault();

                var id= '#card'+element.id;
                $(id).remove();
                borrarTarea(element.id);

            });
        }
    }

    renderisarTareas();
    
});