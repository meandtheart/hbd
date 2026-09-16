/* =========================================================
   PAGE SYSTEM
========================================================= */

const pages = document.querySelectorAll(".page");
const nextButtons = document.querySelectorAll(".next-button");

const intro = document.getElementById("intro");
const enterBtn = document.getElementById("enterBtn");

const pageNumber = document.getElementById("pageNumber");

let currentPage = 0;
let isTransitioning = false;


/* =========================================================
   SHOW PAGE
========================================================= */

function showPage(newPage) {

    if (isTransitioning) return;
    if (newPage < 0 || newPage >= pages.length) return;
    if (newPage === currentPage) return;

    isTransitioning = true;

    const oldPage = pages[currentPage];
    const newPageElement = pages[newPage];

    oldPage.classList.remove("active-page");
    oldPage.classList.add("leaving");

    setTimeout(() => {

        oldPage.classList.remove("leaving");

        newPageElement.classList.add("active-page");

        currentPage = newPage;

        updateProgress();

        setTimeout(() => {
            isTransitioning = false;
        }, 850);

    }, 350);
}


/* =========================================================
   NEXT BUTTONS
========================================================= */

nextButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (currentPage < pages.length - 1) {
            showPage(currentPage + 1);
        }

    });

});


/* =========================================================
   INTRO
========================================================= */

enterBtn.addEventListener("click", () => {

    intro.classList.add("hide");

    setTimeout(() => {

        showPage(0);

    }, 600);

});


/* =========================================================
   PROGRESS
========================================================= */

function updateProgress() {

    const number = String(currentPage + 1).padStart(2, "0");

    pageNumber.textContent = number;

}


/* =========================================================
   KEYBOARD NAVIGATION
========================================================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight") {

        showPage(currentPage + 1);

    }

    if (event.key === "ArrowLeft") {

        showPage(currentPage - 1);

    }

});


/* =========================================================
   SWIPE NAVIGATION
========================================================= */

let touchStartX = 0;

document.addEventListener("touchstart", (event) => {

    touchStartX = event.changedTouches[0].screenX;

});


document.addEventListener("touchend", (event) => {

    const touchEndX = event.changedTouches[0].screenX;

    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) < 60) return;

    if (difference > 0) {

        showPage(currentPage + 1);

    } else {

        showPage(currentPage - 1);

    }

});


/* =========================================================
   MUSIC
========================================================= */

const music = document.getElementById("birthdayMusic");
const musicBtn = document.getElementById("musicBtn");
const musicCard = document.querySelector(".music-card");

if (musicBtn) {

    musicBtn.addEventListener("click", () => {

        if (music.paused) {

            music.play();

            musicBtn.textContent = "Ⅱ";
            musicCard.classList.add("playing");

        } else {

            music.pause();

            musicBtn.textContent = "▶";
            musicCard.classList.remove("playing");

        }

    });

}


/* =========================================================
   FLIP CARD
========================================================= */

const flipCard = document.getElementById("flipCard");

if (flipCard) {

    flipCard.addEventListener("click", () => {

        flipCard.classList.toggle("flipped");

    });

}


/* =========================================================
   QUESTIONS
========================================================= */

const questions = [

    "What's something you wish more people understood about you?",

    "What's something you're secretly proud of?",

    "What is something you want this next year to bring you?",

    "What's a small thing that can instantly make your day better?",

    "What is something you hope never changes about you?"

];

let questionIndex = 0;

const questionText = document.getElementById("questionText");
const questionNumber = document.getElementById("questionNumber");
const questionBtn = document.getElementById("questionBtn");

if (questionBtn) {

    questionBtn.addEventListener("click", () => {

        questionIndex++;

        if (questionIndex >= questions.length) {
            questionIndex = 0;
        }

        questionText.style.opacity = "0";
        questionText.style.transform = "translateY(10px)";

        setTimeout(() => {

            questionText.textContent = questions[questionIndex];

            questionNumber.textContent =
                String(questionIndex + 1).padStart(2, "0");

            questionText.style.opacity = "1";
            questionText.style.transform = "translateY(0)";

        }, 300);

    });

}


/* =========================================================
   LETTER
========================================================= */

const envelope = document.getElementById("envelope");
const letterContent = document.getElementById("letterContent");
const letterPage = document.querySelector(".letter-page");

if (envelope) {

    envelope.addEventListener("click", () => {

        envelope.classList.add("open");

        setTimeout(() => {

            envelope.style.display = "none";

            letterContent.classList.add("show");

            letterPage.classList.add("opened");

        }, 700);

    });

}


/* =========================================================
   RESTART
========================================================= */

const restartBtn = document.getElementById("restartBtn");

if (restartBtn) {

    restartBtn.addEventListener("click", () => {

        location.reload();

    });

}


/* =========================================================
   INITIAL STATE
========================================================= */

pages.forEach((page, index) => {

    if (index === 0) {

        page.classList.add("active-page");

    } else {

        page.classList.remove("active-page");

    }

});

updateProgress();


/* =========================================================
   SECTION 7 — SECRET ECLIPSE
========================================================= */

const sectionEclipseBtn =
    document.getElementById("sectionEclipseBtn");

const sectionSecret =
    document.getElementById("sectionSecret");

const sectionSecretClose =
    document.getElementById("sectionSecretClose");


/* Open secret */

if (sectionEclipseBtn) {

    sectionEclipseBtn.addEventListener("click", () => {

        sectionSecret.classList.add("active");

    });

}


/* Close secret */

if (sectionSecretClose) {

    sectionSecretClose.addEventListener("click", () => {

        sectionSecret.classList.remove("active");

    });

}