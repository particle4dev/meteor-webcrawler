
_.extend(WebcrawlerSystem, {
    /**
     * Private
     */
    _crawler: new Register(),
    _createCrawler: function(opts){
        // var NewCrawler = function(){
        //     this._tasks = [];
        //     this._data = new Register();
        //     if(this.pipeline)
        //         this.pipeline();
        // };
        // _.extend(NewCrawler.prototype, WebcrawlerSystem.WebcrawlerPrototype);
        // NewCrawler.prototype.constructor = NewCrawler;
        // if(opts._init)
        //     NewCrawler.prototype._init = opts._init;
        // if(opts.pipeline)
        //     NewCrawler.prototype.pipeline = opts.pipeline;
        // NewCrawler.prototype._onsuccessCallback = (opts.onsuccess) ? opts.onsuccess : function(){};
        // NewCrawler.prototype._onfailureCallback = (opts.onfailure) ? opts.onfailure : function(){};
        // return NewCrawler;
        var NewCrawler = (function (_super, opts) {
            __extends_class(NewCrawler, _super);
            function NewCrawler(name) {
                _super.call(this, name);
            }
            if(opts._init)
                NewCrawler.prototype._init = opts._init;
            if(opts.pipeline)
                NewCrawler.prototype.pipeline = opts.pipeline;
            NewCrawler.prototype._onsuccessCallback = (opts.onsuccess) ? opts.onsuccess : function(){};
            NewCrawler.prototype._onfailureCallback = (opts.onfailure) ? opts.onfailure : function(){};
            return NewCrawler;
        })(WebcrawlerSystem.CrawlerTask, opts);
        return NewCrawler;
    },
    _getDriver: function(){
        if(!this.__driver) {
            // use Crawler by default
            this.__driver = new WebcrawlerSystem.Crawler();
        }
        return this.__driver;
    },
    _pipeline: new Pipeline(),
    _waitTime: 15000,
    /**
     * Public API
     */
    run: function () {
        if(this._pipeline.getLength() > 0)
            this._pipeline.requireFlush(1, this._waitTime); // wait 15s
    },
    setWaitTime: function(num){
        if(!_.isNumber(num))
            throw new Error('time must be a number');
        this._waitTime = num;
    },
    register: function (name, opts) {
        if(!_.isString(name))
            throw new Error('name must be a string');
        if(!_.isObject(opts))
            throw new Error('opts must be a object');
        this._crawler.set(name, this._createCrawler(opts));
    },
    make: function(className /** arg */){
        var c = this._crawler.get(className);
        var args = Array.prototype.slice.call(arguments, 1);
        var t = new c();
        t._init.apply(t, args);
        t.run = t.run.bind(t);
        this._pipeline.push(t.run);
    },
    runImmediately: function(className /** arg */){
        var c = this._crawler.get(className);
        var args = Array.prototype.slice.call(arguments, 1);
        var t = new c();
        t._init.apply(t, args);
        t.run = t.run.bind(t);
        this._pipeline.unshift(t.run);
    },
    config: function(){
        throw new Error('not implement yet');
    }
});