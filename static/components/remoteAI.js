(function () {
  Game.component["RemoteAI"] = {
    added: function () {
      var entity = this.entity;
      
      entity.p.player.on('message.position', function (msg) {
        entity.p.x = msg.payload.x;
        entity.p.y = msg.payload.y;
      });

      entity.p.player.on('message.shot', function (msg) {
        entity.fire(Q.SPRITE_ENEMY);
      })
    },

    extend: {

    }
  };
})();