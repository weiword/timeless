let backgroundType = 'perlin'; // 'grid', 'gradient', 'perlin'

let settings = {
  color0: [0, 266, 255], // Background color
  color1: [0, 30, 120],  // Dot color
  dotGap: 20,            // Space between dots
  xScale: 0.015,
  yScale: 0.02,
  offsetSpeed: 0.001,    // Animation speed
};

let offset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  noStroke();
}

function draw() {
  offset += settings.offsetSpeed;
  applyBackground(backgroundType);
}

function applyBackground(type) {
  if (type === 'grid') {
    drawGridBackground();
  } else if (type === 'gradient') {
    drawGradientBackground();
  } else if (type === 'perlin') {
    drawPerlinDotGrid();
  }
}

// Perlin Noise Grid with Squares
function drawPerlinDotGrid() {
  background(settings.color0);
  fill(settings.color1);

  let gap = settings.dotGap;

  for (let x = gap / 2; x < width; x += gap) {
    for (let y = gap / 2; y < height; y += gap) {
      let noiseVal = noise((x + offset * 1000) * settings.xScale, 
                           (y + offset * 1000) * settings.yScale);
      let size = noiseVal * gap;
      rectMode(CENTER);
      rect(x, y, size, size);
    }
  }
}

function drawGridBackground() {
  background(settings.color0); 
  stroke(settings.color1);
  strokeWeight(1);
  for (let y = 0; y < height; y += settings.dotGap) {
    line(0, y, width, y);
  }
  for (let x = 0; x < width; x += settings.dotGap) {
    line(x, 0, x, height);
  }
}

function drawGradientBackground() {
  let maxDist = dist(0, 0, width / 2, height / 2);
  for (let r = 0; r < maxDist; r++) {
    let inter = map(r, 0, maxDist, 0, 1);
    let c = lerpColor(color(settings.color0), color(settings.color1), inter);
    noFill();
    stroke(c);
    ellipse(width / 2, height / 2, r * 2, r * 2);
  }
}
