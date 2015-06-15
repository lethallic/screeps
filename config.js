
module.exports = {
	
	creeps : {
		"harvesters" : {
			max : 6,
			body : [MOVE, MOVE, CARRY, CARRY, WORK]	
		},
		"builders" : {
			max : 1,
			body : [MOVE, CARRY, WORK]
		}
	}
	
	
};