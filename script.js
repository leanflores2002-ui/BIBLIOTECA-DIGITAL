// Referencias principales de la interfaz
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const toast = document.getElementById("toast");

let toastTimer;

// Muestra un toast breve en pantalla
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1400);
}

// Menú hamburguesa para mobile
menuToggle?.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

// Búsqueda: se activa con Enter o botón del formulario
searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = searchInput.value.trim();

  if (!value) {
    showToast("Escribí algo para buscar");
    searchInput.focus();
    return;
  }

  showToast("Buscando libros...");
});

// Cierre de menú al hacer click en un enlace (mobile)
mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
  });
});
