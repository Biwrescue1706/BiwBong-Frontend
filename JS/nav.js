// nav.js

async function loadNavbar() {
  try {
    const user = await fetchUserProfile(); // ดึงข้อมูล user

    const navHTML = `
      <nav>
        <h1><strong>ยินดีต้อนรับ คุณ ${user.name} สู่ ระบบยืม-คืนอุปกรณ์</strong></h1>
        <div>
          <ul>
            <li><button type="button" class="nav-btn" data-target="dashboard.html">🏠 ระบบยืมอุปกรณ์</button></li>
            <li><button type="button" class="nav-btn" data-target="borrow.html">📦 ยืมอุปกรณ์</button></li>
            <li><button type="button" class="nav-btn" data-target="return.html">🔁 คืนอุปกรณ์</button></li>
            <li><button type="button" class="nav-btn" data-target="profile.html">จัดการ User</button></li>
            <li><button type="button" class="nav-btn" data-target="borrow-history.html">ประวัติการยืม</button></li>
            <li><button type="button" id="logoutBtn">🚪 ออกจากระบบ</button></li>
          </ul>
        </div>
      </nav>
    `;

    const navbarContainer = document.getElementById('navbar');
    if (!navbarContainer) return;

    navbarContainer.innerHTML = navHTML;

    // ผูก event ให้ปุ่มนำทางไปหน้าอื่น
    const navButtons = navbarContainer.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        if (target) window.location.href = target;
      });
    });

    // ปุ่มออกจากระบบ
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await logout(); // ฟังก์ชัน logout จาก auth.js
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

    // ใส่ข้อความต้อนรับ ถ้ามี element id="welcomeMsg"
    const welcomeMsg = document.getElementById('welcomeMsg');
    if (welcomeMsg) {
      welcomeMsg.textContent = `สวัสดี, คุณ ${user.name}`;
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
