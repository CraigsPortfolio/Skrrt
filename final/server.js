var express = require('express');
var app = express();
app.use(express.static('final'));
app.get('/', function(req, res){
  res.sendFile('main.html', {root: __dirname });
});
app.listen(8080);
