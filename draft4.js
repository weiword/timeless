let config = {
  symbols: ['|'],
  raysCount: 45,
  maxIterations: 50,
  dialSpacing: 35,
  step: 25,
  baseFontSize: 199,
  dialFontSize: 199,
  dialBorder: 5,
  font: 'sans-serif',
  pulseSpeed: 0.05,
  c0: [255, 0, 0],   
  c1: [0, 255, 255],         
  c2: [255, 255, 255],   
  c3: [255, 255, 255],   
  animationMode: 'pulse',
  dialSymbols: ['◍','◍','◍','◍','◍','◍','◍','◍','◍','◍','◍','◍']
};

let animationPhase = 0;
let glyphGraphic;
let cosVals = [], sinVals = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(45);
  textAlign(CENTER, CENTER);
  textFont(config.font);
  noStroke();

  for (let i = 0; i < config.raysCount; i++) {
    let angle = TWO_PI * i / config.raysCount;
    cosVals[i] = cos(angle);
    sinVals[i] = sin(angle);
  }

  glyphGraphic = createGraphics(200, 200);
  glyphGraphic.textAlign(CENTER, CENTER);
  glyphGraphic.textFont(config.font);
  glyphGraphic.noStroke();
  glyphGraphic.textSize(config.baseFontSize);
  glyphGraphic.fill(0);
  glyphGraphic.text(config.symbols[0], glyphGraphic.width / 2, glyphGraphic.height / 2);
}

function draw() {
  background(config.c0);
  translate(width / 2, height / 2);

  animationPhase += config.pulseSpeed;

  for (let i = 0; i < config.raysCount; i++) {
    let cosI = cosVals[i];
    let sinI = sinVals[i];

    for (let j = 0; j < config.maxIterations; j++) {
      let dist = (j + 1) * config.step;

      let scaleFactor = 1;
      if (config.animationMode === 'pulse') {
        scaleFactor = 1 + 0.5 * sin(animationPhase + j * 0.5);
        scaleFactor = constrain(scaleFactor, 0.5, 2);
        if (scaleFactor * config.baseFontSize < 10) continue;
      }

      let rotationAngle = 0;
      if (config.animationMode === 'rotate') {
        let direction = (j % 2 === 0) ? 1 : -1;
        let falloff = 1 / (1 + j * 0.2);
        rotationAngle = animationPhase * direction * falloff;
      }

      fill(j % 2 === 0 ? config.c1 : 100); // alternate colors for glyphs

      push();
      translate(cosI * dist, sinI * dist);
      if (config.animationMode === 'rotate') rotate(rotationAngle);
      if (config.animationMode === 'pulse') scale(scaleFactor);
      imageMode(CENTER);
      image(glyphGraphic, 0, 0);
      pop();
    }
  }

  // Draw white circle with border
  let dialRadius = 15 * config.dialSpacing * 0.65;
  let circleRadius = dialRadius * 1.2;
  stroke(config.c3);
  strokeWeight(config.dialBorder); // Adjust border thickness
  fill(0, 0, 0, 150);  // white with opacity
  ellipse(0, 0, circleRadius * 2, circleRadius * 2);

  drawWatchDial();
}

function drawWatchDial() {
  let dialRadius = 15 * config.dialSpacing * 0.65;
  textSize(config.dialFontSize * 0.5);
  noStroke();
  fill(config.c2);

  for (let i = 0; i < 12; i++) {
    let angle = -HALF_PI + TWO_PI * i / 12;
    let x = cos(angle) * dialRadius;
    let y = sin(angle) * dialRadius;

    push();
    translate(x, y);
    rotate(angle + HALF_PI);  // Rotate so bottom faces center
    text(config.dialSymbols[i], 0, 0);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

