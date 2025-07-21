const backendURL = 'https://biwbongbackend.onrender.com';

// Login
async function login(username, password) {
  const res = await fetch(`${backendURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // สำคัญสำหรับ cookie
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

// Register
async function register(username, name, password) {
  const res = await fetch(`${backendURL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, name, password })
  });
  return res.json();
}

// Logout
async function logout() {
  await fetch(`${backendURL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
}

// ดึงข้อมูลผู้ใช้จาก token (ถ้าล็อกอินอยู่)
async function getMe() {
  const res = await fetch(`${backendURL}/auth/me`, {
    method: 'GET',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

// ตัวอย่างการใช้งาน: Login form event listener
document.getElementById('loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const result = await login(username, password);
    if (result.token) {
      alert('เข้าสู่ระบบสำเร็จ');
      window.location.href = 'dashboard.html';  // เปลี่ยนหน้า
    } else {
      alert(result.message || 'เข้าสู่ระบบไม่สำเร็จ');
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
});
