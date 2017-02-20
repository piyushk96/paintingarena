var workarea, tempCanvas, ctx, ctxTemp;
var startX, startY, endX, endY;
var paint = false;
var selectedTool = 0;
var paintColor = "rgba(0, 0, 0, 255)";            //black
var eraserColor = 'rgba(255, 255, 255, 255)';     //white
var eraserSize = 15;
var startColor, colorLayer;
var pixelStack = [];
var paintColorArr;
var sprayIntervalId;

$(document).ready(function () {
    workarea = $("#workArea");
    ctx = workarea[0].getContext("2d");   //for jquery refer to raw DOM node of canvas
    tempCanvas = $('#tempCanvas');
    ctxTemp = tempCanvas[0].getContext("2d");
    var w = Math.ceil( $('#canvasContainer').width() ),
        h = Math.ceil( $('#canvasContainer').height() );
    workarea.attr({width : w, height : h});
    tempCanvas.attr({width: w, height: h}).css("top", workarea.position().top);

});

$("canvas").on('mousedown touchstart', function (e) {
    startX = endX = e.offsetX;
    startY = endY = e.offsetY;

    paint = true;
    if(selectedTool == 2) {
        startColor = ctx.getImageData(startX, startY, 1, 1).data;
        paintColorArr = paintColor.substring(paintColor.indexOf('(') + 1, paintColor.lastIndexOf(')')).split(', ');
        ////////start position is same color as paintColor
        if(startColor[0]==paintColorArr[0] && startColor[1]==paintColorArr[1] && startColor[2]==paintColorArr[2] && startColor[3]==paintColorArr[3])
            return;
        colorLayer = ctx.getImageData(0, 0, workarea.width(), workarea.height());
        pixelStack.push([startX, startY]);
        fillColor();
    }
    else if(selectedTool == 3) {       //eraser
        ctx.fillStyle = eraserColor;
        ctx.fillRect(startX, startY, eraserSize, eraserSize);
    }
    else if(selectedTool == 6){
        var imgData = ctx.getImageData(startX, startY, 1, 1);
        paintColor = "rgba(" + imgData.data[0] + "," +  imgData.data[1] + "," + imgData.data[2] + "," + imgData.data[3] + ")";
    }
    else if(selectedTool == 11){
        sprayIntervalId = setInterval(spray, 50);
    }
    else
        ctxTemp.strokeStyle = paintColor;
});

$("canvas").on('mouseup touchend', function () {
    paint = false;
    ctx.drawImage(tempCanvas[0], 0, 0);
    ctxTemp.clearRect(0, 0, tempCanvas.width(), tempCanvas.height());
    clearInterval(sprayIntervalId);
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
            case 3: ctx.fillRect(endX, endY, eraserSize, eraserSize);
                break;
            case 4:
                break;
            case 5:
                break;
            case 7:
                break;
            case 8: ctxTemp.strokeRect(startX, startY, endX - startX, endY - startY);
                break;
            case 9:
                var centerX = (endX - startX)/2 + startX;
                var centerY = (endY - startY)/2 + startY;
                ctxTemp.beginPath();
                ctxTemp.ellipse(centerX, centerY, Math.abs(endX - centerX), Math.abs(endY - centerY), 0, 0, 2 * Math.PI, true);
                ctxTemp.stroke();
                break;
            case 10:
                ctxTemp.beginPath();
                ctxTemp.moveTo(startX, startY);
                ctxTemp.lineTo(endX, endY);
                ctxTemp.stroke();
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

$('.colorBox').on('click tap', function () {
    $('.selectedColorBox').removeClass('selectedColorBox');
    $(this).addClass('selectedColorBox');
});

$('#colorPallete td').on('click tap', function () {
    var colorBoxId = $('.selectedColorBox').children()[0].id;
    var currentColor = $(this).css('background-color');
    currentColor = currentColor.replace('rgb', 'rgba').replace(')', ', 255)');
    console.log(currentColor)
    if (colorBoxId == 'color1')
        paintColor = currentColor;
    else
        eraserColor = currentColor;
    $('#' + colorBoxId).css('background-color', currentColor);
}).on('contextmenu', function () {
        var currentColor = $(this).css('background-color');
        currentColor = currentColor.replace('rgb', 'rgba').replace(')', ', 255)');
        eraserColor = currentColor;
        $('#color2').css('background-color', currentColor);
        return false;
});


function changeCursor() {
    switch (selectedTool){
        case 0: $('#canvasContainer').css('cursor', 'crosshair');
            break;
        case 1: $('#canvasContainer').css('cursor', 'url(./icons/hand.png) 0 20, auto');
            break;
        case 2: $('#canvasContainer').css('cursor', 'url(./icons/paint-bucket.png) 0 20, auto');
            break;
        case 3: $('#canvasContainer').css('cursor', 'url(./icons/eraser.png) 0 17, auto');
            break;
        case 4: $('#canvasContainer').css('cursor', 'url(./icons/pencil.png) 0 32, auto');
            break;
        case 5: $('#canvasContainer').css('cursor', 'url(./icons/paint-brush.png) 0 30, auto');
            break;
        case 6: $('#canvasContainer').css('cursor', 'url(./icons/dropper.png) 0 30, auto');
            break;
        case 7: $('#canvasContainer').css('cursor', 'text');
            break;
        case 8: $('#canvasContainer').css('cursor', 'crosshair');
            break;
        case 9: $('#canvasContainer').css('cursor', 'crosshair');
            break;
        case 10: $('#canvasContainer').css('cursor', 'crosshair');
            break;
        case 11: $('#canvasContainer').css('cursor', 'url(./icons/spray.png) 30 0, auto');
            break;
        default: $('#canvasContainer').css('cursor', 'auto');
    }
}

function fillColor() {
    var canvasWidth = Math.ceil(workarea.width());
    var canvasHeight = Math.ceil(workarea.height());
    while(pixelStack.length)
    {
        var newPos, x, y, pixelPos, reachLeft, reachRight;
        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];

        pixelPos = (y*canvasWidth + x) * 4;
        while(y-- >= 0 && matchStartColor(pixelPos))
        {
            pixelPos -= canvasWidth * 4;
        }
        pixelPos += canvasWidth * 4;
        ++y;
        reachLeft = false;
        reachRight = false;
        while(y++ < canvasHeight-1 && matchStartColor(pixelPos))
        {
            colorPixel(pixelPos);

            if(x > 0)
            {
                if(matchStartColor(pixelPos - 4))
                {
                    if(!reachLeft){
                        pixelStack.push([x - 1, y]);
                        reachLeft = true;
                    }
                }
                else if(reachLeft)
                {
                    reachLeft = false;
                }
            }

            if(x < canvasWidth-1)
            {
                if(matchStartColor(pixelPos + 4))
                {
                    if(!reachRight)
                    {
                        pixelStack.push([x + 1, y]);
                        reachRight = true;
                    }
                }
                else if(reachRight)
                {
                    reachRight = false;
                }
            }
            pixelPos += canvasWidth * 4;
        }
    }
    ctx.putImageData(colorLayer, 0, 0);
}

function matchStartColor(pixelPos)
{
    var r = colorLayer.data[pixelPos];
    var g = colorLayer.data[pixelPos+1];
    var b = colorLayer.data[pixelPos+2];
    var a = colorLayer.data[pixelPos+3];

    return (r == startColor[0] && g == startColor[1] && b == startColor[2] && a == startColor[3]);
}

function colorPixel(pixelPos)
{
    colorLayer.data[pixelPos] = paintColorArr[0];
    colorLayer.data[pixelPos+1] = paintColorArr[1];
    colorLayer.data[pixelPos+2] = paintColorArr[2];
    colorLayer.data[pixelPos+3] = paintColorArr[3];
}

function getRandomOffset() {
    var randomAngle = Math.random() * 360;
    var randomRadius = Math.random() * 15;       //radius
    return {
        x : Math.cos(randomAngle) * randomRadius,
        y : Math.sin(randomAngle) * randomRadius
    }
}

function spray() {
    for(var i=0; i<80; i++){        //density=30
        var offset = getRandomOffset();
        var x = endX + offset.x,
            y = endY + offset.y;
        ctx.fillRect(x, y, 1, 1);
    }
}