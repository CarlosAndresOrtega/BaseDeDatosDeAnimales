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
let audioRef = firebase.database().ref("AudiosMix");

var sources = [
];

var description = "MIX";
var context;
var recorder;
var div = document.querySelector("#Mostrar");
var duration = 10000;
var chunks = [];
var audio = new AudioContext();
var mixedAudio = audio.createMediaStreamDestination();
var player = new Audio();
player.controls = "controls";
var selectedFile2;
var storageRef3;
var uploadTask3;

function busquedaSonido() {
    let animal;
    animal = document.getElementById("inputNombre").value;
    document.getElementById("resultados").innerHTML = "";
    animalRef.on('value', function (snapshot) {
        snapshot.forEach(function (e) {
            if (e.val().nombre.toUpperCase().includes(animal.toUpperCase())==true) {
                document.getElementById("resultados").innerHTML += `<div id="${e.val().nombre}"><p>${e.val().nombre}</p></div><button onclick="agregarSonido('${e.val().nombre}')" style="cursor:pointer" class="btn btn-success">Agregar al Mixer</button>`;
                ponerAudio(e.val().audio, e.val().nombre);
            }

        });

    });

}
function ponerAudio(url, name) {
    url = url.replace("C:\\fakepath\\", "");

    firebase.storage().ref(`/Audios/${url}`).getDownloadURL().then(resolve => {
        document.getElementById(`${name}`).innerHTML += ('<audio src="' + resolve + '" controls></audio>');

    }).catch(error => {
        console.log(error);

    });
}
function agregarSonido(sonido) {
    alert("Sonido agregado :" + sonido);
    animalRef.on('value', function (snapshot) {
        snapshot.forEach(function (e) {
            if (e.val().nombre == sonido) {
                let url = e.val().audio.replace("C:\\fakepath\\", "");
                firebase.storage().ref(`/Audios/${url}`).getDownloadURL().then(resolve => {
                    sources.push(resolve);
                    document.getElementById("sources").innerHTML += sonido + ", ";

                }).catch(error => {
                    console.log(error);

                });
            }

        });

    });
}
function get(src) {
    return fetch(src)
        .then(function (response) {
            return response.arrayBuffer()
        })
}

function stopMix(duration, ...media) {
    setTimeout(function (media) {
        media.forEach(function (node) {
            node.stop()
        })
    }, duration, media)
}
function iniciar() {

    Promise.all(sources.map(get)).then(function (data) {
        var len = Math.max.apply(Math, data.map(function (buffer) {
            return buffer.byteLength
        }));
        context = new OfflineAudioContext(2, len, 44100);
        return Promise.all(data.map(function (buffer) {
            return audio.decodeAudioData(buffer)
                .then(function (bufferSource) {
                    var source = context.createBufferSource();
                    source.buffer = bufferSource;
                    source.connect(context.destination);
                    return source.start()
                })
        }))
            .then(function () {
                return context.startRendering()
            })
            .then(function (renderedBuffer) {
                return new Promise(function (resolve) {
                    var mix = audio.createBufferSource();
                    mix.buffer = renderedBuffer;
                    mix.connect(audio.destination);
                    mix.connect(mixedAudio);
                    recorder = new MediaRecorder(mixedAudio.stream);
                    recorder.start(0);
                    mix.start(0);
                    div.innerHTML = "reproduciendo y grabando pistas..";
                    // stop playback and recorder in 60 seconds
                    stopMix(duration, mix, recorder)

                    recorder.ondataavailable = function (event) {
                        chunks.push(event.data);
                    };

                    recorder.onstop = function (event) {
                        var blob = new Blob(chunks, {
                            "type": "audio/mp3"
                        });
                        console.log("recording complete");
                        resolve(blob)
                    };
                })
            })
            .then(function (blob) {

                console.log(blob);
                div.innerHTML = "Audio mezclado listo para descargar..";
                var audioDownload = URL.createObjectURL(blob);
                var a = document.createElement("a");
                a.style.position = "relative";
                a.style.left = "50px";
                document.getElementById("Descargar").style.position = "relative";
                document.getElementById("Descargar").style.backgroundColor = "aliceblue";
                document.getElementById("Descargar").style.zIndex = "20";

                a.download = description + "." + blob.type.replace(/.+\/|;.+/g, "");
                a.href = audioDownload;
                a.innerHTML = a.download;
                document.getElementById("Descargar").appendChild(a);
                a.insertAdjacentHTML("afterend", "<br>");
                player.src = audioDownload;
                document.getElementById("Descargar").appendChild(player);

                // document.getElementById(`prueba`).innerHTML += ('<audio src="' + blob + '" controls></audio>');
                storageRef3 = firebase.storage().ref("/AudiosMezclados/" + Date.now());
                uploadTask3 = storageRef3.put(blob);
                uploadTask3.on('state_changed', function (snapshot) {

                }, function (error) {

                }, function () {

                    var downloadURL = uploadTask3.snapshot.downloadURL;
                    console.log(downloadURL);
                    let newAnimal = audioRef.push();
                    newAnimal.set({
                        // nombre: document.getElementById("resultados").innerHTML.split(", ").join("-"),
                        nombre: Date.now(),
                        descargable: downloadURL
                     });
                });
                

            })
    })
        .catch(function (e) {
            console.log(e)
        });
}
function ObtenerAudios() {

    document.getElementById("preview").innerHTML="";
    audioRef.on('value', function (snapshot) {
        snapshot.forEach(function (e) {
            console.log(e.val().URL);   
            document.getElementById("preview").innerHTML += (`<audio src= "${e.val().descargable}"  controls></audio>`);
        });
    });

        
}
