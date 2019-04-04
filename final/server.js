var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
 res.render('pages/index');
});

app.get('/main', function(req, res) {
 res.render('pages/main');
});

app.get('/register', function(req, res) {
 res.render('pages/register');
});


app.listen(8080);
console.log('8080 is the magic port');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/profiles";
app.use(express.static('public'))
var db;
MongoClient.connect(url, function(err, database){
 if(err) throw err;
 db = database;
 app.listen(8080);
});

app.get('/goLogin', function(req, res) {
 db.collection('quotes').find().toArray(function(err, result) {
 if (err) throw err;
 for (var i = 0; i < result.length; i++) {
 alert("Username = " + result[i].username);
 }
 res.send(output);
});
