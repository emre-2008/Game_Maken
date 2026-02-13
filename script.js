const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const foodImg = new Image();
foodImg.src = "Images/BURGER.png";


const box = 20;
let game = null;
let score = 0;

// slang + richting
let snake, direction, food;

// toetsen
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function startGame() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  scoreEl.textContent = score;

  food = randomFood();

  if (game) clearInterval(game);
  game = setInterval(draw, 100);
}

startBtn.addEventListener("click", startGame);

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

function draw() {
  // achtergrond
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // slang
  // ==== SLANG TEKENEN ====
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.lineWidth = box - 4;

// body kleur
ctx.strokeStyle = "#22c55e";

ctx.beginPath();

for (let i = 0; i < snake.length; i++) {
  const part = snake[i];
  const centerX = part.x + box / 2;
  const centerY = part.y + box / 2;

  if (i === 0) {
    ctx.moveTo(centerX, centerY);
  } else {
    ctx.lineTo(centerX, centerY);
  }
}

ctx.stroke();


// ==== KOP EXTRA CARTOON ====
const centerX = snake[0].x + box / 2;
const centerY = snake[0].y + box / 2;

// kop rond maken
ctx.beginPath();
ctx.fillStyle = "#4ade80";
ctx.arc(centerX, centerY, box / 2, 0, Math.PI * 2);
ctx.fill();

// ogen
ctx.fillStyle = "white";
ctx.beginPath();
ctx.arc(centerX - 4, centerY - 3, 3, 0, Math.PI * 2);
ctx.fill();

ctx.beginPath();
ctx.arc(centerX + 4, centerY - 3, 3, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = "black";
ctx.beginPath();
ctx.arc(centerX - 4, centerY - 3, 1.5, 0, Math.PI * 2);
ctx.fill();

ctx.beginPath();
ctx.arc(centerX + 4, centerY - 3, 1.5, 0, Math.PI * 2);
ctx.fill();


  // eten
ctx.drawImage(foodImg, food.x, food.y, box, box);


  let head = { ...snake[0] };

  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "DOWN") head.y += box;

  // eten pakken
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = randomFood();
  } else {
    snake.pop();
  }

  // game over
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    snake.some(p => p.x === head.x && p.y === head.y)
  ) {
    clearInterval(game);
    alert("Game Over! Score: " + score);
    return;
  }

  snake.unshift(head);
}
