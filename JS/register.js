document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const name = e.target.name.value.trim();
  const password = e.target.password.value;

  try {
    await register(username, name, password);

    Swal.fire({
      icon: 'success',
      title: 'สมัครสมาชิกสำเร็จ',
      text: 'กำลังเข้าสู่ระบบ...',
      timer: 1500,
      showConfirmButton: false
    });

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1600);
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: err.message
    });
  }
});
