! function(t) {
    var e = {};

    function n(o) {
        if (e[o]) return e[o].exports;
        var r = e[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return t[o].call(r.exports, r, r.exports, n), r.l = !0, r.exports
    }
    n.m = t, n.c = e, n.d = function(t, e, o) {
        n.o(t, e) || Object.defineProperty(t, e, {
            configurable: !1,
            enumerable: !0,
            get: o
        })
    }, n.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t.default
        } : function() {
            return t
        };
        return n.d(e, "a", e), e
    }, n.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, n.p = "", n(n.s = 2)
}({
    2: function(t, e) {
        const n = document.body.getElementsByTagName("video")[0];
        n.removeAttribute("autoplay"), n.setAttribute("crossorigin", "anonymous"), chrome.runtime.sendMessage({
            __ga: !0,
            category: "usage",
            action: "visit-video",
            label: location.href
        }), chrome.runtime.sendMessage({
            action: "VISIT_CDN",
            url: document.location.href
        });
        const o = t => `https://openload.co/f/${t}`,
            r = t => t.match(/ +\w+="[^"]+"/g).filter(t => !!t).reduce((t, e) => {
                try {
                    let [n, o] = e.split("=");
                    return n = n.trim(), o = o.slice(1, o.length - 2), Object.assign(t, {
                        [n]: o
                    })
                } catch (e) {
                    return t
                }
            }, {});
        !async function() {
            const t = function() {
                    try {
                        const [t, e] = location.href.match(/\/([^/]+)\/[^/]+$/);
                        return e
                    } catch (t) {
                        return null
                    }
                }(),
                e = o(t);
            console.info("Retrieving video subtitle");
            try {
                const t = (await window.fetch(e).then(t => t.text())).match(/<track kind="captions"[^>]+\/>/g).map(t => r(t)).filter(t => void 0 !== t.src);
                if (0 === t.length) return void console.info("This video have no subtitle");
                t.forEach(t => (function(t) {
                    const e = document.createElement("track");
                    Object.assign(e, t, {
                        kind: "captions"
                    }), n.appendChild(e), e.addEventListener("load", function() {
                        console.log("track loaded")
                    })
                })(t)), setTimeout(() => n.textTracks[0].mode = "showing", 100)
            } catch (t) {
                console.info("error while retrieving subtitles", t)
            }
        }()
    }
});
