
(() => {
  const doc = document;
  const root = doc.documentElement;

  // Loader
  window.addEventListener("load", () => {
    window.setTimeout(() => doc.querySelector(".site-loader")?.classList.add("hidden"), 250);
  });

  // Footer year
  doc.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  // Theme
  const savedTheme = localStorage.getItem("pn-theme");
  const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (preferredDark ? "dark" : "light");
  root.setAttribute("data-theme", initialTheme);

  doc.querySelector(".theme-toggle")?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("pn-theme", next);
  });

  // Mobile navigation
  const menuButton = doc.querySelector(".menu-toggle");
  menuButton?.addEventListener("click", () => {
    const open = doc.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  doc.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => {
    doc.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }));

  // Scroll progress
  const progress = doc.querySelector(".scroll-progress span");
  const updateProgress = () => {
    const max = doc.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${value}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Reveal animations
  const revealEls = doc.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("visible"));
  }

  // Counters
  const counters = doc.querySelectorAll("[data-counter]");
  const animateCounter = el => {
    const target = Number(el.dataset.counter || 0);
    const duration = 1200;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .6 });
    counters.forEach(c => counterObserver.observe(c));
  } else counters.forEach(animateCounter);

  // Tilt cards
  if (!window.matchMedia("(pointer: coarse)").matches) {
    doc.querySelectorAll(".tilt").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => card.style.transform = "");
    });
  }

  // Testimonials
  const testimonials = [...doc.querySelectorAll(".testimonial")];
  const dots = doc.querySelector(".slider-dots");
  let current = 0;
  let timer;
  const showTestimonial = index => {
    if (!testimonials.length) return;
    current = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((item, i) => item.classList.toggle("active", i === current));
    dots?.querySelectorAll("button").forEach((dot, i) => dot.classList.toggle("active", i === current));
  };
  testimonials.forEach((_, i) => {
    const dot = doc.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show testimonial ${i + 1}`);
    dot.addEventListener("click", () => { showTestimonial(i); restartSlider(); });
    dots?.appendChild(dot);
  });
  const restartSlider = () => {
    clearInterval(timer);
    if (testimonials.length > 1) timer = setInterval(() => showTestimonial(current + 1), 6500);
  };
  doc.querySelector(".slider-btn.prev")?.addEventListener("click", () => { showTestimonial(current - 1); restartSlider(); });
  doc.querySelector(".slider-btn.next")?.addEventListener("click", () => { showTestimonial(current + 1); restartSlider(); });
  showTestimonial(0); restartSlider();

  // FAQ
  doc.querySelectorAll(".faq-item > button").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  // Chat demo
  const chatPanel = doc.querySelector(".chat-panel");
  const chatLauncher = doc.querySelector(".chat-launcher");
  const closeChat = () => {
    chatPanel?.classList.remove("open");
    chatPanel?.setAttribute("aria-hidden", "true");
    doc.body.classList.remove("chat-open");
  };
  chatLauncher?.addEventListener("click", () => {
    const open = !chatPanel?.classList.contains("open");
    chatPanel?.classList.toggle("open", open);
    chatPanel?.setAttribute("aria-hidden", String(!open));
  });
  doc.querySelector(".chat-close")?.addEventListener("click", closeChat);

  doc.querySelectorAll(".quick-replies button").forEach(button => {
    button.addEventListener("click", () => {
      const input = doc.querySelector(".chat-form input");
      if (input) { input.value = `I need help with ${button.textContent}.`; input.focus(); }
    });
  });

  doc.querySelector(".chat-form")?.addEventListener("submit", e => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input");
    if (!input?.value.trim()) return;
    const message = doc.createElement("div");
    message.className = "chat-message";
    message.textContent = input.value.trim();
    doc.querySelector(".chat-body")?.appendChild(message);
    input.value = "";
    window.setTimeout(() => {
      const reply = doc.createElement("div");
      reply.className = "chat-message bot";
      reply.textContent = "Thanks. This demo chat is not connected to an agent yet. Please use the contact form or email contact@powernexaconsulting.com.";
      doc.querySelector(".chat-body")?.appendChild(reply);
    }, 500);
  });

  // Static contact form -> mail client
  doc.querySelector("#contactForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent(`Project enquiry: ${data.get("service") || "General"}`);
    const body = encodeURIComponent(
`Name: ${data.get("name")}
Email: ${data.get("email")}
Company: ${data.get("company") || "-"}
Service: ${data.get("service") || "-"}

Project details:
${data.get("message")}`
    );
    const status = form.querySelector(".form-status");
    if (status) status.textContent = "Opening your email application…";
    window.location.href = `mailto:contact@powernexaconsulting.com?subject=${subject}&body=${body}`;
  });
})();

(() => {
 const d=document;
 const finder=d.querySelector('[data-solution-finder]');
 if(finder){let c='',s='';const map={'manual-processes':['Power Platform Consulting','/services/power-platform.html'],'document-management':['SharePoint Consulting','/services/sharepoint-consulting.html'],'crm':['Dynamics 365 Consulting','/services/dynamics-365.html'],'erp':['Business Central Development','/services/business-central.html'],'reporting':['Data & Analytics','/technologies.html'],'ai':['AI Automation','/services/ai-automation.html']};
 const update=()=>{if(!c||!s)return;const [name,link]=map[c];const r=finder.querySelector('.finder-result');r.innerHTML=`<p class="eyebrow">Recommended starting point</p><h3>${name}</h3><p>For a ${s} organization, begin with a focused discovery workshop and phased roadmap.</p><a href="${link}">Explore service →</a>`;r.classList.add('show')};
 finder.querySelectorAll('[data-challenge]').forEach(b=>b.onclick=()=>{finder.querySelectorAll('[data-challenge]').forEach(x=>x.classList.remove('active'));b.classList.add('active');c=b.dataset.challenge;update()});
 finder.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>{finder.querySelectorAll('[data-size]').forEach(x=>x.classList.remove('active'));b.classList.add('active');s=b.dataset.size;update()});}
 const roi=d.querySelector('[data-roi]');
 if(roi){const e=roi.querySelector('[data-employees]'),h=roi.querySelector('[data-hours]'),c=roi.querySelector('[data-cost]'),o=roi.querySelector('[data-roi-output]');const calc=()=>{roi.querySelector('[data-employees-value]').textContent=e.value;roi.querySelector('[data-hours-value]').textContent=h.value;roi.querySelector('[data-cost-value]').textContent='$'+c.value;o.textContent=(Number(e.value)*Number(h.value)*Number(c.value)*52*.35).toLocaleString(undefined,{maximumFractionDigits:0})};[e,h,c].forEach(x=>x.oninput=calc);calc();}
 const dock=d.querySelector('.contact-dock');dock?.querySelector('.contact-dock-toggle')?.addEventListener('click',()=>dock.classList.toggle('open'));
})();
