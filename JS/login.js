// ต้องโหลด auth.js ก่อนถึงจะใช้ได้

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const password = e.target.password.value;

  try {
    const data = await login(username, password);

    Swal.fire({
      icon: 'success',
      title: 'เข้าสู่ระบบสำเร็จ',
      timer: 500,
      showConfirmButton: false,
    });

    // ถ้า cookie ไม่ใช่ httpOnly จะอ่านได้ token จาก cookie
    const token = fetchUserProfile();
    console.log('Token จาก cookie:', token);

    // ดึงข้อมูล profile (ถ้า token ถูกต้อง)
    try {
      const user = await fetchUserProfile();
      console.log('ข้อมูลผู้ใช้:', user);
    } catch (err) {
      console.warn('ดึง profile ไม่สำเร็จ:', err.message);
    }

    setTimeout(() => {
      window.location.href = 'dashboard.html'; // เปลี่ยนตามหน้า dashboard
    }, 1500);

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'เข้าสู่ระบบไม่สำเร็จ',
      text: error.message,
    });
  }
});
