
const canvas = document.querySelector('.canvas'),
toolBtns = document.querySelectorAll('.tool'),
fillColor = document.querySelector('#fill-color'),
sizeSlider = document.querySelector('#size-slider'),
colorsBtns = document.querySelectorAll('.colors .option'),
colorPicker = document.querySelector('#color-picker'),
clearCanvas = document.querySelector('.clear-canvas'),
saveImg = document.querySelector('.save-img'),
ctx = canvas.getContext('2d');

// Global variables width default value
let prevMouseX, prevMouseY, snapshop,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor= '#000';

const setCanvasBacground = () => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
}

// When data charged all 
window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth; //
    canvas.height = canvas.offsetHeight; //
    setCanvasBacground();
})

// LINE
const drawLine = (e) => {

    ctx.beginPath(); // Creating new path to draw Triangle
    ctx.moveTo(prevMouseX, prevMouseY); // Moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // Creating first line according to the mouse pointer
    ctx.stroke()

}
// ---------------------------------------------------------------------------------------

// SQUARE
const drawSquare = (e) => {
    // ctx.strokeRect(e.offsetX, e.offsetY)
    if(!fillColor.checked){
        // create circle according to the mouse pointer
        return ctx.strokeRect( e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY );
    }
    ctx.fillRect( e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY );
}
// ---------------------------------------------------------------------------------------

// DIAMOND

const diamond = (e) => {

    ctx.beginPath();
    ctx.moveTo((prevMouseX + e.offsetX) / 2, prevMouseY);
    ctx.lineTo(e.offsetX, (prevMouseY + e.offsetY) / 2);
    ctx.lineTo((prevMouseX + e.offsetX) / 2, e.offsetY);
    ctx.lineTo(prevMouseX, (prevMouseY + e.offsetY) / 2);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
    
}

// ---------------------------------------------------------------------------------------

// TRIANGLE

const drawTriangle = (e) => {
    ctx.beginPath(); // Creating new path to draw Triangle
    ctx.moveTo(prevMouseX, prevMouseY); // Moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // Creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // Create bottom line of triangle
    ctx.closePath(); // Closing path of a triangle so the third line draw automatically
    //If Ternario
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border circle

}

// ---------------------------------------------------------------------------------------

// CIRCLE

const drawCircle = (e) => {

    ctx.beginPath(); // Create a new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt( Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2) )
    //                              Size circle[2]
    ctx.arc( prevMouseX, prevMouseY, radius, 0, 2 * Math.PI ); // Creating a circle according to the mouse  pointer
    //If Ternario
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}

//----------------------------------------------------------------------------------------

const startDraw = (e) => {
    isDrawing = true
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath(); //
    ctx.lineWidth = brushWidth; //

    ctx.strokeStyle = selectedColor; // Passing selectedColor as stroke style
    ctx.fillStyle = selectedColor; // Passing selectedColor as fill style

    // Copying canvas data & passing as snapshot value .. this avoids dragging the image
    snapshop = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return; // If Drawing is false return for here
    ctx.putImageData(snapshop, 0, 0); // adding copied canvas data on to this canvas

    if( selectedTool === 'brush' || selectedTool === 'eraser' ){
        // is selected  tool is eraser then set strokeStyle to white
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY) // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filing line with color

    } else if ( selectedTool === 'line') {
        drawLine(e)

    } else if ( selectedTool === 'square') {
        drawSquare(e)

    } else if ( selectedTool === 'diamond') {
        diamond(e)

    } else if ( selectedTool === 'triangle') {
        drawTriangle(e)

    }else if ( selectedTool === 'circle') {
        drawCircle(e)

    }
    
}
// FOREACH document.querySelectorAll('.tool')
toolBtns.forEach( btn => {
    btn.addEventListener("click", () => {
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add('active');
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});

// FOREACH document.querySelectorAll('.colors .option')
colorsBtns.forEach( color => {
    color.addEventListener('click', () => {
        //console.log(color)
        //console.log(color.id)
        document.querySelector('.options .selected').classList.remove('selected');
        color.classList.add('selected');
        // console.log(window.getComputedStyle(color).getPropertyValue('background-color'));
        // pasing selected $color background-color as selectorColor value
        selectedColor = window.getComputedStyle(color).getPropertyValue('background-color');
    });
});

// Events
sizeSlider.addEventListener("change", () => {
    brushWidth = sizeSlider.value; // passing slider value as brushSize
});

colorPicker.addEventListener('change', () => {
    // pasing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})

clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear Whole Canvas
    setCanvasBacground();
});

saveImg.addEventListener('click', () => {
    const link = document.createElement("a") // Creating <a> </a> element
    link.download = `${Date.now()}.jpg`; // passing current data as link download value
    link.href = canvas.toDataURL(); // passing CanvasData as link href value
    link.click(); // Clicking link to download image
});

canvas.addEventListener('mousedown', startDraw ) //
canvas.addEventListener('mousemove', drawing ) //
canvas.addEventListener('mouseup', () => { isDrawing = false} ) //
