const botones=document.querySelector('#botones')
const nombreusuario = document.querySelector('#nombreusuario')
const contenidoProtegido=document.querySelector('#contenidoProtegido')
const formulario=document.querySelector('#formulario')
const inputChat=document.querySelector('#inputChat')

firebase.auth().onAuthStateChanged(user => {
    if(user){
        console.log(user)
        botones.innerHTML=`<button class="btn btn-outline-danger m-lg-2" id="btnCerrarSesion">Cerrar Sesión</button>`
        nombreusuario.innerHTML=`Bienvenid@ ${user.displayName}`
        CerrarSesion()
        formulario.classList='input-group py-3 fixed-bottom container'
        contenidoChat(user)
    }
    else{
        console.log('No existe user')
        botones.innerHTML=`<button class="btn btn-outline-success m-lg-2" id="btnAcceder">Acceder</button>`
    
        IniciarSesion()
        nombreusuario.innerHTML='Chat'
        contenidoProtegido.innerHTML=`<p class="text-center lead mt-5" >Debes iniciar sesión</p>`
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