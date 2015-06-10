/// <reference path="typings/screeps/screeps.d.ts" />
var _ = require("lodash");

Creep.prototype.setStatus = function(s) {
    this.memory.status = s ;
};

Creep.prototype.getStatus = function() {
    if ( this.memory && this.memory.status ) {
        return this.memory.status;    
    }
    return "harvesting";
};

(function controller(modules) {
    var c = {
        findCreeps : function(role) {
            return _.filter(Game.creeps, { "memory" : { "role" : role }});
        }
        
    }
    c.factory = require("factory")(c, _);
    
    
    for ( var m in modules ) {
       require(modules[m])(c, _);
    }
    
})(["harvester"]);


var test = require(["controller", "factory"], function(controller, factory) {
   console.log(factory);
   controller.factory = factory;
   
   
   return controller; 
});

console.log(test);