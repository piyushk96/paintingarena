var canvas, tempCanvas, ctx, ctxTemp;
var startX, startY, endX, endY;
var paint = false;
var selectedTool = 0;
var paintColor = 'black';
var eraserColor = 'white';
var eraserSize = 15;

$(document).ready(function () {
    canvas = $("#workArea");
    ctx = canvas[0].getContext("2d");   //for jquery refer to raw DOM node of canvas
    tempCanvas = $('#tempCanvas');
    ctxTemp = tempCanvas[0].getContext("2d");

});

$("canvas").on('mousedown touchstart', function (e) {
    startX = endX = e.offsetX;
    startY = endY = e.offsetY;

    paint = true;
    if(selectedTool == 3) {       //eraser
        ctx.fillStyle = eraserColor;
        ctx.fillRect(startX, startY, eraserSize, eraserSize);
    }
    else
        ctxTemp.strokeStyle = paintColor;
});

$("canvas").on('mouseup touchend', function () {
    paint = false;
    ctx.drawImage(tempCanvas[0], 0, 0);
    ctxTemp.clearRect(0, 0, tempCanvas.width(), tempCanvas.height());
});

$("canvas").on('mousemove touchmove', function(e) {
    if(paint) {
        ctxTemp.clearRect(0, 0, tempCanvas.width(), tempCanvas.height());
        endX = e.offsetX;
        endY = e.offsetY;

        switch (selectedTool){
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3: ctx.fillRect(endX, endY, eraserSize, eraserSize);
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
            case 8: ctxTemp.strokeRect(startX, startY, endX - startX, endY - startY);
                break;
            case 9:
                break;
            case 10:
                break;
        }
    }
});

$(".tool").on('click tap', function () {
    $('.selectedTool').removeClass('selectedTool');
    $(this).addClass('selectedTool');
    selectedTool = $('#toolBox td').index( $(this) );
    changeCursor();
});

function changeCursor() {
    if($.inArray(selectedTool, [0, 8, 9, 10]) != -1)
        $('#canvasContainer').css('cursor', 'crosshair');
    // else if(selectedTool == 3){
    //     $('#canvasContainer').awesomeCursor('square-o');
    // }
    else
        $('#canvasContainer').css('cursor', 'auto');
}