var conexion = new XMLHttpRequest();
//var urlInflucard = 'https://ficha-2c8l.onrender.com/influcard';
var urlInflucard = 'http://localhost:8080/influcard';
var urlAgesArray = 'http://localhost:8080/ages_array';
var enlacesBanderas = "https://www.emca-online.eu";
var iconoInstagram = "fab fa-instagram";

obtenerInflucard();

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
    for (let index = 0; index < 5; index++) {
        let influcard = crearContenedor("influcard");
        let divPersonal = crearContenedor("datosPersonales");
        let divMetricas = crearContenedor("resumenMetricas");
        let datosPersonales = agregarDatosPersonales(ficha, divPersonal);
        let resumenMetricas = agregarResumenMetricas(ficha, divMetricas);

        influcard.appendChild(datosPersonales);
        influcard.appendChild(resumenMetricas);
        document.getElementById("contenedorMosaico").appendChild(influcard);
        
    }
}

function crearContenedor(claseContenedor){
    let div = document.createElement("div");
    div.classList.add("class", claseContenedor);
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
    /*
        Separar codigo por funciones
    */
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

    fotoPerfil.appendChild(crearImagen(bandera, widthImagenPerfil));
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
            }
        }
    })
}

function perfilCompleto(fichaCompleta){
    tripleR(fichaCompleta.reach, "reach");
    tripleR(fichaCompleta.relevance, "relevance");
    tripleR(fichaCompleta.resonance, "resonance");

    console.log(fichaCompleta)
}

function agregarResumenMetricas(ficha, contenedor){
    const cantidadDeMetricas = 5;

    contenedor.appendChild(crearTexto("", ficha.username));

    let metricas = crearContenedor("metricas");
    
    /*
        Esto se puede optimizar utilizando 1 funcion
    */
    for (let index = 0; index < cantidadDeMetricas; index++) {
        let contenedorMetricas = crearContenedor("contenedorMetricas");
        let tituloMetrica = crearContenedor("tituloMetrica");
        let numeroMetrica = crearContenedor("numeroMetrica");

        switch (index) {
            case 0:
                tituloMetrica.appendChild(crearIconos(iconoInstagram))
                tituloMetrica.appendChild(crearTexto("", "Audiencia:"))
                numeroMetrica.appendChild(crearTexto("", ficha.followers))
                contenedorMetricas.appendChild(tituloMetrica);
                contenedorMetricas.appendChild(numeroMetrica);
            break;
        
            case 1:
                tituloMetrica.appendChild(crearIconos(iconoInstagram))
                tituloMetrica.appendChild(crearTexto("", "Fakes:"))
                numeroMetrica.appendChild(crearTexto("", ficha.fakes))
                contenedorMetricas.appendChild(tituloMetrica);
                contenedorMetricas.appendChild(numeroMetrica);
            break;
            
            case 2:
                tituloMetrica.appendChild(crearIconos(iconoInstagram))
                tituloMetrica.appendChild(crearTexto("", "Media Eng:"))
                numeroMetrica.appendChild(crearTexto("", ficha.avg_engagement_formated))
                contenedorMetricas.appendChild(tituloMetrica);
                contenedorMetricas.appendChild(numeroMetrica);
            break;

            case 3:
                tituloMetrica.appendChild(crearIconos(iconoInstagram))
                tituloMetrica.appendChild(crearTexto("", "Eng Rate:"))
                numeroMetrica.appendChild(crearTexto("", ficha.engagement_rate))
                contenedorMetricas.appendChild(tituloMetrica);
                contenedorMetricas.appendChild(numeroMetrica);
            break;

            case 4:
                tituloMetrica.appendChild(crearIconos(iconoInstagram))
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