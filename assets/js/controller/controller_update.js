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

document.getElementById('updateForm').addEventListener('submit', updateReport);

// Fetch data from the API using a GET request
const apiUrl = 'https://asia-southeast2-gisiqbal.cloudfunctions.net/GetOneReport';
const params = new URLSearchParams(window.location.search);
const reportId = params.get('_id');

// Check if the reportId is available
if (reportId) {
  const fullApiUrl = `${apiUrl}?_id=${reportId}`;
  console.log('Full API URL:', fullApiUrl);

  fetch(fullApiUrl)
      .then(response => response.json())
      .then(data => {
          console.log('API Response:', data);

          const reportData = data.data[0];

          document.getElementById('NikInput').value = reportData.nik;
          document.getElementById('NamaInput').value = reportData.nama;
          document.getElementById('TitleInput').value = reportData.title;
          document.getElementById('DescriptionInput').value = reportData.description;
          document.getElementById('DateOccurredInput').value = reportData.dateOccurred;
          document.getElementById('ImageInput').value = reportData.image;
          document.getElementById('StatusInput').value = reportData.status;
          document.getElementById('Tanggapan').value = '';

          // Show the update form
          document.getElementById('updateForm').style.display = 'block';
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
}