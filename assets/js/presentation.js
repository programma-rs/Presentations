// === PowerPoint-like fixed canvas scaling ===
const deck = document.querySelector(".deck");

function resizeDeck() {
  const scale = Math.min(window.innerWidth / 1600, window.innerHeight / 900);

  deck.style.transform = `scale(${scale})`;
}

window.addEventListener("resize", resizeDeck);

const slides = [...document.querySelectorAll(".slide")];

const progress = document.getElementById("navProgress");

const counter = document.getElementById("counter");

const TOTAL_SLIDES = slides.length;

let current = 0;

resizeDeck();

// Slide 5 behaves like PowerPoint "animations on click":
// step 0 = all accordion items closed;
// step 1..4 = the corresponding item is open.
let slide5Step = 0;
let slide6Step = 0;
let slide7Step = 0;
let slide8Step = 0;
let slide19Step = 0;
let slide22Step = 0;

function resetAnimations(slide) {
  slide.querySelectorAll(".reveal").forEach((el) => {
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  });
}

function updateProgress() {
  const currentNumber = current + 1;
  const percent = Math.min(
    100,
    Math.max(0, (currentNumber / TOTAL_SLIDES) * 100),
  );

  progress.style.width = `${percent}%`;
  counter.textContent = `${currentNumber} / ${TOTAL_SLIDES}`;
}

// ---------- Slide 3: automatic card highlights ----------
let cardHighlightTimers = [];

function clearCardHighlights() {
  cardHighlightTimers.forEach((timer) => clearTimeout(timer));
  cardHighlightTimers = [];

  document.querySelectorAll(".s3 .card").forEach((card) => {
    card.classList.remove("auto-highlight");
  });
}

function runCardHighlights(slide) {
  clearCardHighlights();

  const cards = [...slide.querySelectorAll(".card")];
  if (!cards.length) return;

  const startDelay = 700;
  const step = 900;
  const activeTime = 650;

  cards.forEach((card, index) => {
    const onTimer = setTimeout(
      () => {
        card.classList.add("auto-highlight");

        const offTimer = setTimeout(() => {
          card.classList.remove("auto-highlight");
        }, activeTime);

        cardHighlightTimers.push(offTimer);
      },
      startDelay + index * step,
    );

    cardHighlightTimers.push(onTimer);
  });
}

// ---------- Accordion helpers ----------
function setAccordionItem(item, open) {
  const panel = item.querySelector(".panel");
  const inner = item.querySelector(".panel-inner");

  // всегда меняем состояние пункта
  item.classList.toggle("open", open);
  item.classList.toggle("active", open);

  // если раскрывающего блока нет — просто подсветка
  if (!panel || !inner) {
    return;
  }

  // плавное раскрытие
  panel.style.height = open ? inner.scrollHeight + "px" : "0px";
}

function closeAccordion(accordion) {
  accordion.querySelectorAll(".item").forEach((item) => {
    setAccordionItem(item, false);
  });
}

function applySlide5Step(step) {
  const slide = document.querySelector(".s5");
  const accordion = slide?.querySelector("[data-accordion]");
  if (!accordion) return;

  const items = [...accordion.querySelectorAll(".item")];

  slide5Step = Math.max(0, Math.min(step, items.length));

  items.forEach((item, index) => {
    // Only one item is expanded at a time.
    setAccordionItem(item, slide5Step > 0 && index === slide5Step - 1);
  });
}

function applySlide6Step(step) {
  const slide = document.querySelector(".s6-prof");
  const accordion = slide?.querySelector("[data-accordion]");

  if (!accordion) return;

  const items = [...accordion.querySelectorAll(".item")];

  slide6Step = Math.max(0, Math.min(step, items.length));

  items.forEach((item, index) => {
    setAccordionItem(item, slide6Step > 0 && index === slide6Step - 1);
  });
}
function applySlide7Step(step) {
  const slide = document.querySelector(".s7-motivation");

  const accordion = slide?.querySelector("[data-motivation-accordion]");

  if (!accordion) return;

  const items = [...accordion.querySelectorAll(".item")];

  slide7Step = Math.max(0, Math.min(step, items.length));

  items.forEach((item, index) => {
    setAccordionItem(item, slide7Step > 0 && index === slide7Step - 1);
  });
}

function applySlide8Step(step) {
  const slide = document.querySelector(".s8-prevention");

  if (!slide) return;

  const items = [...slide.querySelectorAll(".item")];

  slide8Step = Math.max(0, Math.min(step, items.length));

  items.forEach((item, index) => {
    setAccordionItem(item, index === slide8Step - 1);
  });

  // второй шаг = открыли 02 пункт
  const caption = slide.querySelector(".motivation-caption");

  if (slide8Step >= 2) {
    slide.classList.add("show-umk");

    gsap.to(slide.querySelectorAll(".umk-grid img"), {
      y: -6,
      scale: 1.01,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        each: 0.2,
      },
    });

    if (caption) {
      caption.classList.add("show");
    }
  } else {
    slide.classList.remove("show-umk");

    if (caption) {
      caption.classList.remove("show");
    }
  }
}

function applySlide22Step(step) {
  const slide = document.querySelector(".s22-teachers");

  const accordion = slide?.querySelector("[data-teachers-accordion]");

  if (!accordion) return;

  const items = [...accordion.querySelectorAll(".item")];

  slide22Step = Math.max(0, Math.min(step, items.length));

  items.forEach((item, index) => {
    setAccordionItem(item, slide22Step > 0 && index === slide22Step - 1);
  });
}

function applySlide19Step(step) {
  const slide = document.querySelector(".s19-point");

  if (!slide) return;

  const items = [...slide.querySelectorAll(".s19-item")];

  slide19Step = Math.max(0, Math.min(step, items.length));

  items.forEach((item, index) => {
    setAccordionItem(item, index === slide19Step - 1);
  });
}

function initOpenPanels(scope = document) {
  scope.querySelectorAll("[data-accordion]").forEach((accordion) => {
    accordion.querySelectorAll(".item").forEach((item) => {
      const panel = item.querySelector(".panel");
      const inner = item.querySelector(".panel-inner");

      if (!panel || !inner) return;

      panel.style.height = item.classList.contains("open")
        ? inner.scrollHeight + "px"
        : "0px";
    });
  });
}

// Mouse interaction remains available too.
document.querySelectorAll("[data-accordion]").forEach((accordion) => {
  const items = [...accordion.querySelectorAll(".item")];

  items.forEach((item, index) => {
    const button = item.querySelector(".acc-btn");
    if (!button) return;

    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const isSlide5 = item.closest(".s5");
      const isSlide6 = item.closest(".s6-prof");
      const isSlide7 = item.closest(".s7-motivation");
      const isSlide8 = item.closest(".s8-prevention");
      const isSlide22 = item.closest(".s22-teachers");
      const isOpen = item.classList.contains("open");

      if (isSlide5) {
        applySlide5Step(isOpen ? 0 : index + 1);
      } else if (isSlide6) {
        applySlide6Step(isOpen ? 0 : index + 1);
      } else if (isSlide7) {
        applySlide7Step(isOpen ? 0 : index + 1);
      } else if (isSlide8) {
        applySlide8Step(isOpen ? 0 : index + 1);
      } else if (isSlide22) {
        applySlide22Step(isOpen ? 0 : index + 1);
      } else {
        items.forEach((other) => setAccordionItem(other, false));

        if (!isOpen) {
          setAccordionItem(item, true);
        }
      }
    });
  });
});

// =====================================================
// S19 — Точка опоры: mouse accordion
// =====================================================

document.querySelectorAll(".s19-point .s19-title").forEach((title, index) => {
  title.addEventListener("click", () => {
    applySlide19Step(index + 1);
  });
});

let familyScrollAnimation = null;
let familyScrollTimer = null;

function stopFamilyPhoneScroll() {
  if (familyScrollTimer) {
    clearTimeout(familyScrollTimer);
    familyScrollTimer = null;
  }

  if (familyScrollAnimation) {
    familyScrollAnimation.cancel();
    familyScrollAnimation = null;
  }

  const image = document.getElementById("familyPageImage");

  if (image) {
    image.getAnimations().forEach((animation) => animation.cancel());

    image.style.transform = "none";

    void image.offsetHeight;

    image.style.transform = "translateY(0)";
  }
}

function startFamilyPhoneScroll() {
  stopFamilyPhoneScroll();

  const screen = document.getElementById("familyPhoneScreen");
  const image = document.getElementById("familyPageImage");

  if (!screen || !image) return;

  const run = () => {
    image.getAnimations().forEach((animation) => animation.cancel());

    image.style.transform = "translateY(0)";

    void image.offsetHeight;

    familyScrollTimer = setTimeout(() => {
      const distance = Math.max(
        0,
        image.getBoundingClientRect().height - screen.clientHeight,
      );

      if (!distance) return;

      familyScrollAnimation = image.animate(
        [
          { transform: "translateY(0)", offset: 0 },
          { transform: `translateY(-${distance}px)`, offset: 0.5 },
          { transform: "translateY(0)", offset: 1 },
        ],
        {
          duration: 56000,
          delay: 0,
          easing: "cubic-bezier(.42,0,.22,1)",
          iterations: Infinity,
        },
      );
    }, 1250);
  };

  if (image.complete) {
    run();
  } else {
    image.addEventListener("load", run, { once: true });
  }
}
let professionScrollAnimation = null;
let professionScrollTimer = null;

function stopProfessionPhoneScroll() {
  if (professionScrollTimer) {
    clearTimeout(professionScrollTimer);
    professionScrollTimer = null;
  }

  if (professionScrollAnimation) {
    professionScrollAnimation.cancel();
    professionScrollAnimation = null;
  }

  const image = document.getElementById("professionPageImage");

  if (image) {
    image.getAnimations().forEach((animation) => animation.cancel());

    image.style.transform = "none";

    void image.offsetHeight;

    image.style.transform = "translateY(0)";
  }
}

function startProfessionPhoneScroll() {
  stopProfessionPhoneScroll();

  const screen = document.getElementById("professionPhoneScreen");
  const image = document.getElementById("professionPageImage");

  if (!screen || !image) return;

  const run = () => {
    professionScrollTimer = setTimeout(() => {
      const distance = Math.max(
        0,
        image.getBoundingClientRect().height - screen.clientHeight,
      );

      if (!distance) return;

      professionScrollAnimation = image.animate(
        [
          { transform: "translateY(0)", offset: 0 },

          {
            transform: `translateY(-${distance}px)`,
            offset: 0.5,
          },

          { transform: "translateY(0)", offset: 1 },
        ],

        {
          duration: 56000,
          easing: "cubic-bezier(.42,0,.22,1)",
          iterations: Infinity,
        },
      );
    }, 1250);
  };

  if (image.complete) {
    run();
  } else {
    image.addEventListener("load", run, { once: true });
  }
}

/* =========================================================
   SLIDE 7 — LAPTOP AUTOSCROLL
   ========================================================= */

let motivationScrollAnimation = null;
let motivationScrollTimer = null;

let teachersScrollAnimation = null;
let teachersScrollTimer = null;

function stopTeachersScroll() {
  if (teachersScrollTimer) {
    clearTimeout(teachersScrollTimer);
    teachersScrollTimer = null;
  }

  if (teachersScrollAnimation) {
    teachersScrollAnimation.cancel();
    teachersScrollAnimation = null;
  }

  const image = document.getElementById("teachersPageImage");

  if (image) {
    image.getAnimations().forEach((animation) => {
      animation.cancel();
    });

    image.style.transform = "none";

    // заставляем браузер пересчитать состояние
    void image.offsetHeight;

    // возвращаем картинку в начало
    image.style.transform = "translateY(0)";
  }
}

function startTeachersScroll() {
  stopTeachersScroll();

  const screen = document.getElementById("teachersScreen");

  const image = document.getElementById("teachersPageImage");

  if (!screen || !image) return;

  const run = () => {
    teachersScrollTimer = setTimeout(() => {
      const distance = Math.max(
        0,
        image.getBoundingClientRect().height - screen.clientHeight,
      );

      if (!distance) return;

      teachersScrollAnimation = image.animate(
        [
          {
            transform: "translateY(0)",
            offset: 0,
          },

          {
            transform: `translateY(-${distance}px)`,
            offset: 0.5,
          },

          {
            transform: "translateY(0)",
            offset: 1,
          },
        ],

        {
          duration: 80000,

          easing: "cubic-bezier(.42,0,.22,1)",

          iterations: Infinity,
        },
      );
    }, 1400);
  };

  if (image.complete) {
    run();
  } else {
    image.addEventListener("load", run, { once: true });
  }
}

/* Останавливаем скролл и возвращаем картинку наверх */

function stopMotivationScroll() {
  if (motivationScrollTimer) {
    clearTimeout(motivationScrollTimer);
    motivationScrollTimer = null;
  }

  if (motivationScrollAnimation) {
    motivationScrollAnimation.cancel();
    motivationScrollAnimation = null;
  }

  const image = document.getElementById("motivationPageImage");

  if (image) {
    image.getAnimations().forEach((animation) => {
      animation.cancel();
    });

    image.style.transform = "none";

    /* заставляем браузер применить сброс */

    void image.offsetHeight;

    image.style.transform = "translateY(0)";
  }
}

/* Запускаем движение картинки */

function startMotivationScroll() {
  /*
    Каждый новый запуск сначала полностью
    очищает старую анимацию.
  */

  stopMotivationScroll();

  const screen = document.getElementById("motivationScreen");

  const image = document.getElementById("motivationPageImage");

  if (!screen || !image) return;

  const run = () => {
    /*
      Ещё раз гарантированно ставим картинку наверх.
    */

    image.getAnimations().forEach((animation) => {
      animation.cancel();
    });

    image.style.transform = "translateY(0)";

    void image.offsetHeight;

    /*
      Немного ждём, чтобы ноутбук сначала появился.
    */

    motivationScrollTimer = setTimeout(() => {
      /*
        Считаем, насколько картинка длиннее
        видимого окна ноутбука.
      */

      const distance = Math.max(
        0,
        image.getBoundingClientRect().height - screen.clientHeight,
      );

      /*
        Если картинка помещается целиком,
        скроллить нечего.
      */

      if (!distance) return;

      /*
        Собственно анимация:
        верх → низ → верх.
      */

      motivationScrollAnimation = image.animate(
        [
          {
            transform: "translateY(0)",
            offset: 0,
          },

          {
            transform: `translateY(-${distance}px)`,
            offset: 0.5,
          },

          {
            transform: "translateY(0)",
            offset: 1,
          },
        ],

        {
          duration: 80000,
          easing: "linear",
          iterations: Infinity,
        },
      );
    }, 1400);
  };

  /*
    Если картинка уже загружена —
    сразу запускаем.

    Если браузер ещё грузит её —
    ждём загрузки.
  */

  if (image.complete) {
    run();
  } else {
    image.addEventListener("load", run, { once: true });
  }
}

// function initSlide9() {
//   const slide = document.querySelector(".s9-diagnostics");

//   if (!slide) return;

//   // появление центральной картинки

//   gsap.from(slide.querySelector(".s9-center"), {
//     opacity: 0,ы

//     scale: 0.7,

//     duration: 1,

//     ease: "back.out(1.5)",
//   });

//   // появление карточек

//   gsap.from(slide.querySelectorAll(".s9-card"), {
//     opacity: 0,

//     y: 30,

//     scale: 0.95,

//     duration: 1,

//     stagger: 0.45,

//     ease: "power2.out",
//   });
// }

function initSlide9() {
  const slide = document.querySelector(".s9-diagnostics");

  if (!slide) return;

  gsap.killTweensOf(slide.querySelectorAll("*"));

  // Центр появляется первым

  gsap.from(slide.querySelector(".s9-center"), {
    opacity: 0,

    scale: 0.7,

    duration: 1,

    ease: "back.out(1.5)",
  });

  // Подпись центра появляется чуть позже

  gsap.from(slide.querySelector(".center-caption"), {
    opacity: 0,

    y: 15,

    duration: 0.8,

    delay: 0.5,

    ease: "power2.out",
  });

  // Порядок появления карточек по кругу:
  // 1. сверху — педагоги
  // 2. справа — родители
  // 3. снизу справа — профилактика
  // 4. снизу слева — учебная мотивация
  // 5. слева — профориентация

  const cards = [
    slide.querySelector(".card-5"),

    slide.querySelector(".card-1"),

    slide.querySelector(".card-4"),

    slide.querySelector(".card-3"),

    slide.querySelector(".card-2"),
  ];

  gsap.from(cards, {
    opacity: 0,

    y: 30,

    scale: 0.95,

    duration: 1,

    stagger: 0.45,

    delay: 0.8,

    ease: "power2.out",
  });
}

function initSlide10() {
  const slide = document.querySelector(".s10-environment");

  if (!slide) return;

  const cards = slide.querySelectorAll(".s10-cards .card");

  gsap
    .timeline()

    // пауза после появления слайда
    .to(
      {},
      {
        duration: 0.8,
      },
    )

    // карточка 1
    .to(cards[0], {
      onStart: () => cards[0].classList.add("s10-active"),
      duration: 0.5,
    })

    // карточка 2
    .to(
      cards[1],
      {
        onStart: () => cards[1].classList.add("s10-active"),
        duration: 0.5,
      },
      "+=0.5",
    )

    // карточка 3
    .to(
      cards[2],
      {
        onStart: () => cards[2].classList.add("s10-active"),
        duration: 0.5,
      },
      "+=0.5",
    );
}

function initSlide15() {
  const slide = document.querySelector(".s15-path");

  if (!slide) return;

  const cards = slide.querySelectorAll(".s15-card");

  // сбрасываем состояние
  cards.forEach((card) => {
    card.classList.remove("s15-lift");
  });

  gsap
    .timeline()

    // небольшая пауза после входа
    .to(
      {},
      {
        duration: 0.7,
      },
    )

    // карточка 1
    .to(cards[0], {
      onStart: () => {
        cards[0].classList.add("s15-lift");
      },

      duration: 0.3,
    })

    .to(cards[0], {
      onComplete: () => {
        cards[0].classList.remove("s15-lift");
      },

      duration: 0.3,
    })

    // карточка 2
    .to(cards[1], {
      onStart: () => {
        cards[1].classList.add("s15-lift");
      },

      duration: 0.3,
    })

    .to(cards[1], {
      onComplete: () => {
        cards[1].classList.remove("s15-lift");
      },

      duration: 0.3,
    })

    // карточка 3
    .to(cards[2], {
      onStart: () => {
        cards[2].classList.add("s15-lift");
      },

      duration: 0.3,
    })

    .to(cards[2], {
      onComplete: () => {
        cards[2].classList.remove("s15-lift");
      },

      duration: 0.3,
    });
}

function show(i) {
  const previous = current;
  current = (i + slides.length) % slides.length;

  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === current);
  });

  updateProgress();
  resetAnimations(slides[current]);
  clearCardHighlights();

  if (slides[current].classList.contains("s3")) {
    runCardHighlights(slides[current]);
  }

  // Every fresh arrival on slide 5 starts with all lists closed
  // and restarts the phone-page scroll from the top.
  if (slides[current].classList.contains("s5") && previous !== current) {
    applySlide5Step(0);
    startFamilyPhoneScroll();
  } else {
    stopFamilyPhoneScroll();
  }

  /* новый слайд профориентации */

  if (slides[current].classList.contains("s6-prof") && previous !== current) {
    applySlide6Step(0);
    startProfessionPhoneScroll();
  } else {
    stopProfessionPhoneScroll();
  }
  if (
    slides[current].classList.contains("s7-motivation") &&
    previous !== current
  ) {
    applySlide7Step(0);
    startMotivationScroll();
  } else {
    stopMotivationScroll();
  }

  /* Слайд 9 — диагностика */

  if (
    slides[current].classList.contains("s9-diagnostics") &&
    previous !== current
  ) {
    initSlide9();
  }
  /* Слайд 10 — индекс развивающей среды */

  if (
    slides[current].classList.contains("s10-environment") &&
    previous !== current
  ) {
    initSlide10();
  }

  if (slides[current].classList.contains("s15-path") && previous !== current) {
    initSlide15();
  }
  if (slides[current].classList.contains("s19-point") && previous !== current) {
    applySlide19Step(0);
  }
  if (
    slides[current].classList.contains("s22-teachers") &&
    previous !== current
  ) {
    applySlide22Step(0);

    startTeachersScroll();
  } else {
    stopTeachersScroll();
  }

  initOpenPanels(slides[current]);
}

function goForward() {
  const activeSlide = slides[current];

  /* Слайд 5 */
  if (activeSlide.classList.contains("s5")) {
    const items = [...activeSlide.querySelectorAll(".item")];

    if (slide5Step < items.length) {
      applySlide5Step(slide5Step + 1);

      return;
    }
  }

  /* Слайд 6 — профориентация */
  if (activeSlide.classList.contains("s6-prof")) {
    const items = [...activeSlide.querySelectorAll(".item")];

    if (slide6Step < items.length) {
      applySlide6Step(slide6Step + 1);

      return;
    }
  }

  /* Слайд 7 — учебная мотивация */
  if (activeSlide.classList.contains("s7-motivation")) {
    const items = [...activeSlide.querySelectorAll(".item")];

    if (slide7Step < items.length) {
      applySlide7Step(slide7Step + 1);

      return;
    }
  }
  /* Слайд 8 — первичная профилактика */
  if (activeSlide.classList.contains("s8-prevention")) {
    const items = [...activeSlide.querySelectorAll(".item")];

    if (slide8Step < items.length) {
      applySlide8Step(slide8Step + 1);

      return;
    }
  }
  /* Слайд 22 — педагоги */

  if (activeSlide.classList.contains("s22-teachers")) {
    const items = [...activeSlide.querySelectorAll(".item")];

    if (slide22Step < items.length) {
      applySlide22Step(slide22Step + 1);

      return;
    }
  }
  /* Слайд 19 — Точка опоры */

  if (activeSlide.classList.contains("s19-point")) {
    const items = [...activeSlide.querySelectorAll(".s19-item")];

    if (slide19Step < items.length) {
      applySlide19Step(slide19Step + 1);

      return;
    }
  }

  /* Обычный переход */
  show(current + 1);
}

function goBackward() {
  const activeSlide = slides[current];

  /* Слайд 5 */
  if (activeSlide.classList.contains("s5") && slide5Step > 0) {
    applySlide5Step(slide5Step - 1);

    return;
  }

  /* Слайд 6 */
  if (activeSlide.classList.contains("s6-prof") && slide6Step > 0) {
    applySlide6Step(slide6Step - 1);

    return;
  }

  /* Слайд 7 — учебная мотивация */
  if (activeSlide.classList.contains("s7-motivation") && slide7Step > 0) {
    applySlide7Step(slide7Step - 1);

    return;
  }

  /* Слайд 8 — первичная профилактика */
  if (activeSlide.classList.contains("s8-prevention") && slide8Step > 0) {
    applySlide8Step(slide8Step - 1);

    return;
  }

  /* Слайд 22 — педагоги */

  if (activeSlide.classList.contains("s22-teachers") && slide22Step > 0) {
    applySlide22Step(slide22Step - 1);

    return;
  }

  /* Слайд 19 — Точка опоры */

  if (activeSlide.classList.contains("s19-point") && slide19Step > 0) {
    applySlide19Step(slide19Step - 1);

    return;
  }

  /* Обычный переход назад */
  show(current - 1);
}

show(0);

addEventListener("keydown", (e) => {
  // Typical presenter/clicker keys.
  if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) {
    e.preventDefault();
    goForward();
  }

  if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) {
    e.preventDefault();
    goBackward();
  }
});

document.getElementById("fs").addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (e) {}
});

addEventListener("resize", () => initOpenPanels(document));
