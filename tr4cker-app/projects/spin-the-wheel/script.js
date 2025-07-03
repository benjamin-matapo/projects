const foodInput = document.getElementById('food-input');
const addFoodBtn = document.getElementById('add-food');
const foodList = document.getElementById('food-list');
const wheelCanvas = document.getElementById('wheel');
const spinBtn = document.getElementById('spin');
const resultDiv = document.getElementById('result');

let foods = [];
let spinning = false;
let angle = 0;
let spinTimeout = null;

function drawWheel(items, highlightIndex = null) {
  const ctx = wheelCanvas.getContext('2d');
  const size = wheelCanvas.width;
  const center = size / 2;
  const radius = center - 10;
  ctx.clearRect(0, 0, size, size);

  if (items.length === 0) {
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#e5e7eb';
    ctx.fill();
    ctx.font = '20px Segoe UI';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('Add food items!', center, center);
    return;
  }

  const colors = [
    '#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#f87171', '#a78bfa', '#facc15', '#38bdf8', '#f472b6', '#4ade80', '#f87171', '#fbbf24'
  ];
  const anglePerItem = 2 * Math.PI / items.length;

  for (let i = 0; i < items.length; i++) {
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, i * anglePerItem + angle, (i + 1) * anglePerItem + angle);
    ctx.closePath();
    ctx.fillStyle = highlightIndex === i ? '#f87171' : colors[i % colors.length];
    ctx.fill();
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(i * anglePerItem + angle + anglePerItem / 2);
    ctx.textAlign = 'right';
    ctx.font = '17px Segoe UI';
    ctx.fillStyle = '#222';
    ctx.fillText(items[i], radius - 18, 8);
    ctx.restore();
  }

  // Draw pointer
  ctx.beginPath();
  ctx.moveTo(center, center - radius - 8);
  ctx.lineTo(center - 12, center - radius + 18);
  ctx.lineTo(center + 12, center - radius + 18);
  ctx.closePath();
  ctx.fillStyle = '#ea580c';
  ctx.fill();
}

function updateFoodList() {
  foodList.innerHTML = '';
  foods.forEach((food, idx) => {
    const li = document.createElement('li');
    li.className = 'food-item';
    const span = document.createElement('span');
    span.textContent = food;
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.innerHTML = '&times;';
    delBtn.title = 'Delete';
    delBtn.onclick = () => {
      foods.splice(idx, 1);
      updateFoodList();
      drawWheel(foods);
    };
    li.appendChild(span);
    li.appendChild(delBtn);
    foodList.appendChild(li);
  });
}

addFoodBtn.onclick = () => {
  const value = foodInput.value.trim();
  if (value && !foods.includes(value)) {
    foods.push(value);
    foodInput.value = '';
    updateFoodList();
    drawWheel(foods);
  }
};

foodInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addFoodBtn.click();
});

function spinWheel() {
  if (spinning || foods.length === 0) return;
  spinning = true;
  resultDiv.textContent = '';
  let spinAngle = Math.random() * 6 + 6; // 6-12 full spins
  let currentAngle = angle;
  let duration = 3500; // ms
  let start = null;
  let lastFrame = null;

  function animateWheel(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    angle = currentAngle + spinAngle * 2 * Math.PI * eased;
    drawWheel(foods);
    if (progress < 1) {
      spinTimeout = requestAnimationFrame(animateWheel);
    } else {
      angle = angle % (2 * Math.PI);
      const selected = foods.length - 1 - Math.floor(((angle + Math.PI/2) % (2 * Math.PI)) / (2 * Math.PI / foods.length));
      drawWheel(foods, selected);
      resultDiv.textContent = `You should eat: ${foods[selected]}`;
      spinning = false;
    }
  }
  requestAnimationFrame(animateWheel);
}

spinBtn.onclick = spinWheel;

drawWheel(foods);
updateFoodList(); 