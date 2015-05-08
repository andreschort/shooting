// Responsible for controlling the connection to the peer server and receive new players
function Manager(options) {
  this.events = {};
  this.players = {};
  this.primary = false;
  this.open = false;
  this.playerCount = 0;

  if (options.open) {
    this.on('open', options.open);
  }

  this.peer = new Peer({
    host: options.host,
    port: options.port,
    path: 'shotting'
  });

  var self = this;
  var handle = {
    open: function (id) {
      // we are now connected to the peer server
      console.log("local id: " + id);
      this.open = true;
      Util.callIfPossible(self.events['open'], self);
    },
    connection: function (conn) {
      // incoming connection from another peer
      console.log('new player:' + conn.peer);
      var newPlayer = new Player(conn)
      this.players[conn.peer] = newPlayer;
      this.payerCount++;

      Util.callIfPossible(this.events['newplayer'], this, newPlayer);
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
Manager.prototype.join = function (game, cb) {
  var self = this;
  this.api.join(this.peer.id, game).done(function (res) {
    self.primary = res.primary;
    res.peers.forEach(function (peer) {
      self.connect(peer.id).primary = peer.primary;
    });

    Util.callIfPossible(cb, self);
  });
};

// start a connection to a remote peer
Manager.prototype.connect = function (id) {
  this.players[id] = new Player(this.peer.connect(id));
  this.playerCount++;
  return this.players[id];
};

// broadcasts a message to all players
Manager.prototype.broadcast = function (message) {
  var data = { id: this.peer.id, msg: message };
  var self = this;
  Object.keys(this.players).forEach(function (peerId) {
    self.players[peerId].send(data);
  });
};

Manager.prototype.on = function (evnt, cb) {
  if (evnt == 'open' && this.open) {
    // fire immediately if already open
    cb();
  }

  if (!this.events[evnt]) {
    this.events[evnt] = [];
  }

  this.events[evnt].push(cb);
}

// Represents a remote player, handles incoming messages from that player
function Player(conn) {
  this.conn = conn;
  this.events = {};

  var self = this;
  var handle = {
    data: function (data) {
      // data received;
      Util.callIfPossible(this.events["message"], this, data);
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
  if (this.conn.open) {
    this.conn.send(data);
  }
  // discard early messages is not a problem, I think
};

Player.prototype.close = function () {
  this.conn.close();
};

Player.prototype.on = function (evnt, cb) {
  if (!this.events[evnt]) {
    this.events[evnt] = [];
  }

  this.events[evnt].push(cb);
}