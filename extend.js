module.exports = function() {
    Creep.prototype.setStatus = function(s) {
    this.memory.status = s ;
    };

    Creep.prototype.getStatus = function(def) {
        if ( this.memory && this.memory.status ) {
            return this.memory.status;    
        }
        return def || null;
    };
}