/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('factory'); // -> 'a thing'
 */
 
 module.exports = function(controller, _) {
     var _spawn = function() {
        for ( var s in Game.spawns ) {
            return Game.spawns[s];
        }
        return null;
     };
     
     var _createCreep = function(name, body, memory) {
        var s = _spawn();
        if ( s != null ) {
            return s.createCreep(body, name, memory);
        }
        return false;
     };
     
     return {
        createWorker : function() {
            var name = "worker_" + Math.round(Math.random() * 100);
            
            var result = _createCreep(name, [WORK, MOVE, CARRY], { "role" : "worker"});
            if ( _.isString(result) ) {
                return true;
            }
            return false;
        },
        createBuilder : function() {
            var name = "builder_" + Math.round(Math.random() * 100);
            
            var result = _createCreep(name, [WORK, MOVE, CARRY], { "role" : "builder"});
            if ( _.isString(result) ) {
                return true;
            }
            return false;
        }
     }
 }