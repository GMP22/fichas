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
            perfilCompleto(fichaRecibida);
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
    distribucionPorGenero(fichaCompleta.insightsGender[0], fichaCompleta.insightsGender[1]);
    distribucionPorPais(fichaCompleta.insightsCountry, fichaCompleta.top_countries_formated);
    distribucionPorTerritorios(fichaCompleta.post_territory);
    distribucionPorMomentoDelDia(fichaCompleta.post_moment_json);
    engagementSegunDia(fichaCompleta.post_week_day);
    marcasTrabajadas(fichaCompleta);

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
                    }
                    document.getElementById("leyendaGrafica").appendChild(crearTexto("", element[1]+": "+ parseFloat(fichaCompleta.insight_perc_13).toFixed(2) + "%"))
            break;
            case "18":
                datos[index] = 
                    {
                        edad: element[1],
                        cantidad: sumarPorEdad(datosPorEdad["male"][element[0]], datosPorEdad["female"][element[0]]),
                        total: fichaCompleta.insightsAge[0].total,
                    }
                document.getElementById("leyendaGrafica").appendChild(crearTexto("", element[1]+": "+ parseFloat(fichaCompleta.insight_perc_18).toFixed(2) + "%"))
            break;
            case "25":
                datos[index] = 
                    {
                        edad: element[1],
                        cantidad: sumarPorEdad(datosPorEdad["male"][element[0]], datosPorEdad["female"][element[0]]),
                        total: fichaCompleta.insightsAge[0].total,
                    }
                    document.getElementById("leyendaGrafica").appendChild(crearTexto("", element[1]+": "+ parseFloat(fichaCompleta.insight_perc_25).toFixed(2) + "%"))
            break;
            case "35":
                datos[index] = 
                    {
                        edad: element[1],
                        cantidad: sumarPorEdad(datosPorEdad["male"][element[0]], datosPorEdad["female"][element[0]]),
                        total: fichaCompleta.insightsAge[0].total,
                    }
                    document.getElementById("leyendaGrafica").appendChild(crearTexto("", element[1]+": "+ parseFloat(fichaCompleta.insight_perc_35).toFixed(2) + "%"))
            break;
            case "45":
                datos[index] = 
                    {
                        edad: element[1],
                        cantidad: sumarPorEdad(datosPorEdad["male"][element[0]], datosPorEdad["female"][element[0]]),
                        total: fichaCompleta.insightsAge[0].total,
                    }
                    document.getElementById("leyendaGrafica").appendChild(crearTexto("", element[1]+": "+ parseFloat(fichaCompleta.insight_perc_45).toFixed(2) + "%"))
            break;
            case "65":
                datos[index] = {
                    edad: element[1],
                    cantidad: sumarPorEdad(datosPorEdad["male"][element[0]], datosPorEdad["female"][element[0]]),
                    total: fichaCompleta.insightsAge[0].total,
                    sliceSettings: { fill: am5.color(0xdedede), stroke: am5.color(0xdedede) }
                }
                document.getElementById("leyendaGrafica").appendChild(crearTexto("", element[1]+": "+ parseFloat(fichaCompleta.insight_perc_65).toFixed(2) + "%"))
            break;
        }
    });

var root = am5.Root.new("distribucion");

root.setThemes([
  am5themes_Animated.new(root)
]);

var chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    
  })
);

chart.plotContainer.children.push(
    am5.Label.new(root, { text: "Distribucion por Edad", x: 150, y: 0 })
  );

var yRenderer = am5xy.AxisRendererY.new(root, {
    inversed: true,
});

yRenderer.grid.template.set("visible", false);

var yAxis = chart.yAxes.push(
  am5xy.CategoryAxis.new(root, {
    categoryField: "edad",
    renderer: yRenderer,
    tooltip: am5.Tooltip.new(root, {})
  })
);

var xRenderer = am5xy.AxisRendererX.new(root, {
});
xRenderer.grid.template.set("visible", false);

var xAxis = chart.xAxes.push(
  am5xy.ValueAxis.new(root, {
    renderer: xRenderer,
    min: 0,
    max: fichaCompleta.insightsAge[0].total,
    tooltip: am5.Tooltip.new(root, {})
  })
);

var series = chart.series.push(
  am5xy.ColumnSeries.new(root, {
    name: "Audiencia",
    xAxis: xAxis,
    yAxis: yAxis,
    categoryYField: "edad",
    valueXField: "cantidad",
    stacked: true,
    tooltip: am5.Tooltip.new(root, {}),
  })
);

var series2 = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Audiencia",
      xAxis: xAxis,
      yAxis: yAxis,
      categoryYField: "edad",
      stroke: 0xdedede, 
      fill: 0xdedede,
    })
  );

series.data.setAll(datos);
series2.data.setAll(datos);
yAxis.data.setAll(datos);
series.appear();
series2.appear();
chart.appear(1000, 100);
}

function distribucionPorGenero(infoMasculino, infoFemenino){
    let root = am5.Root.new("distribucionGenero");
    let chart = root.container.children.push(
        am5percent.PieChart.new(root, {
            radius: am5.percent(65),
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

        var legend = chart.children.push( 
            am5.Legend.new(root, {
              centerY: am5.percent(50),
              y: am5.percent(85),
              centerX: am5.percent(-50),
              layout: root.verticalLayout
            })
          );
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
            pictureSettings: {
                src: bandera
              }
        }
    });

    var root = am5.Root.new("distribucionPais");
    root.setThemes([
        am5themes_Animated.new(root)
      ]);

      var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
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
            am5.Label.new(root, { text: "Distribucion por Edad", x: 15, y: -25 })
          );
}

function distribucionPorTerritorios(territorios){
        var root = am5.Root.new("distribucionTerritorios");

        root.setThemes([
        am5themes_Animated.new(root)
        ]);

        var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
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
            locationX: 0.9,
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
    
    var root = am5.Root.new("franjaHoraria");

        root.setThemes([
        am5themes_Animated.new(root)
        ]);

        var chart = root.container.children.push(
            am5xy.XYChart.new(root, {
              panX: false,
              panY: false,
              paddingLeft:0,
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

    var root = am5.Root.new("engagementSegunDia");

    root.setThemes([
    am5themes_Animated.new(root)
    ]);

    var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            text: "hola"
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
        minGridDistance: 20
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