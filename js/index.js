var canvas, tempCanvas, ctx, ctxTemp;
var startX, startY, endX, endY;
var paint = false;
$(document).ready(function () {
    canvas = $("#workArea");
    ctx = canvas[0].getContext("2d");   //for jquery refer to raw DOM node of canvas
    tempCanvas = $('#tempCanvas');
    ctxTemp = tempCanvas[0].getContext("2d");

});

$("canvas").on('mousedown', function (e) {
    startX = endX = e.offsetX;
    startY = endY = e.offsetY;

    paint = true;
});

$("canvas").on('mouseup', function () {
    paint = false;
    ctx.drawImage(tempCanvas[0], 0, 0);
    ctxTemp.clearRect(0, 0, tempCanvas.width(), tempCanvas.height());
});

$("canvas").on('mousemove', function(e) {
    if(paint) {
        ctxTemp.clearRect(0, 0, tempCanvas.width(), tempCanvas.height());
        endX = e.offsetX;
        endY = e.offsetY;

        ctxTemp.strokeRect(startX, startY, endX - startX, endY - startY);
    }
});