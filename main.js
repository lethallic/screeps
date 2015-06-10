/// <reference path="typings/screeps/screeps.d.ts" />
var _ = require("lodash");

Creep.prototype.setStatus = function(s) {
    this.memory.status = s ;
};

Creep.prototype.getStatus = function(def) {
    if ( this.memory && this.memory.status ) {
        return this.memory.status;    
    }
    return def || null;
};

(function controller(modules) {
    var c = {
        findCreeps : function(role) {
            return _.filter(Game.creeps, { "memory" : { "role" : role }});
        }
        
    }
    c.factory = require("factory")(c, _);
    
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }    
    
    for ( var m in modules ) {
       require(modules[m])(c, _);
    }
    
})(["harvester", "builder"]);