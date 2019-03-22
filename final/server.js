var express = require('express');
var app = express();
app.use(express.static('public'));
app.get('/', function(req, res){
  res.sendFile('index.html', {root: __dirname });
});
app.use(express.static('public'));
app.get('/main', function(req, res){
  res.sendFile('main.html', {root: __dirname });
});

app.listen(8080);
