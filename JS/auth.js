const backendURL = 'https://biwbongbackend.onrender.com';

// ฟังก์ชัน login
async function login(username, password) {
  const res = await fetch(`${backendURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
  return data;
}

// ฟังก์ชัน register
async function register(username, name, password) {
  const res = await fetch(`${backendURL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, name, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'สมัครสมาชิกไม่สำเร็จ');
  return data;
}

// ฟังก์ชัน logout
async function logout() {
  const res = await fetch(`${backendURL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'ออกจากระบบไม่สำเร็จ');
  return data;
}

// ฟังก์ชันดึงข้อมูลโปรไฟล์
async function fetchUserProfile() {
  const res = await fetch(`${backendURL}/auth/profile`, {
    credentials: 'include',
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || 'Unauthorized');
  }
  const data = await res.json();
  return data.user;
}

// ฟังก์ชันตรวจสอบสถานะ login และ redirect ถ้าไม่ login
async function checkLogin() {
  try {
    const user = await fetchUserProfile();

    const usernameEl = document.getElementById('username');
    if (usernameEl) {
      usernameEl.textContent = user.Username || user.name || 'ไม่มีชื่อ';
    }

    return user;
  } catch (err) {
    console.warn('ยังไม่ได้เข้าสู่ระบบ:', err.message);
    Swal.fire({
      icon: 'error',
      title: 'กรุณาเข้าสู่ระบบก่อนใช้งาน',
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = 'index.html';
    });
    return null;
  }
}