const backendURL = 'https://biwbongbackend.onrender.com'; // เปลี่ยน URL ตาม backend ของคุณ

// ✅ Login (ใช้ใน login.html)
async function login(username, password) {
  const res = await fetch(`${backendURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // สำคัญมาก
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
  }

  return data;
}

// ✅ Register (ใช้ใน register.html)
async function register(username, name, password) {
  const res = await fetch(`${backendURL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, name, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'สมัครสมาชิกไม่สำเร็จ');
  }

  return data;
}

// ✅ Logout (ใช้ในทุกหน้าที่มีปุ่มออกจากระบบ)
async function logout() {
  const res = await fetch(`${backendURL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'ออกจากระบบไม่สำเร็จ');
  }

  return data;
}

// ✅ ดึงข้อมูลโปรไฟล์ (เช่นชื่อจริง, ใช้แสดงใน dashboard)
async function fetchUserProfile() {
  const res = await fetch(`${backendURL}/auth/profile`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'ไม่ได้เข้าสู่ระบบหรือ token หมดอายุ');
  }

  return data.user;
}
