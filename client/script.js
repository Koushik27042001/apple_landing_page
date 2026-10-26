const stage = document.getElementById("productStage");
const product = document.getElementById("productCard");
const resetButton = document.getElementById("resetButton");
const hero = document.querySelector(".hero");
const heroCopy = document.querySelector(".hero-copy");
const productShadow = document.querySelector(".product-shadow");

// Respect the user's motion preference.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

let targetRotateX = 0;
let targetRotateY = 0;
let currentRotateX = 0;
let currentRotateY = 0;
let targetMoveX = 0;
let targetMoveY = 0;
let currentMoveX = 0;
let currentMoveY = 0;
let animationFrame = null;

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function animateProduct() {
  currentRotateX = lerp(currentRotateX, targetRotateX, 0.075);
  currentRotateY = lerp(currentRotateY, targetRotateY, 0.075);
  currentMoveX = lerp(currentMoveX, targetMoveX, 0.075);
  currentMoveY = lerp(currentMoveY, targetMoveY, 0.075);

  product.style.transform = `
    rotateX(${currentRotateX}deg)
    rotateY(${currentRotateY}deg)
    translate3d(${currentMoveX}px, ${currentMoveY}px, 0)
  `;

  productShadow.style.transform = `
    translate3d(${-currentMoveX * 0.35}px, 0, -30px)
    scale(${1 + Math.abs(currentRotateY) * 0.003})
  `;

  const stillMoving =
    Math.abs(currentRotateX - targetRotateX) > 0.01 ||
    Math.abs(currentRotateY - targetRotateY) > 0.01 ||
    Math.abs(currentMoveX - targetMoveX) > 0.05 ||
    Math.abs(currentMoveY - targetMoveY) > 0.05;

  if (stillMoving) {
    animationFrame = requestAnimationFrame(animateProduct);
  } else {
    animationFrame = null;
  }
}

function startAnimation() {
  if (reducedMotion.matches || animationFrame !== null) return;
  animationFrame = requestAnimationFrame(animateProduct);
}

stage.addEventListener("pointermove", (event) => {
  if (reducedMotion.matches || coarsePointer) return;
  const rect = stage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  targetRotateY = (x - 0.5) * 12;
  targetRotateX = (0.5 - y) * 7;
  targetMoveX = (x - 0.5) * 7;
  targetMoveY = (y - 0.5) * 5;
  startAnimation();
});

stage.addEventListener("pointerleave", () => {
  targetRotateX = 0;
  targetRotateY = 0;
  targetMoveX = 0;
  targetMoveY = 0;
  startAnimation();
});

resetButton.addEventListener("click", () => {
  targetRotateX = 0;
  targetRotateY = 0;
  targetMoveX = 0;
  targetMoveY = 0;
  startAnimation();
});

let scrollScheduled = false;
function updateScrollAnimation() {
  const rect = hero.getBoundingClientRect();
  const heroHeight = hero.offsetHeight;
  const progress = Math.max(0, Math.min(1, -rect.top / heroHeight));
  if (!reducedMotion.matches) {
    const translateY = progress * 100;
    const scale = 1 + progress * 0.07;
    const rotate = -progress * 4;
    stage.style.transform = `
      translate3d(0, ${translateY}px, 0)
      scale(${scale})
      rotate(${rotate}deg)
    `;
    heroCopy.style.transform = `
      translate3d(0, ${-progress * 55}px, 0)
    `;
    stage.style.opacity = String(Math.max(0.4, 1 - progress * 0.6));
  }
}

window.addEventListener("scroll", () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  requestAnimationFrame(() => {
    updateScrollAnimation();
    scrollScheduled = false;
  });
}, { passive: true });

const featureData = {
  display: {
    label: "THE DISPLAY",
    title: "A bright new perspective.",
    description: "A vivid, colourful screen framed by a clean, minimal silhouette."
  },
  keyboard: {
    label: "THE KEYBOARD",
    title: "Made for every keystroke.",
    description: "A familiar keyboard layout designed to keep your workflow moving."
  },
  trackpad: {
    label: "THE DETAILS",
    title: "Room to make it yours.",
    description: "A spacious trackpad and a warm citrus finish complete the design."
  }
};

const hotspots = document.querySelectorAll(".hotspot");
const featureCard = document.getElementById("featureCard");
const featureLabel = document.getElementById("featureLabel");
const featureTitle = document.getElementById("featureTitle");
const featureDescription = document.getElementById("featureDescription");

hotspots.forEach((hotspot) => {
  hotspot.addEventListener("click", () => {
    const feature = featureData[hotspot.dataset.feature];
    if (!feature) return;
    const wasSelected = hotspot.classList.contains("selected");
    hotspots.forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-expanded", "false");
    });
    if (wasSelected) {
      featureLabel.textContent = "YOUR TURN";
      featureTitle.textContent = "Go on, take a look.";
      featureDescription.textContent = "Tap any numbered marker to discover a detail.";
      return;
    }
    hotspot.classList.add("selected");
    hotspot.setAttribute("aria-expanded", "true");
    featureLabel.textContent = feature.label;
    featureTitle.textContent = feature.title;
    featureDescription.textContent = feature.description;
    featureCard.classList.remove("card-updated");
    void featureCard.offsetWidth;
    featureCard.classList.add("card-updated");
  });
});

window.addEventListener("resize", () => {
  if (coarsePointer || reducedMotion.matches) return;
  updateScrollAnimation();
});

updateScrollAnimation();
