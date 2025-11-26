import { Toast } from "bootstrap";

export function showToast(message, type = "success") {
  const container = document.getElementById("toast-area");
  if (!container) return;

  const toastHTML = `
    <div class="toast text-bg-${type} align-items-center border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;

  container.innerHTML = toastHTML;

  const toastEl = container.querySelector(".toast");
  const toast = new Toast(toastEl);
  toast.show();
}
