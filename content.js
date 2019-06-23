var main_url = window.location.href,
    openload = /https?:\/\/(www\.)?(openload|oload)\.[^\/,^\.]{2,}\/(embed|f)\/.+/i,
    stream = /https?:\/\/(www\.)?(streamango|fruitstreams|streamcherry|fruitadblock|fruithosts)\.[^\/,^\.]{2,}\/(f|embed)\/.+/i,
    mp4upload = /https?:\/\/(www\.)?(mp4upload)\.[^\/,^\.]{2,}\/.+/i,
    sendvid = /https?:\/\/(www\.)?(sendvid)\.[^\/,^\.]{2,}\/.+/i,
    vidcloud = /https?:\/\/(www\.)?(vidcloud|vcstream|loadvid)\.[^\/,^\.]{2,}\/(v|embed)\/.+/i


if (openload.test(main_url)) {
    open_load();
} else if (stream.test(main_url)) {
    stream_fruits();
} else if (mp4upload.test(main_url)) {
    mp4_upload();
} else if(sendvid.test(main_url)){
    send_vid();
}

function getBaseUrl(link) {
    var pathArray = link.split('/');
    var protocol = pathArray[0];
    var host = pathArray[2];
    return protocol + '//' + host + '/';
}

function matchNull(str, regexp, index) {
    return (str.match(regexp) || [])[index || 1] || "";
}