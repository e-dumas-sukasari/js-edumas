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
      window.location.href = 'registrasi.html'
    })
  }
  
  const searchnomorByUsername = async (username) => {
    const token = getTokenFromCookies('Login')
  
    if (!token) {
      showUpdateAlert('Anda Belum Login', 'error')
      return
    }
  
    const targetURL = 'https://asia-southeast2-gisiqbal.cloudfunctions.net/Update-User'
  
    const myHeaders = new Headers()
    myHeaders.append('Login', token)
  
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ username: username }),
      redirect: 'follow',
    }
  
    try {
      const response = await fetch(targetURL, requestOptions)
      const data = await response.json()
  
      if (response.ok) {
        populateUpdateForm(data.data)
      } else {
        showUpdateAlert(data.message || 'Error fetching data', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      showUpdateAlert('Error fetching data', 'error')
    }
  }
  
  const populateUpdateForm = (userData) => {
    const setValue = (id, value) => {
      document.getElementById(id).value = value
    }
  
    setValue('Username', userData.username)
    setValue('Password', userData.password)
    setValue('Notelp', userData.notelp)

  
    document.getElementById('updateForm').style.display = 'block'
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
  