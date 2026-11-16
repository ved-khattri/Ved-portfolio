/*---NAVBAR SCROLL---*/
const navbar = document.getElementById("navbar");
const navContainer = document.getElementById("nav-container");
const navLinksList = document.querySelectorAll(".nav-link");
const trackedSections = document.querySelectorAll("section[id]");

let isScrolled = false;
let ticking = false;

function updateNavbar(scrollVal) {
  const scrollY =
    typeof scrollVal === "number"
      ? scrollVal
      : window.scrollY || window.pageYOffset || 0;

  if (!isScrolled && scrollY > 50) {
    isScrolled = true;
    navbar?.classList.add("scrolled");
    navContainer?.classList.add("scrolled");
  } else if (isScrolled && scrollY <= 20) {
    isScrolled = false;
    navbar?.classList.remove("scrolled");
    navContainer?.classList.remove("scrolled");
  }

  let currentSection = "home";
  const triggerPoint = scrollY + 220;

  trackedSections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (triggerPoint >= top && triggerPoint < top + height) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinksList.forEach((link) => {
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  ticking = false;
}

function onScrollHandler() {
  if (!ticking) {
    window.requestAnimationFrame(() => updateNavbar());
    ticking = true;
  }
}

window.addEventListener("scroll", onScrollHandler, { passive: true });
updateNavbar();

/*---LENIS SMOOTH SCROLL---*/
let lenis = null;
if (typeof Lenis !== "undefined") {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on("scroll", (e) => {
    updateNavbar(e.scroll);
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -75, duration: 1.2 });
      }
    });
  });
}

/*---MOBILE NAV---*/
const burger = document.getElementById("nav-burger");
const navLinks = document.getElementById("nav-links");

burger?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  burger.classList.toggle("open", isOpen);
  burger.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (e) => {
  if (
    burger &&
    navLinks &&
    !burger.contains(e.target) &&
    !navLinks.contains(e.target)
  ) {
    navLinks.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }
});

/*---SCROLL REVEAL---*/
// Milestone cards: alternate left & right
document.querySelectorAll(".portfolio-card").forEach((card, i) => {
  card.classList.add("reveal-ready");
  card.classList.add(i % 2 === 0 ? "reveal-from-left" : "reveal-from-right");
});

// Experience cards: alternate left & right
document.querySelectorAll(".exp-card").forEach((card, i) => {
  card.classList.add("reveal-ready");
  card.classList.add(i % 2 === 0 ? "reveal-from-left" : "reveal-from-right");
});

// General elements: reveal vertically
const otherRevealEls = document.querySelectorAll(
  ".service-card, .about-grid, .poster-canvas, .section-header, .cta-card",
);
otherRevealEls.forEach((el, i) => {
  el.classList.add("reveal-ready");
  el.style.transitionDelay = (i % 3) * 0.08 + "s";
});

const allRevealEls = document.querySelectorAll(".reveal-ready");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
);

allRevealEls.forEach((el) => observer.observe(el));

requestAnimationFrame(() => {
  allRevealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("visible");
    }
  });
});

/*---HERO EDITORIAL ON-REVEAL---*/
const editorialBoxes = document.querySelectorAll(".poster-editorial-box");
if (editorialBoxes.length) {
  const editorialObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          editorialObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  editorialBoxes.forEach((box) => editorialObserver.observe(box));

  requestAnimationFrame(() => {
    editorialBoxes.forEach((box) => {
      const rect = box.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        box.classList.add("is-revealed");
      }
    });
  });
}

/*---CARD SPOTLIGHT INTERACTION---*/
document
  .querySelectorAll(
    ".service-card:not(.service-cta-card), .portfolio-card, .exp-card",
  )
  .forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

/*---3D HOVER & TOUCH EFFECT---*/
document.querySelectorAll(".hover-3d").forEach((container) => {
  const content = container.firstElementChild;
  if (!content) return;

  let isTouchActive = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let hasMovedTouch = false;

  function updateTilt(clientX, clientY, maxDeg = 10, scale = 1.03) {
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxDeg;
    const rotateY = ((x - centerX) / centerX) * maxDeg;

    content.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
  }

  function resetTilt(smooth = true) {
    content.style.transition = smooth
      ? "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)"
      : "";
    content.style.transform = "";
  }

  // Desktop Mouse Events
  container.addEventListener("mousemove", (e) => {
    content.style.transition = "transform 0.08s ease-out";
    updateTilt(e.clientX, e.clientY, 9, 1.02);
  });

  container.addEventListener("mouseleave", () => {
    resetTilt(true);
  });

  // Mobile & Tablet Touch Support (same as platypus)
  container.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches && e.touches[0]) {
        isTouchActive = true;
        hasMovedTouch = false;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        content.style.transition = "transform 0.08s ease-out";
        updateTilt(touchStartX, touchStartY, 11, 1.03);
      }
    },
    { passive: true },
  );

  container.addEventListener(
    "touchmove",
    (e) => {
      if (isTouchActive && e.touches && e.touches[0]) {
        const touch = e.touches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 4) {
          hasMovedTouch = true;
          updateTilt(touch.clientX, touch.clientY, 12, 1.03);

          // Prevent page scroll when deliberately rotating the 3D card
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      }
    },
    { passive: false },
  );

  const endTouch = () => {
    if (isTouchActive) {
      isTouchActive = false;
      if (!hasMovedTouch) {
        // Tap gesture: play a delightful springy 3D wobble bounce
        content.style.transition =
          "transform 0.55s cubic-bezier(0.18, 1.35, 0.3, 1)";
        content.style.transform =
          "perspective(900px) rotateX(6deg) rotateY(-8deg) scale3d(1.04, 1.04, 1.04)";
        setTimeout(() => {
          resetTilt(true);
        }, 240);
      } else {
        resetTilt(true);
      }
    }
  };

  container.addEventListener("touchend", endTouch, { passive: true });
  container.addEventListener("touchcancel", endTouch, { passive: true });
});

/*---MINDSET & INTERESTS TEXT RANDOMIZER (HOVER ONLY)---*/
const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789✦_/#?<>*";

function scrambleText(element, finalText) {
  let iteration = 0;
  clearInterval(element._scrambleInterval);

  element._scrambleInterval = setInterval(() => {
    element.textContent = finalText
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";
        if (index < iteration) {
          return finalText[index];
        }
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      })
      .join("");

    if (iteration >= finalText.length) {
      clearInterval(element._scrambleInterval);
      element.textContent = finalText;
    }

    iteration += 1 / 1.5;
  }, 24);
}

document.querySelectorAll(".cap-tag").forEach((tag) => {
  const textEl = tag.querySelector(".cap-tag-text");
  const originalText =
    tag.getAttribute("data-value") || textEl?.textContent.trim();

  if (textEl && originalText) {
    tag.addEventListener("mouseenter", () => {
      scrambleText(textEl, originalText);
    });

    tag.addEventListener("mouseleave", () => {
      clearInterval(textEl._scrambleInterval);
      textEl.textContent = originalText;
    });
  }
});

/*---SCROLL-REACTIVE INFINITE MARQUEE---*/
const marqueeTrack = document.getElementById("marquee-track");
const marqueeBand = document.getElementById("marquee-band");

if (marqueeTrack && marqueeBand) {
  const group = marqueeTrack.querySelector(".marquee-group");
  let currentX = 0;
  const normalSpeed = 1.25; // Constant steady normal speed (never boosted)
  let moveDir = -1; // -1 for left (default), 1 for right
  let lastScrollY = window.scrollY;
  let scrollTimeout = null;

  let isInView = false;
  const marqueeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isInView = entry.isIntersecting;
      });
    },
    { rootMargin: "100px 0px" },
  );
  marqueeObserver.observe(marqueeBand);

  window.addEventListener(
    "scroll",
    () => {
      if (!isInView) return;
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY;
      lastScrollY = scrollY;

      if (delta > 0) {
        moveDir = 1;
      } else if (delta < 0) {
        moveDir = -1;
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        moveDir = -1;
      }, 600);
    },
    { passive: true },
  );

  function tickMarquee() {
    currentX += moveDir * normalSpeed;

    const groupWidth = group?.offsetWidth || 0;
    if (groupWidth > 0) {
      if (currentX <= -groupWidth) {
        currentX += groupWidth;
      } else if (currentX >= 0) {
        currentX -= groupWidth;
      }
    }

    marqueeTrack.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
    requestAnimationFrame(tickMarquee);
  }

  requestAnimationFrame(tickMarquee);
}

/*---HERO HOVER & TOUCH GALLERY---*/
const hoverGalleries = document.querySelectorAll(".hover-gallery");
hoverGalleries.forEach((gallery) => {
  const images = gallery.querySelectorAll(".poster-portrait-img, img");
  if (!images.length) return;

  let currentIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let hasScrubbedTouch = false;

  function setActive(index) {
    currentIndex = Math.max(0, Math.min(index, images.length - 1));
    images.forEach((img, i) => {
      img.style.opacity = i === currentIndex ? "1" : "0";
    });
  }

  // Set initial image
  setActive(0);

  // Desktop Mouse Events
  gallery.addEventListener("mousemove", (e) => {
    const rect = gallery.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(x / rect.width, 0.999));
    const activeIndex = Math.floor(progress * images.length);
    setActive(activeIndex);
  });

  gallery.addEventListener("mouseleave", () => {
    setActive(0);
  });

  // Mobile & Tablet Touch Support (same as platypus)
  gallery.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        hasScrubbedTouch = false;
      }
    },
    { passive: true },
  );

  gallery.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;

        // If horizontal scrubbing motion
        if (Math.abs(dx) > 5) {
          hasScrubbedTouch = true;
          const rect = gallery.getBoundingClientRect();
          const x = touch.clientX - rect.left;
          const progress = Math.max(0, Math.min(x / rect.width, 0.999));
          const activeIndex = Math.floor(progress * images.length);
          setActive(activeIndex);

          // Prevent page scroll when scrubbing across the hero photo
          if (Math.abs(dx) > Math.abs(dy) && e.cancelable) {
            e.preventDefault();
          }
        }
      }
    },
    { passive: false },
  );

  gallery.addEventListener(
    "touchend",
    () => {
      if (!hasScrubbedTouch) {
        // Quick tap: cycle to the next photo!
        const nextIndex = (currentIndex + 1) % images.length;
        setActive(nextIndex);
      }
      // Keep the chosen photo visible on mobile (do not revert to 0 on lift!)
    },
    { passive: true },
  );

  // Also support click (desktop click or tablet tap)
  gallery.addEventListener("click", () => {
    if (!hasScrubbedTouch) {
      const nextIndex = (currentIndex + 1) % images.length;
      setActive(nextIndex);
    }
  });
});

  // --- RETRO CASSETTE MUSIC PLAYER & PIXEL PLATYPUS MASCOT ---
  const deckCard = document.getElementById("cassette-deck-card");
  const cassetteAudio = document.getElementById("cassette-audio-element");
  const mascot = document.getElementById("mascot-platypus");
  const mascotBubble = document.getElementById("mascot-bubble");
  const mascotBubbleText = document.getElementById("mascot-bubble-text");
  const mascotSpeechBubble = document.getElementById("mascot-speech-bubble");
  const mascotSpeechText = document.getElementById("mascot-speech-text");
  let speechTimer = null;
  let isMascotHovered = false;

  function isHoveringMascot() {
    if (!mascot) return false;
    try {
      return isMascotHovered || mascot.matches(":hover");
    } catch (e) {
      return isMascotHovered;
    }
  }

  function showMascotSpeech(text, duration = 1400) {
    if (!mascotSpeechText || !mascot) return;
    mascotSpeechText.innerHTML = text;
    mascot.classList.add("is-speaking");
    if (speechTimer) clearTimeout(speechTimer);
    speechTimer = setTimeout(() => {
      if (mascot) mascot.classList.remove("is-speaking");
      if (mascotSpeechText) mascotSpeechText.innerHTML = "";
    }, duration);
  }

  const playlist = [
    "assets/audio/purpose_is_glorious.mp3",
    "assets/audio/lofi_chill.mp3",
  ];
  let currentTrackIndex = Math.floor(Math.random() * playlist.length);
  let isPlaying = true;

  function loadTrack(index) {
    currentTrackIndex = index;
    if (cassetteAudio) {
      cassetteAudio.src = playlist[currentTrackIndex];
      cassetteAudio.load();
    }
  }

  function playNextTrack() {
    const nextIndex =
      (currentTrackIndex +
        1 +
        Math.floor(Math.random() * (playlist.length - 1))) %
      playlist.length;
    loadTrack(nextIndex);
    if (isPlaying) {
      playMusic();
    }
  }

  function togglePlayState() {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  function playMusic() {
    isPlaying = true;
    if (deckCard) {
      deckCard.classList.add("is-playing");
      deckCard.setAttribute("title", "Click to Play / Pause Music");
    }
    if (mascot) {
      mascot.classList.add("is-playing");
      mascot.setAttribute("title", "Click to Pause Lo-Fi Beats");
      if (mascotBubbleText) {
        mascotBubbleText.textContent = "Lo-Fi Beats ♫ (Click to pause)";
      }
    }

    if (cassetteAudio) {
      cassetteAudio.volume = 0.75;
      const playPromise = cassetteAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay delayed until user interaction per browser policy
        });
      }
    }
  }

  function pauseMusic() {
    isPlaying = false;
    if (deckCard) {
      deckCard.classList.remove("is-playing");
      deckCard.setAttribute("title", "Click to Play / Pause Music");
    }
    if (mascot) {
      mascot.classList.remove("is-playing");
      mascot.classList.remove("is-walking");
      mascot.classList.remove("is-hopping");
      mascot.setAttribute("title", "Click to Play Lo-Fi Beats");
      if (mascotBubbleText) {
        mascotBubbleText.textContent = "Zzz... (Click to play)";
      }
    }

    if (cassetteAudio) {
      cassetteAudio.pause();
    }
  }

  if (cassetteAudio) {
    // Initialize with randomly selected track
    loadTrack(currentTrackIndex);

    // Automatically shuffle to next track when song finishes
    cassetteAudio.addEventListener("ended", () => {
      playNextTrack();
    });
  }

  if (deckCard) {
    deckCard.addEventListener("click", () => {
      togglePlayState();
    });

    deckCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        togglePlayState();
      }
    });
  }

  // --- WALKING PIXEL PLATYPUS COMPANION ENGINE ---
  const STORAGE_KEY_X = "ved_platypus_x";
  const STORAGE_KEY_DIR = "ved_platypus_dir";

  let savedX = null;
  let savedDir = null;
  try {
    savedX = sessionStorage.getItem(STORAGE_KEY_X);
    savedDir = sessionStorage.getItem(STORAGE_KEY_DIR);
  } catch (e) {}

  let mascotX =
    savedX !== null && !isNaN(parseFloat(savedX))
      ? parseFloat(savedX)
      : Math.max(20, window.innerWidth - 120);

  let walkDirection = savedDir === "1" ? 1 : -1;
  let currentSpeed = 44; // pixels per second
  let behaviorState = "walk"; // "walk", "groove", "hop", "sniff", "jam"
  let behaviorTimer = 2.5 + Math.random() * 3;
  let sniffTurned = false;
  let hopTimer = null;
  let lastFrameTime = performance.now();
  let lastSaveTime = 0;

  function updateMascotFacing() {
    if (!mascot) return;
    if (walkDirection === -1) {
      mascot.classList.add("facing-left");
    } else {
      mascot.classList.remove("facing-left");
    }
  }
  updateMascotFacing();

  function triggerCornerHop() {
    if (!mascot) return;
    mascot.classList.add("is-hopping");
    if (hopTimer) clearTimeout(hopTimer);
    hopTimer = setTimeout(() => {
      mascot.classList.remove("is-hopping");
    }, 550);
  }

  function clearSpecialBehaviors() {
    if (!mascot) return;
    mascot.classList.remove("is-jamming");
    mascot.classList.remove("is-hopping");
    mascot.classList.remove("is-sniffing");
    mascot.classList.remove("is-digging");
    mascot.classList.remove("is-found-cd");
    mascot.classList.remove("is-eating-cd");
  }

  let sniffCount = 0;
  let easterEggTimer = null;

  function startDiggingEasterEgg() {
    behaviorState = "dig_find";
    clearSpecialBehaviors();
    mascot.classList.remove("is-walking");
    mascot.classList.add("is-digging");
    showMascotSpeech("*dig dig!*", 1400);

    if (easterEggTimer) clearTimeout(easterEggTimer);
    easterEggTimer = setTimeout(() => {
      if (!mascot) return;
      mascot.classList.remove("is-digging");
      mascot.classList.add("is-found-cd");
      showMascotSpeech("✦ CD! ✦", 1200);

      easterEggTimer = setTimeout(() => {
        if (!mascot) return;
        mascot.classList.remove("is-found-cd");
        mascot.classList.add("is-eating-cd");
        showMascotSpeech("*nom nom!* ♫", 1300);

        easterEggTimer = setTimeout(() => {
          if (!mascot) return;
          mascot.classList.remove("is-eating-cd");
          triggerCornerHop();
          behaviorState = "walk";
          behaviorTimer = 2.5 + Math.random() * 2.5;
          currentSpeed = 38 + Math.random() * 14;
          updateMascotFacing();
        }, 1300);
      }, 1200);
    }, 1400);
  }

  function pickNextBehavior(currentX, minX, maxX) {
    clearSpecialBehaviors();

    // If close to left edge, turn right and corner hop
    if (currentX <= minX + 16) {
      walkDirection = 1;
      updateMascotFacing();
      if (Math.random() < 0.5) {
        behaviorState = "hop";
        behaviorTimer = 0.55;
        triggerCornerHop();
      } else {
        behaviorState = "walk";
        behaviorTimer = 2.5 + Math.random() * 3.0;
        currentSpeed = 38 + Math.random() * 14;
      }
      return;
    }

    // If close to right edge, turn left and corner hop
    if (currentX >= maxX - 16) {
      walkDirection = -1;
      updateMascotFacing();
      if (Math.random() < 0.5) {
        behaviorState = "hop";
        behaviorTimer = 0.55;
        triggerCornerHop();
      } else {
        behaviorState = "walk";
        behaviorTimer = 2.5 + Math.random() * 3.0;
        currentSpeed = 38 + Math.random() * 14;
      }
      return;
    }

    // Mid-screen autonomous character actions (NO RANDOM JUMPS!)
    const roll = Math.random();
    if (roll < 0.38) {
      // 1. Casual Stroll (with slight chance to flip direction)
      if (Math.random() < 0.22) {
        walkDirection = -walkDirection;
        updateMascotFacing();
      }
      behaviorState = "walk";
      behaviorTimer = 2.4 + Math.random() * 3.6;
      currentSpeed = 36 + Math.random() * 16;
    } else if (roll < 0.65) {
      // 2. Lo-Fi Beat Groove (stand still and vibe)
      behaviorState = "groove";
      behaviorTimer = 2.2 + Math.random() * 2.8;
    } else if (roll < 0.86) {
      // 3. Headphone Jam & Fast Tail Wag (character action in place of random jump)
      behaviorState = "jam";
      behaviorTimer = 2.2 + Math.random() * 2.5;
      mascot.classList.add("is-jamming");
    } else {
      // 4. Curious Search & Sniff Action
      sniffCount++;
      if (sniffCount >= 6) {
        sniffCount = 0;
        startDiggingEasterEgg();
      } else {
        behaviorState = "sniff";
        behaviorTimer = 3.0 + Math.random() * 0.6;
        sniffTurned = false;
        mascot.classList.add("is-sniffing");
      }
    }
  }

  // --- CASSETTE RUNNING & DOCKING LOGIC ---
  let isDockedOnCassette = false;
  let isApproachingCassette = false;
  let pickUpTimer = null;

  function updateMascotDocking(dt) {
    if (!deckCard || !mascot) return false;

    const tapeImg = deckCard.querySelector(".cassette-tape-art") || deckCard;
    const tapeRect = tapeImg.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check visibility and scroll position
    const isCassetteVisible =
      tapeRect.top < windowHeight - 20 && tapeRect.bottom > 60;
    const isAtBottom =
      windowHeight + window.scrollY >=
      document.documentElement.scrollHeight - 380;

    if (isCassetteVisible && isAtBottom) {
      const cassetteLeftRim =
        tapeRect.left + Math.max(16, tapeRect.width * 0.12);
      const cassetteTopRim = tapeRect.top + tapeRect.height * (70 / 352);
      const mascotH = mascot.offsetHeight || 68;
      const baseY = windowHeight - 12 - mascotH;
      const targetDockY = cassetteTopRim - 36 - baseY;
      const targetDockX = cassetteLeftRim;

      // Immediately freeze and stop if user is hovering the mascot
      if (isHoveringMascot()) {
        mascot.classList.remove("is-running");
        mascot.classList.remove("is-walking");
        if (isDockedOnCassette) {
          mascot.style.transform = `translate3d(${targetDockX}px, ${targetDockY}px, 0)`;
        } else {
          mascot.style.transform = `translate3d(${mascotX}px, 0, 0)`;
        }
        return true;
      }

      const distX = targetDockX - mascotX;

      if (!isDockedOnCassette) {
        if (Math.abs(distX) > 10) {
          isApproachingCassette = true;
          clearSpecialBehaviors();
          mascot.classList.remove("is-docked");
          mascot.classList.add("is-running");
          mascot.classList.add("is-walking");

          walkDirection = distX > 0 ? 1 : -1;
          updateMascotFacing();

          const runSpeed = 135; // brisk waddle run (px/s)
          mascotX += walkDirection * runSpeed * dt;
          if (
            (walkDirection === 1 && mascotX >= targetDockX) ||
            (walkDirection === -1 && mascotX <= targetDockX)
          ) {
            mascotX = targetDockX;
          }

          // Stay on ground plane while running!
          mascot.style.transform = `translate3d(${mascotX}px, 0, 0)`;
          return true;
        } else {
          // Reached horizontal alignment: Step onto the cassette!
          mascotX = targetDockX;
          isApproachingCassette = false;
          isDockedOnCassette = true;
          clearSpecialBehaviors();
          mascot.classList.remove("is-running");
          mascot.classList.remove("is-walking");
          walkDirection = 1; // Always face right when perched on cassette
          updateMascotFacing();
          mascot.classList.add("is-docked");
        }
      }

      if (isDockedOnCassette) {
        // Sit firmly on top-left rim of the cassette casing
        mascot.style.transform = `translate3d(${targetDockX}px, ${targetDockY}px, 0)`;
        return true;
      }
    } else if (isDockedOnCassette || isApproachingCassette) {
      // User scrolled up: Automatically pick up mascot from cassette!
      const wasDocked = isDockedOnCassette;
      isDockedOnCassette = false;
      isApproachingCassette = false;
      clearSpecialBehaviors();
      mascot.classList.remove("is-docked");
      mascot.classList.remove("is-running");

      if (wasDocked) {
        mascot.classList.add("is-picked-up");
        if (pickUpTimer) clearTimeout(pickUpTimer);
        pickUpTimer = setTimeout(() => {
          mascot.classList.remove("is-picked-up");
        }, 450);
      }

      walkDirection = 1; // Always face and step rightward into the open screen when leaving cassette
      updateMascotFacing();
      behaviorState = "walk";
      behaviorTimer = 2.0 + Math.random() * 2.0;
      currentSpeed = 38 + Math.random() * 12;
    }

    return false;
  }

  function mascotAnimationLoop(now) {
    const dt = Math.min(0.1, (now - lastFrameTime) / 1000);
    lastFrameTime = now;

    if (mascot) {
      const isHandlingDocking = updateMascotDocking(dt);

      if (!isHandlingDocking) {
        const mascotWidth = mascot.offsetWidth || 68;
        const minX = 14;
        const maxX = Math.max(minX, window.innerWidth - mascotWidth - 14);

        const isAlarmed =
          mascot.classList.contains("is-falling") ||
          mascot.classList.contains("is-angry");

        const isHovered = isHoveringMascot();

        if (
          isPlaying &&
          !isAlarmed &&
          !isHovered &&
          behaviorState !== "dig_find"
        ) {
          behaviorTimer -= dt;

          if (behaviorState === "walk") {
            updateMascotFacing();
            mascotX += walkDirection * currentSpeed * dt;
            mascot.classList.add("is-walking");

            // Collision with edges
            if (mascotX <= minX) {
              mascotX = minX;
              pickNextBehavior(mascotX, minX, maxX);
            } else if (mascotX >= maxX) {
              mascotX = maxX;
              pickNextBehavior(mascotX, minX, maxX);
            } else if (behaviorTimer <= 0) {
              pickNextBehavior(mascotX, minX, maxX);
            }
          } else if (behaviorState === "sniff") {
            mascot.classList.remove("is-walking");
            mascot.classList.add("is-sniffing");

            // Halfway through sniffing (after ~1.6s), turn around to search & sniff the other direction!
            if (behaviorTimer <= 1.6 && !sniffTurned) {
              sniffTurned = true;
              walkDirection = -walkDirection;
              updateMascotFacing();
            }

            if (behaviorTimer <= 0) {
              pickNextBehavior(mascotX, minX, maxX);
            }
          } else {
            // Standing, grooving, jamming, or corner hop
            mascot.classList.remove("is-walking");
            if (behaviorTimer <= 0) {
              pickNextBehavior(mascotX, minX, maxX);
            }
          }
        } else if (isHovered) {
          mascot.classList.remove("is-walking");
          mascot.classList.remove("is-running");
        } else if (behaviorState === "dig_find") {
          mascot.classList.remove("is-walking");
        } else {
          // Audio paused (taking a nap) or startled by scroll
          mascot.classList.remove("is-walking");
          mascot.classList.remove("is-hopping");
          mascot.classList.remove("is-jamming");
          mascot.classList.remove("is-sniffing");
        }

        // Clamp within screen bounds
        if (mascotX < minX) mascotX = minX;
        if (mascotX > maxX) mascotX = maxX;

        // GPU accelerated translate3d
        mascot.style.transform = `translate3d(${mascotX}px, 0, 0)`;

        // Throttle save position to sessionStorage (every 400ms)
        if (now - lastSaveTime > 400) {
          lastSaveTime = now;
          try {
            sessionStorage.setItem(STORAGE_KEY_X, mascotX.toFixed(1));
            sessionStorage.setItem(STORAGE_KEY_DIR, walkDirection.toString());
          } catch (e) {}
        }
      }
    }

    requestAnimationFrame(mascotAnimationLoop);
  }

  requestAnimationFrame(mascotAnimationLoop);

  window.addEventListener("beforeunload", () => {
    try {
      sessionStorage.setItem(STORAGE_KEY_X, mascotX.toFixed(1));
      sessionStorage.setItem(STORAGE_KEY_DIR, walkDirection.toString());
    } catch (e) {}
  });

  if (mascot) {
    let petStrokeDist = 0;
    let lastPetX = null;
    let lastPetY = null;
    let strokeReversals = 0;
    let lastDirX = 0;
    let isPetPurring = false;
    let petAfterglowTimer = null;
    let petStrokeDecayTimer = null;

    let autoPetBubbleTimer = null;
    let autoPetHideTimer = null;

    let touchPetStrokeDist = 0;
    let touchLastX = null;
    let touchLastY = null;
    let touchStrokeReversals = 0;
    let touchLastDirX = 0;
    let hasPettedOnTouch = false;
    let suppressNextClick = false;

    const stopPetPurr = (immediate = false) => {
      petStrokeDist = 0;
      lastPetX = null;
      lastPetY = null;
      strokeReversals = 0;
      lastDirX = 0;
      touchPetStrokeDist = 0;
      touchLastX = null;
      touchLastY = null;
      touchStrokeReversals = 0;
      touchLastDirX = 0;
      if (petStrokeDecayTimer) clearTimeout(petStrokeDecayTimer);
      if (petAfterglowTimer) clearTimeout(petAfterglowTimer);

      const finishStop = () => {
        isPetPurring = false;
        if (mascot) {
          mascot.classList.remove("is-purring");
          mascot.classList.remove("is-speaking");
        }
        if (mascotSpeechText) mascotSpeechText.innerHTML = "";

        // Tooltip only gently returns after the peaceful purr afterglow finishes
        if (isMascotHovered && mascotBubbleText) {
          mascotBubbleText.textContent = isPlaying
            ? "Lo-Fi Beats ♫ (Click to pause)"
            : "Zzz... (Click to play)";
        }
        scheduleNextAutoPetBubble(true);
      };

      if (immediate) {
        finishStop();
      } else {
        // Peaceful 1.6s purr afterglow: tooltip does NOT immediately reappear!
        petAfterglowTimer = setTimeout(finishStop, 1600);
      }
    };

    const startPetPurr = () => {
      if (behaviorState === "dig_find") return;
      isPetPurring = true;
      if (speechTimer) clearTimeout(speechTimer);
      if (petAfterglowTimer) clearTimeout(petAfterglowTimer);

      mascot.classList.add("is-purring");
      mascot.classList.add("is-speaking");
      mascot.classList.remove("show-auto-bubble");

      if (mascotSpeechText) {
        mascotSpeechText.innerHTML =
          'purr purr~ <span class="heart-pink">♡</span>';
      }
    };

    const handleMascotMouseMove = (e) => {
      if (lastPetX !== null && lastPetY !== null) {
        const dx = e.clientX - lastPetX;
        const dy = e.clientY - lastPetY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Filter micro-jitters
        if (dist > 1.8) {
          petStrokeDist += dist;

          // Detect gentle back-and-forth direction reversals (natural petting)
          if (Math.abs(dx) > 3) {
            const dirX = Math.sign(dx);
            if (lastDirX !== 0 && dirX !== lastDirX) {
              strokeReversals++;
            }
            lastDirX = dirX;
          }

          // Intentional petting requirement:
          // Must rub back-and-forth (at least 2 direction reversals and >= 65px stroke distance),
          // or do a continuous deliberate stroke of >= 110px across the body.
          // Slight hover drift (20-30px) will NEVER trigger this!
          if (
            (strokeReversals >= 2 && petStrokeDist >= 55) ||
            petStrokeDist >= 110
          ) {
            startPetPurr();
            petStrokeDist = 0;
            strokeReversals = 0;
          }
        }
      }

      lastPetX = e.clientX;
      lastPetY = e.clientY;

      if (!isPetPurring) {
        // Decay stroke if cursor pauses without completing a pet stroke
        if (petStrokeDecayTimer) clearTimeout(petStrokeDecayTimer);
        petStrokeDecayTimer = setTimeout(() => {
          petStrokeDist = 0;
          strokeReversals = 0;
        }, 450);
      } else {
        // While purring, keep purring active; if cursor stops moving, start afterglow
        if (petAfterglowTimer) clearTimeout(petAfterglowTimer);
        petAfterglowTimer = setTimeout(() => {
          stopPetPurr(false);
        }, 400);
      }
    };

    // --- AUTOMATIC SPONTANEOUS "PET ME! ♡" POPUP ---
    function scheduleNextAutoPetBubble(afterPet = false) {
      if (autoPetBubbleTimer) clearTimeout(autoPetBubbleTimer);
      // Truly random spontaneous intervals:
      // - After being petted: longer contented rest (45s - 90s)
      // - Normal roaming: wide, unpredictable interval (24s - 68s)
      const baseDelay = afterPet ? 45000 : 24000;
      const randomJitter = afterPet
        ? Math.random() * 45000
        : Math.random() * 44000;
      const delay = baseDelay + randomJitter;
      autoPetBubbleTimer = setTimeout(triggerAutoPetBubble, delay);
    }

    function triggerAutoPetBubble() {
      if (
        !isMascotHovered &&
        mascot &&
        isPlaying &&
        !mascot.classList.contains("is-speaking") &&
        !mascot.classList.contains("is-purring") &&
        !mascot.classList.contains("is-falling") &&
        !mascot.classList.contains("is-angry") &&
        behaviorState !== "dig_find"
      ) {
        if (mascotBubbleText) {
          mascotBubbleText.innerHTML =
            'Pet me! <span class="heart-pink">♡</span>';
        }
        mascot.classList.add("show-auto-bubble");

        if (autoPetHideTimer) clearTimeout(autoPetHideTimer);
        autoPetHideTimer = setTimeout(() => {
          if (mascot) mascot.classList.remove("show-auto-bubble");
          setTimeout(() => {
            if (!isMascotHovered && mascotBubbleText && !isPetPurring) {
              mascotBubbleText.textContent = isPlaying
                ? "Lo-Fi Beats ♫ (Click to pause)"
                : "Zzz... (Click to play)";
            }
          }, 350);
          scheduleNextAutoPetBubble();
        }, 2800);
      } else {
        scheduleNextAutoPetBubble();
      }
    }

    scheduleNextAutoPetBubble();

    const setHover = () => {
      isMascotHovered = true;
      mascot.classList.remove("is-walking");
      mascot.classList.remove("is-running");
      mascot.classList.remove("show-auto-bubble");
      if (autoPetHideTimer) clearTimeout(autoPetHideTimer);

      petStrokeDist = 0;
      lastPetX = null;
      lastPetY = null;
      strokeReversals = 0;
      lastDirX = 0;

      // On hover, show current music state if not already purring
      if (mascotBubbleText && !isPetPurring) {
        mascotBubbleText.textContent = isPlaying
          ? "Lo-Fi Beats ♫ (Click to pause)"
          : "Zzz... (Click to play)";
      }
    };

    const clearHover = () => {
      isMascotHovered = false;
      stopPetPurr(true);
      scheduleNextAutoPetBubble();
    };

    // Clean desktop mouse listeners (no duplicate pointer events!)
    mascot.addEventListener("mouseenter", setHover);
    mascot.addEventListener("mouseleave", clearHover);
    mascot.addEventListener("mousemove", handleMascotMouseMove);

    // Mobile & Tablet Touch Support (petting & tap handling)
    mascot.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          touchLastX = touch.clientX;
          touchLastY = touch.clientY;
          touchPetStrokeDist = 0;
          touchStrokeReversals = 0;
          touchLastDirX = 0;
          hasPettedOnTouch = false;
          suppressNextClick = false;

          mascot.classList.remove("show-auto-bubble");
          if (autoPetHideTimer) clearTimeout(autoPetHideTimer);
        }
      },
      { passive: true },
    );

    mascot.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          if (touchLastX !== null && touchLastY !== null) {
            const dx = touch.clientX - touchLastX;
            const dy = touch.clientY - touchLastY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 1.8) {
              touchPetStrokeDist += dist;

              if (Math.abs(dx) > 3) {
                const dirX = Math.sign(dx);
                if (touchLastDirX !== 0 && dirX !== touchLastDirX) {
                  touchStrokeReversals++;
                }
                touchLastDirX = dirX;
              }

              // On touch screens, petting rub (1 reversal + 32px or 52px total stroke)
              if (
                (touchStrokeReversals >= 1 && touchPetStrokeDist >= 32) ||
                touchPetStrokeDist >= 52
              ) {
                startPetPurr();
                hasPettedOnTouch = true;
                suppressNextClick = true;
                touchPetStrokeDist = 0;
                touchStrokeReversals = 0;
              }
            }
          }

          touchLastX = touch.clientX;
          touchLastY = touch.clientY;

          // Prevent page scroll when petting
          if (e.cancelable && (hasPettedOnTouch || touchPetStrokeDist > 8)) {
            e.preventDefault();
          }
        }
      },
      { passive: false },
    );

    mascot.addEventListener(
      "touchend",
      () => {
        if (hasPettedOnTouch) {
          // Finished petting on touch: run gentle afterglow
          if (petAfterglowTimer) clearTimeout(petAfterglowTimer);
          petAfterglowTimer = setTimeout(() => {
            stopPetPurr(false);
          }, 1500);

          setTimeout(() => {
            suppressNextClick = false;
          }, 450);
        } else {
          stopPetPurr(true);
        }
      },
      { passive: true },
    );

    mascot.addEventListener(
      "touchcancel",
      () => {
        stopPetPurr(true);
        suppressNextClick = false;
      },
      { passive: true },
    );

    mascot.addEventListener("click", (e) => {
      if (suppressNextClick) {
        e.preventDefault();
        e.stopPropagation();
        suppressNextClick = false;
        return;
      }
      stopPetPurr(true);
      showMascotSpeech("Ah!", 1200);
      togglePlayState();
    });

    mascot.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        stopPetPurr(true);
        showMascotSpeech("Ah!", 1200);
        togglePlayState();
      }
    });
  }

  // --- PLATYPUS SCROLL ATTITUDE ---
  let lastScrollY = window.scrollY;
  let lastScrollTime = performance.now();
  let reactionTimer = null;

  function updateMascotScrollAttitude() {
    const currentScrollY = window.scrollY;
    const now = performance.now();
    const dt = Math.max(10, now - lastScrollTime);
    const dy = currentScrollY - lastScrollY;
    const velocity = dy / dt;

    lastScrollY = currentScrollY;
    lastScrollTime = now;

    // Fast scroll down -> worried & falling
    if (dy > 20 && velocity > 0.55) {
      if (reactionTimer) clearTimeout(reactionTimer);
      mascot.classList.remove("is-angry");
      mascot.classList.remove("is-hopping");
      mascot.classList.add("is-falling");

      reactionTimer = setTimeout(() => {
        mascot.classList.remove("is-falling");
      }, 550);
    }
    // Fast scroll up -> high jolly leap & attitude
    else if (dy < -20 && velocity < -0.55) {
      if (reactionTimer) clearTimeout(reactionTimer);
      mascot.classList.remove("is-falling");
      mascot.classList.remove("is-hopping");
      mascot.classList.add("is-angry");

      reactionTimer = setTimeout(() => {
        mascot.classList.remove("is-angry");
      }, 700);
    }
  }

  window.addEventListener("scroll", updateMascotScrollAttitude, {
    passive: true,
  });
  window.addEventListener("resize", () => {
    if (mascot) {
      const mascotWidth = mascot.offsetWidth || 68;
      const maxX = Math.max(14, window.innerWidth - mascotWidth - 14);
      if (mascotX > maxX) mascotX = maxX;
    }
  });

  if (typeof lenis !== "undefined" && lenis) {
    lenis.on("scroll", () => {
      updateMascotScrollAttitude();
    });
  }

  // Autoplay on load
  playMusic();

  // If browser policy delays audio until first interaction, unlock seamlessly:
  function unlockAutoplay() {
    if (isPlaying && cassetteAudio && cassetteAudio.paused) {
      cassetteAudio.play().catch(() => {});
    }
  }
  ["click", "touchstart", "scroll", "keydown"].forEach((evt) => {
    window.addEventListener(evt, unlockAutoplay, { once: true, passive: true });
  });
