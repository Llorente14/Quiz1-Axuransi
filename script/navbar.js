document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.querySelector("header nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      // Toggle the 'active' class on both the nav and the icon
      nav.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });
  }
});
