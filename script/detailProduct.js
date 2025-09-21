import { getParsedUser, isAuthenticated } from "./global.js";

//Mengambil komponen navbar
const navNotAuth = document.querySelector(".notAuth");
const navProfile = document.querySelector(".profile");

//Mendapat user yang sudah login
document.addEventListener("DOMContentLoaded", () => {
  isAuthenticated();
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
  } else {
    alert("Anda harus login terlebih dahulu untuk mengakses halaman ini.");

    window.location.href = "/pages/login.html";
  }
});

//Library function untuk detail Product
//Update Data Kendaraan
function updateVehicleInfoFromLocalStorage() {
  const savedVehicleInfo = localStorage.getItem("vehicleInfo");
  if (savedVehicleInfo) {
    document.querySelector(".sub-info").textContent = savedVehicleInfo;
  }
}

//Update harga premi
function updatePriceFromLocalStorage() {
  const savedPremi = localStorage.getItem("hargaPremi");
  const formattedPremi = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(savedPremi));
  document.querySelector(".price").textContent = formattedPremi;
}

window.addEventListener("load", () => {
  updatePriceFromLocalStorage();
  updateVehicleInfoFromLocalStorage();
});
