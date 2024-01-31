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
  
  const showUpdateAlert = (message, icon = 'success') => {
    Swal.fire({
      icon: icon,
      text: message,
      showConfirmButton: false,
      timer: 100000,
    }).then(() => {
      window.location.href = 'pengaduan.html'
    })
  }
  
  const searchReportByNik = async () => {
    // Mendapatkan nilai _id dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const nik = urlParams.get('nik');
  
    // Mengambil token dari cookies
    const token = getTokenFromCookies('Login');
  
    if (!token) {
      showUpdateAlert('Anda Belum Login', 'error');
      return;
    }
  
    const targetURL = "https://asia-southeast2-gisiqbal.cloudfunctions.net/GetOneReportByNik?nik" + nik;
  
    const myHeaders = new Headers();
    myHeaders.append('Login', token);
  
    const requestOptions = {
      method: 'GET',  // Menggunakan metode GET
      headers: myHeaders,
      redirect: 'follow',
    };
  
    try {
      const response = await fetch(targetURL, requestOptions);
      const data = await response.json();
  
      if (response.ok) {
        populateUpdateForm(data.data);
      } else {
        showUpdateAlert(data.message || 'Error fetching data', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showUpdateAlert('Error fetching data', 'error');
    }
  };
  
  const populateUpdateForm = (reportData) => {
    const setValue = (id, value) => {
      document.getElementById(id).value = value
    }
  
    setValue('NikInput', reportData.nik)
    setValue('NamaInput', reportData.nama)
    setValue('TitleInput', reportData.title)
    setValue('DescriptionInput', reportData.description)
    setValue('DateOccurredInput', reportData.dateOccurred)
    setValue('ImageInput', reportData.image)
    setValue('StatusInput', reportData.status)
    setValue('Tanggapan', reportData.Tanggapan)
  
    document.getElementById('updateForm').style.display = 'block'
  }
  
  const updateReport = async (event) => {
    event.preventDefault()
  
    const token = getTokenFromCookies('Login')
  
    if (!token) {
      showUpdateAlert('Anda Belum Login', 'error')
      return
    }
  
    const targetURL = 'https://asia-southeast2-gisiqbal.cloudfunctions.net/Update-Report'
  
    const myHeaders = new Headers()
    myHeaders.append('Login', token)
    myHeaders.append('Content-Type', 'application/json')
  
    const statusValue = document.getElementById('StatusInput').value === 'selesai'
  
    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify({
        nik: parseInt(document.getElementById('NikInput').value),
        nama: document.getElementById('NamaInput').value,
        title: document.getElementById('TitleInput').value,
        description: document.getElementById('DescriptionInput').value,
        dateOccurred: document.getElementById('DateOccurredInput').value,
        image: document.getElementById('ImageInput').value,
        status: statusValue,
        tanggapan: document.getElementById('Tanggapan').value,
      }),
      redirect: 'follow',
    }
  
    try {
      const response = await fetch(targetURL, requestOptions)
      const data = await response.json()
  
      if (response.ok) {
        showUpdateAlert('Berhasil Update Data', 'success')
        window.location.href = 'pengaduan.html'
      } else {
        showUpdateAlert(data.message || 'Error updating data', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      showUpdateAlert('Error updating data', 'error')
    }
  }

  document.getElementById('updateForm').addEventListener('submit', updateReport)
  