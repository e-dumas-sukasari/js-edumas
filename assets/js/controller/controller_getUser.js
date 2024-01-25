// Function to make the API request with the token
async function getUserWithToken() {
    const token = getTokenFromCookies('Login'); // Get the token dari cookies via parameter

    if (!token) {
        alert("token tidak ditemukan");
        return;
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
        const response = await fetch(targetURL, requestOptions);
        const data = await response.json();

        if (data.status === true) {
            displayUserData(data.data);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

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
function displayUserData(userData) {
    const userDataBody = document.getElementById('UserDataBody');

    userDataBody.innerHTML = ''; // Clear existing rows

    if (userData && userData.length > 0) {
        userData.forEach(user => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${user.username}</td>
                <td>${user.password}</td>
                <td>${user.notelp}</td>
                <td>${user.role}</td>
                <td>
                    <button class="bg-blue-500 p-2 text-white hover:shadow-lg text-xs font-thin" onclick="editUser('${user.npm}')">Edit</button>
                    <button class="bg-red-500 p-2 text-white hover:shadow-lg text-xs font-thin" onclick="deleteUser('${user.npm}')">Delete</button>
                </td>
            `;
            userDataBody.appendChild(newRow);
        });
    } else {
        userDataBody.innerHTML = '<tr><td colspan="8">No user data found.</td></tr>';
    }
}

// Function to handle editing a user
function editUser(npm) {
    // You can implement the logic to open an edit modal or navigate to an edit page with the user npm
    alert(`Edit user with npm: ${npm}`);
}

// Function to handle deleting a user
function deleteUser(npm) {
    // You can implement the logic to confirm deletion and make an API request to delete the user
    const confirmed = confirm(`Are you sure you want to delete user with npm: ${npm}?`);

    if (confirmed) {
        // Call a function to delete the user (implement this function)
        deleteUserApiFunction(npm);
    }
}

// Function to make an API request to delete a user
async function deleteUserApiFunction(npm) {
    const token = getTokenFromCookies('Login');

    if (!token) {
        alert("Token not found");
        return;
    }

    const targetURL = `https://your-api-endpoint/deleteuser?npm=${npm}`;

    const myHeaders = new Headers();
    myHeaders.append('Login', token);

    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(targetURL, requestOptions);
        const data = await response.json();

        if (data.status === true) {
            // Reload the user data after deletion
            getUserWithToken();
            alert('User deleted successfully');
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


getUserWithToken();