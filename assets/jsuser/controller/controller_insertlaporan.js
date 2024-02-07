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

const showAlert = (message, icon = 'success', callback = null) => {
    Swal.fire({
        icon: icon,
        text: message,
        showConfirmButton: true,
        confirmButtonText: 'OK',
    }).then((result) => {
        if (callback && typeof callback === 'function') {
            callback(result);
        }
    });
}

const insertReport = async (event) => {
    event.preventDefault();

    const token = getTokenFromCookies('Login');

    if (!token) {
        showAlert('Header Login Not Found', 'error');
        return;
    }

    const targetURL = 'https://asia-southeast2-gisiqbal.cloudfunctions.net/Insert-Report';

    const myHeaders = new Headers();
    myHeaders.append('Login', token);
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
            nik: parseInt(document.getElementById('NikInput').value),
            nama: document.getElementById('NamaInput').value,
            title: document.getElementById('TitleInput').value,
            description: document.getElementById('DescriptionInput').value,
            dateOccurred: document.getElementById('DateOccurredInput').value,
            image: document.getElementById('ImageInput').value,
        }),
        redirect: 'follow',
    };

    try {
        const response = await fetch(targetURL, requestOptions);
        const data = await response.json();

        if (data.status === false) {
            showAlert(data.message, 'error');
        } else {
            showAlert('Berhasil melakukan Pengaduan!. Pengaduan anda akan direspon dalam 24 jam kedepan, bila tidak ada kemajuan pada pengaduan anda, anda bisa menghubungi nomor bot whatsapp ini yang terhubung dengan petugas langsung +62 822 555 77 080', 'success', () => {
                window.location.href = 'user.html';
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('insertForm').addEventListener('submit', insertReport);
