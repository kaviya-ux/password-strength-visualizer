# 🔐 Password Strength Visualizer

A live password strength checker built with HTML, Tailwind CSS, and vanilla JavaScript, split into separate structure, style, and logic files. Type a password and instantly see a color-coded strength meter, a live checklist of security criteria, and a rough estimate of how long it would take to brute-force.

## Live Demo

Keep `index.html`, `style.css`, and `script.js` in the same folder and open `index.html` in any browser. No installation, no build step, no API of any kind — everything runs entirely client-side.

## Features

- Live strength meter that updates on every keystroke, with 5 tiers: **Very Weak → Weak → Fair → Strong → Very Strong**
- Color-coded progress bar (red → orange → yellow → blue → green) matching the current tier
- Checklist of 5 criteria that check off live as you type:
  - At least 8 characters
  - A lowercase letter
  - An uppercase letter
  - A number
  - A special character
- Rough "estimated crack time" (e.g. *instantly*, *21 seconds*, *16 days*, *2 million years*) based on the password's character pool size and length
- Show/Hide toggle to reveal the typed password
- No password is ever sent anywhere — everything is calculated and checked entirely in the browser; nothing is logged, stored, or transmitted

## Tech Stack

- HTML5
- [Tailwind CSS](https://tailwindcss.com/) (via CDN, for layout and styling)
- Plain CSS (`style.css`, for small checklist-row transitions)
- Vanilla JavaScript (`script.js`, no frameworks, no libraries, no network calls)

## How It Works

- On every keystroke, the password is tested against 5 regular-expression-based rules (length, lowercase, uppercase, number, special character).
- The number of rules satisfied maps to one of 5 strength tiers, each with its own label, bar color, and bar width.
- For the crack-time estimate, the app calculates a rough character pool size based on which character types are actually used (26 for lowercase, 26 for uppercase, 10 for digits, ~32 for symbols), computes entropy as `length × log2(poolSize)`, and converts that into an estimated number of guesses at an assumed 10-billion-guesses-per-second brute-force rate — a common illustrative benchmark for a fast offline attack. This is meant to build intuition about password strength, not serve as a precise security audit.
- Everything happens with plain JavaScript string/regex checks — no external library, no password ever leaves the page.

## Project Structure

```
password-strength-visualizer/
├── index.html   # markup only — structure and Tailwind utility classes
├── style.css    # small custom styles (checklist row transitions)
├── script.js    # all logic: rule checks, scoring, crack-time estimate, UI updates
└── README.md
```

## Running Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/kaviya-ux/password-strength-visualizer.git
   ```
2. Make sure `index.html`, `style.css`, and `script.js` stay in the same folder.
3. Open `index.html` in your browser.

## Possible Improvements

- Detect and penalize common weak patterns (e.g. "password123", keyboard sequences like "qwerty")
- Add a "generate a strong password" button
- Check against a small list of the most common leaked passwords
- Add a copy-to-clipboard button for a generated password

## License

Free to use for learning or personal projects.

