/**
 *
 */
function Phantom() {

}
Phantom.prototype = Object.create(Abstraction);
Phantom.prototype.constructor = Phantom;

/*
 * Add Methods
 */
_.extend(Phantom.prototype, {
    getContent: function () {
        throw new Error('not implement yet');
    }
});
/**
 * Exports
 */
WebcrawlerSystem.Phantom = Phantom;