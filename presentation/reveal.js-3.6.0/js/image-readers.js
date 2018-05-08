var images = {};

function readFile(path) {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest();
        req.open("GET", path);
        req.responseType = "arraybuffer";
        req.onload = function (e)
        {
            var arrayBuffer = req.response;
            if (arrayBuffer) {
                var byteArray = new Uint8Array(arrayBuffer);
                resolve(byteArray);
            }
        }
        req.send(null);
    });
}

function loadPixels(path) {
    return new Promise((resolve, reject) => {
        if (images[path]) {
            resolve(images[path]);
        } else {
            var dim = path.split("-")[1].split(".")[0].split("x")
            var img = {
                width: dim[0],
                height: dim[1]
            };
            readFile(path).then(result => {
               img.data = result;
               images["path"] = img;
               img.size = result.length;
               resolve(img);
            });
        }
    });
}

// Read 1byte per px
function drawGrayscale(path, selector) {
    return new Promise((resolve, reject) => {
        loadPixels(path).then(src => {
            var canvas = $(selector)[0];
            drawToCanvasGrayscale(src, canvas);
            resolve(src);
        });
    });
}

function drawToCanvasGrayscale(src, canvas) {
    canvas.width = src.width;
    canvas.height = src.height;
    var ctx = canvas.getContext("2d"); 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var imgData = ctx.createImageData(src.width, src.height);
    var source_index = 0;
    for (var i = 0; i < imgData.data.length; i++) {
        if (i % 4 == 3) {
            imgData.data[i] = 255;
            source_index++;
            continue;
        }
        imgData.data[i] = src.data[source_index];
    }
    ctx.putImageData(imgData, 0, 0);
}

// Read 3 bytes per px
function drawRGB(path, selector) {
    loadPixels(path).then(src => {
        var canvas = $(selector)[0];
        canvas.width = src.width;
        canvas.height = src.height;
        var ctx = canvas.getContext("2d"); 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var imgData = ctx.createImageData(src.width, src.height);
        var source_index = 0;
        for (var i = 0; i < imgData.data.length; i++) {
            if (i % 4 == 3) {
                imgData.data[i] = 255;
                continue;
            }
            imgData.data[i] = src.data[source_index];
            source_index++;
        }
        ctx.putImageData(imgData, 0, 0);
    });
}

function drawSubsampled(y_path, cb_path, cr_path, selector) {
    loadPixels(y_path).then(y_src => {
        loadPixels(cb_path).then(cb_src => {
            loadPixels(cr_path).then(cr_src => {
                var canvas = $(selector)[0];
                canvas.width = y_src.width;
                canvas.height = y_src.height;
                var ctx = canvas.getContext("2d"); 
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                var imgData = ctx.createImageData(y_src.width, y_src.height);
                var combinedSrc = new Uint8Array(y_src.data.length * 3);
                var doubledCb = new Uint8Array(cb_src.data.length * 2);
                var doubledCr = new Uint8Array(cr_src.data.length * 2);
                var expandedCb = new Uint8Array(y_src.data.length);
                var expandedCr = new Uint8Array(y_src.data.length);

                let index = 0;
                // double up on width
                for (var i = 0; i < cb_src.data.length; i++) {
                    doubledCb[index] = cb_src.data[i];
                    doubledCb[index + 1] = cb_src.data[i];
                    doubledCr[index] = cr_src.data[i];
                    doubledCr[index + 1] = cr_src.data[i];
                    index+=2;
                }

                const y_w = parseInt(y_src.width);
                const y_h = parseInt(y_src.height);
                var e_cb = []
                var e_cr = []
                // double up on height
                for (var begin = 0; begin < y_src.data.length / 2; begin+=y_w) {
                    for (var x = 0; x < 2; x++) {
                        for (var i = begin; i < begin + y_w; i++) {
                            e_cb.push(doubledCb[i]);
                            e_cr.push(doubledCr[i]);
                        }
                    }
                }
                for (var i = 0; i < y_w; i++) {

                    e_cb.push(128);
                    e_cr.push(128);
                }
                expandedCb = Uint8Array.from(e_cb);
                expandedCr = Uint8Array.from(e_cr);
                index = 0;
                for (var i = 0; i < combinedSrc.length; i+=3) {
                    let rgb = ycbcrToRGB(y_src.data[index], expandedCb[index], expandedCr[index]);
                    combinedSrc[i] = rgb[0];
                    combinedSrc[i + 1] = rgb[1];
                    combinedSrc[i + 2] = rgb[2];
                    index++;
                }

                var source_index = 0;
                for (var i = 0; i < imgData.data.length; i++) {
                    if (i % 4 == 3) {
                        imgData.data[i] = 255;
                        continue;
                    }
                    imgData.data[i] = combinedSrc[source_index];
                    source_index++;
                }
                ctx.putImageData(imgData, 0, 0);
            });
        });
    });
}

function ycbcrToRGB(y,cb,cr) {
    let r = y                        + (1.403 * (cr - 128));
    let g = y - (0.344 * (cb - 128)) - (0.714 * (cr - 128));
    let b = y + (1.772 * (cb - 128));
    return [clamp(r),clamp(g),clamp(b)];
}

function clamp(x) {
    return Math.min(Math.max(x, 0), 255);
}



// Read 1byte per px
function draw64x64(path, selector) {
    return new Promise((resolve, reject) => {
        loadPixels(path).then(src => {
            var canvas = $(selector)[0];
            canvas.width = 64;
            canvas.height = 64;
            var ctx = canvas.getContext("2d"); 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var imgData = ctx.createImageData(64, 64);
            var source_index = 0;

            var byteArray = new Uint8Array(64 * 64);
            var ind = 0;
            for (var i = 0; i < 64; i++) {
                for (var j = 0; j < 64; j++) {
                    byteArray[ind] = src.data[(src.width * i) + j];
                    ind++;
                }
            }
            for (var i = 0; i < imgData.data.length; i++) {
                if (i % 4 == 3) {
                    imgData.data[i] = 255;
                    source_index++;
                    continue;
                }
                imgData.data[i] = byteArray[source_index];
            }
            ctx.putImageData(imgData, 0, 0);
            resolve(byteArray);
        });
    })
}

