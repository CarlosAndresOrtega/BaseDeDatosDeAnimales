var config = {
    apiKey: "AIzaSyCtd2LMXOCZyQO1F51Y2x_hK7508gs03HI",
    authDomain: "imageprocess-d9fce.firebaseapp.com",
    databaseURL: "https://imageprocess-d9fce.firebaseio.com",
    projectId: "imageprocess-d9fce",
    storageBucket: "imageprocess-d9fce.appspot.com",
    messagingSenderId: "161538419888",
    appId: "1:161538419888:web:19682308f0715ea26c5f75",
    measurementId: "G-1JGYE9BL7W"
};
// Initialize Firebase

firebase.initializeApp(config);
let animalRef = firebase.database().ref("AnimalKingdom");

function downloadFile() {
    let name;

    let resultados = [];
    let busqueda = obtenerBusqueda();
    if (busqueda != -1) {

        contador = 0;
        document.getElementById("preview").innerHTML = '';

        animalRef.on('value', function (snapshot) {
            snapshot.forEach(function (e) {


                if (requisito(e.val(), busqueda) == true) {
                    resultados.push(e.val());

                    name = extraerNombre(e.val().URL);
                    document.getElementById("preview").innerHTML += (`<div id="${name}"></div>`);
                    ObtenerImagen(extraerNombre(e.val().URL), name, extraerNombre(e.val().audio));

                }
            });

        });

    } else {
        alert("No selecciono ningun tipo de busqueda");
    }
}
function agregarBase(x) {
    base_de_datos.push(x);
}
function obtenerPosicion(objeto) {
    for (let i = 0; i < base_de_datos.length; i++) {

        if (objeto.nombre == base_de_datos[i].nombre) {
            console.log(i, objeto.nombre);
            return i;
        }
    }
    return -1;

}
function ObtenerImagen(urlI, name, urlA) {

    firebase.storage().ref(`/imagenes/${urlI}`).getDownloadURL().then(resolve => {

        document.getElementById(`${name}`).innerHTML = ('<img src="' + resolve + '">');
        ObtenerAudio(urlA, name);

    }).catch(error => {
        console.log(error);

    });

}
function ObtenerAudio(url, name) {

    firebase.storage().ref(`/Audios/${url}`).getDownloadURL().then(resolve => {
        document.getElementById(`${name}`).innerHTML += ('<div><audio src="' + resolve + '" controls></audio></div>');

    }).catch(error => {
        console.log(error);

    });
}

function extraerNombre(url) {
    return url.replace("C:\\fakepath\\", "");

}
function obtenerBusqueda() {
    if (document.getElementById("inputNombre").value != "") {
        return [1, document.getElementById("inputNombre").value];
    } else if (document.getElementById("inputTamaño").value != "") {
        if (document.getElementById("Mayor").checked == true) {
            return [2, document.getElementById("inputTamaño").value, "Mayor"];
        } else if (document.getElementById("Igual").checked == true) {
            return [2, document.getElementById("inputTamaño").value, "Igual"];
        } else {
            return [2, document.getElementById("inputTamaño").value, "Menor"];
        }
        return [2, document.getElementById("inputTamaño").value];
    } else if (document.getElementById("R").checked || document.getElementById("G").checked || document.getElementById("B").checked) {
        if (document.getElementById("R").checked == true) {
            return [3, "R"];
        } else if (document.getElementById("G").checked == true) {
            return [3, "G"];
        } else if (document.getElementById("B").checked == true) {
            return [3, "B"];
        }

    } else if (document.getElementById("inputTamaño2").value != "") {
        if (document.getElementById("Mayor2").checked == true) {
            return [4, document.getElementById("inputTamaño2").value, "Mayor"];
        } else if (document.getElementById("Igual2").checked == true) {
            return [4, document.getElementById("inputTamaño2").value, "Igual"];
        } else {
            return [4, document.getElementById("inputTamaño2").value, "Menor"];
        }
        return [4, document.getElementById("inputTamaño2").value];
    } else {
        return -1;
    }
}
function requisito(Objeto, busqueda) {
    switch (busqueda[0]) {
        case 1:
            if (Objeto.nombre.toUpperCase().includes(busqueda[1].toUpperCase())) {
                return true;

            } else return false;
            break;
        case 2:
            valor = busqueda[1].toUpperCase().split("X");
            ancho = valor[0];
            alto = valor[1];
            switch (busqueda[2]) {
                case "Mayor":
                    if (Objeto.Ancho > ancho && Objeto.Alto > alto)
                        return true;
                    else
                        return false;
                    break;
                case "Igual":
                    if (Objeto.Ancho == ancho && Objeto.Alto == alto)
                        return true;
                    else
                        return false;
                    break;
                case "Menor":
                    if (Objeto.Ancho < ancho && Objeto.Alto < alto)
                        return true;
                    else
                        return false;
                    break;
            }

            break;
        case 3:
            Rojo = parseInt(Objeto.Rojo, 10);
            Verde = parseInt(Objeto.Verde, 10);
            Azul = parseInt(Objeto.Azul, 10);
            if (Rojo > Verde) {
                if (Verde > Azul) {
                    if (busqueda[1] == "R") {
                        return true;

                    }
                    // console.log("El mayor es rojo");
                } else {
                    if (Rojo > Azul) {
                        if (busqueda[1] == "R") {
                            return true;

                        }
                    } else {
                        if (busqueda[1] == "B") {
                            return true;

                        }
                    }
                }           // console.log("El mayor es azul");
            } else {
                if (Verde > Azul) {
                    if (busqueda[1] == "G") {
                        return true;

                    }
                } else {
                    if (busqueda[1] == "B") {
                        return true;

                    }
                }
            }
            return false;
            break;
        case 4:
            valor = parseFloat(busqueda[1]);
            
            switch (busqueda[2]) {
                case "Mayor":
                    if (Objeto.duracion > valor )
                        return true;
                    else
                        return false;
                    break;
                case "Igual":
                    valor = Math.round(busqueda[1]);
                    if (Math.round(Objeto.duracion) == valor)
                        return true;
                    else
                        return false;
                    break;
                case "Menor":
                    if (Objeto.duracion < valor)
                        return true;
                    else
                        return false;
                    break;
            }

            break;
    }

}
//////////////////////////////////////////////////////////////////////////////////////
