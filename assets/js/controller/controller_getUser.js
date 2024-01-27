// Function to extract the token from cookies
function getTokenFromCookies(cookieName) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
            return value;
        }
    }
    return null;
}

const getUserWithToken = async () => {
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

    const targetURL = 'https://asia-southeast2-gisiqbal.cloudfunctions.net/GetAll-DataUser';

    // Set up headers with the token
    const myHeaders = new Headers();
    myHeaders.append('Login', token);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

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



// // Function to display user data in the table
// function displayUserData(userData) {
//     const userDataBody = document.getElementById('userDataBody');

//     if (userData && userData.length > 0) {
//         userData.forEach(user => {
//             const newRow = document.createElement('tr');
//             newRow.innerHTML = `
//                 <td>${user.usernameid}</td>
//                 <td>${user.username}</td>
//                 <td>${user.npm}</td>
//                 <td>${user.password}</td>
//                 <td>${user.passwordhash}</td>
//                 <td>${user.email}</td>
//                 <td>${user.role}</td>
//             `;
//             userDataBody.appendChild(newRow);
//         });
//     } else {
//         userDataBody.innerHTML = '<tr><td colspan="3">No user data found.</td></tr>';
//     }
// }
// Function to display user data in the table
// function displayUserData(userData) {
//     const userDataBody = document.getElementById('UserDataBody');

//     userDataBody.innerHTML = ''; // Clear existing rows

//     if (userData && userData.length > 0) {
//         userData.forEach(user => {
//             const newRow = document.createElement('tr');
//             newRow.innerHTML = `
//                 <td>${user.username}</td>
//                 <td>${user.password}</td>
//                 <td>${user.notelp}</td>
//                 <td>${user.role}</td>
//                 <td>
//                     <button class="bg-blue-500 p-2 text-white hover:shadow-lg text-xs font-thin" onclick="editUser('${user.username}')">Edit</button>
//                     <button class="bg-red-500 p-2 text-white hover:shadow-lg text-xs font-thin" onclick="deleteUser('${user.username}')">Delete</button>
//                 </td>
//             `;
//             userDataBody.appendChild(newRow);
//         });
//     } else {
//         userDataBody.innerHTML = '<tr><td colspan="8">No user data found.</td></tr>';
//     }
// }

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
          getAllDelete()
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
  
  const editUser = (username) => {
    window.location.href = `formedit_user.html?username=${username}`
  }
  // Event listener to handle clicks on the table
  document.getElementById('UserDataBody').addEventListener('click', (event) => {
    const target = event.target
    if (target.classList.contains('edit-link')) {
      const username = parseInt(target.getAttribute('data-username'))
      editUser(username)
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

            <a href="#" class="edit-link" data-username="${item.username}">Edit</a>
            <a href="#" class="delete-link" data-username="${item.username}">Delete</a>
          </td>
        `
  
        userDataBody.appendChild(newRow)
      })
    } else {
      userDataBody.innerHTML = `<tr><td colspan="6">No user data found.</td></tr>`
    }
  }


getUserWithToken();