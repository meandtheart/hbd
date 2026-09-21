// ================================
// ENTER BUTTON & INITIAL SETUP
// ================================

const intro = document.getElementById("intro");
const mainSite = document.getElementById("mainSite");
const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", function () {
    // Hide intro screen
    intro.classList.add("hide");

    // Show main website after a brief pause
    setTimeout(function () {
        mainSite.classList.add("visible");
        window.scrollTo(0, 0);

        // Show the first section (hero) by default
        const heroSection = document.querySelector(".hero");
        if (heroSection) {
            heroSection.classList.add("active-section");
        }

        startRevealObserver();
    }, 700);
});


// ================================
// SAFE GRID SCREEN SWITCHER
// ================================

const scrollButtons = document.querySelectorAll(".scroll-btn");
const allSections = document.querySelectorAll("#mainSite .section, #mainSite .secret-section");

scrollButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const targetId = button.getAttribute("data-target");
        const target = document.getElementById(targetId);

        if (target) {
            // Remove active and direction classes from all sections
            allSections.forEach(function (sec) {
                sec.classList.remove(
                    "active-section",
                    "slide-from-top",
                    "slide-from-right",
                    "fade-in-only",
                    "fade-out-style",
                    "final-cinematic-reveal"
                );
            });

            // Assign the correct transition effect based on your custom flow
            if (targetId === "birthday" || targetId === "unknown" || targetId === "letter") {
                target.classList.add("slide-from-top");
            } else if (targetId === "story" || targetId === "timeline") {
                target.classList.add("slide-from-right");
            } else if (targetId === "archive" || targetId === "things") {
                target.classList.add("fade-in-only");
            } else if (targetId === "music") {
                target.classList.add("fade-out-style");
            } else if (targetId === "final-section") {
                target.classList.add("final-cinematic-reveal");
            } else {
                target.classList.add("fade-in-only");
            }

            // Activate the target section right in place
            target.classList.add("active-section");

            // Gently scroll to the top of the new section after the transition starts
            setTimeout(function () {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }, 300);
        }
    });
});

// ================================
// SCROLL REVEAL
// ================================

function startRevealObserver() {

    const elements = document.querySelectorAll(
        ".timeline-item, .thing-card, .unknown-item, .photo-stack, .letter-paper, .music-card"
    );

    elements.forEach(function (element) {
        element.classList.add("reveal");
    });

    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.1
    });

    elements.forEach(function (element) {
        observer.observe(element);
    });
}


// ================================
// SECRET ECLIPSE
// ================================

const eclipseButton = document.getElementById("eclipseButton");
const secretOverlay = document.getElementById("secretOverlay");
const closeSecret = document.getElementById("closeSecret");

eclipseButton.addEventListener("click", function () {

    secretOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

});

closeSecret.addEventListener("click", function () {

    secretOverlay.classList.remove("active");
    document.body.style.overflow = "";

});


// Click outside secret box to close

secretOverlay.addEventListener("click", function (event) {

    if (event.target === secretOverlay) {

        secretOverlay.classList.remove("active");
        document.body.style.overflow = "";

    }

});


// ================================
// ESC KEY
// ================================

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        secretOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

});


// ================================
// SWIPEABLE PHOTO STACK (section 5)
// ================================

(function () {

    const stack = document.getElementById("photoStack");
    const dotsBox = document.getElementById("photoDots");

    if (!stack) return;

    const cards = Array.from(stack.querySelectorAll(".chat-photo"));
    if (!cards.length) return;

    // Current order, first item = photo on top
    let order = cards.slice();
    let drag = null;
    let busy = false;

    // Messy look: each position in the stack gets its own tilt + offset
    const spots = [
        { x: 0,   y: 0,  r: -1.5, s: 1    },
        { x: 14,  y: 10, r: 4,    s: 0.975 },
        { x: -12, y: 20, r: -5.5, s: 0.95 }
    ];

    function spotFor(i) {
        return spots[Math.min(i, spots.length - 1)];
    }

    function place(card, i) {
        const p = spotFor(i);
        card.style.zIndex = String(order.length - i);
        card.style.transform =
            "translate(" + p.x + "px, " + p.y + "px) " +
            "rotate(" + p.r + "deg) scale(" + p.s + ")";
        card.classList.toggle("is-top", i === 0);
    }

    function layout() {
        order.forEach(place);
        updateDots(order[0]);
    }

    // dots
    const dots = cards.map(function () {
        const dot = document.createElement("span");
        if (dotsBox) dotsBox.appendChild(dot);
        return dot;
    });

    function updateDots(topCard) {
        const active = cards.indexOf(topCard);
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === active);
        });
    }

    // Stack needs a fixed height because photos are absolutely positioned
    function fitStack() {
        const tallest = Math.max.apply(null, cards.map(function (c) {
            return c.offsetHeight;
        }));

        if (tallest > 0) {
            stack.style.height = (tallest + 40) + "px";
        }
    }

    if (window.ResizeObserver) {
        const ro = new ResizeObserver(fitStack);
        cards.forEach(function (c) { ro.observe(c); });
    }

    window.addEventListener("resize", fitStack);
    window.addEventListener("load", fitStack);
    fitStack();

    // Send the top photo away, then tuck it under the stack
    function fling(card, dir) {
        busy = true;

        const rest = order.slice(1);

        card.classList.remove("dragging");
        card.style.zIndex = "100";
        card.style.transition =
            "transform 0.45s cubic-bezier(0.4, 0, 0.9, 0.6), opacity 0.45s ease";
        card.style.transform =
            "translate(" + (dir * window.innerWidth * 0.9) + "px, 40px) " +
            "rotate(" + (dir * 24) + "deg)";
        card.style.opacity = "0";

        // the next photo moves up right away
        rest.forEach(function (c, i) {
            place(c, i);
        });
        updateDots(rest[0] || card);

        setTimeout(function () {
            order = rest.concat(card);

            card.style.transition = "none";
            place(card, order.length - 1);
            void card.offsetWidth;          // apply the jump before re-enabling animation
            card.style.transition = "";
            card.style.opacity = "";

            busy = false;
        }, 460);
    }

    function snapBack(card) {
        card.classList.remove("dragging");
        card.style.transition = "";
        place(card, 0);
    }

    stack.addEventListener("pointerdown", function (event) {
        if (busy || drag) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;

        const card = event.target.closest(".chat-photo");
        if (!card || card !== order[0]) return;

        drag = {
            card: card,
            id: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            dx: 0,
            time: performance.now()
        };

        card.classList.add("dragging");

        try { card.setPointerCapture(event.pointerId); } catch (e) {}
    });

    stack.addEventListener("pointermove", function (event) {
        if (!drag || event.pointerId !== drag.id) return;

        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        const p = spotFor(0);

        drag.dx = dx;

        drag.card.style.transform =
            "translate(" + (p.x + dx) + "px, " + (p.y + dy * 0.25) + "px) " +
            "rotate(" + (p.r + dx * 0.06) + "deg)";
    });

    function endDrag(event, cancelled) {
        if (!drag || event.pointerId !== drag.id) return;

        const card = drag.card;
        const dx = drag.dx;
        const elapsed = Math.max(performance.now() - drag.time, 1);
        const speed = Math.abs(dx) / elapsed;   // px per ms

        drag = null;

        const farEnough = Math.abs(dx) > 80;
        const quickFlick = Math.abs(dx) > 35 && speed > 0.5;

        if (!cancelled && (farEnough || quickFlick)) {
            fling(card, dx > 0 ? 1 : -1);
        } else {
            snapBack(card);
        }
    }

    stack.addEventListener("pointerup", function (event) { endDrag(event, false); });
    stack.addEventListener("pointercancel", function (event) { endDrag(event, true); });

    layout();

})();


// ================================
// MUSIC (any number of songs, one plays at a time)
// ================================

const tracks = document.querySelectorAll(".track");

function setSongState(track, isPlaying) {

    const icon = track.querySelector(".music-icon");
    const button = track.querySelector(".music-button");

    track.classList.toggle("playing", isPlaying);

    if (icon) icon.textContent = isPlaying ? "Ⅱ" : "▶";
    if (button) button.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
}

tracks.forEach(function (track) {

    const audio = track.querySelector(".song-audio");
    const button = track.querySelector(".music-button");

    if (!audio || !button) return;

    button.addEventListener("click", function () {

        if (audio.paused) {

            // stop every other song first
            tracks.forEach(function (other) {

                if (other === track) return;

                const otherAudio = other.querySelector(".song-audio");

                if (otherAudio && !otherAudio.paused) {
                    otherAudio.pause();
                }

                setSongState(other, false);
            });

            audio.play()
                .then(function () {
                    setSongState(track, true);
                })
                .catch(function () {
                    const source = audio.querySelector("source");
                    const path = source ? source.getAttribute("src") : "assets/song.mp3";

                    alert("Put your music file at " + path);
                });

        } else {

            audio.pause();
            setSongState(track, false);

        }

    });

});


// ================================
// PREVENT IMAGE DRAGGING
// ================================

document.querySelectorAll("img").forEach(function (image) {

    image.addEventListener("dragstart", function (event) {

        event.preventDefault();

    });

});


// ================================
// SWIPE GESTURE SUPPORT
// ================================

let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let swipeStartedOnStack = false;

// Define the ordered list of section IDs matching your navigation flow
const sectionOrder = [
    "hero",         // Note: Give your hero section id="hero" in index.html if it doesn't have one
    "birthday",
    "story",
    "timeline",
    "archive",
    "music",
    "things",
    "unknown",
    "letter",
    "final-section"
];

const mainSiteContainer = document.getElementById("mainSite");

if (mainSiteContainer) {
    mainSiteContainer.addEventListener("touchstart", function (event) {
        // Swiping the photos in section 5 must not flip the page
        swipeStartedOnStack = !!event.target.closest(".photo-stack");
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }, { passive: true });

    mainSiteContainer.addEventListener("touchend", function (event) {
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
        handleSwipeGesture();
    }, { passive: true });
}

function handleSwipeGesture() {
    if (swipeStartedOnStack) {
        swipeStartedOnStack = false;
        return;
    }

    const swipeThreshold = 90; // Minimum horizontal distance required for a swipe
    const maxVerticalRatio = 0.5; // Vertical movement must stay well below horizontal to count as a swipe
    const diff = touchEndX - touchStartX;
    const verticalDiff = Math.abs(touchEndY - touchStartY);

    if (Math.abs(diff) < swipeThreshold) return; // Ignore accidental micro-swipes
    if (verticalDiff > Math.abs(diff) * maxVerticalRatio) return; // Ignore mostly-vertical scrolls

    // Find the currently active section
    const activeSection = document.querySelector("#mainSite .section.active-section");
    if (!activeSection) return;

    let activeId = activeSection.id;
    
    // Fallback if hero section doesn't have an explicit id="hero" in html
    if (!activeId && activeSection.classList.contains("hero")) {
        activeId = "hero";
    }

    const currentIndex = sectionOrder.indexOf(activeId);
    if (currentIndex === -1) return;

    let targetId = null;

    if (diff < 0) {
        // Swiped Left -> Go Forward to the next section
        if (currentIndex < sectionOrder.length - 1) {
            targetId = sectionOrder[currentIndex + 1];
        }
    } else {
        // Swiped Right -> Go Backward to the previous section
        if (currentIndex > 0) {
            targetId = sectionOrder[currentIndex - 1];
        }
    }

    // If a valid target section exists, find its button and simulate a click to run your animation logic
    if (targetId) {
        // Special case for hero section since it uses a class scroll-btn with data-target="birthday"
        let targetButton = document.querySelector(`.scroll-btn[data-target="${targetId}"]`);
        
        if (targetButton) {
            targetButton.click();
        } else {
            // If a button isn't explicitly wired up for that transition, manually trigger the transition logic
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                allSections.forEach(function (sec) {
                    sec.classList.remove(
                        "active-section",
                        "slide-from-top",
                        "slide-from-right",
                        "fade-in-only",
                        "fade-out-style",
                        "final-cinematic-reveal"
                    );
                });
                targetElement.classList.add("fade-in-only", "active-section");
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    }
}