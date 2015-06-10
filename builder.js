module.exports = function(controller, _) {
	var MAX_BUILDERS = 1;
	
	var builders = controller.findCreeps("builder");
    if ( builders.length < MAX_BUILDERS ) {
        controller.factory.createBuilder();
    }
	
	for (var b in builders) {
		var creep = builders[b];
		
		var status = creep.getStatus("building");
		
		if ( creep.energy == 0 ) {
			creep.setStatus("transfering");
			
			var s = Game.spawns.Spawn1;
			creep.moveTo(s);
			s.transferEnergy(creep);
			
		} else if ( status == "building" || creep.energy == creep.energyCapacity ) {
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                creep.moveTo(targets[0]);
                creep.build(targets[0]);
                creep.setStatus("building");
				return;
            }
			
			var rc = creep.room.controller;
			if ( rc && rc.my ) {
				creep.moveTo(rc);
				creep.build(rc);
				creep.setStatus("building");
			}
		}
	}
	
}