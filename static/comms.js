// Responsible for controlling the connection to the peer server and receive new players
function Manager(options) {
  this.peer = new Peer({
    host: options.host,
    port: options.port,
    path: 'shotting'
  });

  this.players = {};
  
  var handle = {
    open: function (id) {
      // we are now connected to the peer server
      console.log("local id: " + id);
      Util.callIfPossible(options.open);
    },
    connection: function (conn) {
      // incoming connection from another peer
      // create player, get his name, etc
      console.log('new player:' + conn.peer);
      this.players[conn.peer] = new Player(conn);
    },
    close: function () {
      // peer was disconnected and destroyed
    },
    disconnected: function () {
      // peer was disconnected from the server
    },
    error: function (err) {
      // something went wrong
      console.log(err);
    }
  };

  this.peer.on('open', handle.open.bind(this));
  this.peer.on('connection', handle.connection.bind(this));
  this.peer.on('close', handle.close.bind(this));
  this.peer.on('disconnected', handle.disconnected.bind(this));
  this.peer.on('error', handle.error.bind(this));

  this.api = new Api(window.location.origin + '/api');
};

// Tells the server that I want to join a game room
Manager.prototype.join = function (game) {
  var self = this;
  this.api.join(this.peer.id, game).done(function (res) {
    res.peers.forEach(function (peer) {
      self.connect(peer.id);
    });
  });
}

// start a connection to a remote peer
Manager.prototype.connect = function (id) {
  this.players[id] = new Player(this.peer.connect(id));
  return this.players[id];
}

// broadcasts a message to all players
Manager.prototype.broadcast = function (data) {
  var self = this;
  Object.keys(this.players).forEach(function (peerId) {
    self.players[peerId].send(data);
  });
}

// Represents a remote player, handles incoming messages from that player
function Player(conn) {
  this.conn = conn;

  var handle = {
    data: function (data) {
      // data received;
      console.log(data);
    },
    open: function () {
      // data connection ready
    },
    close: function () {
      // data connection closed
      console.log('player disconnected');
    },
    error: function (err) {
      // something went wrong
      console.log(err);
    }
  };

  conn.on('data', handle.data.bind(this));
  conn.on('open', handle.open.bind(this));
  conn.on('close', handle.close.bind(this));
  conn.on('error', handle.error.bind(this));
};

// send data to this remote player 
Player.prototype.send = function (data) {
  this.conn.send(data);
};

Player.prototype.close = function () {
  this.conn.close();
};