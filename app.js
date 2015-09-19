String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

function toPrettyDate(time){
    var date = "";
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    date = monthNames[time.getMonth()]+" "+ time.getDate()+", "+time.getFullYear()+" @ ";
    if(time.getHours()<13){
        date = date + time.getHours() + ":" + time.getMinutes() + " AM";
    }else{
        date = date + (time.getHours() - 12) + ":" + time.getMinutes() + " PM";
    }
    return date;
}

//Express Init
var express = require("express"),
    app = express(),
    server = require("http").Server(app);

//express settings
app.set('views', __dirname + '/sites');
app.engine('html', require('ejs').renderFile);
app.engine('txt', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var MongoClient = require('mongodb').MongoClient, assert = require('assert');

var url = "mongodb://localhost:27017/orbweaver";
console.log("\nMongo url: "+url);
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var Visit = db.collection('visit');
    //Routes
    app.get('/:page', function(req, res){
        var time = new Date();
        Visit.findOne({ip: req.ip}, function(err, visit){
            if(err) throw err;
            if(visit){
                visit.pages++;
                
                if(visit.seen[req.params.page]){
                    visit.seen[req.params.page] += 1;
                }else{
                    visit.seen[req.params.page] = 1;
                }
                
                //Update the time spent on page
                //if it has been less than 10 seconds since the last heartbeat, add the total time on the 
                if((time.getTime() - visit.lastHeartbeat.getTime()) < 10000){
                    visit.totalTime = (time.getTime() - visit.lastHeartbeat.getTime()) + visit.totalTime;
                    visit.totalTimePretty = Math.floor(visit.totalTime/1000).toString().toHHMMSS();
                }else{
                    visit.visits++;
                    visit.datesVisited.push(toPrettyDate(time));
                }
                
                //update the info
                Visit.update({ip: req.ip}, visit, function(err, visit){
                    if(err) throw err;
                    return res.render(req.params.page);
                });
            }else{
                // add a new visitor
                var dVisit = toPrettyDate(time);
                var obj = {ip: req.ip, seen: {}, visits: 1, datesVisited: [dVisit], pages: 1, totalTime: 0, totalTimePretty: "00:00:00",lastPage: time, lastHeartbeat: time};
                obj.seen[req.params.page] = 1;
                Visit.insert(obj, function(err, visit){
                    console.log("new Visitor: "+req.ip);
                    return res.render(req.params.page);
                });
            }
        });
    });
    
    console.log("MongoDB connected");
    app.get('/h/eartbeat', function(req, res){
        var time = new Date();
        Visit.findOne({ip: req.ip}, function(err, visit){
            if(visit){
                var time = new Date();
                if((time.getTime() - visit.lastHeartbeat.getTime()) < 10000){
                    visit.totalTime = (time.getTime() - visit.lastHeartbeat.getTime()) + visit.totalTime;
                    visit.totalTimePretty = Math.floor(visit.totalTime/1000).toString().toHHMMSS();
                }else{
                    //If it has been too long, make a new visit
                    visit.visits++;
                    visit.datesVisited.push(toPrettyDate(time));
                }
                visit.lastHeartbeat = time;
                Visit.update({ip: req.ip}, visit, function(err, visit){
                    if(err) throw err;
                });
            }
        });
        res.json({err: false});
    });
});

var port = process.argv[2];
if(!port) port = 81 ;
server.listen(port);
console.log("Server started on port "+port);