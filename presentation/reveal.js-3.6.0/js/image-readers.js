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
                source_index++;
                continue;
            }
            imgData.data[i] = src.data[source_index];
        }
        ctx.putImageData(imgData, 0, 0);

    });
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
