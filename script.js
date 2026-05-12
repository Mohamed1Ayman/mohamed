let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

// Toggle menu on click
menuIcon.onclick = (e) => {
  e.stopPropagation(); // Prevent click from bubbling to document
  menuIcon.classList.toggle("open");
  navbar.classList.toggle("active");
};

// Close menu when clicking on a link
let navLinks = document.querySelectorAll(".navbar a");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    menuIcon.classList.remove("open");
    navbar.classList.remove("active");
  });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!menuIcon.contains(e.target) && !navbar.contains(e.target)) {
    menuIcon.classList.remove("open");
    navbar.classList.remove("active");
  }
});

// Active link on scroll
let sections = document.querySelectorAll("section");
let naveLinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");
    
    if (top >= offset && top < offset + height) {
      naveLinks.forEach((links) => {
        links.classList.remove("active");
        document
          .querySelector("header nav a[href*=" + id + "]")
          .classList.add("active");
      });
    }
  });

  // Sticky header
  let header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 100);
};