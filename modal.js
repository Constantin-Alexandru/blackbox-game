export function modal_setup(modal, modal_button) {
  modal.classList.add("hidden");

  modal_button.onclick = () => {
    if (modal.classList.contains("hidden")) {
      modal.classList.remove("hidden");
    } else modal.classList.add("hidden");
  };

  window.addEventListener("click", (event) => {
    const modal_rect = modal.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (event.target === modal_button) return;

    if (
      (x < modal_rect.left ||
        x > modal_rect.right ||
        y < modal_rect.top ||
        y > modal_rect.bottom) &&
      !modal.classList.contains("hidden")
    ) {
      modal.classList.add("hidden");
    }
  });
}
