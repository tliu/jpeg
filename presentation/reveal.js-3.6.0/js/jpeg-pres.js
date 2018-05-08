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
    let yData = drawGrayscale("img/waterfall_smaller-1920x1237.y", "#y-full-canvas");
    let macroblockData = draw64x64("img/waterfall_smaller-1920x1237.y", "#y-macroblock-canvas");
    let macroblockData2 = draw64x64("img/waterfall_smaller-1920x1237.y", "#y-macroblock-canvas2");
    let macroblockData3 = draw64x64("img/waterfall_smaller-1920x1237.y", "#y-macroblock-canvas3");
    let macroblockData4 = draw64x64("img/waterfall_smaller-1920x1237.y", "#y-macroblock-canvas4");
    drawGrayscale("img/waterfall_smaller-960x618.cb.half", "#cb-half-canvas");
    drawGrayscale("img/waterfall_smaller-960x618.cr.half", "#cr-half-canvas");
    drawRGB("img/waterfall_smaller-1920x1237.rgb", "#rgb-full-canvas");
    drawSubsampled("img/waterfall_smaller-1920x1237.y",
                   "img/waterfall_smaller-960x618.cb.half",
                   "img/waterfall_smaller-960x618.cr.half",
                   "#rgb-sub-canvas");


    macroblockData.then(data => {
        window.mData = data;
        $("#y-macroblock-canvas").mousemove(function(e) {
            var img = $(this);
            var zoom = $(".slides").css("zoom");
            var parentOffset = img.offset(); 
            var relX = e.pageX - img.offset().left * zoom;
            var relY = e.pageY - img.offset().top * zoom;
            var rx = relX / (img.width() * zoom);
            var ry = relY / (img.height() * zoom);
            $("#macroblock-pointer").css("left", Math.floor(320 * rx / 40) * 40);
            $("#macroblock-pointer").css("top", Math.floor(320 * ry / 40) * 40);
            var x = Math.floor(rx * 8);
            var y = Math.floor(ry * 8);
            var block = getMacroblock(x, y, window.mData, 64, 64);
            displayMacroblock(block, "#macroblock-display", "", true);

        });
    });


    macroblockData2.then(data => {
        window.mData = data;
        $("#y-macroblock-canvas2").mousemove(function(e) {
            var img = $(this);
            var zoom = $(".slides").css("zoom");
            var parentOffset = img.offset(); 
            var relX = e.pageX - img.offset().left * zoom;
            var relY = e.pageY - img.offset().top * zoom;
            var rx = relX / (img.width() * zoom);
            var ry = relY / (img.height() * zoom);
            $("#macroblock-pointer2").css("left", Math.floor(320 * rx / 40) * 40);
            $("#macroblock-pointer2").css("top", Math.floor(320 * ry / 40) * 40);
            var x = Math.floor(rx * 8);
            var y = Math.floor(ry * 8);
            var block = getMacroblock(x, y, window.mData, 64, 64);
            displayMacroblock(block, "#macroblock-display2", "-smaller", true);
            displayMacroblock(block.map(x => { return x - 127 }), "#macroblock-display-normalized", "-smaller", false);
            displayMacroblock(fromsq(dct2d(tosq(block))).map(x => {return Math.round(x);}), "#macroblock-display-dct", "-smaller", false);

        });
    });


    macroblockData3.then(data => {
        window.mData = data;
        $("#y-macroblock-canvas3").mousemove(function(e) {
            var img = $(this);
            var zoom = $(".slides").css("zoom");
            var parentOffset = img.offset(); 
            var relX = e.pageX - img.offset().left * zoom;
            var relY = e.pageY - img.offset().top * zoom;
            var rx = relX / (img.width() * zoom);
            var ry = relY / (img.height() * zoom);
            $("#macroblock-pointer3").css("left", Math.floor(240 * rx / 30) * 30);
            $("#macroblock-pointer3").css("top", Math.floor(240 * ry / 30) * 30);
            var x = Math.floor(rx * 8);
            var y = Math.floor(ry * 8);
            var block = getMacroblock(x, y, window.mData, 64, 64);
            displayMacroblock(fromsq(dct2d(tosq(block))).map(x => {return Math.round(x);}), "#macroblock-display-dct2", "-smaller", false);
            displayMacroblock(fromsq(quanty(dct2d(tosq(block)))).map(x => {return Math.round(x);}), "#macroblock-display-quant", "-smaller", false);

        });
    });


    macroblockData4.then(data => {
        window.mData = data;
        $("#y-macroblock-canvas4").mousemove(function(e) {
            console.log('why')
            var img = $(this);
            var zoom = $(".slides").css("zoom");
            var parentOffset = img.offset(); 
            var relX = e.pageX - img.offset().left * zoom;
            var relY = e.pageY - img.offset().top * zoom;
            var rx = relX / (img.width() * zoom);
            var ry = relY / (img.height() * zoom);
            $("#macroblock-pointer4").css("left", Math.floor(240 * rx / 30) * 30);
            $("#macroblock-pointer4").css("top", Math.floor(240 * ry / 30) * 30);
            var x = Math.floor(rx * 8);
            var y = Math.floor(ry * 8);
            var block = getMacroblock(x, y, window.mData, 64, 64);
            var q = fromsq(quanty(dct2d(tosq(block)))).map(x => {return Math.round(x);})
            displayMacroblock(q, "#macroblock-display-quant2", "-smaller", false);
            $("#rle").text(rle(q).join(", "));

        });
    });



    yData.then(data => {
        window.yData = data;
        $("#dctpng").click(function(e) {
            var img = $(this);
            var zoom = $(".slides").css("zoom");
            var parentOffset = img.offset(); 
            var relX = e.pageX - img.offset().left * zoom;
            var relY = e.pageY - img.offset().top * zoom;
            var rx = relX / (img.width() * zoom);
            var ry = relY / (img.height() * zoom);
            $("#macroblock-pointer").css("left", Math.floor(320 * rx / 40) * 40);
            $("#macroblock-pointer").css("top", Math.floor(320 * ry / 40) * 40);
            var x = Math.floor(rx * 8);
            var y = Math.floor(ry * 8);
            var block = showCosine(x, y, window.yData, "#dct-canvas");
        });
    });

    var zooming = false;
    $(".zoomable").each(function(index) {
        const img = $(this);
        img.zoomLevel = parseFloat(img.data('zoom')) || 2;
        $(this).wrap("<div class='zoom-container' style='width:" + img.width() + "px; height:" + img.height() + "px;'>");
        var p  = $(this).parent()
        $(this).parent().mousemove(function(e) {
            if (zooming) {
                var zoom = $(".slides").css("zoom");
                var parentOffset = p.offset(); 
                var relX = e.pageX - p.offset().left * zoom 
                var relY = e.pageY - p.offset().top * zoom
                var rx = relX / (p.width() * zoom) - .5;
                var ry = relY / (p.height() * zoom) - .5;
                var rect = img.get(0).getBoundingClientRect();
                img.css("left", (-rx * rect.width) + (rx * p.width())); 
                img.css("top", (-ry * rect.height) + (ry * p.height())); 
            }
        });

        $(this).parent().mouseenter(function(e) {
            if (!zooming) {
                img.css("transform", `scale(${img.zoomLevel})`);
                zooming = true;
            }
       });

        $(this).parent().mouseleave(function(e) {
            if (zooming) {
                img.css("transform", "scale(1.0)");
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


function getMacroblock(x, y, arr, w, h) {
    let block = [];
    let sx = x * 8;
    let sy = y * 8;

    for (var j = 0; j < 8; j++) {
        for (var i = 0; i < 8; i++) {
            var val = arr[(sy + j) * parseInt(w) + sx + i];
            if (val) block.push(val);
            else block.push(0);
        }
    }
    return block;
}



function brightness(r, g, b){
    return (r * 299 + g * 587 + b * 114) / 1000
}

function displayMacroblock(block, selector,cls, colorize) {
    var t = document.getElementById(selector.slice(1));

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var val = block[i + j * 8];
            $(t.rows[j].cells[i]).html(`<div class="macroblock-cell${cls}">${val}</div>`);
            if(colorize) $(t.rows[j].cells[i]).css("background-color", rgbToHex(val, val, val));
            var b = brightness(val, val, val);
            var textColor = 0;
            if (b < 123) {
                textColor = 255;
            }
            var color = rgbToHex(textColor, textColor, textColor);
            if (!colorize) color = "#eee8d5";
            $(t.rows[j].cells[i]).css("color", color);
        }
    }
}

function showCosine(x, y, data, selector) {
    var canvas = $(selector)[0];
    var dctData = dctImg(data);
    dctData = dctData.map(fillBlock(x, y));
    var out = [];
    var bw = data.width / 8;
    var bh = Math.ceil(data.height / 8);
    for (var i = 0; i < bh; i++) {
        var row = [];
        for (var j = 0; j < bw; j++) {
            row.push(dctData.shift());
        }
        for (var x = 0; x < 8; x++) {
            for (var j = 0; j < bw; j++) {
                for (var y = 0; y < 8; y++) {
                    out.push(row[j][y][x]);
                }
            }
        }
    }
    out = out.map(scaleToRgb);
    drawToCanvasGrayscale({width: 1920, height: 1240, data: Uint8Array.from(out)}, canvas);
}

function scaleToRgb(val) {
    return Math.floor(((val + 1024) / 2047) * 255)
}

function fillBlock(x, y) {
    return block => {
        var val = block[x][y];
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                block[i][j] = block[x][y];
            }
        }
        return block;
    }
}

function dctImg(img) {
    var data = img.data;
    var w = img.width;
    var h = img.height;
    var blocks = [];
    for (var i = 0; i < w / 8; i++) {
        for (var j = 0; j < h / 8; j++) {
            var block = getMacroblock(i, j, data, w, h);
            var dct = dct2d(tosq(block));
            blocks.push(dct);
        }
    }
    return blocks;
}

function tosq(macroblock) {
    var out = [];
    for (var i = 0; i < 64; i+=8) {
        out.push(macroblock.slice(i, i+8));
    }
    return out;
}

function fromsq(block) {
    var out = []
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            out.push(block[i][j])
        }
    }
    return out;
}

function quanty(block) {
    var yq = [
        [16 , 11 , 10 , 16 , 24 , 40 , 51 , 61],
        [12 , 12 , 14 , 19 , 26 , 58 , 60 , 55],
        [14 , 13 , 16 , 24 , 40 , 57 , 69 , 56],
        [14 , 17 , 22 , 29 , 51 , 87 , 80 , 62],
        [18 , 22 , 37 , 56 , 68 , 109 , 103 , 77],
        [24 , 35 , 55 , 64 , 81 , 104 , 113 , 92],
        [49 , 64 , 78 , 87 , 103 , 121 , 120 , 101],
        [72 , 92 , 95 , 98 , 112 , 100 , 103 , 99]]

    for (var i = 0; i < 8; i++){
        for (var j = 0; j < 8; j++){
            block[i][j] = block[i][j] / yq[i][j];
        }
    }
    return block;
}

function rle(block) {
    var zig = [1,2,9,17,10,3,4,11,18,25,33,26,19,12,6,7,13,20,27,34,41,49,42,35,28,21,14,7,8,15,22,29,36,43,50,57,58,51,44,37,30,23,16,24,31,38,45,52,59,60,53,46,39,32,40,47,54,61,62,55,48,56,63,64];
    var out = []
    for (var i = 0; i < zig.length; i++) {
        out.push(block[zig[i] - 1]);
    }
    return out;
}
