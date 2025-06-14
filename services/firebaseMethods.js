import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword } 
from "firebase/auth";
import { getFirestore, setDoc, doc, collection, getDocs, addDoc, query, where, deleteDoc} from "firebase/firestore";

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
        ownedGames: []
    })
    docRef
    .then((doc) => {
        console.log("Usuario salvo com ID: ", doc.id);
    })
    .catch((error) => {
        console.log(error)
        console.log("Erro ao salvar usuario no db de ownedGames")
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

export function searchOwnedGames(email) {
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



// export function searchOwnedGames() {
//     return new Promise((resolve, reject) => {
//         getDocs(collection(db, "users"))
//         .then((querySnapshot) => {
//             const resposta = new Array();
//             querySnapshot.forEach((doc) => {
//             let temp = doc.data();
//             temp.id = doc.id;
//             resposta.push(temp);
//           });
//           resolve(resposta);
//         })
//         .catch((error) => {
//           reject(error);
//         });
//       }
//     )
// }

// export function addOwnedGame(email, ownedGame) {

//     const q = query(collection(db,"users"), where("email", "==", email))
//     const querySnapshot = getDocs(q);

//     querySnapshot.forEach((doc) => {
//     setDoc(doc, ownedGame)
//     .then((resposta) => {
//         console.log(resposta)
//         console.log("Jogo registrado com sucesso");
//     })
//     .catch((error) => {
//         console.error("Erro ao adicionar documento: ", error);
//     })
//     });
    
// }