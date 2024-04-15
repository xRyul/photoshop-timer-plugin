const { app } = require("photoshop");

let startTime;
let currentDocument;
let toolUsage = {};

let lastToolUsageText = '';
let lastStepsCount = 0;
let lastTimerText = '';

function startTimer() {
  startTime = new Date();
}

function showOpenTime() {
  const now = new Date();
  const diffMs = now - startTime;
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHrs = Math.floor(diffMins / 60);
  
  const timerText = `${pad(diffHrs)}:${pad(diffMins % 60)}:${pad(diffSecs % 60)}`;
  if (timerText !== lastTimerText) {
    document.getElementById("timer").innerHTML = timerText;
    lastTimerText = timerText;
  }
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

function showStepsCount() {
  const stepsCount = app.activeDocument.historyStates.length;
  if (stepsCount !== lastStepsCount) {
    document.getElementById("steps").innerHTML = `Total steps: ${stepsCount}`;
    lastStepsCount = stepsCount;
  }
}

function updateToolUsage() {
  toolUsage = {};
  for (let i = 0; i < app.activeDocument.historyStates.length; i++) {
    const toolName = app.activeDocument.historyStates[i].name;
    if (toolUsage[toolName]) {
      toolUsage[toolName]++;
    } else {
      toolUsage[toolName] = 1;
    }
  }

  let toolUsageText = '';
  for (const toolName in toolUsage) {
    toolUsageText += `${toolName}: ${toolUsage[toolName]}<br>`;
  }
  if (toolUsageText !== lastToolUsageText) {
    document.getElementById("toolUsage").innerHTML = toolUsageText;
    lastToolUsageText = toolUsageText;
  }
}

function updateUI() {
  showOpenTime();
  showStepsCount();
  updateToolUsage();
  requestAnimationFrame(updateUI);
}

if (app.activeDocument) {
  currentDocument = app.activeDocument;
  startTimer();
  updateUI();
}

setInterval(() => {
  if (app.activeDocument !== currentDocument) {
    currentDocument = app.activeDocument;
    toolUsage = {}
    if (currentDocument) {
      startTimer();
      document.getElementById("timer").style.cssText = "font-size: 2em;";
      updateUI();
    } else {
      document.getElementById("timer").style.cssText = "font-size: 1.3em;";
      document.getElementById("timer").innerHTML = "No active document";
      document.getElementById("steps").innerHTML = "";
      document.getElementById("toolUsage").innerHTML = "";
    }
  }
}, 1000);
