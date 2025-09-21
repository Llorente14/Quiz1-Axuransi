import { getParsedUser } from "./global.js";
//Komponen Toggle Panel
const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");
//Komponen Signup dan login
const regForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const regEmailInput = document.getElementById("email");
const regUsernameInput = document.getElementById("username");
const regnoTelpInput = document.getElementById("noTelp");
const regPasswordInput = document.getElementById("password");
const regcPasswordInput = document.getElementById("cpassword");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const errMsg = document.getElementById("errMsg");
const errMsgLogin = document.getElementById("errMsgLogin");

//Animation Switch antara login dan sign up
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

//Proses Membuat Akun Baru (Sign up)
regForm.addEventListener("submit", (e) => {
  //Array menampung error, hanya error pertama yang akan ada teks
  let errors = [];

  //Validasi data sesuai input form signup
  errors = regValidateData(
    regUsernameInput.value,
    regEmailInput.value,
    regnoTelpInput.value,
    regPasswordInput.value,
    regcPasswordInput.value
  );

  if (errors.length > 0) {
    e.preventDefault();
    errMsg.innerText = errors[0];
  } else {
    e.preventDefault();
    const newUser = {
      username: regUsernameInput.value,
      email: regEmailInput.value,
      noTelp: regnoTelpInput.value,
      password: regPasswordInput.value,
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    window.location.href = "login.html";
  }
});

//Proses Login ke Akun yang sudah ada (Login)
loginForm.addEventListener("submit", (e) => {
  let errors = [];
  console.log("keklik");
  errors = loginValidateData(loginEmail.value, loginPassword.value);

  if (errors.length > 0) {
    e.preventDefault();
    errMsgLogin.innerText = errors[0];
  } else {
    e.preventDefault();
    let parsedUser = getParsedUser();
    localStorage.setItem("user", JSON.stringify(parsedUser));
    window.location.href = "/index.html";
  }
});

//Clear error message
const allInputs = [
  regUsernameInput,
  regEmailInput,
  regnoTelpInput,
  regPasswordInput,
  regcPasswordInput,
  loginEmail,
  loginPassword,
];

allInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.parentElement.classList.contains("incorrect")) {
      input.parentElement.classList.remove("incorrect");
      errMsg.innerText = "";
      errMsgLogin.innerText = "";
    }
  });
});

//Function library untuk Sign up
function regValidateData(username, email, noTelp, password, cpassword) {
  let errorArray = [];

  if (username.length < 3) {
    errorArray.push("Nama lengkap minimal 3 karakter");
    regUsernameInput.parentElement.classList.add("incorrect");
  }
  if (username.length > 32) {
    errorArray.push("Nama lengkap maksimal 32 karakter");
    regUsernameInput.parentElement.classList.add("incorrect");
  }
  //Ini regex dipelajari dari w3schools
  if (/\d/.test(username)) {
    errorArray.push("Nama lengkap tidak boleh mengandung angka");
    regUsernameInput.parentElement.classList.add("incorrect");
  }

  if (email.length < 0 || email === "") {
    errorArray.push("Email Wajib Diisi dan sesuai format");
    regEmailInput.parentElement.classList.add("incorrect");
  }

  if (!/^\d+$/.test(noTelp)) {
    errorArray.push("Nomor telepon hanya boleh berisi angka");
    regnoTelpInput.parentElement.classList.add("incorrect");
  }
  if (noTelp.length < 10) {
    errorArray.push("Nomor handphone minimal 10 angka");
    regnoTelpInput.parentElement.classList.add("incorrect");
  }
  if (noTelp.length > 16) {
    errorArray.push("Nomor handphone maksimal 16 angka");
    regnoTelpInput.parentElement.classList.add("incorrect");
  }
  if (!noTelp.startsWith("08")) {
    errorArray.push("Nomor telepon harus berawalan 08xxx");
    regnoTelpInput.parentElement.classList.add("incorrect");
  }

  // Validasi Password (index 3)
  if (password.length < 8) {
    errorArray.push("Kata sandi minimal 8 karakter");
    regPasswordInput.parentElement.classList.add("incorrect");
  }

  // Validasi Konfirmasi Password (index 4)
  if (password !== cpassword) {
    errorArray.push("Konfirmasi kata sandi tidak sesuai");
    regPasswordInput.parentElement.classList.add("incorrect");
    regcPasswordInput.parentElement.classList.add("incorrect");
  }

  return errorArray;
}

//Function Library untuk Login
function loginValidateData(email, password) {
  let errorArray = [];

  const storedUser = getParsedUser(); // Ambil data user sekali saja

  // PERBAIKAN 1: Cek dulu apakah ada user di local storage
  if (!storedUser) {
    errorArray.push("Tidak ada akun yang terdaftar.");
    loginEmail.parentElement.classList.add("incorrect");
    loginPassword.parentElement.classList.add("incorrect");
    return errorArray;
  }
  if (email !== getParsedUser().email) {
    errorArray.push("Kredensial yang Anda masukkan tidak valid");
    loginEmail.parentElement.classList.add("incorrect");
  }
  if (password !== getParsedUser().password) {
    errorArray.push("Kredensial yang Anda masukkan tidak valid");
    loginPassword.parentElement.classList.add("incorrect");
  }
  return errorArray;
}
