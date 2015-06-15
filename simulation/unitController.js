var UnitController = function(role, tasks) {
    this._role = role;
    this._tasks = tasks;
};


UnitController.prototype.getRole = function() {
    return this._role;
}

UnitController.prototype.getTasks = function() {
    return this._tasks;
}

module.exports = UnitController;