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

app.post('/dologin', function(req, res) {
  console.log(JSON.stringify(req.body))
  //var uname = req.body.uname;
  var pword = req.body.pword;
  var uname = "Username";
  db.collection('profiles').findOne({"login.username":uname}, function(err, result) {
    if (err) throw err;//if there is an error, throw the error
    //if there is no result, redirect the user back to the login system as that username must not exist
    //if(!result){res.redirect('/login');return}
    //if there is a result then check the password, if the password is correct set session loggedin to true and send the user to the index
    if(result.login.pword == pword){ req.session.loggedin = true; res.redirect('/') }
    //otherwise send them back to login
    //else{res.redirect('/login')}
  });
});
