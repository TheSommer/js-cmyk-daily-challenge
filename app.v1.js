const icons = {
  up: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M12 20c-0.55 0-1-0.45-1-1V8.41l-3.29 3.3a1 1 0 1 1-1.42-1.42l5-5a1 1 0 0 1 1.42 0l5 5a1 1 0 1 1-1.42 1.42L13 8.41V19c0 0.55-0.45 1-1 1z"/>
</svg>`,
  down: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M12 4c0.55 0 1 0.45 1 1v10.59l3.29-3.3a1 1 0 1 1 1.42 1.42l-5 5a1 1 0 0 1-1.42 0l-5-5a1 1 0 1 1 1.42-1.42L11 15.59V5c0-0.55 0.45-1 1-1z"/>
</svg>`,
};

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

function getTodaySeed() {
  const d = new Date();
  const today =
    d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");

  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getDailyCMYK() {
  const rand = mulberry32(getTodaySeed());
  let c = Math.floor(rand() * 101);
  let m = Math.floor(rand() * 101);
  let y = Math.floor(rand() * 101);

  // Limit K based on CMY so we don't double-darken
  const baseK = Math.min(c, m, y);
  const k = Math.floor((baseK * 0.4) * rand()); // 0..~40%

  return { c, m, y, k };
}

function getRandomCMYK() {
  return {
    c: Math.floor(Math.random() * 101),
    m: Math.floor(Math.random() * 101),
    y: Math.floor(Math.random() * 101),
    k: Math.floor(Math.random() * 101)
  };
}

function setBackgroundColor(cmyk) {
  const rgb = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
  document.getElementById("mainBody").style.backgroundColor = rgb.css;
}

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
  if (diff > 25) return icons.up + icons.up;
  if (diff > 0) return icons.up;
  if (diff < -25) return icons.down + icons.down;
  return icons.down;
}

function main() {
  const cmyk = getDailyCMYK();
  setBackgroundColor(cmyk);
  console.log("If you really want to cheat, I'll just tell you..", cmyk);

  let numGuess = 0;

  document.getElementById("guessBtn").addEventListener("click", () => {
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

    numGuess++;

    const isCorrect =
      guess.c === cmyk.c &&
      guess.m === cmyk.m &&
      guess.y === cmyk.y &&
      guess.k === cmyk.k;

    if (isCorrect) {
      result.textContent = `You got it right in ${numGuess} guesses!`;

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

    document.getElementById("labelC").innerHTML = `${getHint(diffs.c)}`;
    document.getElementById("labelM").innerHTML = `${getHint(diffs.m)}`;
    document.getElementById("labelY").innerHTML = `${getHint(diffs.y)}`;
    document.getElementById("labelK").innerHTML = `${getHint(diffs.k)}`;

    result.textContent = `Wrong guesses: ${numGuess}`;
  });
}

main();

