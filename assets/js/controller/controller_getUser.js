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

const getAllUser = async () => {
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

  const targetURL = 'https://asia-southeast2-gisiqbal.cloudfunctions.net/GetAll-DataUser'

    // Set up headers with the token
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
      displayUserData(data.data, 'UserDataBody')
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

const deleteUser = async (username) => {
  const token = getTokenFromCookies('Login')

  if (!token) {
    showAlert('Header Login Not Found', 'error')
    return
  }

  const targetURL = 'https://asia-southeast2-gisiqbal.cloudfunctions.net/Delete-User'

  const myHeaders = new Headers()
  myHeaders.append('Login', token)
  myHeaders.append('Content-Type', 'application/json')

  const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: JSON.stringify({ username: username }),
    redirect: 'follow',
  }

  try {
    const response = await fetch(targetURL, requestOptions)
    const data = await response.json()

    if (data.status) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User deleted successfully!',
      }).then(() => {
        getAllUser()
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
const deleteUserHandler = (username) => {
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
      deleteUser(username)
    }
  })
}

const editUser = (_id) => {
  window.location.href = `formedit_user.html?_id=${_id}`
}
// Event listener to handle clicks on the table
document.getElementById('UserDataBody').addEventListener('click', (event) => {
  const target = event.target
  if (target.classList.contains('edit-link')) {
    const _id = parseInt(target.getAttribute('data-_id'))
    editUser(_id)
  } else if (target.classList.contains('delete-link')) {
    const username = parseInt(target.getAttribute('data-username'))
    deleteUserHandler(username)
  }
})

const displayUserData = (userData, tableBodyId) => {
  const userDataBody = document.getElementById(tableBodyId)

  userDataBody.innerHTML = ''

  if (userData && userData.length > 0) {
    userData.forEach((item) => {
      const newRow = document.createElement('tr')
      newRow.innerHTML = `
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">${item.username}</td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">${item.password}</td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">${item.notelp}</td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">${item.role}</td>

          <a href="formedit_user.html?_id=${item._id}" class="edit-link" data-username="${item.username}">Edit</a> 
          <a href="#" class="delete-link" data-username="${item.username}">Delete</a>
        </td>
      `

      userDataBody.appendChild(newRow)
    })
  } else {
    userDataBody.innerHTML = `<tr><td colspan="6">No user data found.</td></tr>`
  }
}


// Initial fetch of all User
getAllUser()