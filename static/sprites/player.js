(function (game) {
  game.sprites["Player"] = {
    init: function (p) {
      this._super(p, {
        sprite: "player",
        sheet: "player",
        x: 60,
        y: game.Q.el.height / 2,
        angle: 0,
        type: game.Q.SPRITE_FRIENDLY,
        speed: 10
      });

      this.add("animation");
      this.add("Gun");
      this.add("Broadcaster");
      this.play("default");
      this.on('hit', function (col) {
        if (col.obj.isA("Shot") && ((col.obj.p.type & game.Q.SPRITE_ENEMY) == game.Q.SPRITE_ENEMY) && !game.Q.endGame) {
          this.destroy();
          col.obj.destroy();
          game.Q.stageScene("endGame", 2, { label: "You Died!" });
        }
      });
    },

    step: function (dt) {
      var moved = false;
      if (game.Q.inputs['left']) {
        this.p.y -= this.p.speed;
        moved = true;
      }
      if (game.Q.inputs['right']) {
        moved = true;
        this.p.y += this.p.speed;
      }

      this.p.y = Util.clamp(this.p.y, this.p.h / 2, game.Q.el.height - (this.p.h / 2));
      this.stage.collide(this, { collisionMask: game.Q.SPRITE_ENEMY });

      if (moved) {
        this.trigger('move');
      }
    }
  }
})(G);