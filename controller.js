var _ = require("lodash");
var config = require("config");

var _roles = {
	BUILDER : "builder",
	HARVESTER : "worker"
};

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
	
	this.factory = new RoomFactory(room, this);
			
	this.getHarvesters = function() {
		return _.filter(room.creeps, {"memory" : {"role" :  _roles.HARVESTER}}); 		
	};
	
	this.getBuilders = function() {
		return _.filter(room.creeps, {"memory" : {"role" :  _roles.HARVESTER}});
	};	
}

function RoomFactory(room, controller) {
	
	var getIdleSpawn = function() {
		
		return null;
	}
	
	var createCreep = function(body, role) {
		
		return false;
	}
	
	
	this.createHarvester = function() {
		var cfg = config.creeps.harvesters;
		if ( controller.getHarvester().length < cfg.max ) {
			createCreep(cfg.body, _roles.HARVESTER);
		}		
	}
	
	this.createBuilder = function() {
		var cfg = config.creeps.builders;
		if ( controller.getHarvester().length < cfg.max ) {
			createCreep(cfg.body, _roles.BUILDER);
		}
	};	
			
}

function recycleMemory() {
	for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    } 
}