module.exports = function(controller, _) {
	var MAX_HARVESTERS = 2;
    
    
    var harvesters = controller.findCreeps("worker");
    if ( harvesters.length < MAX_HARVESTERS ) {
        controller.factory.createWorker();
    }
    
    for ( var h in harvesters ) {
        var creep = harvesters[h];
        //if ( creep.energy < creep.energyCapacity ) {
        
        var status = creep.getStatus();
        if ( (status == "transfering" || status == "building") && creep.energy == 0 ) {
            status = "harvesting";
        }
        
        if ( status == "harvesting" && creep.energy < creep.energyCapacity ) {
            var sources = creep.room.find(FIND_SOURCES);
            if ( sources.length ) {
                creep.moveTo(sources[1]);
                creep.harvest(sources[1]);
                creep.setStatus("harvesting");
            }
        } else {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                creep.moveTo(targets[0]);
                creep.build(targets[0]);
                creep.setStatus("building");
            } else {
                creep.setStatus("transfering");
                var spawn = Game.spawns.Spawn1;
                creep.moveTo(spawn);
                creep.transferEnergy(spawn);
            }
        }
    }
    
};


