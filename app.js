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

function getRandomCMYK() {
  return {
    c: Math.floor(Math.random() * 101),
    m: Math.floor(Math.random() * 101),
    y: Math.floor(Math.random() * 101),
    k: Math.floor(Math.random() * 101)
  };
}

function getTodaySeed() {
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0; // 32-bit int conversion
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  return function () {
    seed = (seed * 1664525 + 1013904223) % 4294967296; // (seed * a + c) % 2^32
    return seed / 4294967296;
  };
}

function getDailyCMYK() {
  const seed = getTodaySeed();
  const rand = seededRandom(seed);

  return {
    c: Math.floor(rand() * 101),
    m: Math.floor(rand() * 101),
    y: Math.floor(rand() * 101),
    k: Math.floor(rand() * 101)
  };
}

const cmyk = getDailyCMYK();
const rgb = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
document.getElementById("mainBody").style.backgroundColor = rgb.css;

let numGuess = 0;
console.log("If you really want to cheat, I'll just tell you..", cmyk);

document.getElementById("guessBtn").addEventListener("click", () => {
  numGuess++;

  const cVal = parseInt(document.getElementById("cInput").value, 10);
  const mVal = parseInt(document.getElementById("mInput").value, 10);
  const yVal = parseInt(document.getElementById("yInput").value, 10);
  const kVal = parseInt(document.getElementById("kInput").value, 10);

  const guess = { c: cVal, m: mVal, y: yVal, k: kVal };
  const inputs = [cVal, mVal, yVal, kVal];
  const result = document.getElementById("result");

  if (inputs.some(val => isNaN(val) || val < 0 || val > 100)) {
    result.textContent = "Please enter values between 0 and 100 for each channel.";
    return;
  }

  const isCorrect =
    guess.c === cmyk.c &&
    guess.m === cmyk.m &&
    guess.y === cmyk.y &&
    guess.k === cmyk.k;

  if (isCorrect) {
    result.textContent = `You got it right in ${numGuess} guesses! The color was ${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k}.`;

    document.getElementById("guessBtn").style.display = "none";
    ["cInput", "mInput", "yInput", "kInput"].forEach(id => {
      document.getElementById(id).disabled = true;
    });

    ["labelC", "labelM", "labelY", "labelK"].forEach((id, i) => {
      document.getElementById(id).textContent = ["C", "M", "Y", "K"][i] + " ✅";
    });

    return;
  }

  const diffs = compareCMYK(cmyk, guess);

  document.getElementById("labelC").textContent = `${getHint(diffs.c)}`;
  document.getElementById("labelM").textContent = `${getHint(diffs.m)}`;
  document.getElementById("labelY").textContent = `${getHint(diffs.y)}`;
  document.getElementById("labelK").textContent = `${getHint(diffs.k)}`;

  result.textContent = `Wrong guesses: ${numGuess}`;
});

function compareCMYK(origin, guess) {
  const diffC = origin.c - guess.c;
  const diffM = origin.m - guess.m;
  const diffY = origin.y - guess.y;
  const diffK = origin.k - guess.k;

  const avgDiff =
    (Math.abs(diffC) + Math.abs(diffM) + Math.abs(diffY) + Math.abs(diffK)) / 4;

  return {
    c: diffC,
    m: diffM,
    y: diffY,
    k: diffK,
    avg: avgDiff
  };
}

function getHint(diff) {
  if (diff === 0) return "✅";
  if (diff > 25) return "↑↑";
  if (diff > 0) return "↑";
  if (diff < -25) return "↓↓";
  return "↓";
}

