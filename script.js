const range = document.getElementById("design-range");
const value = document.getElementById("design-value");

if (range && value) {
  const sync = () => {
    value.textContent = range.value;
  };
  range.addEventListener("input", sync);
  sync();
}
