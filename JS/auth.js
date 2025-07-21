// const backendURL = 'https://biwbongbackend.onrender.com';
const backendURL = 'http://localhost:3000';

// ฟังก์ชัน login
async function login(username, password) {
  const res = await fetch(`${backendURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
  }

  return data;
}

// ดึง token จาก cookie (กรณี httpOnly: false เท่านั้น)
function getTokenFromCookie() {
  const cookies = document.cookie.split(';');
  for (const c of cookies) {
    const [key, value] = c.trim().split('=');
    if (key === 'token') return value;
  }
  return null;
}

// logout
async function logout() {
  await fetch(`${backendURL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
}
