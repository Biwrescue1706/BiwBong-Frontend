document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
      await login(username, password);

      // แสดง token ถ้าไม่เป็น httpOnly
      const token = getTokenFromCookie();
      console.log('Token:', token || 'token is httpOnly');

      Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ',
        timer: 200000,
        showConfirmButton: false
      });

      setTimeout(() => {
        window.location.href = 'dashboard.html'; // แก้ชื่อหน้าได้ตามต้องการ
      }, 200000);

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.message
      });
    }
  });
});
