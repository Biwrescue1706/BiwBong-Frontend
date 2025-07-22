import { formatDateThai } from './utils.js';
import { backendURL } from './config.js'; // ถ้าแยก backendURL ไว้

document.addEventListener('DOMContentLoaded', async () => {
  await loadNavbar(); // โหลด navbar
  await loadUsers(); // โหลดข้อมูลผู้ใช้

  // ปุ่มเพิ่มสมาชิก
  document.getElementById('addUserBtn').addEventListener('click', async () => {
    const { value: formValues } = await Swal.fire({
      title: 'เพิ่มสมาชิกใหม่',
      html:
        `<input id="reg-username" class="swal2-input" placeholder="Username">` +
        `<input id="reg-name" class="swal2-input" placeholder="ชื่อจริง">` +
        `<input id="reg-password" type="password" class="swal2-input" placeholder="รหัสผ่าน">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'เพิ่มสมาชิก',
      cancelButtonText: 'ยกเลิก',
      preConfirm: () => {
        const username = document.getElementById('reg-username').value.trim();
        const name = document.getElementById('reg-name').value.trim();
        const password = document.getElementById('reg-password').value.trim();

        if (!username || !name || !password) {
          Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบ');
          return false;
        }

        return { username, name, password };
      }
    });

    if (!formValues) return;

    try {
      const res = await fetch(`${backendURL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formValues)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'ไม่สามารถสมัครสมาชิกได้');

      Swal.fire('สำเร็จ!', 'สมัครสมาชิกเรียบร้อยแล้ว', 'success').then(loadUsers);
    } catch (err) {
      console.error(err);
      Swal.fire('ผิดพลาด', err.message, 'error');
    }
  });
});

async function loadUsers() {
  try {
    const res = await fetch(`${backendURL}/users/getall`, {
      credentials: 'include',
    });

    if (!res.ok) throw new Error('โหลดข้อมูลผู้ใช้ล้มเหลว');

    const users = await res.json();
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    users.forEach((e, index) => {
      tbody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${e.UserId}</td>
          <td>${e.username || '-'}</td>
          <td>${e.name || '-'}</td>
          <td>${e.Created_At ? formatDateThai(e.Created_At) : '-'}</td>
          <td>${e.Update_At ? formatDateThai(e.Update_At) : '-'}</td>
          <td>
            <button onclick="editUser('${e.UserId}', '${e.username}', '${e.name}')">แก้ไข</button>
            <button onclick="deleteUser('${e.UserId}')">ลบ</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error(err);
    Swal.fire('เกิดข้อผิดพลาด', err.message, 'error');
  }
}

// ฟังก์ชันแก้ไขผู้ใช้
window.editUser = async (userId, oldUsername, oldName) => {
  const { value: formValues } = await Swal.fire({
    title: 'แก้ไขผู้ใช้',
    html:
      `<input id="edit-username" class="swal2-input" value="${oldUsername}">` +
      `<input id="edit-name" class="swal2-input" value="${oldName}">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'บันทึก',
    cancelButtonText: 'ยกเลิก',
    preConfirm: () => {
      const username = document.getElementById('edit-username').value.trim();
      const name = document.getElementById('edit-name').value.trim();
      if (!username || !name) {
        Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบ');
        return false;
      }
      return { username, name };
    }
  });

  if (!formValues) return;

  try {
    const res = await fetch(`${backendURL}/users/getall/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formValues)
    });

    if (!res.ok) throw new Error('แก้ไขไม่สำเร็จ');

    Swal.fire('สำเร็จ!', 'ข้อมูลถูกอัปเดตแล้ว', 'success').then(loadUsers);
  } catch (err) {
    console.error(err);
    Swal.fire('ผิดพลาด', err.message, 'error');
  }
};

// ฟังก์ชันลบผู้ใช้
window.deleteUser = async (userId) => {
  const confirm = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบผู้ใช้นี้จริงหรือ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ใช่, ลบเลย!',
    cancelButtonText: 'ยกเลิก'
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(`${backendURL}/users/getall/${userId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) throw new Error('ลบไม่สำเร็จ');

    Swal.fire('ลบแล้ว!', 'ผู้ใช้ถูกลบเรียบร้อยแล้ว', 'success').then(loadUsers);
  } catch (err) {
    console.error(err);
    Swal.fire('ผิดพลาด', err.message, 'error');
  }
};