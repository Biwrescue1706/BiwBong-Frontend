const backendURL = 'https://biwbongbackend.onrender.com'; // เปลี่ยนเป็น URL backend ของคุณจริงๆ
// const backendURL = 'http://localhost:3000';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${backendURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // ต้องมีเพื่อส่ง/รับ cookie
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ',
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        window.location.href = 'dashboard.html';  // เปลี่ยนเป็นหน้า dashboard ของคุณ
      }, 1500);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        text: data.message || 'เกิดข้อผิดพลาด'
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: error.message
    });
  }
});
