import { formatDateThai, loadNavbar } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadNavbar();

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
          <td data-label="ลำดับ">${index + 1}</td>
          <td data-label="UserId">${e.UserId}</td>
          <td data-label="Username">${e.username || '-'}</td>
          <td data-label="ชื่อ">${e.name || '-'}</td>
          <td data-label="วันที่สร้างบัญชี">${e.Created_At ? formatDateThai(e.Created_At) : '-'}</td>
          <td data-label="วันที่แก้ไข">${e.Update_At ? formatDateThai(e.Update_At) : '-'}</td>
          <td data-label="จัดการ">
            <button onclick="editUser('${e.UserId}')">แก้ไข</button>
            <button onclick="deleteUser('${e.UserId}')">ลบ</button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'โหลดข้อมูลผู้ใช้ล้มเหลว',
      text: err.message,
    });
  }
});

// ======= ✏️ แก้ไขผู้ใช้ =======
window.editUser = async (userId) => {
  try {
    const res = await fetch(`${backendURL}/users/getall/${userId}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) throw new Error('โหลดข้อมูลผู้ใช้ไม่สำเร็จ');

    const user = await res.json();

    const { value: formValues } = await Swal.fire({
      title: `แก้ไขผู้ใช้ ID: ${userId}`,
      html: `
        <input id="swal-username" class="swal2-input" placeholder="Username" value="${user.username || ''}">
        <input id="swal-name" class="swal2-input" placeholder="ชื่อ-นามสกุล" value="${user.name || ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      preConfirm: () => {
        return {
          username: document.getElementById('swal-username').value.trim(),
          name: document.getElementById('swal-name').value.trim()
        };
      }
    });

    if (formValues) {
      const updateRes = await fetch(`${backendURL}/users/getall/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (!updateRes.ok) throw new Error('อัปเดตข้อมูลล้มเหลว');

      Swal.fire('สำเร็จ', 'แก้ไขข้อมูลเรียบร้อยแล้ว', 'success');
      location.reload();
    }
  } catch (err) {
    console.error(err);
    Swal.fire('ผิดพลาด', err.message, 'error');
  }
};

// ======= 🗑️ ลบผู้ใช้ =======
window.deleteUser = async (userId) => {
  const confirm = await Swal.fire({
    title: 'ยืนยันการลบ',
    text: `คุณต้องการลบผู้ใช้ ID: ${userId} ใช่หรือไม่?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก'
  });

  if (confirm.isConfirmed) {
    try {
      const res = await fetch(`${backendURL}/users/getall/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('ลบผู้ใช้ไม่สำเร็จ');

      Swal.fire('สำเร็จ', 'ลบผู้ใช้เรียบร้อยแล้ว', 'success');
      location.reload();
    } catch (err) {
      console.error(err);
      Swal.fire('ผิดพลาด', err.message, 'error');
    }
  }
};