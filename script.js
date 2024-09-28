let timer;
let isRunning = false;
let timeLeft = 1500; // 25 minutes in seconds
const alarmSound = document.getElementById('alarm-sound');
const timerElement = document.getElementById('timer');
const pomodoroContainer = document.querySelector('.pomodoro-container');

// Function to save state to localStorage
function saveState() {
    const state = {
        timeLeft: timeLeft,
        isRunning: isRunning,
        startTime: Date.now()
    };
    localStorage.setItem('pomodoroState', JSON.stringify(state));
}

// Function to load state from localStorage
function loadState() {
    const state = JSON.parse(localStorage.getItem('pomodoroState'));
    if (state) {
        timeLeft = state.timeLeft;
        isRunning = state.isRunning;

        // If the timer was running, calculate the elapsed time
        if (isRunning) {
            const elapsedTime = Math.floor((Date.now() - state.startTime) / 1000);
            timeLeft -= elapsedTime;

            // If timeLeft is less than or equal to zero, reset the timer
            if (timeLeft <= 0) {
                timeLeft = 0;
                isRunning = false;
            }
        }
    }
}

// Update the timer display and animation
function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timerElement.textContent = `${minutes}:${seconds}`;

    // Calculate progress percentage for background animation
    const progressPercentage = (1500 - timeLeft) / 1500;
    pomodoroContainer.style.background = `linear-gradient(to right, #FF5722 ${progressPercentage * 100}%, #1e1e1e ${progressPercentage * 100}%)`;

    // Save the state to localStorage
    saveState();
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft <= 0) {
                clearInterval(timer);
                alarmSound.play();
                alert('Pomodoro finished! Take a break.');
                resetTimer();
            }
        }, 1000);
        updateTimer();
    }
}

// Function to resume the timer on page load if it was running
function resumeTimer() {
    if (isRunning) {
        timer = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft <= 0) {
                clearInterval(timer);
                alarmSound.play();
                alert('Pomodoro finished! Take a break.');
                resetTimer();
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 1500;
    updateTimer();
}

// Load the saved state when the page loads
window.addEventListener('load', () => {
    loadState();
    updateTimer();

    // Resume the timer if it was running before
    resumeTimer();
});

document.getElementById('start-button').addEventListener('click', startTimer);
document.getElementById('reset-button').addEventListener('click', resetTimer);

updateTimer();
