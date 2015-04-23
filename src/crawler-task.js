/**
 * 
 */
function CrawlerTask() {
    this._tasks = [];
    this._data = new Register();
}
CrawlerTask.prototype.constructor = CrawlerTask;
/*
 * Add Methods
 */
_.extend(CrawlerTask.prototype, {
    run: function(){
        if(!this.url)
            throw new Error('url is not set');
        this.url = encodeURI(this.url);
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
                    var driver = WebcrawlerSystem._getDriver();
                    var $ = driver.getContent(url);
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
});
/**
 * Exports
 */
WebcrawlerSystem.CrawlerTask = CrawlerTask;

/**
 CODE STYLE
WebcrawlerSystem.register("flickr:fetchGalleries", {
    _init: function(url){
        this.url = url;
        logging('fetching ' + url);
    },
    pipeline: function(){
        this.registerTask('getGalleries', function($){
            var self = this;
            var galleries = [];
            var gallery = $('div.galleries').find('a');
            gallery.each(function (index, a) {
                galleries.push(self._urlMatch.scheme + '://' + self._urlMatch.authority + $(this).attr('href'));
            });
            this.save('galleries', galleries);
            return $;
        });
    },
    onsuccess: function(){
        var albumModule = APP.namespace('ALBUMS');
        var galleries = this.get('galleries');
        _.each(galleries, function (url) {
            if(albumModule.isAlbumSiteExists(url)) {
                logging(url + ' is crawled, ignore.');
            }
            else {
                WebcrawlerSystem.make("flickr:makeAlbum", url);
            }
        });
        logging('success ' + this.url);
        WebcrawlerSystem.run();
    },
    onfailure: function(error){
        console.trace(error);
    }
});
 */
