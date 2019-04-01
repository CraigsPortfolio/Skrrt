var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
 res.render('pages/index');
});

// app.get('/main', function(req, res) {
//  res.render('pages/main');
// });


app.listen(8080);
console.log('8080 is the magic port');
