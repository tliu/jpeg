window.onload = go;

function go() {
    const grid = $("#pixel-grid")
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let px = document.createElement("div");
            px.style.position = "absolute";
            px.style.width = "30px";
            px.style.height = "30px";
            px.style.left = "" + i * 30 + "px";
            px.style.top = "" + j * 30 + "px";
            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);
            px.style.backgroundColor = rgbToHex(r, g, b);
            grid.append(px);
            px.addEventListener("click", function () {
                $(".px-selected").removeClass("px-selected")
                $(px).addClass("px-selected");
                $("#pixel-display").html("(" + r + ", " + g + ", " + b + ")");
            });

        }
    }

    drawRGB("img/waterfall_smaller-1920x1237.rgb", "#rgb-canvas");
    drawGrayscale("img/waterfall_smaller-1920x1237.y", "#y-canvas");
    drawGrayscale("img/waterfall_smaller-1920x1237.cb", "#cb-canvas");
    drawGrayscale("img/waterfall_smaller-1920x1237.cr", "#cr-canvas");
    drawGrayscale("img/waterfall_smaller-1920x1237.y", "#y-full-canvas");
    drawGrayscale("img/waterfall_smaller-960x618.cb.half", "#cb-half-canvas");
    drawGrayscale("img/waterfall_smaller-960x618.cr.half", "#cr-half-canvas");
    drawRGB("img/waterfall_smaller-1920x1237.rgb", "#rgb-full-canvas");
    drawSubsampled("img/waterfall_smaller-1920x1237.y",
                   "img/waterfall_smaller-960x618.cb.half",
                   "img/waterfall_smaller-960x618.cr.half",
                   "#rgb-sub-canvas");

    var zooming = false;
    $(".zoomable").each(function(index) {
        const img = $(this);
        $(this).wrap("<div class='zoom-container' style='width:" + img.width() + "px; height:" + img.height() + "px;'>");
        var p  = $(this).parent()
        $(this).parent().mousemove(function(e) {
            if (zooming) {
                var zoom = $(".slides").css("zoom")
                var parentOffset = p.offset(); 
                var relX = e.pageX -p.offset().left
                var relY = e.pageY - p.offset().top
                var rx = relX / p.width() / zoom;
                var ry = relY / p.height() / zoom;
                img.css("left", -rx * img.width() / (2*zoom));
                img.css("top", -ry * img.height() / (2*zoom));
            }
        });

        $(this).parent().mouseenter(function(e) {
            if (!zooming) {
                img.css("zoom", 2.0);
                zooming = true;
            }
       });

        $(this).parent().mouseleave(function(e) {
            if (zooming) {
                console.log("out")
                img.css("zoom", 1.0);
                img.css("left", 0);
                img.css("top", 0);
                zooming = false;
            }
       });

    });
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

