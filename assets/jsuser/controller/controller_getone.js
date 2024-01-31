const getOneReport = async (reportId) => {
  
  
    const targetURL = 'https://asia-southeast2-gisiqbal.cloudfunctions.net/GetOneReport'
  
    const myHeaders = new Headers()
    myHeaders.append('Login', token)
    myHeaders.append('Content-Type', 'application/json')
  
    const requestOptions = {
      method: 'POST', // Menggunakan method POST
      headers: myHeaders,
      body: JSON.stringify({ _id: reportId }), // Mengirimkan ID laporan dalam bentuk JSON
      redirect: 'follow',
    }
  
    try {
      const response = await fetch(targetURL, requestOptions)
      const data = await response.json()
  
      if (data.status === true) {
        displayOneReport(data.data, 'ReportOneDataBody') // Menampilkan satu data laporan
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
  
  const displayOneReport = (reportData, tableBodyId) => {
    const reportDataBody = document.getElementById(tableBodyId)
  
    reportDataBody.innerHTML = ''
  
    if (reportData) {
      const newRow = document.createElement('tr')
      newRow.innerHTML = `
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">${reportData.nik}</td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">${reportData.nama}</td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">${reportData.title}</td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">${reportData.description}</td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">${reportData.dateOccurred}</td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
          <img src="${reportData.image}" alt="Report Image" style="max-width: 100px; max-height: 100px;">
        </td>
        <td class="px-4 py-3">${reportData.status ? 'Selesai' : 'Proses'}</td>
        <td class="px-4 py-3">
          <a href="#" class="edit-link" data-nik="${reportData.nik}">Tanggapan</a>
          <a href="#" class="delete-link" data-nik="${reportData.nik}">Delete</a>
        </td>
      `
  
      reportDataBody.appendChild(newRow)
    } else {
      reportDataBody.innerHTML = `<tr><td colspan="8">No report data found.</td></tr>`
    }
  }
  
  // Panggil fungsi getOneReport dengan ID laporan yang diinginkan
  const reportId = '65b9d865989c71e21f7277ed'
  getOneReport(reportId)
  