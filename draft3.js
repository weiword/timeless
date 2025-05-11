let backgroundType = 'diamondFlash';
let dialType = 'radial';
let settings = {
  //background
  c0: [255, 255, 255],
  c1: [0, 0, 50],
  c2: [0, 147, 166],
  c3: [0, 229, 130],
  gridSize: 25, 
  unicodeChar: '✤',
  unicodeOff: 1,
  charSize: 15,
  scrollSpeed: 0,
  direction: 0,
  flashSpeed: 0,
  //dial
  dial: ['◈','I','I','I','I','I','i','I','I','I','I','I'],
  dialSize: 120,
};

let offsetX = 0;
let offsetY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(settings.charSize);
  noStroke();

  // Adjust grid size to make square tiles that fit perfectly in the canvas
  let cols = floor(windowWidth / settings.gridSize);
  let rows = floor(windowHeight / settings.gridSize);
  let gridW = windowWidth / cols;
  let gridH = windowHeight / rows;
  settings.gridSize = min(gridW, gridH);
}

function draw() {
  applyBackground(backgroundType);
  applyDial(dialType); // This was missing or incorrect
}


function applyBackground(type) {
  if (type === 'diamondFlash') {
    drawDiamondFlashBackground();
  }
}
function applyDial(type) {
  if (type === 'radial') {
    drawRadialDial();
  }
}

function drawDiamondFlashBackground() {
  background(0);
 textSize(settings.charSize);
  let dir = getDirectionVector(settings.direction);
  offsetX += dir.x * settings.scrollSpeed;
  offsetY += dir.y * settings.scrollSpeed;

  offsetX = ((offsetX % settings.gridSize) + settings.gridSize) % settings.gridSize;
  offsetY = ((offsetY % settings.gridSize) + settings.gridSize) % settings.gridSize;

  let cols = ceil(width / settings.gridSize) + 2;
  let rows = ceil(height / settings.gridSize) + 2;

  let baseCol = floor(frameCount * dir.x * settings.scrollSpeed / settings.gridSize);
  let baseRow = floor(frameCount * dir.y * settings.scrollSpeed / settings.gridSize);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = col * settings.gridSize - offsetX;
      let y = row * settings.gridSize - offsetY;

      let worldCol = baseCol + col;
      let worldRow = baseRow + row;

      let useColor1 = (worldCol + worldRow) % 2 === 0;
      fill(useColor1 ? settings.c2 : settings.c3);
      rect(x, y, settings.gridSize, settings.gridSize);
    }
  }

  let flashPhase = floor(frameCount / settings.flashSpeed) % 2 === 0;

  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      let x = col * settings.gridSize - offsetX;
      let y = row * settings.gridSize - offsetY;

      let worldCol = baseCol + col;
      let worldRow = baseRow + row;

      let index = ((worldCol + worldRow) % 8 + 8) % 8;
      let bright = index === 0 || index === 3 || index === 5 || index === 6;
      let useFlash = flashPhase ? bright : !bright;
      fill(useFlash ? settings.c0 : settings.c1);
      text(settings.unicodeChar, x, y + settings.unicodeOff);
    }
  }
}

function getDirectionVector(dir) {
  switch (dir) {
    case 0: return createVector(0, 1);     // top → down
    case 1: return createVector(-1, 1);    // top-right → bottom-left
    case 2: return createVector(-1, 0);    // right → left
    case 3: return createVector(-1, -1);   // bottom-right → top-left
    case 4: return createVector(0, -1);    // bottom → top
    case 5: return createVector(1, -1);    // bottom-left → top-right
    case 6: return createVector(1, 0);     // left → right
    case 7: return createVector(1, 1);     // top-left → bottom-right
    default: return createVector(0, 0);    // no movement
  }
}


function drawRadialDial() {
  textSize(settings.dialSize);
  textAlign(CENTER, CENTER);
  let cx = width / 2;
  let cy = height / 2;
  let numChars = settings.dial.length;
  let radius = settings.dialSize * 2;

  for (let i = 0; i < numChars; i++) {
    let angle = TWO_PI * i / numChars - HALF_PI;
    let x = cx + cos(angle) * radius;
    let y = cy + sin(angle) * radius;

    push();
    translate(x, y);
    rotate(angle + HALF_PI); // Rotate so the character faces toward the center
    // Shadow
    fill(settings.c1);
    text(settings.dial[i], 2, 2);
    // Main text
    fill(settings.c0);
    text(settings.dial[i], 0, 0);
    pop();
  }
}
