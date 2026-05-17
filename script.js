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
navLinks.forEach((link) => {
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

// ========== ADVANCED SLIDER (FIXED) ==========
class AdvancedSlider {
  constructor(config) {
    this.wrapper = document.getElementById(config.wrapperId);
    this.slides = this.wrapper.querySelectorAll(".slide");
    this.prevBtn = document.getElementById(config.prevBtnId);
    this.nextBtn = document.getElementById(config.nextBtnId);
    this.dotsContainer = document.getElementById(config.dotsId);
    this.progressBar = document.getElementById(config.progressId);

    this.currentIndex = 0;
    this.slideCount = this.slides.length;
    this.autoPlayInterval = config.autoPlayInterval || 4000;
    this.autoPlayTimer = null;
    this.isTransitioning = false;

    // تأكد من إنشاء slider واحد فقط
    if (this.slideCount === 0) return;

    this.init();
  }

  init() {
    // إنشاء النقاط
    this.createDots();

    // ضبط العرض الابتدائي
    this.goToSlide(0, false);

    // تأكيد إن أي صورة تظهر كاملة
    this.fixSlideWidths();

    // Event listeners
    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prevSlide();
      if (e.key === "ArrowRight") this.nextSlide();
    });

    // Touch / Swipe support
    this.addTouchSupport();

    // بدء التشغيل التلقائي
    this.startAutoPlay();

    // إيقاف مؤقت عند hover
    const container = this.wrapper.parentElement;
    container.addEventListener("mouseenter", () => this.stopAutoPlay());
    container.addEventListener("mouseleave", () => this.startAutoPlay());

    // معالجة تغيير حجم النافذة
    window.addEventListener("resize", () => this.fixSlideWidths());
  }

  fixSlideWidths() {
    // تأكيد إن كل سلايد يأخذ عرض الحاوية بالكامل
    const containerWidth = this.wrapper.parentElement.clientWidth;
    this.slides.forEach((slide) => {
      slide.style.minWidth = containerWidth + "px";
      slide.style.width = containerWidth + "px";
    });
    // إعادة ضبط الموقع بعد تغيير المقاسات
    this.wrapper.style.transform = `translateX(-${this.currentIndex * containerWidth}px)`;
  }

  createDots() {
    this.dotsContainer.innerHTML = "";
    for (let i = 0; i < this.slideCount; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => this.goToSlide(i, true));
      this.dotsContainer.appendChild(dot);
    }
  }

  goToSlide(index, animate = true) {
    if (this.isTransitioning) return;
    if (this.slideCount === 0) return;

    // التدوير اللانهائي
    if (index < 0) index = this.slideCount - 1;
    if (index >= this.slideCount) index = 0;

    this.isTransitioning = true;
    this.currentIndex = index;

    const containerWidth = this.wrapper.parentElement.clientWidth;

    // تحريك slider wrapper
    if (animate) {
      this.wrapper.style.transition =
        "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    } else {
      this.wrapper.style.transition = "none";
    }

    this.wrapper.style.transform = `translateX(-${this.currentIndex * containerWidth}px)`;

    // تحديث النقاط
    const dots = this.dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === this.currentIndex);
    });

    // إعادة ضبط شريط التقدم
    this.resetProgress();

    // السماح بالانتقال بعد اكتماله
    setTimeout(() => {
      this.isTransitioning = false;
    }, 600);
  }

  nextSlide() {
    this.goToSlide(this.currentIndex + 1, true);
    this.resetAutoPlay();
  }

  prevSlide() {
    this.goToSlide(this.currentIndex - 1, true);
    this.resetAutoPlay();
  }

  // التشغيل التلقائي
  startAutoPlay() {
    this.stopAutoPlay();
    if (this.slideCount <= 1) return;
    this.autoPlayTimer = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayInterval);
    this.startProgress();
  }

  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  // شريط التقدم
  startProgress() {
    if (!this.progressBar) return;
    this.progressBar.style.width = "0%";
    this.progressBar.style.transition = "none";
    void this.progressBar.offsetWidth;
    this.progressBar.style.transition = `width ${this.autoPlayInterval}ms linear`;
    this.progressBar.style.width = "100%";
  }

  resetProgress() {
    if (!this.progressBar) return;
    this.progressBar.style.transition = "none";
    this.progressBar.style.width = "0%";
    void this.progressBar.offsetWidth;
    this.progressBar.style.transition = `width ${this.autoPlayInterval}ms linear`;
    this.progressBar.style.width = "100%";
  }

  // دعم اللمس للموبايل
  addTouchSupport() {
    const container = this.wrapper.parentElement;
    let startX = 0;
    let endX = 0;

    container.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        this.stopAutoPlay();
      },
      { passive: true },
    );

    container.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
      this.startAutoPlay();
    });
  }
}

// تشغيل السلايدر بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  // انتظر قليلاً للتأكد من تحميل كل العناصر
  setTimeout(() => {
    new AdvancedSlider({
      wrapperId: "sliderWrapper",
      prevBtnId: "prevBtn",
      nextBtnId: "nextBtn",
      dotsId: "sliderDots",
      progressId: "sliderProgress",
      autoPlayInterval: 4000,
    });
  }, 100);
});

// إعادة تهيئة السلايدر عند تغيير حجم النافذة
window.addEventListener("resize", () => {
  const wrapper = document.getElementById("sliderWrapper");
  if (wrapper && wrapper.sliderInstance) {
    wrapper.sliderInstance.fixSlideWidths();
  }
});