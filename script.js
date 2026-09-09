const range = document.getElementById("design-range");
const value = document.getElementById("design-value");
const form = document.getElementById("brief-form");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("form-status");
const successScreen = document.getElementById("success-screen");

if (range && value) {
  const sync = () => {
    value.textContent = range.value;
  };
  range.addEventListener("input", sync);
  sync();
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (statusEl) {
      statusEl.hidden = false;
      statusEl.textContent = "Отправляю…";
      statusEl.className = "status";
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Отправляю…";
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Ошибка отправки");
      }

      form.hidden = true;
      if (successScreen) {
        successScreen.hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent =
          "Не удалось отправить. Проверьте интернет и попробуйте ещё раз.";
        statusEl.className = "status status-error";
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Отправить бриф";
      }
    }
  });
}
