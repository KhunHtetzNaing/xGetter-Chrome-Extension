function mp4_upload() {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }


    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var HTML = xmlhttp.responseText;
            if (xmlhttp.status != 200 || HTML.indexOf("File Not Found") != -1) {
                throw Error("No Video!");
            }
                var test = unPack(HTML.match(/eval(.*)/)[0]),
                    src = test.match(/player.src\("(.*)"/)[1],
                    thumb = test.match(/player.poster\("(.*)"/)[1],
                    url = 'https://lelplayer.blogspot.com/?id=' + btoa(src) + '&title=' + btoa("") + '&sub=' + btoa("") + '&thumb=' + btoa(thumb);
                window.location.replace(url);
        }
    }

    var str = window.location.href;

    if (str.indexOf('embed-') == -1) {
        var regex = /com\/([^']*)/,
            id = str.match(regex)[1],
            res = getBaseUrl(str) + 'embed-' + id + '.html';
        str = res;
    }

    xmlhttp.open("GET", str, false);
    xmlhttp.send();
}


