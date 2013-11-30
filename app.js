
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var recipes = require('./recipes');
var app = express();
var have = recipes.have;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

  app.set("view options", {
     layout: false
  });

  app.use(express.bodyParser()); 							// pull information from html in POST
  app.use(express.methodOverride()); 
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/sauce', function(req, res) {
  res.send(processReq(req.body));
});

app.get('/sauce', function(req, res) {
  res.send(processReq({'a': ['sauce','have some sauce!']}));
});

/*app.get('*', function(req, res) {
	res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
*/
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var processReq = function(r){
 console.log(r);
  var fun = r[0];
  var args = toArray(r.splice(1)[0]);
  return have[fun].apply(this, args)
}

var toArray = function(o){
  var array = [];
  for(var k in o){
    array.push(o[k]);
  }
  return array;
} 
