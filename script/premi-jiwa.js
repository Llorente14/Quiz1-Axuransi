import { getParsedUser, logout } from "./global.js";

const navNotAuth = document.querySelector(".notAuth");
const navProfile = document.querySelector(".profile");
const form = document.getElementById("premi-jiwa-form");
const productCards = document.querySelectorAll(".product-card");
let isPremiCalculated = false;

document.addEventListener("DOMContentLoaded", () => {
  if (getParsedUser()) {
    navNotAuth.style.display = "none";
    navProfile.style.display = "flex";
    navProfile.innerHTML = `<p>Hi, ${
      getParsedUser().username.split(" ")[0]
    }</p><p id="logout">Logout</p>`;
    document.getElementById("logout").addEventListener("click", logout);
  } else {
    alert("Anda harus login terlebih dahulu untuk mengakses halaman ini.");
    window.location.href = "/pages/login.html";
  }

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("tanggal_lahir").setAttribute("max", today);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateLifeInputs()) {
    const premi = calculatePremiFromForm();
    updatePriceOnCards(premi);
    isPremiCalculated = true;
  } else {
    alert("Harap lengkapi semua data untuk menghitung premi.");
  }
});

productCards.forEach((card) => {
  const actionButtons = card.querySelectorAll(".lihat-selengkapnya, .btn");

  actionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const isFormValid = validateLifeInputs();

      if (!isFormValid || !isPremiCalculated) {
        e.preventDefault();
        const alertMessage = !isPremiCalculated
          ? "Harap klik tombol 'Hitung Premi' terlebih dahulu."
          : "Data pada form belum lengkap atau telah diubah. Harap hitung ulang premi.";

        alert(alertMessage);
        form.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        const productName = card
          .querySelector(".name-product")
          .textContent.trim();
        localStorage.setItem("selectedProduct", productName);
        localStorage.setItem("selectedCategory", "Asuransi Jiwa");
      }
    });
  });
});

// Fungsi untuk mengambil semua nilai input dari form asuransi jiwa
function getLifeInputValues() {
  const birthDate = document.getElementById("tanggal_lahir").value;
  const pertanggungan = parseFloat(
    document.getElementById("pertanggungan").value
  );
  return { birthDate, pertanggungan };
}

// Fungsi untuk menghitung usia berdasarkan tanggal lahir
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
}

// Fungsi untuk mendapatkan tarif premi (m) berdasarkan usia
function getPremiumRate(age) {
  if (age <= 30) return 0.002; // 0.2%
  if (age > 30 && age <= 50) return 0.004; // 0.4%
  if (age > 50) return 0.01; // 1%
  return 0;
}

// Fungsi untuk menghitung total premi asuransi jiwa per bulan
function calculateLifePremi(birthDate, t_pertanggungan) {
  const age = calculateAge(birthDate);
  const m_tarif = getPremiumRate(age);
  const premiBulanan = m_tarif * t_pertanggungan;
  return premiBulanan;
}

// Fungsi untuk mengambil data dari form dan memanggil kalkulasi premi
function calculatePremiFromForm() {
  const { birthDate, pertanggungan } = getLifeInputValues();
  return calculateLifePremi(birthDate, pertanggungan);
}

// Fungsi untuk memperbarui tampilan harga pada semua kartu produk
function updatePriceOnCards(premi) {
  const formattedPremi = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(premi);

  productCards.forEach((card) => {
    const priceElement = card.querySelector(".price");
    if (priceElement) {
      priceElement.textContent = formattedPremi;
    }
  });

  localStorage.setItem("hargaPremi", premi);
}

// Fungsi untuk memvalidasi semua input pada form asuransi jiwa
function validateLifeInputs() {
  let allValid = true;
  const inputs = form.querySelectorAll(
    'input[type="text"], input[type="date"], select'
  );

  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      allValid = false;
      input.classList.add("incorrect");
    } else {
      input.classList.remove("incorrect");
    }
  });

  return allValid;
}
