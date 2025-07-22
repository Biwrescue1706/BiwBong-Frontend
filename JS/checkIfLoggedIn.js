document.addEventListener('DOMContentLoaded', async () => {
  try {
    const user = await fetchUserProfile(); // จาก auth.js
    if (user && user.Username) {
      // ถ้า login อยู่แล้ว ห้ามเข้า index.html → redirect ไป dashboard
      window.location.href = 'dashboard.html';
    }
  } catch (error) {
    // ยังไม่ login ก็อยู่ในหน้า index.html ได้
    console.log('ยังไม่ได้ login');
  }
});
