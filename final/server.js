var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.sendFile('index.html', {root: __dirname });
});
app.get('public/main', function(req, res){
  res.sendFile('main.html', {root: __dirname });
});

app.listen(8080);
