(function () {
  Game.sprite["Shot"] = {
    init: function (p) {
      this._super(p, {
        sprite: "shot",
        sheet: "shot",
        speed: 200,
        scale: 0.5
      });

      this.add("animation");
      this.play("default");
    },

    step: function (dt) {
      this.p.x += this.p.speed * dt;

      if (this.p.x > Q.el.width || this.p.x < 0) {
        this.destroy();
      }
    }
  };
})();