/**
var controllers = require("controller")(Game.rooms);
for ( var roomName in controllers ) {
    controllers[roomName].run();
}
*/

require("extend")();
var _ = require("lodash");



(function controller(modules) {
    var c = {
        findCreeps : function(role) {
            return _.filter(Game.creeps, { "memory" : { "role" : role }});
        }
        
    }
    c.factory = require("factory")(c, _);
    
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }    
    
    for ( var m in modules ) {
       require(modules[m])(c, _);
    }
    
})(["harvester", "builder"]);