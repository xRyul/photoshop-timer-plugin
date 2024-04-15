const { app } = require("photoshop");

let startTime;
let timerInterval;
let currentDocument;
let stepsInterval;
let toolUsage = {};

function startTimer() {
  // Clear any existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  startTime = new Date();

  // Set up a new timer to update every second
  timerInterval = setInterval(showOpenTime, 1000);
}

function showOpenTime() {
  const now = new Date();
  const diffMs = now - startTime;
  
  // Calculate the time difference based on actual times
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHrs = Math.floor(diffMins / 60);
  
  // Update the timer text
  document.getElementById("timer").innerHTML = `${pad(diffHrs)}:${pad(diffMins % 60)}:${pad(diffSecs % 60)}`;
}


// Helper function to pad single digit numbers with a leading zero
function pad(num) {
  return num.toString().padStart(2, '0');
}


function startStepsCounter() {
  // Clear any existing steps counter
  if (stepsInterval) {
    clearInterval(stepsInterval);
  }

  // Set up a new counter to update every second
  stepsInterval = setInterval(showStepsCount, 1000);
}

function showStepsCount() {
  // Get the number of history states
  const stepsCount = app.activeDocument.historyStates.length;
  
  // Update the steps counter text
  document.getElementById("steps").innerHTML = `Total steps: ${stepsCount}`;
}

function updateToolUsage() {
  // Reset the tool usage
  toolUsage = {};

  // Iterate over all history states
  for (let i = 0; i < app.activeDocument.historyStates.length; i++) {
    // Get the name of the tool used in this history state
    const toolName = app.activeDocument.historyStates[i].name;

    // Update the tool usage count
    if (toolUsage[toolName]) {
      toolUsage[toolName]++;
    } else {
      toolUsage[toolName] = 1;
    }
  }

  // Update the tool usage text
  let toolUsageText = '';
  for (const toolName in toolUsage) {
    toolUsageText += `${toolName}: ${toolUsage[toolName]}<br>`;
  }
  document.getElementById("toolUsage").innerHTML = toolUsageText;
}

// Start the timer when there is an open document
if (app.activeDocument) {
  currentDocument = app.activeDocument;
  startTimer();
  startStepsCounter();
  updateToolUsage();
  setInterval(updateToolUsage, 1000);
}

// Check every second if the active document has changed
setInterval(() => {
  if (app.activeDocument !== currentDocument) {
    // Reset the timer
    currentDocument = app.activeDocument;
    toolUsage = {} // reset tool usage
    if (currentDocument) {
      startTimer();
      document.getElementById("timer").style.cssText = "font-size: 2em;";
      startStepsCounter();
      updateToolUsage();
    } else {
      clearInterval(timerInterval);
      clearInterval(stepsInterval);
      timerInterval = null;
      stepsInterval = null;
      document.getElementById("timer").style.cssText = "font-size: 1.3em;";
      document.getElementById("timer").innerHTML = "No active document";
      document.getElementById("steps").innerHTML = "";
      document.getElementById("toolUsage").innerHTML = "";
    }
  } else if (app.activeDocument && app.activeDocument.historyStates.length > Object.values(toolUsage).reduce((a, b) => a + b, 0)) {
    // If the active document has not changed but a new step has been taken, update tool usage
    updateToolUsage();
  }
}, 1000);