import { formatDateThai } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    await loadNavbar();
    await checkLogin();
    loadBorrowHistory();
});
// ตรวจสอบ login ถ้าไม่ login จะ redirect ไปหน้า login
async function checkLogin() {
    try {
        const user = await fetchUserProfile();

        const usernameEl = document.getElementById('username');
        if (usernameEl) {
            usernameEl.textContent = user.Username || user.name || 'ไม่มีชื่อ';
        }

        return user;

    } catch (err) {
        console.warn('ยังไม่ได้เข้าสู่ระบบ:', err.message);
        Swal.fire({
            icon: 'error',
            title: 'กรุณาเข้าสู่ระบบก่อนใช้งาน',
            timer: 1500,
            showConfirmButton: false,
        }).then(() => {
            window.location.href = 'index.html';
        });
    }
}

async function loadBorrowHistory() {
    try {
        const res = await fetch(`${backendURL}/borrows/getall`, {
            credentials: 'include'
        });

        if (!res.ok) throw new Error('โหลดข้อมูลล้มเหลว');

        const { borrows } = await res.json();
        const tbody = document.getElementById('borrowTableBody');
        tbody.innerHTML = '';

        borrows.sort((a, b) => b.BorrowID - a.BorrowID); // เรียงล่าสุดขึ้นก่อน

        borrows.forEach((e, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td data-label="ลำดับ">${index + 1}</td>
        <td data-label="ชื่อคนดำเนินการ">${e.name}</td>
        <td data-label="ชื่อคนยืม">${e.names || '-'}</td>
        <td data-label="รหัสอุปกรณ์" >${e.EquipmentID}</td>
        <td data-label="ชื่ออุปกรณ์">${e.EName}</td>
        <td>${e.Quantity}</td>
        <td>${formatDateThai(e.Date)}</td>
        <td>${e.ReturnDate ? formatDateThai(e.ReturnDate) : '-'}</td>
        <td>
          ${e.Returned ? '<span class="returned">คืนแล้ว</span>' : '<span class="not-returned">ยังไม่คืน</span>'}
        </td>
      `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'ไม่สามารถโหลดประวัติการยืมได้',
            text: err.message,
        });
    }
}