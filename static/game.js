var clamp = function (x, min, max) {
  return x < min ? min : (x > max ? max : x);
}
var Q = Quintus()
  .include("Sprites, Anim, Input, Touch, Scenes, UI")
  .setup({ width: 800, height: 480 })
  .touch();

Q.input.touchControls({
  controls: [
    ['left', '<'],
    ['right', '>'],
    [],
    [],
    [],
    [],
    ['fire', 'a']
  ]
});

Q.controls();

Q.Sprite.extend("Player", {
  init: function (p) {
    this._super(p, {
      sprite: "player",
      sheet: "player",
      x: 60,
      y: Q.el.height / 2,
      type: Q.SPRITE_FRIENDLY,
      speed: 10
    });

    this.add("animation");
    this.add("Gun");
    this.play("default");
    this.on('hit', function (col) {
      if (col.obj.isA("Shot") && ((col.obj.p.type & Q.SPRITE_ENEMY) == Q.SPRITE_ENEMY)) {
        this.destroy();
        col.obj.destroy();
        Q.stageScene("endGame", 1, { label: "You Died!" });
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

    this.p.y = clamp(this.p.y, 0 + (this.p.h / 2), Q.el.height - (this.p.h / 2));
    this.stage.collide(this, { collisionMask: Q.SPRITE_ENEMY });
  }
});

Q.Sprite.extend("Alien", {
  init: function (p) {
    this._super(p, {
      sprite: "player",
      sheet: "player",
      y: Q.el.height / 2,
      angle: 180,
      type: Q.SPRITE_ENEMY,
      speed: 100
    });

    this.p.x = Q.el.width - 60;
    this.add("animation");
    this.play("default");
    this.add("BasicAI");
    this.on('hit', function (col) {
      console.log(col.obj.isA("Shot"));
      if (col.obj.isA("Shot") && (col.obj.p.type & Q.SPRITE_FRIENDLY) == Q.SPRITE_FRIENDLY) {
        this.destroy();
        col.obj.destroy();
        Q.stageScene("endGame", 1, { label: "You Won!" });
      }
    });
  },

  step: function (dt) {
    this.stage.collide(this, { collisionMask: Q.SPRITE_FRIENDLY });
  }
});

Q.Sprite.extend("Shot", {
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
});

Q.component("BasicAI", {
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
      if (this.p.y > Q.el.height - this.p.h / 2 || this.p.y < 0 + this.p.w /2) {
        this.p.speed = -this.p.speed;
      }
    },

    tryToFire: function (dt) {
      var player = Q("Player").first();

      if (!player)
        return;

      if (player.p.y + player.p.h > this.p.y && player.p.y - player.p.h < this.p.y) {
        this.fire(Q.SPRITE_ENEMY);
      }
    }
  }
});

Q.component("Gun", {
  added: function () {
    // Called after the component is added to the entity
    this.entity.p.shots = [];
    this.entity.p.canFire = true;
    this.entity.on('step', "handleFiring");
  },

  extend: {
    // extends entity, everything is called in the scope of the entity this component is attached to...
    handleFiring: function (dt) {

      // clean up shots array
      for (var i = this.p.shots.length - 1; i >= 0; i--) {
        if (this.p.shots[i].isDestroyed) {
          this.p.shots.splice(i, 1);
        }
      }

      if (Q.inputs['fire'] && this.p.type == Q.SPRITE_FRIENDLY) {
       this.fire(Q.SPRITE_FRIENDLY);
      }
    },
    fire: function (type) {
      if (!this.p.canFire) {
        return;
      }

      var shot;
      if (type == Q.SPRITE_FRIENDLY) {
        shot = Q.stage().insert(new Q.Shot({ x: this.p.x + 50, y: this.p.y, speed: 200, type: Q.SPRITE_DEFAULT | Q.SPRITE_FRIENDLY }));
      } else {
        shot = Q.stage().insert(new Q.Shot({ x: this.p.x - 50, y: this.p.y, speed: -200, type: Q.SPRITE_DEFAULT | Q.SPRITE_ENEMY }));
      }
      
      this.p.shots.push(shot);

      // fire throttling
      this.p.canFire = false;
      var entity = this;
      setTimeout(function () {
        entity.p.canFire = true;
      }, 500);
    }
  }
});

Q.scene("mainLevel", function (stage) {
  Q.gravity = 0;

  stage.insert(new Q.Sprite({
      asset: "space_background.jpg",
      x: Q.el.width / 2,
      y: Q.el.height / 2,
      type: Q.SPRITE_NONE
    }));

  stage.insert(new Q.Player());
  stage.insert(new Q.Alien());
});

Q.scene("endGame", function (stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width / 2,
    y: Q.height / 2,
    fill: "#FFFFFF"
  }));

  var button = container.insert(new Q.UI.Button({
    x: 0,
    y: 0,
    fill: "#CCCCCC",
    label: "Play again"
  }));

  container.insert(new Q.UI.Text({
    x: 10,
    y: -10 - button.p.h,
    label: stage.options.label
  }));

  button.on('click', function () {
    Q.clearStages();
    Q.stageScene("mainLevel");
  });

  container.fit(20);
});

Q.load(["space_background.jpg", "spaceship.png", "shot4.jpg", "player.json", "shot.json"], function () {
  Q.compileSheets("spaceship.png", "player.json");
  Q.compileSheets("shot4.jpg", "shot.json");
  Q.animations("player", { default: { frames: [0, 1, 2, 3], rate: 1/4 } });
  Q.animations("shot", { default: { frames: [0, 1, 2, 3], rate: 1/4 } });
  Q.stageScene("mainLevel");
});