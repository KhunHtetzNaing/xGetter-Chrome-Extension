function stream_fruits() {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var HTML = xmlhttp.responseText;
            if (xmlhttp.status != 200 || HTML.indexOf("We are unable to find the video you're looking for.") != -1) {
                throw Error("No Video!");
            }

            var funcParams = HTML.match(/src:d\('([^']*)',([^\)]*)/);
            var funcStr = funcParams[1];
            var funcInt = parseInt(funcParams[2]);
            var src = "https:" + getStreamURL(funcStr, funcInt);
            var thumb = matchNull(HTML, /poster="([^"]*)"/);
            var title = matchNull(HTML, /meta name="og:title" content="([^"]*)"/);
            var sub = getTracksFromHTML(HTML);
            var url = 'https://lelplayer.blogspot.com/?id=' + btoa(src) + '&title=' + btoa(title) + '&sub=' + btoa(sub) + '&thumb=' + btoa(thumb);
            window.location.replace(url);
        }
    }
    xmlhttp.open("GET", window.location.href, false);
    xmlhttp.send();
}

function getStreamURL(hashCode, intVal) {
    var chars = "=/+9876543210zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA";
    var retVal = '';
    hashCode = hashCode.replace(/[^A-Za-z0-9\+\/\=]/g, '');
    for (var hashIndex = 0; hashIndex < hashCode.length; hashIndex += 4) {
        var hashCharCode_0 = chars.indexOf(hashCode.charAt(hashIndex));
        var hashCharCode_1 = chars.indexOf(hashCode.charAt(hashIndex + 1));
        var hashCharCode_2 = chars.indexOf(hashCode.charAt(hashIndex + 2));
        var hashCharCode_3 = chars.indexOf(hashCode.charAt(hashIndex + 3));
        retVal = retVal + String.fromCharCode(((hashCharCode_0 << 0x2) | (hashCharCode_1 >> 0x4)) ^ intVal);
        if (hashCharCode_2 != 0x40) {
            retVal = retVal + String.fromCharCode(((hashCharCode_1 & 0xf) << 0x4) | (hashCharCode_2 >> 0x2));
        }
        if (hashCharCode_3 != 0x40) {
            retVal = retVal + String.fromCharCode(((hashCharCode_2 & 0x3) << 0x6) | hashCharCode_3);
        }
    }
    return retVal;
}