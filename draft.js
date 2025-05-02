let backgroundType = 'grid'; // 'grid', 'gradient', 'perlin', 'dither', 'flash', 'scrollingText'

let settings = {
  color0: [255, 255, 255],         // Background color
  color1: [0, 0, 0],       // Foreground / dot color
  dotGap: 15,
  lineWeight: 2,
  xScale: 0.015,
  yScale: 0.02,
  animationSpeed: 0,           // Animation speed (also used by flash)
  resolution: 3                // Dither pixel block size
};

let offset = 0;
let frameSeed = 0;
let ditherImg;

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
  if (type === 'grid') {
    drawGridBackground();
  } else if (type === 'gradient') {
    drawGradientBackground();
  } else if (type === 'perlin') {
    drawPerlinDotGrid();
  } else if (type === 'dither') {
    drawDitheredBackground();
  } else if (type === 'flash') {
    drawFlashingBackground();
  } else if (type === 'scrollingText') {
    drawScrollingTextBackground();
  }
}

function drawGridBackground() {
  background(settings.color0);
  stroke(settings.color1);
  strokeWeight(settings.lineWeight);
  noFill();
  frameRate(settings.animationSpeed * 10);

  let t = settings.animationSpeed;

  for (let y = 0; y < height; y += settings.dotGap) {
    beginShape();
    for (let x = 0; x <= width; x += settings.dotGap) {
      let randomOffset = random(-settings.dotGap * 0.5, settings.dotGap * 0.5);
      let yOffset = sin(t + x * 0.05) * randomOffset;
      vertex(x, y + yOffset);
    }
    endShape();
  }

  for (let x = 0; x < width; x += settings.dotGap) {
    beginShape();
    for (let y = 0; y <= height; y += settings.dotGap) {
      let randomOffset = random(-settings.dotGap * 0.5, settings.dotGap * 0.5);
      let xOffset = cos(t + y * 0.05) * randomOffset;
      vertex(x + xOffset, y);
    }
    endShape();
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

function drawPerlinDotGrid() {
  background(settings.color0);
  fill(settings.color1);

  for (let x = settings.dotGap / 2; x < width; x += settings.dotGap) {
    for (let y = settings.dotGap / 2; y < height; y += settings.dotGap) {
      let noiseVal = noise((x + offset * 1000) * settings.xScale,
        (y + offset * 1000) * settings.yScale);
      let size = noiseVal * settings.dotGap;
      rectMode(CENTER);
      rect(x, y, size, size);
    }
  }
}

function drawDitheredBackground() {
  let res = settings.resolution;

  if (!ditherImg || ditherImg.width !== width || ditherImg.height !== height) {
    ditherImg = createImage(width, height);
  }

  const cols = floor(width / res);
  const rows = floor(height / res);
  let data = [];

  randomSeed(frameSeed);

  for (let y = 0; y < rows; y++) {
    data[y] = [];
    for (let x = 0; x < cols; x++) {
      data[y][x] = random(255);
    }
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let old = data[y][x];
      let newVal = old < 128 ? 0 : 255;
      let err = old - newVal;
      data[y][x] = newVal;

      if (x + 1 < cols) data[y][x + 1] += err * 7 / 16;
      if (x - 1 >= 0 && y + 1 < rows) data[y + 1][x - 1] += err * 3 / 16;
      if (y + 1 < rows) data[y + 1][x] += err * 5 / 16;
      if (x + 1 < cols && y + 1 < rows) data[y + 1][x + 1] += err * 1 / 16;
    }
  }

  ditherImg.loadPixels();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let bright = constrain(data[y][x], 0, 255);
      let r = lerp(settings.color0[0], settings.color1[0], bright / 255);
      let g = lerp(settings.color0[1], settings.color1[1], bright / 255);
      let b = lerp(settings.color0[2], settings.color1[2], bright / 255);
      let idxBase = 4 * ((y * res) * ditherImg.width + (x * res));

      for (let dy = 0; dy < res; dy++) {
        for (let dx = 0; dx < res; dx++) {
          let idx = idxBase + 4 * (dy * ditherImg.width + dx);
          ditherImg.pixels[idx] = r;
          ditherImg.pixels[idx + 1] = g;
          ditherImg.pixels[idx + 2] = b;
          ditherImg.pixels[idx + 3] = 255;
        }
      }
    }
  }

  ditherImg.updatePixels();
  image(ditherImg, 0, 0);
  frameSeed += settings.animationSpeed / 10;
}

function drawFlashingBackground() {
  let speed = settings.animationSpeed;
  if (speed <= 0) {
    background(settings.color0);
    return;
  }

  let t = millis() / 50 * speed;
  let inter = (sin(t * TWO_PI) + 1) / 2; // 0 → 1 smoothly
  let c = lerpColor(color(settings.color0), color(settings.color1), inter);
  background(c);
}

function drawScrollingTextBackground() {
  background(settings.color0);

  fill(settings.color1);
  textFont('monospace');

  let fontSize = settings.dotGap;        // Control font size via dotGap
  let rowHeight = fontSize * 1.1;        // Slight padding between rows

  textSize(fontSize);
  textAlign(LEFT, TOP);

  let phrase = "0xE0c407dD52aCb19249B2D80A6D46C10B308D896C";
  let baseSpeed = settings.animationSpeed * 200;

  for (let y = 0; y < height; y += rowHeight) {
    let rowIndex = y / rowHeight;
    let speedOffset = sin(offset * 100 + rowIndex * 10) * 0.5;
    let rowSpeed = baseSpeed + speedOffset * baseSpeed;

    let phraseWidth = textWidth(phrase);
    let repeatCount = ceil(width / phraseWidth) + 2;
    let fullText = phrase.repeat(repeatCount);

    let xOffset = (millis() / 1000 * rowSpeed + rowIndex * 100) % phraseWidth;

    text(fullText, -xOffset, y);
  }
}
