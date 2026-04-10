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
let nextDirection;

let food;
let bomb;

let score = 0;
let hearts = 3;

let gameSpeed = 180;

let running = false;

let lastMoveTime = 0;


// BESTURING

document.addEventListener("keydown", e => {

if ((e.key === "a" || e.key === "ArrowLeft") && direction !== "RIGHT")
nextDirection = "LEFT";

if ((e.key === "w" || e.key === "ArrowUp") && direction !== "DOWN")
nextDirection = "UP";

if ((e.key === "d" || e.key === "ArrowRight") && direction !== "LEFT")
nextDirection = "RIGHT";

if ((e.key === "s" || e.key === "ArrowDown") && direction !== "UP")
nextDirection = "DOWN";

});


// START GAME

function startGame() {

snake = [{ x: 10, y: 10 }];

direction = "RIGHT";
nextDirection = "RIGHT";

score = 0;
hearts = 3;

gameSpeed = 180;

running = true;

scoreEl.textContent = score;

updateHearts();

food = randomFood();
bomb = randomBomb();

requestAnimationFrame(gameLoop);

}

startBtn.addEventListener("click", startGame);


// RANDOM FOOD

function randomFood() {

let newFood;

do {

newFood = {

x: Math.floor(Math.random() * 20),
y: Math.floor(Math.random() * 20)

};

} while (
snake.some(part =>
part.x === newFood.x &&
part.y === newFood.y
)
);

return newFood;

}


// RANDOM BOMB

function randomBomb() {

let newBomb;

do {

newBomb = {

x: Math.floor(Math.random() * 20),
y: Math.floor(Math.random() * 20)

};

} while (
snake.some(part =>
part.x === newBomb.x &&
part.y === newBomb.y
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


// GAME LOOP

function gameLoop(time) {

if (!running) return;

if (time - lastMoveTime > gameSpeed) {

update();

lastMoveTime = time;

}

draw();

requestAnimationFrame(gameLoop);

}


// UPDATE POSITIES

function update() {

direction = nextDirection;

let head = { ...snake[0] };

if (direction === "LEFT") head.x--;
if (direction === "RIGHT") head.x++;
if (direction === "UP") head.y--;
if (direction === "DOWN") head.y++;


// SELF COLLISION

if (
snake.some(part =>
part.x === head.x &&
part.y === head.y
)
) {

running = false;

alert("Game Over! Je raakte jezelf!");

return;

}


// WALL COLLISION

if (
head.x < 0 ||
head.y < 0 ||
head.x >= 20 ||
head.y >= 20
) {

running = false;

alert("Game Over! Score: " + score);

return;

}


// BOMB COLLISION

if (
score >= 3 &&
head.x === bomb.x &&
head.y === bomb.y
) {

hearts--;

updateHearts();

bomb = randomBomb();

if (hearts <= 0) {

running = false;

alert("💀 Geen levens meer! Score: " + score);

return;

}

return;

}


// FOOD COLLISION

if (
head.x === food.x &&
head.y === food.y
) {

score++;

scoreEl.textContent = score;

food = randomFood();

bomb = randomBomb();

increaseSpeed();

}

else {

snake.pop();

}


snake.unshift(head);

}


// DRAW GAME

function draw() {

ctx.fillStyle = "#0f172a";
ctx.fillRect(0, 0, canvas.width, canvas.height);


// SLANG

ctx.fillStyle = "#22c55e";

snake.forEach((part, index) => {

ctx.beginPath();

ctx.arc(
part.x * box + box / 2,
part.y * box + box / 2,
box / 2,
0,
Math.PI * 2
);

ctx.fill();

});


// FOOD

ctx.drawImage(
foodImg,
food.x * box,
food.y * box,
box,
box
);


// BOMB

if (score >= 3) {

ctx.beginPath();

ctx.fillStyle = "#ef4444";

ctx.arc(
bomb.x * box + box / 2,
bomb.y * box + box / 2,
box / 2,
0,
Math.PI * 2
);

ctx.fill();

ctx.drawImage(
bombImg,
bomb.x * box,
bomb.y * box,
box,
box
);

}

}