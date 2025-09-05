# CMYK Daily Challenge 🎨

A fun little web game where you're shown a randomly colored background — and it's your job to guess the CMYK values that created it.

[Try it](https://thesommer.github.io/js-cmyk-daily-challenge)

## 🕹 How It Works

- On page load, a daily random **CMYK color** is generated.
- The background is colored using its **RGB equivalent**.
- You guess the color by entering values in **CMYK format** (e.g. `0,100,0,0`).
- The app tells you how many guesses you've made.
- If you guess correctly, the input disappears and you win!

## ✏️ Example Guess Format

```
C,M,Y,K → e.g. 20,40,60,0
Each value is a number from 0 to 100.
```

## 💡 Future Ideas

- Let users retry with a new color
- Leaderboard or stats via localStorage

---