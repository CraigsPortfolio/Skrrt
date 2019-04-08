var express = require('express');
var app = express();
const MongoClient = require('mongodb').MongoClient; //npm install mongodb@2.2.32
const url = "mongodb://localhost:27017/profiles";
const session = require('express-session'); //npm install express-session
const bodyParser = require('body-parser'); //npm install body-parser

// //this tells express we are using sesssions. These are variables that only belong to one user of the site at a time.
app.use(session({ secret: 'example' }));

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

var db;


//this is our connection to the mongo db, ts sets the variable db as our database
MongoClient.connect(url, function(err, database) {
  if (err) throw err;
  db = database;
  app.listen(8080);
  console.log('listening on 8080');
});


app.get('/', function(req, res) {
 res.render('pages/index');
});

app.get('/main', function(req, res) {
 res.render('pages/main');
});

app.get('/register', function(req, res) {
 res.render('pages/register');
});

app.get('/adduser', function(req, res) {
 res.render('pages/main');
});


app.post('/adduser', function(req, res) {
  //check we are logged in
//  if(!req.session.loggedin){res.redirect('/login');return;}

  //we create the data string from the form components that have been passed in

var datatostore = {
"fname":req.body.fname,
"surname":req.body.surname,
"email":req.body.email,
"login":{"username":req.body.uname,"pword":req.body.pword},
"car":{"make":req.body.make,"model":req.body.model,"year":req.body.year}
}


//once created we just run the data string against the database and all our new data will be saved/
  db.collection('profiles').save(datatostore, function(err, result) {
    if (err) throw err;
    console.log('saved to database')
    //when complete redirect to the index
    res.redirect('/')
  })
});
