var express = require('express');
var app = express();
app.use(express.static('final'));

app.get('/main', function(req, res){
 res.send("Hi "+name+" I am sure you will "+quest) ;
});
