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
            console.log(r);
            px.addEventListener("click", function () {
                $(".px-selected").removeClass("px-selected")
                $(px).addClass("px-selected");
                $("#pixel-display").html("(" + r + ", " + g + ", " + b + ")");
            });

        }
    }
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
