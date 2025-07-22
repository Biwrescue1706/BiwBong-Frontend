document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const password = e.target.password.value;

  try {
    await login(username, password);

    Swal.fire({
      icon: 'success',
      title: 'เข้าสู่ระบบสำเร็จ',
      timer: 1500,
      showConfirmButton: false,
    });

    // รอ fetchUserProfile ให้เสร็จก่อน
    try {
      const user = await fetchUserProfile();
      console.log('ข้อมูลผู้ใช้:', user);
    } catch (err) {
      console.warn('ดึง profile ไม่สำเร็จ:', err.message);
    }

    setTimeout(() => {
      window.location.href = 'dashboard.html'; // เปลี่ยนเป็นหน้าหลักหลัง login
    }, 1500);

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'เข้าสู่ระบบไม่สำเร็จ',
      text: error.message,
    });
  }
});
