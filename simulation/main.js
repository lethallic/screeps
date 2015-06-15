

var utils = require("utils"),
    RoomController = require("roomController");

var main = (function(){
    utils.recycle();
    
    this.run = function() {
        for ( var r in Game.rooms ) {
            var room = Game.rooms[r];
            
            var rc = new RoomController(room);
            rc.run();
        }
    }

    this.isSimulation = function() {
        for ( var r in Game.rooms ) {
            if ( Game.rooms[r].mode == MODE_SIMULATION ) {
                return true;
            }
        }
        return false;
    }

})();


main.run();