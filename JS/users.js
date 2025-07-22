import { formatDateThai } from './utils.js'; // ต้องใช้ <script type="module">

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
          <td>${index + 1}</td>
          <td data-label="UsersId">${e.UserId}</td>
          <td data-label="Username">${e.username || '-'}</td>
          <td data-label="ชื่อ">${e.name || '-'}</td>
          <td data-label="วันที่สร้างบัญชี">${e.Created_At ? formatDateThai(e.Created_At) : '-'}</td>
          <td data-label="วันที่แก้ไข" >${e.Update_At ? formatDateThai(e.Update_At) : '-'}</td>
          <td data-label="จัดการ">
            <button onclick="edituser('${e.UserId}')">แก้ไข</button>
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
