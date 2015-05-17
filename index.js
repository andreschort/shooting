var _ = require('underscore');
var util = require('util');
var r = require('./rooms.js');

var rooms = new r.RoomCollection();


// SETUP PEER SERVER
var PeerServer = require('peer').PeerServer;
var server = new PeerServer({port: 9000, path: '/shooting'});

server.on('connection', function (id) {
  console.log('connected: ' + id);
  rooms.updatePeer(id, true);
});

server.on('disconnect', function (id) {
  console.log('disconnected: ' + id);
  rooms.updatePeer(id, false);
});

// SETUP API
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

router.route('/join').post(function(req, res) {
  var name = req.body.name || 'default';
  var peerName = req.body.peerName;
  var peerId = req.body.peerId;
  var room = rooms.get(name);

  if (!room) {
    room = new r.Room(name);
    rooms.add(room);
  }

  res.json({ name: room.name, peers: room.peers, primary: room.primary() == null });

  console.log(util.inspect(room, false, null));

  room.add({ id: peerId, name: peerName, online: true });
});

/// this is very old and must be reimplemented
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
  var name = req.body.name || 'default';
  var peerId = req.body.peerId;

  var room = rooms.get(name);
  if (room) {
    room.remove(peerId);
  }

  res.end('Bye');

  console.log(util.inspect(room, false, null));
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