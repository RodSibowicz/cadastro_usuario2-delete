const mysql = require('mysql2')
const express = require('express')
const bodyParser = require('body-parser')


const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.urlencoded({extended:false}))
    

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crud'
});

connection.connect(function(err){
    if (err){
        console.error('erro', err)
        return
    }
console.log("Conexão estabelecida com sucesso")   
 }
)

/*connection.query ("insert INTO clientes(nome, idade, uf) VALUES (?, ?, ? )",
function (err, result){
    if (!err){
        console.log ("Dados inseridos com sucesso!")
    }else{
        console.log("Erro, Não foi possivel inserir os dados!",err)

}
})
;


connection.query ("SELECT FROM clientes",function (err,ROWS, result){
    if (!err){
        console.log ("Resultado:", rows)
    }else{
        console.log("Erro, Não foi possivel inserir os dados!",err)

}
})
;*/

app.get("/formulario",function (req, res) {
    res.sendFile(__dirname + "/formulario.html");
})

app.post('/adicionar', (req, res) =>{
    const nome = req.body.nome;
    const idade = req.body.idade;
    const UF= req.body.UF;


    const values = [nome, idade, UF]
    const insert = "insert into clientes(nome, idade, UF) values(?,?,?)";

    connection.query(insert, values, function(err, result) {
        if (!err) {
        console.log("dados inseridos com sucesso!")
        res.send("dados inseridos");
        }
    else{
        console.log("Não foi possivel inserir os dados", err)
        res.send("erro!");
        }
    })
})

app.get("/deletar/:id", function(req, res){
    const idDoCliente = req.params.id;

    const deleteCliente = "DELETE FROM clientes WHERE id =?";

    connection.query(deleteCliente, [idDoCliente], function(err, result){
        if (!err){
            console.log("cliente deletado")
            res.redirect('/listar');
        }else{
                console.log("Erro ao deletar cliente ", err);
        }
    }
    )
});


app.listen(8081, function(){
    console.log("servidor rodando na url: http://localhost:8081") 
})


app.get("/listar", function(req, res){
    const selectAll = "select * from clientes";

    connection.query(selectAll, function(err, rows){
        if (!err) {
        console.log("dados inseridos com sucesso!")
        res.send(`
        <html>
            <head>
                <title>Lista de Clientes</title>
            </head>
            <body>
                <h1>Lista de Clientes</h1>
                    <table>
                    <tr>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th>UF</th>
                    
                    </tr>

                    ${rows.map(row =>`
                    <tr>
                        <td>${row.nome}</td>
                        <td>${row.idade}</td>
                        <td>${row.UF}</td>     
                        <td><a href = "/deletar/${row.id}"> Deletar </a></td>
                    </tr>
                `).join('')}
                </table>
            </tr>
            </body>
        </html>            
        `);
        }else{
        console.log("erro ao listar os dados!", err)
        res.send("erro!")
        }
    })
    
    })
    
    
app.get("/", function(req, res) {
    res.send(`
        <html>
            <head>
                <title>Sistema de gerenciamento de usuarios</title>
            </head>
            <body>
                <h1>Sistema de gerenciamento de usuarios</h1>
                <p> <a href= "http://localhost:8081/formulario"> cadastrar usuarios </a></p>
                <p> <a href= "http://localhost:8081/listar"> listar </a></p>

            </body>
        </html>
        `)
})






//npm init --criar o package.json (arquivo com info dos projetos)
//npm install --save mysql2 -- dependencia para conexão sql
//npm install express mysql2 -- dependencia para conexão front, back