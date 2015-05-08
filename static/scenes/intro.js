(function () {
  Game.scene['intro'] = function (stage) {
    var container = stage.insert(new Q.UI.Container({
      x: Q.width / 2,
      y: Q.height / 2,
      fill: "#FFFFFF"
    }));

    var button = container.insert(new Q.UI.Button({
      x: 0,
      y: 0,
      fill: "#CCCCCC",
      label: "Play",
      hidden: true
    }));

    var text = container.insert(new Q.UI.Text({
      x: 10,
      y: -10 - button.p.h,
      label: "Server: " + (Game.manager.open ? "Ready" : "Connecting...")
    }));

    Game.manager.on('open', function () {
      text.p.label = "Server: Ready\nJoining game...";
      Game.manager.join('test', function () {
        if (Game.manager.playerCount > 0) {
          Q.clearStages();

          Q.stageScene("mainLevel", 1, { enemy: Game.manager.players[Object.keys(Game.manager.players)[0]] });
        } else {
          text.p.label = "Server: Ready\nWaiting enemy"
        }
      });
    });

    Game.manager.on('newplayer', function (player) {
      Q.clearStages();
      Q.stageScene("mainLevel", 1, { enemy: player });
    });

    button.on('click', function () {
      Q.clearStages();
      Q.stageScene("mainLevel");
    });

    container.fit(20);
  };
})();