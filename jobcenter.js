function Job(name, options) {
    
    this.getName = function() {
        return name;
    }

}

module.exports = (function() {
    var _jobcenter = this;
    
    if ( !Creep.prototype.getJob ) {
        Creep.prototype.getJob = function() {
            return this.memory._job;
        }
        
        Creep.prototype.setJob = function(job) {
            this.memory._job = job;
        }
        
        Creep.prototype.doJob = function() {
            if ( !this.getJob() ) {
                _jobcenter.applyJob(this);
            }
        }
    }
    
    
    this.applyJob = function(creep) {
            
    }
    
    
})();