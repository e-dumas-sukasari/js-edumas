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
  
  const getAllReport = async () => {
    const token = getTokenFromCookies('Login')
  
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Error',
        text: 'You are not logged in.',
      }).then(() => {
        window.location.href = 'https://e-dumas-sukasari.my.id/sign/login'
      })
      return
    }
  
    const targetURL = 'https://asia-southeast2-gisiqbal.cloudfunctions.net/GetAll-Reports'
  
    const myHeaders = new Headers()
    myHeaders.append('Login', token)
  
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
  
    try {
      const response = await fetch(targetURL, requestOptions)
      const data = await response.json()
  
      if (data.status === true) {
        displayReportData(data.data, 'ReportDataBody')
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message,
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  const deleteReport = async (nik) => {
    const token = getTokenFromCookies('Login')
  
    if (!token) {
      showAlert('Header Login Not Found', 'error')
      return
    }
  
    const targetURL = 'https://asia-southeast2-gisiqbal.cloudfunctions.net/Delete-Report'
  
    const myHeaders = new Headers()
    myHeaders.append('Login', token)
    myHeaders.append('Content-Type', 'application/json')
  
    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: JSON.stringify({ nik: nik }),
      redirect: 'follow',
    }
  
    try {
      const response = await fetch(targetURL, requestOptions)
      const data = await response.json()
  
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Report deleted successfully!',
        }).then(() => {
          getAllReport()
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message,
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  // Function to handle the delete confirmation
  const deleteReportHandler = (nik) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReport(nik)
      }
    })
  }
  
  const editReport = (_id) => {
    window.location.href = `formedit_report.html?_id=${_id}`
  }
  // Event listener to handle clicks on the table
  document.getElementById('ReportDataBody').addEventListener('click', (event) => {
    const target = event.target
    if (target.classList.contains('edit-link')) {
      const _id = (target.getAttribute('data-_id'))
      editReport(_id)
    } else if (target.classList.contains('delete-link')) {
      const nik = parseInt(target.getAttribute('data-nik'))
      deleteReportHandler(nik)
    }
  })
  
  const displayReportData = (reportData, tableBodyId) => {
    const reportDataBody = document.getElementById(tableBodyId)
  
    reportDataBody.innerHTML = ''
  
    if (reportData && reportData.length > 0) {
      reportData.forEach((item) => {
        const newRow = document.createElement('tr')
        newRow.innerHTML = `
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">${item.nik}</td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">${item.nama}</td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">${item.title}</td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">${item.description}</td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">${item.dateOccurred}</td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
          <img src="${item.image}" alt="Report Image" style="max-width: 100px; max-height: 100px;">
          </td>
          <td class="px-4 py-3">${item.status ? 'Selesai' : 'Proses'}</td>
          <td class="px-4 py-3">
            <a href="#" class="edit-link" data-_id="${item._id}">Tanggapan</a>
            <a href="#" class="delete-link" data-nik="${item.nik}">Delete</a>
          </td>
        `
  
        reportDataBody.appendChild(newRow)
      })
    } else {
      reportDataBody.innerHTML = `<tr><td colspan="6">No report data found.</td></tr>`
    }
  }
  
  // Initial fetch of all report
  getAllReport()
  