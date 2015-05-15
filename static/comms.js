// Responsible for controlling the connection to the peer server and receive new players
function Comm(options) {
  this.players = {};
  this.open = false;
  this.on = {
    connected: new signals.Signal(),
    disconnected: new signals.Signal(),
    newPlayer: new signals.Signal(),
    message: new signals.Signal()
  };

  this.on.connected.memorize = true;
  this.on.disconnected.memorize = true;

  if (options.connected) {
    Logger.debug('Comm: options.connected hooked');
    this.on.connected.add(options.connected);
  }

  this.peer = new Peer({
    host: options.host,
    port: options.port,
    path: 'shooting'
  });

  var self = this;
  var handle = {
    open: function (id) {
      // we are now connected to the peer server
      Logger.info('Comm: peer open - id:%s', id);
      self.open = true;
      self.on.connected.dispatch(id);
    },
    connection: function (conn) {
      // incoming connection from another peer
      Logger.info('Comm: new connection - id:', conn.peer);
      self.players[conn.peer] = new Player(conn);
      self.on.newPlayer.dispatch(self.players[conn.peer]);
      conn.on('data', function (data) {
        self.on.message.dispatch(self.players[conn.peer], data);
      })
    },
    close: function () {
      // peer was disconnected and destroyed
      Logger.info('Comm: peer closed');
    },
    disconnected: function () {
      // peer was disconnected from the server
      Logger.info('Comm: peer disconnected');
    },
    error: function (err) {
      // something went wrong
      Logger.error(err);
    }
  };

  this.peer.on('open', handle.open.bind(this));
  this.peer.on('connection', handle.connection.bind(this));
  this.peer.on('close', handle.close.bind(this));
  this.peer.on('disconnected', handle.disconnected.bind(this));
  this.peer.on('error', handle.error.bind(this));
};

// start a connection to a remote peer
Comm.prototype.connect = function (id) {
  Logger.debug('Comm: connect %s', id);
  var player = new Player(this.peer.connect(id));
  this.players[id] = player;

  var self = this;
  player.on.message.add(function (data) {
    self.on.message.dispatch(player, data);
  });

  return player;
};

// broadcasts a message to all players
Comm.prototype.broadcast = function (data) {
  //Logger.debug('Comm: broadcast %s', data);
  var self = this;
  Object.keys(this.players).forEach(function (peerId) {
    self.players[peerId].send(data);
  });
};

Comm.prototype.playerCount = function () {
  var length = Object.keys(this.players).length;
  Logger.debug('Comm: playerCount = %s', length);

  return length;
};

Comm.prototype.destroy = function () {
  Logger.debug('Comm: destroy');
  if (this.peer) {
    this.peer.destroy();
  }
};

// Represents a remote player, handles incoming messages from that player
function Player(conn) {
  this.conn = conn;
  this.on = {
    connected: new signals.Signal(),
    disconnected: new signals.Signal(),
    message: new signals.Signal()
  };

  var self = this;
  var handle = {
    data: function (data) {
      self.on.message.dispatch(data);
    },
    open: function () {
      // data connection ready
      self.on.connected.dispatch(self);
    },
    close: function () {
      // data connection closed
      Logger.info('player %s disconnected', self.conn.peer);
      self.on.disconnected.dispatch(self);
    },
    error: function (err) {
      // something went wrong
      Logger.error(err);
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