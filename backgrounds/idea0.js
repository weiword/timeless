let t = 0;

function setup() {
  createCanvas(600, 600);
  colorMode(RGB, 255);
  noStroke();
  noiseDetail(4, 0.5);
}

function draw() {
  background(10); // near black for contrast

  let centerX = width / 2;
  let centerY = height / 2;
  let maxDist = dist(0, 0, centerX, centerY);

  let step = 5;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      let dx = x - centerX;
      let dy = y - centerY;
      let distFactor = dist(x, y, centerX, centerY) / maxDist;

      // Ripple effect with noise modulation
      let ripple = sin(distFactor * 20 - t * 2) * 0.5 + 0.5;
      let n = noise(x * 0.005, y * 0.005, t * 0.02 + ripple);

      // Brightness mapped from noise + ripple
      let bright = n * 180 + ripple * 75 + sin(t + distFactor * 8) * 25;
      bright = constrain(bright, 0, 255);

      fill(bright);
      rect(x, y, step, step);
    }
  }

  t += .05;
}
