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
  
  const updateUser = async (event) => {
    event.preventDefault()
  
    const token = getTokenFromCookies('Login')
  
    if (!token) {
        showUpdateAlert('Anda Belum Login', 'error')
        return
    }
  
    const targetURL = 'https://asia-southeast2-gisiqbal.cloudfunctions.net/Update-User'
  
    const myHeaders = new Headers()
    myHeaders.append('Login', token)
    myHeaders.append('Content-Type', 'application/json')
  
    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify({
        username: parseInt(document.getElementById('Username').value),
        password: document.getElementById('Password').value,
        notelp: document.getElementById('Notelp').value,
      }),
      redirect: 'follow',
    }
  
    try {
      const response = await fetch(targetURL, requestOptions)
      const data = await response.json()
  
      if (response.ok) {
        showUpdateAlert('Berhasil Update Data', 'success')
        window.location.href = 'registrasi.html'
      } else {
        showUpdateAlert(data.message || 'Error updating data', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      showUpdateAlert('Error updating data', 'error')
    }
  }

  document.getElementById('updateForm').addEventListener('submit', updateUser)

  // Fetch data from the API using a GET request
  const apiUrl = 'https://asia-southeast2-gisiqbal.cloudfunctions.net/GetOneUser';
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('_id');
  
  // Check if the userId is available
  if (userId) {
    const fullApiUrl = `${apiUrl}?_id=${userId}`;
    console.log('Full API URL:', fullApiUrl);

    fetch(fullApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data);
  
            const userData = data.datas[0];
  
            document.getElementById('Username').value = userData.username;
            document.getElementById('Password').value = userData.password;
            document.getElementById('Notelp').value = userData.notelp;

  
            // Show the update form
            document.getElementById('updateForm').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
  }


  

  