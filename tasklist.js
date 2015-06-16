function findNewSpawn() {
    for ( var r in Game.rooms ) {
        var room = Game.rooms[r];
        var cs = room.find(FIND_CONSTRUCTION_SITES);
        
        if ( cs.length ) {
            for ( var siteId in cs ) {
                var site = cs[siteId];
                if ( site.structureType == STRUCTURE_SPAWN ) {
                    return site;
                }
            }
        }
    }

    return null;
}

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
				    for ( var s in sources ) {
				        if ( !sources[s].isDefended() ) {
				            c.moveTo(sources[s]);
					        c.harvest(sources[s]);
					        c.setStatus("harvesting");
					        return true;
				        }
				    }
				}
			}
			return false;
		},
		
		function(c) {
		    var cs = c.room.find(FIND_CONSTRUCTION_SITES);
            
            if ( c.energy > 0 && cs.length ) {
                for ( var siteId in cs ) {
                    var site = cs[siteId];
                    if ( site.structureType == STRUCTURE_SPAWN ) {
                        c.moveTo(site);
                        c.build(site);
                        c.setStatus("buildSpawn");
                        return true;
                    }
                }
            }
		    
		    return false;
		},
		
		function(c) {
		    //return false;
		    console.log(c.room.find(FIND_MY_CREEPS).length);
            if ( c.room.find(FIND_MY_CREEPS).length > 8 ) {
                var newSpawn = findNewSpawn();
                if (newSpawn && newSpawn.room.find(FIND_MY_CREEPS).length < 3) {
                    if ( newSpawn ) {
                        c.say("new spawn");
                        c.moveTo(newSpawn);
                        c.build(newSpawn);
                        return true;
                    }
                }
            }
            return false;		    
		},
		function(c) { /** Transfer Energy */
			if ( c.energy == c.energyCapacity || ( c.energy > 0 && c.getStatus("harvesting") == "transfering")) {
				
				var structures = c.room.find(FIND_MY_STRUCTURES);
				for ( var e in structures ) {
					var structure = structures[e];
					if ( structure.structureType == STRUCTURE_EXTENSION ) {
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
					var spawn = spawns[0];
					if ( spawn.energy < spawn.energyCapacity ) {
						c.moveTo(spawn);
						c.transferEnergy(spawn);
						c.setStatus("transfering");
						return true;	
					}
				}
			}
			return false;
		},
		function (c) {
			if ( c.energy > 0 ) {
				var rc = c.room.controller;
				if ( rc && rc.my ) {
					c.moveTo(rc);
					c.upgradeController(rc);
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
		function(c) { // get energy
			if ( c.energy == 0 || ( c.energy < c.energyCapacity && c.getStatus("transfering") == "transfering" ) ) {
				var spawns = c.room.find(FIND_MY_SPAWNS);
				if ( spawns.length ) {
					var spawn = spawns[0];
					
					if ( spawn.energy > 0 ) {
						c.moveTo(spawn);
						spawn.transferEnergy(c);
						c.setStatus("transfering");
						return true;
					}
				}
			}
			return false;
		},
	
		function(creep) { // build
			// if ( creep.energy > 0 || ( creep.energy > 0 && c.getStatus("transfering") == "building" ) ) {
			if ( creep.energy > 0 ) {
				var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	            if(targets.length) {
	                creep.moveTo(targets[0]);
	                creep.build(targets[0]);
	                creep.setStatus("building");
					return true;
	            }
				
				var rc = creep.room.controller;
				if ( rc && rc.my ) {
					creep.moveTo(rc);
					creep.upgradeController(rc);
					creep.setStatus("building");
					return true;
				}
			}
			return false;
		},
		
		function(c) { // repair
			if ( c.energy > 0 )	 {
				var structures = c.room.find(FIND_STRUCTURES);
				for ( var s in structures ) {
					var struct = structures[s];
					if ( struct.my || struct.structureType == STRUCTURE_ROAD ) {
						if ( struct.needsRepair() ) {
							c.moveTo(struct);
							c.repair(struct);
							c.setStatus("repair");
							return true;
						}
					}
				}
			}
			return false;
		},
		
		function(c) {
		    var spawns = c.room.find(FIND_MY_SPAWNS);
			if ( spawns.length ) {
		        var spawn = spawns[0];
			    c.moveTo(spawn);
			}
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
