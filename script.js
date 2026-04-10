const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const heartsEl = document.getElementById("hearts");
const startBtn = document.getElementById("startBtn");

const foodImg = new Image();
foodImg.src = "Images/BURGER.png";

const bombImg = new Image();
bombImg.src = "Images/bom.png";

const box = 20;

let snake;
let direction;
let food;
let bomb;

let score = 0;
let hearts = 3;

let gameSpeed = 180; // rustiger begin

let running = false;

let lastTime = 0;


// BESTURING

document.addEventListener("keydown", e => {

if ((e.key === "a" || e.key === "ArrowLeft") && direction !== "RIGHT")
direction = "LEFT";

if ((e.key === "w" || e.key === "ArrowUp") && direction !== "DOWN")
direction = "UP";

if ((e.key === "d" || e.key === "ArrowRight") && direction !== "LEFT")
direction = "RIGHT";

if ((e.key === "s" || e.key === "ArrowDown") && direction !== "UP")
direction = "DOWN";

});


// START GAME

function startGame() {

snake = [{ x: 200, y: 200 }];

direction = "RIGHT";

score = 0;
hearts = 3;

gameSpeed = 180;

running = true;

scoreEl.textContent = score;

updateHearts();

food = randomFood();
bomb = randomBomb();

lastTime = 0;

requestAnimationFrame(gameLoop);

}

startBtn.addEventListener("click", startGame);


// RANDOM FOOD

function randomFood() {

let newFood;

do {

newFood = {

x: Math.floor(Math.random() * 20) * box,
y: Math.floor(Math.random() * 20) * box

};

} while (

snake.some(segment =>
segment.x === newFood.x &&
segment.y === newFood.y
)

);

return newFood;

}


// RANDOM BOMB

function randomBomb() {

let newBomb;

do {

newBomb = {

x: Math.floor(Math.random() * 20) * box,
y: Math.floor(Math.random() * 20) * box

};

} while (

snake.some(segment =>
segment.x === newBomb.x &&
segment.y === newBomb.y
)

||

(newBomb.x === food.x && newBomb.y === food.y)

);

return newBomb;

}


// HEART DISPLAY

function updateHearts() {

heartsEl.textContent = "❤️".repeat(hearts);

}


// SPEED SYSTEM

function increaseSpeed() {

if (score % 3 === 0 && gameSpeed > 70) {

gameSpeed -= 10;

}

}


// GAME LOOP (60 FPS ENGINE)

function gameLoop(currentTime) {

if (!running) return;

if (!lastTime) lastTime = currentTime;

const delta = currentTime - lastTime;

if (delta > gameSpeed) {

draw();

lastTime = currentTime;

}

requestAnimationFrame(gameLoop);

}


// DRAW GAME

function draw() {

ctx.fillStyle = "#0f172a";

ctx.fillRect(0, 0, canvas.width, canvas.height);


// SLANG BODY

ctx.lineJoin = "round";

ctx.lineCap = "round";

ctx.lineWidth = box - 4;

ctx.strokeStyle = "#22c55e";

ctx.beginPath();

for (let i = 0; i < snake.length; i++) {

const part = snake[i];

const centerX = part.x + box / 2;
const centerY = part.y + box / 2;

if (i === 0)
ctx.moveTo(centerX, centerY);
else
ctx.lineTo(centerX, centerY);

}

ctx.stroke();


// SLANG KOP

const centerX = snake[0].x + box / 2;
const centerY = snake[0].y + box / 2;

ctx.beginPath();

ctx.fillStyle = "#4ade80";

ctx.arc(centerX, centerY, box / 2, 0, Math.PI * 2);

ctx.fill();


// FOOD

ctx.drawImage(foodImg, food.x, food.y, box, box);


// BOMB verschijnt vanaf score 3

if (score >= 3) {

ctx.beginPath();

ctx.fillStyle = "#ef4444";

ctx.arc(
bomb.x + box / 2,
bomb.y + box / 2,
box / 2,
0,
Math.PI * 2
);

ctx.fill();

ctx.drawImage(bombImg, bomb.x, bomb.y, box, box);

}


// NIEUWE HEAD

let head = { ...snake[0] };

if (direction === "LEFT") head.x -= box;
if (direction === "UP") head.y -= box;
if (direction === "RIGHT") head.x += box;
if (direction === "DOWN") head.y += box;


// BOM RAKEN

if (score >= 3 &&
head.x === bomb.x &&
head.y === bomb.y) {

hearts--;

updateHearts();

bomb = randomBomb();

if (hearts <= 0) {

running = false;

alert("💀 Geen levens meer! Score: " + score);

}

return;

}


// FOOD RAKEN

if (head.x === food.x && head.y === food.y) {

score++;

scoreEl.textContent = score;

food = randomFood();

bomb = randomBomb();

increaseSpeed();

}

else {

snake.pop();

}


// MUUR OF ZICHZELF

if (

head.x < 0 ||
head.y < 0 ||
head.x >= canvas.width ||
head.y >= canvas.height ||
snake.some(segment =>
segment.x === head.x &&
segment.y === head.y
)

) {

running = false;

alert("Game Over! Score: " + score);

return;

}


snake.unshift(head);

}