var selectedFile;
var selectedFile2;
var alto;
var ancho;

var config={
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
//firebase.analytics();
let animalRef=firebase.database().ref("AnimalKingdom");

const btnSub=document.getElementById("Btnsend").addEventListener('click',save2send);

function save2send(e){
  let 
  nombre= document.getElementById("animalName").value,
  especie= document.getElementById("animalEspecie").value,
  genero= document.getElementById("animalGenero").value,
  foto= document.getElementById("animalFoto").value;
  audio= document.getElementById("animalAudio").value;
  r=document.getElementById("ColorR").value;
  g=document.getElementById("ColorG").value;
  b=document.getElementById("ColorB").value;
  
  console.log(foto);
  e.preventDefault();
 
  
  if(validarColor(r,g,b)==true){
    let newAnimal= animalRef.push();
    newAnimal.set({nombre:nombre,
                   especie:especie,
                   genero:genero,
                   audio: audio,
                   URL:foto,
                   Alto: alto,
                   Ancho: ancho,
                   Rojo:r,
                   Verde:g,
                   Azul:b});
    uploadFile();
    //Reset form
    document.getElementById("formRegister").reset();
    document.getElementById("Dpreview").style.display="none";
    alert("Su imagen "+nombre+" fue registrada exitosamente");
  
  }else{
    document.getElementById("ColorR").focus();
    document.getElementById("ColorR").value="";
    document.getElementById("ColorG").value="";
    document.getElementById("ColorB").value=""  ;
  }
}
document.getElementById("animalFoto").addEventListener("change",function(event){
  selectedFile=event.target.files[0];
  if(selectedFile.length==0 || !(/\.(jpg|png)$/i).test(selectedFile.name)){
    alert('Ingrese una imagen con alguno de los siguientes formatos: .jpeg/.jpg/.png.');
    document.getElementById("formRegister").reset();
  }else{
    document.getElementById("Dpreview").style.display="block";
    
    var img = new Image();
    img.src = URL.createObjectURL(selectedFile);
    img.onload = function() {
      ancho=this.width;
      alto=this.height;
    };
    var file=document.getElementById("animalFoto").files;
    if(file.length>0){
      var fileReader=new FileReader();
      fileReader.onload=function(event){
        document.getElementById("preview").setAttribute("src",event.target.result);
      };
      fileReader.readAsDataURL(file[0]);
    }
  }

 
})
document.getElementById("animalAudio").addEventListener("change",function(event){
  selectedFile2=event.target.files[0];
  if(selectedFile2.length==0 || !(/\.(mp3|wav|ogg)$/i).test(selectedFile2.name)){
    alert('Ingrese una imagen con alguno de los siguientes formatos: .mp3/.wav/.ogg.');
    document.getElementById("formRegister").reset();
  }else{
    // document.getElementById("Dpreview").style.display="block";
    
    var audio = new Audio();
    audio.src = URL.createObjectURL(selectedFile2);
    
    var file=document.getElementById("animalAudio").files;
    // if(file.length>0){
    //   var fileReader=new FileReader();
    //   fileReader.onload=function(event){
    //     document.getElementById("preview").setAttribute("src",event.target.result);
    //   };
    //   fileReader.readAsDataURL(file[0]);
    // }
  }
 
})
function uploadFile(){
  var filename = selectedFile.name;
  var filename2 = selectedFile2.name;
  var storageRef = firebase.storage().ref("/imagenes/" + filename);
  var storageRef2 = firebase.storage().ref("/Audios/" + filename2);
    
  
  var uploadTask=storageRef.put(selectedFile);
  var uploadTask2=storageRef2.put(selectedFile2);


  uploadTask.on('state_changed',function(snapshot){
  
  },function(error) { 
    
  },function(){

    var downloadURL=uploadTask.snapshot.downloadURL;
    console.log(downloadURL);
  });
  
  uploadTask2.on('state_changed',function(snapshot){
  
  },function(error) { 
    
  },function(){

    var downloadURL=uploadTask2.snapshot.downloadURL;
    console.log(downloadURL);
  });
  
}
function validarColor(r,g,b){
  r=parseInt(r,10);
  g=parseInt(g,10);
  b=parseInt(b,10);
 
  if(r+g+b!=100){
    alert("La suma de los porcentajes de color deben sumar el 100%");
    return false;
  }else{
    return true;
  }
}


