/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('scout'); // -> 'a thing'
 */

module.exports = function(){
    var flags = _.find(Game.flags, function(flag){
        return (flag.color == COLOR_WHITE);
    });
    
    
    for ( var id in Game.flags ) {
        var flag = Game.flags[id];
        if ( flag.color == COLOR_WHITE) {
            if ( !flag.memory.scout ) {
                // not scout, build one
                var scoutName = "scout_" + flag.id;
                
                var scout = Game.spawns["Spawn1"].createCreep([MOVE, MOVE], scoutName, { role : "scout", flag : flag.id});
                console.log(scout);
                
                if ( _.isString(scout) ) {
                    flag.memory.scout = scoutName;
                    console.log("scout created", f, scout);  
                }
            } else {
                var creep = Game.creeps[flag.memory.scout];
                if ( creep ) {
                    var controller = flag.room.controller;
                    
                    if ( !controller.owner ) {
                        creep.moveTo(controller);
                        creep.claimController(controller);
                    } else {
                        creep.moveTo(flag);
                    }
                } 
            }
        }
    }
};