let config = {
  symbols: ['░', '▒'],  // Symbols to alternate between
  raysCount: 99,
  maxLength: 800,
  step: 75,
  baseFontSize: 99,
  font: 'sans-serif',
  waveSpeed: 0.00,
  spinSpeed: 0, // rotation speed in radians per frame (set 0 to disable)
  ringPulseSpeed: 0.1, // NEW: speed of ripple pulsing
  c0: [255, 255, 255],    // background (blue)
  c1: [0, 0, 0],    // fill (red)
};

let wavePhase = 0;
let pulsePhase = 0; // NEW: for ring pulse animation
let symbolStates = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textFont(config.font);
  fill(config.c1);

  for (let i = 0; i < config.raysCount; i++) {
    symbolStates[i] = [];
    for (let d = config.step; d <= config.maxLength; d += config.step) {
      symbolStates[i].push({
        currentSymbolIndex: 0,
        lastOffset: 0,
        rotation: 0
      });
    }
  }
}

function draw() {
  background(config.c0);
  translate(width / 2, height / 2);

  if (config.waveSpeed !== 0) {
    wavePhase += config.waveSpeed;
  }
  if (config.ringPulseSpeed !== 0) {
    pulsePhase += config.ringPulseSpeed;
  }

  for (let i = 0; i < config.raysCount; i++) {
    let angle = TWO_PI * i / config.raysCount;

    for (let j = 0, dist = config.step; dist <= config.maxLength; dist += config.step, j++) {
      let offset = 0;
      let state = symbolStates[i][j];

      if (config.waveSpeed !== 0) {
        offset = 15 * sin(wavePhase + dist * 0.1 + i * 0.5);
        if ((offset > 0 && state.lastOffset < 0) || (offset < 0 && state.lastOffset > 0)) {
          state.currentSymbolIndex = 1 - state.currentSymbolIndex;
        }
        state.lastOffset = offset;
      } else {
        state.lastOffset = 0;
      }

      let x = cos(angle) * (dist + offset);
      let y = sin(angle) * (dist + offset);

      // Rotation
      if (config.spinSpeed !== 0) {
        let direction = (j % 2 === 0) ? 1 : -1;
        state.rotation += direction * config.spinSpeed;
      } else {
        state.rotation = 0;
      }

      // NEW: Pulsing text size per ring
      let pulseOffset = pulsePhase + j * 0.5; // offset each ring
      let pulse = 1 + 0.5 * sin(pulseOffset);  // ranges from 0.5 to 1.5
      pulse = constrain(pulse, 0.5, 2);        // cap it between 0.5x and 2x

      push();
      translate(x, y);
      rotate(state.rotation);
      textSize(config.baseFontSize * pulse); // Apply animated size
      text(config.symbols[state.currentSymbolIndex], 0, 0);
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
