import express from 'express'
import firebaseMethodos, { searchLibrary, addUserSignup, listUsers, addLibrary, searchJogo, deleteLibrary } from '../services/firebaseMethods.js';
import { JWTSecret } from '../services/firebaseCredentias.js';
import { SignJWT, jwtVerify } from 'jose';

var router = express.Router();

router.get('/', function(req, res) {
    let token = req.get( 'Authorization' )
    if (!token) {
        res.status(401).send('Não autorizado, token não informado');
        return;
    }
    token = token.split(' ')[1];
    if (!token) {
        res.status(498).send('Não autorizado, token inválido');
        return;
    }
    jwtVerify(token, JWTSecret, { algorithms: ['HS256'] })
    .then((payload) =>{
        if (payload.payload.nivelAcesso == "admin"){
        listUsers()
        .then((user) => {   
            res.send(user)
        })
        .catch((error) => {
            res.send(error)
        })
        } else {
        res.status(498).send('Não autorizado, token inválido')
        }
    })
    .catch((error) => {
        console.log(error);
        if (error.code == 'ERR_JWT_EXPIRED') {
            res.status(498).send("Token expirado " + error.code);
        } else {
            res.status(498).send("Token inválido " + error.code);
        }
        return;
    });
})

router.get('/activeUser', function(req, res) {
    let token = req.get( 'Authorization' )
    if (!token) {
        res.status(401).send('Não autorizado, token não informado');
        return;
    }
    token = token.split(' ')[1];
    if (!token) {
        res.status(498).send('Não autorizado, token inválido');
        return;
    }
    jwtVerify(token, JWTSecret, { algorithms: ['HS256'] })
    .then((payload) =>{
        res.send(payload);
    })
    .catch((error) => {
        console.log(error);
        if (error.code == 'ERR_JWT_EXPIRED') {
            res.status(498).send("Token expirado " + error.code);
        } else {
            res.status(498).send("Token inválido " + error.code);
        }
        return;
    });
})

router.get('/library', function(req, res) {
    let token = req.get( 'Authorization' )
    if (!token) {
        res.status(401).send('Não autorizado, token não informado');
        return;
    }
    token = token.split(' ')[1];
    if (!token) {
        res.status(498).send('Não autorizado, token inválido');
        return;
    }
    jwtVerify(token, JWTSecret, { algorithms: ['HS256'] })
    .then((payload) =>{
        const email = req.body.email
        if (payload.payload.nivelAcesso == "admin"){
            searchLibrary(email)
            .then((user) => {   
                if (user.length == 0) {
                    res.status(404).send("No user found")
                } else {
                    res.send(user[0])
                }
            })
            .catch((error) => {
                res.status(400).send(error)
            })
        } else {
            if (payload.payload.email == email) {
                searchLibrary(email)
                .then((user) => {   
                    if (user.length == 0) {
                        res.status(404).send("No user found")
                    } else {
                        res.send(user[0])
                    }
                })
                .catch((error) => {
                    res.status(400).send(error)
                })
            } else {
            res.status(498).send('Não autorizado, token inválido')
            }
        } 
        
    })
    .catch((error) => {
        console.log(error);
        if (error.code == 'ERR_JWT_EXPIRED') {
            res.status(498).send("Token expirado " + error.code);
        } else {
            res.status(498).send("Token inválido " + error.code);
        }
        return;
    });
})

router.post('/library', function(req, res) {
    let token = req.get( 'Authorization' )
    if (!token) {
        res.status(401).send('Não autorizado, token não informado');
        return;
    }
    token = token.split(' ')[1];
    if (!token) {
        res.status(498).send('Não autorizado, token inválido');
        return;
    }
    jwtVerify(token, JWTSecret, { algorithms: ['HS256'] })
    .then((payload) => {
        if (payload.payload.nivelAcesso == "admin"){
            searchJogo(req.body.tittle)
            .then((jogo) => {
              if (jogo.length == 0) {
                res.status(404).send("No game found")
              } else {
                searchLibrary(req.body.email)
                .then((user) => {
                if (user.length == 0) {
                    res.status(404).send("No user found")
                } else {
                    addLibrary(user, jogo[0])
                    .then(() => {
                        res.send("Jogo adicionado com sucesso")
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(500).send(error)
                    })
                  }
                })
                .catch((error) => {
                    res.status(500).send(error)
                })    
              }
            })
            .catch((error) => {
                res.status(500).send(error)
            })
        } else {
            if (payload.payload.email == req.body.email) {
                searchJogo(req.body.tittle)
                .then((jogo) => {
                    if (jogo.length == 0) {
                        res.status(404).send("No game found")
                    } else {
                        searchLibrary(req.body.email)
                        .then((user) => {
                        if (user.length == 0) {
                            res.status(404).send("No user found")
                        } else {
                            addLibrary(user, jogo[0])
                            .then(() => {
                                res.send("Jogo comprado com sucesso")
                            })
                            .catch((error) => {
                                console.log(error);
                                res.status(500).send(error)
                            })
                        }
                        })
                        .catch((error) => {
                            res.status(500).send(error)
                        })      
                    }
                })
                .catch((error) => {
                    res.status(500).send(error)
                })  
            } else {
            res.status(498).send('Não autorizado, token inválido')
            }
        } 
        
    })
    .catch((error) => {
        console.log(error);
        if (error.code == 'ERR_JWT_EXPIRED') {
            res.status(498).send("Token expirado " + error.code);
        } else {
            res.status(498).send("Token inválido " + error.code);
        }
        return;
    });
})

router.delete('/library', function(req, res) {
    let token = req.get( 'Authorization' )
    if (!token) {
        res.status(401).send('Não autorizado, token não informado');
        return;
    }
    token = token.split(' ')[1];
    if (!token) {
        res.status(498).send('Não autorizado, token inválido');
        return;
    }
    jwtVerify(token, JWTSecret, { algorithms: ['HS256'] })
    .then((payload) => {
        if (payload.payload.nivelAcesso == "admin"){
            searchJogo(req.body.tittle)
            .then((jogo) => {
              if (jogo.length == 0) {
                res.status(404).send("No game found")
              } else {
                searchLibrary(req.body.email)
                .then((user) => {
                if (user.length == 0) {
                    res.status(404).send("No user found")
                } else {
                    deleteLibrary(user, jogo[0])
                    .then(() => {
                        res.send("Jogo removido com sucesso")
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(500).send(error)
                    })
                    }
                })
                .catch((error) => {
                    res.status(500).send(error)
                })  
              }
            })
            .catch((error) => {
                res.status(500).send(error)
            })
        } else {
            res.status(498).send('Não autorizado, token inválido')
        } 
    })
    .catch((error) => {
        console.log(error);
        if (error.code == 'ERR_JWT_EXPIRED') {
            res.status(498).send("Token expirado " + error.code);
        } else {
            res.status(498).send("Token inválido " + error.code);
        }
        return;
    });
})

router.post('/signup', function(req, res) {
    firebaseMethodos.signupEmailSenha(req.body.email,req.body.senha)
    .then((user) => {
        console.log(user)
        addUserSignup(req.body.email)
        res.send(201)
    })
    .catch((error) => {
        console.log(error);
        res.send(500)
    })
});

router.post('/login', function(req, res) {
    firebaseMethodos.loginEmailSenha(req.body.email,req.body.senha)
    .then((user) => {
        let payload = {
            user: 'Usuario do sistema',
            email: user.email,
            nivelAcesso: 'user'
        }
        const userAdmins = ["email.adm@gmail.com"]
        if (userAdmins.includes(user.email)){
            payload = {
                user: 'Administrador do sistema',
                email: user.email,
                nivelAcesso: 'admin'
            }
        }
        new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setSubject('Login dia '+new Date())
        .setJti('123')
        .setExpirationTime('10m')
        .sign(JWTSecret)
        .then( (token) => {
            res.status(200).send(token);
        })
        .catch((error) => {
            console.log(error);
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(500)
    })
});



export default router;