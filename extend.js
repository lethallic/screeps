function extend(p, ext) {
    for ( var e in ext ) {
        p[e] = ext[e];
    }
};


module.exports = function() {
    
    extend(Creep.prototype, {
        getStatus : function(default) {
            if ( this.memory && this.memory.status ) {
                return this.memory.status;    
            }
            return def || null;
        },
        setStatus : function(newStatus) {
            this.memory.status = newStatus;
        }
    });
    
    extend(Room.prototype, {
        
    });
    
    extend(Structure.prototype, {
        isDamaged : function() {
            return this.hits < this.maxHits;
        }
    });
    
    
    extend(Source.prototype, {
        isDefended : function() {
            var targets = this.pos.findInRange(FIND_HOSTILE_CREEPS, 10);
            if ( targes.length ) {
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