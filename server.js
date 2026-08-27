import express from 'express';
import db from './db.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({mensagem: 'API Tarefas está online!'});
});

app.post('/tarefas', (req, res) =>{

    const {titulo, descricao} = req.body;
    if(!titulo || titulo.trim() === ''){
        return res.status(400).json({erro: 'O campo titulo é obrigatório'});
    }
    const insecao = db.prepare(
    'INSERT INTO tarefas (titulo, descricao) VALUES (?, ?)'
    );

    const resultado = insecao.run(titulo, descricao ?? null);
    const novaTarefa = db
    .prepare('SELECT * FROM tarefas WHERE id = ?')
    .get(resultado.lastInsertRowid);
    
    res.status(201).json(novaTarefa);

});

app.get('/tarefas', (req, res) => {
  const tarefas = db
  .prepare('SELECT * FROM tarefas ORDER BY id').all();
  res.json(tarefas);
});

app.get('/tarefas/:id', (req, res) => {
  const {id} = req.params;
  const tarefa = db
  .prepare('SELECT * FROM tarefas WHERE id = ?')
  .get(id);
  
  if(!tarefa){
    return res.status(404).json({erro: 'Tarefa não encontrada'});
  }
  res.json(tarefa);

});


app.listen(3333, () => {
  console.log('Servidor rodando na porta 3333');
});