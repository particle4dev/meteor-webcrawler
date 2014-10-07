###Todos
Create README

####Example
```javascript

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

WebcrawlerSystem.register("flickr:makeAlbum", {
    _init: function(url){
        this.url = url;
    },
    pipeline: function(){
        this.registerTask('getListImages', function($){
            var images = [];
            var gallery = $('div.gallery').find('img');
            gallery.each(function (index, img) {
                images.push($(this).attr('src'));
            });
            this.save('images', images);
            return $;
        });
        this.registerTask('getStarName', function($){
            var title = $('div.title').find('h2').html();
            this.save('starName', title);
            return $;
        });
        this.registerTask('getAlbumTitle', function($){
            var title = $('div.desc').find('h1').html();
            this.save('albumTitle', title);
            return $;
        });
    },
    onsuccess: function(){
        var starModule = APP.namespace('STARS');
        var albumModule = APP.namespace('ALBUMS');
        var pictureModule = APP.namespace('PICTURES')
        var starId = starModule.findIdByName(this.get('starName'));
        
        var album = {};
        album._id = starId + "_" + moment().unix();
        album.starId = starId;
        album.title = this.get('albumTitle');
        album.type = SC.CRAWLER;
        album.userId = "user00";
        album.site = this.url;

        var images = this.get('images');
        var image = {};
        image.albumId = album._id;
        image.userId = "user00";
        var igno = /(banner|paysites)/gi;
        _.each(images, function (v) {
            if(! igno.test(v) ) {
                image.link = v;
                try {
                    pictureModule.insert(image); 
                }
                catch (e) {
                    logging(e.message.color('red'));
                }
                
            }
        });

        albumModule.insert(album);

        // continue crawle
        WebcrawlerSystem.run();
    },
    onfailure: function(error){
        console.trace(error, 'error');
        WebcrawlerSystem.run(); // still continue
    }
});

WebcrawlerSystem.make("flickr:fetchGalleries", "https://www.flickr.com/photos/creepella_gruesome/15269958538/in/explore-2014-10-06");
WebcrawlerSystem.run();
