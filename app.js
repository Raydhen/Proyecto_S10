const botones=document.querySelector('#botones')
const nombreusuario = document.querySelector('#nombreusuario')
const contenidoProtegido=document.querySelector('#contenidoProtegido')
const formulario=document.querySelector('#formulario')
const inputChat=document.querySelector('#inputChat')
firebase.auth().onAuthStateChanged(user => {
    if(user){
        console.log(user)
        botones.innerHTML=`<button class="btn btn-outline-danger m-lg-2" id="btnCerrarSesion" style="transition: all .5s ease;">Cerrar Sesión</button>`
        nombreusuario.innerHTML=`Bienvenid@ ${user.displayName}`
        CerrarSesion()
        formulario.classList='input-group py-3 fixed-bottom container'
        contenidoProtegido.classList='mt-2'
        contenidoChat(user)
    }
    else{
        console.log('No existe user')
        botones.innerHTML=`<button class="btn btn-outline-info p-2 bd-highlight" style="transition: all .5s ease;">Registrarse</button>
        <button class="btn btn-outline-success m-lg-2 p-2 bd-highlight" id="btnAcceder" style="transition: all .5s ease;">Acceder</button>`
        IniciarSesion()
        nombreusuario.classList='navbar-brand p-2 flex-grow-1 bd-highlight'
        nombreusuario.innerHTML='Chat'
        contenidoProtegido.classList='mt-2 overflow-hidden'
        contenidoProtegido.innerHTML=`<p class="text-center lead mt-5" style="color: white;">Debes iniciar sesión o registrarte</p>
                                      <center><img src="a6b715ecba7ebca3dae9adb2c2daf27e.gif"/></center>`
        formulario.classList='input-group py-3 fixed-bottom container d-none'
        
    }
})

const IniciarSesion=()=>{

    const btnAcceder =document.querySelector('#btnAcceder')
    btnAcceder.addEventListener('click',async()=>{
    //console.log('Me diste click en acceder');
    try{
        const provider=new firebase.auth.GoogleAuthProvider()
        await firebase.auth().signInWithPopup(provider)
    }
    catch(e){
        console.log(e)
    }
    })
}
const CerrarSesion =()=>{
    const btnCerrarSesion=document.querySelector('#btnCerrarSesion')
    btnCerrarSesion.addEventListener('click', ()=>{
        firebase.auth().signOut()
    })
}
const contenidoChat =(user)=>{
    formulario.addEventListener('submit',(e)=>{
        e.preventDefault()
        console.log(inputChat.value)
        if(!inputChat.value.trim()){
            console.log('input vacio')
            return
        }
        firebase.firestore().collection("Chat").add({
            texto: inputChat.value,
            uid: user.uid,
            fecha: Date.now()  
        })
            .then(res=>{console.log('Mensaje guardado')
        })
            .catch(e=>console.log(e))
        inputChat.value=''
    })

    firebase.firestore().collection("Chat").orderBy('fecha')
    .onSnapshot(query=>{
       //console.log(query)
        contenidoProtegido.innerHTML=''
        query.forEach(doc=>{
            console.log(doc.data())
            if(doc.data().uid===user.uid){
                contenidoProtegido.innerHTML +=`<div class="d-flex justify-content-end">
                                      <span class="badge rounded-pill bg-primary" style="font-size:13px; margin-top: 1.5px">${doc.data().texto}</span>
                                      </div>`
            }
            else{
                contenidoProtegido.innerHTML +=`<div class="d-flex justify-content-start">
                                                <span class="badge rounded-pill bg-secondary" style="font-size:13px; margin-top: 1.5px">${doc.data().texto}</span>
                                                </div>`
            }
            contenidoProtegido.scrollTop=contenidoProtegido.scrollHeight
        })
    })
}
// -------------------------------------------------------------------------
