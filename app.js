//Express Init
var express = require("express"),
    app = express(),
    server = require("http").Server(app);

//express settings
app.set('views', __dirname + '/sites');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Routes
app.get('/:id', function(req, res){
    res.render(req.param('id'));
});

var port = process.argv[2];
if(!port) port = 81 ;
server.listen(port);
console.log("Server started on port "+port);