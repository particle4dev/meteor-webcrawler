var Crawler = Npm.require("crawler");

testAsyncMulti("driver - crawler", [
    function (test, expect) {
        var c = new Crawler({
            maxConnections : 10,
            // This will be called for each crawled page
            // https://github.com/meteor/meteor/blob/556c0e28e94b9351cbf0b28e80a71a4e35f1362a/packages/meteor/dynamics_nodejs.js#L65
            callback :  expect(function (error, result, $) {
                // $ is Cheerio by default
                var title = $('title').html();
                test.equal(title.indexOf('meteor') != -1, true,  "expected true");
            })
        });
        // https://github.com/sylvinus/node-crawler/blob/master/lib/crawler.js#L458
        // https://github.com/sylvinus/node-crawler/blob/master/lib/crawler.js#L466
        // Trying to report a test not in a fiber! You probably forgot to wrap a callback in bindEnvironment.
        var _onInjectOrigin = c._onInject;
        c._onInject = Meteor.bindEnvironment(_onInjectOrigin.bind(c));
        // Queue just one URL, with default callback
        c.queue('https://github.com/meteor/meteor');
    },
    function (test, expect) {
        var c = new WebcrawlerSystem.Crawler();
        var cherrio = c.getContent('https://github.com/meteor/meteor');
        var title = cherrio('title').html();
        test.equal(title.indexOf('meteor') != -1, true,  "expected true");
    }
]);
