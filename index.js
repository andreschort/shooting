// SETUP PEER SERVER
var PeerServer = require('peer').PeerServer;
var server = new PeerServer({port: 9000, path: '/shotting'});

server.on('connection', function(id) { 
    console.log('connected: ' + id);
});

server.on('disconnect', function(id) { 
    console.log('disconnected: ' + id);
});


// SETUP API
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var _          = require("underscore");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

var rooms = {};

router.route('/join').post(function(req, res) {
    var name = req.body.name || 'default';
    var peerName = req.body.peerName;
    var peerId = req.body.peerId;

    var primary = false;
    if (rooms[name] === undefined) {
        rooms[name] = [];
        primary = true;
    }
    
    res.json({ name: name, peers: rooms[name], primary: primary });
    
    if (peerId && peerId.length > 0 && rooms[name].indexOf(peerId) === -1) {
        rooms[name].push({ id: peerId, name: peerName, primary: primary });
    }
});

router.route('/name/:roomName?/:peerId?').get(function (req, res) {
    var room = rooms[req.params['roomName']];
    var peerId = req.params['peerId'];
        
    if (room === undefined) {
        room = [];
    }
    
    var result = _.find(room, function (peer) { return peer.id === peerId; });
    res.json(result.name);
});

router.route('/leave').post(function(req, res) {
  var roomName = req.body.roomName;
  var peerId = req.body.peerId;

  var room = rooms[roomName];
    
    if (room) {
        room = _.reject(room, function (peer) { return peer.id === peerId; });
        rooms[roomName] = room;
    }
    
    res.end('Bye');
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', express.static('static'));
app.use(morgan('dev'));
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);