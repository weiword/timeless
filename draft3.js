let backgroundType = 'background';
let dialType = 'digital';
let settings = {
  c0: [0, 0, 0],               
  c1: [255, 255, 255],         
  type: 'date',   
  fontSize: 64,
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
  let output1 = getDisplayText(settings.type).value;
  let output2 = getDisplayText(settings.type).label;
  textSize(settings.fontSize);
  text(output1, width / 2, height / 2 - settings.fontSize * 0.6);
  textSize(settings.fontSize * 0.5); 
  text(output2, width / 2, height / 2 + settings.fontSize * 0.05);
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
    case 'timeLeft': return { label: 'days', value: getTimeLeft() }; 
    case 'beat': return { label: 'beat', value: getBeatTime() };
    case 'year': return { label: 'A.D.', value: now.getFullYear() };
    case 'month': return { label: '12', value: month() };
    case 'week': return { label: '52', value: `${getWeekNumber(now)}`};
    case 'day': return { label: '365', value: day()}; 
    case 'unix': return { label: '', value: Math.floor(now.getTime() / 1000)};
    case 'military': return { label: '', value: military}; 
    case 'date': return { label: '', value: dateStr};
    case 'standard': return { label: '', value: standard};  
    case 'hour': return { label: '24', value: hour()}; 
    case 'minute': return { label: '60', value: minute()}; 
    case 'second': return { label: '60', value: second()}; 
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
