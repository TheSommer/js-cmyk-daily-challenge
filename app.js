// Convert CMYK [0–100] to RGB [0–255]
function cmykToRgb(c, m, y, k) {
  const r = 255 * (1 - c / 100) * (1 - k / 100);
  const g = 255 * (1 - m / 100) * (1 - k / 100);
  const b = 255 * (1 - y / 100) * (1 - k / 100);
  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
    css: `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
  };
}

// Generate random CMYK
function getRandomCMYK() {
  return {
    c: Math.floor(Math.random() * 101),
    m: Math.floor(Math.random() * 101),
    y: Math.floor(Math.random() * 101),
    k: Math.floor(Math.random() * 101)
  };
}

// Generate and apply background color
const cmyk = getRandomCMYK();
const rgb = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
document.getElementById("mainBody").style.backgroundColor = rgb.css;

let numGuess = 0;
console.log("If you really want to cheat, I'll just tell you..", cmyk);

document.getElementById("guessBtn").addEventListener("click", () => {
  numGuess++;

  const input = document.getElementById("guessInput");
  const result = document.getElementById("result");

  const guess = input.value.trim();
  if (!guess) {
    result.textContent = "Please enter a guess.";
    return;
  }

  // Parse CMYK input
  const parts = guess.split(",").map(p => parseInt(p.trim(), 10));
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 100)) {
    result.textContent = "Invalid format. Enter 4 numbers from 0 to 100 (e.g. 0,100,0,0).";
    return;
  }

  if (
    parts[0] === cmyk.c &&
    parts[1] === cmyk.m &&
    parts[2] === cmyk.y &&
    parts[3] === cmyk.k
  ) {
    result.textContent = `You got ${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k} right in ${numGuess} guesses!`;

    // Hide the input and button
    input.style.display = "none";
    document.getElementById("guessBtn").style.display = "none";
  } else {
    result.textContent = `Wrong guesses: ${numGuess}`;
  }

});
