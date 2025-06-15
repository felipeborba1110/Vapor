import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword } 
from "firebase/auth";
import { getFirestore, setDoc, doc, collection, getDocs, addDoc, query, where, deleteDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";

import { firebaseConfig } from '../services/firebaseCredentias.js'

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const firebaseLogin = {
    signupEmailSenha: (email, senha) => {
        return new Promise((resolve, reject) => {
            createUserWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                console.log(userCredential)
                resolve(userCredential.user) 
            })
            .catch((error)=>{
                reject(error.message)
            })
        })

    },
    loginEmailSenha: (email, senha) => {
        return new Promise((resolve,reject) => {
            signInWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                resolve(userCredential.user)
            })
            .catch((error) => {
                reject(error.message)
            })
        })
    }
}

export default firebaseLogin;

export function addJogo(jogo) {
    const docRef = doc(collection(db,"jogos"));
    setDoc(docRef, jogo)
    .then(() => {
        console.log("Jogo registrado com sucesso");
    })
    .catch((error) => {
        console.error("Erro ao adicionar documento: ", error);
    })
}

export function listJogos() {
    return new Promise((resolve, reject) => {
        getDocs(collection(db, "jogos"))
        .then((querySnapshot) => {
            const resposta = new Array();
            querySnapshot.forEach((doc) => {
            let temp = doc.data();
            temp.id = doc.id;
            resposta.push(temp);
          });
          resolve(resposta);
        })
        .catch((error) => {
          reject(error);
        });
      }
    )
}

export function searchJogo(tittle) {
    return new Promise ((resolve, reject)=> {
        const q = query(collection(db, "jogos"), where("tittle", "==", tittle));

        getDocs(q)
        .then((querySnapshot) => {
            const resposta = new Array();
            querySnapshot.forEach((doc) => {
                let temp = doc.data();
                temp.id = doc.id;
                resposta.push(temp);
            })
            resolve(resposta)
        })
        .catch((error) => {
            reject(error)
        })
      }
    )
}

export function deleteJogo(jogo) {
    return new Promise ((resolve, reject) => {
        console.log("Deletando jogo: " + JSON.stringify(jogo, null, 2))
        deleteDoc(doc(db, "jogos", jogo.id))
        .then((resposta)=>{
            resolve(resposta)
        })
        .catch((error) => {
            console.log(error);
            console.log("Erro ao deletar jogo");
            reject(error)
        })
    })
}

export function addUserSignup(email) {
    const docRef = addDoc(collection(db, "users"), {
        email: email,
        library: []
    })
    docRef
    .then((doc) => {
        console.log("Usuario salvo com ID: ", doc.id);
    })
    .catch((error) => {
        console.log(error)
        console.log("Erro ao salvar usuario e no cadastro de sua biblioteca de jogos")
    })
}

export function listUsers() {
    return new Promise ((resolve, reject)=> {
        const q = query(collection(db, "users"))

        getDocs(q)
        .then((querySnapshot) => {
            const resposta = new Array();
            querySnapshot.forEach((doc) => {
                let temp = doc.data();
                temp.id = doc.id;
                resposta.push(temp);
            })
            resolve(resposta)
        })
        .catch((error) => {
            reject(error)
        })
      }
    )
}

export function searchLibrary(email) {
    return new Promise ((resolve,reject) => {
        const q = query(collection(db, "users"), where("email", "==", email));

        getDocs(q)
        .then((querySnapshot) => {
            const resposta = new Array();
            querySnapshot.forEach((doc) => {
                let temp = doc.data();
                temp.id = doc.id;
                resposta.push(temp);
            })
            resolve(resposta)
        })
        .catch((error) => {
            reject(error)
        })
    })    
}

export function addLibrary(email, jogo) {
    return new Promise ((resolve,reject) => {
        searchLibrary(email)
        .then((user) => {
        if (user.length == 0) {
            res.status(404).send("No user found")
        } else {
            const docRef = doc(db, "users", user[0].id);
            updateDoc(docRef, { 
                library: arrayUnion(jogo)
            })
            .then((resposta) => {
                resolve(resposta)
            })
            .catch((error) => {
                reject(error)
            })
        }
        })
        .catch((error) => {
            console.log("Erro ao adicionar jogo na biblioteca do usuario");
            reject(error)
        })
    })
}

export function deleteLibrary(email, jogo) {
    return new Promise ((resolve,reject) => {
        console.log("Usuario Afetado: " + email)
        console.log("Removendo jogo: " + JSON.stringify(jogo, null, 2))
        searchLibrary(email)
        .then((user) => {
        if (user.length == 0) {
            res.status(404).send("No user found")
        } else {
            const docRef = doc(db, "users", user[0].id);
            updateDoc(docRef, { 
                library: arrayRemove(jogo)
            })
            .then((resposta) => {
                resolve(resposta)
            })
            .catch((error) => {
                reject(error)
            })
        }
        })
        .catch((error) => {
            console.log("Erro ao remover jogo na biblioteca do usuario");
            reject(error)
        })
    })
}