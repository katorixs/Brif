const STEPS = [
  "О проекте",
  "Сроки и бюджет",
  "Структура и контент",
  "Функционал",
  "Контакты",
];

const form = document.getElementById("brief-form");
const steps = [...document.querySelectorAll(".step")];
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("form-status");
const successScreen = document.getElementById("success-screen");
const progressBar = document.getElementById("progress-bar");
const stepLabel = document.getElementById("step-label");
const navActions = document.getElementById("nav-actions");
const formNote = document.getElementById("form-note");

let current = 0;

function updateUI() {
  steps.forEach((step, index) => {
    const active = index === current;
    step.hidden = !active;
    step.classList.toggle("is-active", active);
  });

  prevBtn.hidden = current === 0;
  nextBtn.hidden = current === steps.length - 1;
  submitBtn.hidden = current !== steps.length - 1;

  progressBar.style.width = `${((current + 1) / steps.length) * 100}%`;
  stepLabel.textContent = `Шаг ${current + 1} из ${steps.length} · ${STEPS[current]}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function validateStep() {
  const step = steps[current];
  const required = [...step.querySelectorAll("[data-step-required]")];

  for (const el of required) {
    if (el.type === "radio") {
      const group = step.querySelectorAll(`input[type="radio"][name="${el.name}"]`);
      if (![...group].some((input) => input.checked)) {
        group[0]?.focus();
        statusEl.hidden = false;
        statusEl.className = "status status-error";
        statusEl.textContent = "Заполните обязательные поля этого шага.";
        return false;
      }
      continue;
    }

    if (!el.checkValidity()) {
      el.reportValidity();
      statusEl.hidden = false;
      statusEl.className = "status status-error";
      statusEl.textContent = "Заполните обязательные поля этого шага.";
      return false;
    }
  }

  statusEl.hidden = true;
  return true;
}

prevBtn?.addEventListener("click", () => {
  current = Math.max(0, current - 1);
  updateUI();
});

nextBtn?.addEventListener("click", () => {
  if (!validateStep()) return;
  current = Math.min(steps.length - 1, current + 1);
  updateUI();
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateStep()) return;

  statusEl.hidden = false;
  statusEl.className = "status";
  statusEl.textContent = "Отправляю…";
  submitBtn.disabled = true;
  submitBtn.textContent = "Отправляю…";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("fail");

    form.hidden = true;
    if (navActions) navActions.hidden = true;
    if (formNote) formNote.hidden = true;
    successScreen.hidden = false;
    statusEl.hidden = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    statusEl.hidden = false;
    statusEl.className = "status status-error";
    statusEl.textContent =
      "Не удалось отправить. Проверьте интернет и попробуйте ещё раз.";
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить бриф";
  }
});

updateUI();
