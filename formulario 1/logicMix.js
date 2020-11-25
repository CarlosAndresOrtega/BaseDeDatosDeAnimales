var cargados = 0;

function sincronizarAudio() {
  cargados++;

  if (cargados == 2) {
    audio1.play();
    audio2.play();
  }
}

function sincronizarPlay() {
  audio1.play();
  audio2.play();
}

function sincronizarPause() {
  audio1.pause();
  audio2.pause();
}

var audio1 = document.createElement("audio");
audio1.setAttribute("src", "http://www.w3schools.com/tags/mov_bbb.ogg");
audio1.setAttribute("controls", "controls");
audio1.oncanplaythrough = sincronizarAudio;
audio1.onplay = sincronizarPlay;
audio1.onpause = sincronizarPause;
document.querySelector("body").appendChild(audio1);

var audio2 = document.createElement("audio");
audio2.setAttribute("src", "http://www.w3schools.com/tags/movie.ogg");
audio2.setAttribute("controls", "controls");
audio2.oncanplaythrough = sincronizarAudio;
audio2.onplay = sincronizarPlay;
audio2.onpause = sincronizarPause;
document.querySelector("body").appendChild(audio2);