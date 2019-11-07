window.onload = function() {
    var faviconSize = 32;
    var gen = 8;
    var favicon = document.getElementById('favicon');

    // Full size
    var canvas = document.createElement('canvas');
    canvas.width = faviconSize;
    canvas.height = faviconSize;

    var context = canvas.getContext('2d');
    context.scale(faviconSize/gen, faviconSize/gen);
    context.imageSmoothingEnabled = false;

    // Generate
    var tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = gen;
    tmpCanvas.height = gen;
    var tmpContext = tmpCanvas.getContext('2d');
    var imgData = tmpContext.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);

    function randomColor() {
        var palette = [
            [0x24, 0x24, 0x24],
            [0x5c, 0x56, 0x53],
            [0xff, 0x77, 0x33],
            [0x7f, 0xe4, 0x20],
            [0x36, 0xa3, 0xd9],
            [0xa3, 0x7a, 0xcc],
            [0xff, 0x33, 0x33],
            [0xff, 0xff, 0xff]];
        var index = Math.floor(Math.random() * palette.length);
        return palette[index];
    }

    function genPixel(y, x) {
        var left = (y * imgData.width + x) * 4;
        var right = ((y + 1) * imgData.width - x - 1) * 4;
        var color = randomColor();

        // rgb
        for (var i = 0; i < 3; i+=1) {
            imgData.data[left+i] = color[i];
            imgData.data[right+i] = color[i];
        }
        // apha
        imgData.data[left + 3] = 255;
        imgData.data[right + 3] = 255;
    }
    // Gen favicon
    for (var y = 0; y < imgData.height; y += 1) {
        for (var x = 0; x < imgData.width / 2; x += 1) {
            genPixel(y, x);
        }
    }
    tmpContext.putImageData(imgData, 0, 0);
    context.drawImage(tmpCanvas, 0, 0);

    // Replace favicon
    favicon.href = canvas.toDataURL('image/png');
};