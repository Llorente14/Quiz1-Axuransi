import { getParsedUser, isAuthenticated, logout } from "./global.js";

//Mengambil komponen navbar
const navNotAuth = document.querySelector(".notAuth");
const navProfile = document.querySelector(".profile");
//Mengambil komponen form
const form = document.querySelector(".form-box form");
const allInputs = form.querySelectorAll(
  'input[type="text"], input[type="number"]'
);
const fileInputs = form.querySelectorAll('input[type="file"]');
const actionButtons = document.querySelectorAll(".product-actions a");

document.addEventListener("DOMContentLoaded", () => {
  //Cek apakah sudah login atau belum
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

  //Mengatur agar action-product tidak bisa langwsung diakses ketika input belum diisi
  actionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const isFormValid = validateAllInputs();

      if (!isFormValid) {
        e.preventDefault();
        alert(
          "Harap lengkapi semua data kendaraan terlebih dahulu sebelum melanjutkan."
        );
        form.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setPremiKendaraan();
        setInfoKendaraan();
        updatePriceFromLocalStorage();
      }
    });
  });
});

// Fungsionalitas untuk formulir dan kartu produk

const productCards = document.querySelectorAll(".product-card");
// Komponen DOM untuk checkout-btn
const checkoutButtons = document.querySelectorAll(".product-actions .btn");

// Mengelola unggahan dan tampilan gambar di area drag yang ditentukan
document.querySelectorAll(".drag-area").forEach((dragArea) => {
  const fileInput = dragArea.querySelector('input[type="file"]');
  const label = dragArea.querySelector("label.drag-btn");

  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = function (e) {
        dragArea.innerHTML = `
          <img src="${e.target.result}" alt="Foto" style="max-width: 100%; max-height: 200px; border-radius: 5px;">
          <label for="${fileInput.id}" class="change-btn">Ganti Foto</label>
        `;
      };
      reader.readAsDataURL(file);
    }
  });
});

// Event listener untuk pengiriman formulir
form.addEventListener("submit", function (e) {
  e.preventDefault();
  setPremiKendaraan();
  setInfoKendaraan();
  updatePriceFromLocalStorage();
});

//Fungsi untuk menyimpan nama Produk dan Kategori asuransi mobil
checkoutButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    const card = e.target.closest(".product-card");
    const productName = card.querySelector(".name-product").textContent.trim();

    // Simpan informasi ke localStorage
    localStorage.setItem("selectedProduct", productName);

    localStorage.setItem("selectedCategory", "Asuransi Mobil");
  });
});

// Fungsi utilitas untuk detail produk dan local storage
// Validasi input agar user tidak bisa langsung checkout
function validateAllInputs() {
  let allValid = true;

  allInputs.forEach((input) => {
    if (input.value.trim() === "") {
      allValid = false;
      input.classList.add("incorrect");
    } else {
      input.classList.remove("incorrect");
    }
  });

  fileInputs.forEach((fileInput) => {
    if (fileInput.files.length === 0) {
      allValid = false;
    } else {
    }
  });

  return allValid;
}

// Menyimpan premi yang dihitung ke local storage
function setPremiKendaraan() {
  const tahunPembuatan = parseInt(
    document.getElementById("tahun_pembuatan").value
  );
  const hargaMobil = parseFloat(document.getElementById("harga_mobil").value);

  const premi = calculatePremi(tahunPembuatan, hargaMobil);

  localStorage.setItem("hargaPremi", premi);
  return premi;
}

// Menyimpan informasi kendaraan ke local storage
function setInfoKendaraan() {
  const merkMobil = document.getElementById("merk_mobil").value;
  const jenisMobil = document.getElementById("jenis_mobil").value;
  const tahunPembuatan = document.getElementById("tahun_pembuatan").value;

  const vehicleInfo = `${merkMobil}, ${jenisMobil}, ${tahunPembuatan}`;

  localStorage.setItem("vehicleInfo", vehicleInfo);
}

// Menghitung premi asuransi berdasarkan usia dan harga kendaraan
function calculatePremi(tahunPembuatan, hargaMobil) {
  const tahunSaatIni = new Date().getFullYear();
  const umurMobil = tahunSaatIni - tahunPembuatan;

  let premi = 0;

  if (umurMobil >= 0 && umurMobil <= 3) {
    premi = 0.025 * hargaMobil;
  } else if (umurMobil > 3 && umurMobil <= 5) {
    if (hargaMobil < 200000000) {
      premi = 0.04 * hargaMobil;
    } else {
      premi = 0.03 * hargaMobil;
    }
  } else if (umurMobil > 5) {
    premi = 0.05 * hargaMobil;
  }

  return premi;
}

// Mengambil dan memformat premi asuransi dari local storage untuk ditampilkan
function updatePriceFromLocalStorage() {
  const savedPremi = localStorage.getItem("hargaPremi");
  if (savedPremi) {
    const formattedPremi = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(savedPremi));

    productCards.forEach((card) => {
      const priceElement = card.querySelector(".price");
      if (priceElement) {
        priceElement.textContent = formattedPremi;
      }
    });
  }
}

// Berjalan saat halaman dimuat untuk memperbarui info produk dari local storage
window.addEventListener("load", () => {
  updatePriceFromLocalStorage();
});
