/**
 * https://github.com/sylvinus/node-crawler
 */
var CrawlerNPM = Npm.require("crawler");
var Future = Npm.require('fibers/future');
var Fiber = Npm.require('fibers');

function Crawler(options) {
    if(!options)
        options = {};
    options = _.extend({
        maxConnections : 10
    }, options);
    this._driver = new CrawlerNPM(options);
}
Crawler.prototype = Object.create(Abstraction);
Crawler.prototype.constructor = Crawler;

/*
 * Add Methods
 */
_.extend(Crawler.prototype, {
    getContent: function (url) {
        if(!validURL(url))
            throw new Error('string is not url');
        var future = new Future;
        // Queue URLs with custom callbacks & parameters
        this._driver.queue([{
            uri: url,
            jQuery: true,
            // The global callback won't be called
            callback: function (error, result, $) {
                if($)
                    future.return($);
                if(error)
                    future.throw(error);
            }
        }]);
        return future.wait();
    }
});
/**
 * Exports
 */
WebcrawlerSystem.Crawler = Crawler;