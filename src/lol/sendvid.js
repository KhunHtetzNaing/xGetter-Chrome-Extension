function send_vid() {
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

            console.log(HTML);
                var src = HTML.match(/video_source = "(.*?)"/)[1],
                    thumb = HTML.match(/video_poster = "(.*?)"/)[1],
                    title = HTML.match(/title: "(.*?)"/)[1],
                    url = 'https://lelplayer.blogspot.com/?id=' + btoa(src) + '&title=' + btoa(title) + '&sub=' + btoa("") + '&thumb=' + btoa(thumb);
                    window.location.replace(url);
        }
    }

    xmlhttp.open("GET", main_url, false);
    xmlhttp.send();
}


