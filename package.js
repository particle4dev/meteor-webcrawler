Package.describe({
    summary: "simple webcrawler for meteor",
    version: "2.0.0-rc3",
    name: "particle4dev:webcrawler",
    git: "https://github.com/particle4dev/meteor-webcrawler.git"
});

// Server-side push deps
Npm.depends({
    "crawler": "0.4.3"
});

// meteor test-packages ./
var both = ['client', 'server'];
var client = ['client'];
var server = ['server'];

Package.on_use(function(api) {
    api.versionsFrom("1.0");
    api.use([
        'underscore',
        'particle4dev:cheerio@0.19.0',
        'codeadventure:es6-promises@0.1.0'
    ],  server);
    
    api.add_files([
        'scripts/phantomContent.txt'
    ], server, {isAsset: true});

    api.add_files([
        // utils
        'src/utils/helpers.js',
        'src/utils/register.js',
        'src/utils/pipeline.js',
        'src/utils/extends.js',
        'src/utils/url.js',

        'src/common.js',
        // drivers
        'src/drivers/abstraction.js',
        'src/drivers/phantom.js',
        'src/drivers/crawler.js',
        'src/drivers/selenium.js',

        'src/crawler-task.js',
        'src/system.js'
    ], server);

    if (typeof api.export !== 'undefined') {
        api.export('WebcrawlerSystem', server);
        api.export('__extends_class', {testOnly: true});
    }
});

Package.on_test(function(api) {
    api.use(['particle4dev:webcrawler', 'test-helpers', 'tinytest'], server);
    api.add_files([
        'tests/utils/extends.js',
        'tests/drivers/crawler.js'
    ], server);
});
