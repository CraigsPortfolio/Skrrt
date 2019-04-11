var express = require('express');
var app = express();
const MongoClient = require('mongodb').MongoClient; //npm install mongodb@2.2.32
const url = "mongodb://localhost:27017/profiles";
const session = require('express-session'); //npm install express-session
const bodyParser = require('body-parser'); //npm install body-parser
var currentUser = "";
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
 res.render('pages/index', {user:currentUser});
});

app.get('/main', function(req, res) {
 res.render('pages/main', {user:currentUser});
});

app.get('/register', function(req, res) {
 res.render('pages/register', {msg:""});
});

app.get('/profile', function(req, res) {
  db.collection('profiles').findOne({"login.username":currentUser}, function(err, result) {
    if (err) throw err;//if there is an error, throw the error
    console.log(result.fname);
    first=result.fname;
    res.render('pages/profile', {First:result.fname, Last:result.surname, Username:result.login.username});
  });
});

app.get('/journey', function(req, res) {
 res.render('pages/journey');
});

app.get('/newcar', function(req, res) {
 res.render('pages/newcar');
});

app.get('/garage', function(req, res) {
  db.collection('profiles').findOne({"login.username":currentUser}, function(err, result) {
    if (err) throw err;//if there is an error, throw the error
    res.render('pages/garage', {make:result.car.make, model:result.car.model, reg:result.car.reg, ftype:result.car.ftype, mpg:result.car.mpg});
  });
});

app.get('/adduser', function(req, res) {
 res.render('pages/main');
});


app.post('/adduser', function(req, res) {
    db.collection('profiles').findOne({"login.username": req.body.username}, function(err, user){
        if(err) {
          console.log(err);
        }
        var message;
        if(user) {
          console.log(user)
            message = "user exists";
            console.log(message)
            res.render('pages/register', {msg:"Username Taken"});
        } else {
            message= "user doesn't exist";
            console.log(message)
            var datatostore = {
            "fname":req.body.fname,
            "surname":req.body.surname,
            "login":{"username":req.body.username,"pword":req.body.password},
             "car":{"make": req.body.make, "model": req.body.model, "year": req.body.year, "reg": req.body.reg, "ftype": req.body.ftype, "mpg": req.body.mpg}
            }


            //once created we just run the data string against the database and all our new data will be saved/
              db.collection('profiles').save(datatostore, function(err, result) {
                if (err) throw err;
                console.log('saved to database')
                //when complete redirect to the index
                currentUser=datatostore.login.username;
                res.redirect('/profile')
              })
        }
        //res.json({message: message});
    });
});


app.post('/addcar', function(req, res) {
 var query = { "login.username": currentUser };
 var newvalues = { $addToSet: {car:{make: req.body.make, model: req.body.model, year: req.body.year, reg: req.body.reg, ftype: req.body.ftype, mpg: req.body.mpg} }};
 db.collection('profiles').update(query,newvalues, function(err, result) {
 if (err) throw err;
 res.redirect('/garage');
 });
});

app.post('/addjourney', function(req, res) {
 var query = { "login.username": currentUser };
 var newvalues = { $addToSet: {journeys:{start: req.body.Start, end: req.body.End, pass: req.body.pass, reg: req.body.reg, fcost: req.body.fcost, mpg: req.body.mpg, rec:req.body.rec} }};
 db.collection('profiles').update(query,newvalues, function(err, result) {
 if (err) throw err;
 console.log("Added");
 res.redirect('/main');
 });
});

// app.get('/remcar', function(req, res) {
//  var query = { "login.username": currentUser };
//  var newvalues = { $pull: {cars:{make: req.body.make}}};
//  db.collection('profiles').update(query,newvalues, function(err, result) {
//  if (err) throw err;
//  res.redirect('/garage');
//  });
// });

//the dologin route detasl with the data from the login screen.
//the post variables, username and password ceom from the form on the login page.
app.post('/dologin', function(req, res) {
  console.log(JSON.stringify(req.body))
  var uname = req.body.uname;
  var pword = req.body.pword;

  db.collection('profiles').findOne({"login.username":uname}, function(err, result) {
    if (err) throw err;//if there is an error, throw the error
    //if there is no result, redirect the user back to the login system as that username must not exist
    if(result.login.pword != pword){console.log("INCORRECT");res.redirect('/main', {logmsg:"Incorrect login details"})}
    //if there is a result then check the password, if the password is correct set session loggedin to true and send the user to the index
    if(result.login.pword == pword){console.log("CORRECT"); req.session.loggedin = true; currentUser=result.login.username; res.redirect('/profile') }
    //otherwise send them back to login
    else{console.log("INCORRECT"); }
  });
});

//logour route cause the page to Logout.
//it sets our session.loggedin to false and then redirects the user to the login
app.get('/logout', function(req, res) {
  req.session.loggedin = false;
  req.session.destroy();
  currentUser="";
  res.redirect('/main');
});

app.use(function (req, res, next) {
  res.status(404).render('pages/404');
})
