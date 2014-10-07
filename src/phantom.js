// From spiderable
var child_process   = Npm.require('child_process');

// how long to let phantomjs run before we kill it
var REQUEST_TIMEOUT = 15*1000;

// maximum size of result HTML. node's default is 200k which is too
// small for our docs.
var MAX_BUFFER = 5*1024*1024; // 5MB

var PHANTOM_SCRIPT = Assets.getText('scripts/phantomContent.txt');

getPage = function (url) {
    // Run phantomjs.
    //
    // Use '/dev/stdin' to avoid writing to a temporary file. We can't
    // just omit the file, as PhantomJS takes that to mean 'use a
    // REPL' and exits as soon as stdin closes.
    //
    // However, Node 0.8 broke the ability to open /dev/stdin in the
    // subprocess, so we can't just write our string to the process's stdin
    // directly; see https://gist.github.com/3751746 for the gory details. We
    // work around this with a bash heredoc. (We previous used a "cat |"
    // instead, but that meant we couldn't use exec and had to manage several
    // processes.)
    var future = new Future;
    var pt = 'var url = "' + url + '"; ' + PHANTOM_SCRIPT;
    child_process.execFile('/bin/bash', [
        '-c',
        ("exec phantomjs --load-images=no /dev/stdin <<'END'\n" + pt + "END\n")],
        {
            timeout: REQUEST_TIMEOUT,
            maxBuffer: MAX_BUFFER
    }, function(error, stdout, stderr) {
        if (!error && /<html/i.test(stdout)) {
            // console.log(error, stdout, stderr);
            $ = cheerio.load(stdout);
            future.return($);
        }
        else {
            // phantomjs failed. Don't send the error, instead send the
            // normal page.
            if (error && error.code === 127) future.throw(new Error("phantomjs: phantomjs not installed. Download and install from http://phantomjs.org/"));
            else {
                Meteor._debug("phantomjs: phantomjs failed:", error, "\nstderr:", stderr);
            }
        }
    });
    return future.wait();
};