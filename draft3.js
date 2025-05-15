let backgroundType = 'background';
let dialType = 'digital';
let settings = {
  c0: [0, 0, 0],               
  c1: [255, 255, 255],         
  type: 'day',   
  fontSize: 150,
  targetTime: 52,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  noStroke();
  let now = new Date();
  let targetYear = now.getFullYear() + settings.targetTime;
  settings.targetTime = new Date(now.setFullYear(targetYear, now.getMonth(), now.getDate()));
}

function draw() {
  applyBackground(backgroundType);
  applyDial(dialType);
}

function applyBackground(type) {
  if (type === 'background') background(settings.c0);
}

function applyDial(type) {
  if (type === 'digital') drawDigital();
}

function drawDigital() {
  fill(...settings.c1);

  // Set sizes
  let mainSize = settings.fontSize;
  let labelSize = mainSize * 0.3;

  // Get display text
  let { value: output1, label: output2 } = getDisplayText(settings.type);

  // Measure dimensions
  textSize(mainSize);
  let w1 = textWidth(output1);
  let h1 = mainSize; // approximate height

  textSize(labelSize);
  let w2 = textWidth(output2);
  let h2 = labelSize; // approximate height

  // Total height of both lines plus padding
  let totalHeight = h1 + h2 * 1.2;

  // Center base position
  let cx = width / 2;
  let cy = height / 2 - totalHeight / 2;

  // Draw main output centered
  textSize(mainSize);
  text(output1, cx, cy + h1 / 2);

  // Draw label underneath (also centered)
  textSize(labelSize);
  text(output2, cx + textWidth(output1) * 1.5, cy + h1 + h2 / 2 + h2 * -4.2);
}


function getDisplayText(type) {
  let now = new Date();
  let h = nf(hour(), 2);
  let m = nf(minute(), 2);
  let s = nf(second(), 2);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];

  let currentDay = days[now.getDay()];
  let currentMonth = months[now.getMonth()];
  let dateStr = `${currentMonth} ${day()}, ${year()}`;
  let military = `${h}:${m}:${s}`;
  let standard = `${h}:${m}`;

  switch (type) {
    case 'timeLeft': return { label: '', value: getTimeLeft() }; 
    case 'beat': return { label: 'beat', value: getBeatTime() };
    case 'year': return { label: '', value: now.getFullYear() };
    case 'month': return { label: 12, value: month() };
    case 'week': return { label: 52, value: `${getWeekNumber(now)}`};
    case 'day':  return { label: getTotalDaysInYear(now.getFullYear()), value: getDayOfYear(now) };
    case 'unix': return { label: '', value: Math.floor(now.getTime() / 1000)};
    case 'military': return { label: '', value: military}; 
    case 'date': return { label: '', value: dateStr};
    case 'standard': return { label: '', value: standard};  
    case 'hour': return { label: 24, value: hour()}; 
    case 'minute': return { label: 60, value: minute()}; 
    case 'second': return { label: 60, value: second()}; 
    default: return 'W31w0rd';
  }
}

function getWeekNumber(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date - start + ((start.getDay() + 6) % 7) * 86400000;
  return Math.floor(diff / (7 * 86400000)) + 1;
}

function getBeatTime() {
  let now = new Date();
  let bmtHours = now.getUTCHours() + 1;
  let bmtMinutes = now.getUTCMinutes();
  let bmtSeconds = now.getUTCSeconds();
  let totalSeconds = bmtHours * 3600 + bmtMinutes * 60 + bmtSeconds;
  let beats = totalSeconds / 86.4;
  return `${nf(floor(beats), 3)}`;
}

function getTimeLeft() {
  let now = new Date();
  let diffMs = settings.targetTime - now;

  if (diffMs <= 0) return "Time's up!";

  let days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return `${days}`;
}

function getDayOfYear(date) {
  let start = new Date(date.getFullYear(), 0, 0);
  let diff = date - start;
  let oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getTotalDaysInYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 366 : 365;
}
