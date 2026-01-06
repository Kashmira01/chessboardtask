const container = document.getElementById("circleContainer");
const pieces = document.querySelectorAll(".piece");
const pointer = document.getElementById("pointer");

const center = {
  x: container.offsetWidth / 2,
  y: container.offsetHeight / 2
};

const radius = 160;
let active = null;
let offsetX = 0;
let offsetY = 0;

/* Initial placement in circle */
pieces.forEach((piece, i) => {
  const angle = (i / pieces.length) * Math.PI * 2;
  piece.style.left = `${center.x + radius * Math.cos(angle) - 35}px`;
  piece.style.top  = `${center.y + radius * Math.sin(angle) - 35}px`;
  piece.addEventListener("mousedown", startDrag);
});

function startDrag(e) {
  active = e.target;
  active.style.zIndex = "4"; // bring front while dragging

  const rect = active.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
}

function drag(e) {
  if (!active) return;

  const contRect = container.getBoundingClientRect();
  const x = e.clientX - contRect.left - offsetX;
  const y = e.clientY - contRect.top - offsetY;

  active.style.left = `${x}px`;
  active.style.top = `${y}px`;

  const pieceRect = active.getBoundingClientRect();
  const pointerRect = pointer.getBoundingClientRect();

  const dx = pieceRect.left + 35 - (pointerRect.left + 45);
  const dy = pieceRect.top + 35 - (pointerRect.top + 45);
  const distance = Math.hypot(dx, dy);

  if (distance < 40) {
    snapAndRedirect(active);
  }
}

function snapAndRedirect(piece) {
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);

  piece.style.zIndex = "5"; // 🔥 icon above pointer
  piece.style.transition = "all 0.3s ease";
  piece.style.left = `${center.x - 35}px`;
  piece.style.top  = `${center.y - 35}px`;

  setTimeout(() => {
    window.location.href = piece.dataset.link;
  }, 300);
}

function stopDrag() {
  if (active) {
    active.style.zIndex = "1";
  }
  active = null;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
}
