import { deleteCookie } from "https://jscroot.github.io/cookie/croot.js";

function logout() {
  deleteCookie("Login");
  window.location.href = "https://e-dumas-sukasari.my.id/sign/login_user.html";
}

document.getElementById("logout").addEventListener("click", logout);