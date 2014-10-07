Package.describe({
    summary: "simple webcrawler for iron router",
    version: "1.0.0",
    name: "particle4dev:webcrawler",
    git: "https://github.com/particle4dev/meteor-webcrawler.git"
});

// meteor test-packages ./
var both = ['client', 'server'];
var client = ['client'];
var server = ['server'];

Package.on_use(function(api) {
    api.versionsFrom("METEOR@0.9.3");
    api.use(['underscore', 'particle4dev:cheerio@1.0.0', 'codeadventure:es6-promises@0.1.0'],  server);
    
    api.add_files([
        'scripts/phantomContent.txt'
    ], server, {isAsset: true});

    api.add_files([
        'src/utils/helpers.js',
        'src/utils/register.js',
        'src/utils/pipeline.js',

        'src/phantom.js',
        'src/common.js',
        'src/webcrawler.js',
        'src/system.js'
    ], server);

    if (typeof api.export !== 'undefined') {
        api.export('WebcrawlerSystem', server);
    }
});

Package.on_test(function(api) {
    api.use(['test-helpers', 'tinytest'], client);
    api.add_files([
    ], client);
});
