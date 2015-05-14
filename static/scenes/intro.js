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
      label: "Server: Connecting..."
    }));

    Game.manager.on.connected.addOnce(function () {
      Logger.debug('UI: Intro - Manager.onConnected');
      text.p.label = "Server: Ready\nWaiting enemy";
    });

    Game.manager.on.started.addOnce(function () {
      Logger.debug('UI: Intro - Manager.onStarted');
      Q.clearStages();
      Q.stageScene("mainLevel");
    });

    Game.manager.start('test game');

    button.on('click', function () {
      Q.clearStages();
      Q.stageScene("mainLevel");
    });

    container.fit(20);
  };
})();