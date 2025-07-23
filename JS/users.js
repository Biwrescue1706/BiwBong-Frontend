import { formatDateThai } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadNavbar();
  await loadUsers();

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

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'เพิ่มสมาชิกสำเร็จเรียบร้อยแล้ว',
          timer: 1500,
          showConfirmButton: false,
        });
        loadUsers();
      } else {
        const errorData = await res.json();
        Swal.fire({
          icon: 'error',
          title: 'เพิ่มสมาชิกไม่สำเร็จ',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
      });
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

    users.forEach((user, index) => {
      tbody.innerHTML += `
        <tr>
          <td data-label="ลำดับ">${index + 1}</td>
          <td data-label="UserId">${user.UserId}</td>
          <td data-label="Username">${user.username || '-'}</td>
          <td data-label="ชื่อ">${user.name || '-'}</td>
          <td data-label="วันที่สร้าง">${user.Created_At ? formatDateThai(user.Created_At) : '-'}</td>
          <td data-label="วันที่แก้ไข">${user.Update_At ? formatDateThai(user.Update_At) : '-'}</td>
          <td data-label="แก้ไข">
            <button class="editUser" onclick="editUser('${user.UserId}', '${escapeQuotes(user.username)}', '${escapeQuotes(user.name)}')">แก้ไข</button>
           </td>
           <td data-label="ลบ">
            <button class="deleteUser" onclick="deleteUser('${user.UserId}')">ลบ</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
    });
  }
}

// ฟังก์ชันช่วย escape ' และ " ในชื่อ เพื่อไม่ให้เกิด syntax error
function escapeQuotes(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// ฟังก์ชันแก้ไขผู้ใช้
window.editUser = async (id, oldUsername, oldName) => {
  const { value: formValues } = await Swal.fire({
    title: 'แก้ไขผู้ใช้',
    html:
      `<input id="edit-username" class="swal2-input" value="${oldUsername}" placeholder="Username">` +
      `<input id="edit-name" class="swal2-input" value="${oldName}" placeholder="ชื่อจริง">` +
      `<input id="edit-password" type="password" class="swal2-input" placeholder="รหัสผ่านใหม่ (ถ้าจะเปลี่ยน)">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'บันทึก',
    cancelButtonText: 'ยกเลิก',
    preConfirm: () => {
      const username = document.getElementById('edit-username').value.trim();
      const name = document.getElementById('edit-name').value.trim();
      const password = document.getElementById('edit-password').value.trim();

      if (username === oldUsername && name === oldName && !password) {
        Swal.showValidationMessage('คุณยังไม่ได้เปลี่ยนข้อมูลใด ๆ');
        return false;
      }

      const updateData = {};
      if (username !== oldUsername) updateData.username = username;
      if (name !== oldName) updateData.name = name;
      if (password) updateData.password = password;
      return updateData;
    }
  });

  if (!formValues) return;

  try {
    const res = await fetch(`${backendURL}/users/getall/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formValues)
    });

    if (!res.ok) throw new Error('แก้ไขไม่สำเร็จ');
    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'ข้อมูลถูกอัปเดตแล้ว',
        timer: 1500,
        showConfirmButton: false,
      });
      loadUsers();
    } else {
      const errorData = await res.json();
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ถูกอัปเดต',
      });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: errorData.message,
    });
  }
};

// ฟังก์ชันลบผู้ใช้
window.deleteUser = async (id) => {
  const confirm = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบผู้ใช้นี้จริงหรือ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ใช่',
    cancelButtonText: 'ยกเลิก'
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(`${backendURL}/users/getall/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) throw new Error('ลบไม่สำเร็จ');

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'ลบผู้ใช้สำเร็จ',
        timer: 1500,
        showConfirmButton: false,
      });
      loadUsers();
    } else {
      const errorData = await res.json();
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: errorData.message || 'ไม่สามารถลบผู้ใช้ได้',
      });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: errorData.message,
    });

  }
};
