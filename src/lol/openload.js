function getTracksFromHTML(html) {
    var subtitvarags = html.match(/<track(.*)\/>/g) || [];
    var subtitles = [];
    for (var subtitvarag of subtitvarags) {
        var label = matchNull(subtitvarag, /label="([^"]*)"/);
        var src = matchNull(subtitvarag, /src="([^"]*)"/);
        if (src) {
            subtitles.push({
                kind: "captions",
                label: label,
                src: src,
                default: subtitvarag.indexOf("default") != -1
            });
        }
    }
    return subtitles;
}

function getOpenloadURL(encryptString, key1, key2) {
    var streamUrl = "";
    var hexByteArr = [];
    for (var i = 0; i < 9 * 8; i += 8) {
        hexByteArr.push(parseInt(encryptString.substring(i, i + 8), 16));
    }
    encryptString = encryptString.substring(9 * 8);
    var iterator = 0;
    for (var arrIterator = 0; iterator < encryptString.length; arrIterator++) {
        var maxHex = 64;
        var value = 0;
        var currHex = 255;
        for (var byteIterator = 0; currHex >= maxHex; byteIterator += 6) {
            if (iterator + 1 >= encryptString.length) {
                maxHex = 0x8F;
            }
            currHex = parseInt(encryptString.substring(iterator, iterator + 2), 16);
            value += (currHex & 63) << byteIterator;
            iterator += 2;
        }
        var bytes = value ^ hexByteArr[arrIterator % 9] ^ key1 ^ key2;
        var usedBytes = maxHex * 2 + 127;
        for (var i = 0; i < 4; i++) {
            var urlChar = String.fromCharCode(((bytes & usedBytes) >> 8 * i) - 1);
            if (urlChar != "$") {
                streamUrl += urlChar;
            }
            usedBytes = usedBytes << 8;
        }
    }
    //console.log(streamUrl)
    return streamUrl;
}


function open_load() {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var HTML = xmlhttp.responseText;
            if (xmlhttp.status != 200 || HTML.indexOf("We can't find the file you are looking for. It maybe got devared by the owner or was removed due a copyright violation.") != -1 || HTML.indexOf("The file you are looking for was blocked.") != -1) {
                console.log(xmlhttp.status, HTML);
                throw Error("No Video");
            }
            var thumb = matchNull(HTML, /poster="([^"]*)"/);
            var title = matchNull(HTML, /meta name="og:title" content="([^"]*)"/);
            var sub = getTracksFromHTML(HTML);

            var encryptString = HTML.match(/<p id=[^>]*>([^<]*)<\/p>/);
            if (encryptString == null) {
                encryptString = HTML.match(/<p style="" id=[^>]*>([^<]*)<\/p>/)[1];
            } else {
                encryptString = encryptString[1];
            }

            var keyNum1 = HTML.match(/\_0x45ae41\[\_0x5949\('0xf'\)\]\(_0x30725e,(.*)\),\_1x4bfb36/)[1];
            var keyNum2 = HTML.match(/\_1x4bfb36=(.*);/)[1];

            var keyResult1 = 0;
            var keyResult2 = 0;
            //   console.log(encryptString, keyNum1, keyNum2);
            try {
                var keyNum1_Oct = parseInt(keyNum1.match(/parseInt\('(.*)',8\)/)[1], 8);
                var keyNum1_Sub = parseInt(keyNum1.match(/\)\-([^\+]*)\+/)[1]);
                var keyNum1_Div = parseInt(keyNum1.match(/\/\(([^\-]*)\-/)[1]);
                var keyNum1_Sub2 = parseInt(keyNum1.match(/\+0x4\-([^\)]*)\)/)[1]);
                keyResult1 = (keyNum1_Oct - keyNum1_Sub + 4 - keyNum1_Sub2) / (keyNum1_Div - 8);
                var keyNum2_Oct = parseInt(keyNum2.match(/\('([^']*)',/)[1], 8);
                var keyNum2_Sub = parseInt(keyNum2.substr(keyNum2.indexOf(")-") + 2));
                keyResult2 = keyNum2_Oct - keyNum2_Sub;
                //   console.log(keyNum1, keyNum2);
            } catch (e) {
                //console.error(e.stack);
                throw Error("Key Numbers not parsed!");
            }
            var src = getOpenloadURL(encryptString, keyResult1, keyResult2);
            var url = 'https://lelplayer.blogspot.com/?id=' + btoa('https://' + document.location.host + '/stream/' + src) + '&title=' + btoa(title) + '&sub=' + btoa(sub) + '&thumb=' + btoa(thumb);
            window.location.replace(url);
        }
    }
    xmlhttp.open("GET", window.location.href, false);
    xmlhttp.send();
}