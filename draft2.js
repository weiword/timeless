let backgroundType = 'checkerDiamonds'; // change this to 'checkerDiamonds' or 'hermannGrid'

let settings = {
  c0: [255, 255, 255] ,         
  c1: [50, 50, 50],       
  c2: [145, 0, 50],
  c3: [255, 109, 109],
  animationSpeed: 0, // ensure this is set to avoid undefined
};

let offset = 0;
let frameSeed = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  pixelDensity(1);
  noSmooth();
  noStroke();
  ditherImg = createImage(width, height);
}

function draw() {
  offset += settings.animationSpeed / 1000;
  applyBackground(backgroundType);
}

function applyBackground(type) {
  if (type === 'checkerDiamonds') {
    drawCheckerDiamondBackground();
  } else if (type === 'hermannGrid') {
    drawHermannGridBackground();
  }
}

function drawCheckerDiamondBackground() {
  let cols = floor(width / 52);
  let rows = floor(height / 51);
  let rectSize = width / cols;

  for (let i = 0; i <= cols; i++) {
    for (let j = 0; j <= rows; j++) {
      let x = i * rectSize;
      let y = j * rectSize;
      let index = (i + j) % 8;
      fill(index === 0 || index === 3 || index === 5 || index === 6 ? settings.c0 : settings.c1);
      noStroke();
      beginShape();
      vertex(x, y - rectSize / 4);
      vertex(x + rectSize / 4, y);
      vertex(x, y + rectSize / 4);
      vertex(x - rectSize / 4, y);
      endShape(CLOSE);
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * rectSize;
      let y = j * rectSize;
      fill((i + j) % 2 === 0 ? settings.c2 : settings.c3);
      rect(x, y, rectSize, rectSize, 10);
    }
  }
}

function drawHermannGridBackground() {
  background(settings.c0);
  let gridSize = 60;
  let lineWidth = 10;
  let circleSize = 15;

  fill(settings.c1);
  noStroke();

  // vertical lines
  for (let x = 0; x < width; x += gridSize) {
    rect(x - lineWidth / 2, 0, lineWidth, height);
  }

  // horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    rect(0, y - lineWidth / 2, width, lineWidth);
  }

  // draw faint gray circles at intersections
  fill(settings.c2); // semi-transparent dark gray
  noStroke();
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      ellipse(x, y, circleSize);
    }
  }
}
