/* =====================================
   DR. SAMY FELAFEL - script.js
===================================== */

const WHATSAPP_NUMBER = "201020572907";

/* ---------- 1) Preloader ---------- */
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.display = "none";
    }
});

/* ---------- 2) قائمة الموبايل ---------- */
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        mainNav.classList.toggle("show");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("show");
        });
    });
}

/* ---------- 3) الوضع الليلي ---------- */
const themeToggle = document.getElementById("themeToggle");
const rootEl = document.documentElement;

function setThemeIcon(isDark) {
    if (!themeToggle) return;
    themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
}

const savedTheme = localStorage.getItem("dr-samy-theme");
if (savedTheme === "dark") {
    rootEl.setAttribute("data-theme", "dark");
    setThemeIcon(true);
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isDark = rootEl.getAttribute("data-theme") === "dark";
        if (isDark) {
            rootEl.removeAttribute("data-theme");
            localStorage.setItem("dr-samy-theme", "light");
            setThemeIcon(false);
        } else {
            rootEl.setAttribute("data-theme", "dark");
            localStorage.setItem("dr-samy-theme", "dark");
            setThemeIcon(true);
        }
    });
}

/* ---------- 4) شريط تقدم السكرول + اللينك النشط ---------- */
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll("header nav a");
const scrollProgress = document.getElementById("scrollProgress");

const headerEl = document.querySelector("header");

function onScroll() {
    if (headerEl) {
        headerEl.classList.toggle("scrolled", window.scrollY > 60);
    }

    let current = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navAnchors.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });

    if (scrollProgress) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + "%";
    }
}

window.addEventListener("scroll", onScroll);

/* ---------- 5) Reveal Animation ---------- */
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    },
    { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ---------- 6) تأثير الكتابة المتحركة (Typewriter) ---------- */
const specialties = ["الأبقار والجاموس", "الخيول", "الحيوانات الأليفة", "الدواجن", "الأغنام والماعز"];
let specialtyIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterEl = document.getElementById("typewriter");

function typeEffect() {
    if (!typewriterEl) return;
    const currentWord = specialties[specialtyIndex];

    if (!isDeleting) {
        typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1500);
            return;
        }
    } else {
        typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            specialtyIndex = (specialtyIndex + 1) % specialties.length;
        }
    }

    setTimeout(typeEffect, isDeleting ? 60 : 100);
}

typeEffect();

/* ---------- 7) عداد الأرقام (Stats Counter) ---------- */
const counters = document.querySelectorAll(".counter");

function animateCounter(counter) {
    const target = +counter.getAttribute("data-target");
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = value.toLocaleString("ar-EG");

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            counter.textContent = target.toLocaleString("ar-EG") + "+";
        }
    }

    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

/* ---------- 8) تأثير Tilt على كروت الخدمات ---------- */
const tiltCards = document.querySelectorAll(".card");

tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "";
    });
});

/* ---------- 9) تأثير Ripple على الأزرار ---------- */
const rippleButtons = document.querySelectorAll(".btn, .btn2, .consult button");

rippleButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
        const existingRipple = this.querySelector(".ripple");
        if (existingRipple) existingRipple.remove();

        const circle = document.createElement("span");
        const diameter = Math.max(this.clientWidth, this.clientHeight);
        const radius = diameter / 2;
        const rect = this.getBoundingClientRect();

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add("ripple");

        this.appendChild(circle);
    });
});

/* ---------- 10) سلايدر آراء العملاء ---------- */
const track = document.getElementById("testimonialTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsWrapper = document.getElementById("sliderDots");

if (track && prevBtn && nextBtn && dotsWrapper) {
    const cards = track.children;
    const totalCards = cards.length;
    let currentIndex = 0;

    for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(i));
        dotsWrapper.appendChild(dot);
    }

    const dots = dotsWrapper.querySelectorAll(".dot");

    function updateSlider() {
        track.style.transform = `translateX(${currentIndex * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalCards;
        updateSlider();
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateSlider();
    });

    let autoSlide = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalCards;
        updateSlider();
    }, 6000);

    const sliderWrapper = track.closest(".testimonial-slider");
    sliderWrapper.addEventListener("mouseenter", () => clearInterval(autoSlide));
    sliderWrapper.addEventListener("mouseleave", () => {
        autoSlide = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateSlider();
        }, 6000);
    });
}

/* ---------- 11) أكورديون الأسئلة الشائعة ---------- */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        faqItems.forEach((el) => el.classList.remove("open"));
        if (!isOpen) item.classList.add("open");
    });
});

/* ---------- 12) زرار الرجوع لأعلى ---------- */
const backToTop = document.getElementById("backToTop");

if (backToTop) {
    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("show", window.scrollY > 500);
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ---------- 13) Lightbox لمعرض الصور ---------- */
const galleryImages = document.querySelectorAll(".gallery-box img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

galleryImages.forEach((img) => {
    img.addEventListener("click", () => {
        lightbox.classList.add("active");
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    });
});

function closeLightbox() {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
}

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

if (lightbox) {
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

/* ---------- 14) فورم الاستشارة -> إرسال عبر واتساب ---------- */
const consultForm = document.getElementById("consultForm");
const BACKEND_URL = "https://dr-samy-backend-production.up.railway.app";

if (consultForm) {
    consultForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const phoneNumber = document.getElementById("phoneNumber").value.trim();
        const animalType = document.getElementById("animalType").value;
        const serviceType = document.getElementById("serviceType").value;
        const message = document.getElementById("message").value.trim();

        if (!fullName || !phoneNumber || !animalType || !serviceType || !message) {
            alert("من فضلك املأ جميع الحقول قبل الإرسال");
            return;
        }

        // 1) حفظ الطلب في الباك إند (قاعدة البيانات)
        try {
            await fetch(`${BACKEND_URL}/api/consultations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, phoneNumber, animalType, serviceType, message })
            });
        } catch (err) {
            console.error("تعذر حفظ الطلب في الباك إند:", err);
        }

        // 2) فتح واتساب برسالة جاهزة (زي ما كان بالظبط)
        const text =
            `طلب حجز استشارة جديد \n` +
            `الاسم: ${fullName}\n` +
            `رقم الهاتف: ${phoneNumber}\n` +
            `نوع الحيوان: ${animalType}\n` +
            `نوع الاستشارة: ${serviceType}\n` +
            `وصف الحالة: ${message}`;

        const encodedText = encodeURIComponent(text);
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

        window.open(whatsappURL, "_blank");
        consultForm.reset();
    });
}
const footerEl = document.querySelector("footer");
const fabWhatsapp = document.querySelector(".floating-whatsapp");
const fabBackTop = document.querySelector(".back-to-top");

if (footerEl && fabWhatsapp && fabBackTop) {
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            fabWhatsapp.classList.toggle("hide-fab", entry.isIntersecting);
            fabBackTop.classList.toggle("hide-fab", entry.isIntersecting);
        });
    });
    footerObserver.observe(footerEl);
}

const allsections = document.querySelectorAll("section");

const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
});

sections.forEach(section=>{
    section.classList.add("hidden");
    observer.observe(section);
});