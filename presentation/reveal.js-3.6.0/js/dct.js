Array.matrix = function(numrows, numcols, initial){
   var arr = [];
   for (var i = 0; i < numrows; ++i){
      var columns = [];
      for (var j = 0; j < numcols; ++j){
         columns[j] = initial;
      }
      arr[i] = columns;
    }
    return arr;
}

// takes a 2d, 8x8 block
function dct2d(block) {
   var out = Array.matrix(8, 8, 0);
   for (var v = 0; v < 8; v++) {
       for (var u = 0; u < 8; u++) {
           var sum = sumFrom(block, u, v);
           out[v][u] = .25 * a(u) * a(v) * sum;
       }
   }
   return out;
}

function sumFrom(block, u, v) {
    var sum = 0;
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            sum += inner(block[y][x], x, y, u, v);
        }
    }
    return sum;
}

function inner(pxy, x, y, u, v) {
    return pxy * Math.cos( ((2 * x + 1) * u * Math.PI) / 16 ) * Math.cos( ((2 * y + 1) * v * Math.PI) / 16);
}

function a(x) {
    if (x == 0) {
        return 1 / Math.sqrt(2);
    } else {
        return 1;
    }
}

function testDCT() {
    var g =[[-76, -73, -67, -62, -58, -67, -64, -55],
            [-65, -69, -73, -38, -19, -43, -59, -56],
            [-66, -69, -60, -15,  16, -24, -62, -55],
            [-65, -70, -57,  -6,  26, -22, -58, -59],
            [-61, -67, -60, -24,  -2, -40, -60, -58],
            [-49, -63, -68, -58, -51, -60, -70, -53],
            [-43, -57, -64, -69, -73, -67, -63, -45],
            [-41, -49, -59, -60, -63, -52, -50, -34]]
    console.log(dct2d(g));
    // compare output to https://wikimedia.org/api/rest_v1/media/math/render/svg/46ee57df2a309dd59e0a10c9ab83e8b86d712e3e
}
