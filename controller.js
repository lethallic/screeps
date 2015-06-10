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
	this.factory = new RoomFactory(room, self);
	
	var _getCreeps = function(role) {
		return room.find(FIND_MY_CREEPS, {
			filter : function(creep) {
				return (creep.memory.role == role)
			}
		});
	}
	
	this.getHarvesters = function() {
		return _getCreeps(_roles.HARVESTER);
	};
	
	this.getBuilders = function() {
		return _getCreeps(_roles.BUILDER);
	};
	
	this.run = function() {
		/** Procude Creeps */
		self.factory.produce();
		
		/** Do Work */
		var creeps = room.find(FIND_MY_CREEPS);
		if ( creeps.length ) {
			for ( var c in creeps ) {
			    var creep = creeps[c];
				var role = creep.memory.role;
				
				if ( tasklist[role] ) {
					tasklist[role].do(creep);
				}
			} 
		}
	};
}

function RoomFactory(room, ctrl) {
	var self = this;
	
	var getIdleSpawn = function() {
		return room.find(FIND_MY_SPAWNS)[0];
	}
	
	var createCreep = function(body, role) {
		var name = role + "_" + (Math.round(Math.random() * 1000));
		
		var result = getIdleSpawn().createCreep(body, name, {
			"role" : role
		});
		
		if ( _.isString(result) ) {
			return true;
		} 
		
		return false;
	}
		
	this.createHarvester = function() {
		var cfg = config.creeps.harvesters;
		if ( ctrl.getHarvesters().length < cfg.max ) {
			createCreep(cfg.body, _roles.HARVESTER);
		}		
	}
	
	this.createBuilder = function() {
		var cfg = config.creeps.builders;
		if ( ctrl.getBuilders().length < cfg.max ) {
			createCreep(cfg.body, _roles.BUILDER);
		}
	};
	
	this.produce = function() {
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