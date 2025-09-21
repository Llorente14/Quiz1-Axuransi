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

function getStatusClass(status) {
  return "status-" + status.toLowerCase().replace(/\s+/g, "-");
}

function formatCurrency(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

function createHistoryCardHTML(data) {
  const statusClass = getStatusClass(data.statusPembayaran);
  const formattedPremi = formatCurrency(data.hargaPremi);

  return `
    <div class="history-card">
      <div class="card-header">
        <h4>${data.kategoriAsuransi}</h4>
        <span class="status ${statusClass}">${data.statusPembayaran}</span>
      </div>
      <div class="card-body">
        <p class="product-name">${data.namaProduk}</p>
        <p class="premi">${formattedPremi}</p>
      </div>
      <div class="card-footer">
        <p class="transaction-id">ID: history${data.id}</p>
        <p class="date">${data.tanggalPembelian}</p>
      </div>
    </div>
  `;
}

function renderAllHistory() {
  const historyContainer = document.querySelector(".history-container");

  // Periksa apakah container ada di halaman
  if (!historyContainer) {
    console.error("Elemen .history-container tidak ditemukan!");
    return;
  }

  // Kosongkan kontainer terlebih dahulu untuk menghindari duplikasi
  historyContainer.innerHTML = "";

  // Ambil total entri histori dari counter
  const historyCount = parseInt(localStorage.getItem("historyCounter") || "0");

  if (historyCount === 0) {
    historyContainer.innerHTML =
      '<p class="no-history">Belum ada riwayat transaksi.</p>';
    return;
  }

  // Loop dari 1 sampai jumlah total histori
  for (let i = 1; i <= historyCount; i++) {
    const key = `history${i}`;
    const dataString = localStorage.getItem(key);

    // Jika data dengan key tersebut ada, proses dan tampilkan
    if (dataString) {
      const data = JSON.parse(dataString);
      const cardHTML = createHistoryCardHTML(data);
      // Tambahkan HTML kartu ke dalam container
      historyContainer.insertAdjacentHTML("beforeend", cardHTML);
    }
  }
}

// Jalankan fungsi utama saat konten halaman selesai dimuat
document.addEventListener("DOMContentLoaded", renderAllHistory);
