function extend(p, ext) {
    for ( var e in ext ) {
        p[e] = ext[e];
    }
};


module.exports = function() {
    
    extend(Creep.prototype, {
        getStatus : function(defaultStatus) {
            if ( this.memory && this.memory.status ) {
                return this.memory.status;    
            }
            return defaultStatus || null;
        },
        setStatus : function(newStatus) {
            this.memory.status = newStatus;
        }
    });
    
    extend(Room.prototype, {
        getSources : function(defended) {
            return this.find(FIND_SOURCES, {
                filter: function(o) {
                    return (o.isDefended() != (defended || false));
                }
            });
        },
        
    });
    
    
    extend(Structure.prototype, {
        needsRepair : function(name) {
            return this.hits < this.hitsMax / 2;
        }
    });
    
    extend(Spawn.prototype, {
        needsRepair : function(name) {
            console.log(this, this.hits, this.hitsMax);
            
            return this.hits < this.hitsMax / 2;
        }
    });
    
    extend(Source.prototype, {
        isDefended : function() {
            var targets = this.pos.findInRange(FIND_HOSTILE_CREEPS, 10);
            if ( targets.length ) {
                return true;
            }
            
            targets =  this.pos.findInRange(FIND_HOSTILE_STRUCTURES, 10);
            if ( targets.length ) {
                return true;
            }

            return false;
        }
    });

};