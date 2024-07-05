"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".nav__links").addEventListener("click", (e) => {
  e.preventDefault();
  const el = e.target.getAttribute("href");
  e.target.classList.contains("nav__link") &&
    document.querySelector(el).scrollIntoView({ behavior: "smooth" });
});

tabsContainer.addEventListener("click", (e) => {
  const clicked = e.target.closest(".operations__tab");

  if (!clicked) return;

  tabs.forEach((tab) => {
    tab.classList.remove("operations__tab--active");
  });

  tabsContent.forEach((tab) => {
    tab.classList.remove("operations__content--active");
  });

  clicked.classList.add("operations__tab--active");

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

const handleHover = (status, opacity) => {
  nav.addEventListener(status, function (e) {
    if (e.target.classList.contains("nav__link")) {
      const link = e.target;
      const siblings = link.closest(".nav").querySelectorAll(".nav__link");
      const logo = link.closest(".nav").querySelector("img");

      siblings.forEach((el) => {
        if (el !== link) el.style.opacity = opacity;
      });
      logo.style.opacity = opacity;
    }
  });
};
handleHover("mouseover", 0.5);
handleHover("mouseout", 1);

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const strickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(strickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((sec) => {
  sectionObserver.observe(sec);
  sec.classList.add("section--hidden");
});

const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});
imgTargets.forEach((img) => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let currentSlid = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach((s, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const goToSlide = function (currentSlid) {
    slides.forEach(
      (slide, i) =>
        (slide.style.transform = `translateX(${100 * (i - currentSlid)}%)`)
    );
    activateDot(currentSlid);
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((d, _) => d.classList.remove("dots__dot--active"));
    dotContainer.classList.remove("dots__dot--active");
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activateDot(0);
  };
  init();
  btnRight.addEventListener("click", function () {
    currentSlid === maxSlide - 1 ? (currentSlid = 0) : currentSlid++;
    goToSlide(currentSlid);
  });

  btnLeft.addEventListener("click", function () {
    currentSlid === 0 ? (currentSlid = maxSlide - 1) : currentSlid--;
    goToSlide(currentSlid);
  });

  document.addEventListener("keydown", function (e) {
    currentSlid === maxSlide - 1
      ? (currentSlid = 0)
      : currentSlid++ && e.key === "ArrowRight" && goToSlide(currentSlid);
    currentSlid === 0
      ? (currentSlid = maxSlide - 1)
      : currentSlid-- && e.key === "ArrowLeft" && goToSlide(currentSlid);
  });

  dotContainer.addEventListener("click", function (e) {
    const targetDot = e.target;
    const { slide } = targetDot.dataset;

    activateDot(slide);
    goToSlide(targetDot.dataset.slide);
  });
};
slider();
