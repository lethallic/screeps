var controllers = require("controller")(Game.rooms);
for ( var roomName in controllers ) {
    controllers[roomName].run();
}