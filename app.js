// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

const defaultRoadmap = [
  {
    id: "m1", month: "June 2026",
    tech: { title: "Core JS Foundation", desc: "DOM Manipulation, ES6+, Array methods. To-Do & Calculator.", isCompleted: false },
    maths: { title: "Algebra & Sets", desc: "Set Theory, Logarithms, Quadratic Equations.", isCompleted: false }
  },
  {
    id: "m2", month: "July 2026",
    tech: { title: "React Entry", desc: "Components, Props, Hooks (useState, useEffect). Expense Tracker.", isCompleted: false },
    maths: { title: "Trigonometry", desc: "Heights & Distances, Inverse Trigonometry.", isCompleted: false }
  },
  {
    id: "m3", month: "August 2026",
    tech: { title: "Advanced React", desc: "Context API, RTK, APIs, Tailwind CSS.", isCompleted: false },
    maths: { title: "Coordinate Geometry", desc: "Straight Lines, Circles, Parabola, Ellipse.", isCompleted: false }
  },
  {
    id: "m4", month: "September 2026",
    tech: { title: "Next.js Shift", desc: "App Router, Server/Client components, Routing, SaaS building.", isCompleted: false },
    maths: { title: "Differential Calculus", desc: "Limits, Continuity, Differentiability, AOD.", isCompleted: false }
  },
  {
    id: "m5", month: "October 2026",
    tech: { title: "AI Integration", desc: "Gemini/OpenAI APIs, NextAuth, DBs.", isCompleted: false },
    maths: { title: "Integral Calculus", desc: "Indefinite & Definite Integrals, Differential Eq.", isCompleted: false }
  },
  {
    id: "m6", month: "Nov - Dec 2026",
    tech: { title: "Portfolio Building", desc: "Deploy Vercel projects, apply for jobs.", isCompleted: false },
    maths: { title: "Vectors & Stats", desc: "Vectors, Statistics/Probability, PYQs.", isCompleted: false }
  }
];

// App State
let appData = {
  logs: [],
  roadmapDetailed: [],
  mockTests: []
};

let mockChartInstance = null;

// DOM Elements
const logForm = document.getElementById('logForm');
const logDateInput = document.getElementById('logDate');
const logCategoryInput = document.getElementById('logCategory');
const logTaskInput = document.getElementById('logTask');
const logsList = document.getElementById('logsList');

const roadmapTimeline = document.getElementById('roadmapTimeline');
const techProgressBar = document.getElementById('techProgressBar');
const mathsProgressBar = document.getElementById('mathsProgressBar');
const techProgressText = document.getElementById('techProgressText');
const mathsProgressText = document.getElementById('mathsProgressText');

const mockTestForm = document.getElementById('mockTestForm');
const mockDateInput = document.getElementById('mockDate');
const mockScoreInput = document.getElementById('mockScore');

// Initialization function
function initApp() {
  const today = new Date().toISOString().split('T')[0];
  logDateInput.value = today;
  mockDateInput.value = today;

  loadData();
  
  // Migrate from Phase 1 data schema if needed
  if (!appData.roadmapDetailed || appData.roadmapDetailed.length === 0) {
    appData.roadmapDetailed = JSON.parse(JSON.stringify(defaultRoadmap));
    saveData();
  }

  renderLogs();
  renderRoadmap();
  updateProgressBars();
  initChart();

  // Event Listeners
  logForm.addEventListener('submit', handleLogSubmit);
  mockTestForm.addEventListener('submit', handleMockTestSubmit);
  
  // Initialize Notifications
  initNotifications();
}

function loadData() {
  const storedData = localStorage.getItem('SyncTrack_Data');
  if (storedData) {
    appData = JSON.parse(storedData);
  } else {
    appData.roadmapDetailed = JSON.parse(JSON.stringify(defaultRoadmap));
    saveData();
  }
}

function saveData() {
  localStorage.setItem('SyncTrack_Data', JSON.stringify(appData));
}

// --- Daily Logger ---
function handleLogSubmit(e) {
  e.preventDefault();
  const newLog = {
    id: Date.now().toString(),
    date: logDateInput.value,
    category: logCategoryInput.value,
    task: logTaskInput.value,
    isDone: false
  };
  appData.logs.unshift(newLog);
  saveData();
  logCategoryInput.value = '';
  logTaskInput.value = '';
  renderLogs();
}

function toggleLogStatus(id) {
  const logIndex = appData.logs.findIndex(log => log.id === id);
  if (logIndex !== -1) {
    appData.logs[logIndex].isDone = !appData.logs[logIndex].isDone;
    saveData();
    renderLogs();
  }
}

function deleteLog(id) {
  appData.logs = appData.logs.filter(log => log.id !== id);
  saveData();
  renderLogs();
}

function renderLogs() {
  logsList.innerHTML = '';
  if (appData.logs.length === 0) {
    logsList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No logs yet. Start tracking your progress!</p>';
    return;
  }
  appData.logs.forEach(log => {
    const li = document.createElement('li');
    li.className = `log-item glass-card ${log.isDone ? 'completed' : ''}`;
    let catClass = '';
    if (log.category === 'Frontend') catClass = 'cat-frontend';
    else if (log.category === 'NIMCET Maths') catClass = 'cat-maths';
    else if (log.category === 'Logical Reasoning') catClass = 'cat-logic';

    li.innerHTML = `
      <div class="log-content">
        <label class="checkbox-wrapper">
          <input type="checkbox" ${log.isDone ? 'checked' : ''} onchange="toggleLogStatus('${log.id}')">
          <span class="checkmark"></span>
        </label>
        <div class="log-meta">
          <span class="log-category ${catClass}">${log.category}</span>
          <span class="log-task">${log.task}</span>
        </div>
      </div>
      <div class="log-actions" style="font-size: 0.8rem; color: var(--text-secondary);">
        ${formatDate(log.date)}
        <button onclick="deleteLog('${log.id}')" style="background:none; border:none; color:var(--danger); cursor:pointer; margin-left:1rem;">Delete</button>
      </div>
    `;
    logsList.appendChild(li);
  });
}

// --- Roadmap & Progress ---
function renderRoadmap() {
  roadmapTimeline.innerHTML = '';
  appData.roadmapDetailed.forEach((monthData, index) => {
    const div = document.createElement('div');
    div.className = 'roadmap-month-card';
    
    div.innerHTML = `
      <div class="roadmap-month-header">${monthData.month}</div>
      
      <!-- Tech Item -->
      <div class="roadmap-item ${monthData.tech.isCompleted ? 'checked' : ''}">
        <label class="checkbox-wrapper">
          <input type="checkbox" ${monthData.tech.isCompleted ? 'checked' : ''} 
            onchange="toggleRoadmapItem(${index}, 'tech')">
          <span class="checkmark"></span>
          <div class="roadmap-label-text">
            <span class="roadmap-label-title">[Frontend] ${monthData.tech.title}</span>
            <span class="roadmap-label-sub">${monthData.tech.desc}</span>
          </div>
        </label>
      </div>

      <!-- Maths Item -->
      <div class="roadmap-item ${monthData.maths.isCompleted ? 'checked' : ''}">
        <label class="checkbox-wrapper">
          <input type="checkbox" ${monthData.maths.isCompleted ? 'checked' : ''} 
            onchange="toggleRoadmapItem(${index}, 'maths')">
          <span class="checkmark"></span>
          <div class="roadmap-label-text">
            <span class="roadmap-label-title">[Maths] ${monthData.maths.title}</span>
            <span class="roadmap-label-sub">${monthData.maths.desc}</span>
          </div>
        </label>
      </div>
    `;
    roadmapTimeline.appendChild(div);
  });
}

function toggleRoadmapItem(monthIndex, type) {
  appData.roadmapDetailed[monthIndex][type].isCompleted = !appData.roadmapDetailed[monthIndex][type].isCompleted;
  saveData();
  renderRoadmap();
  updateProgressBars();
}

function updateProgressBars() {
  const totalMonths = appData.roadmapDetailed.length;
  let techCompleted = 0;
  let mathsCompleted = 0;

  appData.roadmapDetailed.forEach(month => {
    if (month.tech.isCompleted) techCompleted++;
    if (month.maths.isCompleted) mathsCompleted++;
  });

  const techPercent = Math.round((techCompleted / totalMonths) * 100);
  const mathsPercent = Math.round((mathsCompleted / totalMonths) * 100);

  // Update DOM width
  setTimeout(() => {
    techProgressBar.style.width = `${techPercent}%`;
    mathsProgressBar.style.width = `${mathsPercent}%`;
  }, 100);

  techProgressText.innerText = `${techPercent}%`;
  mathsProgressText.innerText = `${mathsPercent}%`;
}

// --- Mock Tests Analytics ---
function handleMockTestSubmit(e) {
  e.preventDefault();
  const score = parseInt(mockScoreInput.value, 10);
  if (isNaN(score)) return;

  const newTest = {
    id: Date.now().toString(),
    date: mockDateInput.value,
    score: score
  };

  // Keep tests sorted by date
  appData.mockTests.push(newTest);
  appData.mockTests.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveData();

  mockScoreInput.value = '';
  updateChart();
}

function initChart() {
  const ctx = document.getElementById('mockTestChart').getContext('2d');
  
  // Set Chart.js defaults for dark theme
  Chart.defaults.color = '#cbd5e1';
  Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

  mockChartInstance = new Chart(ctx, {
    type: 'line',
    data: getChartData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleColor: '#8b5cf6',
          bodyColor: '#f8fafc',
          padding: 12,
          displayColors: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 1000 // Assuming NIMCET max marks is 1000, adjust if needed
        }
      }
    }
  });
}

function updateChart() {
  if (mockChartInstance) {
    mockChartInstance.data = getChartData();
    mockChartInstance.update();
  }
}

function getChartData() {
  const labels = appData.mockTests.map(test => formatDate(test.date));
  const data = appData.mockTests.map(test => test.score);

  return {
    labels: labels.length > 0 ? labels : ['No Data'],
    datasets: [{
      label: 'Score',
      data: data.length > 0 ? data : [0],
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderWidth: 3,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#fff',
      pointRadius: 5,
      pointHoverRadius: 7,
      fill: true,
      tension: 0.4
    }]
  };
}

// Helpers
function formatDate(dateString) {
  const options = { month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// --- Notifications & Timetable Alerts ---
const enableAlertsBtn = document.getElementById('enableAlertsBtn');
let alertsEnabled = false;

const dailySchedule = [
  { time: "06:30", message: "Wake up & Freshen up!" },
  { time: "07:00", message: "Time for NIMCET Maths (Deep Focus)!" },
  { time: "10:00", message: "College Time / Practice LR & Vocab!" },
  { time: "13:30", message: "Lunch, Travel & Rest Time!" },
  { time: "14:30", message: "Time for Frontend Dev (JS/React)!" },
  { time: "17:30", message: "Break time! Go for a walk." },
  { time: "18:30", message: "Time for Logical Reasoning & English!" },
  { time: "20:00", message: "Dinner & Family Time!" },
  { time: "21:00", message: "Tech Projects / Startup Work!" },
  { time: "23:00", message: "Revision, Planning & Sleep!" }
];

function initNotifications() {
  if (enableAlertsBtn) {
    enableAlertsBtn.addEventListener('click', requestNotificationPermission);
  }
  
  if ("Notification" in window && Notification.permission === 'granted') {
    alertsEnabled = true;
    if(enableAlertsBtn) {
      enableAlertsBtn.innerText = "🔔 Alerts Active";
      enableAlertsBtn.style.background = "var(--success)";
    }
  }

  // Check schedule every minute
  setInterval(checkSchedule, 60000);
  
  // Run once immediately to catch if we load exactly on the minute
  checkSchedule();
}

function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications.");
    return;
  }
  
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      alertsEnabled = true;
      enableAlertsBtn.innerText = "🔔 Alerts Active";
      enableAlertsBtn.style.background = "var(--success)";
      new Notification("SyncTrack Alerts Enabled", {
        body: "You will now receive reminders for your timetable blocks."
      });
    }
  });
}

function checkSchedule() {
  if (!alertsEnabled) return;
  
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  // We use localStorage to ensure we don't alert multiple times within the same minute if page is reloaded
  const lastAlertTime = localStorage.getItem('SyncTrack_LastAlert');
  
  if (lastAlertTime === currentTime) return;

  const currentTask = dailySchedule.find(item => item.time === currentTime);
  
  if (currentTask) {
    // 1. Desktop Notification (if browser is active)
    new Notification("SyncTrack Schedule", {
      body: currentTask.message
    });
    
    // 2. Mobile Notification via ntfy.sh
    // Change 'synctrack_sahil_alerts' if you want a more private/secret topic name
    fetch('https://ntfy.sh/synctrack_sahil_alerts', {
      method: 'POST',
      body: currentTask.message,
      headers: {
        'Title': 'SyncTrack: Time to Focus!',
        'Tags': 'bell,dart'
      }
    }).catch(err => console.error("Ntfy error:", err));

    localStorage.setItem('SyncTrack_LastAlert', currentTime);
  }
}

