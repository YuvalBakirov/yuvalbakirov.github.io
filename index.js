import { experience, projects, education, certifications } from "./user-data/data.js";

const $ = (selector) => document.querySelector(selector);
const labels = { ai: "AI", "machine-learning": "Machine learning", analytics: "Analytics", software: "Software" };

$("#experience-list").innerHTML = experience.map((item, index) => `
  <article class="experience-item reveal" style="--delay:${index * 70}ms">
    <div class="experience-period">${item.period}</div>
    <div class="organization-logo"><img src="${item.logo}" alt="${item.organization} logo"></div>
    <div class="experience-body">
      <h3>${item.role}</h3>
      <strong>${item.organization}</strong>
      <p>${item.summary}</p>
      <div class="tag-list">${item.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
    </div>
  </article>`).join("");

const renderProjects = (filter = "all") => {
  const visible = filter === "all" ? projects : projects.filter(project => project.category === filter);
  $("#project-grid").innerHTML = visible.map((project, index) => `
    <article class="project-card reveal" style="--delay:${Math.min(index * 25, 150)}ms;--image-background:${project.imageBackground || "#edf2f7"}">
      <a class="project-thumb ${project.imageFit === "contain" ? "fit-contain" : ""}" href="${project.url}" target="_blank" rel="noreferrer" aria-label="Open ${project.title}">
        <img src="${project.image}" alt="Project image for ${project.title}" loading="lazy">
      </a>
      <div class="project-content">
        <div class="project-meta"><span>${labels[project.category]}</span><span>${project.period}</span></div>
        <h3><a href="${project.url}" target="_blank" rel="noreferrer">${project.title}</a></h3>
        <p>${project.description}</p>
        <div class="project-footer">
          <div class="tag-list compact-tags">${project.tags.slice(0, 2).map(tag => `<span>${tag}</span>`).join("")}</div>
          <a class="project-arrow" href="${project.url}" target="_blank" rel="noreferrer" aria-label="Open ${project.title}">&#8599;</a>
        </div>
      </div>
    </article>`).join("");
  observeReveals();
};

renderProjects();

document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  renderProjects(button.dataset.filter);
}));

$("#education-list").innerHTML = education.map(item => `
  <article class="education-item reveal">
    <div class="school-logo"><img src="${item.logo}" alt="${item.school} logo"></div>
    <div class="education-copy">
      <span>${item.years}</span>
      <h3>${item.title}</h3>
      <strong>${item.school}</strong>
      <p>${item.note}</p>
    </div>
  </article>`).join("");

$("#certification-list").innerHTML = `<h3>Certifications</h3>` + certifications.map(item => `
  <article class="cert-card reveal">
    <div class="cert-logo"><img src="${item.logo}" alt="${item.issuer} logo"></div>
    <div><h4>${item.title}</h4><strong>${item.issuer}</strong><span>${item.issued}</span></div>
  </article>`).join("");

$("#year").textContent = new Date().getFullYear();

const toggle = $(".theme-toggle");
if (localStorage.getItem("yuval-theme") === "dark") document.documentElement.dataset.theme = "dark";
toggle.addEventListener("click", () => {
  const useDark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = useDark ? "dark" : "light";
  localStorage.setItem("yuval-theme", useDark ? "dark" : "light");
});

function observeReveals() {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.06 });
  document.querySelectorAll(".reveal:not(.visible)").forEach(item => observer.observe(item));
}

const railLinks = [...document.querySelectorAll(".section-rail a")];
const sections = railLinks.map(link => document.getElementById(link.dataset.section)).filter(Boolean);
const sectionObserver = new IntersectionObserver(entries => {
  const visibleEntry = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visibleEntry) return;
  railLinks.forEach(link => link.classList.toggle("active", link.dataset.section === visibleEntry.target.id));
}, { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.1, 0.3] });
sections.forEach(section => sectionObserver.observe(section));

observeReveals();
