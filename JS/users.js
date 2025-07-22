import { formatDateThai } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadNavbar(); // โหลด navbar

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
          <td data-label="UsersId">${e.UserId}</td>
          <td data-label="Username">${e.username || '-'}</td>
          <td data-label="ชื่อ">${e.name || '-'}</td>
          <td data-label="วันที่สร้างบัญชี">${e.Created_At ? formatDateThai(e.Created_At) : '-'}</td>
          <td data-label="วันที่แก้ไข">${e.Update_At ? formatDateThai(e.Update_At) : '-'}</td>
          <td data-label="จัดการ">
            <button onclick="edituser('${e.UserId}', '${e.username}', '${e.name}')">แก้ไข</button>
            <button onclick="deleteuser('${e.UserId}')">ลบ</button>
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

window.edituser = async function (userId, currentUsername, currentName) {
  const { value: formValues } = await Swal.fire({
    title: 'แก้ไขผู้ใช้',
    html:
      `<input id="swal-username" class="swal2-input" placeholder="Username" value="${currentUsername}">` +
      `<input id="swal-name" class="swal2-input" placeholder="ชื่อ" value="${currentName}">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'บันทึก',
    cancelButtonText: 'ยกเลิก',
    preConfirm: () => {
      return {
        username: document.getElementById('swal-username').value.trim(),
        name: document.getElementById('swal-name').value.trim(),
      };
    }
  });

  if (!formValues) return;

  try {
    const res = await fetch(`${backendURL}/users/getall/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formValues)
    });

    if (!res.ok) throw new Error('ไม่สามารถแก้ไขผู้ใช้ได้');

    Swal.fire('สำเร็จ!', 'แก้ไขข้อมูลผู้ใช้เรียบร้อยแล้ว', 'success').then(() => {
      location.reload();
    });

  } catch (err) {
    console.error(err);
    Swal.fire('ผิดพลาด', err.message, 'error');
  }
};

window.deleteuser = async function (userId) {
  const confirm = await Swal.fire({
    title: 'ยืนยันการลบ?',
    text: `คุณต้องการลบผู้ใช้ ${userId} ใช่หรือไม่?`,
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

    if (!res.ok) throw new Error('ไม่สามารถลบผู้ใช้ได้');

    Swal.fire('ลบแล้ว!', 'ผู้ใช้ถูกลบเรียบร้อยแล้ว', 'success').then(() => {
      location.reload();
    });

  } catch (err) {
    console.error(err);
    Swal.fire('ผิดพลาด', err.message, 'error');
  }
};