let settings = {
  c0: [255, 255, 255],         
  c1: [50, 50, 50],       
  c2: [145, 0, 50],
  c3: [255, 109, 109],
  gridSize: 60,
  unicodeChar: '✦',
  charSize: 20,
  scrollSpeed: 0,
  direction: 3 // 0 to 7
};

let offsetX = 0;
let offsetY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(settings.charSize);
  noStroke();
}

function draw() {
  background(220);

  // Scroll vector
  let dir = getDirectionVector(settings.direction);
  offsetX += dir.x * settings.scrollSpeed;
  offsetY += dir.y * settings.scrollSpeed;

  // Keep offsets positive using modulo
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

  // Draw characters
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      let x = col * settings.gridSize - offsetX;
      let y = row * settings.gridSize - offsetY;

      let worldCol = baseCol + col;
      let worldRow = baseRow + row;

      let index = ((worldCol + worldRow) % 8 + 8) % 8;
      fill(index === 0 || index === 3 || index === 5 || index === 6 ? settings.c0 : settings.c1);
      text(settings.unicodeChar, x, y + 2);
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
