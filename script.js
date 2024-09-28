let timer;
let isRunning = false;
let isPaused = false;
let timeLeft = 1500; // 25 minutes in seconds
const alarmSound = document.getElementById('alarm-sound');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-button'); // Reference to the start button
const pomodoroContainer = document.querySelector('.pomodoro-container');

function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timerElement.textContent = `${minutes}:${seconds}`;

    // Calculate progress percentage for background animation
    const progressPercentage = (1500 - timeLeft) / 1500;
    document.body.style.background = `linear-gradient(to top, #FF5722 ${progressPercentage * 100}%, #121212 ${progressPercentage * 100}%)`;

    // Save the state to localStorage
    saveState();
}

function toggleTimer() {
    if (isRunning) {
        // Pause the timer
        clearInterval(timer);
        isRunning = false;
        isPaused = true;
        startButton.textContent = 'Start'; // Change button text to "Start"
    } else {
        // Start or resume the timer
        isRunning = true;
        isPaused = false;
        startButton.textContent = 'Pause'; // Change button text to "Pause"

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

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    timeLeft = 1500;
    updateTimer();
    startButton.textContent = 'Start'; // Reset button text to "Start"
}

function saveState() {
    const state = {
        timeLeft: timeLeft,
        isRunning: isRunning,
        isPaused: isPaused,
        startTime: Date.now(),
    };
    localStorage.setItem('pomodoroState', JSON.stringify(state));
}

function loadState() {
    const state = JSON.parse(localStorage.getItem('pomodoroState'));
    if (state) {
        timeLeft = state.timeLeft;
        isRunning = state.isRunning;
        isPaused = state.isPaused;

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

// Load the saved state when the page loads
window.addEventListener('load', () => {
    loadState();
    updateTimer();

    // Resume the timer if it was running before
    if (isRunning) {
        toggleTimer(); // This will start the interval again if it was running before
    }
});

startButton.addEventListener('click', toggleTimer);
document.getElementById('reset-button').addEventListener('click', resetTimer);

updateTimer();


// Particle effect
function createParticles() {
    const particleContainer = document.querySelector('.particles');

    for (let i = 0; i < 30; i++) { // Number of particles
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 5px and 15px
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position within the container
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Random animation duration for variety
        particle.style.animationDuration = `${Math.random() * 5 + 5}s`; // Between 5 and 10 seconds

        particleContainer.appendChild(particle);
    }
}

// Call the function to create particles when the page loads
window.addEventListener('load', () => {
    createParticles();
    loadState();
    updateTimer();
    
});






document.getElementById('start-button').addEventListener('click', toggleTimer);
document.getElementById('reset-button').addEventListener('click', resetTimer);

updateTimer();
