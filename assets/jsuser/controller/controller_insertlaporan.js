const getTokenFromCookies = (cookieName) => {
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === cookieName) {
            return value
        }
    }
    return null
  }
  
  const showAlert = (message, type = 'success') => {
    Swal.fire({
        icon: type,
        text: message,
        showConfirmButton: false,
        timer: 1500,
    })
  }
  
  const insertReport = async (event) => {
    event.preventDefault()
  
    const token = getTokenFromCookies('Login')
  
    if (!token) {
        showAlert('Header Login Not Found', 'error')
        return
    }
  
    const targetURL = 'https://asia-southeast2-gisiqbal.cloudfunctions.net/Insert-Report'
  
    const myHeaders = new Headers()
    myHeaders.append('Login', token)
    myHeaders.append('Content-Type', 'application/json')
  
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
            nik: parseInt(document.getElementById('NikInput').value),
            nama: document.getElementById('NamaInput').value,
            title: document.getElementById('TitleInput').value,
            description: document.getElementById('DescriptionInput').value,
            dateOccurred: document.getElementById('DateOccurredInput').value,
            image: document.getElementById('ImageInput').value,

        }),
        redirect: 'follow',
    }
  
    try {
        const response = await fetch(targetURL, requestOptions)
        const data = await response.json()
  
        if (data.status === false) {
            showAlert(data.message, 'error')
        } else {
            showAlert('Report data Report successfully!', 'success')
            window.location.href = 'user.html'
        }
    } catch (error) {
        console.error('Error:', error)
    }
  }
  
  document.getElementById('insertForm').addEventListener('submit', insertReport)
  
  
  
  // // masih error
  
  // import { postWithToken } from "https://jscroot.github.io/api/croot.js";
  // import { GetDataReport } from "../config/config.js";
  // import { UrlSubmitReport, token } from "../template/template.js";
  // import { ResponsePost } from "../config/config.js";
  
  // document.addEventListener("DOMContentLoaded", function () {
  //   const form = document.querySelector("form"); // Sesuaikan dengan struktur HTML Anda
  //   form.addEventListener("submit", function (event) {
  //     event.preventDefault();
  
  //     const data = GetDataReport();
  
  //     // Menggunakan fungsi postWithToken untuk mengirim data ke API dengan token
  //     postWithToken(UrlSubmitReport, 'Authorization', 'Bearer ' + token, data, ResponsePost);
  //   });
  // });
  
  