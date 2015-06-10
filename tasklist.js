module.exports = {
	"worker" : new TaskList([
		function(c) {
			if ( c.ticksToLive <= 10 ) {
				c.dropEnergy(c.energy);
				c.suicide();
			}
			return false;			
		},
		function(c) { /** Harvest Energy */
			var room = c.room;
			if ( c.energy == 0 || ( c.energy < c.energyCapacity && c.getStatus("harvesting") == "harvesting") ) {
				var energy = room.find(FIND_DROPPED_ENERGY);
				if ( energy.length ) {
					c.moveTo(energy[0]);
					c.pickup(energy[0]);
					c.setStatus("harvesting");
					return true;
				}
				var sources = room.find(FIND_SOURCES);
				if ( sources.length ) {
					c.moveTo(sources[2]);
					c.harvest(sources[2]);
					c.setStatus("harvesting");
					return true;
				}
			}
			return false;
		},
		function(c) { /** Transfer Energy */
			if ( c.energy == c.energyCapacity || ( c.energy > 0 && c.getStatus("harvesting") == "transfering")) {
				
				var structures = c.room.find(FIND_MY_STRUCTURES);
				for ( var e in structures ) {
					var structure = structures[e];
					if ( structure.type == STRUCTURE_EXTENSION ) {
						if ( structure.energy < structure.energyCapacity ) {
							c.moveTo(structure);
							c.transferEnergy(structure);
							c.setStatus("transfering");
							return true;
						}
					}
				}

				var spawns = c.room.find(FIND_MY_SPAWNS);
				if ( spawns.length ) {
					c.moveTo(spawns[0]);
					c.transferEnergy(spawns[0]);
					c.setStatus("transfering");
					return true;
				}
			}
			return false;
		},
		function(c) {
			c.say("[STATUS: IDLE]");
		}
	]),
	"builder" : new TaskList([
		function(c) {
			if ( c.energy == 0 || ( c.energy < c.energyCapacity && c.getStatus("transfering") == "transfering" ) ) {
				var spawns = c.room.find(FIND_MY_SPAWNS);
				if ( spawns.length ) {
					c.moveTo(spawns[0]);
					spawns[0].transferEnergy(c);
					c.setStatus("transfering")
					return true;
				}
			}
			return false;
		},
		function(creep) {
			// if ( creep.energy > 0 || ( creep.energy > 0 && c.getStatus("transfering") == "building" ) ) {
			if ( creep.energy > 0 ) {
				var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	            if(targets.length) {
	                creep.moveTo(targets[0]);
	                creep.build(targets[0]);
	                creep.setStatus("building")
					return true;
	            }
				
				var rc = creep.room.controller;
				if ( rc && rc.my ) {
					creep.moveTo(rc);
					creep.upgradeController(rc);
					creep.setStatus("building")
					return true;
				}
			}
			return false;
		},
		function(c) {
			c.say("[STATUS: IDLE]");
		}
	])
};

function TaskList(tasks) {
	this._tasks = tasks;
	this.do = function(creep) {
		for ( var i = 0; i < this._tasks.length; i++ ) {
			if ( this._tasks[i](creep) ) {
				return;
			}
		}	
	};
};