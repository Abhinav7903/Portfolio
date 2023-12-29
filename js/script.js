

document.addEventListener("DOMContentLoaded", () => {
  let navMenu = document.getElementById("nav-menu");
  let navToggle = document.getElementById("nav-toggle");
  let navClose = document.getElementById("nav-close");

  // MENU SHOW
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
    });
  }

  // MENU HIDDEN
  if (navClose) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    });
  }

  // SKILLS
  const skillContent = document.querySelectorAll(".skill");
  const skillHeader = document.querySelectorAll(".skills_header");
  const skillContentArr = Array.from(skillContent);
  const skillHeaderArr = Array.from(skillHeader);

  skillHeaderArr.forEach((element, idx) => {
    element.addEventListener("click", function () {
      skillContentArr[idx].classList.toggle("skills_open");
    });
  });

  // QUALIFICATION TABS
  let education = document.getElementById("education");
  let work = document.getElementById("work");
  let educationheader = document.getElementById("educationheader");


  educationheader.style.color = "var(--text-color)";

  educationheader.addEventListener("click", () => {
    let condition1 = work.classList.contains("qualification-inactive");
    if (!condition1) {
      education.classList.remove("qualification-inactive");
    
      educationheader.style.color = "var(--first-color)";
    }
  });

  // PORTFOLIO SWIPER
  let swiper = new Swiper(".portfolio_container", {
    cssMode: true,
    loop: false,
    
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    speed: 400,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    mousewheel: true,
    keyboard: true,
  });

  // Typing Animation using Typed JS
  var typed = new Typed(".type", {
    strings: ["a FullStack Web"],
    smartBackspace: true,
    startDelay: 1000,
    typeSpeed: 130,
    backDelay: 1000,
    backSpeed: 60,
    loop: true,
  });

// Function to show or hide particles based on the theme
const showHideParticles = (theme) => {
  const particlesContainer = document.getElementById("particles-js");
  if (theme === "dark") {
    particlesContainer.style.display = "block"; // Show particles when in dark mode
  } else {
    particlesContainer.style.display = "none"; // Hide particles when in light mode
  }
};

// DARK/LIGHT THEME
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// obtain the current theme
const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";

// Set initial particles visibility based on the theme
showHideParticles(getCurrentTheme());

if (selectedTheme) {
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    darkTheme
  );
  themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](
    iconTheme
  );
}

// Activate/Deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the dark icon/theme
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  
  // Show/hide particles based on the current theme
  showHideParticles(getCurrentTheme());

  // We save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});


  // SCROLL SECTIONS ACTIVE LINK
  const sections = document.querySelectorAll("section[id]");

  function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 50;
      let sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document
          .querySelector('.nav_menu a[href*="' + sectionId + '"]')
          .classList.add("active-link");
      } else {
        document
          .querySelector('.nav_menu a[href*="' + sectionId + '"]')
          .classList.remove("active-link");
      }
    });
  }

  window.addEventListener("scroll", scrollActive);

  // HEADER SHADOW
  function scrollHeader() {
    const nav = document.getElementById("header");
    if (this.scrollY >= 80) nav.classList.add("scroll-header");
    else nav.classList.remove("scroll-header");
  }

  window.addEventListener("scroll", scrollHeader);

  // SHOW SCROLL UP BUTTON
  function scrollUpfunc() {
    const scrollUp = document.getElementById("scroll-up");
    if (this.scrollY >= 560) scrollUp.classList.add("show-scroll");
    else scrollUp.classList.remove("show-scroll");
  }

  window.addEventListener("scroll", scrollUpfunc);
});
