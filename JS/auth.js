const backendURL = 'https://biwbongbackend.onrender.com'; // เปลี่ยน URL ตามจริง
// const backendURL = 'http://localhost:3000';

// ฟังก์ชัน login (ส่ง username/password)
// backend ต้อง set cookie token httpOnly + SameSite, Secure
async function login(username, password) {
  const res = await fetch(`${backendURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // สำคัญ! ให้ browser ส่ง cookie ไปด้วย
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
  }

  return data;
}

// ฟังก์ชัน logout (เรียก backend เพื่อล้าง cookie)
async function logout() {
  const res = await fetch(`${backendURL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'ออกจากระบบไม่สำเร็จ');
  }
}

// อ่าน token จาก cookie (ถ้า cookie ไม่ใช่ httpOnly ถึงจะอ่านได้)
function getTokenFromCookie() {
  const cookies = document.cookie.split(';');
  for (const c of cookies) {
    const [key, value] = c.trim().split('=');
    if (key === 'token') return decodeURIComponent(value);
  }
  return null;
}

// ฟังก์ชันดึงข้อมูล user profile จาก backend (ใช้ token ใน cookie ส่งไปอัตโนมัติ)
async function fetchUserProfile() {
  const res = await fetch(`${backendURL}/auth/profile`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Token หมดอายุหรือไม่ถูกต้อง');
  }

  const data = await res.json();
  return data.user;
}
