var _ = require("lodash");
var config = require("config");
var tasklist = require("tasklist");

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
		return _.filter(room.creeps, {"memory" : {"role" :  _roles.BUILDER}});
	};
	
	this.run = function() {
		/** Procude Creeps */
		self.factory.produce();
		
		/** Do Work */
		for ( var c in room.creeps ) {
			var creep = room.creeps[c];
			
			var role = creep.memory.role;
			if ( tasklist[role] ) {
				tasklist[role].do(creep);
			}
		} 
	};
}

function RoomFactory(room, controller) {
	var self = this;
	
	var getIdleSpawn = function() {
		return room.find(FIND_MY_SPAWNS)[0];
	}
	
	var createCreep = function(body, role) {
		var name = role + "_" + (Math.round(Math.random() * 1000));
		
		var result = createCreep(body, name, {
			"role" : role
		});
		
		if ( _.isString(result) ) {
			return true;
		} 
		
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
	
	this.procude = function() {
		self.createHarvester();
		self.createBuilder();
	}	
			
}

function recycleMemory() {
	for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    } 
}