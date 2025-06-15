import express from 'express';
import { addJogo, deleteJogo, searchJogo, listJogos, updateJogo } from '../services/firebaseMethods.js';
import { JWTSecret } from '../services/firebaseCredentias.js';
import { jwtVerify } from 'jose';
var router = express.Router();

router.get('/', function(req, res) {
    listJogos()
    .then((jogos) => {
      res.json(jogos)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send(error);
    })
});

router.post('/', function(req, res) {
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
              const jogo = {
                tittle: req.body.tittle,
                date: req.body.date
              }
              addJogo(jogo)
              .then((resposta) => {
                res.status(201).send("Jogo registrado com sucesso com id: " + resposta)
              })
              .catch((error) => {
                console.log(error);
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

router.delete('/', (req, res) => {
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
            searchJogo(req.body.tittle)
            .then((jogo) => {
              if (jogo.length == 0) {
                res.status(404).send("No game found")
              } else {
                deleteJogo(jogo[0])
                .then(() => {
                  res.send("Jogo deletado com sucesso")
                })
                .catch((error) => {
                  res.send(error)
                })
              }
            })
            .catch((error) => {
              console.log(error);
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

router.patch('/', function(req, res) {
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
          searchJogo(req.body.tittle)
            .then((jogo) => {
              if (jogo.length == 0) {
                res.status(404).send("No game found")
              } else {
                updateJogo(jogo[0], req.body.date)
                .then(() => {
                  res.send("Jogo alterado com sucesso")
                })
                .catch((error) => {
                  res.send(error)
                })
              }
            })
            .catch((error) => {
              console.log(error);
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

export default router;
