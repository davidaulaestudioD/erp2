$(document).ready(function () {
    $btnAlumnos = $(".alumnos"); //Boton de alumnos
    $contenedorMenu = $("#botones");


    $('.alumnos').on('click',function(){
        $contenedorMenu.hide();
        $("h1").hide();
        
    });

    $("#volver-menu").on('click', function() {
        $(".contenedor-alumnos").hide();
        $("#botones").show();
        $("h1").show();
    });

    $("#volver-menu-empresas").on("click", function(){
        $(".contenedor-empresas").hide();
        $("#botones").show();
        $("h1").show();
    });

    $(".logo").on("click", function (){
        location.reload();
    });

    //Botones menu header
    $(".opcionMenuAlumnos").on("click", function (){
        $(".contenedor-empresas").hide();
        $(".contenedor-bolsa").hide();
        $("#tarjetas-alumnos-oferta").hide();
        $btnAlumnos.trigger("click");
    });
    $(".opcionMenuEmpresas").on("click", function (){
        $(".contenedor-alumnos").hide();
        $(".contenedor-bolsa").hide();
        $("#tarjetas-alumnos-oferta").hide();
        $btnEmpresas.trigger("click");
    });
    $(".opcionMenuBolsa").on("click", function (){
        $(".contenedor-alumnos").hide();
        $(".contenedor-empresas").hide();
        $(".bolsa").trigger("click");
    });





    
    //BOTON PARA SECCION DE ALUMNOS

    $btnAlumnos.on('click', function () {

        //MOSTRAR TODOS LOS ALUMNOS
        $(".contenedor-alumnos").show();
        
        $.ajax({
            url: 'listaralumnos.php',
            type: 'GET',
            dataType: "json", 
            success: function (data) {
                //console.log(data);
                $("#tarjetas").empty(); //VACIA EL CONTENEDOR DE LAS TARJETAS 

                //CREAMOS TARJETA PARA CADA ALUMNO
                data.forEach(alumno => {
                    let tarjeta = `
                        <div class="tarjeta"
                             data-id="${alumno._id}"
                             data-foto="${alumno.foto}" 
                             data-nombre="${alumno.nombre}"
                             data-apellidos="${alumno.apellidos}" 
                             data-dni="${alumno.dni}" 
                             data-direccion="${alumno.direccion}" 
                             data-telefono="${alumno.telefono}" 
                             data-email="${alumno.email}" 
                             data-formacion="${alumno.formacion}" 
                             data-promocion="${alumno.promocion}" 
                             data-oferta="${alumno.oferta}" 
                             data-trabajando="${alumno.trabajando}">
                            <img src="${alumno.foto}" alt="${alumno.nombre}">
                            <p>${alumno.nombre}</p>
                        </div>`;
                    $("#tarjetas").append(tarjeta);
                });


                //AL HACER CLICK VEMOS LOS DATOS DE LA TARJETA
                $(".tarjeta").click(function () {
                    const dniAlumno = $(this).data("dni");
                    const nombreAlumno = $(this).data("nombre");
                    const apelldiosAlumno = $(this).data("apellidos");
                    const direccionAlumno = $(this).data("direccion");
                    const telefonoAlumno = $(this).data("telefono");
                    const emailAlumno = $(this).data("email");
                    const formacionAlumno = $(this).data("formacion");
                    const promocionAlumno = $(this).data("promocion");
                    const fotoAlumno = $(this).data("foto");
                    const ofertaAlumno = $(this).data("oferta");
                    const trabajandoAlumno = $(this).data("trabajando");
                    console.log(dniAlumno);
                    

                    $("#modal-imagen").attr("src", $(this).data("foto"));
                    $("#modal-nombre").text($(this).data("nombre"));
                    $("#modal-apellidos").text($(this).data("apellidos"));
                    $("#modal-dni").text($(this).data("dni"));
                    $("#modal-direccion").text($(this).data("direccion"));
                    $("#modal-telefono").text($(this).data("telefono"));
                    $("#modal-email").text($(this).data("email"));
                    $("#modal-formacion").text($(this).data("formacion"));
                    $("#modal-promocion").text($(this).data("promocion"));
                    $("#modal-oferta").text($(this).data("oferta"));
                    $("#modal-trabajando").text($(this).data("trabajando"));


                    //COMPROBAMOS CON SESIONES SI EL USUARIO LOGEADO ES ADMIN
                    $.ajax({
                        url: 'sesiones.php', 
                        type: 'GET',
                        dataType: 'json',
                        success: function (response) {

                            //SI EL USUARIO ES ADMIN ENSEÑA LOS BOTONES 
                            if (response.sesion_activa && response.rol === "admin") {
                                $("#botones-admin").show(); 
                                $("#boton-asignar-oferta").hide();

                                //FUNCINALIDAD DE ELIMINAR USUARIO
                                $("#boton-eliminar").off('click').on('click', function () {
                                    $.ajax({
                                        url: 'eliminaralumnos.php',  
                                        type: 'POST',
                                        data: {dni: dniAlumno},
                                        dataType: 'json',
                                        success: function (response) {
                                            if (response.success) {

                                                //ELIMINA LA TARJETA DEL USUARIO EN CASO DE QUE SE HAGA LA ELIMINACION EN LA BD
                                                $(`[data-dni='${dniAlumno}']`).remove();
                                                $("#modal").fadeOut();
                                                
                                            } else {
                                                alert("Hubo un error al eliminar el alumno.");
                                            }
                                        },
                                        error: function (jqXHR, textStatus, errorThrown) {
                                            console.error('Error al eliminar el alumno:', textStatus, errorThrown);
                                            alert("Hubo un error al eliminar el alumno.");
                                        }
                                    });
                                });
                                

                                //FUNCIONALIDAD PARA EDITAR USUARIO
                                $("#boton-editar").off('click').on('click', function () {
                                    $("#modal-editar").fadeIn();

                                    $("#editar-formacion").val("");
                                    $("#editar-promocion").val("");

                                    //RECOGER DATOS DEL FORMULARIO
                                    $(".enviar").off('click').on("click", function (e) {
                                        e.preventDefault();
                                
                                        let datosEditados = { dni: dniAlumno, oferta: ofertaAlumno, trabajando: trabajandoAlumno };  

                                        //SI EL CAMPO ESTA VACIO SE PONEN LOS DATOS ACTUALES DE LA TARJETA
                                        if ($("#editar-nombre").val().trim() == ""){
                                            datosEditados.nombre = nombreAlumno;
                                        }else{
                                            datosEditados.nombre = $("#editar-nombre").val().trim();
                                        }

                                        if ($("#editar-apellidos").val().trim() == ""){
                                            datosEditados.apellidos = apelldiosAlumno;
                                        }else{
                                            datosEditados.apellidos = $("#editar-apellidos").val().trim();
                                        }

                                        if ($("#editar-direccion").val().trim() == ""){
                                            datosEditados.direccion = direccionAlumno;
                                        }else{
                                            datosEditados.direccion = $("#editar-direccion").val().trim();
                                        }

                                        if ($("#editar-telefono").val().trim() == ""){
                                            datosEditados.telefono = telefonoAlumno;
                                        }else{
                                            datosEditados.telefono = $("#editar-telefono").val().trim();
                                        }

                                        if ($("#editar-email").val().trim() == ""){
                                            datosEditados.email = emailAlumno;
                                        }else{
                                            datosEditados.email = $("#editar-email").val().trim();
                                        }

                                        if ($("#editar-formacion").val().trim() == ""){
                                            datosEditados.formacion = formacionAlumno;
                                        }else{
                                            datosEditados.formacion = $("#editar-formacion").val().trim();
                                        }

                                        if ($("#editar-promocion").val().trim() == ""){
                                            datosEditados.promocion = promocionAlumno;
                                        }else{
                                            datosEditados.promocion = $("#editar-promocion").val().trim();
                                        }

                                        if ($("#editar-foto").val().trim() == ""){
                                            datosEditados.foto = fotoAlumno;
                                        }else{
                                            datosEditados.foto = $("#editar-foto").val().trim();
                                        } 

                                        if ($("#editar-formacion").val().trim() == ""){
                                            datosEditados.formacion = formacionAlumno;
                                        }else{
                                            datosEditados.formacion = $("#editar-formacion").val().trim();
                                        }

                                        if ($("#editar-promocion").val().trim() == ""){
                                            datosEditados.promocion = promocionAlumno;
                                        }else{
                                            datosEditados.promocion = $("#editar-promocion").val().trim();
                                        }
                                        //console.log(datosEditados);
                                        
                                        $.ajax({
                                            url: 'editaralumnos.php',
                                            type: 'POST',
                                            data: datosEditados,
                                            dataType: 'json',
                                            success: function (response) {
                                                if (response.success) {
                                                    
                                                    //RECARGA LA PAGINA PARA QUE LOS DATOS EDITADOS SE VEAN
                                                    location.reload();
                                                    $contenedorMenu.hide();
                                                    $(".secundario").show();
                                                    $("h1").hide();
                                                    
                                                } else {
                                                    alert("Hubo un error al editar el alumno.");
                                                }
                                            },
                                            error: function (jqXHR, textStatus, errorThrown) {
                                                console.error('Error al editar el alumno:', textStatus, errorThrown);
                                                alert("Hubo un error al editar el alumno.");
                                            }
                                        });

                                    });
                                
                                    $(".cerrar, #modal-editar").click(function () {
                                        $("#modal-editar").fadeOut();
                                    });
                                
                                    $(".modal-contenido").click(function (e) {
                                        e.stopPropagation();
                                    });
                                });

                            } else {
                                $("#botones-admin").hide(); //NO SE MUESTRAN LOS BOTONES SI NO ERES ADMIN
                                $("#boton-asignar-oferta").hide();
                            }
                        }
                    });

            
                    $("#modal").fadeIn(); 
                });
                $(".cerrar, #modal").click(function () {
                    $("#modal").fadeOut();
                });
                $(".modal-contenido").click(function (e) {
                    e.stopPropagation();
                });


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error al realizar la petición AJAX:', textStatus, errorThrown);
            }
        });

        //FUNCINALIDAD PARA AÑADIR ALUMNOS
        $(".container-boton-añadir").click(function () {
            $("#modal-añadir").fadeIn();


            $(".enviar").off('click').on("click", function () {
                
                const datosAlumno = {
                    nombre: $("#añadir-nombre").val(),
                    apellidos: $("#añadir-apellidos").val(),
                    dni: $("#añadir-dni").val(), 
                    direccion: $("#añadir-direccion").val(),
                    telefono: $("#añadir-telefono").val(),
                    email: $("#añadir-email").val(),
                    formacion: $("#añadir-formacion").val(),
                    promocion: $("#añadir-promocion").val(),
                    oferta: "Ninguna",
                    trabajando: "No",
                    foto: $("#añadir-foto").val()
                };
        
                $.ajax({
                    url: 'añadiralumnos.php',
                    type: 'POST',
                    data: datosAlumno,
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            alert("Alumno añadido correctamente.");
                            $("#modal-añadir").fadeOut();
                        } else {
                            alert("Error al añadir el alumno.");
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('Error en la petición AJAX:', textStatus, errorThrown);
                        alert("Hubo un error al añadir el alumno.");
                    }
                });
            });

        });

        $(".cerrar, #modal-añadir").click(function () {
            $("#modal-añadir").fadeOut();
        });
        $(".modal-contenido").click(function (e) {
            e.stopPropagation();
        });
        

        //FILTRAR POR FORMACION Y POR PROMOCION
        $("#btn-buscar").on("click", function(){
        
            let filtroFormacion = $("#filtro-formacion").val();
            let filtroPromocion = $("#filtro-promocion").val();
            
            $(".tarjeta").each(function(){
                let tarFormacion = $(this).data("formacion");
                let tarPromocion = $(this).data("promocion");

                //SI EL FILTRO/FORMACION ESTA VACIO Y SI EL FILTRO/PROMOCION COINCIDE CON EL DE LA TARJETA, SE MUESTRA LA TARJETA
                if ((filtroFormacion === "" || filtroFormacion === tarFormacion) &&
                    (filtroPromocion === "" || filtroPromocion === tarPromocion)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });

    });

    


    $btnEmpresas = $(".empresas"); 
    $contenedorEmpresas = $(".contenedor-empresas");

    //BOTON PARA SECCION DE EMPRESAS
    $btnEmpresas.on("click", function () {
        $contenedorMenu.hide();
        $("h1").hide();
        $contenedorEmpresas.show();
        
        //LISTAR TODAS LAS EMPRESAS
        $.ajax({
            url: 'listarempresas.php', 
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $("#tarjetas-empresas").empty();
                
               //CREAR TARJETAS
                data.forEach(empresa => {
                    let tarjeta = `
                        <div class="tarjeta"
                             data-id="${empresa._id.$oid}"
                             data-nombre="${empresa.nombre}"
                             data-telefono="${empresa.telefono}"
                             data-email="${empresa.email}"
                             data-contacto="${empresa.personaContacto}"
                             data-rama="${empresa.rama}"
                             data-ofertas="${empresa.ofertas}">
                             <p>${empresa.nombre}</p>
                             <p>${empresa.rama}</p>
                        </div>`;
                    $("#tarjetas-empresas").append(tarjeta);
                });
                
                //MOSTRAR TODA LA INFORMACION
                $(".tarjeta").on("click", function () {
                    const idEmpresa = $(this).data("id");
                    const nombreEmpresa = $(this).data("nombre");
                    const telefonoEmpresa = $(this).data("telefono");
                    const emailEmpresa = $(this).data("email");
                    const contactoEmpresa = $(this).data("contacto");
                    const ramaEmpresa = $(this).data("rama");
                    
                    
                    $("#modal-empresa-nombre").text(nombreEmpresa);
                    $("#modal-empresa-telefono").text(telefonoEmpresa);
                    $("#modal-empresa-email").text(emailEmpresa);
                    $("#modal-empresa-contacto").text(contactoEmpresa);
                    $("#modal-empresa-rama").text(ramaEmpresa);
                    
                    //COMPROBAR SI ES ADMIN
                    $.ajax({
                        url: 'sesiones.php', 
                        type: 'GET',
                        dataType: 'json',
                        success: function (response) {
                            if (response.sesion_activa && response.rol === "admin") {
                                $("#botones-admin-empresa").show();
                                
                                //FUNCIONALIDAD PARA ELIMINAR EMPRESAS
                                $("#boton-eliminar-empresa").off('click').on('click', function () {
                                    $.ajax({
                                        url: 'eliminarempresas.php', 
                                        type: 'POST',
                                        data: { id: idEmpresa },
                                        dataType: 'json',
                                        success: function (resp) {
                                            if (resp.success) {
                                                $(`[data-id='${idEmpresa}']`).remove();
                                                $("#modal-empresa").fadeOut();
                                            } else {
                                                alert("Error al eliminar la empresa.");
                                            }
                                        },
                                        error: function (jqXHR, textStatus, errorThrown) {
                                            console.error("Error al eliminar la empresa:", textStatus, errorThrown);
                                            alert("Error al eliminar la empresa.");
                                        }
                                    });
                                });

                                
                                //FUNCIONALIDAD PARA EDITAR EMPRESAS
                                $("#boton-editar-empresa").off('click').on('click', function () {
                                    $("#modal-editar-empresa").fadeIn();
                                    
                                    $("#editar-empresa-nombre").val("");
                                    $("#editar-empresa-telefono").val("");
                                    $("#editar-empresa-email").val("");
                                    $("#editar-empresa-contacto").val("");
                                    $("#editar-empresa-rama").val("");
                                    
                                    $(".enviar-empresa").off('click').on('click', function (e) {
                                        e.preventDefault();
                                        
                                        let datosEditados = { id: idEmpresa, ofertas: ofertasEmpresa };
                                        
                                        if ($("#editar-empresa-nombre").val().trim() === "") {
                                            datosEditados.nombre = nombreEmpresa;
                                        } else {
                                            datosEditados.nombre = $("#editar-empresa-nombre").val().trim();
                                        }
                                        
                                        if ($("#editar-empresa-telefono").val().trim() === "") {
                                            datosEditados.telefono = telefonoEmpresa;
                                        } else {
                                            datosEditados.telefono = $("#editar-empresa-telefono").val().trim();
                                        }
                                        
                                        if ($("#editar-empresa-email").val().trim() === "") {
                                            datosEditados.email = emailEmpresa;
                                        } else {
                                            datosEditados.email = $("#editar-empresa-email").val().trim();
                                        }
                                        
                                        if ($("#editar-empresa-contacto").val().trim() === "") {
                                            datosEditados.personaContacto = contactoEmpresa;
                                        } else {
                                            datosEditados.personaContacto = $("#editar-empresa-contacto").val().trim();
                                        }
                                        
                                        if ($("#editar-empresa-rama").val().trim() === "") {
                                            datosEditados.rama = ramaEmpresa;
                                        } else {
                                            datosEditados.rama = $("#editar-empresa-rama").val().trim();
                                        }
                                        
                                        
                                        $.ajax({
                                            url: 'editarempresas.php', 
                                            type: 'POST',
                                            data: datosEditados,
                                            dataType: 'json',
                                            success: function (resp) {
                                                if (resp.success) {
                                                    location.reload();
                                                } else {
                                                    alert("Error al editar la empresa.");
                                                }
                                            },
                                            error: function (jqXHR, textStatus, errorThrown) {
                                                console.error("Error al editar la empresa:", textStatus, errorThrown);
                                                alert("Error al editar la empresa.");
                                            }
                                        });
                                    });
                                    
                                    
                                    $(".cerrar, #modal-editar-empresa").on('click', function(){
                                        $("#modal-editar-empresa").fadeOut();
                                    });
                                });
                            } else {
                                $("#botones-admin-empresa").hide();
                            }
                        }
                    });
                    
                    
                    $("#modal-empresa").fadeIn();
                });
                
                
                $(".cerrar, #modal-empresa").on("click", function () {
                    $("#modal-empresa").fadeOut();
                });
                $(".modal-contenido").on("click", function (e) {
                    e.stopPropagation();
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al listar las empresas:", textStatus, errorThrown);
            }
        });

        //FUNCIONALIDAD PARA AGREGAR EMPRESAS
        $("#btn-agregar-empresa").on("click", function(){
            $("#form-añadir-empresa")[0].reset();
            $("#modal-añadir-empresa").fadeIn();


            $(".enviar-empresa").off('click').on("click", function (e) {
                e.preventDefault();
                
                const datosEmpresa = {
                    nombre: $("#añadir-empresa-nombre").val(),
                    telefono: $("#añadir-empresa-telefono").val(),
                    email: $("#añadir-empresa-email").val(),
                    personaContacto: $("#añadir-empresa-contacto").val(),
                    rama: $("#añadir-empresa-rama").val(),
                    ofertas: []  //POR DEFECTO NINGUNA
                };
                
                $.ajax({
                    url: "añadirempresas.php",
                    type: "POST",
                    data: datosEmpresa,
                    dataType: "json",
                    success: function(response) {
                        if(response.success){
                            $("#modal-añadir-empresa").fadeOut();
                            $contenedorEmpresas.hide();
                            $contenedorMenu.show();
                            $("h1").show();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error("Error en la petición AJAX:", textStatus, errorThrown);
                        alert("Hubo un error al añadir la empresa.");
                    }
                });
            });
            $(".cerrar, #modal-añadir-empresa").on("click", function(){
                $("#modal-añadir-empresa").fadeOut();
            });
            
            $(".modal-contenido").on("click", function(e){
                e.stopPropagation();
            });
            
        });

    });


    

    //BOLSA DE EMPLEO
    $(".bolsa").on("click", function () {
        // Ocultar otras vistas
        $contenedorMenu.hide();
        $("h1").hide();
        $(".contenedor-bolsa").show();
        $("#tarjetas-ofertas").show();
        
        // Realizar la petición AJAX para listar las empresas con ofertas
        $.ajax({
            url: 'listarofertas.php',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $("#tarjetas-ofertas").empty();  // Vaciar el contenedor de tarjetas
    
               
                data.forEach(function (empresa) {
                    empresa.ofertas.forEach(function(oferta, index) {
                        // Si la oferta es un string, la usamos directamente; si es un objeto (por ejemplo, ya asignada), tomamos la propiedad 'descripcion'
                        let descripcion = (typeof oferta === "string") ? oferta : oferta.descripcion;
                        let tarjeta = `
                            <div class="tarjeta" 
                                 data-id="${empresa._id.$oid}" 
                                 data-nombre="${empresa.nombre}" 
                                 data-rama="${empresa.rama}"
                                 data-offer-index="${index}"
                                 data-oferta="${descripcion}">
                                 <p><strong>Empresa:</strong> ${empresa.nombre}</p>
                                 <p><strong>Oferta:</strong> ${descripcion}</p>
                            </div>
                        `; //data-offer-index es la posicion que ocupa en el array
                        $("#tarjetas-ofertas").append(tarjeta);
                    });
                });

                $("#tarjetas-ofertas").on("click", ".tarjeta", function () {
                    // Recuperamos la rama de la oferta (la rama de la empresa)
                    var ramaOferta = $(this).data("rama");

                    var ofertaActual = {
                        descripcion: $(this).data("oferta"),
                        empresaId: $(this).data("id"),
                        offerIndex: $(this).data("offer-index") //Posicion en el array de las ofertas
                    }
                
                    // Ocultamos el contenedor de ofertas
                    $("#tarjetas-ofertas").hide();
                
                    // Creamos o limpiamos un nuevo div para mostrar los alumnos filtrados dentro de la Bolsa
                    if ($("#tarjetas-alumnos-oferta").length === 0) {
                        // Si no existe, lo creamos al final del contenedor-bolsa
                        $(".contenedor-bolsa").append('<div id="tarjetas-alumnos-oferta"></div>');
                    } else {
                        // Si ya existe, lo limpiamos y nos aseguramos de mostrarlo
                        $("#tarjetas-alumnos-oferta").empty().show();
                    }
                
                    // Realizamos la llamada AJAX para listar alumnos
                    $.ajax({
                        url: 'listaralumnos.php',
                        type: 'GET',
                        dataType: 'json',
                        success: function (data) {
                            // Vaciamos el contenedor de alumnos filtrados
                            $("#tarjetas-alumnos-oferta").empty();
                
                            // Recorremos cada alumno y solo incluimos aquellos que cumplan:
                            // - No están trabajando ("No")
                            // - Su formación coincide con la rama de la empresa (ramaOferta)
                            data.forEach(alumno => {
                                if (alumno.trabajando === "No" && alumno.formacion === ramaOferta) {
                                    let tarjeta = `
                                        <div class="tarjeta oferta-modo"
                                             data-id="${alumno._id}"
                                             data-foto="${alumno.foto}" 
                                             data-nombre="${alumno.nombre}"
                                             data-apellidos="${alumno.apellidos}" 
                                             data-dni="${alumno.dni}" 
                                             data-direccion="${alumno.direccion}" 
                                             data-telefono="${alumno.telefono}" 
                                             data-email="${alumno.email}" 
                                             data-formacion="${alumno.formacion}" 
                                             data-promocion="${alumno.promocion}" 
                                             data-oferta="${alumno.oferta}" 
                                             data-trabajando="${alumno.trabajando}">
                                            <img src="${alumno.foto}" alt="${alumno.nombre}">
                                            <p>${alumno.nombre}</p>
                                        </div>`;
                                    $("#tarjetas-alumnos-oferta").append(tarjeta);
                                }
                            });
                
                            // Asignar el evento click a las tarjetas de alumnos en modo oferta
                            $(".tarjeta.oferta-modo").click(function () {
                                // Configuramos el modal para mostrar la información del alumno
                                $("#modal-imagen").attr("src", $(this).data("foto"));
                                $("#modal-nombre").text($(this).data("nombre"));
                                $("#modal-apellidos").text($(this).data("apellidos"));
                                $("#modal-dni").text($(this).data("dni"));
                                $("#modal-direccion").text($(this).data("direccion"));
                                $("#modal-telefono").text($(this).data("telefono"));
                                $("#modal-email").text($(this).data("email"));
                                $("#modal-formacion").text($(this).data("formacion"));
                                $("#modal-promocion").text($(this).data("promocion"));
                                $("#modal-oferta").text($(this).data("oferta"));
                                $("#modal-trabajando").text($(this).data("trabajando"));
                
                                // Se ocultan los botones de administración
                                // (en el futuro se podrá agregar un botón para asignar la oferta)
                                $("#botones-admin").hide();
                                $("#boton-asignar-oferta").show();


                                $("#boton-asignar").off("click").on("click", function(){
                                    // Se obtiene el DNI del alumno a partir del modal
                                    let dniAlumno = $("#modal-dni").text();
                                    // Los parámetros se toman de currentOffer y del modal:
                                    // - nuevaOferta será currentOffer.descripcion
                                    // - empresaId y offerIndex también están en currentOffer
                                    $.ajax({
                                        url: 'asignaroferta.php',
                                        type: 'POST',
                                        dataType: 'json',
                                        data: {
                                            dni: dniAlumno,
                                            nuevaOferta: ofertaActual.descripcion,
                                            empresaId: ofertaActual.empresaId,
                                            offerIndex: ofertaActual.offerIndex
                                        },
                                        success: function(response) {
                                            if(response.success){
                                                // Si todo sale bien, se vuelve al menú principal
                                                $("#modal").fadeOut();
                                                $(".contenedor-bolsa").hide();
                                                $("#tarjetas-alumnos-oferta").remove();
                                                $("#tarjetas-ofertas").show();
                                                $("#botones").show();
                                                $("h1").show();
                                            } else {
                                                console.error("Error al asignar la oferta.");
                                            }
                                        },
                                        error: function(jqXHR, textStatus, errorThrown) {
                                            console.error("Error en la llamada AJAX para asignar la oferta:", textStatus, errorThrown);
                                        }
                                    });
                                });


                                $("#modal").fadeIn();

                            });
                
                            // Eventos para cerrar el modal
                            $(".cerrar, #modal").click(function () {
                                $("#modal").fadeOut();
                            });
                            $(".modal-contenido").click(function (e) {
                                e.stopPropagation();
                            });
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error('Error al listar alumnos:', textStatus, errorThrown);
                        }
                    });
                });
                


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al listar empresas con ofertas:", textStatus, errorThrown);
            }
        });

        

        
        $("#btn-agregar-oferta").on("click", function(){
            
            $("#modal-añadir-oferta").fadeIn();

            
            $(".enviar-oferta").off('click').on("click", function (e) {
                e.preventDefault();
                
                const datosOferta = {
                    empresaNombre: $("#añadir-oferta-empresa").val().trim(),
                    descripcion: $("#añadir-oferta-descripcion").val().trim()
                };
                
                
                $.ajax({
                    url: "añadiroferta.php",
                    type: "POST",
                    data: datosOferta,
                    dataType: "json",
                    success: function(response) {
                        if(response.success){
                            $("#modal-añadir-oferta").fadeOut();
                            $(".contenedor-bolsa").hide();
                            $contenedorMenu.show();
                            $("h1").show();

                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error("Error en la petición AJAX:", textStatus, errorThrown);
                        alert("Hubo un error al añadir la oferta.");
                    }
                });
            });
            

            $(".cerrar, #modal-añadir-oferta").on("click", function(){
                $("#modal-añadir-oferta").fadeOut();
            });
            
            $(".modal-contenido").on("click", function(e){
                e.stopPropagation();
            });
            
            
        });
        

        // Botón para volver al menú desde la Bolsa de Empleo
        $("#volver-menu-bolsa").on("click", function(){
            $(".contenedor-bolsa").hide();
            $("#tarjetas-alumnos-oferta").hide();
            $("#botones").show();
            $("h1").show();

        });



        
    });




});