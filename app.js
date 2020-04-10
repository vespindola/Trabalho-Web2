const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');
const app = express();
const urlencodeParser = bodyParser.urlencoded({ extended: false });

const sql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
   // port: 3306
})
sql.query("use db");

//tamplate engine
app.engine("handlebars", handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));



//routes and tampletes
app.get("/", function (req, res) {
    res.render('index');
})
app.get("/inserir", function (req, res) {
    res.render("inserir")
})
app.get("/select/:id?", function (req, res) {
    if (!req.params.id) {
        sql.query("select * from task order by id asc", function (err, results, fields) {
            res.render('select', {data:results})
        })
    }
    else {
        sql.query("select * from task where id=? order by id asc", [req.params.id], function (err, results, fields) {
            res.render('select', {data:results})
        })
    }
})

app.post('/controllerForm', urlencodeParser, function (req, res) {
    sql.query("insert into task values (?, ?, ?, ?, ?, ?)", [req.body.id, req.body.name, req.body.description, 
    req.body.start_date, req.body.end_date, req.body.priority])
    res.render('controllerForm', { name:req.body.name })
})

app.get('/deletar/:id', function (req, res) {
    sql.query("delete from task where id=?", [req.params.id])
    res.render('deletar')
})
app.get("/update/:id",function(req,res){
    sql.query("select * from task where id=?",[req.params.id],function(err,results,fields){
        res.render('update',{id:req.params.id, name:results[0].name, description:results[0].description, start_date:results[0].start_date, end_date:results[0].end_date, priority:results[0].priority});
    });
});
app.post("/controllerUpdate",urlencodeParser,function(req,res){
   sql.query("update task set name=?, description=?, start_date=?, end_date=?, priority=? where id=?",[req.body.name, 
    req.body.description, req.body.start_date, req.body.end_date, req.body.priority, req.body.id]);
   res.render('controllerUpdate');
});

//satat server
app.listen(3001, function (req, res) {
    console.log("Servidor esta ok")
})
