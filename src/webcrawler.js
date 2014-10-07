WebcrawlerSystem.WebcrawlerPrototype = {
    run: function(){
        if(!this.url)
            throw new Error('url is not set');
        this._urlMatch = matchUrl(this.url);

        var url = this.url;
        if(!re_weburl.test(url))
            throw new Error('url is not valid');
        // http://stackoverflow.com/questions/20100245/how-can-i-execute-array-of-promises-in-sequential-order
        var self = this;

        Fiber(function(url) {
            // make callback work with fiber
            self._onfailureCallback = self._onfailureCallback.bind(self);
            self._onfailureCallback = Meteor.bindEnvironment(self._onfailureCallback);
            self._onsuccessCallback = self._onsuccessCallback.bind(self);
            self._onsuccessCallback = Meteor.bindEnvironment(self._onsuccessCallback);
            var promise = new Promise(function(resolve, reject) {
                try {
                    var $ = getPage(url);
                    resolve($);
                }
                catch(e){
                    reject(e);
                }
            });
            promise
            .then(function (result) {
                self._tasks.reduce(function(cur, next){
                    return cur.then(next.func);
                }, Promise.resolve(result)).then(function(value){
                    self._onsuccessCallback(value);
                }).catch(function(error) {
                    self._onfailureCallback(error);
                });
            })
            .catch(function(error) {
                self._onfailureCallback(error);
            });
        }).run(url);
    },
    onsuccess: function (callback) {
        if(!_.isFunction(callback))
            throw new Error('callback must be a function');
        callback = callback.bind(this);
        this._onsuccessCallback = Meteor.bindEnvironment(callback);
    },
    onfailure: function (callback) {
        if(!_.isFunction(callback))
            throw new Error('callback must be a function');
        callback = callback.bind(this);
        this._onfailureCallback = Meteor.bindEnvironment(callback);
    },
    registerTask: function(name, func){
        if(!_.isString(name))
            throw new Error('name must be a string');
        if(!_.isFunction(func))
            throw new Error('task must be a function');
        func = func.bind(this);
        this._tasks.push({
            name: name,
            func: func
        });
    },
    save: function(name, data){
        return this._data.set(name, data);
    },
    get: function(name) {
        return this._data.get(name);
    }
};