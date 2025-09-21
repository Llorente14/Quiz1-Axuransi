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

//Membuat dropdown manual
document.addEventListener("DOMContentLoaded", function () {
  const paymentHeaders = document.querySelectorAll(".payment-method-header");
  //Inisiasi confirm button
  const confirmButton = document.querySelector(".btn-confirm");
  paymentHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const currentMethod = this.parentElement;
      const currentBody = this.nextElementSibling;
      const caret = this.querySelector(".caret-icon");

      // Cek apakah item yang diklik saat ini aktif
      const isActive = currentMethod.classList.contains("active");

      // 1. Tutup semua accordion yang terbuka
      paymentHeaders.forEach((h) => {
        const method = h.parentElement;
        const body = h.nextElementSibling;

        // Hanya tutup jika itu bukan item yang sedang diklik
        if (method !== currentMethod) {
          method.classList.remove("active");
          body.classList.remove("active");
          body.style.maxHeight = null; // Reset height
          h.querySelector(".caret-icon").classList.remove("open");
          h.setAttribute("aria-expanded", "false");
        }
      });

      // 2. Buka atau tutup item yang diklik
      if (!isActive) {
        // Jika belum aktif -> Buka
        currentMethod.classList.add("active");
        currentBody.classList.add("active");
        caret.classList.add("open");
        this.setAttribute("aria-expanded", "true");
        // Atur maxHeight sesuai dengan tinggi kontennya
        currentBody.style.maxHeight = currentBody.scrollHeight + "px";
      } else {
        // Jika sudah aktif -> Tutup
        currentMethod.classList.remove("active");
        currentBody.classList.remove("active");
        caret.classList.remove("open");
        this.setAttribute("aria-expanded", "false");
        currentBody.style.maxHeight = null; // Reset height
      }
    });
  });

  if (confirmButton) {
    // Ketika tombol diklik, jalankan fungsi handlePurchase
    confirmButton.addEventListener("click", handlePurchase);
  }
});

//Library function untuk detail Product
//Update Data Kendaraan
function updateVehicleInfoFromLocalStorage() {
  const savedVehicleInfo = localStorage.getItem("vehicleInfo");
  const selectedProduct = localStorage.getItem("selectedProduct");
  const selectedCategory = localStorage.getItem("selectedCategory");
  if (savedVehicleInfo && selectedCategory == "Asuransi Mobil") {
    document.querySelector(".sub-info").textContent = savedVehicleInfo;
  } else {
    document.querySelector(".sub-info").parentElement.innerHTML = "";
  }
  if (selectedProduct) {
    document.querySelector(".merk").textContent = selectedProduct;
  }
  if (selectedCategory) {
    document.querySelector(".category").textContent = selectedCategory;
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

//Menjelankan function untuk mmebuat history baru
function handlePurchase() {
  // 1. Dapatkan ID baru
  const newId = generateNewHistoryId();
  // 2. Kumpulkan semua data transaksi
  const historyData = collectTransactionData(newId);
  // 3. Simpan data ke localStorage
  saveHistoryToLocalStorage(historyData);
  // 4. Beri tahu pengguna
  alert(
    `Pembelian berhasil dicatat! Lanjutkan ke pembayaran.\nID Transaksi: ${newId}`
  );
  //5. Pindah halaman ke history dan hapus data cart product
  removeSelectedProduct();
  window.location.href = `./histori.html`;
}

//Counter untuk tiap history
function generateNewHistoryId() {
  // Ambil counter saat ini, atau mulai dari 0 jika belum ada.
  let historyCounter = parseInt(localStorage.getItem("historyCounter") || "0");
  const newId = historyCounter + 1;
  // Perbarui counter di localStorage untuk transaksi berikutnya.
  localStorage.setItem("historyCounter", newId);
  return newId;
}

//Membuat localStorage dari sebuah sesi pembelian asuransi
function collectTransactionData(id) {
  const kategori =
    localStorage.getItem("selectedCategory") || "Kategori Tidak Ditemukan";
  const produk =
    localStorage.getItem("selectedProduct") || "Produk Tidak Ditemukan";
  const premi = localStorage.getItem("hargaPremi") || "0";

  // Buat tanggal pembelian hari ini dengan format Indonesia.
  const tanggalPembelian = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const status = getPaymentStatus();

  // Kembalikan sebagai satu objek yang terstruktur.
  return {
    id: id,
    kategoriAsuransi: kategori,
    namaProduk: produk,
    hargaPremi: parseFloat(premi),
    tanggalPembelian: tanggalPembelian,
    statusPembayaran: status,
  };
}

//Menyimpan data pembelian kedalam history dilocalstorage
function saveHistoryToLocalStorage(historyData) {
  if (!historyData || !historyData.id) {
    console.error("Gagal menyimpan: Data histori tidak valid.");
    return;
  }
  const historyKey = `history${historyData.id}`;
  localStorage.setItem(historyKey, JSON.stringify(historyData));
  console.log(
    "Data tersimpan di localStorage dengan key:",
    historyKey,
    historyData
  );
}

//Membuat validasi untuk status pembayaran
function getPaymentStatus() {
  // Ambil nilai dari setiap input relevan
  const bankSelection = document.getElementById("bank-select").value;
  const cardNumber = document.getElementById("card-number").value.trim();
  const cardName = document.getElementById("card-name").value.trim();

  // Kondisi 1: Jika pengguna memilih bank dari dropdown (bukan opsi default)
  if (bankSelection && bankSelection !== "-- Pilih Bank --") {
    return "Lunas";
  }

  // Kondisi 2: Jika pengguna mengisi kedua field kartu kredit
  if (cardNumber !== "" && cardName !== "") {
    return "Lunas";
  }

  // Jika tidak ada kondisi yang terpenuhi, kembalikan status default
  return "Menunggu Pembayaran";
}

function removeSelectedProduct() {
  localStorage.removeItem("hargaPremi");
  localStorage.removeItem("selectedCategory");
  localStorage.removeItem("selectedProduct");
  localStorage.removeItem("vehicleInfo");
}

window.addEventListener("load", () => {
  updatePriceFromLocalStorage();
  updateVehicleInfoFromLocalStorage();
});
