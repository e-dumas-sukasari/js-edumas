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
  
  const getAllCatalog = async () => {
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
        displayCatalogData(data.data, 'CatalogDataBody')
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
  
  const deleteCatalog = async (nomorId) => {
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
      body: JSON.stringify({ nomorid: nomorId }),
      redirect: 'follow',
    }
  
    try {
      const response = await fetch(targetURL, requestOptions)
      const data = await response.json()
  
      if (data.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'catalog deleted successfully!',
        }).then(() => {
          getAllEmployees()
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
  const deleteCatalogHandler = (nomorId) => {
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
        deleteCatalog(nomorId)
      }
    })
  }
  
  const editCatalog = (nomorId) => {
    window.location.href = `formedit_catalog.html?nomorid=${nomorId}`
  }
  // Event listener to handle clicks on the table
  document.getElementById('CatalogDataBody').addEventListener('click', (event) => {
    const target = event.target
    if (target.classList.contains('edit-link')) {
      const nomorId = parseInt(target.getAttribute('data-nomorid'))
      editCatalog(nomorId)
    } else if (target.classList.contains('delete-link')) {
      const nomorId = parseInt(target.getAttribute('data-nomorid'))
      deleteCatalogHandler(nomorId)
    }
  })
  
  const displayCatalogData = (catalogData, tableBodyId) => {
    const catalogDataBody = document.getElementById(tableBodyId)
  
    catalogDataBody.innerHTML = ''
  
    if (catalogData && catalogData.length > 0) {
      catalogData.forEach((item) => {
        const newRow = document.createElement('tr')
        newRow.innerHTML = `
          <td class="px-4 py-3">${item.nomorid}</td>
          <td class="px-4 py-3">${item.title}</td>
          <td class="px-4 py-3">${item.description}</td>
          <td class="px-4 py-3">${item.lokasi}</td>
          <td class="px-4 py-3">
            <img src="${item.image}" alt="Catalog Image" style="max-width: 100px; max-height: 100px;">
          </td>
          <td class="px-4 py-3">${item.status ? 'Active' : 'Inactive'}</td>
          <td class="px-4 py-3">
            <a href="#" class="edit-link" data-nomorid="${item.nomorid}">Edit</a>
            <a href="#" class="delete-link" data-nomorid="${item.nomorid}">Delete</a>
          </td>
        `
  
        catalogDataBody.appendChild(newRow)
      })
    } else {
      catalogDataBody.innerHTML = `<tr><td colspan="6">No catalog data found.</td></tr>`
    }
  }
  
  // Initial fetch of all catalogs
  getAllCatalog()
  