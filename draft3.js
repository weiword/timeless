let backgroundType = 'background';
let dialType = 'digital';
let settings = {
  c0: [0, 0, 0],
  c1: [255,255,255],
  type: 'month', // Options: 'military', 'day', 'date', 'month'
  fontSize: 64,

};

let offsetX = 0;
let offsetY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  noStroke();
}

function draw() {
  applyBackground(backgroundType);
  applyDial(dialType);
}

function applyBackground(type) {
  if (type === 'background') {
    drawBackground();
  }
}

function applyDial(type) {
  if (type === 'digital') {
    drawDigital();
  } 
}

function drawBackground() {
  background(settings.c0);
}

function drawDigital() {
  let type = settings.type;
  let fontSize = settings.fontSize;
  let color = settings.c1;
  
  fill(settings.c1);
  textSize(fontSize);

  let h = nf(hour(), 2);
  let m = nf(minute(), 2);
  let s = nf(second(), 2);
  
  // Corrected to get the current day of the week
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let currentDay = days[new Date().getDay()]; // day() gives a number 0-6, so it maps to the days array
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let currentMonth = months[month() - 1];  // Adjusted because month() starts from 1
  let dateStr = currentMonth + ' ' + day() + ', ' + year();  // Format: "May 5, 2024"
  let timeStr = h + ':' + m + ':' + s;

  let output = '';

  // Check type and assign output accordingly
  if (type === 'military') {
    output = timeStr;
  } else if (type === 'day') {
    output = currentDay;
  } else if (type === 'date') {
    output = dateStr;
  } else if (type === 'month') {
    output = currentMonth;
  } else if (type === 'year') {
    output = new Date().getFullYear();
  } else if (type === 'unix') {
    output = Math.floor(new Date().getTime() / 1000);
  }

  // Fallback
  if (!output) {
    output = 'weiword';
  }

  // Display the text
  text(output, width / 2, height / 2);
}

