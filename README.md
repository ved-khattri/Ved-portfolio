# Ved Pasco · Portfolio

> **Creator · Builder & Explorer · AI Agents · Brand Strategy & Creative Direction**  
> _Crafted with warm retro-analog aesthetics, bespoke typography, and interactive audio._

## Overview

This is the official portfolio of **Ved Pasco (Ved Khattri)** — an entrepreneur, creative director, and builder currently studying at **IIM Bangalore (DBE '26)**.

The website blends editorial-grade typography, warm paper/grain textures, 3D interactive physics, and an interactive vintage cassette tape player that streams original compositions while visitors explore the work.

---

## Key Features

- **Editorial Vintage Aesthetic:** Warm palette with authentic paper grain overlay, sawtooth navigation elements, and custom typography (_Maharaja_, _Shivaraja_, _Sabiren_, _Playfair Display_).
- **Interactive Retro Cassette Player:**
  - Nostalgic animated cassette tape with floating musical particles (`♪ ♫ ♩ `) and 3D parallax hover.
  - Dual-track randomized mixtape with seamless track shuffling and loop transitions:
    - **Track 1:** _Natalie Holt — "Purpose Is Glorious"_ (Official studio orchestral score from Marvel's _Loki_ Season 2 finale).
    - **Track 2:** _Creator's Mix_ (Warm vintage Rhodes Lo-Fi chill groove).
  - Autoplay on page load with seamless interaction policy unlock and play/pause controls.
- **Dynamic 3D Parallax & Micro-interactions:** Cursor-tracking 3D tilt cards, fluid transitions, and tactile hover states.
- **Lenis Smooth Scrolling:** Buttery smooth inertial scrolling across all modern desktop and mobile browsers.
- **Fully Responsive & Accessible:** Semantic HTML5 structure (single `<h1>` hierarchy), accessible contrast ratios, and cross-device optimization.

---

## Project Structure

```text
Ved-portfolio/
├── index.html                   # Core semantic markup & structure
├── style.css                    # Design tokens, keyframe animations, 3D physics
├── script.js                    # Lenis integration, cassette player & interactions
├── assets/
│   ├── audio/
│   │   ├── lofi_chill.mp3       # Vintage Rhodes Lo-Fi track
│   │   └── purpose_is_glorious.mp3 # Natalie Holt orchestral score
│   ├── fonts/                   # Custom typefaces (Maharaja, Shivaraja, Sabiren)
│   ├── images/
│   │   ├── cassette_transparent.png # Clean retro cassette graphic
│   │   ├── me.png               # About portrait
│   │   ├── grain_texture.png    # Analog texture overlays
│   │   ├── gif/                 # Optimized office preview video & GIF
│   │   └── logos/               # Client and collaboration brand marks
│   └── svgs/                    # Vector icons and decorative glyphs
└── README.md
```

---

## Tech Stack

- **Markup & Layout:** HTML5 Semantic Structure, SVG Graphics
- **Styling:** Vanilla CSS3, CSS Custom Properties, 3D Transforms, Responsive Flexbox & Grid
- **Scripting:** Vanilla JavaScript (ES6+)
- **Audio Engine:** HTML5 Audio API with randomized shuffle playlist
- **Smooth Scroll:** [Lenis](https://github.com/darkroomengineering/lenis)

---

## Getting Started

### Local Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ved-khattri/Ved-portfolio.git
   cd Ved-portfolio
   ```

2. **Run a local server:**
   Using Python:

   ```bash
   python -m http.server 3000
   ```

   Or using Node (`npx serve`):

   ```bash
   npx serve .
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3000` to experience the portfolio.

---

## Connect & Socials

- **LinkedIn:** [linkedin.com/in/vedpasco](https://www.linkedin.com/in/vedpasco/)
- **Instagram:** [@vedpasco](https://instagram.com/vedpasco)
- **YouTube:** [@vpasco](https://youtube.com/@vpasco)
- **Email:** [savvypasco@gmail.com](mailto:savvypasco@gmail.com)

---

## License

© 2026 Ved Pasco. All rights reserved.
