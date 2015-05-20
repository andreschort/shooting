# shooting
Javascript multiplayer shooting game using Node, Quintus and PeerJS

## TODOs
- Fix collision issue. Sometimes I hit the enemy but the enemy does not know about it. Might be caused by small differences in sprites positions. Possible fix is to disable collisions on the slave player and make the primary send him messages when a collisions occur.
- Overhaul movement. Allow players to move freely through the whole scenario ie: left-right changes the angle and up moves forward according to the current angle.
  - Once the players can move in many directions we can have more than two players.
- Sync up when the game has finished and one of the players starts a new game.
- Game creation. The user should be able to chose wheather to create a new game (giving a name for it) or joining a ongoing game. If the user creates a new game we should give him an url to that game so he can share it.
- Let the player enter a name for himself. Then we can add a tag to each player sprite. 
