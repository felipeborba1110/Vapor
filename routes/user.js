import express from 'express'
import firebaseMethodos from '../services/firebaseMethods.js';
// import { firebaseConfig } from '../services/firebaseCredentias';
var router = express.Router();

router.post('/signup', function(req, res, next) {
    firebaseMethodos.signupEmailSenha(req.body.email,req.body.senha)
    .then((user) => {
        console.log(user);
        res.send(201)
    })
    .catch((error) => {
        console.log(error);
        res.send(500)
    })
});

router.post('/login', function(req, res, next) {
    firebaseMethodos.loginEmailSenha(req.body.email,req.body.senha)
    .then((user) => {
        console.log(user);
        res.send(202)
    })
    .catch((error) => {
        console.log(error);
        res.send(500)
    })
});

export default router;