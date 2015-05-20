(function (game) {
  game.components["BasicAI"] = {
    added: function () {
      this.entity.changeDirections();
      this.entity.on('step', 'move');
      this.entity.on('step', 'tryToFire');
      this.entity.add("Gun");
    },

    extend: {
      changeDirections: function () {
        var entity = this;
        var numberOfSeconds = Math.floor((Math.random() * 5) + 1);
        setTimeout(function () {
          entity.p.speed = -entity.p.speed;
          entity.changeDirections();
        }, numberOfSeconds * 1000);
      },

      move: function (dt) {
        if (this.p.speed) {
          this.p.y -= this.p.speed * dt;
        }
        
        // go the other way if we are at the limit of the screen.
        if (this.p.y > game.Q.el.height - this.p.h / 2 || this.p.y < this.p.w /2) {
          this.p.speed = -this.p.speed;
        }
      },

      tryToFire: function (dt) {
        var player = Q("Player").first();

        if (!player)
          return;

        if (player.p.y + player.p.h > this.p.y && player.p.y - player.p.h < this.p.y) {
          this.fire(game.Q.SPRITE_ENEMY);
        }
      }
    }
  };
})(G);