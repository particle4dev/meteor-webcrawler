/**
 * Config, variable
 */
Future = Npm.require('fibers/future');
Fiber = Npm.require('fibers');

re_weburl = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i
matchUrl = function (c) {
    var b = void 0,
    d = "url,,scheme,,authority,path,,query,,fragment".split(","),
    e = /^(([^\:\/\?\#]+)\:)?(\/\/([^\/\?\#]*))?([^\?\#]*)(\?([^\#]*))?(\#(.*))?/,
    a = {
        url: void 0,
        scheme: void 0,
        authority: void 0,
        path: void 0,
        query: void 0,
        fragment: void 0,
        valid: !1
    };
    "string" === typeof c && "" != c && (b = c.match(e));
    if ("object" === typeof b)
        for (x in b) d[x] && "" != d[x] && (a[d[x]] = b[x]);
    a.scheme && a.authority && (a.valid = !0);
    a.query = getQueryVariable(a.query);
    return a
};
function isNull(obj) {
    return obj === null;
};
function isUndefined (obj) {
    return obj === void 0;
};
function getQueryVariable(query) {
    if(isUndefined(query))
        return {};
    var vars = query.split("&");
    var result = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if(isUndefined(pair[1]))
            result[pair[0]] = null;
        else
            result[pair[0]] = pair[1];
    }
    return result;
};