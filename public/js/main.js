
$(document).ready(function(){

    let tareaEnProceso = false;
    let tiempo = {
        minuto: "00",
        segundo: "00"
    };

    async function getTareas(){

        const result = await $.ajax({
            type: "GET",
            url: "http://localhost:3000/tareas",
            async: true,
            
        });

        return result;
    }

    async function getTarea(id){
        const result = await $.ajax({
            type: "Get",
            url: "http://localhost:3000/tareas/"+id,
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


    function actualizarTarea(id, data){
        $.ajax({
            type: "PATCH",
            url: "http://localhost:3000/tareas/"+id,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: 'application/json',
            success: function (response) {
                
            }
        });
    }

    async function filterTarea(filtro){
        const result = await $.ajax({
            type: "Get",
            url: "http://localhost:3000/tareas?"+filtro,
            async: true,
            
        });

        return result;
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

    $('#navCompletadas').on('click', async function (e) {
        e.preventDefault();

        $('#tareasCardsDiv').empty();

        const res = await filterTarea('status=completada');
        res.forEach(element => {
            render(element)
        });
    });

    $('#navEliminadas').on('click', async function (e) {
        e.preventDefault();

        $('#tareasCardsDiv').empty();

        const res = await filterTarea('status=eliminada');
        res.forEach(element => {
            render(element)
        });
    });

    $('#navPendientes').on('click', async function (e) {
        e.preventDefault();
        $('#tareasCardsDiv').empty();
        renderisarTareas();
    });

    $('#buscarTarea').on('click', async function (e) {
        e.preventDefault();

        $('#tareasCardsDiv').empty();

        const res = await filterTarea('nombre='+$('#buscarTareaInput').val());
        res.forEach(element => {
            render(element)
        });
    });
    

    async function renderisarTareas(){
        const res = await getTareas();
        res.forEach(element => {
            if(element.status == "pendiente"){render(element);};
        });
        
    }

    function render(element){
        if(element.status == "pendiente"){
            let card = "<div class='col' id=card"+element.id+">\n\
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
                                        <li class='list-group-item' id=cronometro"+element.id+">Tiempo registrado: "+element.tiempoRegistrado+"</li>\n\
                                    </ul>\n\
                                    <div class='card-body mx-auto'>\n\
                                        <button type='button' class='btn btn-outline-primary' id=btnIniciar"+element.id+">Iniciar</button>\n\
                                        <button type='button' class='btn btn-outline-warning' id=btnPausar"+element.id+" disabled>Pausar</button>\n\
                                        <button type='button' class='btn btn-outline-danger' id=btnDetener"+element.id+" >Detener</button>\n\
                                    </div>\n\
                                </div>\n\
                            </div>";

            $('#tareasCardsDiv').append(card);

            $('#btnBorrar'+element.id).on('click',function(e){
                e.preventDefault();

                let id= '#card'+element.id;
                $(id).remove();
                actualizarTarea(element.id, {"visible":false, "status": "eliminada"});

            });

            $('#btnIniciar'+element.id).on('click',function(e){
                e.preventDefault();

                cronometro(element);

            });

            $('#btnPausar'+element.id).on('click',function(e){
                e.preventDefault();
                tareaEnProceso = false;

                let tiempoFormateado = tiempo.minuto+":"+(tiempo.segundo < 10 && tiempo.segundo != '00' ? '0' + tiempo.segundo : tiempo.segundo);
                actualizarTarea(element.id, {"tiempoRegistrado":tiempoFormateado});

                $(this).prop('disabled', true);
                $('#btnIniciar'+element.id).prop('disabled', false);

            });

            $('#btnDetener'+element.id).on('click',function(e){
                e.preventDefault();
                tareaEnProceso = false;

                let tiempoFormateado = tiempo.minuto+":"+(tiempo.segundo < 10 && tiempo.segundo != '00' ? '0' + tiempo.segundo : tiempo.segundo);
                actualizarTarea(element.id, {"tiempoRegistrado":tiempoFormateado, "status":"completada"});


            });
        }else{
            let card = "<div class='col' id=card"+element.id+">\n\
                            <div class='card position-relative shadow'>\n\
                                <div class='card-body'>\n\
                                    <h5 class='card-title'>"+element.nombre+"</h5>\n\
                                    <p class='card-text'>"+element.descripcion+"</p>\n\
                                </div>\n\
                                <ul class='list-group list-group-flush'>\n\
                                    <li class='list-group-item'>Estado: "+element.status+"</li>\n\
                                    <li class='list-group-item'>Fecha de fin: "+element.fechaFin+"</li>\n\
                                    <li class='list-group-item'>Duracion: "+element.duracion+" min</li>\n\
                                    <li class='list-group-item' id=cronometro"+element.id+">Tiempo registrado: "+element.tiempoRegistrado+"</li>\n\
                                </ul>\n\
                            </div>\n\
                        </div>";

            $('#tareasCardsDiv').append(card);
        }
    }

    async function cronometro(element){

        const tareaTiempo = await getTarea(element.id);
        let tiempoDivido = tareaTiempo.tiempoRegistrado.split(":",2);

        console.log(tiempoDivido);

        if(!tareaEnProceso){

            tareaEnProceso=true;

            tiempo.minuto= tiempoDivido[0]
            tiempo.segundo = tiempoDivido[1]

            
            $('#btnIniciar'+element.id).prop('disabled', true);
            $('#btnPausar'+element.id).prop('disabled', false);


            tiempo_corriendo = setInterval(function(){

                if(tareaEnProceso){

                    tiempo.segundo++;
                    if(tiempo.segundo >= 60)
                    {
                        tiempo.segundo = 0;
                        tiempo.minuto++;
                    }      

                    let text = "Tiempo registrado: "+tiempo.minuto+":"+(tiempo.segundo < 10 ? '0' + tiempo.segundo : tiempo.segundo);

                    $('#cronometro'+element.id).text(text);
                    console.log(tiempo);
                }else{
                    clearInterval(tiempo_corriendo);
                }
            console.log("hello")
            }, 1000);

        }else{
            let alrt = "<div class=' mx-auto alert alert-danger alert-dismissible fade show fixed-bottom' role='alert' style='width:400px'>Ya tienes una tarea en proceso!<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>";
            $('#alertDiv').append(alrt);
        }
    }

    renderisarTareas();
    
});