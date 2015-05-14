(function () {
  Game.sprite["Player"] = {
    init: function (p) {
      this._super(p, {
        sprite: "player",
        sheet: "player",
        x: 60,
        y: Q.el.height / 2,
        angle: 0,
        type: Q.SPRITE_FRIENDLY,
        speed: 10
      });

      this.add("animation");
      this.add("Gun");
      this.play("default");
      this.on('hit', function (col) {
        if (col.obj.isA("Shot") && ((col.obj.p.type & Q.SPRITE_ENEMY) == Q.SPRITE_ENEMY) && !Q.endGame) {
          this.destroy();
          col.obj.destroy();
          Q.stageScene("endGame", 2, { label: "You Died!" });
        }
      });
    },

    step: function (dt) {
      if (Q.inputs['left']) {
        this.p.y -= this.p.speed;
      }
      if (Q.inputs['right']) {
        this.p.y += this.p.speed;
      }

      this.p.y = Util.clamp(this.p.y, this.p.h / 2, Q.el.height - (this.p.h / 2));
      this.stage.collide(this, { collisionMask: Q.SPRITE_ENEMY });
    }
  }
})();


/*
var event = new Event('keydown')
event.keyCode = 32;
Q.el.dispatchEvent(event)
*/