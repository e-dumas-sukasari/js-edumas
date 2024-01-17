import { deleteCookie } from "https://jscroot.github.io/cookie/croot.js";

function logout() {
  deleteCookie("Login");
  window.location.href = "https://e-dumas-sukasari.my.id/sign/login.html";
}

document.getElementById("logout").addEventListener("click", logout);