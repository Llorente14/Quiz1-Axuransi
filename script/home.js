import { getParsedUser, logout } from "./global.js";

const navNotAuth = document.querySelector(".notAuth");
const navProfile = document.querySelector(".profile");

document.addEventListener("DOMContentLoaded", () => {
  //Jika user sudah login
  if (getParsedUser()) {
    // alert("Sudah login");
    navNotAuth.style.display = "none";
    navProfile.style.display = "flex";
    navProfile.innerHTML = `<p>Hi, ${
      getParsedUser().username.split(" ")[0]
    }</p><p id="logout">Logout</p>`;
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
      logoutButton.addEventListener("click", logout);
    }
  }
});

document.querySelectorAll(".carousell").forEach((carousel) => {
  const container = carousel.querySelector(".swiper");
  const btnLeft = carousel.querySelector(".left-slider");
  const btnRight = carousel.querySelector(".right-slider");

  const step = 40; // mirip jarak scroll keyboard arrow

  btnRight.addEventListener("mousedown", () => {
    container.scrollBy({ left: step, behavior: "smooth" });
  });

  btnLeft.addEventListener("mousedown", () => {
    container.scrollBy({ left: -step, behavior: "smooth" });
  });
});
