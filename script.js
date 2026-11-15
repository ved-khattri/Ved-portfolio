/*---NAVBAR SCROLL---*/
const navbar = document.getElementById("navbar");
const navContainer = document.getElementById("nav-container");
const navLinksList = document.querySelectorAll(".nav-link");
const trackedSections = document.querySelectorAll("section[id]");

let isScrolled = false;
let ticking = false;

function updateNavbar(scrollVal) {
  const scrollY = typeof scrollVal === "number" ? scrollVal : (window.scrollY || window.pageYOffset || 0);

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

/*---3D HOVER EFFECT---*/
document.querySelectorAll(".hover-3d").forEach((container) => {
  const content = container.firstElementChild;
  if (!content) return;

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    content.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  container.addEventListener("mouseleave", () => {
    content.style.transform = "";
  });
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

/*---HOVER GALLERY---*/
const hoverGalleries = document.querySelectorAll(".hover-gallery");
hoverGalleries.forEach((gallery) => {
  const images = gallery.querySelectorAll(".poster-portrait-img, img");
  if (!images.length) return;

  function setActive(index) {
    images.forEach((img, i) => {
      img.style.opacity = i === index ? "1" : "0";
    });
  }

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

  gallery.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches && e.touches[0]) {
        const rect = gallery.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const progress = Math.max(0, Math.min(x / rect.width, 0.999));
        const activeIndex = Math.floor(progress * images.length);
        setActive(activeIndex);
      }
    },
    { passive: true },
  );

  gallery.addEventListener("touchend", () => {
    setActive(0);
  });

  // --- RETRO CASSETTE MUSIC PLAYER & PIXEL PLATYPUS MASCOT ---
  const deckCard = document.getElementById("cassette-deck-card");
  const cassetteAudio = document.getElementById("cassette-audio-element");
  const mascot = document.getElementById("mascot-platypus");
  const mascotBubbleText = document.getElementById("mascot-bubble-text");

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
    if (deckCard) deckCard.classList.add("is-playing");
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
    if (deckCard) deckCard.classList.remove("is-playing");
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
  let behaviorState = "walk"; // "walk", "groove", "hop", "look_around"
  let behaviorTimer = 2.5 + Math.random() * 3;
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

  function triggerJollyHop() {
    if (!mascot) return;
    mascot.classList.add("is-hopping");
    if (hopTimer) clearTimeout(hopTimer);
    hopTimer = setTimeout(() => {
      mascot.classList.remove("is-hopping");
    }, 550);
  }

  function pickNextBehavior(currentX, minX, maxX) {
    // If close to left edge, turn right
    if (currentX <= minX + 20) {
      walkDirection = 1;
      updateMascotFacing();
      if (Math.random() < 0.4) {
        behaviorState = "hop";
        behaviorTimer = 0.6;
        triggerJollyHop();
      } else {
        behaviorState = "walk";
        behaviorTimer = 2.5 + Math.random() * 3.5;
        currentSpeed = 38 + Math.random() * 16;
      }
      return;
    }
    // If close to right edge, turn left
    if (currentX >= maxX - 20) {
      walkDirection = -1;
      updateMascotFacing();
      if (Math.random() < 0.4) {
        behaviorState = "hop";
        behaviorTimer = 0.6;
        triggerJollyHop();
      } else {
        behaviorState = "walk";
        behaviorTimer = 2.5 + Math.random() * 3.5;
        currentSpeed = 38 + Math.random() * 16;
      }
      return;
    }

    // Mid-screen random autonomous choices (non-linear wandering)
    const roll = Math.random();
    if (roll < 0.38) {
      // 1. Walk in current direction (or 20% chance to turn around)
      if (Math.random() < 0.22) {
        walkDirection = -walkDirection;
        updateMascotFacing();
      }
      behaviorState = "walk";
      behaviorTimer = 2.0 + Math.random() * 4.0;
      currentSpeed = 38 + Math.random() * 16;
    } else if (roll < 0.65) {
      // 2. Stop and groove to the lo-fi beats
      behaviorState = "groove";
      behaviorTimer = 2.0 + Math.random() * 3.0;
    } else if (roll < 0.85) {
      // 3. Jolly Little Hop in place!
      behaviorState = "hop";
      behaviorTimer = 0.65;
      triggerJollyHop();
    } else {
      // 4. Look around curiously
      behaviorState = "look_around";
      behaviorTimer = 1.2;
      walkDirection = -walkDirection;
      updateMascotFacing();
    }
  }

  // --- CASSETTE DOCKING (SITTING ON TOP-LEFT AT BOTTOM) ---
  let isDockedOnCassette = false;
  let undockTimer = null;

  function updateMascotDocking() {
    if (!deckCard || !mascot) return false;

    const deckRect = deckCard.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const isCassetteVisible =
      deckRect.top < windowHeight - 40 && deckRect.bottom > 60;
    const isAtBottom =
      windowHeight + window.scrollY >=
      document.documentElement.scrollHeight - 380;

    if (isCassetteVisible && isAtBottom) {
      if (!isDockedOnCassette) {
        isDockedOnCassette = true;
        mascot.classList.add("is-docked");
        mascot.classList.remove("facing-left");
        mascot.classList.remove("is-walking");
        mascot.classList.remove("is-hopping");
        if (undockTimer) clearTimeout(undockTimer);
      }

      // Exact pixel coordinates resting on top-left of the red cassette casing
      const targetViewportX = deckRect.left + 22;
      const targetViewportY = deckRect.top - 24;
      const mascotH = mascot.offsetHeight || 68;
      const baseY = windowHeight - 12 - mascotH;
      const transY = targetViewportY - baseY;

      mascot.style.transform = `translate3d(${targetViewportX}px, ${transY}px, 0)`;
      return true;
    } else if (isDockedOnCassette) {
      isDockedOnCassette = false;
      mascot.classList.remove("is-docked");
      mascot.classList.add("is-undocking");
      if (undockTimer) clearTimeout(undockTimer);
      undockTimer = setTimeout(() => {
        mascot.classList.remove("is-undocking");
      }, 420);
    }

    return false;
  }

  function mascotAnimationLoop(now) {
    const dt = Math.min(0.1, (now - lastFrameTime) / 1000);
    lastFrameTime = now;

    if (mascot) {
      const isDocked = updateMascotDocking();

      if (!isDocked) {
        const mascotWidth = mascot.offsetWidth || 68;
        const minX = 14;
        const maxX = Math.max(minX, window.innerWidth - mascotWidth - 14);

        const isAlarmed =
          mascot.classList.contains("is-falling") ||
          mascot.classList.contains("is-angry");

        if (isPlaying && !isAlarmed) {
          behaviorTimer -= dt;

          if (behaviorState === "walk") {
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
          } else {
            // Standing, grooving, hopping, or looking around
            mascot.classList.remove("is-walking");
            if (behaviorTimer <= 0) {
              pickNextBehavior(mascotX, minX, maxX);
            }
          }
        } else {
          // Audio paused (taking a nap) or startled by scroll
          mascot.classList.remove("is-walking");
          mascot.classList.remove("is-hopping");
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
    mascot.addEventListener("click", () => {
      togglePlayState();
      if (isPlaying) {
        triggerJollyHop();
      }
    });

    mascot.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        togglePlayState();
        if (isPlaying) {
          triggerJollyHop();
        }
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
});
