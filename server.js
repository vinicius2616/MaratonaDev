//configurando o servidor.
const express = require('express');
const server = express();

//configurar servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({extended:true}));

//configurar a conexão com o bd
const Pool = require('pg').Pool;
const db = new Pool({
  user: 'postgres',
  password: '123',
  host: 'localhost',
  port: 5432,
  database:'doe'

})

//configurando a template engine
const nunjucks = require('nunjucks');
nunjucks.configure('./', {
  express: server,
  noCache: true, 
})

//configurar apresentação da página
server.get('/', (req, res) => {
  //render index.html                     //resultado
  db.query("select * from donors", (err, result) => {
    if (err) return res.send("Erro de banco de dados.")

    const donors = result.rows;
    return res.render('index.html',{ donors });
  })
  
});

server.post('/', (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood

  if (name == "" || email == "" || blood == ""){
    return res.send("Todos os campos são obrigatórios.")
  }

  //coloca valores dentro do banco de dados
  const query = `insert into donors ("name", "email", "blood") values ($1, $2, $3)`

  const values = [name, email, blood]

  db.query(query, values, (err) =>{
    //fluxo de erro
    if (err) return res.send("erro no banco de dados.")

    //fluxo ideal 
    return res.redirect('/')
  } )

});

//Definindo porta do servidor
server.listen(3000)
