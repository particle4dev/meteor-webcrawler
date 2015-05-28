Register = (function () { 
    return function () {
        var list = [];
        this.set = function (name, obj) {
            if(list[name])
                throw new Error(name + ' is exists');
            list[name] = obj;
        };
        this.get = function (name) {
            return list[name];
        };
        this.isSet = function (name) {
            return !!list[name];
        };
    };
})();