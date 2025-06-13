import express from 'express';
import db from "../db.json" with {type : 'json'}
var router = express.Router();

const jogos = db.jogos
let id = db.jogos.length

router.get('/', function(req, res, next) {
  res.json(db)
});

router.post('/', function(req, res, next) {
  const tittle = req.body.tittle
  const date = req.body.date
  const jogo = {
    id,tittle,date
  }
  jogos[id] = jogo
  id = id++
  res.json(db)
})

router.delete('/', (req, res) => {
  const id_delete = req.body.id
  jogos.splice(id_delete, 1);
  let i = id_delete
  for(; i < jogos.length; i++){
    jogos[i].id = i
  }
  res.json(jogos)
  }
)

router.put('/', (req, res) => {
  const id_put = req.body.id
  const tittle = req.body.tittle
  const date = req.body.date
  const jogo = {
    id,tittle,date
  }
  jogos[id_put] = jogo
  res.json(jogos)
  }
)

router.patch('/', (req, res) => {
  const id_patch = req.body.id
  if (req.body.tittle != null){
    jogos[id_patch].tittle = req.body.tittle
  } else if(req.body.date != null) {
    jogos[id_patch].date = req.body.date
  } else {
    res.send(304)
  }
  res.json(jogos)
  }
)

// app.patch('/', (req, res) => {
//   const id_patch = req.body.id
//   const modify = req.body.modify
//   const value = req.body.value
//   jogos[id_patch].modify = value
//   res.json(jogos)
//   }
// )

export default router;
