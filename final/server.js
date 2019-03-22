var express = require('express');
var app = express();
app.use(express.static('final'));
app.use(express.static('final/css'));
app.get('/', function(req, res){
  res.sendFile('css/style.css', {root: __dirname });
  res.sendFile('main.html', {root: __dirname });
});
app.listen(8080);
