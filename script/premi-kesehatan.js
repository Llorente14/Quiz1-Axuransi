import { getParsedUser, logout } from "./global.js";

//Mengambil komponen navbar
const navNotAuth = document.querySelector(".notAuth");
const navProfile = document.querySelector(".profile");
const form = document.getElementById("premi-kesehatan-form");
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
  if (validateHealthInputs()) {
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
      const isFormValid = validateHealthInputs();

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
        localStorage.setItem("selectedCategory", "Asuransi Kesehatan");
      }
    });
  });
});

// Fungsi untuk mengambil semua nilai input dari form
function getHealthInputValues() {
  const birthDate = document.getElementById("tanggal_lahir").value;
  const k1_merokok = parseInt(
    document.querySelector('input[name="merokok"]:checked')?.value || "0"
  );
  const k2_hipertensi = parseInt(
    document.querySelector('input[name="hipertensi"]:checked')?.value || "0"
  );
  const k3_diabetes = parseInt(
    document.querySelector('input[name="diabetes"]:checked')?.value || "0"
  );

  return { birthDate, k1_merokok, k2_hipertensi, k3_diabetes };
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

// Fungsi untuk mendapatkan faktor pengali berdasarkan usia
function getAgeMultiplier(age) {
  if (age <= 20) return 0.1;
  if (age > 20 && age <= 35) return 0.2;
  if (age > 35 && age <= 50) return 0.25;
  if (age > 50) return 0.4;
  return 0;
}

// Fungsi untuk menghitung total premi asuransi kesehatan
function calculateHealthPremi(birthDate, k1, k2, k3) {
  const P = 2000000;
  const age = calculateAge(birthDate);
  const m = getAgeMultiplier(age);
  const premi = P + m * P + k1 * 0.5 * P + k2 * 0.4 * P + k3 * 0.5 * P;
  return premi;
}

// Fungsi untuk mengambil data dari form dan memanggil kalkulasi premi
function calculatePremiFromForm() {
  const { birthDate, k1_merokok, k2_hipertensi, k3_diabetes } =
    getHealthInputValues();
  return calculateHealthPremi(
    birthDate,
    k1_merokok,
    k2_hipertensi,
    k3_diabetes
  );
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

// Fungsi untuk memvalidasi semua input pada form kesehatan
function validateHealthInputs() {
  let allValid = true;
  const textInputs = form.querySelectorAll(
    'input[type="text"], input[type="date"]'
  );

  textInputs.forEach((input) => {
    if (input.value.trim() === "") {
      allValid = false;
      input.classList.add("incorrect");
    } else {
      input.classList.remove("incorrect");
    }
  });

  const radioGroups = form.querySelectorAll(".radio-group");
  radioGroups.forEach((group) => {
    const name = group.querySelector('input[type="radio"]').name;
    if (!form.querySelector(`input[name="${name}"]:checked`)) {
      allValid = false;
      group.classList.add("incorrect-group");
    } else {
      group.classList.remove("incorrect-group");
    }
  });

  return allValid;
}
