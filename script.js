const canvas = document.getElementById("starfield");
const context = canvas.getContext("2d");
const proposalContainer = document.getElementById("proposalContainer");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = 500;
let colorrange = [0, 60, 240];
let starArray = [];
let heartArray = [];
let frameNumber = 0;
let opacity = 0;
let secondOpacity = 0;
let thirdOpacity = 0;

// 1. Initialize Stars
function initStars() {
    starArray = [];
    for (let i = 0; i < stars; i++) {
        starArray.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.2,
            hue: colorrange[Math.floor(Math.random() * colorrange.length)],
            sat: Math.floor(Math.random() * 50) + 50,
            opacity: Math.random(),
            speed: Math.random() * 0.5 // For parallax movement
        });
    }
}

// 2. Heart Explosion Logic
function createHeartExplosion() {
    for (let i = 0; i < 75; i++) {
        heartArray.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            size: Math.random() * 5 + 2,
            speedX: (Math.random() - 0.5) * 15,
            speedY: (Math.random() - 0.5) * 15,
            opacity: 1,
            color: `hsla(${Math.random() * 20 + 340}, 100%, 60%, `
        });
    }
}

function drawHearts() {
    heartArray.forEach((h, i) => {
        context.save();
        context.beginPath();
        context.translate(h.x, h.y);
        context.scale(h.size / 10, h.size / 10);
        context.moveTo(0, 0);
        context.bezierCurveTo(-5, -5, -15, 5, 0, 15);
        context.bezierCurveTo(15, 5, 5, -5, 0, 0);
        context.fillStyle = h.color + h.opacity + ")";
        context.fill();
        context.restore();

        h.x += h.speedX;
        h.y += h.speedY;
        h.opacity -= 0.01;
        if (h.opacity <= 0) heartArray.splice(i, 1);
    });
}

// 3. Star Drawing & Animation
function drawStars() {
    starArray.forEach(star => {
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `hsla(${star.hue}, ${star.sat}%, 88%, ${star.opacity})`;
        context.fill();

        star.y -= star.speed; 
        if (star.y < 0) star.y = canvas.height;

        if (Math.random() > 0.99) star.opacity = Math.random();
    });
}

// 4. Text and Proposal Logic
function drawText() {
    let fontSize = Math.min(30, window.innerWidth / 25);
    context.font = fontSize + "px Comic Sans MS";
    context.textAlign = "center";
    context.shadowColor = "rgba(45, 45, 255, 1)";
    context.shadowBlur = 10;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    if (frameNumber < 250) {
        opacity += 0.01;
        context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        context.fillText("Every day, I can't believe how lucky I am...", centerX, centerY);
    } 
    else if (frameNumber < 500) {
        opacity -= 0.01;
        context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        context.fillText("Every day, I can't believe how lucky I am...", centerX, centerY);
    } 
    else if (frameNumber < 750) {
        if (frameNumber === 500) opacity = 0;
        opacity += 0.01;
        context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        context.fillText("Amongst trillions of stars and billions of years...", centerX, centerY);
    } 
    else if (frameNumber < 1000) {
        opacity -= 0.01;
        context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        context.fillText("Amongst trillions of stars and billions of years...", centerX, centerY);
    }
    else if (frameNumber < 1250) {
        if (frameNumber === 1000) opacity = 0;
        opacity += 0.01;
        context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        context.fillText("I got the impossible chance to know you.", centerX, centerY);
    }
    else if (frameNumber >= 1250) {
        // Final static text
        context.fillStyle = `rgba(255, 255, 255, 1)`;
        context.fillText("I love you more than all of space and time.", centerX, centerY - 50);
        
        proposalContainer.style.display = "block";
    }
}

// 5. Button Interactions
noButton.addEventListener("mouseover", () => {
    const x = Math.random() * (window.innerWidth - noButton.offsetWidth);
    const y = Math.random() * (window.innerHeight - noButton.offsetHeight);
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
});

yesButton.addEventListener("click", () => {
    createHeartExplosion();
    proposalContainer.innerHTML = "<h1 style='color:white; font-family:Comic Sans MS;'>YAY! I LOVE YOU! ❤</h1>";
    fetch('send_mail.php').catch(() => {}); // Optional email trigger
});

// 6. Main Loop
function draw() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawStars();
    drawText();
    drawHearts();

    frameNumber++;
    requestAnimationFrame(draw);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
});

initStars();
draw();
