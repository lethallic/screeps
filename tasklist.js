module.exports = {
	"WORKER" : new TaskList([
		function(c) {
			if ( c.ticksToLive <= 10 ) {
				c.dropEnergy(c.energy);
				c.suicide();
			}
			return false;			
		},
		function(c) { /** Harvest Energy */
			var room = c.room;
			if ( c.energy == 0 ) {
				var energy = room.find(FIND_DROPPED_ENERGY);
				if ( energy.length ) {
					c.moveTo(energy[0]);
					c.pickUp(target[0]);
					return true;
				}
				var sources = room.find(FIND_SOURCES);
				if ( sources.length ) {
					c.moveTo(sources[2]);
					c.harvest(sources[2]);
					return true;
				}
			}
			return false;
		},
		function(c) { /** Transfer Energy */
			if ( c.energy == c.energyCapacity ) {
				var spawns = c.room.find(FIND_MY_SPAWNS);
				if ( spawns.length ) {
					c.moveTo(spawns[0]);
					c.transferEnergy(spawns[0]);
				}
			}
			return false;
		},
		function(c) {
			c.say("[STATUS: IDLE]");
		}
	]),
	"BUILDER" : new TaskList([
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