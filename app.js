
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase,ref  ,set,onChildAdded,push } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getStorage,ref as storageRef,uploadBytes,getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

var firebaseConfig = {
 // paste your Firebase Config here....
};
var app = initializeApp(firebaseConfig);
var inpFile = document.getElementById('productImg')
var DB = getDatabase(app)
var STORAGE = getStorage(app)
var productTitle = document.getElementById('productTitle')
var productDescription = document.getElementById('productDescription')
var productPrice = document.getElementById('productPrice')
var productHTML = document.getElementById('productHTML')
var ProuctList = []

window.submitData = function(){
    var obj = {
            title:productTitle.value,
            description : productDescription.value,
            price : productPrice.value,
        
    }
    var keyRef = ref(DB)
    var key  = push(keyRef).key
    obj.id = key
    var ImageStorageRef = storageRef(STORAGE,`images/${obj.id}.jpg`) //storage IMAGE ref
    uploadBytes(ImageStorageRef,inpFile.files[0]).then(function(success){
        getDownloadURL(success.ref).then((downloadURL) => {
            obj.imgURL = downloadURL
            var reference = ref(DB,`products/${obj.id}`)
            set(reference,obj)
          });
    }).catch(function(err){
        console.error(err)
    })
}
//GET FUNCTION
window.getDataFromDatabase = function(){
 var reference = ref(DB,`products`)

    onChildAdded(reference,function(data){
        // console.log(data.val());
        render(data.val())
    })
}

function render(data){
    if(data){
        ProuctList.push(data)
    }
    productHTML.innerHTML=''
    for (var i=0;i<ProuctList.length;i++) {
        
        productHTML.innerHTML+= `<img src='${ProuctList[i].imgURL}' alt='${ProuctList[i].title}image' width="100%" />        <br/>
        PRODUCT TITLE : ${ProuctList[i].title} <br/> Description : ${ProuctList[i].description}
        <br/>  Price : ${ProuctList[i].price}$ <br/>`
        
    }
}



window.onload = getDataFromDatabase()



