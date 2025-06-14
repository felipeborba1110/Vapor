import express from 'express';
import { addJogos, searchJogos, deleteJogo } from '../services/firebaseMethods.js';
var router = express.Router();

router.get('/', function(req, res, next) {
    searchJogos()
    .then((jogos) => {
      res.json(jogos)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send(error);
    })
});

router.post('/', function(req, res, next) {
  try{
    const body = req.body
    addJogos(body)
    res.send(201)
  } catch (error) {
    console.log(error)
    res.status(error.codigoStatus).send(error.message);
  }
})

router.delete('/', (req, res) => {
  try {
    const jogoTittle = req.body.tittle
    firebaseJogos.deleteJogo(jogoTittle)
    res.send(200)
  } catch (error) {
    console.log(error)
    res.status(error.codigoStatus).send(error.message);
  }
})

// router.delete('/', (req, res) => {
//   const id_delete = req.body.id
//   jogos.splice(id_delete, 1);
//   let i = id_delete
//   for(; i < jogos.length; i++){
//     jogos[i].id = i
//   }
//   res.json(jogos)
//   }
// )

// router.put('/', (req, res) => {
//   const id_put = req.body.id
//   const tittle = req.body.tittle
//   const date = req.body.date
//   const jogo = {
//     id,tittle,date
//   }
//   jogos[id_put] = jogo
//   res.json(jogos)
//   }
// )

// router.patch('/', (req, res) => {
//   const id_patch = req.body.id
//   if (req.body.tittle != null){
//     jogos[id_patch].tittle = req.body.tittle
//   } else if(req.body.date != null) {
//     jogos[id_patch].date = req.body.date
//   } else {
//     res.send(304)
//   }
//   res.json(jogos)
//   }
// )

export default router;
