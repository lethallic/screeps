module.exports = function(rooms){
	recycleMemory();
	
	var controller = {};
	for ( var roomName in rooms ) {
		var room = rooms[roomName];
		controller[roomName] = new RoomController(room);	
	}
	return controller;
}

function RoomController(room) {
	var self = this;
	
	
	this.getHarvesters = function() {
		
	};
	
	this.getBuilders = function() {
		
	}	
		
}


function recycleMemory() {
	for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    } 
}