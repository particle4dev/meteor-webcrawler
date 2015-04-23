/**
 * http://stackoverflow.com/a/14582229
 * http://stackoverflow.com/a/8267900/2104729
 * it not work on localhost; NEED TO FIX
 */
validURL = function (url) {
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)" // protocol
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
        + "[a-z]{2,6}|localhost)" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);
    return re.test(url);
}

/**
 * http://stackoverflow.com/a/12141281
 */
encodeURI = function (url) {
    return url.trim().replace(/ /g,"%20");
};