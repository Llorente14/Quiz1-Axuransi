//Script ini berisi global function yang sering dipakai

//Mengambil user dari localStorage
export function getParsedUser() {
  const userData = JSON.parse(localStorage.getItem("user"));
  return userData;
}

//Menghapus localstorage User
export function logout() {
  localStorage.removeItem("user");
  window.location.href = "/index.html";
}

export function isAuthenticated() {
  const user = getParsedUser();

  // Jika tidak ada data user di localStorage
  if (!user) {
    alert("Anda harus login terlebih dahulu untuk mengakses halaman ini.");

    window.location.href = "/pages/login.html";
  }
}
