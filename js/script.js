var conexion = new XMLHttpRequest();
var urlInflucard = 'https://ficha-2c8l.onrender.com/influcard';
var urlAgesArray = 'http://ficha-2c8l.onrender.com/ages_array';
//var urlInflucard = 'http://localhost:8080/influcard';
//var urlAgesArray = 'http://localhost:8080/ages_array';
var enlacesBanderas = "https://www.emca-online.eu";
var iconoInstagram = "fab fa-instagram";
var iconoGrupo = "fa-solid fa-user-group";
var iconoUser = "fa-solid fa-user";
var iconoImpresiones = "fa-solid fa-fingerprint";
var iconoReproducciones = "fa-solid fa-play";
var iconoEngagement = "fa-solid fa-heart";
var generoFemenino = "fa-solid fa-venus";
var iconoOjo = "fa-solid fa-eye";
var fakeFollower ="fa-solid fa-heart-pulse"
var imagenInfluencer = "assets/img/influencer.jpg";
obtenerInflucard();

function disposeRoot(divId) {
    am5.array.each(am5.registry.rootElements, function (root) {
        if (root != undefined) {
            if (root.dom.id == divId) {
                root.dispose();
              }
        }
    });
  };

function obtenerInflucard(){
    // Lanzamos loader mientras estan cargando los datos
    mostrarLoader();

    // Abrimos conexion con la API y hacemos conexión con ella
    conexion.open("GET", urlInflucard, true);
    conexion.send();

    // Verificamos si la respuesta del servidor es correcta y procesamos la informacion
    conexion.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let fichaRecibida = JSON.parse(this.responseText);
            crearInflucard(fichaRecibida);
            Swal.close();
        }
    }
}

function mostrarLoader(){
    Swal.fire({
        title: "Cargando perfil...",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff",
        backdrop: false,
        showConfirmButton: true,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

function crearInflucard(ficha){
    for (let index = 0; index < 30; index++) {
        let influcard = crearContenedor("influcard");
        let divPersonal = crearContenedor("datosPersonales");
        let divMetricas = crearContenedor("resumenMetricas");
        let datosPersonales = agregarDatosPersonales(ficha, divPersonal);
        let resumenMetricas = agregarResumenMetricas(ficha, divMetricas);

        influcard.appendChild(datosPersonales);
        influcard.appendChild(resumenMetricas);
        
        influcard.style.background = "url(" + ficha.account_picture + "), rgba(0, 0, 0, 0.9)  no-repeat";
        document.getElementById("contenedorMosaico").appendChild(influcard);
        
    }
}

function crearContenedor(claseContenedor){
    let div = document.createElement("div");
    div.classList.add(claseContenedor);
    return div;
}

function crearImagen(url, width){
    let img = document.createElement("img");
    img.setAttribute("src", url);
    img.setAttribute("width", width);
    return img;
}

function crearTexto(nombreClase, texto){
    let p = document.createElement("p");

    if (nombreClase != "") {
        p.classList.add("class", nombreClase);
    }
    
    if (texto != "") {
        let textoAgregar = document.createTextNode(texto);
        p.appendChild(textoAgregar);
    }

    return p;
}

function crearCabeceraH3(nombreClase, texto){
    let h3 = document.createElement("h3");

    if (nombreClase != "") {
        h3.classList.add("class", nombreClase);
    }
    
    if (texto != "") {
        let textoAgregar = document.createTextNode(texto);
        h3.appendChild(textoAgregar);
    }

    return h3;
}

function crearCabeceraH2(nombreClase, texto){
    let h2 = document.createElement("h2");

    if (nombreClase != "") {
        h2.classList.add("class", nombreClase);
    }
    
    if (texto != "") {
        let textoAgregar = document.createTextNode(texto);
        h2.appendChild(textoAgregar);
    }

    return h2;
}

function crearIconos(iconoPorAgregar){
    let icono = document.createElement("i");
    icono.setAttribute("class", iconoPorAgregar);
    return icono;
}

function buscarBandera(pais, listadoPaises){
    let enlaceResultante;
    listadoPaises.find(element => {
        if (element.country_short == pais) {
            enlaceResultante = enlacesBanderas + element.href;
        } 
    });
    return enlaceResultante;
}

function buscarNombrePais(pais, listadoPaises){
    let nombrePais;
    listadoPaises.find(element => {
        if (element.country_short == pais) {
            nombrePais = element.country;
        } 
    });
    return nombrePais;
}

function generoInfluencer(fichaGenero){
    let genero;
    if (fichaGenero === 0) {
        genero = "Hombre, ";
    } else if(fichaGenero == 1){
        genero = "Mujer, ";
    } else {
        genero = "";
    }
    return genero;
}
   
function agregarDatosPersonales(ficha, contenedor){
    let textoVerInflucard = "Ver Influcard";
    let claseVerInflucard = "verInflucard";
    let claseInteresesInflucard = "interesesInflucard";
    let widthImagenPerfil = 110;
    let widthBandera = 15;
    let fotoPerfil = crearContenedor("fotoperfil");
    let nombreCuenta = crearContenedor("nombreCuenta");
    let datosAdicionales = crearContenedor("datosAdicionales");
    let bandera = buscarBandera(ficha.country, ficha.top_countries_formated)
    let nombrePais = document.createTextNode(" "+ buscarNombrePais(ficha.country, ficha.top_countries_formated));

    fotoPerfil.appendChild(crearImagen(imagenInfluencer, widthImagenPerfil));
    fotoPerfil.appendChild(crearTexto(claseVerInflucard, textoVerInflucard));

    accionFotoPerfil(fotoPerfil);

    nombreCuenta.appendChild(crearIconos(iconoInstagram))
    nombreCuenta.appendChild(crearTexto("",ficha.username))

    let texto = document.createTextNode(generoInfluencer(ficha.gender) + ficha.age + " Años ");
    let interesesInflucard = crearTexto(claseInteresesInflucard, ficha.interests);
    let saltoDeLinea = document.createElement("br");
    let textoDatosAdicionales = crearTexto("", "");

    textoDatosAdicionales.appendChild(texto);
    textoDatosAdicionales.appendChild(saltoDeLinea);
    textoDatosAdicionales.appendChild(crearImagen(bandera, widthBandera));
    textoDatosAdicionales.appendChild(nombrePais);

    datosAdicionales.appendChild(textoDatosAdicionales);
    datosAdicionales.appendChild(interesesInflucard);

    contenedor.appendChild(fotoPerfil);
    contenedor.appendChild(nombreCuenta);
    contenedor.appendChild(datosAdicionales);

    return contenedor;
}

function accionFotoPerfil(fotoFicha){
    fotoFicha.addEventListener("click", function (e) {
        mostrarLoader();
        conexion.open("GET", urlInflucard, true);
        conexion.send();
        // Verificamos si la respuesta del servidor es correcta y procesamos la informacion
        conexion.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let fichaRecibida = JSON.parse(this.responseText);
                perfilCompleto(fichaRecibida);
                Swal.close();
                let perfil = document.getElementById("perfilInflucard");
                perfil.removeAttribute("class");
                perfil.setAttribute("class", "cargado");
                document.getElementById("contenedorMosaico").style.display = "none";
            }
        }
    })
}

function perfilCompleto(fichaCompleta){
    crearPerfil(fichaCompleta);
    tripleR(fichaCompleta.reach, "reach");
    tripleR(fichaCompleta.relevance, "relevance");
    tripleR(fichaCompleta.resonance, "resonance");
    crearAudiencia(fichaCompleta)
    crearDesempenyo(fichaCompleta)
    crearImpresiones(fichaCompleta)
    crearReproducciones(fichaCompleta)
    crearEngagement(fichaCompleta)
    datosActualizados(fichaCompleta.lastupdate)
    distribucionPorGenero(fichaCompleta.insightsGender[0], fichaCompleta.insightsGender[1]);
    distribucionPorPais(fichaCompleta.insightsCountry, fichaCompleta.top_countries_formated);
    distribucionPorTerritorios(fichaCompleta.post_territory);
    distribucionPorMomentoDelDia(fichaCompleta.post_moment_json);
    engagementSegunDia(fichaCompleta.post_week_day);
    marcasTrabajadas(fichaCompleta);

    document.getElementById("salir").addEventListener("click", function (e) {
        document.getElementById("perfilInflucard").classList.remove("cargado");
        document.getElementById("perfilInflucard").classList.add("cerrado");
        document.getElementById("datosActualizados").innerHTML = "";
        document.getElementsByClassName("audiencia")[0].innerHTML = "";
        document.getElementsByClassName("metricasDesempenyo")[0].innerHTML = "";
        document.getElementsByClassName("impresiones")[0].innerHTML = "";
        document.getElementsByClassName("reproducciones")[0].innerHTML = "";
        document.getElementsByClassName("engagement")[0].innerHTML = "";
        document.getElementById("imagenInfluencer").remove();
        document.getElementsByClassName("informacionPerfilSeleccionado")[0].innerHTML = "";
        document.getElementById("contenedorMosaico").style.display = "flex";
    })

    conexion.open("GET", urlAgesArray, true);
        conexion.send();
        // Verificamos si la respuesta del servidor es correcta y procesamos la informacion
    conexion.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let edades = JSON.parse(this.responseText);
                distribucionPorEdad(edades, fichaCompleta);
        }
    }
}

function crearPerfil(fichaCompleta){
    let fotoPerfilSeleccionado = document.getElementsByClassName("fotoPerfilSeleccionado")[0];
    let imagen = crearImagen(imagenInfluencer, 140);
    let informacionPerfilSeleccionado = document.getElementsByClassName("informacionPerfilSeleccionado")[0];
    let nombreCuenta = crearContenedor("nombreCuenta");
    nombreCuenta.setAttribute("id", "informacionPerfilParte1");

    informacionPerfilSeleccionado.appendChild(crearCabeceraH2("", fichaCompleta.username))
    nombreCuenta.appendChild(crearIconos(iconoInstagram));
    nombreCuenta.appendChild(crearTexto("", fichaCompleta.username));
    informacionPerfilSeleccionado.appendChild(nombreCuenta);

    let nombreCuenta2 = crearContenedor("nombreCuenta");
    nombreCuenta2.setAttribute("id", "informacionPerfilPart2");
    nombreCuenta2.innerHTML = '<p><img src="https://www.emca-online.eu/assets/flags/4x3/es.svg" width="15" alt=""> ES - <i style="color: rgb(255, 81, 110);" class="fa-solid fa-venus"></i> Mujer, 32 Años</p>';
    informacionPerfilSeleccionado.appendChild(nombreCuenta2);
    imagen.setAttribute("id", "imagenInfluencer")
    fotoPerfilSeleccionado.appendChild(imagen)
    
}

function datosActualizados(lastupdate){
    document.getElementById("datosActualizados").appendChild(crearTexto("", "Datos actualizados a " + lastupdate));
}

function crearDesempenyo(fichaCompleta){

    let contenedorDesempenyo = document.getElementsByClassName("metricasDesempenyo")[0];
    for (let index = 0; index < 2; index++) {
        let contenedorMetricas = crearContenedor("contenedorMetricas");
        let tituloMetrica = crearContenedor("tituloMetrica");
        let numeroMetrica = crearContenedor("numeroMetrica");

        let iconoGrupoResultante = crearIconos(iconoGrupo);
        let iconoUserResultante = crearIconos(iconoUser);
        iconoGrupoResultante.classList.add("fa-1x");
        iconoUserResultante.classList.add("fa-1x");
        switch (index) {
                case 0:
                    tituloMetrica.appendChild(iconoGrupoResultante)
                    tituloMetrica.appendChild(crearCabeceraH3("", "Audiencia"))
                    contenedorMetricas.appendChild(tituloMetrica);
                    contenedorMetricas.appendChild(numeroMetrica.appendChild(crearCabeceraH3("", fichaCompleta.followers_formated)));
                break;
                case 1:
                    tituloMetrica.appendChild(iconoUserResultante)
                    tituloMetrica.appendChild(crearCabeceraH3("", "Alcance"))
                    contenedorMetricas.appendChild(tituloMetrica);
                    contenedorMetricas.appendChild(numeroMetrica.appendChild(crearCabeceraH3("", fichaCompleta.reach_formated)));
                break;
        }
        contenedorDesempenyo.appendChild(contenedorMetricas);
    }
}

function crearAudiencia(fichaCompleta){
    let contenedorAudiencia = document.getElementsByClassName("audiencia")[0];
    for (let index = 0; index < 3; index++) {
        let contenedorVertical = crearContenedor("contenedorVertical");
        let iconoGrupoResultante = crearIconos(iconoGrupo);
        iconoGrupoResultante.classList.add("fa-2x");
        
        switch (index) {
                case 0:
                    contenedorVertical.appendChild(crearTexto("", "Audiencia"));
                    contenedorVertical.appendChild(iconoGrupoResultante);
                    contenedorVertical.appendChild(crearTexto("", fichaCompleta.followers_formated));
                break;
                case 1:
                    contenedorVertical.appendChild(crearTexto("", "Seguidores Fake"));
                    contenedorVertical.appendChild(iconoGrupoResultante);
                    contenedorVertical.appendChild(crearTexto("", fichaCompleta.fake_followers_formated + "%"));
                break;
                case 2:
                    contenedorVertical.appendChild(crearTexto("", "Audiencia Real"));
                    contenedorVertical.appendChild(iconoGrupoResultante);
                    contenedorVertical.appendChild(crearTexto("", fichaCompleta.real_followers_formated));
                break;
        }
        contenedorAudiencia.appendChild(contenedorVertical);
    }
}

function crearImpresiones(fichaCompleta){
    let contenedorImpresiones = document.getElementsByClassName("impresiones")[0];

    for (let index = 0; index < 2; index++) {
        let contenedorMetricas = crearContenedor("contenedorMetricas");
        let tituloMetrica = crearContenedor("tituloMetrica");
        let numeroMetrica = crearContenedor("numeroMetrica");
        let contenedorVertical = crearContenedor("contenedorVertical");
        let iconoImpresionesResultante = crearIconos(iconoImpresiones);
        
        iconoImpresionesResultante.classList.add("fa-1x");

        switch (index) {
                case 0:
                    tituloMetrica.appendChild(iconoImpresionesResultante);
                    tituloMetrica.appendChild(crearCabeceraH3("", "Impresiones"));
                    contenedorMetricas.appendChild(tituloMetrica);
                    numeroMetrica.appendChild(crearCabeceraH3("", fichaCompleta.avg_impressions_formated))
                    contenedorMetricas.appendChild(numeroMetrica);
                    contenedorImpresiones.appendChild(contenedorMetricas);
                break;

                case 1:
                    contenedorVertical.appendChild(crearTexto("", fichaCompleta.ir_alcance + "%"));
                    contenedorVertical.appendChild(crearTexto("", "Alcance"));
                    contenedorMetricas.appendChild(contenedorVertical);
                    let contenedorVertical2 = crearContenedor("contenedorVertical");
                    contenedorVertical2.appendChild(crearTexto("", fichaCompleta.ir_audiencia + "%"));
                    contenedorVertical2.appendChild(crearTexto("", "Audiencia"));
                    contenedorMetricas.appendChild(contenedorVertical2);
                    contenedorImpresiones.appendChild(contenedorMetricas);
                break;
        }
    }
}

function crearReproducciones(fichaCompleta){
    let contenedorReproducciones = document.getElementsByClassName("reproducciones")[0];

    for (let index = 0; index < 2; index++) {
        let contenedorMetricas = crearContenedor("contenedorMetricas");
        let tituloMetrica = crearContenedor("tituloMetrica");
        let numeroMetrica = crearContenedor("numeroMetrica");
        let contenedorVertical = crearContenedor("contenedorVertical");
        let iconoReproduccionesResultante = crearIconos(iconoReproducciones);
        
        iconoReproduccionesResultante.classList.add("fa-1x");

        switch (index) {
                case 0:
                    tituloMetrica.appendChild(iconoReproduccionesResultante);
                    tituloMetrica.appendChild(crearCabeceraH3("", "Reproducciones"));
                    contenedorMetricas.appendChild(tituloMetrica);
                    numeroMetrica.appendChild(crearCabeceraH3("", fichaCompleta.vplays_formated))
                    contenedorMetricas.appendChild(numeroMetrica);
                    contenedorReproducciones.appendChild(contenedorMetricas);
                break;

                case 1:
                    contenedorVertical.appendChild(crearTexto("", fichaCompleta.vr_alcance + "%"));
                    contenedorVertical.appendChild(crearTexto("", "Alcance"));
                    contenedorMetricas.appendChild(contenedorVertical);
                    let contenedorVertical2 = crearContenedor("contenedorVertical");
                    contenedorVertical2.appendChild(crearTexto("", fichaCompleta.vr_audiencia + "%"));
                    contenedorVertical2.appendChild(crearTexto("", "Audiencia"));
                    contenedorMetricas.appendChild(contenedorVertical2);
                    contenedorReproducciones.appendChild(contenedorMetricas);
                break;
        }
    }
}

function crearEngagement(fichaCompleta){
    let contenedorEngagement = document.getElementsByClassName("engagement")[0];

    for (let index = 0; index < 2; index++) {
        let contenedorMetricas = crearContenedor("contenedorMetricas");
        let tituloMetrica = crearContenedor("tituloMetrica");
        let numeroMetrica = crearContenedor("numeroMetrica");
        let contenedorVertical = crearContenedor("contenedorVertical");
        let iconoImpresionesResultante = crearIconos(iconoEngagement);
        
        iconoImpresionesResultante.classList.add("fa-1x");

        switch (index) {
                case 0:
                    tituloMetrica.appendChild(iconoImpresionesResultante);
                    tituloMetrica.appendChild(crearCabeceraH3("", "Engagement"));
                    contenedorMetricas.appendChild(tituloMetrica);
                    numeroMetrica.appendChild(crearCabeceraH3("", fichaCompleta.engagement_formated))
                    contenedorMetricas.appendChild(numeroMetrica);
                    contenedorEngagement.appendChild(contenedorMetricas);
                break;

                case 1:
                    contenedorVertical.appendChild(crearTexto("", fichaCompleta.er_alcance + "%"));
                    contenedorVertical.appendChild(crearTexto("", "Alcance"));
                    contenedorMetricas.appendChild(contenedorVertical);
                    let contenedorVertical2 = crearContenedor("contenedorVertical");
                    contenedorVertical2.appendChild(crearTexto("", fichaCompleta.er_audiencia + "%"));
                    contenedorVertical2.appendChild(crearTexto("", "Audiencia"));
                    contenedorMetricas.appendChild(contenedorVertical2);
                    contenedorEngagement.appendChild(contenedorMetricas);
                break;
        }
    }
}

function agregarResumenMetricas(ficha, contenedor){
    const cantidadDeMetricas = 5;

    contenedor.appendChild(crearTexto("", ficha.username));

    let metricas = crearContenedor("metricas");
    
    for (let index = 0; index < cantidadDeMetricas; index++) {
        let contenedorMetricas = crearContenedor("contenedorMetricas");
        let tituloMetrica = crearContenedor("tituloMetrica");
        let numeroMetrica = crearContenedor("numeroMetrica");

        switch (index) {
            case 0:
                tituloMetrica.appendChild(crearIconos(iconoGrupo))
                tituloMetrica.appendChild(crearTexto("", "Audiencia:"))
                numeroMetrica.appendChild(crearTexto("", ficha.followers_formated))
                contenedorMetricas.appendChild(tituloMetrica);
                contenedorMetricas.appendChild(numeroMetrica);
            break;
        
            case 1:
                tituloMetrica.appendChild(crearIconos(iconoUser))
                tituloMetrica.appendChild(crearTexto("", "Fakes:"))
                numeroMetrica.appendChild(crearTexto("", ficha.fakes))
                contenedorMetricas.appendChild(tituloMetrica);
                contenedorMetricas.appendChild(numeroMetrica);
            break;
            
            case 2:
                tituloMetrica.appendChild(crearIconos(iconoEngagement))
                tituloMetrica.appendChild(crearTexto("", "Media Eng:"))
                numeroMetrica.appendChild(crearTexto("", ficha.avg_engagement_formated))
                contenedorMetricas.appendChild(tituloMetrica);
                contenedorMetricas.appendChild(numeroMetrica);
            break;

            case 3:
                tituloMetrica.appendChild(crearIconos(fakeFollower))
                tituloMetrica.appendChild(crearTexto("", "Eng Rate:"))
                numeroMetrica.appendChild(crearTexto("", ficha.engagement_rate + "%"))
                contenedorMetricas.appendChild(tituloMetrica);
                contenedorMetricas.appendChild(numeroMetrica);
            break;

            case 4:
                tituloMetrica.appendChild(crearIconos(iconoOjo))
                tituloMetrica.appendChild(crearTexto("", "Impresiones:"))
                numeroMetrica.appendChild(crearTexto("", ficha.avg_impressions_formated))
                contenedorMetricas.appendChild(tituloMetrica);
                contenedorMetricas.appendChild(numeroMetrica);
            break;
        }

        metricas.appendChild(contenedorMetricas);
    }

    contenedor.appendChild(metricas);
    return contenedor;
}

function coloresTripleR(id){
    let color;
    switch (id) {
        case "reach":
            color = 0x1469FF;
        break;
        case "relevance":
            color = 0xFFBF14;
        break;
        case "resonance":
            color = 0x0FFFE6;
        break;
    }
    return color;
}

function tripleR(porcentajeRecibido, id){
    let valorReal = Math.round(porcentajeRecibido);
    let restoGrafica = 100-valorReal;
    disposeRoot(id)
    let root = am5.Root.new(id);
    let colorGrafica = coloresTripleR(id);
    let chart = root.container.children.push(
    am5percent.PieChart.new(root, {
        radius: am5.percent(50),
        innerRadius: am5.percent(75)
        })
    );

    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    let series = chart.series.push(
        am5percent.PieSeries.new(root, {
          name: "Series",
          categoryField: "category",
          valueField: "number",
        })
      );

    var reachData = [{
        category: "Alcance",
        number: valorReal,
        sliceSettings: { fill: am5.color(colorGrafica), stroke: am5.color(colorGrafica) }
    },{
        category: "Resto",
        number: restoGrafica,
        settings: { forceHidden: true },
        sliceSettings: { fill: am5.color(0xdedede), stroke: am5.color(0xdedede) }
    }];

    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);

    series.slices.template.setAll({
        templateField: "sliceSettings"
    });

    series.children.push(am5.Label.new(root, {
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        text: valorReal + "%",
        populateText: true,
      }));

      chart.children.unshift(am5.Label.new(root, {
        text: id,
        fontSize: 14,
        fontWeight: "100",
        textAlign: "center",
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 0,
        paddingBottom: 0,
      }));

    series.data.setAll(reachData);
}

function sumarPorEdad(edadMasculina, edadFemenina){
    return edadMasculina + edadFemenina;
}

function distribucionPorEdad(edades, fichaCompleta){
    let datosPorEdad = JSON.parse(fichaCompleta.insightsAge[0].raw)
    let myMap = new Map(Object.entries(edades));
    let datos = [];

    myMap.entries().forEach(function(element, index) {
        switch (element[0]) {
            case "13":
                datos[index] = 
                    {
                        edad: element[1],
                        cantidad: sumarPorEdad(datosPorEdad["male"][element[0]], datosPorEdad["female"][element[0]]),
                        total: fichaCompleta.insightsAge[0].total,
                        porcentaje: parseFloat(fichaCompleta.insight_perc_13),
                    }
            break;
            case "18":
                datos[index] = 
                    {
                        edad: element[1],
                        cantidad: sumarPorEdad(datosPorEdad["male"][element[0]], datosPorEdad["female"][element[0]]),
                        total: fichaCompleta.insightsAge[0].total,
                        porcentaje: parseFloat(fichaCompleta.insight_perc_18),
                    }
            break;
            case "25":
                datos[index] = 
                    {
                        edad: element[1],
                        cantidad: sumarPorEdad(datosPorEdad["male"][element[0]], datosPorEdad["female"][element[0]]),
                        total: fichaCompleta.insightsAge[0].total,
                        porcentaje: parseFloat(fichaCompleta.insight_perc_25),
                    }
            break;
            case "35":
                datos[index] = 
                    {
                        edad: element[1],
                        cantidad: sumarPorEdad(datosPorEdad["male"][element[0]], datosPorEdad["female"][element[0]]),
                        total: fichaCompleta.insightsAge[0].total,
                        porcentaje: parseFloat(fichaCompleta.insight_perc_35),
                    }
            break;
            case "45":
                datos[index] = 
                    {
                        edad: element[1],
                        cantidad: sumarPorEdad(datosPorEdad["male"][element[0]], datosPorEdad["female"][element[0]]),
                        total: fichaCompleta.insightsAge[0].total,
                        porcentaje: parseFloat(fichaCompleta.insight_perc_45),
                    }
            break;
            case "65":
                datos[index] = {
                    edad: element[1],
                    cantidad: sumarPorEdad(datosPorEdad["male"][element[0]], datosPorEdad["female"][element[0]]),
                    total: fichaCompleta.insightsAge[0].total,
                    porcentaje: parseFloat(fichaCompleta.insight_perc_65),
                    sliceSettings: { fill: am5.color(0xdedede), stroke: am5.color(0xdedede) }
                }
            break;
        }
    });
    disposeRoot("distribucion")
var root = am5.Root.new("distribucion");

root.setThemes([
  am5themes_Animated.new(root)
]);

var chart = root.container.children.push(
  am5xy.XYChart.new(root, {
                paddingRight: 85,
                paddingTop: 20,
                paddingBottom: 20
  })
);

chart.plotContainer.children.push(
    am5.Label.new(root, { text: "Distribucion por Edad", x: 150, y: -10 })
  );

var yRenderer = am5xy.AxisRendererY.new(root, {
    inversed: true,
});



var yAxis = chart.yAxes.push(
  am5xy.CategoryAxis.new(root, {
    categoryField: "edad",
    renderer: yRenderer,
    tooltip: am5.Tooltip.new(root, {})
  })
);

var xRenderer = am5xy.AxisRendererX.new(root, {
});

yRenderer.grid.template.set("visible", false);
xRenderer.grid.template.set("visible", false);

var xAxis = chart.xAxes.push(
  am5xy.ValueAxis.new(root, {
    renderer: xRenderer,
  })
);
xAxis.get("renderer").labels.template.set("forceHidden", true);
var series = chart.series.push(
  am5xy.ColumnSeries.new(root, {
    name: "Audiencia",
    xAxis: xAxis,
    yAxis: yAxis,
    categoryYField: "edad",
    valueXField: "porcentaje",
  })
);

series.bullets.push(function () {
    return am5.Bullet.new(root, {
    locationX: 1,
    sprite: am5.Label.new(root, {
        centerY: am5.p50,
        text: "{porcentaje}%",
        populateText: true
    })
    });
});
series.columns.template.setAll({
    height: 5
  });

series.data.setAll(datos);
yAxis.data.setAll(datos);
series.appear();
chart.appear(1000, 100);
}

function distribucionPorGenero(infoMasculino, infoFemenino){
    disposeRoot("distribucionGenero")
    let root = am5.Root.new("distribucionGenero");
    let chart = root.container.children.push(
        am5percent.PieChart.new(root, {
            radius: am5.percent(10),
            layout: root.verticalLayout
            })
        );
    
        root.setThemes([
            am5themes_Animated.new(root)
        ]);
    
        let series = chart.series.push(
            am5percent.PieSeries.new(root, {
              name: "Series",
              categoryField: "genero",
              valueField: "number",
              legendLabelText: "{category}",
              legendValueText: "{porcentaje}",
              calculateTotals: true,
            })
          );
    
        var reachData = [{
            genero: "Mujeres",
            number: infoFemenino.amount,
            porcentaje: infoFemenino.percentage + "%",
        },{
            genero: "Hombres",
            number: infoMasculino.amount,
            porcentaje: infoMasculino.percentage + "%",
        }];

        series.slices.template.adapters.add("fill", function(fill, target) {
            if (target.dataItem.get("category") === "Mujeres") {
                return am5.color(0xFF1493); 
            } 
            return fill;
        });

        let title = chart.children.push(
            am5.Label.new(root, {
                text: "Distribucion por Genero",
                fontSize: 15,
                x: am5.p50,
                centerX: am5.p50,
                y: -0 
            })
        );

        var legend = chart.children.push( 
            am5.Legend.new(root, {
              centerY: am5.percent(50),
              y: am5.percent(85),
              centerX: am5.percent(-50),
              layout: root.verticalLayout
            })
          );

          series.slices.template.adapters.add("radius", function (radius, target) {
            var dataItem = target.dataItem;
            var high = series.getPrivate("valueHigh");
          
            if (dataItem) {
              var value = target.dataItem.get("valueWorking", 0);
              return radius * value / high
            }
            return radius;
          });

         series.data.setAll(reachData);
        legend.data.setAll(series.dataItems);

        series.labels.template.set("visible", false);
        series.ticks.template.set("visible", false);
        
        
}

function distribucionPorPais(infoPaises, ficha){
    let x = 0;
    let datos = [];

    infoPaises.forEach(function (element, index) {
        let bandera = buscarBandera(element.country, ficha);
        datos[index] = {
            pais: element.country,
            cantidad: parseInt(element.amount),
            porcentaje: element.percentage,
            pictureSettings: {
                src: bandera
              }
        }
    });
    disposeRoot("distribucionPais")
    var root = am5.Root.new("distribucionPais");
    root.setThemes([
        am5themes_Animated.new(root)
      ]);

      var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
                paddingRight: 85,
                paddingTop: 40,
                paddingBottom: 20
        })
      );

      var yRenderer = am5xy.AxisRendererY.new(root, {
            minorGridEnabled:true,
            inversed: true,
      });
      yRenderer.grid.template.set("visible", false);

      var yAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "pais",
          renderer: yRenderer,
          paddingRight:10
        })
      );

      var xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance:80,
        minorGridEnabled:true
      });

      var xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          min: 0,
          renderer: xRenderer
        })
      );
      
      yRenderer.grid.template.set("visible", false);
    xRenderer.grid.template.set("visible", false);
    xAxis.get("renderer").labels.template.set("forceHidden", true);

      var series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "asdfe",
          xAxis: xAxis,
          yAxis: yAxis,
          categoryYField: "pais",
          valueXField: "cantidad",
          maskBullets: false,
        })
      );

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
        locationX: 1,
        sprite: am5.Label.new(root, {
            centerY: am5.p50,
            text: "{porcentaje}%",
            populateText: true
        })
        });
    });

      series.columns.template.setAll({
        height: 5
      });

series.bullets.push(function(root) {
  var bulletContainer = am5.Container.new(root, {});

  var maskCircle = bulletContainer.children.push(
    am5.Circle.new(root, { radius: 35 })
  );

  var imageContainer = bulletContainer.children.push(
    am5.Container.new(root, {
      mask: maskCircle
    })
  );

  var image = imageContainer.children.push(
    am5.Picture.new(root, {
      templateField: "pictureSettings",
      centerX: am5.p50,
      centerY: am5.p50,
      width: 15,
      height: 15,
    })
  );

    return am5.Bullet.new(root, {
        locationX: 0,
        sprite: bulletContainer
    });
    });

        series.data.setAll(datos);
        yAxis.data.setAll(datos);
        
        series.appear();
        chart.appear();

        chart.plotContainer.children.push(
            am5.Label.new(root, { text: "Distribucion por País", x: 15, y: -25 })
          );
}

function distribucionPorTerritorios(territorios){
    disposeRoot("distribucionTerritorios")
        var root = am5.Root.new("distribucionTerritorios");

        root.setThemes([
        am5themes_Animated.new(root)
        ]);

        var chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                paddingRight: 30,
                paddingTop: 50,
            })
        );

        var yRenderer = am5xy.AxisRendererY.new(root, {
            inversed: true,
        });

        var yAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
            categoryField: "category",
            renderer: yRenderer,
            })
        );

        var xRenderer = am5xy.AxisRendererX.new(root, {
        });

        var xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
            renderer: xRenderer,
            min: 0,
        })
        );

        var series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
            name: "Distribucion por territorio",
            xAxis: xAxis,
            yAxis: yAxis,
            categoryYField: "category",
            valueXField: "value",
        })
        );

        series.bullets.push(function () {
            return am5.Bullet.new(root, {
            locationX: 1,
            sprite: am5.Label.new(root, {
                centerY: am5.p50,
                centerX: am5.p0,
                text: "{valueX}%",
                populateText: true
            })
            });
        });

        series.columns.template.setAll({
            strokeOpacity: 0,
            cornerRadiusBR: 10,
            cornerRadiusTR: 10,
            cornerRadiusBL: 0,
            cornerRadiusTL: 0,
            maxHeight: 50,
            fillOpacity: 0.8
        });

        series.data.setAll(territorios);
        yAxis.data.setAll(territorios);


        series.columns.template.adapters.add("fill", function(fill, target) {
            return am5.color(target.dataItem.dataContext.color);
        });

        series.columns.template.adapters.add("stroke", function(stroke, target) {
            return am5.color(target.dataItem.dataContext.color);
        });

        chart.plotContainer.children.push(
            am5.Label.new(root, { text: "Distribucion de sus publicaciones por territorios", x: 90, y: -50 })
          );
        yRenderer.grid.template.set("visible", false);
        series.appear();
        chart.appear(100, 100);
}

function crearEnlacesIconosMomentosDelDia(momento){
    momento.forEach(element => {
        element.pictureSettings = {
            src: element.href
        }
     });
     return momento;
}

function distribucionPorMomentoDelDia(momento){
    let momentosDelDia = crearEnlacesIconosMomentosDelDia(JSON.parse(momento));
    disposeRoot("franjaHoraria")
    var root = am5.Root.new("franjaHoraria");

        root.setThemes([
        am5themes_Animated.new(root)
        ]);

        var chart = root.container.children.push(
            am5xy.XYChart.new(root, {
              panX: false,
              panY: false,
              paddingTop: 60,
              paddingRight:30,
              wheelX: "none",
              wheelY: "none"
            })
          );

        var yRenderer = am5xy.AxisRendererY.new(root, {
        });

        var yAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
                categoryField: "type",
                renderer: yRenderer,
                paddingRight:40,
            })
        );

        var xRenderer = am5xy.AxisRendererX.new(root, {
            minGridDistance:80,
            minorGridEnabled:true
        });

        var xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
            renderer: xRenderer,
            min: 0,
        })
        );

        var circleTemplate = am5.Template.new({});
        var series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
              name: "asd",
              xAxis: xAxis,
              yAxis: yAxis,
              valueXField: "value",
              categoryYField: "type",
              sequencedInterpolation: true,
              calculateAggregates: true,
              maskBullets: false,
              tooltip: am5.Tooltip.new(root, {
                dy: -30,
                pointerOrientation: "vertical",
                labelText: "{valueX}"
              })
            })
        );
        
        series.columns.template.setAll({
            strokeOpacity: 0,
            cornerRadiusBR: 10,
            cornerRadiusTR: 10,
            cornerRadiusBL: 10,
            cornerRadiusTL: 10,
            maxHeight: 50,
            fillOpacity: 0.8
        });

        series.bullets.push(function(root, series, dataItem) {
            var bulletContainer = am5.Container.new(root, {});
          
            var maskCircle = bulletContainer.children.push(
              am5.Circle.new(root, { radius: 20, fill: am5.color(dataItem.dataContext.color) }, circleTemplate)
            );
          
            var imageContainer = bulletContainer.children.push(
              am5.Container.new(root, {
                mask: maskCircle
              })
            );
          
            var image = imageContainer.children.push(
              am5.Picture.new(root, {
                templateField: "pictureSettings",
                centerX: am5.p50,
                centerY: am5.p50,
                width: 25,
                height: 25,
              })
            );
          
              return am5.Bullet.new(root, {
                  locationX: 0,
                  sprite: bulletContainer
              });
        });

        series.columns.template.adapters.add("fill", function(fill, target) {
            return am5.color(target.dataItem.dataContext.color);
        });
    
        series.columns.template.adapters.add("stroke", function(stroke, target) {
                return am5.color(target.dataItem.dataContext.color);
        });

        series.columns.template.setAll({
            height: 15
          });

        chart.plotContainer.children.push(
            am5.Label.new(root, { text: "Franja Horaria De Sus Publicaciones", x: 90, y: -50 })
          );
          xAxis.get("renderer").labels.template.set("forceHidden", true);
          yRenderer.grid.template.set("visible", false);
xRenderer.grid.template.set("visible", false);
            series.data.setAll(momentosDelDia);
            yAxis.data.setAll(momentosDelDia);
            series.appear();
            chart.appear(1000, 100);
}

function numeroADiaDeSemana(numeroDeDia){
    let diaResultante;
    switch (numeroDeDia) {
            case 1:
                diaResultante = "L";
            break;
            case 2:
                diaResultante = "M";
            break;
            case 3:
                diaResultante = "X";
            break;
            case 4:
                diaResultante = "J";
            break;
            case 5:
                diaResultante = "V";
            break;
            case 6:
                diaResultante = "S";
            break;
            case 7:
                diaResultante = "D";
            break;
    }
    return diaResultante;
}

function engagementSegunDia(dias){

    dias.forEach(function (element, index) {
       dias[index].day_of_week = numeroADiaDeSemana(parseInt(element.day_id))
       dias[index].engrate = parseFloat(dias[index].engrate);
    });
    disposeRoot("engagementSegunDia")
    var root = am5.Root.new("engagementSegunDia");

    root.setThemes([
    am5themes_Animated.new(root)
    ]);

    var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
        })
    );
    
    var yRenderer = am5xy.AxisRendererY.new(root, {
    });
    
    var yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
        renderer: yRenderer,
        min: 0,
        })
    );
    
    var xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 20,
    });
    
    var xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
        categoryField: "day_of_week",
        renderer: xRenderer
        })
    );

    

    var series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
        name: "jm",
        xAxis: xAxis,
        yAxis: yAxis,
        categoryXField: "day_of_week",
        valueYField: "engrate",
        })
    );
    
    series.columns.template.adapters.add("fill", function (fill, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });
      
      series.columns.template.adapters.add("stroke", function (stroke, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

    console.log(dias)
    xAxis.data.setAll(dias);
    series.data.setAll(dias);
}

function marcasTrabajadas(ficha){
}