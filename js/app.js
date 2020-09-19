
const ubicacion = {
    latitud: '',
    longitud: '',
    msj: ''
}
let datos;
let municipios = {};
document.addEventListener('DOMContentLoaded', () => {
    const checkBox = document.querySelector('#dark-mode');
    const btnUbicacion = document.querySelector('#btnUbicacion');
    const selectMunicipios = document.querySelector('#municipio');
    const selectEstados = document.querySelector('#estado');
    const formulario = document.querySelector('#formCiudad');
    const btnCentigrados = document.querySelector('#btnCentigrados');
    const btnFarenheit = document.querySelector('#btnFarenheit');
    checkBox.addEventListener("click", () => {
        modoOscuro();
    })
    obtenerFecha()
    cargarApi();
    if (datos === undefined) {
        console.log('cargar api prueba');
        cargarApiPrueba();
    }
    btnUbicacion.addEventListener('click', () => {
        console.log(datos);
        obtenerUbicacion();
        document.getElementById("msjUbicacion").classList.toggle('d-block');
        setTimeout(() => {
            document.getElementById("msjUbicacion").classList.toggle('d-block');
            console.log(`latitud:${ubicacion.latitud}`);
            console.log(`latitud:${ubicacion.longitud}`);
            try {
                /*const latitud=19.4829;
                const longitud=-99.1135;
                console.log(typeof(ubicacion.latitud))*/ //Variables de prueba
                //const resultado = datos.find(estado => estado.lat == latitud && estado.lon ==longitud);
                const resultado = datos.find(estado => estado.lat == ubicacion.latitud && estado.lon == ubicacion.longitud);
                console.log(`estado:${resultado.nes}`);
                const estado = resultado.nes;
                const municipio = resultado.nmun;
                obtenerClima(estado, municipio);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Tu ubicación no se encuentra disponible actualmente,por favor ingresa los datos manualmente'
                })
            }
        }, 3000);

    })
    selectEstados.addEventListener('change', () => {
        const estado = selectEstados.options[selectEstados.selectedIndex].value;
        console.log(estado)
        construirSelectoresMunicipios(estado);
    })

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        obtenerTipoCielos(datos);
        const municipio = selectMunicipios.options[selectMunicipios.selectedIndex].value;
        const estado = selectEstados.options[selectEstados.selectedIndex].value;
        //console.log(municipio)
        if (municipio === 'default' || estado === 'default') {
            document.querySelector('#alertForm').innerHTML = 'Completa ambos campos para continuar';
            document.getElementById("alertForm").classList.toggle('d-block');
            setTimeout(() => {
                document.getElementById("alertForm").classList.toggle('d-block');
            }, 3000);

        } else {
            console.log("formulario enviado");
            $('#staticBackdrop').modal('hide');
            obtenerClima(estado, municipio);
        }

    })

    btnFarenheit.addEventListener('click', () => {
        btnCentigrados.disabled = false;
        btnFarenheit.disabled = true;
        const grados = document.getElementsByClassName('grados');
        const temperatura = document.getElementsByClassName('temperatura');
        Array.from(grados).forEach(elemento => {
            elemento.textContent = '°F';
        });
        Array.from(temperatura).forEach(elemento => {
            let numero = elemento.firstChild.textContent.trim();
            const grados = (Number(numero) * (9 / 5)) + 32;
            elemento.firstChild.textContent = grados.toFixed(2);
        })
    });

    btnCentigrados.addEventListener('click', () => {
        btnFarenheit.disabled = false;
        btnCentigrados.disabled = true;
        const grados = document.getElementsByClassName('grados');
        const temperatura = document.getElementsByClassName('temperatura');
        Array.from(grados).forEach(elemento => {
            elemento.textContent = '°C';
        });
        Array.from(temperatura).forEach(elemento => {
            let numero = elemento.firstChild.textContent.trim();
            const grados = (Number(numero) - 32) * (5 / 9);
            elemento.firstChild.textContent = grados.toFixed(2);
        })
    })


});

function obtenerClima(estado, municipio) {
    const indice = datos.findIndex(elemento => elemento.nes === estado && elemento.nmun === municipio);
    console.log(`estado:${indice}`);
    console.log(typeof (datos));
    console.log(`datos:${JSON.stringify(datos[indice])}`);
    const info = datos[indice];
    const tempActual = document.querySelector('#tempActual');
    const climaActual = info.tmax;
    const ubicacion = document.querySelector('#ubicacion');
    const ubicacionCompleta = info.nes + '-' + info.nmun;
    const cielo = document.querySelector('#cielo');
    const probLluvia = document.querySelector('#probLluvia');
    const nubes = document.querySelector('#porcentajeNubes');
    const precipitacion = document.querySelector('#precipitacion');
    const viento = document.querySelector('#velocidadViento');
    const barraLluvia = document.querySelector('#barraLluvia');
    const barraNubes = document.querySelector('#barraNubes');
    const img = document.querySelector('#imgActual');
    cielo.textContent = info.desciel;
    ubicacion.textContent = ubicacionCompleta;
    for (let i = 0; i < 4; i++) {
        const imgDia = document.getElementById(`imgDia${i}`);
        mostrarTemperatura(datos[indice + i].tmin, datos[indice + i].tmax, datos[indice + i].ndia);
        mostrarImg(datos[indice + i].desciel, imgDia, datos[indice + i].probprec);
    }
    probLluvia.textContent = info.probprec;
    nubes.textContent = info.cc;
    precipitacion.firstChild.textContent = info.prec + ' ';
    viento.firstChild.textContent = info.velvien + ' ';
    barraLluvia.setAttribute('style', `width: ${info.probprec}%`);
    barraNubes.setAttribute('style', `width: ${info.cc}%`);
    mostrarImg(info.desciel, img, 0);

}

function mostrarTemperatura(min, max, dia) {
    const tempMin = document.querySelector(`#tempMin${dia}`);
    const tempMax = document.querySelector(`#tempMax${dia}`);
    tempMin.firstChild.textContent = min;
    tempMax.firstChild.textContent = max;
}
function mostrarImg(cielo, img, probLluvia) {
    let url = "https://www.metaweather.com/static/img/weather/";
    if (probLluvia > 50 && probLluvia < 70) {
        url += "s.svg";
    } else if (probLluvia > 70 && probLluvia < 85) {
        url += "lr.svg";
    } else if (probLluvia > 85) {
        url += "hr.svg";
    } else if (probLluvia < 50) {
        switch (cielo) {
            case "Cielo cubierto":
                url += "hc.svg";
                break;
            case "Cielo nublado":
                url += "hc.svg";
                break;
            case "Medio nublado":
                url += "lc.svg";
                break;
            case "Despejado":
                url += "c.svg";
                break;
            case "Poco nuboso":
                url += "lc.svg";
                break;
            default:
                url += "c.svg";
                break;
        }
    }
    console.log(url);
    img.setAttribute('src', url);
}

async function cargarApi() {
    /*let a = document.createElement('a');
    a.href = "https://smn.conagua.gob.mx/webservices/index.php?method=1";
    a.download = 'download';
    a.click();*/
    datos = await fetch('https://smn.conagua.gob.mx/webservices/?method=1', { mode: 'no-cors' })
        .then(function (res) {
            //console.log(res);
            return res.json();
        })
        .then(function (data) {
            //console.log(data);
            construirSelectores(data);
            return data;
        })
        .catch(error => {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Actualmente no se encuentra disponible la API del gobierno,se cargarán algunos datos para que pueda probar la aplicación'
            })

        });
}
async function cargarApiPrueba() {
    datos = await fetch('js/Clima_MexicoAPI_Prueba')
        .then(function (res) {
            //console.log(res);
            return res.json();
        })
        .then(function (data) {
            //console.log(data);
            construirSelectores(data);
            return data;
        })
}
function obtenerTipoCielos(datos) {
    const cielos = []
    console.log(datos);
    datos.forEach(elemento => {
        if (cielos.indexOf(elemento.desciel) === -1) {
            cielos.push(elemento.desciel);
        }
    })
    console.log(cielos);
}
function construirSelectores(datos) {
    let estados = [];
    const select = document.getElementById('estado');
    datos.forEach(elemento => {
        if (estados.indexOf(elemento.nes) === -1) {
            estados.push(elemento.nes);
            const option = document.createElement('option');
            option.value = elemento.nes;
            option.appendChild(document.createTextNode(elemento.nes));
            select.appendChild(option);
            municipios[elemento.nes] = [];
        }
        if (municipios[elemento.nes].indexOf(elemento.nmun) === -1) {
            municipios[elemento.nes].push(elemento.nmun);
        }

    });
    //console.log(estados);
    //console.log(municipios['Ciudad de México'])
}

function construirSelectoresMunicipios(estado) {
    const select = document.getElementById('municipio');
    if (select.hasChildNodes) {
        limpiarSelector();
    }
    municipios[estado].forEach(municipio => {
        const option = document.createElement('option');
        option.value = municipio;
        option.appendChild(document.createTextNode(municipio));
        select.appendChild(option);
    });
}

function limpiarSelector() {
    const select = document.getElementById('municipio');
    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

}
function modoOscuro() {
    const checkBox = document.querySelector('#dark-mode');
    const ladoDerecho = document.querySelector('#ladoDerecho');
    const ladoIzquierdo = document.querySelector('#ladoIzquierdo');
    const cards = document.getElementsByClassName('card-fondo');
    const textos = document.querySelectorAll('p');
    const btnBuscar = document.querySelector('#btnBuscar');
    const btnUbicacion = document.querySelector('#btnUbicacion');
    const texto = document.querySelector('#textActivo');
    const barraLluvia = document.querySelector('#barraLluvia');
    const barraNubes = document.querySelector('#barraNubes');
    if (checkBox.checked) {
        //console.log("desactivar modo oscuro");
        ladoDerecho.classList.toggle('fondo-derecho-light');
        ladoIzquierdo.classList.toggle('fondo-izquierdo-light');
        Array.from(cards).forEach(card => {
            card.classList.toggle('card-light');
        });
        textos.forEach(texto => {
            texto.classList.toggle('p-color')
        });
        btnBuscar.classList.remove('btn-info');
        btnUbicacion.classList.remove('btn-info');
        btnBuscar.classList.add('btn-primary');
        btnUbicacion.classList.add('btn-primary');
        texto.textContent = 'Activar';
        barraLluvia.classList.remove('bg-info');
        barraLluvia.classList.add('bg-primary');
        barraNubes.classList.remove('bg-info');
        barraNubes.classList.add('bg-primary');
    } else {
        ladoDerecho.classList.toggle('fondo-derecho-light');
        ladoIzquierdo.classList.toggle('fondo-izquierdo-light');
        Array.from(cards).forEach(card => {
            card.classList.toggle('card-light');
        });
        textos.forEach(texto => {
            texto.classList.toggle('p-color')
        });
        btnBuscar.classList.remove('btn-info');
        btnUbicacion.classList.remove('btn-info');
        btnBuscar.classList.add('btn-primary');
        btnUbicacion.classList.add('btn-primary');
        texto.textContent = 'Desactivar';
        barraLluvia.classList.remove('bg-primary');
        barraLluvia.classList.add('bg-info');
        barraNubes.classList.remove('bg-primary');
        barraNubes.classList.add('bg-info');
    }
}

function obtenerFecha() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const dia = fecha.getDay();
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    const numDia = fecha.getDate();
    const fechaStr = `${dias[dia - 1]} ${numDia} de ${meses[mes]} del ${año}`;
    const dia2 = `${numDia + 2} de ${meses[mes].substring(0, 3)}`;
    const dia3 = `${numDia + 3} de ${meses[mes].substring(0, 3)}`;
    document.getElementById('fecha').innerHTML = fechaStr;
    document.getElementById('dia2').innerHTML = dia2;
    document.getElementById('dia3').innerHTML = dia3;
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

function obtenerUbicacion() {
    if (!navigator.geolocation) {
        output.innerHTML = "<p>Geolocalización no soportada en tu navegador</p>";
        return;
    }

    function success(position) {
        ubicacion.latitud = position.coords.latitude;
        ubicacion.longitud = position.coords.longitude;
        ubicacion.msj = "ok";
    }
    function error() {
        ubicacion.msj = "Unable to retrieve your location";
    };

    navigator.geolocation.getCurrentPosition(success, error);

}

