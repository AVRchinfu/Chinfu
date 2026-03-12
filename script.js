// ======================================
// CONFIGURATION - CUSTOMIZE THESE VALUES
// ======================================

// Change this to the correct nickname
const correctAnswer = "Princess";

// ======================================
// GLOBAL VARIABLES
// ======================================

let currentScene = 1;
let gameScore = 0;
let gameActive = false;
let basketPosition = 50;
let fallingHearts = [];
let gameInterval;
let heartSpawnInterval;

// ======================================
// PARTICLE BACKGROUND
// ======================================

function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 105, 180, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ======================================
// SCENE 1: TYPEWRITER EFFECT
// ======================================

function typeWriter(text, element, delay = 100) {
    return new Promise((resolve) => {
        let i = 0;
        element.innerHTML = '';

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, delay);
            } else {
                resolve();
            }
        }

        type();
    });
}

async function startTypewriterSequence() {
    const typewriterEl = document.getElementById('typewriter');

    await typeWriter('Hey...', typewriterEl, 100);
    await new Promise(resolve => setTimeout(resolve, 1000));

    typewriterEl.innerHTML = '';
    await typeWriter('I made something for you.', typewriterEl, 80);
    await new Promise(resolve => setTimeout(resolve, 1200));

    typewriterEl.innerHTML = '';
    await typeWriter('But you need to unlock it first.', typewriterEl, 70);
    await new Promise(resolve => setTimeout(resolve, 800));

    document.getElementById('beginBtn').classList.remove('hidden');
}

function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    const heartSymbols = ['❤️', '💕', '💖', '💗'];

    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';

        container.appendChild(heart);

        setTimeout(() => heart.remove(), 8000);
    }, 500);
}

// ======================================
// SCENE 2: SECRET CODE UNLOCK
// ======================================

function checkSecretCode() {
    const input = document.getElementById('secretInput');
    const errorMsg = document.getElementById('errorMsg');
    const value = input.value.trim().toLowerCase();
    const correct = correctAnswer.toLowerCase();

    if (value === correct) {
        document.body.style.background = 'radial-gradient(circle, rgba(255,20,147,0.3) 0%, rgba(10,10,10,1) 70%)';

        setTimeout(() => {
            transitionToScene(3);
        }, 800);
    } else {
        errorMsg.classList.remove('hidden');
        input.value = '';
        input.style.animation = 'shake 0.5s';

        setTimeout(() => {
            errorMsg.classList.add('hidden');
            input.style.animation = '';
        }, 2000);
    }
}

// ======================================
// SCENE 3: MEMORY GALLERY WITH TILT
// ======================================

function initTiltEffect() {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// ======================================
// SCENE 4: HEART CATCHING GAME
// ======================================

function startGame() {
    gameActive = true;
    gameScore = 0;
    updateScore();

    const basket = document.getElementById('basket');
    const gameCanvas = document.getElementById('gameCanvas');

    basket.style.left = '50%';
    basketPosition = 50;

    gameInterval = setInterval(updateGame, 20);
    heartSpawnInterval = setInterval(spawnFallingHeart, 1000);
}

function spawnFallingHeart() {
    if (!gameActive) return;

    const gameCanvas = document.getElementById('gameCanvas');
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.textContent = '❤️';
    heart.style.left = Math.random() * 90 + 5 + '%';
    heart.style.top = '-30px';

    const duration = Math.random() * 2 + 3;
    heart.style.animationDuration = duration + 's';

    gameCanvas.appendChild(heart);

    fallingHearts.push({
        element: heart,
        duration: duration * 1000,
        startTime: Date.now()
    });

    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
        }
    }, duration * 1000 + 100);
}

function updateGame() {
    if (!gameActive) return;

    const basket = document.getElementById('basket');
    const basketRect = basket.getBoundingClientRect();

    fallingHearts = fallingHearts.filter(heartObj => {
        const heartRect = heartObj.element.getBoundingClientRect();

        if (
            heartRect.bottom >= basketRect.top &&
            heartRect.top <= basketRect.bottom &&
            heartRect.right >= basketRect.left &&
            heartRect.left <= basketRect.right
        ) {
            heartObj.element.remove();
            gameScore++;
            updateScore();

            if (gameScore >= 10) {
                endGame();
            }

            return false;
        }

        return heartObj.element.parentNode !== null;
    });
}

function updateScore() {
    document.getElementById('score').textContent = gameScore;
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(heartSpawnInterval);

    fallingHearts.forEach(heartObj => {
        if (heartObj.element.parentNode) {
            heartObj.element.remove();
        }
    });

    fallingHearts = [];

    document.getElementById('gameComplete').classList.remove('hidden');
}

function moveBasket(direction) {
    if (!gameActive) return;

    const basket = document.getElementById('basket');
    const speed = 5;

    if (direction === 'left') {
        basketPosition = Math.max(5, basketPosition - speed);
    } else if (direction === 'right') {
        basketPosition = Math.min(95, basketPosition + speed);
    }

    basket.style.left = basketPosition + '%';
}

// ======================================
// SCENE 5: STARS AND CONFETTI
// ======================================

function createStars() {
    const container = document.getElementById('stars');
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';

        container.appendChild(star);
    }

    const brightStar = document.createElement('div');
    brightStar.className = 'star bright';
    brightStar.style.left = '50%';
    brightStar.style.top = '20%';
    container.appendChild(brightStar);
}

function createConfetti() {
    const container = document.getElementById('confetti');
    const colors = ['#ff1493', '#ff69b4', '#ba55d3', '#ffd700', '#00bfff'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = Math.random() * 2 + 2 + 's';

            container.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// ======================================
// SCENE TRANSITIONS
// ======================================

function transitionToScene(sceneNumber) {
    const currentSceneEl = document.getElementById(`scene${currentScene}`);
    const nextSceneEl = document.getElementById(`scene${sceneNumber}`);

    currentSceneEl.style.opacity = '0';

    setTimeout(() => {
        currentSceneEl.classList.remove('active');
        nextSceneEl.classList.add('active');
        currentScene = sceneNumber;

        if (sceneNumber === 3) {
            setTimeout(initTiltEffect, 500);
        } else if (sceneNumber === 4) {
            setTimeout(startGame, 500);
        } else if (sceneNumber === 5) {
            createStars();
            setTimeout(createConfetti, 4000);
        }
    }, 1000);
}

// ======================================
// HEART TRAIL EFFECT
// ======================================

let lastTrailTime = 0;

function createHeartTrail(x, y) {
    const now = Date.now();
    if (now - lastTrailTime < 100) return;
    lastTrailTime = now;

    const heart = document.createElement('div');
    heart.className = 'heart-trail';
    heart.textContent = '❤️';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1000);
}

// ======================================
// EVENT LISTENERS
// ======================================

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    startTypewriterSequence();
    createFloatingHearts();

    document.getElementById('beginBtn').addEventListener('click', () => {
        transitionToScene(2);
    });

    document.getElementById('unlockBtn').addEventListener('click', checkSecretCode);

    document.getElementById('secretInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkSecretCode();
        }
    });

    document.getElementById('nextToGame').addEventListener('click', () => {
        transitionToScene(4);
    });

    document.getElementById('finalSceneBtn').addEventListener('click', () => {
        transitionToScene(5);
    });

    document.addEventListener('keydown', (e) => {
        if (currentScene === 4 && gameActive) {
            if (e.key === 'ArrowLeft') {
                moveBasket('left');
            } else if (e.key === 'ArrowRight') {
                moveBasket('right');
            }
        }
    });

    let touchStartX = 0;
    let touchCurrentX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    document.addEventListener('touchmove', (e) => {
        if (currentScene === 4 && gameActive) {
            touchCurrentX = e.touches[0].clientX;
            const diff = touchCurrentX - touchStartX;

            if (Math.abs(diff) > 10) {
                if (diff > 0) {
                    moveBasket('right');
                } else {
                    moveBasket('left');
                }
                touchStartX = touchCurrentX;
            }
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.9) {
            createHeartTrail(e.clientX, e.clientY);
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (Math.random() > 0.8) {
            createHeartTrail(e.touches[0].clientX, e.touches[0].clientY);
        }
    });
});
