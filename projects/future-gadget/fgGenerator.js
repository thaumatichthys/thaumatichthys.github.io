
const canvas = document.getElementById("output");
const ctx = canvas.getContext("2d");

const mainTextField = document.getElementById("fgText");
const verTextField = document.getElementById("version");
const editionTextField = document.getElementById("edition");

ctx.font = "27px custom-font";
setTimeout(
    function () {
        const dummy = ctx.measureText("testtesttest1");
        mainTextField.value = "FG204";
        verTextField.value = "ver2.31";
        editionTextField.value = "2nd EDITION";
        generate();
    }, 100
)

var generated = false;
var size = 1;

function generate() {
    if (!(document.fonts.check("27px custom-font") && document.fonts.check("80px custom-font"))) {
        return;
    }
    var mainText = mainTextField.value;
    var verText = verTextField.value;
    var editionText = editionTextField.value;

    const SIZE_MULTIPLIER = size;

    const OUTLINE_WIDTH = document.getElementById("lineWidth").value * SIZE_MULTIPLIER;
    const TEXT_TO_BORDER = document.getElementById("margin").value * SIZE_MULTIPLIER;
    const TEXT_HEIGHT = 60 * SIZE_MULTIPLIER;
    const CORNER_RADIUS = 10 * SIZE_MULTIPLIER;

    const SMALL_TEXT_HEIGHT = 20 * SIZE_MULTIPLIER;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "aliceblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${27 * SIZE_MULTIPLIER}px custom-font`;

    var smallTextWidth;
    var verMetrics = ctx.measureText(verText);
    var editionMetrics = ctx.measureText(editionText);

    if (verMetrics.width > editionMetrics.width) {
        smallTextWidth = verMetrics.width;                
    }
    else {
        smallTextWidth = editionMetrics.width;
    }
    ctx.fillStyle = "black";
    ctx.font = `${80 * SIZE_MULTIPLIER}px custom-font`;
    var metrics = ctx.measureText(mainText);

    canvas.width = metrics.width + 2 * (TEXT_TO_BORDER + OUTLINE_WIDTH) + smallTextWidth + TEXT_TO_BORDER;
    canvas.height = TEXT_HEIGHT + 2 * (TEXT_TO_BORDER + OUTLINE_WIDTH);

    ctx.beginPath();
    ctx.roundRect(
        0, 
        0,
        metrics.width + 2 * (TEXT_TO_BORDER + OUTLINE_WIDTH) + smallTextWidth + TEXT_TO_BORDER, 
        TEXT_HEIGHT + 2 * (TEXT_TO_BORDER + OUTLINE_WIDTH),
        CORNER_RADIUS);
    
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillRect(
        OUTLINE_WIDTH, 
        OUTLINE_WIDTH,
        metrics.width + 2 * TEXT_TO_BORDER, 
        TEXT_HEIGHT + 2 * TEXT_TO_BORDER);

    ctx.fillStyle = "black";
    ctx.font = `${80 * SIZE_MULTIPLIER}px custom-font`;
    ctx.fillText(mainText, TEXT_TO_BORDER + OUTLINE_WIDTH, TEXT_HEIGHT + TEXT_TO_BORDER + OUTLINE_WIDTH);
    
    ctx.font =  `${27 * SIZE_MULTIPLIER}px custom-font`;
    ctx.fillStyle = "white";

    ctx.fillText(editionText, 2 * TEXT_TO_BORDER + metrics.width + 2 * OUTLINE_WIDTH, 
    SMALL_TEXT_HEIGHT + TEXT_TO_BORDER);
    
    ctx.fillText(verText, 2 * TEXT_TO_BORDER + metrics.width + 2 * OUTLINE_WIDTH, 
    2 * SMALL_TEXT_HEIGHT + 2 * TEXT_TO_BORDER);
    generated = true;
}

function download() {
    size = 10;
    generate();
    size = 1

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = "label.png";
    link.click();
    generate();
}