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
  db.collection('profiles').findOne({"login.username":currentUser}, function(err, result) {
    if (err) throw err;//if there is an error, throw the error;
    res.render('pages/journey', {start:result.journeys[0].start, end:result.journeys[0].end, reg:result.journeys[0].reg, fuel:result.journeys[0].fcost, mpg:result.journeys[0].mpg, pass:result.journeys[0].pass, prof:result.journeys[0].profit, rec:result.journeys[0].rec, name:result.journeys[0].name, options:result.journeys});
  });
});

app.get('/newcar', function(req, res) {
 res.render('pages/newcar');
});

app.get('/garage', function(req, res) {
  db.collection('profiles').findOne({"login.username":currentUser}, function(err, result) {
    if (err) throw err;//if there is an error, throw the error;
    res.render('pages/garage', {make:result.car[0].make, model:result.car[0].model, reg:result.car[0].reg, ftype:result.car[0].ftype, mpg:result.car[0].mpg, options:result.car});
  });
});

app.post('/refresh', function(req, res) {
  console.log(req.body.newreg);
  console.log(currentUser);

  // db.collection('profiles').find({"login.username": "CraigRoberts0n"}, {car: {$elemMatch:{reg: "EM55 KEL"}}})
  db.collection('profiles').findOne({"login.username": currentUser}, {car: {$elemMatch:{reg: req.body.newreg}}} , function(err, result) {
    if (err) throw err;//if there is an error, throw the error
    console.log(result.car[0].make)
    var data = {make:result.car[0].make, model:result.car[0].model, reg:result.car[0].reg, ftype:result.car[0].ftype, mpg:result.car[0].mpg, options:result.car};
    res.send(data);
  });
  });

  app.post('/refreshJourney', function(req, res) {
    db.collection('profiles').findOne({"login.username": currentUser}, {journeys: {$elemMatch:{name: req.body.name}}} , function(err, result) {
      if (err) throw err;//if there is an error, throw the error
      var data = { start: result.journeys[0].start, end: result.journeys[0].end, pass: result.journeys[0].pass, reg: result.journeys[0].reg, fcost: result.journeys[0].fcost, mpg: result.journeys[0].mpg, rec:result.journeys[0].rec, profit:result.journeys[0].profit, name:result.journeys[0].name};
      res.send(data);
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
             "car":[{"make": req.body.make, "model": req.body.model, "year": req.body.year, "reg": req.body.reg, "ftype": req.body.ftype, "mpg": req.body.mpg}]
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
 var newvalues = { $addToSet: {journeys:{start: req.body.Start, end: req.body.End, pass: req.body.pass, reg: req.body.reg, fcost: req.body.fcost, mpg: req.body.mpg, rec:req.body.rec, profit:req.body.prof, name:req.body.jnyName}}};
 db.collection('profiles').update(query,newvalues, function(err, result) {
 if (err) throw err;
 console.log("Added");
 res.send(currentUser)
 res.redirect('/main');
 });
});

app.post('/remcar', function(req, res) {
 var query = { "login.username": currentUser};
 var newvalues = { $pull: {car:{reg: req.body.reg}}};
 db.collection('profiles').update(query,newvalues, function(err, result) {
 if (err) throw err;
 console.log("del");
 });
 db.collection('profiles').findOne({"login.username": currentUser} , function(err, result) {
   if (err) throw err;//if there is an error, throw the error
   console.log(result.car[0].make)
   var data = {make:result.car[0].make, model:result.car[0].model, reg:result.car[0].reg, ftype:result.car[0].ftype, mpg:result.car[0].mpg, options:result.car};
   res.send(data);
 });
});

app.post('/editprofile', function(req, res) {
 var query = { "login.username": currentUser};
 var newvalues = { $set: { login:{username: req.body.username, pword:req.body.pword},fname:req.body.fname, surname:req.body.surname}};
 db.collection('profiles').update(query,newvalues, function(err, result) {
 if (err) throw err;
 console.log("updated");
 });
 db.collection('profiles').findOne({"login.username": req.body.username} , function(err, profile) {
   if (err) throw err;//if there is an error, throw the error
   var data = {fname:profile.fname, surname:profile.surname, username:profile.login.username};
   res.send(data);
   currentUser=req.body.username;
 });
});

app.post('/remjourney', function(req, res) {
 var query = { "login.username": currentUser};
 var newvalues = { $pull: {journeys:{name: req.body.name}}};
 db.collection('profiles').update(query,newvalues, function(err, result) {
 if (err) throw err;
 console.log("del");
 });
 db.collection('profiles').findOne({"login.username": currentUser} , function(err, result) {
   if (err) throw err;//if there is an error, throw the error
    var data = { start: result.journeys[0].start, end: result.journeys[0].end, pass: result.journeys[0].pass, reg: result.journeys[0].reg, fcost: result.journeys[0].fcost, mpg: result.journeys[0].mpg, rec:result.journeys[0].rec, profit:result.journeys[0].profit, name:result.journeys[0].name, options:result.journeys};
   res.send(data);
 });
});

//the dologin route detasl with the data from the login screen.
//the post variables, username and password ceom from the form on the login page.
app.post('/dologin', function(req, res) {
  console.log(JSON.stringify(req.body))
  var uname = req.body.uname;
  var pword = req.body.pword;

  db.collection('profiles').findOne({"login.username":uname}, function(err, result) {
    if(result==null){
      console.log("USERNAME INVALID");
      backURL=req.header('Referer'); var x = backURL + "#loginError";console.log(x);res.redirect(x);
      return;
    }
    if(err) {
      console.log(err);
      res.redirect('back')
    }//if there is an error, throw the error
      // if(result.login.pword != pword){console.log("INCORRECT"); backURL=req.header('Referer'); var x = backURL + "#loginError";console.log(x);res.redirect(x);}
      // if(!result){console.log("INCORRECT"); backURL=req.header('Referer'); var x = backURL + "#loginError";console.log(x);res.redirect(x);}
    //if there is a result then check the password, if the password is correct set session loggedin to true and send the user to the index
    if(result.login.pword == pword){console.log("CORRECT"); req.session.loggedin = true; currentUser=result.login.username; res.redirect('/profile') }
    //if there is no result, redirect the user back to the login system as that username must not exist
    else{
      console.log("INCORRECT"); backURL=req.header('Referer'); var x = backURL + "#loginError";console.log(x);res.redirect(x); }
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
