import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword } 
from "firebase/auth";
import { getFirestore, setDoc, doc, collection, getDocs, addDoc } from "firebase/firestore";

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

export function addJogos(jogo) {
    const docRef = doc(collection(db,"jogos"));
    setDoc(docRef, jogo)
    .then((resposta) => {
        console.log(resposta)
        console.log("Jogo registrado com ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    })
}

export function searchJogos() {
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

export function deleteJogo(jogoTittle) {
    const jogosQuery = db.collection("jogos").where('tittle','==',jogoTittle);
    jogosQuery.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.delete();
        });
    });
}