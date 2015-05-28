/**
 * 
 */
function Selenium(options) {
    if(!options)
        options = {};
    options = _.extend({

    }, options);
}
Selenium.prototype = Object.create(Abstraction);
Selenium.prototype.constructor = Selenium;

/*
 * Add Methods
 */
_.extend(Selenium.prototype, {
    getContent: function () {
        throw new Error('not implement yet');
    }
});
/**
 * Exports
 */
WebcrawlerSystem.Selenium = Selenium;