function Game() {
  this.manager = new Manager();
  this.scenes = {};
  this.sprites = {};
  this.components = {};

  var self = this;
  $(window).unload(function () { self.manager.destroy(); });
}

Game.prototype.load = function () {
  Logger.debug('Game: Loading...');
  var Q = this.Q = Quintus()
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

  for(var name in this.sprites) {
    Logger.debug('Game: Loaded sprite %s', name);
    Q.Sprite.extend(name, this.sprites[name]);
  }
  for(var name in this.components) {
    Logger.debug('Game: Loaded component %s', name);
    Q.component(name, this.components[name]);
  }
  for(var name in this.scenes) {
    Logger.debug('Game: Loaded scene %s', name);
    Q.scene(name, this.scenes[name]);
  }

  Q.load(["space_background.jpg", "spaceship.png", "shot4.jpg", "player.json", "shot.json"], function () {
    Q.compileSheets("spaceship.png", "player.json");
    Q.compileSheets("shot4.jpg", "shot.json");
    Q.animations("player", { default: { frames: [0, 1, 2, 3], rate: 1/4 } });
    Q.animations("shot", { default: { frames: [0, 1, 2, 3], rate: 1/4 } });
    Q.stageScene("intro");
  });

  this.manager.start('test game');
};