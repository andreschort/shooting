(function (game) {
  game.scenes['intro'] = function (stage) {
    var container = stage.insert(new game.Q.UI.Container({
      x: game.Q.width / 2,
      y: game.Q.height / 2,
      fill: "#FFFFFF"
    }));

    var createGameButton = container.insert(new game.Q.UI.Button({
      x: 0,
      y: 0,
      fill: "#CCCCCC",
      label: "Create game",
      hidden: true
    }));

    var text = container.insert(new game.Q.UI.Text({
      x: 10,
      y: -10 - createGameButton.p.h,
      label: "Server: Connecting..."
    }));

    game.manager.on.connected.addOnce(function () {
      Logger.debug('UI: Intro - Manager.onConnected');
      text.p.label = "Server: Ready\nWaiting enemy";
      createGameButton.p.hidden = false;
    });

    game.manager.on.started.addOnce(function () {
      Logger.debug('UI: Intro - Manager.onStarted');
      game.Q.clearStages();
      game.Q.stageScene("mainLevel");
    });

    createGameButton.on('click', function () {
      game.Q.clearStages();
      game.Q.stageScene("createGame");
    });

    container.fit(20);
  };
})(G);