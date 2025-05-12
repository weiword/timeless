let backgroundType = 'background';
let dialType = 'digital';

let settings = {
  c0: [0, 0, 0],               
  c1: [255, 255, 255],         
  type: 'beat',                
  fontSize: 64,
  targetTime: 8,
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
  textSize(settings.fontSize);

  let output1 = getDisplayText(settings.type);
  text(output1, width / 2, height / 2 - settings.fontSize * 0.6);

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
  let timeStr = `${h}:${m}:${s}`;

  switch (type) {
    case 'timeLeft': return getTimeLeft();
    case 'beat': return getBeatTime();
    case 'year': return now.getFullYear();
    case 'month': return month();
    case 'week': return `${getWeekNumber(now)}`;
    case 'day': return currentDay;
    case 'unix': return Math.floor(now.getTime() / 1000);
    case 'military': return timeStr;
    case 'date': return dateStr;
    case 'hour': return hour(); 
    case 'minute': return minute();
    case 'second': return second();
    case 'ampm': return get12HourTime();
    case 'tai': return getTAI();
    
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
  return `@${nf(floor(beats), 3)}`;
}

function get12HourTime() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = nf(now.getMinutes(), 2);
  let seconds = nf(now.getSeconds(), 2);

  let period = hours >= 12 ? '1' : '0';
  hours = hours % 12;
  if (hours === 0) hours = 12; 
  return `${period}`;
}
function getTimeLeft() {
  let now = new Date();
  let diffMs = settings.targetTime - now;

  if (diffMs <= 0) return "Time's up!";

  let seconds = floor(diffMs / 1000) % 60;
  let minutes = floor(diffMs / (1000 * 60)) % 60;
  let hours = floor(diffMs / (1000 * 60 * 60)) % 24;
  let days = floor(diffMs / (1000 * 60 * 60 * 24)) % 365;
  let years = floor(diffMs / (1000 * 60 * 60 * 24 * 365));

  return `${years}y ${days}d ${seconds}s`;
}

function getTAI() {
  // Get the current UTC time in milliseconds
  let now = new Date();
  let utcTime = now.getTime();

  // Add leap seconds to approximate TAI
  let taiTime = utcTime + (leapSeconds * 1000);  // Add leap seconds (converted to milliseconds)

  // Convert TAI to a human-readable format
  let taiDate = new Date(taiTime);
  return taiDate.toISOString();  // TAI approximated as UTC for display
}
