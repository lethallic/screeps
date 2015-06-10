module.exports = {
	"WORKER" : new TaskList([
		function(c) { /** Harvest Energy */
						
			return false;
		},
		function(c) { /** Transfer Energy */
						
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