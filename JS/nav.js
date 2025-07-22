async function loadNavbar() {
  try {
    const user = await fetchUserProfile(); // รอให้โหลด user ก่อน

    const navHTML = `
      <nav>
        <h1><strong>ยินดีต้อนรับสู่ Dashboard ของ ระบบยืม-คืนอุปกรณ์</strong></h1>
        <h2><strong> สวัสดี, คุณ ${user.name} </strong> </h2> 
        <ul>
          <li><a href="dashboard.html">🏠 ระบบยืมอุปกรณ์</a></li>
          <li><a href="borrow.html">📦 ยืมอุปกรณ์</a></li>
          <li><a href="return.html">🔁 คืนอุปกรณ์</a></li>
          <li><a href="index.html" id="logoutLink">🚪 ออกจากระบบ</a></li>
        </ul>
      </nav>
    `;

    const navbarContainer = document.getElementById('navbar');
    if (navbarContainer) {
      navbarContainer.innerHTML = navHTML;

      const logoutBtn = document.getElementById('logoutLink');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            await logout(); // ใช้จาก auth.js
            Swal.fire({
              icon: 'success',
              title: 'ออกจากระบบสำเร็จ',
              timer: 1000,
              showConfirmButton: false,
            });
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 1000);
          } catch (err) {
            Swal.fire({
              icon: 'error',
              title: 'ไม่สามารถออกจากระบบได้',
              text: err.message,
            });
          }
        });
      }

      // กรอกในหน้า dashboard เพิ่มเติม (ถ้ามี id="welcomeMsg")
      const welcomeMsg = document.getElementById('welcomeMsg');
      if (welcomeMsg) {
        welcomeMsg.textContent = `สวัสดี, คุณ ${user.name}`;
      }
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'กรุณาเข้าสู่ระบบใหม่',
    }).then(() => {
      window.location.href = 'index.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', loadNavbar);
