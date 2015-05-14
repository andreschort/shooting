var assert = require('assert');
var rooms = require('../rooms.js');

describe('Room', function () {
  describe('get()', function () {
    it('should return null when the room is empty', function () {
      assert.equal(new rooms.Room().get('some id'), null);
    });

    it('should return the peer with the specified id', function () {
      var myRoom = new rooms.Room();
      var peer = { id: 'myPeer' };
      myRoom.add(peer);
      myRoom.add({ id: 'anotherPeer' });

      assert.equal(myRoom.get('myPeer'), peer);
    });
  });

  describe('updatePeer()', function () {
    it('should not fail if the peer is not found', function () {
      var myRoom = new rooms.Room();
      var somePeer = { id: 'someId', online: false };
      myRoom.add(somePeer);

      myRoom.updatePeer('myId', true);

      assert.equal(somePeer.online, false);
    });

    it('should update the peer status correctly', function () {
      var myRoom = new rooms.Room();
      var myPeer = { id: 'myPeer', online: false };
      var otherPeer = { id: 'otherPeer', online: false };

      myRoom.add(myPeer);
      myRoom.add(otherPeer);

      myRoom.updatePeer('myPeer', true);

      assert.equal(myPeer.online, true);
      assert.equal(otherPeer.online, false);
    });

    it('should set the primary when he is the only one online', function () {
      var myRoom = new rooms.Room();
      var myPeer = { id: 'myPeer', primary: false };
      var otherPeer = { id: 'otherPeer', primary: false };

      myRoom.add(myPeer);
      myRoom.add(otherPeer);

      myRoom.updatePeer('myPeer', true);

      assert.equal(myPeer.primary, true, 'he should be the new primary');
      assert.equal(otherPeer.primary, false, 'an offline peer can not be the primary');

    });
  });
});

describe('RoomCollection', function () {
  describe('add', function (){
    it('should add the room', function () {
      var col = new rooms.RoomCollection();
      var myRoom = new rooms.Room('myRoom');
      col.add(myRoom);

      assert(col.get('myRoom'), myRoom);
    });

    it('should fail when adding a room without a name', function () {
      var col = new rooms.RoomCollection();
      var myRoom = new rooms.Room();
      col.add(myRoom);
      //TODO get assertion library
    });
  });
});