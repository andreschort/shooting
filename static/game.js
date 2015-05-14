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

Q.Sprite.extend("Player", Game.sprite["Player"]);
Q.Sprite.extend("Enemy", Game.sprite["Enemy"]);
Q.Sprite.extend("Shot", Game.sprite["Shot"]);

Q.component("BasicAI", Game.component["BasicAI"]);
Q.component("RemoteAI", Game.component["RemoteAI"]);
Q.component("Gun", Game.component["Gun"]);

Q.scene("intro", Game.scene["intro"]);
Q.scene("mainLevel", Game.scene["mainLevel"]);
Q.scene("endGame", Game.scene["endGame"]);

Q.load(["space_background.jpg", "spaceship.png", "shot4.jpg", "player.json", "shot.json"], function () {
  Q.compileSheets("spaceship.png", "player.json");
  Q.compileSheets("shot4.jpg", "shot.json");
  Q.animations("player", { default: { frames: [0, 1, 2, 3], rate: 1/4 } });
  Q.animations("shot", { default: { frames: [0, 1, 2, 3], rate: 1/4 } });
  Q.stageScene("intro");
});